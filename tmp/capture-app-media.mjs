import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const output = path.resolve('output/app-media-2026-10-14');
const games = [
  { id: 'wordal', folder: '01-aaj-ka-shabd', file: 'wordal.html' },
  { id: 'niti', folder: '02-aaj-ki-niti', file: 'niti.html' },
  { id: 'cricket', folder: '03-aaj-ka-over', file: 'Superover.html' },
  { id: 'carrom', folder: '04-aaj-ka-nishana', file: 'Carrom_Puzzles.html' },
  { id: 'jodo', folder: '05-aaj-ki-jodi', file: 'jodo.html' },
];
const server = await createServer({ server: { host: '127.0.0.1', port: 5192, strictPort: true, hmr: false, watch: null } });
await server.listen();
const base = 'http://127.0.0.1:5192';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const errors = [];
const inventory = [];
await mkdir(output, { recursive: true });

async function shot(page, dir, name) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(dir, name), animations: 'disabled' });
  inventory.push({ file: path.relative(output, path.join(dir, name)).replaceAll('\\', '/'), viewport: page.viewportSize(), deviceScaleFactor: 3 });
}
async function word(page, tokens) {
  for (const token of tokens) await page.locator('.key-btn').filter({ hasText: new RegExp('^' + token + '$') }).click();
  await page.locator('#btnSubmitGuess').click();
}
async function gesture(page, selector, from, to, hold = false) {
  const r = await page.locator(selector).boundingBox();
  await page.mouse.move(r.x + r.width * from[0], r.y + r.height * from[1]);
  await page.mouse.down();
  await page.mouse.move(r.x + r.width * to[0], r.y + r.height * to[1], { steps: 12 });
  if (!hold) await page.mouse.up();
}

try {
  for (const game of games) {
    const dir = path.join(output, game.folder);
    await mkdir(dir, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push({ game: game.id, message: error.message }));
    await page.goto(`${base}/${game.file}?day=d1`);
    await page.locator('.gi-dialog .gi-play').waitFor();
    await shot(page, dir, '01-how-to-play.png');
    await page.locator('.gi-dialog .gi-play').click();
    await page.evaluate(() => window.gameIntroReady);
    await page.waitForTimeout(500);
    await shot(page, dir, '00-cover.png');
    const initialText = await page.locator('body').innerText();

    if (game.id === 'wordal') {
      const solution = await page.evaluate(() => window.currentWordalTokens);
      const keys = await page.locator('.key-btn').allTextContents();
      const guess = [...solution];
      guess[0] = keys.map(x => x.trim()).find(x => x && x !== solution[0] && !solution.includes(x));
      await word(page, guess);
      await page.waitForTimeout(700);
      await shot(page, dir, '02-colour-hints.png');
      await word(page, solution);
      await page.locator('#viewResult.is-active').waitFor();
      await page.waitForTimeout(500);
      await shot(page, dir, '03-word-and-meaning.png');
    }
    if (game.id === 'niti') {
      await page.locator('#opt-btn-opt_1_1').click();
      await shot(page, dir, '02-choose-an-answer.png');
      await page.locator('#btn-step1-action').click();
      await page.locator('#meaning-reveal-box').waitFor({ state: 'visible' });
      await page.waitForTimeout(500);
      await shot(page, dir, '03-thought-and-meaning.png');
      await page.locator('#btn-step1-action').click();
      await page.locator('#step-card.is-active').waitFor();
      await shot(page, dir, '04-personalised-card.png');
    }
    if (game.id === 'jodo') {
      const ids = await page.locator('#left-cards-col .card-btn:not(.is-matched)').evaluateAll(nodes => nodes.map(n => n.dataset.pairId));
      for (let i = 0; i < ids.length; i++) {
        await page.locator(`#left-cards-col [data-pair-id="${ids[i]}"]`).click();
        await page.locator(`#right-cards-col [data-pair-id="${ids[i]}"]`).click();
        if (i === 1) {
          await page.waitForTimeout(350);
          await shot(page, dir, '02-making-connections.png');
        }
      }
      await page.locator('#result-panel').waitFor({ state: 'visible' });
      await page.waitForTimeout(500);
      await shot(page, dir, '03-connections-explained.png');
    }
    if (game.id === 'cricket') {
      await page.locator('[data-role="BATTING"]').click();
      await page.locator('#confirmStartBtn').click();
      await page.waitForFunction(() => gameState === STATES.WAITING || gameState === STATES.RUNUP || gameState === STATES.IN_FLIGHT);
      await shot(page, dir, '02-batting.png');
      await page.goto(`${base}/${game.file}?day=d1`);
      await page.locator('.gi-play').click();
      await page.evaluate(() => window.gameIntroReady);
      await page.locator('[data-role="BOWLING"]').click();
      await page.locator('#confirmStartBtn').click();
      await page.waitForTimeout(350);
      await shot(page, dir, '03-bowling.png');
    }
    if (game.id === 'carrom') {
      await page.locator('#position-slider').focus();
      await page.locator('#position-slider').press('ArrowRight');
      await page.locator('#position-slider').press('ArrowRight');
      const x = await page.evaluate(() => strikerBody.position.x / 600);
      await gesture(page, '#gameCanvas', [x, 485 / 600], [x - .065, 560 / 600], true);
      await shot(page, dir, '02-aim-and-power.png');
      await page.mouse.up();
      await page.waitForTimeout(3500);
      await shot(page, dir, '03-after-the-shot.png');
    }
    await writeFile(path.join(dir, 'capture-notes.json'), JSON.stringify({ id: game.id, source: game.file, edition: 'd1', initialText, finalText: await page.locator('body').innerText(), horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) }, null, 2));
    await page.close();
    console.log(`Captured ${game.folder}`);
  }
  const home = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
  await home.goto(`${base}/?day=d1#/`);
  await home.waitForTimeout(700);
  console.log('HOME TEXT', (await home.locator('body').innerText()).slice(0, 2500));
  await shot(home, output, '01-collection-home.png');
  await home.close();
} finally {
  await writeFile(path.join(output, 'capture-manifest.json'), JSON.stringify({ capturedAt: new Date().toISOString(), screenshots: inventory, browserErrors: errors }, null, 2));
  await browser.close();
  await server.close();
}
console.log(JSON.stringify({ output, screenshots: inventory.length, errors }));
