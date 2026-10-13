import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const sandbox={};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('public/vendor/matter-0.19.0.min.js','utf8'),sandbox);
const M=sandbox.Matter;
const html=fs.readFileSync('Carrom_Puzzles.html','utf8');
const levels=vm.runInContext(html.match(/const LEVELS = (\[[\s\S]*?\n        \]);/)[1],sandbox);
function simulate(coins,x,angle,speed){
 const engine=M.Engine.create({gravity:{x:0,y:0,scale:0}}),world=engine.world;
 const wall={isStatic:true,label:'wall',restitution:.9,friction:0};
 M.World.add(world,[M.Bodies.rectangle(300,17.5,600,35,wall),M.Bodies.rectangle(300,582.5,600,35,wall),M.Bodies.rectangle(582.5,300,35,600,wall),M.Bodies.rectangle(17.5,300,35,600,wall)]);
 const bodies=coins.map(c=>M.Bodies.circle(c.x,c.y,15,{label:c.type,restitution:.9,friction:0,frictionAir:.015,density:.005}));
 if(coins.some(c=>Math.hypot(c.x-x,c.y-485)<36))return null;
 const striker=M.Bodies.circle(x,485,20,{label:'striker',restitution:.9,friction:0,frictionAir:.012,density:.012});M.World.add(world,[...bodies,striker]);M.Body.setVelocity(striker,{x:Math.cos(angle)*speed,y:Math.sin(angle)*speed});
 const p={white:0,black:0,red:0,striker:0};
 for(let t=0;t<900;t++){
  M.Engine.update(engine,1000/60);
  for(const b of world.bodies.filter(b=>!b.isStatic))if([[40,40],[560,40],[40,560],[560,560]].some(([x,y])=>Math.hypot(b.position.x-x,b.position.y-y)<24)){p[b.label]++;M.World.remove(world,b);}
  if(t>30&&world.bodies.every(b=>b.isStatic||b.speed<=.05))break;
 }
 return {p,coins:world.bodies.filter(b=>!b.isStatic&&b.label!=='striker').map(b=>({x:b.position.x,y:b.position.y,type:b.label}))};
}
for(const level of levels.slice(0,3)){
 let coins=level.coins,p={white:0,black:0,red:0,striker:0},shots=[];
 for(let round=0;round<4&&level.check(p)!=='win';round++){
  let choice;
  outer:for(let x=150;x<=450;x+=25)for(let degrees=-175;degrees<=-5;degrees+=2.5)for(const speed of [8,16,24]){
   const result=simulate(coins,x,degrees*Math.PI/180,speed);
   if(!result||result.p.black||result.p.striker||!(result.p.white||result.p.red))continue;
   choice={...result,x,degrees,speed};break outer;
  }
  assert.ok(choice,`${level.challengeId} needs an achievable shot at round ${round}`);
  coins=choice.coins;for(const key of Object.keys(p))p[key]+=choice.p[key];shots.push({x:choice.x,angle:choice.degrees,speed:choice.speed});
 }
 assert.equal(level.check(p),'win');console.log(`${level.challengeId} achievable: ${JSON.stringify(shots)}`);
}
