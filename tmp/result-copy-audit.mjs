import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const base = 'http://127.0.0.1:5187';
const output = 'tmp/result-copy-audit';
await mkdir(output, { recursive: true });
const server = await createServer({ server: { host: '127.0.0.1', port: 5187, strictPort: true, hmr: false, watch: null } });
await server.listen();
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const files = { wordal: 'wordal.html', niti: 'niti.html', cricket: 'Superover.html', carrom: 'Carrom_Puzzles.html', jodo: 'jodo.html' };
const selectors = { wordal: '#viewResult', niti: '#step-answer', cricket: '#resultModal', carrom: '#modal-backdrop', jodo: '#result-panel' };
const inventory = [];

async function open(game) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.routeWebSocket('**/*', socket => socket.close());
  await page.addInitScript(() => {
    for (const id of ['wordal', 'niti', 'jodo', 'cricket', 'carrom']) localStorage.setItem('db-game-intro:v1:' + id, 'seen');
    localStorage.setItem('db-games:v1:audio:sfx', 'false');
  });
  await page.goto(`${base}/${files[game] || 'index.html'}?day=d1`);
  if (game !== 'hub') {
    await page.locator('.gi-play').waitFor({ state: 'visible' });
    await page.locator('.gi-play').click();
    await page.evaluate(() => window.gameIntroReady);
  }
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

async function capture(page, game, variant = 'success') {
  await page.locator('.result-celebration').waitFor({ state: 'visible' });
  const result = await page.locator(selectors[game]).evaluate(node => ({
    text: node.innerText,
    height: node.getBoundingClientRect().height,
    top: node.getBoundingClientRect().top,
    viewportHeight: innerHeight,
    documentHeight: document.documentElement.scrollHeight,
  }));
  if (game === 'jodo') result.actions = await page.locator('#result-footer').innerText();
  inventory.push({ game, variant, ...result });
  await page.screenshot({ path: `${output}/${game}-${variant}.png`, fullPage: true });
}

try {
  for (const game of Object.keys(files)) {
    const page = await open(game);
    if (game === 'wordal') await word(page, await page.evaluate(() => window.currentWordalTokens));
    if (game === 'niti') {
      await page.locator('#opt-btn-opt_1_1').click();
      await page.locator('#btn-step1-action').click();
    }
    if (game === 'cricket') await page.evaluate(() => { initMatch(); totalRuns = targetRuns; ballsBowled = 4; endMatch(true); });
    if (game === 'carrom') await page.evaluate(() => { shotsTaken = 1; potted.white = 2; evaluateLevel(); });
    if (game === 'jodo') await pairs(page);
    await capture(page, game);
    if (game === 'niti') {
      await page.locator('#btn-step1-action').click();
      await page.screenshot({ path: `${output}/niti-card-studio.png`, fullPage: true });
      await page.locator('#btn-share-primary').click();
      inventory.push({ game, variant: 'share-sheet', text: await page.locator('#share-sheet-backdrop').innerText() });
      await page.screenshot({ path: `${output}/niti-share-sheet.png`, fullPage: true });
    }
    if (game === 'carrom') {
      await page.locator('#modal-btn').click();
      await page.evaluate(() => { shotsTaken = 4; potted.white = 2; evaluateLevel(); });
      await capture(page, game, 'replay');
    }
    await page.close();
  }

  for (const game of ['wordal', 'niti', 'cricket', 'jodo']) {
    const page = await open(game);
    if (game === 'wordal') {
      for (let attempt = 0; attempt < 6; attempt++) {
        await word(page, Array(5).fill('अ'));
        await page.waitForTimeout(950);
      }
    }
    if (game === 'niti') {
      await page.locator('#opt-btn-opt_1_2').click();
      await page.locator('#btn-step1-action').click();
    }
    if (game === 'cricket') await page.evaluate(() => { initMatch(); totalRuns = 0; ballsBowled = 6; endMatch(false); });
    if (game === 'jodo') { await page.locator('#btn-show-pair').click(); await pairs(page); }
    await capture(page, game, 'other-outcome');
    await page.close();
  }

  const hub = await open('hub');
  await hub.locator('.hub-screen.active').waitFor();
  await hub.evaluate(() => { location.hash = '#/game/wordal'; });
  await hub.locator('.gi-play').click();
  const iframe = hub.locator('#game-iframe-wordal');
  await iframe.waitFor();
  const frame = await (await iframe.elementHandle()).contentFrame();
  await frame.evaluate(() => window.gameIntroReady);
  await word(frame, await frame.evaluate(() => window.currentWordalTokens));
  await hub.locator('.torch-popup').waitFor();
  inventory.push({ game: 'shared', variant: 'mashal', text: await hub.locator('.torch-popup').innerText() });
  await hub.screenshot({ path: `${output}/embedded-mashal.png` });
  await hub.locator('.torch-card__skip').click();
  await hub.screenshot({ path: `${output}/embedded-wordal.png` });
  await hub.close();
} finally {
  await writeFile(`${output}/inventory.json`, JSON.stringify(inventory, null, 2));
  await browser.close();
  await server.close();
}
console.log(JSON.stringify(inventory, null, 2));
