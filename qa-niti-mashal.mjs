import assert from 'node:assert/strict';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const base = process.env.NITI_QA_URL || 'http://localhost:5173';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('https://fonts.googleapis.com/**', route => route.abort());
await page.route('https://fonts.gstatic.com/**', route => route.abort());
await page.routeWebSocket('**/*', socket => socket.close());
try {
  for (const edition of ['d1', 'd2', 'd3']) {
    await page.goto(`${base}/?day=${edition}#/`);
    await page.locator('.hub-screen.active').waitFor();
    await page.evaluate(() => window.DBJamDemo.setItem('game-intro:niti', 'seen'));
    await page.evaluate(() => { location.hash = '#/game/niti'; });
    const iframe = page.locator('.game-player.active #game-iframe-niti');
    await iframe.waitFor();
    const frame = await (await iframe.elementHandle()).contentFrame();
    await frame.waitForLoadState('load');
    await frame.evaluate(() => window.gameIntroReady);
    await frame.locator('.opt-card-btn').first().click();
    await frame.locator('#btn-step1-action').click();
    await frame.locator('#meaning-reveal-box.is-visible').waitFor();
    await page.waitForTimeout(1500);
    const journey = await page.evaluate(async () => (await import('/src/systems/progression.js')).torchJourney());
    const count = await page.locator('.torch-popup').count();
    console.log(JSON.stringify({ edition, popupCount: count, journey, errors }));
    assert.equal(count, 1, `${edition}: completing Niti must show the popup even when today's bar was already earned`);
    assert.equal(journey.completions, 1, 'Another demo edition must not award a second daily bar');
    if (edition !== 'd1') {
      assert.equal(await page.locator('.torch-popup .is-feeding').count(), 0, 'Already counted results must not animate another +1');
      assert.equal(await page.locator('.torch-popup .is-level-up').count(), 0);
    }
    await page.locator('.torch-card__skip').waitFor({ state: 'visible' });
    await page.locator('.torch-card__skip').click();
    await page.locator('#game-back-btn').click();
    await page.locator('.hub-screen.active').waitFor();
    await page.evaluate(() => { location.hash = '#/game/niti'; });
    await page.locator('.game-player.active #game-iframe-niti').waitFor();
    await page.waitForTimeout(1500);
    assert.equal(await page.locator('.torch-popup').count(), 0, 'Reopening a saved result must not show a new completion popup');
  }
  assert.deepEqual(errors, []);
  console.log('PASS: Niti popup for all three editions, one daily bar, no repeated +1 or level-up, no popup on restored results.');
} finally { await browser.close(); }
