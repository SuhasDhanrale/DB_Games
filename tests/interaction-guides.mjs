import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'vite';

const server = await createServer({ server: { host: '127.0.0.1', port: 5188, strictPort: true, hmr: false } });
await server.listen();
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const base = 'http://127.0.0.1:5188';
const live = '.interaction-guide:not(.interaction-guide--example)';
await mkdir('tmp/interaction-guides', { recursive: true });

async function cue(step) {
  await page.locator(`${live}[data-step="${step}"]:not([hidden])`).waitFor();
  assert.equal(await page.locator(live).evaluate(el => getComputedStyle(el).pointerEvents), 'none');
  assert.equal(await page.locator(`${live} .interaction-guide__finger`).innerText(), '👇');
  assert.equal(await page.locator(`${live} .interaction-guide__finger`).evaluate(el => getComputedStyle(el).transform), 'matrix(-1, 0, 0, -1, 0, 0)');
}
async function noCue() { await page.locator(`${live}:not([hidden])`).waitFor({ state: 'hidden' }); }
async function open(file) {
  await page.goto(`${base}/${file}?day=d1`);
  await page.locator('.gi-dialog .gi-play').click();
  await page.evaluate(() => window.gameIntroReady);
}
async function snapshot(name) {
  await page.locator('.interaction-guide__touch').evaluateAll(elements => elements.forEach(el => el.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 1450; })));
  await page.screenshot({ path: `tmp/interaction-guides/${name}.png` });
}
async function canvasGesture(selector, from, to, hold) {
  const rect = await page.locator(selector).boundingBox();
  await page.mouse.move(rect.x + rect.width * from.x, rect.y + rect.height * from.y);
  await page.mouse.down();
  if (hold) await hold();
  await page.mouse.move(rect.x + rect.width * to.x, rect.y + rect.height * to.y, { steps: 8 });
  await page.mouse.up();
}

try {
  await page.goto(`${base}/Carrom_Puzzles.html?day=d1`);
  await page.locator('.gi-dialog .interaction-guide--example:not([hidden])').waitFor();
  await snapshot('carrom-example-390');
  await page.locator('.gi-play').click();
  await cue('position');
  await snapshot('carrom-position-390');
  // A tap is not a shot; the cue stays available.
  await canvasGesture('#gameCanvas', { x: .5, y: 485 / 600 }, { x: .5, y: 485 / 600 });
  assert.notEqual(await page.evaluate(() => DBJamDemo.getItem('interaction-guide:carrom:shoot')), 'seen');
  await page.locator('#position-slider').focus();
  await page.locator('#position-slider').press('ArrowRight');
  await cue('shoot');
  await snapshot('carrom-pull-390');
  const x = await page.evaluate(() => strikerBody.position.x / 600);
  await canvasGesture('#gameCanvas', { x, y: 485 / 600 }, { x: x - .03, y: 565 / 600 });
  assert.equal(await page.evaluate(() => shotsTaken), 1);
  await noCue();
  assert.equal(await page.evaluate(() => DBJamDemo.getItem('interaction-guide:carrom:shoot')), 'seen');
  console.log('PASS carrom: intro example, positioning, pull, tap safety and shot dismissal');

  await open('Superover.html');
  await noCue();
  await page.locator('[data-role="BATTING"]').click();
  await page.locator('#confirmStartBtn').click();
  await cue('bat');
  await snapshot('cricket-swipe-390');
  await page.waitForFunction(() => gameState === STATES.RUNUP || gameState === STATES.IN_FLIGHT);
  await canvasGesture('#cricketCanvas', { x: .5, y: .72 }, { x: .25, y: .54 });
  await noCue();
  assert.equal(await page.evaluate(() => DBJamDemo.getItem('interaction-guide:cricket:bat')), 'seen');
  console.log('PASS cricket batting: selection screen stays clear, swipe cue and dismissal');

  await open('Superover.html');
  await page.locator('[data-role="BOWLING"]').click();
  await page.locator('#confirmStartBtn').click();
  await cue('bowl');
  await snapshot('cricket-bowl-390');
  await page.evaluate(() => window.openHelpModal());
  await noCue();
  await page.locator('#closeRulesBtn').click();
  await cue('bowl');
  await canvasGesture('#cricketCanvas', { x: .5, y: .48 }, { x: .55, y: .36 }, async () => { await noCue(); });
  await noCue();
  assert.equal(await page.evaluate(() => DBJamDemo.getItem('interaction-guide:cricket:bowl')), 'seen');
  console.log('PASS cricket bowling: drag, release and help pause');

  await open('wordal.html');
  await cue('type');
  await snapshot('wordal-tap-390');
  await page.locator('#btnSubmitGuess').click();
  assert.notEqual(await page.evaluate(() => DBJamDemo.getItem('interaction-guide:wordal:check')), 'seen');
  for (let i = 0; i < 5; i++) await page.locator('.key-btn').first().click();
  await cue('check');
  await snapshot('wordal-check-390');
  await page.locator('#btnSubmitGuess').click();
  await noCue();
  console.log('PASS wordal: tap keys, full-row Check cue and invalid-submit safety');

  await open('niti.html');
  await cue('choose');
  await snapshot('niti-tap-390');
  await page.locator('.opt-card-btn').first().click();
  await cue('check');
  await page.locator('#btn-step1-action').click();
  await noCue();
  console.log('PASS niti: option tap, confirmation cue and result dismissal');

  await open('jodo.html');
  await cue('choose');
  await snapshot('jodo-tap-390');
  await page.locator('.card-btn[data-side="right"]').first().click();
  await cue('partner');
  const pair = await page.locator('.card-btn[data-side="right"].is-selected').getAttribute('data-pair-id');
  await page.locator(`.card-btn[data-side="left"][data-pair-id="${pair}"]`).click();
  await noCue();
  console.log('PASS jodo: either-side tap and partner cue');

  await page.goto(`${base}/?day=d1#/game/carrom`);
  await page.locator('.game-player.active .interaction-guide--example:not([hidden])').waitFor();
  await page.locator('.game-player.active .gi-play').click();
  const frame = await (await page.locator('.game-player.active #game-iframe-carrom').elementHandle()).contentFrame();
  await frame.locator(`${live}:not([hidden])`).waitFor();
  await page.screenshot({ path: 'tmp/interaction-guides/carrom-embedded-390.png' });
  assert.equal(await page.locator('.interaction-guide--example').count(), 0);
  await page.locator('.game-player.active #game-rules-btn').click();
  await frame.locator(`${live}:not([hidden])`).waitFor({ state: 'hidden' });
  await frame.locator('#modal-btn').click();
  await frame.locator(`${live}:not([hidden])`).waitFor();
  // Session memory prevents repeating a learned gesture on return to the game.
  await frame.locator('#position-slider').focus();
  await frame.locator('#position-slider').press('ArrowRight');
  await page.locator('.game-player.active #game-back-btn').click();
  await page.locator('.hub-screen.active').waitFor();
  await page.evaluate(() => { location.hash = '#/game/carrom'; });
  const returned = await (await page.locator('.game-player.active #game-iframe-carrom').elementHandle()).contentFrame();
  await returned.locator(`${live}[data-step="shoot"]:not([hidden])`).waitFor();
  console.log('PASS embedded: one introduction, help pause, cleanup and remembered positioning');

  await page.setViewportSize({ width: 1280, height: 900 });
  await open('Carrom_Puzzles.html');
  await cue('position');
  await snapshot('carrom-position-1280');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.locator('.gi-play').click();
  await cue('position');
  assert.equal(await page.locator(`${live} .interaction-guide__touch`).evaluate(el => getComputedStyle(el).animationName), 'none');
  assert.equal(await page.locator(`${live} .interaction-guide__trail`).count(), 1);
  console.log('PASS desktop and reduced motion: responsive points and static direction cue');
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  await server.close();
}
