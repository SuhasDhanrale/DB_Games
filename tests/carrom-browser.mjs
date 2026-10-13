import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({headless:true, channel:'chrome'});
const base = process.env.CARROM_URL || 'http://127.0.0.1:5173';
const results = [];
try {
 for (const embedded of [false,true]) {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  await context.addInitScript(() => { localStorage.setItem('db-game-intro:v1:carrom','seen'); });
  const page = await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  async function open(day='d1') {
   await page.goto(`${base}/${embedded?'index.html':'Carrom_Puzzles.html'}?day=${day}${embedded?'#/game/carrom':''}`);
   if(embedded) await page.waitForSelector('#game-iframe-carrom');
   const frame=embedded?page.frames().find(f=>f.url().includes('Carrom_Puzzles')):page;
   await frame.waitForFunction(()=>typeof currentLevel!=='undefined' && currentLevel!==null);
   return frame;
  }
  let frame=await open();
  const state=()=>frame.evaluate(()=>JSON.parse(DBJamDemo.getItem(carromStorageKey)));
  // Dispatch real canvas/window mouse handlers. Tiny taps and positioning do not count.
  async function shot() {
   await frame.evaluate(()=>{
    const rect=canvas.getBoundingClientRect(); const x=rect.left+strikerBody.position.x*rect.width/600;const y=rect.top+485*rect.height/600;
    canvas.dispatchEvent(new MouseEvent('mousedown',{clientX:x,clientY:y,bubbles:true}));
    window.dispatchEvent(new MouseEvent('mousemove',{clientX:x,clientY:y+25*rect.height/600,bubbles:true}));
    window.dispatchEvent(new MouseEvent('mouseup',{clientX:x,clientY:y+25*rect.height/600,bubbles:true}));
   });
  }
  // Run the actual engine synchronously to settle a released miss quickly.
  async function settle(){await frame.evaluate(()=>{for(let i=0;i<2000&&gameState==='MOVING';i++){Matter.Engine.update(engine,1000/60);checkGameState();}saveCarromState();});}
  async function pocket(type){await frame.evaluate(type=>{const b=world.bodies.find(b=>b.label===type);Matter.Body.setPosition(b,{x:40,y:40});Matter.Engine.update(engine,1000/60);},type);}
  await frame.evaluate(()=>{handleStart({clientX:0,clientY:0});handleEnd({});});assert.equal((await state()).shots,0);
  await shot();frame=await open();assert.equal((await state()).shots,1);await settle();await shot();await settle();
  let saved=await state();assert.equal(saved.shots,2);assert.equal(saved.completed,false);assert.equal(saved.state,'IDLE');
  assert.equal(saved.pieces.find(p=>p.type==='striker').y,485);
  const coins=saved.pieces.filter(p=>p.type.startsWith('coin_'));
  frame=await open();saved=await state();assert.equal(saved.shots,2);assert.deepEqual(saved.pieces.filter(p=>p.type.startsWith('coin_')),coins);
  // Controlled pocket events cover cumulative progress across separate released shots.
  await shot();await pocket('coin_white');await settle();assert.equal((await state()).potted.white,1);assert.equal((await state()).completed,false);
  frame=await open();assert.equal((await state()).potted.white,1);
  await shot();await pocket('coin_white');await settle();saved=await state();assert.equal(saved.completed,true);assert.equal(saved.firstCompletionShots,4);
  let history=await page.evaluate(()=>JSON.parse(localStorage.getItem('db-games:v1:play-history')));assert.equal(history.filter(x=>x.gameId==='carrom'&&x.mode==='daily').length,1);
  frame=await open();assert.equal((await state()).completed,true);
  await frame.locator('#modal-btn').click();assert.equal((await state()).shots,0);assert.equal((await state()).practice,true);
  await shot();await pocket('coin_white');await settle();await shot();await pocket('coin_white');await settle();saved=await state();assert.equal(saved.bestReplayShots,2);assert.equal(saved.firstCompletionShots,4);
  await frame.locator('#modal-btn').click();await shot();await settle();await shot();await pocket('coin_white');await settle();await shot();await pocket('coin_white');await settle();assert.equal((await state()).bestReplayShots,2);
  history=await page.evaluate(()=>JSON.parse(localStorage.getItem('db-games:v1:play-history')));assert.equal(history.filter(x=>x.gameId==='carrom'&&x.mode==='daily').length,1);assert.equal(history.find(x=>x.mode==='practice').bestDetails.shots,2);
  assert.match(await frame.locator('#modal-desc').innerText(),/कुल शॉट: 3/);
  const scoped=await page.evaluate(async()=>{const {recordResult,getPlayHistory}=await import('/src/systems/play-history.js');recordResult('carrom',100,{mode:'practice',shots:1,challengeId:'OTHER-BOARD',rulesVersion:'multi-shot-v1'});recordResult('carrom',100,{mode:'practice',shots:1,challengeId:'DB-CARROM-DOUBLE-01',rulesVersion:'other-rules'});return getPlayHistory().filter(e=>e.mode==='practice');});
  assert.equal(scoped.length,3);assert.equal(scoped.find(e=>e.details.challengeId==='DB-CARROM-DOUBLE-01'&&e.details.rulesVersion==='multi-shot-v1').bestDetails.shots,2);
  frame=await open('d2');assert.equal((await state()).shots,0);assert.equal((await state()).challengeId,'DB-CARROM-BANK-02');
  await shot();await pocket('coin_black');await settle();saved=await state();assert.equal(saved.shots,1);assert.equal(saved.potted.black,0);assert.equal(saved.pieces.filter(p=>p.type.startsWith('coin_')).length,2);assert.match(await frame.locator('#shot-status').innerText(),/फाउल/);
  await shot();await pocket('striker');await settle();assert.equal((await state()).shots,2);assert.equal((await state()).pieces.find(p=>p.type==='striker').y,485);
  frame=await open('d3');assert.equal((await state()).challengeId,'DB-CARROM-QUEEN-03');assert.equal((await state()).shots,0);
  frame=await open('d1');assert.equal((await state()).shots,3);assert.equal((await state()).firstCompletionShots,4);assert.equal((await state()).bestReplayShots,2);
  assert.deepEqual(errors,[]);results.push(`${embedded?'embedded':'standalone'}: misses, settled reload, cumulative pockets, completion, restored result, better/worse replays, edition isolation, black/striker fouls passed`);
  await page.screenshot({path:`tests/carrom-${embedded?'embedded':'standalone'}.png`});await context.close();
 }
 console.log(results.join('\n'));
} finally {await browser.close();}

