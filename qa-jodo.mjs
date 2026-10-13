import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const authored = { window: {} };
vm.runInNewContext(fs.readFileSync('public/jodo-content.js', 'utf8'), authored);
const editions = authored.window.JodoContent.editions;
for (const edition of editions) {
  assert.equal(edition.pairs.length, 4);
  for (const field of ['id', 'left', 'right', 'url']) assert.equal(new Set(edition.pairs.map(p => p[field])).size, 4);
  for (const pair of edition.pairs) {
    for (const field of ['source', 'dateLabel', 'freshness', 'explanation', 'why', 'articleTitle']) assert.ok(pair[field]);
    assert.equal(new URL(pair.url).protocol, 'https:');
  }
}
const base = process.env.JODO_QA_URL || 'http://127.0.0.1:5188';
const server = process.env.JODO_QA_URL ? null : spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5188', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
if (server) await new Promise((resolve, reject) => {
  server.stdout.on('data', data => { if (data.toString().includes('Local:')) resolve(); });
  server.once('exit', code => reject(new Error('Preview exited: ' + code)));
  server.stderr.on('data', data => process.stderr.write(data));
});
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
try {
  for (const width of [360, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    // The local interface is tested independently from external font/CDN availability.
    await context.route('https://fonts.googleapis.com/**', route => route.abort());
    await context.route('https://fonts.gstatic.com/**', route => route.abort());
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const edition of editions) {
      await page.goto(`${base}/jodo.html?day=${edition.id}`);
      const intro = page.locator('.gi-play');
      if (await intro.isVisible()) await intro.click();
      await page.locator('#left-cards-col .card-btn').first().waitFor();
      assert.match(await page.locator('#edition-label').innerText(), new RegExp(edition.freshness));
      assert.match(await page.locator('.edition-note').innerText(), /デモ|डेमो/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      const [p1, p2, p3, p4] = edition.pairs;
      const card = (side, pair) => page.locator(`[data-side="${side}"][data-pair-id="${pair.id}"]`);
      await card('left', p1).tap();
      await card('right', p2).tap();
      await page.waitForTimeout(450);
      assert.equal(await page.locator('#progress-count').innerText(), '0/4 जोड़ियाँ');
      await card('left', p1).tap();
      await card('right', p1).tap();
      assert.equal(await page.locator('#progress-count').innerText(), '1/4 जोड़ियाँ');
      assert.match(await page.locator('#match-insights').innerText(), /क्यों मायने रखता है/);
      await page.locator('#match-insights a').tap();
      await page.locator('#article-modal.is-open').waitFor();
      assert.equal(await page.locator('#article-original').getAttribute('href'), p1.url);
      assert.ok((await page.locator('#article-source-note').innerText()).includes(p1.dateLabel));
      // Exercise a real new-tab destination with a fixture response, without altering the game tab.
      await context.route(p1.url, route => route.fulfill({ contentType: 'text/html', body: '<h1>Source destination fixture</h1>' }));
      const popupPromise = page.waitForEvent('popup');
      await page.locator('#article-original').tap();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      assert.equal(popup.url(), p1.url);
      await popup.close();
      assert.equal(await page.locator('#progress-count').innerText(), '1/4 जोड़ियाँ');
      await page.locator('#btn-close-article-bottom').tap();
      await page.locator('#article-modal.is-open').waitFor({ state: 'hidden' });
      assert.equal(await page.locator('#progress-count').innerText(), '1/4 जोड़ियाँ');
      await page.locator('#match-insights a').tap();
      await page.goBack();
      await page.locator('#article-modal.is-open').waitFor({ state: 'hidden' });
      await page.locator('#btn-show-pair').tap();
      assert.equal(await page.locator('#progress-count').innerText(), '2/4 जोड़ियाँ');
      assert.equal(await page.locator('#btn-show-pair').isDisabled(), true);
      assert.match(await page.locator('#match-insights').innerText(), /संकेत से मिली जोड़ी/);
      // Reload while reading a pair: the article and hint state must survive.
      await page.locator('#match-insights a').nth(1).tap();
      await page.reload();
      await page.locator('#article-modal.is-open').waitFor();
      assert.equal(await page.locator('#article-original').getAttribute('href'), p2.url);
      await page.locator('#btn-close-article-top').tap();
      await page.locator('#article-modal.is-open').waitFor({ state: 'hidden' });
      assert.equal(await page.locator('#btn-show-pair').isDisabled(), true);
      for (const pair of [p3, p4]) {
        await card('left', pair).tap();
        await card('right', pair).tap();
      }
      await page.locator('#result-panel').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#score-display').innerText(), '75');
      assert.equal(await page.locator('.completion-copy').innerText(), 'आज की खबरों से चार बातें समझीं');
      assert.equal(await page.locator('#review-list a').count(), 4);
      for (const [index, pair] of edition.pairs.entries()) {
        await page.locator('#review-list a').nth(index).tap();
        assert.equal(await page.locator('#article-original').getAttribute('href'), pair.url);
        await page.locator('#btn-close-article-top').tap();
        await page.locator('#article-modal.is-open').waitFor({ state: 'hidden' });
      }
      await page.reload();
      await page.locator('#result-panel').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#score-display').innerText(), '75');
      await page.waitForTimeout(300);
      await page.screenshot({ path: `tmp/jodo-${edition.id}-${width}.png`, fullPage: true });
      await page.locator('#btn-play-again').tap();
      assert.equal(await page.locator('#progress-count').innerText(), '0/4 जोड़ियाँ');
      assert.equal(await page.locator('#btn-show-pair').isDisabled(), false);
      // The last-pair hint must complete the game and preserve the original result.
      for (const pair of [p1, p2, p3]) {
        await card('left', pair).tap();
        await card('right', pair).tap();
      }
      await page.locator('#btn-show-pair').tap();
      await page.locator('#result-panel').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#score-display').innerText(), '85');
      assert.match(await page.locator('#review-list').innerText(), /संकेत से मिली जोड़ी/);
      results.push({ edition: edition.id, width, retries: true, hint: true, links: 4, articleReturn: true, reload: true });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); server?.kill(); }
