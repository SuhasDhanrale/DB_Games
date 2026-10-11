import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [tailwindcss()],
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
