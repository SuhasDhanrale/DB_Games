import assert from 'node:assert/strict';
import { chromium } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'vite';

const server = await createServer({ server: { host: '127.0.0.1', port: 5194, strictPort: true, hmr: false } });
await server.listen();
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const errors = [];
const clues = {
  d1: 'वैज्ञानिक नई जानकारी पाने के लिए यह करते हैं।',
  d2: 'ऐसा आयोजन जिसमें खिलाड़ी जीतने के लिए एक-दूसरे से मुकाबला करते हैं।',
  d3: 'अतीत की किसी महत्वपूर्ण घटना या जगह को हम ऐसा कहते हैं।',
};
async function openGame(page, day, standalone = false, practice = false) {
  await page.goto(`http://127.0.0.1:5194/${standalone ? 'wordal.html' : ''}?day=${day}${practice ? '&practice=1' : ''}${standalone ? '' : '#/game/wordal'}`);
  await page.locator('.gi-play').click();
  const frame = standalone ? page : await (await page.locator('#game-iframe-wordal').elementHandle()).contentFrame();
  await frame.waitForFunction(() => window.gameIntroReady);
  await frame.evaluate(() => window.gameIntroReady);
  await frame.locator('#viewGame.is-active').waitFor();
  return frame;
}
try {
  for (const viewport of [{width:390,height:844}, {width:360,height:640}, {width:320,height:568}, {width:1280,height:800}]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    page.on('pageerror', e => errors.push(e.message));
    for (const day of ['d1', 'd2', 'd3']) {
      const frame = await openGame(page, day);
      assert.equal(await frame.locator('#headlineBannerTitle').textContent(), clues[day]);
      assert.equal(await frame.locator('#stepPillLabel').textContent(), 'प्रयास 1 / 6');
      assert.equal(await frame.locator('#headlineClueBanner #stepPillLabel').count(), 0);
      assert.equal(await frame.locator('.key-btn').count(), 24);
      assert.equal(await frame.locator('.board-row.is-current').count(), 1);
      const layout = await frame.evaluate(() => {
        const rect = sel => { const r = document.querySelector(sel).getBoundingClientRect(); return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}; };
        const title = document.querySelector('#headlineBannerTitle');
        return {clue:rect('#headlineClueBanner'), meta:rect('.board-meta'), board:rect('#game-board'), keyboard:rect('#keyboardWrapper'), width:innerWidth,height:innerHeight, clipped:title.scrollWidth > title.clientWidth || title.scrollHeight > title.clientHeight};
      });
      assert(!layout.clipped, `${day}: clue clipped`);
      assert(layout.clue.bottom <= layout.meta.top + 1, `clue/meta overlap ${JSON.stringify(layout)}`);
      assert(layout.board.bottom <= layout.keyboard.top + 1, `board/keyboard overlap ${JSON.stringify(layout)}`);
      await frame.locator('#btnSubmitGuess').scrollIntoViewIfNeeded();
      const submit = await frame.locator('#btnSubmitGuess').boundingBox();
      assert(submit && submit.height >= 44, 'submit remains reachable with a usable touch target');
      await frame.locator('#headlineClueBanner').scrollIntoViewIfNeeded();
      assert(layout.clue.left >= 0 && layout.keyboard.right <= layout.width + 1);
      if (viewport.width === 390) await page.screenshot({ path:`tmp/word-clue-${day}-390.png` });
      if (viewport.width === 320 && day === 'd2') await page.screenshot({ path:'tmp/word-clue-d2-320.png' });
    }
    console.log(`PASS all clues and layout at ${viewport.width}x${viewport.height}`);
    await page.close();
  }
  const page = await browser.newPage({viewport:{width:390,height:844}, reducedMotion:'reduce'});
  page.on('pageerror', e => errors.push(e.message));
  const frame = await openGame(page, 'd1');
  await frame.locator('#btnSubmitGuess').click();
  assert.equal(await frame.locator('#stepPillLabel').textContent(), 'प्रयास 1 / 6');
  await frame.locator('[data-key="का"]').click();
  await frame.locator('#btnBackspace').click();
  assert.equal(await frame.locator('#tile-0-0').textContent(), '');
  for (let n=0;n<5;n++) await frame.locator('[data-key="का"]').click();
  await frame.locator('#btnSubmitGuess').click();
  await frame.waitForFunction(() => document.querySelector('#stepPillLabel').textContent === 'प्रयास 2 / 6');
  assert.equal(await frame.locator('#board-row-1.is-current').count(), 1);
  for (const key of ['अ','नु','सं','धा','न']) await frame.locator(`[data-key="${key}"]`).click();
  await frame.locator('#btnSubmitGuess').click();
  await frame.locator('#viewResult.is-active').waitFor();
  assert.equal(await frame.locator('#resultWordDisplay').textContent(), 'अनुसंधान');
  await page.locator('#game-rules-btn').click();
  await frame.locator('#modalHelp.is-open').waitFor();
  assert((await frame.locator('#modalHelp').textContent()).includes('एक बटन एक खाना'));
  console.log('PASS incomplete guess, delete, attempt advance, row highlight, solve and help');
  const practiceFrame = await openGame(page, 'd2', true, true);
  assert.equal(await practiceFrame.locator('#headlineBannerTitle').textContent(), clues.d2);
  assert(await practiceFrame.locator('#practiceBadge').isVisible());
  console.log('PASS standalone practice retains clue and practice badge');
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  await server.close();
}
