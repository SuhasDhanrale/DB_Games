import fs from 'node:fs/promises';
import path from 'node:path';
import {FileBlob,PresentationFile} from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
process.on('uncaughtException',e=>{console.error(e.stack??String(e));process.exit(1);});
const root='E:/WebGames/Dainik Bhaskar';
const build=path.join(root,'tmp/submission-pitch-v5');
const source=path.join(root,'output/submission-pitch-v4/Dainik Bhaskar Khel - Submission v4.pptx');
const C={paper:'#F9F9F7',ink:'#20201F',muted:'#61605D',accent:'#315A61',word:'#675579',niti:'#826137',over:'#466853',jodi:'#506D8A',carrom:'#526B78'};
await fs.mkdir(path.join(build,'renders'),{recursive:true});
await fs.mkdir(path.join(build,'assets'),{recursive:true});
await fs.mkdir(path.join(root,'output/submission-pitch-v5'),{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load(source));
const original=[...p.slides.items];
const inspected=await p.inspect({kind:'slide,textbox,shape,image,table',maxChars:150000});
const records=inspected.ndjson.split('\n').filter(Boolean).map(l=>JSON.parse(l));
const replacements={'#C93526':C.accent,'#8A554A':C.carrom,'#F1E1DB':'#E3EAEC'};
let recolored=0;
for(const r of records){
 if(r.kind==='textbox'||r.kind==='shape'){
  const a=p.resolve(r.id);
  const tc=replacements[r.style?.color?.toUpperCase()];
  const fc=replacements[r.fillColor?.toUpperCase()];
  const lc=replacements[r.lineColor?.toUpperCase()];
  if(tc){a.text.color=tc;recolored++;}
  if(fc){a.fill=fc;recolored++;}
  if(lc){a.line={fill:lc,width:r.lineWidth??1.5};recolored++;}
 }
}
console.log('Recolored native accents',recolored);
function text(s,value,x,y,w,h,size=28,color=C.ink,bold=false,align='left'){
 const a=s.shapes.add({name:value.slice(0,52),geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=value;a.text.style={typeface:/[\u0900-\u097F]/.test(value)?'Nirmala UI':'Arial',fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',insets:0};return a;
}
function page(title,number,notes){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,64,47,1152,105,44,C.ink,true);
 text(s,String(number).padStart(2,'0'),1172,686,40,24,16,C.muted);
 s.speakerNotes.text=notes;return s;
}
function connect(s,a,b,color=C.accent,width=2.5,arrow=true){return s.shapes.connect(a,b,{kind:'straight',fromSide:'right',toSide:'left',line:{fill:color,width},...(arrow?{tail:{type:'arrow',width:'sm',length:'sm'}}:{})});}
function owned(s,prefix){const a=s.shapes.items.find(a=>a.name.startsWith(prefix));if(!a)throw new Error('Missing inspected shape '+prefix);return a;}
async function save(file,blob){await fs.writeFile(file,new Uint8Array(await blob.arrayBuffer()));}
async function pictureReplace(img,file,alt){const b=await fs.readFile(file);img.replace({blob:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),contentType:'image/png',fit:'contain',alt});}

// Targeted wording changes retain the existing slide composition.
owned(original[2],'News around work and family').text='Politics and local news';
original[2].speakerNotes.text+='\nPolitics and local politics are interests in the supplied Mahendra and Om Prakash personas. This context does not imply political game content.';
owned(original[5],'The payoff continues into meaning').text='The result explains the Hindi word\nand offers the story linked to it.';
owned(original[6],'An uncle’s morning thought').text='A morning sharing ritual\nbecomes a moment of reflection.';
owned(original[6],'The habit is sharing something').text='Completing a familiar सुविचार makes the reader pause on its meaning. The result offers an explanation and a card to share.';
original[6].speakerNotes.text+='\nThe motivation is a familiar morning sharing ritual. It is an illustrative observation, not a claim about all older readers or measured daily sharing behavior.';
const carromFoot=owned(original[8],'A fresh layout offers variety.');
carromFoot.text='One new level each day.\nPlanned: random, checked level generation.';
carromFoot.text.fontSize=27;
original[8].speakerNotes.text+='\nOne daily level is the intended publishing rhythm. Current prototype uses five authored levels with fixed demo-edition mapping. Random level generation is planned and must check playability before publication. No implemented generator is claimed.';

const cardPath=path.join(build,'assets/niti-card-teal.png');
await fs.copyFile('C:/Users/Suhas/.codex/generated_images/01a13475-9ecf-7313-93bd-b81a3c49c769/exec-0c132196-5eab-4502-afa2-627e22872e06.png',cardPath);
await pictureReplace(original[6].images.items[0],cardPath,'Original demo thought and share card, presentation palette variant');
original[6].speakerNotes.text+='\nImage: color-only presentation palette variant of Doc/review-images/niti-card-with-meaning.png, made with built-in imagegen. The Hindi thought, meaning, original-writing label and family attribution are preserved. This is not evidence of an implemented app theme change.';
await fs.writeFile(path.join(build,'assets/niti-palette-provenance.md'),'Built-in imagegen edit, 13 October 2026. Target: Doc/review-images/niti-card-with-meaning.png. Prompt: Preserve all Hindi text, layout, spacing and paper texture. Replace red, rust, orange and coral accents with muted deep teal #315A61 and slate #526B78. Keep ivory paper and charcoal body text. Color-only presentation variant, not a new app feature. Final asset: niti-card-teal.png.\n');
const carromPath=path.join(build,'assets/carrom-palette-preview.png');
await fs.copyFile('C:/Users/Suhas/.codex/generated_images/01a13475-9ecf-7313-93bd-b81a3c49c769/exec-56ef05bc-5653-4440-8e1e-970973030e6d.png',carromPath);
await pictureReplace(original[8].images.items[0],carromPath,'Prototype board: presentation palette preview');
owned(original[8],'Saved prototype board').text='Prototype board: palette preview';
original[8].speakerNotes.text+='\nVisual is an imagegen palette preview derived from the saved prototype board. It represents the existing play surface in the deck palette, not an exact capture or implemented app theme. Red/rust accents changed to teal/slate. Original reference: Doc/review-images/carrom-flow-mobile.png.';
const readerPath=path.join(build,'assets/reader-day-slate.png');
await fs.copyFile('C:/Users/Suhas/.codex/generated_images/01a13475-9ecf-7313-93bd-b81a3c49c769/exec-7d08741c-64fa-42ab-8152-6b4d601af799.png',readerPath);
await pictureReplace(original[2].images.items[0],readerPath,'Hypothetical everyday reader moments, editorial illustration');
original[2].speakerNotes.text+='\nBuilt-in imagegen color edit of the existing hypothetical reader illustration: red/rust/coral cushions and accents changed to slate/teal, composition preserved. It is an illustration, not user research.';
await fs.writeFile(path.join(build,'assets/palette-assets-provenance.md'),'Built-in imagegen edits, 13 October 2026. Carrom target: Doc/review-images/carrom-flow-mobile.png. Prompt: color-only edit retaining Hindi text, board, controls and layout; change red/rust/pink to teal #315A61, slate #526B78 and pale slate #E3EAEC, keep wood and blue striker. Saved carrom-palette-preview.png; a presentation palette preview, not an exact screenshot or implemented theme. Reader target: tmp/submission-pitch-v2/assets/reader-day-opening.png. Prompt: preserve people, poses, phones, composition and watercolor setting, change red/rust/coral upholstery and flags to slate/teal, retain natural skin and lighting. Saved reader-day-slate.png; hypothetical editorial illustration.\n');

// Required comparison table: emphasize what each game contributes, then its return reason.
const t=original[4].tables.items[0];
const gameColors=[C.word,C.niti,C.over,C.carrom,C.jodi];
for(let r=0;r<6;r++)for(let c=0;c<4;c++){
 const cell=t.getCell(r,c);
 cell.fill=r===0?'#DDE7E7':c===2?'#EAF0EE':c===3?'#F0F2ED':C.paper;
 cell.text.style={typeface:'Arial',fontSize:r===0?23:24,bold:r===0||c===0||c===2,color:r===0?C.accent:c===0?gameColors[r-1]:C.ink};
}
t.getCell(0,2).value='What this game adds';
t.getCell(4,3).value='A daily level\nFewer shots';
original[4].speakerNotes.text+='\nMuted fills emphasize distinct payoff and repeat reason. Random Carrom level generation remains planned, as labelled on its individual slide.';

// Rebuild the connection, editorial content, shared experience and return slides.
p.slides.keep([0,1,2,4,5,6,7,8,9,13]);
const s4=page('Five different reasons, one daily destination',4,'The formats cover different motivations rather than five exclusive audience segments. Each contributes a distinct kind of satisfaction. A common daily home and shared Mashal connect the choices. This is the reason for the starting mix of five, not evidence that five is the optimum or that cross-game conversion is proven. Sources: supplied design rationale and organizer brief pp. 9, 13–17.');
const roles=[['Aaj Ka Shabd','Meaning','Curiosity about a Hindi word',C.word],['Aaj Ki Niti','Expression','A thought worth sharing',C.niti],['Aaj Ka Over','Excitement','Cricket interest and timing',C.over],['Aaj Ka Nishana','Mastery','Familiar play and better shots',C.carrom],['Aaj Ki Jodi','Context','Understanding news connections',C.jodi]];
const ys=[186,268,350,432,514];
const bus=s4.shapes.add({name:'Five complementary choices join the same daily home',geometry:'rect',position:{left:894,top:206,width:3,height:350},fill:C.accent,line:{fill:'none',width:0}});
for(let i=0;i<5;i++){
 text(s4,roles[i][0],64,ys[i]+5,246,53,27,roles[i][3],true);
 const payoff=text(s4,roles[i][1],351,ys[i],478,39,29,roles[i][3],true);
 text(s4,roles[i][2],351,ys[i]+38,478,36,23);
 const anchor=s4.shapes.add({name:'Connection to daily home '+roles[i][0],geometry:'rect',position:{left:894,top:ys[i]+20,width:2,height:1},fill:'none',line:{fill:'none',width:0}});
 connect(s4,payoff,anchor,roles[i][3],2.5,false);
}
const target=text(s4,'One daily\nplay home',962,308,250,106,37,C.accent,true);
const anchor=s4.shapes.add({name:'Shared daily destination link',geometry:'rect',position:{left:897,top:360,width:2,height:1},fill:'none',line:{fill:'none',width:0}});
connect(s4,anchor,target,C.accent,3,true);
text(s4,'Choose a game.\nKeep the same Mashal.',962,444,251,86,23,C.muted);
text(s4,'One game is enough to take part.',64,632,1135,47,31,C.accent,true);
text(s4,'Reader testing will establish which formats earn a lasting place.',64,686,1060,24,18,C.muted);

const s11=page('News supplies the content inside the games',11,'These rows show how editorial content becomes playable material in the existing standalone prototypes. Shabd demonstrates the authored answer अनुसंधान with a space explainer, meaning and a related article. Jodi uses sourced mission/achievement relationships in a labelled archive pack. Over uses authored six-ball practice with reporting context and a separate real-match outcome. No tactical simulation or verified live fixture is claimed. Niti may connect a thought to a relevant story; this does not require every thought to follow a headline. Nishana is an evergreen skill break. Current examples are curated demo/sample content; checked daily production publishing is planned. Sources: wordal.html, Jodo.html, SuperOver.html and supplied news revision notes.');
text(s11,'Reporting and context',64,169,329,39,23,C.muted,true);
text(s11,'What becomes playable',456,169,332,39,23,C.muted,true);
text(s11,'What the reader gets',868,169,348,39,23,C.muted,true);
const newsRows=[
 ['Space explainer','Aaj Ka Shabd','अनुसंधान','Word meaning and\nthe story behind it',C.word],
 ['Sourced mission facts','Aaj Ki Jodi','Mission + achievement','A relationship explained\nwith its source',C.jodi],
 ['Cricket match context','Aaj Ka Over','Six-ball practice','Your result beside\nthe real-match context',C.over]
];
for(let i=0;i<3;i++){
 const y=234+i*126;
 const a=text(s11,newsRows[i][0],64,y+42,324,68,28,C.ink,true);
 text(s11,newsRows[i][1],456,y,332,35,24,newsRows[i][4],true);
 const b=text(s11,newsRows[i][2],456,y+42,332,65,i===0?30:27,newsRows[i][4],true);
 const c=text(s11,newsRows[i][3],868,y+38,348,80,26);
 connect(s11,a,b,newsRows[i][4],2.5,true);connect(s11,b,c,newsRows[i][4],2.5,true);
}
text(s11,'Niti: related stories planned. Nishana: an evergreen skill break.',64,625,1152,43,25,C.accent,true);
text(s11,'Curated demo examples today. Checked daily editorial publishing is planned.',64,685,1080,25,18,C.muted);

const s12=page('One experience, even when the choice changes',12,'The current standalone prototypes share a daily home/edition and common Hindi help and result conventions. The implemented Mashal ledger joins completions across all five games. Each game can count at most once per calendar date. Five new daily game completions earn a level, either different games today or the same game on five dates. Switching demo editions, replays, practice and restored results do not add extra bars. The earned level persists in this browser when storage is available; the consecutive-day streak is separate and gaps do not erase levels. Round/result history is current-visit only. Article return preserves the current round/result within the visit. Readers need not finish all five. Sources: current Doc/Mashal journey.md, src/core/mashal-progress.js, src/systems/progression.js and prototype article return behavior.');
const flow=[['One daily home','A familiar place to start\nwith a choice of five games.'],['Choose any game','Different moods can lead\nto different choices.'],['Keep one Mashal','Each new daily completion\nfeeds the same progress.']];
const nodes=[];
for(let i=0;i<3;i++){
 const x=64+i*403;
 nodes.push(text(s12,flow[i][0],x,189,337,47,30,C.accent,true));
 text(s12,flow[i][1],x,252,337,83,26);
}
connect(s12,nodes[0],nodes[1],C.accent,2.5,true);connect(s12,nodes[1],nodes[2],C.accent,2.5,true);
text(s12,'5 new daily completions earn a level',64,386,1152,63,43,C.accent,true);
text(s12,'Each game counts once per day. The reader can spread progress across days.',64,463,1138,44,25);
text(s12,'Continuity without pressure',64,552,520,42,28,C.ink,true);
text(s12,'Earned levels stay. Day streaks are separate.\nFinishing one game is enough to participate.',64,603,543,66,23);
text(s12,'Familiar from game to game',679,552,537,42,28,C.ink,true);
text(s12,'Hindi help and results follow the same pattern.\nReading a story preserves the current result.',679,603,537,66,23);

const s13=page('Reasons to return beyond the first visit',13,'These are engagement hypotheses, not measured return rates. Today offers a complete payoff through solving, understanding or expression. The intended daily publishing rhythm supplies another invitation. Mastery and the persistent shared Mashal offer depth over time. Current editions are authored demos; checked editorial publishing, random validated Carrom level generation and hosted share invitations are future work. Personal round/history storage lasts only the current visit. Assess voluntary return, useful article engagement and editorial effort in a reader pilot. Visuals reuse the existing intro SVG assets, made static and recolored in private copies for the deck.');
const horizons=[['wordal','Today’s payoff','Solve a challenge.\nUnderstand a connection.\nShare a thought.',C.word],['jodo','Tomorrow’s invitation','A fresh word or thought.\nAnother news connection.\nOne new daily level.',C.over],['carrom','Depth over time','Solve with fewer guesses.\nAim with fewer shots.\nGrow the same Mashal.',C.carrom]];
const iconMaps={'#4f46e5':C.word,'#6366f1':'#8B7C99','#27ae60':C.over,'#2563eb':C.jodi,'#9f1239':C.carrom,'#e23a28':C.accent,'#fff0f3':'#E7ECEE','#4b2830':C.ink};
for(let i=0;i<3;i++){
 const x=64+i*402;
 let svg=await fs.readFile(path.join(root,'src/assets/intro',horizons[i][0]+'.svg'),'utf8');
 svg=svg.replace(/<style>[\s\S]*?<\/style>/,'');
 for(const [old,next] of Object.entries(iconMaps))svg=svg.replaceAll(old,next);
 await fs.writeFile(path.join(build,'assets',horizons[i][0]+'-static.svg'),svg);
 s13.images.add({svg,position:{left:x,top:180,width:119,height:119},alt:horizons[i][1],fit:'contain'});
 text(s13,horizons[i][1],x,335,350,50,31,horizons[i][3],true);
 text(s13,horizons[i][2],x,406,350,121,27);
}
text(s13,'Planned evolution',64,580,1152,36,23,C.muted,true);
text(s13,'Checked daily content, random Carrom levels and hosted sharing invitations.',64,625,1152,36,24);
text(s13,'Pilot question: do readers return voluntarily, read useful stories and justify the editorial effort?',64,685,1080,25,18,C.muted);

const order=[original[0],original[1],original[2],s4,original[4],original[5],original[6],original[7],original[8],original[9],s11,s12,s13,original[13]];
p.slides.reorder(order.map(s=>'sl/'+s.id));
if(p.slides.items.length!==14)throw new Error('Slide count changed');
await (await PresentationFile.exportPptx(p)).save(path.join(build,'candidate.pptx'));
console.log('Exported candidate, 14 slides');
for(let i=0;i<14;i++){
 await save(path.join(build,'renders',`slide-${String(i+1).padStart(2,'0')}.png`),await p.export({slide:order[i],format:'png',scale:1}));
 const layout=await order[i].export({format:'layout'});
 await fs.writeFile(path.join(build,'renders',`slide-${String(i+1).padStart(2,'0')}.layout.json`),await layout.text());
 console.log('Rendered',i+1);
}
await save(path.join(build,'montage.png'),await p.export({format:'png',montage:{columns:3,slideWidth:480,padding:16,gap:16}}));
const after=await p.inspect({kind:'slide,textbox,shape,table',maxChars:150000});
await fs.writeFile(path.join(build,'after-inspection.ndjson'),after.ndjson);
