import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const server = process.env.TORCH_QA_URL ? null : await createServer({ server: { host: '127.0.0.1', port: 5186, strictPort: true, hmr: false } });
await server?.listen();
const base = process.env.TORCH_QA_URL || 'http://127.0.0.1:5186';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const errors = [];
async function preparePage(page, lang = 'hi') {
  await page.evaluate(async lang => {
    (await import('/src/i18n/index.js')).setLang(lang);
    for (const id of ['wordal', 'niti', 'jodo', 'cricket', 'carrom']) window.DBJamDemo.setItem('game-intro:' + id, 'seen');
  }, lang);
}
async function openPage(width, reducedMotion = 'no-preference', lang = 'hi') {
  const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion });
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
  await page.routeWebSocket('**/*', socket => socket.close());
  await page.goto(base + '/?day=d1');
  await page.locator('.hub-screen.active').waitFor();
  await preparePage(page, lang);
  return page;
}
async function openGame(page, id) {
  await page.evaluate(id => { location.hash = '#/game/' + id; }, id);
  const iframe = page.locator(`.game-player.active #game-iframe-${id}`);
  await iframe.waitFor();
  const frame = await (await iframe.elementHandle()).contentFrame();
  await frame.waitForLoadState('load');
  await frame.evaluate(() => window.gameIntroReady);
  return frame;
}
async function complete(frame, id) {
  if (id === 'wordal') {
    const tokens = await frame.evaluate(() => window.currentWordalTokens);
    for (const token of tokens) await frame.locator(`.key-btn[data-key="${token}"]`).click();
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
    // Real match result path with an exhausted six-ball fixture.
    await frame.evaluate(() => { initMatch(); totalRuns = 0; ballsBowled = 6; endMatch(false); });
  } else if (id === 'carrom') {
    // Edition 1's real objective completion path with both white coins potted.
    await frame.evaluate(() => { shotsTaken = 3; potted.white = 2; evaluateLevel(); });
  }
}
const journey = page => page.evaluate(async () => (await import('/src/systems/progression.js')).torchJourney());
async function home(page) {
  await page.locator('#game-back-btn').click();
  await page.locator('.hub-screen.active').waitFor();
}
async function dismiss(page) {
  await page.locator('.torch-popup .torch-card__skip').waitFor({ state: 'visible' });
  await page.locator('.torch-popup .torch-card__skip').click();
  assert.equal(await page.locator('.torch-popup').count(), 0);
}
async function assertFit(page, width) {
  const card = page.locator('.torch-popup .torch-card');
  const bounds = await card.boundingBox();
  assert(bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= width + 1);
  assert.equal(await card.evaluate(node => node.scrollWidth > node.clientWidth), false);
}
try {
  const page = await openPage(390);
  await page.locator('#hub-settings').click();
  const name = 'Suhas <img src=x onerror=alert(1)>';
  await page.locator('#settings-player-name').fill(name);
  await page.locator('#settings-player button').click();
  assert.equal(await page.locator('#settings-name-status').textContent(), 'नाम सहेजा गया');
  await page.locator('.modal__close').click();
  await page.locator('#hub-progress').click();
  assert.equal(await page.locator('.torch-card__player').textContent(), name);
  assert.equal(await page.locator('.torch-card img').count(), 0);
  assert.equal(await page.locator('.torch-card__level b').textContent(), '1');
  await page.locator('.modal__close').click();

  for (const [index, id] of ['niti', 'wordal', 'jodo', 'cricket', 'carrom'].entries()) {
    const frame = await openGame(page, id);
    await complete(frame, id);
    try { await page.locator('.torch-popup').waitFor(); }
    catch (error) {
      console.error(JSON.stringify({ id, journey: await journey(page), errors, game: await frame.evaluate(() => ({ resultText: document.body.innerText.slice(-2000), bridge: Boolean(window.DBGameLab) })) }));
      throw error;
    }
    assert.equal((await journey(page)).completions, index + 1, `${id} awards exactly one bar`);
    assert.equal(await page.locator('.torch-popup [role=progressbar]').getAttribute('aria-valuemax'), '5');
    assert.equal(await page.locator('.torch-popup .torch-card__progress > i').count(), 4, 'Five segments');
    assert.equal(await page.locator('.torch-popup').evaluate(node => node.matches(':modal')), true);
    assert.equal(await frame.locator('.torch-card').count(), 0);
    assert.equal(await page.locator('.torch-popup .torch-card__rule').textContent(), 'हर नया दैनिक खेल एक बार जोड़ता है.');
    assert.equal(await page.locator('.torch-popup .torch-card__hint').count(), 0);
    assert.equal(await page.locator('.torch-popup .torch-card__eyebrow').textContent(), 'मशाल यात्रा · दिन 1');
    assert.equal(await page.locator('.torch-popup .torch-card__skip').textContent(), 'Tap to skip');
    if (index < 4) assert.equal(await page.locator('.torch-popup .torch-card__title').textContent(), 'शानदार!');
    await assertFit(page, 390);
    if (index === 0) {
      assert.equal(await page.locator('.torch-popup [role=progressbar]').getAttribute('aria-valuenow'), '1');
      assert.equal(await page.locator('.torch-popup .torch-card__flame').evaluate(node => getComputedStyle(node).animationName), 'torch-flame-feed');
      await page.locator('.torch-popup .torch-card__scene').click();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.torch-popup').count(), 1, 'Early dismissal is blocked');
      await page.setViewportSize({ width: 320, height: 480 });
      await assertFit(page, 320);
      const bounds = await page.locator('.torch-popup').boundingBox();
      assert(bounds.y >= 0 && bounds.y + bounds.height <= 480);
      await page.setViewportSize({ width: 390, height: 844 });
    }
    await page.locator('.torch-popup .torch-card__skip').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.torch-popup [role=progressbar]').getAttribute('aria-valuenow'), String((index + 1) % 5));
    if (index === 0) await page.screenshot({ path: 'tmp/mashal-popup-390.png' });
    if (index === 4) {
      assert.equal(await page.locator('.torch-popup .torch-card__title').textContent(), 'शानदार! नया स्तर!');
      assert.equal(await page.locator('.torch-popup .torch-card__level b').textContent(), '2');
      await page.locator('.torch-popup .torch-card').screenshot({ path: 'tmp/mashal-level-up.png' });
    }
    await dismiss(page);
    if (id === 'cricket') {
      await frame.locator('#resPlayAgainBtn').click();
      await complete(frame, id);
      await page.waitForTimeout(1400);
      assert.equal(await page.locator('.torch-popup').count(), 0, 'Replay cannot earn a bar');
      assert.equal((await journey(page)).completions, 4);
    }
    await home(page);
  }
  assert.deepEqual(await journey(page), { completions: 5, level: 2, progress: 0, goal: 5 });
  await openGame(page, 'carrom');
  await page.waitForTimeout(1400);
  assert.equal(await page.locator('.torch-popup').count(), 0, 'Restored result cannot earn a bar');
  assert.equal((await journey(page)).completions, 5);
  await home(page);
  await page.reload();
  await page.locator('.hub-screen.active').waitFor();
  await preparePage(page);
  assert.equal((await journey(page)).level, 2, 'Refresh preserves Mashal level');
  assert.equal(await page.evaluate(() => window.DBJamDemo.day), 'd2');
  await complete(await openGame(page, 'niti'), 'niti');
  await page.locator('.torch-popup').waitFor();
  assert.equal(await page.locator('.torch-popup .is-feeding').count(), 0, 'Another edition shows progress without another award');
  assert.equal(await page.locator('.torch-popup .is-level-up').count(), 0, 'Previously earned milestones do not celebrate again');
  assert.equal((await journey(page)).completions, 5);
  await dismiss(page);
  await home(page);
  await page.locator('#hub-progress').click();
  assert.equal(await page.locator('.modal .torch-card__level b').textContent(), '2');
  await page.locator('.modal__close').click();
  await page.evaluate(async () => (await import('/src/systems/progression.js')).resetProgression());
  await page.reload();
  assert.equal((await journey(page)).completions, 0);
  await page.close();

  for (const [width, motion, lang] of [[320, 'reduce', 'en'], [1280, 'no-preference', 'en']]) {
    const page = await openPage(width, motion, lang);
    await page.evaluate(async () => {
      const prog = await import('/src/systems/progression.js');
      const today = window.DBJamDemo.calendarDate;
      for (const offset of [1, 2, 4, 7]) {
        const date = new Date(today + 'T12:00:00Z');
        date.setUTCDate(date.getUTCDate() - offset);
        window.DBJamDemo.calendarDate = date.toISOString().slice(0, 10);
        prog.resetDailyChallenges();
        prog.recordGamePlay('niti');
      }
      window.DBJamDemo.calendarDate = today;
      prog.resetDailyChallenges();
    });
    await complete(await openGame(page, 'niti'), 'niti');
    await page.locator('.torch-popup').waitFor();
    assert.equal(await page.locator('.torch-popup .torch-card__title').textContent(), 'Well done! Level up!');
    await assertFit(page, width);
    if (motion === 'reduce') assert.equal(await page.locator('.torch-popup .torch-card__flame').evaluate(node => getComputedStyle(node).animationName), 'none');
    await page.locator('.torch-popup .torch-card__skip').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.torch-popup [role=progressbar]').getAttribute('aria-valuenow'), '0');
    assert.deepEqual(await journey(page), { completions: 5, level: 2, progress: 0, goal: 5 });
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.torch-popup').count(), 0);
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS: popup after all five daily games, five-game level-up, five days with gaps, no replay/restore/edition awards, refresh persistence, reset, name escaping, modal timing, Hindi/English, reduced motion, 320/390/1280px fit.');
} finally {
  await browser.close();
  await server?.close();
}
