import assert from 'node:assert/strict';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'vite';

const server = process.env.ROTATION_QA_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 5181, strictPort: true, hmr: false } });
await server?.listen();
const base = process.env.ROTATION_QA_URL || 'http://127.0.0.1:5181';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
// Demo rounds/preferences stay temporary; only the Mashal ledger may use browser storage.
await page.addInitScript(() => {
  localStorage.setItem('db-games:v1:progression', JSON.stringify({ streak: 99, gamesPlayed: 99 }));
  localStorage.setItem('db-game-intro:v1:wordal', 'seen');
  window.storageAccesses = [];
  for (const method of ['getItem', 'setItem', 'removeItem', 'clear', 'key']) {
    Storage.prototype[method] = function (key) {
      window.storageAccesses.push({ method, key });
      throw new Error('Browser storage is disabled for this check');
    };
  }
});

async function assertStorageScope() {
  const accesses = await page.evaluate(() => window.storageAccesses);
  assert(accesses.every(({ method, key }) => ['getItem', 'setItem', 'removeItem'].includes(method) && key === 'db-games:v1:mashal-completions'), JSON.stringify(accesses));
}

async function checkDay(day) {
  await page.locator('.hub-screen.active').waitFor();
  assert.equal(await page.evaluate(() => window.DBJamDemo.day), day);
  assert.equal(new URL(page.url()).searchParams.get('day'), day);
  assert.equal(await page.evaluate(() => window.DBJamDemo.persistent), false);
  const progress = await page.evaluate(async () => (await import('/src/systems/progression.js')).getProgression());
  assert.equal(progress.streak, 0);
  assert.equal(progress.gamesPlayed, 0);
  assert.deepEqual(progress.dailyCompleted, {});
  assert.equal(await page.evaluate(() => window.DBJamDemo.getItem('round-check')), null);
  assert.equal(await page.evaluate(async () => (await import('/src/core/storage.js')).get('preference-check')), null);
}

try {
  await page.goto(base + '/');
  await checkDay('d1');
  assert.equal(await page.evaluate(async () => (await import('/src/ui/game-intro.js')).hasSeenIntro('wordal')), false);
  await page.evaluate(async () => {
    window.DBJamDemo.setItem('round-check', 'played');
    (await import('/src/core/storage.js')).set('preference-check', 'changed');
    (await import('/src/systems/progression.js')).recordGamePlay('wordal');
  });
  // In-page navigation and iframe loads share the day and temporary rounds.
  for (const id of ['wordal', 'niti', 'cricket', 'carrom', 'jodo']) {
    await page.evaluate(id => { location.hash = '#/game/' + id; }, id);
    await page.locator('.game-player.active .game-intro').waitFor();
    await page.locator('.game-player.active .gi-play').click();
    const iframe = page.locator(`.game-player.active #game-iframe-${id}`);
    await iframe.waitFor();
    const frame = await (await iframe.elementHandle()).contentFrame();
    await frame.waitForFunction(() => window.DBJamDemo);
    assert.equal(await frame.evaluate(() => window.DBJamDemo.day), 'd1', JSON.stringify(await frame.evaluate(() => ({ url: location.href, parentUrl: parent.location.href, parentDay: parent.DBJamDemo?.day, sameState: parent.DBJamDemo === window.DBJamDemo, navigation: performance.getEntriesByType('navigation')[0]?.type }))));
    assert.equal(await frame.evaluate(() => window.DBJamDemo.getItem('round-check')), 'played');
    await page.locator('.game-player.active #game-back-btn').click();
    await page.locator('.hub-screen.active').waitFor();
  }
  assert.equal(await page.evaluate(async () => (await import('/src/systems/progression.js')).getProgression().gamesPlayed), 1);
  assert.equal(await page.evaluate(async () => (await import('/src/ui/game-intro.js')).hasSeenIntro('wordal')), true);
  await assertStorageScope();
  for (const day of ['d2', 'd3', 'd1']) {
    await page.reload();
    await checkDay(day);
    assert.equal(await page.evaluate(async () => (await import('/src/ui/game-intro.js')).hasSeenIntro('wordal')), false);
    await assertStorageScope();
  }
  // Refreshing while a game is open rotates the host and the game together.
  await page.evaluate(() => { location.hash = '#/game/wordal'; });
  await page.locator('.game-player.active .gi-play').click();
  await page.locator('#game-iframe-wordal').waitFor();
  await page.reload();
  await page.locator('.game-player.active .gi-play').click();
  const refreshedGame = await (await page.locator('#game-iframe-wordal').elementHandle()).contentFrame();
  await refreshedGame.waitForFunction(() => window.DBJamDemo);
  assert.equal(await page.evaluate(() => window.DBJamDemo.day), 'd2');
  assert.equal(await refreshedGame.evaluate(() => window.DBJamDemo.day), 'd2');
  assert.equal(await page.evaluate(async () => (await import('/src/systems/progression.js')).getProgression().gamesPlayed), 0);
  // Direct edition links are respected; standalone refresh also rotates.
  await page.goto(base + '/jodo.html?day=d2');
  await page.waitForFunction(() => window.DBJamDemo);
  assert.equal(await page.evaluate(() => window.DBJamDemo.day), 'd2');
  await page.evaluate(() => window.DBJamDemo.setItem('round-check', 'played'));
  await page.reload();
  assert.equal(await page.evaluate(() => window.DBJamDemo.day), 'd3');
  assert.equal(await page.evaluate(() => window.DBJamDemo.getItem('round-check')), null);
  await assertStorageScope();
  assert.deepEqual(errors, []);
  console.log('PASS: three-day refresh rotation, fresh rounds/preferences/guides, five shared game frames, standalone rotation, only Mashal storage access, blocked-storage fallback, no page errors.');
} finally {
  await browser.close();
  await server?.close();
}
