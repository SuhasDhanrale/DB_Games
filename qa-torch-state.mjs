import assert from 'node:assert/strict';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 320, height: 640 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.routeWebSocket('**/*', socket => socket.close());
await page.addInitScript(() => {
  for (const id of ['wordal', 'cricket']) localStorage.setItem('db-game-intro:v1:' + id, 'seen');
});
async function progression() {
  return page.evaluate(async () => (await import('/src/systems/progression.js')).getProgression());
}
async function openGame(id) {
  await page.evaluate(id => { location.hash = '#/game/' + id; }, id);
  const iframe = page.locator(`.game-player.active #game-iframe-${id}`);
  await iframe.waitFor();
  const frame = await (await iframe.elementHandle()).contentFrame();
  await frame.waitForURL('**/*.html*');
  await frame.waitForLoadState('load');
  return frame;
}
async function home() {
  await page.locator('.game-player.active #game-back-btn').click();
  await page.locator('.hub-screen.active').waitFor();
}
try {
  await page.goto((process.env.TORCH_QA_URL || 'http://127.0.0.1:5176') + '/?day=d1');
  await page.locator('.hub-screen.active').waitFor();
  const initial = await progression();
  let frame = await openGame('wordal');
  await home();
  assert.equal((await progression()).streak, initial.streak);
  assert.equal((await progression()).dailyCompleted.wordal, undefined);
  assert.equal(await page.locator('.hub-screen.active .hub-header-pill--celebrate').count(), 0);

  // Exhausting attempts is completion even without solving the word.
  frame = await openGame('wordal');
  for (let attempt = 0; attempt < 6; attempt++) {
    for (let unit = 0; unit < 5; unit++) await frame.locator('.key-btn[data-key="अ"]').click();
    await frame.locator('#btnSubmitGuess').click();
    await page.waitForTimeout(1000);
  }
  await frame.locator('.torch-card').waitFor();
  assert.equal((await progression()).streak, initial.streak + 1);
  assert.equal(await frame.locator('.torch-card').evaluate(node => getComputedStyle(node).animationName), 'none');
  await page.waitForTimeout(3200);
  assert.equal(await frame.locator('.torch-card').count(), 1, 'Card should not automatically disappear');
  await home();
  assert.equal(await page.locator('.hub-screen.active .hub-header-pill svg').evaluate(node => getComputedStyle(node).animationName), 'none');

  // Advance the simulated date to verify future-day concise copy and English.
  await page.evaluate(async () => {
    const date = new Date(window.DBJamDemo.date);
    date.setDate(date.getDate() + 1);
    window.DBJamDemo.date = date.toISOString();
    window.DBJamDemo.calendarDate = date.toISOString().slice(0, 10);
    (await import('/src/systems/progression.js')).resetDailyChallenges();
  });
  await page.locator('.hub-screen.active #hub-lang-toggle').click();
  frame = await openGame('cricket');
  await frame.evaluate(() => { initMatch(); totalRuns = 0; ballsBowled = 6; endMatch(false); });
  await frame.locator('.torch-card').waitFor();
  assert.equal(await frame.locator('.torch-card__title').textContent(), 'One more day, the torch stays alight!');
  assert.equal(await frame.locator('.torch-card').getAttribute('lang'), 'en');
  assert.equal(await frame.locator('.torch-card__hint').count(), 0);
  assert.equal(await frame.locator('.torch-card__count').textContent(), `${initial.streak + 2}-day streak`);
  const bounds = await frame.locator('.torch-card').boundingBox();
  assert(bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= 321);
  // Replay uses the real game reset; the old celebration must not return.
  await frame.locator('#resPlayAgainBtn').click();
  await frame.locator('.torch-card').waitFor({ state: 'detached' });
  await frame.evaluate(() => { initMatch(); totalRuns = 0; ballsBowled = 6; endMatch(false); });
  await page.waitForTimeout(1300);
  assert.equal(await frame.locator('.torch-card').count(), 0);
  assert.equal((await progression()).streak, initial.streak + 2);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ abortDoesNotEarnDay: true, exhaustedAttemptsCount: true, cardPersists: true, futureDayConciseCopy: true, english: true, reducedMotion: true, replayDoesNotRepeat: true, narrowViewport: true, errors }));
} finally {
  await browser.close();
}
