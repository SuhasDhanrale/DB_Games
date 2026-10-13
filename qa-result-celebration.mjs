import assert from 'node:assert/strict';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const base = process.env.CELEBRATION_QA_URL || 'http://127.0.0.1:5179';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const files = { hub: 'index.html', wordal: 'wordal.html', niti: 'niti.html', jodo: 'jodo.html', cricket: 'Superover.html', carrom: 'Carrom_Puzzles.html' };
const failures = [];

async function open(game, viewport, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport, reducedMotion });
  page.on('pageerror', error => failures.push(`${game}: ${error.message}`));
  await page.routeWebSocket('**/*', socket => socket.close());
  await page.addInitScript(() => {
    for (const id of ['wordal', 'niti', 'jodo', 'cricket', 'carrom']) localStorage.setItem('db-game-intro:v1:' + id, 'seen');
    localStorage.setItem('db-games:v1:audio:sfx', 'false');
  });
  await page.goto(`${base}/${files[game]}?day=d1`);
  if (game !== 'hub') await page.evaluate(() => window.gameIntroReady);
  return page;
}

async function word(page, tokens) {
  for (const token of tokens) await page.locator('.key-btn').filter({ hasText: new RegExp('^' + token + '$') }).click();
  await page.locator('#btnSubmitGuess').click();
}

async function pairs(page) {
  const ids = await page.locator('#left-cards-col .card-btn:not(.is-matched)').evaluateAll(nodes => nodes.map(node => node.dataset.pairId));
  for (const id of ids) {
    await page.locator(`#left-cards-col [data-pair-id="${id}"]`).click();
    await page.locator(`#right-cards-col [data-pair-id="${id}"]`).click();
  }
}

async function check(page, title, success, screenshot) {
  const card = page.locator('.result-celebration');
  await card.waitFor({ state: 'visible' });
  assert.equal(await card.locator('h3').textContent(), title);
  assert.equal(await card.getAttribute('data-outcome'), success ? 'success' : 'attempt');
  assert.equal(await card.locator('.result-celebration__check').count(), success ? 1 : 0);
  const bounds = await card.boundingBox();
  const viewport = page.viewportSize();
  assert(bounds.x >= 0 && bounds.x + bounds.width <= viewport.width + 1, 'Celebration fits the viewport');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'No horizontal page overflow');
  await card.locator('.result-celebration__skip').click();
  assert.equal(await card.evaluate(node => node.classList.contains('is-celebrating')), false, 'Skip ends motion immediately');
  assert.equal(await card.locator('h3').textContent(), title, 'Skip keeps praise and achievement');
  if (screenshot) await page.screenshot({ path: `Doc/review-images/celebration-${screenshot}-${viewport.width}.png` });
}

try {
  for (const viewport of [{ width: 360, height: 640 }, { width: 1280, height: 900 }]) {
    let page = await open('wordal', viewport);
    await word(page, await page.evaluate(() => window.currentWordalTokens));
    await check(page, 'कमाल!', true, 'wordal');
    await page.reload();
    await page.locator('.result-celebration').waitFor();
    assert.equal(await page.locator('.result-celebration.is-celebrating').count(), 0, 'Restored word result does not replay animation');
    await page.close();

    page = await open('wordal', viewport);
    for (let attempt = 0; attempt < 6; attempt++) {
      await word(page, Array(5).fill('अ'));
      await page.waitForTimeout(950);
    }
    await check(page, 'आपकी कोशिश मायने रखती है', false);
    await page.close();

    page = await open('niti', viewport);
    await page.locator('#opt-btn-opt_1_1').click();
    await page.locator('#btn-step1-action').click();
    await check(page, 'शानदार!', true, 'niti');
    await page.reload();
    await page.locator('.result-celebration').waitFor();
    assert.equal(await page.locator('.result-celebration.is-celebrating').count(), 0, 'Restored Niti result is static');
    await page.close();

    page = await open('niti', viewport);
    await page.locator('#opt-btn-opt_1_2').click();
    await page.locator('#btn-step1-action').click();
    await check(page, 'सीखने का एक मौका', false);
    await page.close();

    page = await open('jodo', viewport);
    await pairs(page);
    await check(page, 'एकदम सही!', true, 'jodo');
    await page.reload();
    await page.locator('.result-celebration').waitFor();
    assert.equal(await page.locator('.result-celebration.is-celebrating').count(), 0, 'Restored Jodo result is static');
    await page.close();

    page = await open('jodo', viewport);
    await page.locator('#btn-show-pair').click();
    await pairs(page);
    await check(page, 'बढ़िया!', true);
    assert.match(await page.locator('.result-celebration__body').textContent(), /संकेत/);
    await page.close();

    page = await open('carrom', viewport);
    await page.evaluate(() => { shotsTaken = 1; potted.white = 1; evaluateLevel(); });
    await check(page, 'कमाल!', true, 'carrom');
    await page.locator('#modal-btn').click();
    assert.equal(await page.locator('.result-celebration').count(), 0, 'Replay clears the old result');
    await page.evaluate(() => { shotsTaken = 4; potted.white = 1; evaluateLevel(); });
    await check(page, 'शानदार!', true);
    assert.match(await page.locator('.result-celebration__body').textContent(), /अभ्यास/);
    await page.reload();
    await page.locator('.result-celebration').waitFor();
    assert.equal(await page.locator('.result-celebration.is-celebrating').count(), 0, 'Restored Carrom result is static');
    await page.close();

    page = await open('cricket', viewport);
    await page.evaluate(() => { initMatch(); totalRuns = targetRuns; ballsBowled = 4; endMatch(true); });
    await check(page, 'शानदार!', true, 'cricket');
    await page.locator('#resPlayAgainBtn').click();
    assert.equal(await page.locator('.result-celebration').count(), 0, 'Cricket replay clears the old result');
    await page.evaluate(() => { initMatch(); totalRuns = 0; ballsBowled = 6; endMatch(false); });
    await check(page, 'आपकी कोशिश मायने रखती है', false);
    await page.reload();
    await page.locator('.result-celebration').waitFor();
    assert.equal(await page.locator('.result-celebration.is-celebrating').count(), 0, 'Restored cricket result is static');
    await page.close();
    console.log(JSON.stringify({ viewport: viewport.width, fiveGames: true, skip: true, accuratePraise: true, restore: true, replay: true, mobileFit: true }));
  }

  const page = await open('cricket', { width: 360, height: 640 }, 'reduce');
  await page.evaluate(() => { currentLang = 'en'; initMatch(); totalRuns = targetRuns; ballsBowled = 4; endMatch(true); });
  await page.locator('.result-celebration').waitFor();
  assert.equal(await page.locator('.result-celebration__title').textContent(), 'Well played!');
  assert.equal(await page.locator('.result-celebration.is-celebrating').count(), 0);
  assert.equal(await page.locator('.result-celebration__skip').isVisible(), false);
  assert.equal(await page.locator('.result-celebration__stamp').evaluate(node => getComputedStyle(node).animationName), 'none');
  await page.close();

  // Verify the same result component inside the hub's iframe shell and mashal flow.
  const hub = await open('hub', { width: 390, height: 844 });
  await hub.locator('.hub-screen.active').waitFor();
  for (const game of ['wordal', 'niti', 'jodo', 'cricket', 'carrom']) {
    await hub.evaluate(game => { location.hash = '#/game/' + game; }, game);
    const iframe = hub.locator(`.game-player.active #game-iframe-${game}`);
    await iframe.waitFor();
    const frame = await (await iframe.elementHandle()).contentFrame();
    await frame.waitForLoadState('load');
    await frame.evaluate(() => window.gameIntroReady);
    if (game === 'wordal') await word(frame, await frame.evaluate(() => window.currentWordalTokens));
    else if (game === 'niti') { await frame.locator('#opt-btn-opt_1_1').click(); await frame.locator('#btn-step1-action').click(); }
    else if (game === 'jodo') await pairs(frame);
    else if (game === 'cricket') await frame.evaluate(() => { initMatch(); totalRuns = targetRuns; ballsBowled = 4; endMatch(true); });
    else await frame.evaluate(() => { shotsTaken = 1; potted.white = 1; evaluateLevel(); });
    await frame.locator('.result-celebration').waitFor();
    if (game === 'wordal') await hub.locator('.torch-popup').waitFor();
    assert.equal(await frame.locator('.result-celebration').count(), 1, 'Only one celebration in each embedded result');
    assert.equal(await hub.locator('.modal-backdrop.visible').count(), 0, 'No second platform result popup');
    await hub.screenshot({ path: `Doc/review-images/celebration-embedded-${game}-390.png` });
    if (game === 'wordal') await hub.locator('.torch-card__skip').click();
    await hub.locator('#game-back-btn').click();
    await hub.locator('.hub-screen.active').waitFor();
  }
  const progression = await hub.evaluate(async () => (await import('/src/systems/progression.js')).getProgression());
  assert.equal(progression.streak, 1, 'Playing five games still earns only one day');
  assert.equal(progression.gamesPlayed, 5, 'All five completions are recorded');
  await hub.close();
  assert.deepEqual(failures, []);
  console.log(JSON.stringify({ english: true, reducedMotion: true, embeddedFiveGames: true, mashal: true, pageErrors: failures }));
} finally {
  await browser.close();
}
