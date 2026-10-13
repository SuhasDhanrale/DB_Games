import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const server = process.env.TORCH_QA_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 5189, strictPort: true, hmr: false } });
await server?.listen();
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const base = process.env.TORCH_QA_URL || 'http://127.0.0.1:5189';
const rule = 'हर नया दैनिक खेल एक बार जोड़ता है.';
const summary = { wordal: '.result-hero-card', niti: '#meaning-reveal-box', jodo: '.result-header-minimal', cricket: '.news-scorecard', carrom: '#modal-desc' };
async function progression(page) {
  return page.evaluate(async () => (await import('/src/systems/progression.js')).getProgression());
}
async function openGame(page, id) {
  await page.evaluate(id => { location.hash = '#/game/' + id; }, id);
  const iframe = page.locator(`.game-player.active #game-iframe-${id}`);
  await iframe.waitFor();
  const frame = await (await iframe.elementHandle()).contentFrame();
  await frame.waitForURL('**/*.html*');
  await frame.waitForLoadState('load');
  await frame.locator(summary[id]).waitFor({ state: 'attached' });
  return frame;
}
async function complete(frame, id) {
  if (id === 'wordal') {
    const tokens = await frame.evaluate(() => window.currentWordalTokens);
    for (const token of tokens) await frame.locator('.key-btn').filter({ hasText: new RegExp('^' + token + '$') }).click();
    await frame.locator('#btnSubmitGuess').click();
  } else if (id === 'niti') {
    await frame.locator('.opt-card-btn').first().click();
    await frame.locator('#btn-step1-action').click();
  } else if (id === 'jodo') {
    const ids = await frame.locator('#left-cards-col .card-btn').evaluateAll(nodes => nodes.map(node => node.dataset.pairId));
    for (const id of ids) {
      await frame.locator(`#left-cards-col [data-pair-id="${id}"]`).click();
      await frame.locator(`#right-cards-col [data-pair-id="${id}"]`).click();
    }
  } else if (id === 'cricket') {
    // Use the real match-result path with a losing six-ball fixture.
    await frame.evaluate(() => { initMatch(); totalRuns = 0; ballsBowled = 6; endMatch(false); });
  } else if (id === 'carrom') {
    // Use the real final-puzzle completion path with its objective met.
    await frame.evaluate(() => { currentLevelIndex = LEVELS.length - 1; loadLevel(currentLevelIndex); potted.red = 1; evaluateLevel(); });
  }
}
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
    for (const id of Object.keys(summary)) {
      const page = await browser.newPage({ viewport });
      // Keep other workspace edits/builds from reloading a scenario mid-check.
      await page.routeWebSocket('**/*', socket => socket.close());
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        for (const id of ['wordal', 'niti', 'jodo', 'cricket', 'carrom']) localStorage.setItem('db-game-intro:v1:' + id, 'seen');
      });
      await page.goto(base + '/?day=d1');
      await page.locator('.hub-header-pill').waitFor();
      await page.evaluate(() => { for (const id of ['wordal', 'niti', 'jodo', 'cricket', 'carrom']) window.DBJamDemo.setItem('game-intro:' + id, 'seen'); });
      const initial = await progression(page);
      const frame = await openGame(page, id);
      assert.equal((await progression(page)).streak, initial.streak, 'Opening a game must not earn a day');
      assert.equal(await page.locator('.torch-card').count(), 0);
      await complete(frame, id);
      await frame.locator(summary[id]).waitFor({ state: 'visible' });
      assert.equal(await page.locator('.torch-card').count(), 0, 'Result should appear before the mashal card');
      await page.locator('.torch-card').waitFor();
      assert.equal(await page.locator('.torch-card__title').textContent(), 'शानदार!');
      assert.equal(await page.locator('.torch-card__rule').textContent(), rule);
      assert.equal(await page.locator('.torch-card__hint').count(), 0);
      assert.equal(await page.locator('.torch-card__eyebrow').textContent(), `मशाल यात्रा · दिन ${initial.streak + 1}`);
      const after = await progression(page);
      assert.equal(after.streak, initial.streak + 1);
      assert.equal(after.gamesPlayed, 1, 'Duplicate completion signals must not record twice');
      assert.equal(after.dailyCompleted[id], true);
      await page.locator('.torch-card').scrollIntoViewIfNeeded();
      const bounds = await page.locator('.torch-card').boundingBox();
      assert(bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= viewport.width + 1, 'Card must fit the viewport');
      await page.screenshot({ path: `Doc/review-images/torch-${id}-${viewport.width}.png` });
      // Each new daily game shows a popup and adds a bar; streaks count days.
      assert.equal(await page.locator('.torch-card').count(), 1);
      await page.locator('.torch-card__skip').waitFor({ state: 'visible' });
      await page.locator('.torch-card__skip').click();
      await page.locator('#game-back-btn').click();
      await page.locator('.hub-screen.active').waitFor();
      await page.locator('.hub-header-pill--celebrate').waitFor();
      assert.equal((await page.locator('.hub-header-pill').textContent()).trim(), String(after.streak));
      const second = id === 'niti' ? 'jodo' : 'niti';
      const nextFrame = await openGame(page, second);
      await complete(nextFrame, second);
      await nextFrame.locator(summary[second]).waitFor({ state: 'visible' });
      await page.locator('.torch-popup').waitFor();
      assert.equal(await page.locator('.torch-popup [role=progressbar]').getAttribute('aria-valuenow'), '2');
      assert.equal((await progression(page)).completions, 2);
      assert.equal((await progression(page)).streak, after.streak);
      await page.locator('.torch-card__skip').waitFor({ state: 'visible' });
      await page.locator('.torch-card__skip').click();
      await page.locator('#game-back-btn').click();
      await page.locator('.hub-screen.active').waitFor();
      assert.equal(await page.locator('.hub-screen.active .hub-header-pill--celebrate').count(), 1, 'Each completion queues a hub pulse');
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ id, viewport: viewport.width, completion: true, eachDailyGameAwardsBar: true, mobileFit: true, errors }));
      await page.close();
    }
  }
} finally {
  await browser.close();
  await server?.close();
}
