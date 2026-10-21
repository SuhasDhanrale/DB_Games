import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const html = await readFile('build/index.html', 'utf8');
const payloadStart = html.indexOf('<script type="application/octet-stream"');
assert(payloadStart > html.indexOf('id="loading-screen"'), 'The opening precedes the embedded payload');
assert(html.indexOf('id="loading-screen"') < 20_000, 'The opening precedes the bundled app code and styles');
assert(html.slice(0, payloadStart).length < 300_000, 'The initial shell has no large media payload');
assert(!html.includes('Uint8Array.from(atob('), 'Page decoding avoids a callback for every byte');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const games = ['wordal', 'niti', 'cricket', 'carrom', 'jodo'];
await mkdir('tmp/loading-qa', { recursive: true });
const base = 'http://127.0.0.1:5188';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });

async function context(options = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
  // Fulfill locally: this also works where browser networking to local servers
  // is restricted. The early document contains only the first part of the build.
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return route.abort();
    if (url.protocol === 'file:' || url.protocol === 'data:') return route.continue();
    if (url.origin !== base) return route.abort();
    if (url.pathname === '/early.html') return route.fulfill({ contentType: mime['.html'], body: html.slice(0, payloadStart).replace(/<script type="module"/g, '<script type="application/octet-stream"') + '</body></html>' });
    if (url.pathname === '/single/index.html') return route.fulfill({ contentType: mime['.html'], body: html });
    const root = resolve('dist');
    const file = resolve(root, '.' + url.pathname);
    assert(file.startsWith(root + sep));
    try { await route.fulfill({ contentType: mime[file.slice(file.lastIndexOf('.'))] || 'application/octet-stream', body: await readFile(file) }); }
    catch { await route.fulfill({ status: 404, body: 'Missing asset' }); }
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  return { ctx, page, errors };
}

try {
  // Render only the initial HTML, without executing the app or loading media.
  const streamed = await context();
  await streamed.page.goto(base + '/early.html');
  await streamed.page.locator('#loading-screen .loading-bar').waitFor({ state: 'visible' });
  assert.equal(await streamed.page.locator('.hub-screen').count(), 0);
  await streamed.page.waitForFunction(() => performance.getEntriesByName('first-contentful-paint').length > 0);
  await streamed.page.screenshot({ path: 'tmp/loading-qa/opening-390.png' });
  assert.equal(await streamed.page.locator('script[id^="db-embedded-"]').count(), 0);
  await streamed.page.goto(base + '/single/index.html');
  await streamed.page.locator('.hub-screen.active').waitFor();
  await streamed.page.locator('#loading-screen').waitFor({ state: 'detached' });
  assert.deepEqual(streamed.errors, []);
  await streamed.ctx.close();
  console.log('PASS single HTTP: initial HTML paints without embedded games or media; the full build opens');

  // App CSS must not prevent the HTML opening from painting either.
  const hosted = await context();
  let releaseStyles;
  const stylesReady = new Promise(resolve => { releaseStyles = resolve; });
  await hosted.ctx.route('**/*.css', async route => { await stylesReady; await route.fallback(); });
  await hosted.page.goto(base + '/index.html', { waitUntil: 'commit' });
  await hosted.page.locator('#loading-screen .loading-bar').waitFor({ state: 'visible' });
  await hosted.page.waitForFunction(() => performance.getEntriesByName('first-contentful-paint').length > 0);
  assert.equal(await hosted.page.locator('.hub-screen').count(), 0);
  releaseStyles();
  await hosted.page.locator('.hub-screen.active').waitFor();
  await hosted.page.locator('#loading-screen').waitFor({ state: 'detached' });
  console.log('PASS web: opening paints while app styles load, and reveals the ready hub');

  for (const id of games) {
    let releaseGame;
    const ready = new Promise(resolve => { releaseGame = resolve; });
    const routePattern = /\/(wordal|niti|Superover|Carrom_Puzzles|jodo)\.html\?/;
    const hold = async route => { await ready; await route.fallback(); };
    await hosted.ctx.route(routePattern, hold);
    await hosted.page.evaluate(id => { location.hash = '#/game/' + id; }, id);
    await hosted.page.locator('.game-player.active .gi-play').click();
    await hosted.page.locator('.game-player.active .game-loading').waitFor({ state: 'visible' });
    assert.equal(await hosted.page.locator('.game-player.active .game-area').getAttribute('aria-busy'), 'true');
    assert.equal(await hosted.page.locator('.game-player.active iframe').isVisible(), false);
    if (id === 'cricket') await hosted.page.screenshot({ path: 'tmp/loading-qa/game-390.png' });
    releaseGame();
    await hosted.page.locator('.game-player.active .game-loading').waitFor({ state: 'detached' });
    assert.equal(await hosted.page.locator('.game-player.active iframe').isVisible(), true);
    assert.equal(await hosted.page.locator('.game-player.active .game-area').getAttribute('aria-busy'), 'false');
    await hosted.ctx.unroute(routePattern, hold);
    await hosted.page.locator('.game-player.active #game-back-btn').click();
    await hosted.page.locator('.hub-screen.active').waitFor();
    console.log(`PASS web ${id}: loading feedback remains visible until the game is ready`);
  }
  assert.deepEqual(hosted.errors, []);
  await hosted.ctx.close();

  const local = await context({ reducedMotion: 'reduce' });
  await local.page.goto(pathToFileURL(resolve('build/index.html')).href + '?day=d1');
  await local.page.locator('.hub-screen.active').waitFor();
  assert.equal(await local.page.locator('script[id^="db-embedded-asset:audio/"]').count(), 5, 'Music stays inert on the hub');
  await local.page.evaluate(() => {
    window.loadingSamples = [];
    window.loadingPaints = 0;
    function observe() {
      const loader = document.querySelector('.game-player.active .game-loading');
      if (loader?.getBoundingClientRect().height > 0) window.loadingPaints++;
      requestAnimationFrame(observe);
    }
    requestAnimationFrame(observe);
    const original = window.DBSingleFile.page;
    window.DBSingleFile.page = function(...args) {
      const loader = document.querySelector('.game-player.active .game-loading');
      window.loadingSamples.push({ page: args[0], painted: window.loadingPaints > 0, visible: !!loader && getComputedStyle(loader).visibility === 'visible' });
      return original.apply(this, args);
    };
  });
  await local.page.evaluate(() => { location.hash = '#/game/wordal'; });
  await local.page.locator('.game-player.active .gi-play').waitFor();
  await local.page.evaluate(() => {
    document.querySelector('.game-player.active .gi-play').click();
    document.querySelector('.game-player.active #game-back-btn').click();
  });
  await local.page.locator('.hub-screen.active').waitFor();
  await local.page.waitForTimeout(100);
  assert.equal(await local.page.evaluate(() => loadingSamples.length), 0, 'Leaving during loading cancels deferred decoding');
  for (const id of games) {
    await local.page.evaluate(id => { DBJamDemo.setItem('game-intro:' + id, 'seen'); window.loadingPaints = 0; location.hash = '#/game/' + id; }, id);
    await local.page.locator('.game-player.active iframe:not(.is-loading)').waitFor({ state: 'visible' });
    await local.page.locator('.game-player.active #game-back-btn').click();
    await local.page.locator('.hub-screen.active').waitFor();
  }
  const samples = await local.page.evaluate(() => loadingSamples);
  assert.equal(samples.length, 5);
  assert(samples.every(sample => sample.painted && sample.visible), JSON.stringify(samples));
  assert.deepEqual(local.errors, []);
  await local.ctx.close();
  console.log('PASS single file: all five loaders paint before decoding; early exit cancels loading; reduced motion works');
} finally {
  await browser.close();
}
