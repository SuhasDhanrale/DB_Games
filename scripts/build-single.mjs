import { build } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = resolve(root, 'public');
const output = resolve(root, 'build', 'index.html');
const assets = {};
const pages = {};
const mimeTypes = { '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.svg': 'image/svg+xml' };

// Keep recordings once in the host; every embedded game uses the same assets.
for (const folder of ['audio/music', 'flags']) {
  for (const name of await readdir(resolve(publicDir, folder))) {
    const extension = name.slice(name.lastIndexOf('.'));
    if (!mimeTypes[extension]) continue;
    const path = `${folder}/${name}`;
    assets[path] = `data:${mimeTypes[extension]};base64,${(await readFile(resolve(publicDir, path))).toString('base64')}`;
  }
}

function replaceRequired(code, original, replacement, label) {
  if (!code.includes(original)) throw new Error(`Single-file build: ${label} changed; update its adapter.`);
  return code.replace(original, replacement);
}

function adaptEmbeddedCode(code) {
  return code
    .replace(/(?:window\.)?\blocation\.(href|search|pathname)/g, 'window.DB_BUILD_PAGE_URL.$1')
    // A file opened directly has an opaque origin. The host validates event.source.
    .replace(/},\s*window\.location\.origin\)/g, "}, (window.location.protocol === 'file:' || window.location.origin === 'null' ? '*' : window.location.origin))");
}

function standaloneAdapters(embedded) {
  return {
    name: 'bhaskar-single-file-adapters',
    enforce: 'pre',
    async transformIndexHtml(html) {
      // Vite does not bundle classic scripts from public/ by itself.
      for (const match of [...html.matchAll(/<script\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)>\s*<\/script>/gi)]) {
        if (/\btype=["']module["']/.test(match[1] + match[3])) continue;
        if (/^(?:https?:|data:|\/\/)/.test(match[2])) throw new Error(`Unbundled script: ${match[2]}`);
        const path = resolve(publicDir, match[2].replace(/^\.?\//, ''));
        if (relative(publicDir, path).startsWith('..')) throw new Error(`Script outside public/: ${match[2]}`);
        const script = (await readFile(path, 'utf8')).replace(/<\/script/gi, '<\\/script');
        html = html.replace(match[0], () => `<script>${script}</script>`);
      }
      if (embedded) {
        // These are script expressions, including the dynamically chosen opponent flag.
        html = html.replace(/(["'])\.\/flags\/([^"']+)\1/g, (_, quote, file) => {
          const asset = assets[`flags/${file}`];
          if (!asset) throw new Error(`Missing flag: ${file}`);
          return `${quote}${asset}${quote}`;
        });
        html = html.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi,
          (_, start, script, end) => start + adaptEmbeddedCode(script) + end);
      }
      return html;
    },
    transform(source, id) {
      const path = id.split('?')[0].replaceAll('\\', '/');
      let code = source;
      if (path.endsWith('/src/games/base-html-game.js')) {
        code = replaceRequired(code,
          'iframe.src = gameUrl(this.config.htmlFile);',
          "iframe.srcdoc = window.DBSingleFile.page(this.config.htmlFile, '?day=' + window.DBJamDemo.day);", 'game iframe document');
        code = replaceRequired(code, 'event.origin !== window.location.origin',
          "(event.origin !== window.location.origin && !(window.location.protocol === 'file:' && event.origin === 'null'))", 'file iframe messages');
        code = code.replace(/},\s*window\.location\.origin\)/g,
          "}, (window.location.protocol === 'file:' || window.location.origin === 'null' ? '*' : window.location.origin))");
      }
      if (path.endsWith('/src/games/game-assets.js')) {
        code = replaceRequired(code, 'if (!htmlFile || navigator.connection?.saveData) return;',
          'if (window.DBSingleFile || !htmlFile || navigator.connection?.saveData) return;', 'game prefetch');
      }
      if (path.endsWith('/src/ui/news-reader.js')) {
        code = replaceRequired(code, 'frame.src = newsUrl.href;',
          "frame.srcdoc = window.DBSingleFile.page('news.html', newsUrl.search);", 'news iframe');
      }
      if (path.endsWith('/src/core/music-tracks.js')) {
        code = replaceRequired(code, "return `${import.meta.env?.BASE_URL || '/'}audio/music/${track.file}`;",
          "return window.DBSingleFile.asset('audio/music/' + track.file);", 'music URLs');
      }
      // Vite extracts inline module scripts into virtual modules before bundling.
      if (embedded && (id.includes('html-proxy') || path.endsWith('/src/ui/game-intro.js'))) {
        code = adaptEmbeddedCode(code);
      }
      return code === source ? null : { code, map: null };
    },
  };
}

async function buildPage(file, embedded) {
  const result = await build({
    root,
    configFile: false,
    publicDir,
    logLevel: 'error',
    plugins: [standaloneAdapters(embedded), tailwindcss(), viteSingleFile()],
    build: {
      target: 'esnext',
      write: false,
      copyPublicDir: false,
      // Each iframe keeps its own module scope. A page must have no chunk imports.
      rollupOptions: { input: resolve(root, file) },
    },
  });
  const outputs = Array.isArray(result) ? result.flatMap(item => item.output) : result.output;
  const html = outputs.find(item => item.type === 'asset' && item.fileName === file);
  if (!html) throw new Error(`No bundled HTML emitted for ${file}`);
  const other = outputs.filter(item => item !== html);
  if (other.length) throw new Error(`Unembedded output for ${file}: ${other.map(item => item.fileName).join(', ')}`);
  return String(html.source);
}

// Embed the five registered games, shared reader and linked music credits.
const gamePages = new Set(['news.html', 'music-preview.html']);
for (const directory of ['game-1', 'game-2', 'game-3', 'game-4', 'game-5']) {
  const source = await readFile(resolve(root, 'src/games', directory, 'index.js'), 'utf8');
  for (const match of source.matchAll(/htmlFile:\s*['"]([^'"]+)['"]/g)) gamePages.add(match[1]);
}
for (const file of gamePages) {
  pages[file] = Buffer.from(await buildPage(file, true), 'utf8').toString('base64');
  console.log(`Embedded ${file}`);
}

let html = await buildPage('index.html', false);
const runtime = await readFile(resolve(root, 'scripts/single-file-runtime.js'), 'utf8');
// Install a small lazy reader before the app module. Keep the large payload out
// of executable JavaScript and after the opening HTML, so it cannot hide startup.
html = replaceRequired(html, '<meta charset="UTF-8" />',
  `<meta charset="UTF-8" />\n<script>(${runtime})();</script>`, 'host character encoding');
// Inlined bundles otherwise occupy the head before any visible HTML. Keep only
// critical opening CSS there; move app resources below the already-renderable
// shell. Match whole script blocks so CSS strings inside JavaScript stay intact.
const resources = [];
const headEnd = html.indexOf('</head>');
const head = html.slice(0, headEnd).replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>/gi, tag => {
  if (/^<script\b[^>]*\btype="module"/i.test(tag) || (/^<style\b/i.test(tag) && !/^<style\b[^>]*\bid="startup-critical"/i.test(tag))) {
    resources.push(tag);
    return '';
  }
  return tag;
});
html = replaceRequired(head + html.slice(headEnd), '<!-- app-resources -->', resources.join('\n'), 'app resource position');
const escapeAttribute = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const payload = Object.entries({ page: pages, asset: assets }).flatMap(([kind, entries]) =>
  Object.entries(entries).map(([path, value]) => `<script type="application/octet-stream" id="${escapeAttribute(`db-embedded-${kind}:${path}`)}">${value}</script>`)
).join('\n');
html = replaceRequired(html, '</body>', `${payload}\n</body>`, 'embedded payload');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`Created ${output} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(1)} MB)`);
console.log('Local scripts, styles, game pages, flags and music are embedded. Google Fonts remain optional online resources.');
