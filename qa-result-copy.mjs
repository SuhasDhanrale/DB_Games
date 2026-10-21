import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const server = await createServer({ server: { host: '127.0.0.1', port: 5187, strictPort: true, hmr: false, watch: null } });
await server.listen();
const base = 'http://127.0.0.1:5187';
const output = 'tmp/result-copy-after';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const files = { wordal: 'wordal.html', niti: 'niti.html', jodo: 'jodo.html', cricket: 'Superover.html', carrom: 'Carrom_Puzzles.html' };
const selectors = { wordal: '#viewResult', niti: '#step-answer', jodo: '#result-panel', cricket: '#resultModal', carrom: '#modal-backdrop' };
const inventory = [];
const errors = [];

async function open(game, viewport, reducedMotion = 'reduce') {
  // Fixture Shabd before resizing: its existing short-phone board overlaps the
  // keyboard. This suite verifies result layouts, not the gameplay board.
  const playViewport = game === 'wordal' && viewport.height < 700 ? { width: 390, height: 844 } : viewport;
  const page = await browser.newPage({ viewport: playViewport, reducedMotion });
  page.resultViewport = viewport;
  page.on('pageerror', error => errors.push(`${game}: ${error.message}`));
  await page.routeWebSocket('**/*', socket => socket.close());
  await page.goto(`${base}/${files[game]}?day=d1`);
  await page.locator('.gi-play').click();
  await page.evaluate(() => window.gameIntroReady);
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

async function check(page, game, success, variant = 'success') {
  await page.setViewportSize(page.resultViewport);
  const card = page.locator('.result-celebration');
  await card.waitFor({ state: 'visible' });
  assert.equal(await card.getAttribute('data-outcome'), success ? 'success' : 'attempt');
  assert.equal(await card.locator('.result-celebration__check').count(), success ? 1 : 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${game}: no horizontal overflow`);
  const titleBounds = await card.locator('h3').boundingBox();
  assert(titleBounds.y >= 0 && titleBounds.y + titleBounds.height <= page.viewportSize().height, `${game}: outcome is visible above the fold`);
  const moving = await card.evaluate(node => node.classList.contains('is-celebrating'));
  if (moving) {
    await card.locator('.result-celebration__skip').click();
    assert.equal(await card.evaluate(node => node.classList.contains('is-celebrating')), false);
    assert.equal(await card.isVisible(), true, 'Skipping keeps the actual result');
  }
  inventory.push({ game, variant, viewport: page.viewportSize(), text: await page.locator(selectors[game]).innerText() });
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${output}/${game}-${variant}-${page.viewportSize().width}.png` });
}

try {
  for (const viewport of [{ width: 360, height: 640 }, { width: 1280, height: 900 }]) {
    for (const game of Object.keys(files)) {
      const page = await open(game, viewport);
      if (game === 'wordal') await word(page, await page.evaluate(() => window.currentWordalTokens));
      if (game === 'niti') { await page.locator('#opt-btn-opt_1_1').click(); await page.locator('#btn-step1-action').click(); }
      if (game === 'jodo') await pairs(page);
      if (game === 'cricket') await page.evaluate(() => { initMatch(); totalRuns = targetRuns; ballsBowled = 4; endMatch(true); });
      if (game === 'carrom') await page.evaluate(() => { shotsTaken = 1; potted.white = 2; evaluateLevel(); });
      await check(page, game, true);

      if (game === 'wordal') {
        assert.match(await page.locator('.result-celebration__title').textContent(), /1\/6/);
        assert.equal(await page.locator('#resultMeaningText').isVisible(), true);
        await page.locator('#btnReadArticleHere').click();
        await page.locator('#viewArticle.is-active').waitFor();
        assert((await page.locator('#artReaderBody').textContent()).length > 100, 'Full article remains available');
        assert(await page.locator('#artReaderSourcesList a').count() > 0, 'Article sources remain available');
        await page.locator('#btnArticleBackToResult').click();
        assert.equal(await page.locator('.result-celebration.is-celebrating').count(), 0, 'Returning from the story does not replay the celebration');
      }
      if (game === 'niti') {
        assert.equal(await page.locator('#options-grid').isVisible(), false);
        assert.equal(await page.locator('#thought-blank-slot').textContent(), 'उसकी बात सुनने');
        assert.equal(await page.locator('#meaning-reveal-box').isVisible(), true);
        await page.locator('#btn-step1-action').click();
        await page.locator('#step-card.is-active').waitFor();
        assert.match(await page.evaluate(() => document.getElementById('shareCanvas').toDataURL()), /^data:image\/png/);
        await page.locator('#btn-share-primary').click();
        assert.equal(await page.locator('.share-sheet-options button').count(), 3, 'All share options remain available');
        assert.equal(await page.locator('.share-opt-desc').count(), 0);
        await page.screenshot({ path: `${output}/niti-share-${viewport.width}.png` });
      }
      if (game === 'jodo') {
        assert.match(await page.locator('.result-celebration__title').textContent(), /100 अंक/);
        assert.equal(await page.locator('#review-list .review-link').count(), 4);
        assert.equal(await page.locator('#result-edition-label').isVisible(), true);
        assert.match(await page.locator('#result-edition-label').textContent(), /आर्काइव/);
        await page.locator('#review-list .review-link').last().click();
        await page.locator('#article-modal.is-open').waitFor();
        assert((await page.locator('#article-summary').textContent()).length > 30);
        assert.match(await page.locator('#article-body').textContent(), /क्यों मायने रखता है/);
        assert.match(await page.locator('#article-source-note').textContent(), /ISRO/);
        await page.locator('#btn-close-article-top').click();
        await page.locator('#btn-play-again').click();
        assert.equal(await page.locator('.result-celebration').count(), 0, 'Practice clears the old result');
      }
      if (game === 'cricket') {
        assert.equal(await page.locator('#resRuns').textContent(), '18');
        assert.match(await page.locator('#resNarrative').textContent(), /4 गेंद/);
        assert.equal(await page.locator('#resultModal .result-story__label').textContent(), 'असली मैच');
        assert.match(await page.locator('#resMatchStory').getAttribute('href'), /asian-final/);
        assert.equal(await page.locator('#resultModal .modal-subtitle, #resultModal .news-header').count(), 0);
      }
      if (game === 'carrom') {
        assert.match(await page.locator('.result-celebration__title').textContent(), /1 शॉट/);
        assert.equal(await page.locator('#modal-desc').isVisible(), false);
        await page.locator('#modal-btn').click();
        await page.evaluate(() => { shotsTaken = 4; potted.white = 2; evaluateLevel(); });
        assert.match(await page.locator('.result-celebration__body').textContent(), /पहली बार: 1 · सर्वश्रेष्ठ: 4/);
        await page.locator('#modal-btn').click();
        await page.evaluate(() => { shotsTaken = 2; potted.white = 2; evaluateLevel(); });
        assert.match(await page.locator('.result-celebration__body').textContent(), /पहली बार: 1 · सर्वश्रेष्ठ: 2/);
        await check(page, game, true, 'practice');
        await page.evaluate(() => showRulesModal());
        assert.equal(await page.locator('#modal-desc').isVisible(), true, 'Rules still show their description');
      }
      await page.close();
      console.log(`PASS ${game} at ${viewport.width}: clear outcome, retained detail, actions and mobile fit`);
    }
  }

  const viewport = { width: 360, height: 640 };
  let page = await open('wordal', viewport, 'no-preference');
  for (let attempt = 0; attempt < 6; attempt++) { await word(page, Array(5).fill('अ')); await page.waitForTimeout(950); }
  await check(page, 'wordal', false, 'exhausted');
  assert.match(await page.locator('.result-celebration__title').textContent(), /6\/6/);
  await page.close();

  page = await open('niti', viewport, 'no-preference');
  await page.locator('#opt-btn-opt_1_2').click();
  await page.locator('#btn-step1-action').click();
  await check(page, 'niti', false, 'incorrect');
  assert.match(await page.locator('.result-celebration__body').textContent(), /आपने चुना: अपनी राय बनाने/);
  assert.equal(await page.locator('#options-grid').isVisible(), false);
  await page.close();

  page = await open('jodo', viewport, 'no-preference');
  await page.locator('#btn-show-pair').click();
  await pairs(page);
  await check(page, 'jodo', true, 'hinted');
  assert.match(await page.locator('.result-celebration__title').textContent(), /85 अंक/);
  assert.match(await page.locator('.result-celebration__body').textContent(), /संकेत: 1/);
  await page.close();

  for (const role of ['BATTING', 'BOWLING']) {
    page = await open('cricket', viewport, 'no-preference');
    await page.evaluate(role => { initMatch(ROLES[role]); totalRuns = currentRole === ROLES.BATTING ? 0 : targetRuns; ballsBowled = 6; endMatch(false); }, role);
    await check(page, 'cricket', false, `${role.toLowerCase()}-loss`);
    if (role === 'BOWLING') assert.equal(await page.locator('#resRunsLbl').textContent(), 'विपक्ष के रन');
    await page.locator('#resPlayAgainBtn').click();
    await page.evaluate(role => { currentLang = 'en'; initMatch(ROLES[role]); totalRuns = currentRole === ROLES.BATTING ? targetRuns : targetRuns - 1; ballsBowled = 4; endMatch(true); }, role);
    assert.equal(await page.locator('.result-celebration__title').textContent(), 'You won!');
    await page.evaluate(() => { Object.defineProperty(Element.prototype, 'checkVisibility', { configurable: true, value: undefined }); });
    await page.locator('.result-celebration__skip').click();
    assert.equal(await page.locator('.result-celebration.is-celebrating').count(), 0, 'Skipping also works in older WebViews');
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log('PASS incorrect answers, exhausted attempts, hints, both cricket roles, practice comparisons, animation skipping, English and reduced motion');
} finally {
  await writeFile(`${output}/inventory.json`, JSON.stringify(inventory, null, 2));
  await browser.close();
  await server.close();
}
