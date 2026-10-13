import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

// Exercise emitted assets: source-only checks miss srcdoc/file-origin failures.
const targets = (process.env.MASHAL_QA_TARGETS || 'single-file,single-http,dist').split(',');
const scenarios = (process.env.MASHAL_QA_SCENARIOS || 'normal,quick,legacy').split(',');
const games = ['niti', 'wordal', 'jodo', 'cricket', 'carrom'];
const aliases = { niti: 'neeti', cricket: 'superover', carrom: 'carrom_puzzles' };
const replayButtons = { jodo: '#btn-play-again', cricket: '#resPlayAgainBtn', carrom: '#modal-btn' };
const ledgerKey = 'db-games:v1:mashal-completions';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ogg': 'audio/ogg', '.mp3': 'audio/mpeg' };
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });

async function testPage(target, legacy = false) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  if (legacy) await context.addInitScript(() => {
    Object.defineProperty(Element.prototype, 'checkVisibility', { configurable: true, value: undefined });
  });
  const root = resolve(target === 'dist' ? 'dist' : 'build');
  const base = target === 'single-file' ? pathToFileURL(resolve(root, 'index.html')).href
    : target === 'source' ? process.env.MASHAL_QA_URL : 'http://127.0.0.1:5196/index.html';
  assert(base, 'MASHAL_QA_URL is required for the source target');
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (/^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return route.abort();
    if (url.origin !== 'http://127.0.0.1:5196') return route.continue();
    const file = resolve(root, '.' + decodeURIComponent(url.pathname));
    assert(file.startsWith(root + sep), 'Requests must stay within the build directory');
    try {
      const extension = file.slice(file.lastIndexOf('.'));
      await route.fulfill({ contentType: mime[extension] || 'application/octet-stream', body: await readFile(file) });
    } catch { await route.fulfill({ status: 404, body: 'Missing build asset' }); }
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.routeWebSocket('**/*', socket => socket.close());
  return { context, page, errors, base };
}

async function startEdition(test, edition) {
  await test.page.goto(test.base + '?day=' + edition);
  await test.page.locator('.hub-screen.active').waitFor();
  await test.page.evaluate(games => {
    for (const id of games) window.DBJamDemo.setItem('game-intro:' + id, 'seen');
  }, games);
}

async function openGame(page, id) {
  await page.evaluate(id => { location.hash = '#/game/' + id; }, id);
  const iframe = page.locator(`.game-player.active #game-iframe-${id}`);
  await iframe.waitFor();
  const frame = await (await iframe.elementHandle()).contentFrame();
  await frame.waitForLoadState('load');
  await frame.waitForFunction(() => window.gameIntroReady);
  await frame.evaluate(() => window.gameIntroReady);
  return frame;
}

async function complete(frame, id, quick = false) {
  if (id === 'niti') {
    await frame.locator('.opt-card-btn').first().click();
    // Click both actions in one task to reproduce advancing before the popup delay.
    await frame.evaluate(quick => {
      const action = document.getElementById('btn-step1-action');
      action.click();
      if (quick) action.click();
    }, quick);
    if (quick) await frame.locator('#step-card.is-active').waitFor();
  } else if (id === 'wordal') {
    const tokens = await frame.evaluate(() => window.currentWordalTokens);
    for (const token of tokens) await frame.locator(`.key-btn[data-key="${token}"]`).click();
    await frame.locator('#btnSubmitGuess').click();
  } else if (id === 'jodo') {
    const ids = await frame.locator('#left-cards-col .card-btn').evaluateAll(nodes => nodes.map(node => node.dataset.pairId));
    for (const pair of ids) {
      await frame.locator(`#left-cards-col [data-pair-id="${pair}"]`).click();
      await frame.locator(`#right-cards-col [data-pair-id="${pair}"]`).click();
    }
  } else if (id === 'cricket') {
    // Fixture the final score; exercise the actual six-ball result/reporting path.
    await frame.evaluate(() => { initMatch(); totalRuns = 0; ballsBowled = 6; endMatch(false); });
  } else if (id === 'carrom') {
    // Meet each edition's objective; exercise evaluation and completion reporting.
    await frame.evaluate(() => { shotsTaken = 3; potted.white = 2; potted.red = 1; evaluateLevel(); });
  }
}

async function assertPopup(test, expectedBars, awarded, milestone = false) {
  const { page } = test;
  const popup = page.locator('.torch-popup');
  await popup.waitFor({ state: 'visible', timeout: 7000 });
  assert.equal(await popup.count(), 1, 'One popup per completion');
  assert.equal(await popup.evaluate(node => node.matches(':modal')), true, 'Popup appears above the entire game');
  const feeding = await popup.locator('.is-feeding').count();
  assert.equal(feeding, awarded ? 1 : 0, 'Only a new daily completion animates +1');
  if (milestone) assert.match(await popup.locator('.torch-card__title').textContent(), /नया स्तर/);
  if (!awarded) assert.match(await popup.locator('.torch-card__rule').textContent(), /पहले ही गिना/);
  const bounds = await popup.boundingBox();
  assert(bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= 391, 'Popup fits a phone');
  await popup.locator('.torch-card__skip').waitFor({ state: 'visible' });
  assert.equal(await popup.locator('[role=progressbar]').getAttribute('aria-valuenow'), String(expectedBars % 5));
  assert.equal(await popup.locator('.torch-card__level b').textContent(), String(Math.floor(expectedBars / 5) + 1));
  const savedBars = await page.evaluate(key => {
    try { return JSON.parse(localStorage.getItem(key) || '[]').length; } catch { return null; }
  }, ledgerKey);
  if (savedBars !== null) assert.equal(savedBars, expectedBars, 'Built app saves exactly one bar per game per day');
  assert.deepEqual(test.errors, [], 'No browser errors');
  await popup.locator('.torch-card__skip').click();
  await popup.waitFor({ state: 'detached' });
}

async function home(page) {
  await page.locator('.game-player.active #game-back-btn').click();
  await page.locator('.hub-screen.active').waitFor();
}

try {
  for (const target of targets) {
    for (const scenario of scenarios) {
      const test = await testPage(target, scenario === 'legacy');
      try {
        const editions = scenario === 'legacy' ? ['d1'] : ['d1', 'd2', 'd3'];
        for (const edition of editions) {
          await startEdition(test, edition);
          const selected = scenario === 'quick' ? ['niti'] : games;
          for (const [index, id] of selected.entries()) {
            const routeId = edition === 'd2' ? aliases[id] || id : id;
            const frame = await openGame(test.page, routeId);
            await complete(frame, id, scenario === 'quick');
            const expectedBars = scenario === 'quick' ? 1 : edition === 'd1' ? index + 1 : 5;
            await assertPopup(test, expectedBars, edition === 'd1', expectedBars === 5 && edition === 'd1');
            await home(test.page);
            // Opening a saved result must never repeat the popup or daily award.
            const restored = await openGame(test.page, routeId);
            await test.page.waitForTimeout(1250);
            assert.equal(await test.page.locator('.torch-popup').count(), 0, 'Restored results do not celebrate');
            if (scenario === 'normal' && edition === 'd1' && replayButtons[id]) {
              await restored.locator(replayButtons[id]).click();
              await complete(restored, id);
              await test.page.waitForTimeout(1250);
              assert.equal(await test.page.locator('.torch-popup').count(), 0, 'Practice does not celebrate');
              assert.equal(await test.page.evaluate(key => JSON.parse(localStorage.getItem(key) || '[]').length, ledgerKey), expectedBars, 'Practice does not award a bar');
            }
            await home(test.page);
            console.log(`PASS ${target} ${scenario} ${edition} ${routeId}: popup, daily award, dismissal and restoration`);
          }
        }
        if (scenario === 'quick') {
          // Leaving the game before the delay must cancel its pending popup.
          await startEdition(test, 'd1');
          await complete(await openGame(test.page, 'niti'), 'niti', true);
          await home(test.page);
          await test.page.waitForTimeout(1250);
          assert.equal(await test.page.locator('.torch-popup').count(), 0, 'No delayed popup on the hub');
        }
        assert.deepEqual(test.errors, []);
      } catch (error) {
        console.error(JSON.stringify({ target, scenario, errors: test.errors, url: test.page.url(), screen: await test.page.locator('body').innerText().catch(() => '') }));
        throw error;
      } finally { await test.context.close(); }
    }
  }
} finally { await browser.close(); }
