import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const file = resolve('build/index.html');
assert.deepEqual(await readdir(resolve('build')), ['index.html'], 'The build contains exactly one file');
const html = await readFile(file);
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const games = [
  ['wordal', '#modalHelp.is-open', '#btnOkHelp'],
  ['niti', '.gi-dialog[open]', '.gi-play'],
  ['cricket', '#rulesModal:not(.hidden)', '#closeRulesBtn'],
  ['carrom', '#modal-backdrop:not(.hidden)', '#modal-btn'],
  ['jodo', '#rules-modal.is-open', '#btn-close-rules'],
];

try {
  // Fulfill the HTTP document locally so the browser can test a hosted origin
  // even in environments that restrict networking to a local test server.
  for (const base of [pathToFileURL(file).href, 'http://127.0.0.1:5187/index.html']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    const extraRequests = [];
    page.on('pageerror', error => { errors.push(error.message); console.error(error.message); });
    await context.route('**/*', route => {
      const url = route.request().url();
      if (/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(url)) return route.abort();
      if (url.split('?')[0] === base && base.startsWith('http:')) {
        return route.fulfill({ contentType: 'text/html; charset=utf-8', body: html });
      }
      if (url.startsWith('data:') || url.split('?')[0] === base) return route.continue();
      extraRequests.push(url);
      return route.abort();
    });
    await page.goto(base + '?day=d1');
    await page.locator('.hub-screen.active').waitFor();
    await page.locator('#loading-screen').waitFor({ state: 'detached' });
    assert.match(await page.title(), /दैनिक भास्कर/);
    for (const [id, help, close] of games) {
      await page.evaluate(id => { location.hash = '#/game/' + id; }, id);
      await page.locator('.game-player.active .gi-play').click();
      const iframe = page.locator(`.game-player.active #game-iframe-${id}`);
      const frame = await (await iframe.elementHandle()).contentFrame();
      await frame.waitForFunction(() => window.gameIntroReady);
      await frame.evaluate(() => window.gameIntroReady);
      await iframe.waitFor({ state: 'visible' });
      await page.locator('.game-player.active .game-loading').waitFor({ state: 'detached' });
      assert.equal(await frame.evaluate(() => window.DBJamDemo === window.parent.DBJamDemo), true);
      assert.equal(await frame.evaluate(() => window.DB_BUILD_PAGE_URL.searchParams.get('day')), 'd1');
      assert.equal(await frame.locator('.gi-dialog').count(), 0);
      await page.locator('.game-player.active #game-rules-btn').click();
      await frame.locator(help).waitFor({ state: 'visible' });
      await frame.locator(close).click();
      await frame.locator(help).waitFor({ state: 'hidden' });
      // Load the real recording through the game's controller, including file://.
      await frame.evaluate(() => {
        window.DBGameAudio.unlockAudio();
        window.DBGameAudio.setMusicEnabled(true);
      });
      await frame.waitForFunction(() => window.DBGameAudio.getMusicStatus() === 'playing');
      await frame.evaluate(() => window.DBGameAudio.setMusicEnabled(false));
      if (id === 'cricket') {
        assert.equal(await frame.locator('.team-flag').evaluateAll(nodes => nodes.every(node => node.complete && node.naturalWidth > 0)), true);
        await frame.evaluate(() => initMatch());
        await frame.evaluate(() => { totalRuns = 0; ballsBowled = 6; endMatch(false); });
        await frame.locator('.torch-result-progress:visible').waitFor();
        assert.equal(await page.locator('.torch-popup').count(), 0);
        await frame.locator('#resMatchStory').click();
        await page.locator('#news-reader').waitFor({ state: 'visible' });
        const news = await (await page.locator('#news-reader iframe').elementHandle()).contentFrame();
        await news.locator('#articleView.active').waitFor();
        assert.equal(await news.evaluate(() => window.DB_BUILD_PAGE_URL.search.includes('article=asian-final')), true);
        await news.locator('#bottomReturnBtn').click();
        await page.locator('#news-reader').waitFor({ state: 'hidden' });
      }
      if (id === 'jodo') {
        const ids = await frame.locator('#left-cards-col .card-btn').evaluateAll(nodes => nodes.map(node => node.dataset.pairId));
        for (const pair of ids) {
          await frame.locator(`#left-cards-col [data-pair-id="${pair}"]`).click();
          await frame.locator(`#right-cards-col [data-pair-id="${pair}"]`).click();
        }
        await frame.locator('#result-panel').waitFor({ state: 'visible' });
        await frame.locator('.torch-result-progress:visible').waitFor();
        assert.equal(await page.locator('.torch-popup').count(), 0);
        await frame.locator('#review-list a').first().click();
        await frame.locator('#article-modal.is-open').waitFor();
        await frame.locator('#btn-close-article-bottom').click();
        await frame.locator('#article-modal.is-open').waitFor({ state: 'hidden' });
      }
      await page.locator('.game-player.active #game-back-btn').click();
      await page.locator('.hub-screen.active').waitFor();
      console.log(`PASS ${new URL(base).protocol} ${id}: launch, rules, music and return`);
    }
    await page.locator('#hub-settings').click();
    await page.locator('a[href="./music-preview.html#credits"]').click();
    await page.locator('#single-file-music').waitFor();
    const credits = await (await page.locator('#single-file-music iframe').elementHandle()).contentFrame();
    await credits.locator('#music-credits li').first().waitFor();
    assert.equal(await credits.locator('#music-credits li').count(), 5);
    await page.locator('#single-file-music > button').click();
    await page.reload();
    await page.locator('.hub-screen.active').waitFor();
    assert.equal(await page.evaluate(() => window.DBJamDemo.day), 'd2');
    assert.deepEqual(errors, [], 'No browser errors');
    assert.deepEqual(extraRequests, [], 'No separate game or asset files requested');
    await context.close();
  }
} finally {
  await browser.close();
}
