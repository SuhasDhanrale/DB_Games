import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [tailwindcss(), {
    name: 'paint-opening-before-app-styles',
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        if (!['/', '/index.html'].includes(context.path)) return html;
        // Vite creates additional links for imported CSS. Keep all app styles
        // non-blocking; bootstrap waits for them while the inline opening paints.
        return html.replace(/<link\b[^>]*>/g, tag => {
          if (!/rel="stylesheet"/.test(tag) || /fonts\.googleapis\.com/.test(tag) || /data-app-style/.test(tag)) return tag;
          return tag.replace(/\s*\/?>(?=$)/, ' media="print" data-app-style onload="this.media=\'all\';this.dataset.loaded=\'true\'" onerror="this.dataset.failed=\'true\'">');
        });
      },
    },
  }],
  build: {
    target: 'esnext',
    // Build iframe pages too, sharing cacheable CSS instead of compiling it on navigation.
    rollupOptions: {
      input: Object.fromEntries(readdirSync(process.cwd())
        .filter(file => file.endsWith('.html'))
        .map(file => [file.replace('.html', ''), resolve(process.cwd(), file)]))
    }
  }
});
