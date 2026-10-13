import assert from 'node:assert/strict';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'vite';

const server = await createServer({ server: { host: '127.0.0.1', port: 5182, strictPort: true, hmr: false } });
await server.listen();
const base = 'http://127.0.0.1:5182';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const games = [
  ['wordal', 'wordal.html', '#modalHelp.is-open', '#btnOkHelp'],
  ['niti', 'niti.html', '.gi-dialog[open]', '.gi-play'],
  ['cricket', 'Superover.html', '#rulesModal:not(.hidden)', '#closeRulesBtn'],
  ['carrom', 'Carrom_Puzzles.html', '#modal-backdrop:not(.hidden)', '#modal-btn'],
  ['jodo', 'jodo.html', '#rules-modal.is-open', '#btn-close-rules'],
];

async function checkLaunched(id, helpSelector, closeSelector) {
  const iframe = page.locator(`.game-player.active #game-iframe-${id}`);
  await iframe.waitFor();
  const frame = await (await iframe.elementHandle()).contentFrame();
  await frame.waitForFunction(() => window.gameIntroReady);
  const ready = await frame.evaluate(() => Promise.race([
    window.gameIntroReady.then(() => true),
    new Promise(resolve => setTimeout(() => resolve(false), 3000)),
  ]));
  assert.equal(ready, true, `${id}: game must start after one host Play click`);
  assert.equal(await frame.locator('.gi-dialog').count(), 0, `${id}: no duplicate guide`);
  assert.equal(await frame.locator(helpSelector).count(), 0, `${id}: help remains closed`);
  await page.locator('.game-player.active #game-rules-btn').click();
  await frame.locator(helpSelector).waitFor({ state: 'visible' });
  await frame.locator(closeSelector).click();
  await frame.locator(helpSelector).waitFor({ state: 'hidden' });
  assert.equal(await frame.locator('.gi-dialog').count(), 0);
}

try {
  for (const [id, file, helpSelector, closeSelector] of games) {
    await page.goto(`${base}/?day=d1#/game/${id}`);
    await page.locator('.game-player.active .gi-play').click();
    await checkLaunched(id, helpSelector, closeSelector);
    // Refresh resets guides and rotates the edition, but still needs only one click.
    await page.reload();
    await page.locator('.game-player.active .gi-play').click();
    await checkLaunched(id, helpSelector, closeSelector);
    assert.equal(await page.evaluate(() => window.DBJamDemo.day), 'd2');
    // Returning to an already introduced game does not reopen either guide.
    await page.locator('.game-player.active #game-back-btn').click();
    await page.locator('.hub-screen.active').waitFor();
    await page.evaluate(id => { location.hash = '#/game/' + id; }, id);
    await checkLaunched(id, helpSelector, closeSelector);
    assert.equal(await page.locator('.game-player.active .game-intro').count(), 0);
    // Direct links still show their guide; dismissing it starts the game.
    await page.goto(`${base}/${file}?day=d1`);
    await page.locator('.gi-dialog .gi-play').click();
    await page.evaluate(() => window.gameIntroReady);
    assert.equal(await page.locator('.gi-dialog').count(), 0);
    await page.reload();
    await page.locator('.gi-dialog .gi-play').click();
    await page.evaluate(() => window.gameIntroReady);
    assert.equal(await page.locator('.gi-dialog').count(), 0);
    console.log(`PASS: ${id} first entry, refresh, revisit, help and standalone guide`);
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  await server.close();
}
