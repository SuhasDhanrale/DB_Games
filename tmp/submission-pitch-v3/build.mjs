import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {FileBlob,PresentationFile} from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
process.on('uncaughtException',e=>{console.error(e.stack??String(e));process.exit(1);});
const root='E:/WebGames/Dainik Bhaskar';
const build=path.join(root,'tmp/submission-pitch-v3');
const source=path.join(root,'output/submission-pitch-v2/Dainik Bhaskar Khel - Submission v2.pptx');
const C={paper:'#F9F9F7',ink:'#20201F',muted:'#61605D',red:'#C93526',word:'#675579',niti:'#826137',over:'#466853',jodi:'#506D8A',carrom:'#8A554A'};
await fs.mkdir(path.join(build,'renders'),{recursive:true});
await fs.mkdir(path.join(root,'output/submission-pitch-v3'),{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load(source));
const original=[...p.slides.items];
const sourceHash=createHash('sha256').update(await fs.readFile(source)).digest('hex');
await fs.writeFile(path.join(build,'source-sha256.txt'),sourceHash);
for(const n of [3,7,9,10,12])await save(path.join(build,`before-${n}.png`),await p.export({slide:original[n-1],format:'png',scale:1}));

function text(s,value,x,y,w,h,size=28,color=C.ink,bold=false,align='left'){
 const a=s.shapes.add({name:value.slice(0,52),geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=value;a.text.style={typeface:/[\u0900-\u097F]/.test(value)?'Nirmala UI':'Arial',fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',insets:0};
 return a;
}
function page(title,number,notes){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,64,47,1152,105,44,C.ink,true);
 text(s,String(number).padStart(2,'0'),1172,686,40,24,16,C.muted);
 s.speakerNotes.text=notes;return s;
}
function connect(s,a,b,color='#C7C6BF',arrow=false){
 return s.shapes.connect(a,b,{kind:'elbow',fromSide:'right',toSide:'left',line:{fill:color,width:1.5},...(arrow?{tail:{type:'arrow',width:'sm',length:'sm'}}:{})});
}
function owned(s,prefix){
 const a=s.shapes.items.find(a=>a.name.startsWith(prefix));
 if(!a)throw new Error('Missing inspected shape: '+prefix);return a;
}
async function picture(s,file,x,y,w,h,caption){
 const b=await fs.readFile(path.join(build,'assets',file));
 s.images.add({blob:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),contentType:'image/png',alt:caption,fit:'contain',position:{left:x,top:y,width:w,height:h}});
 s.speakerNotes.text+='\nImage source: screenshot captured from the local standalone prototype on 13 October 2026, tmp/submission-pitch-v3/assets/'+file+'.';
}
async function save(file,blob){await fs.writeFile(file,new Uint8Array(await blob.arrayBuffer()));}

// Over's motivation remains cricket interest; promise execution rather than strategic simulation.
const over=original[6];
owned(over,'The fan has an opinion.').text='A cricket moment becomes\na short test of execution.';
owned(over,'A familiar sports interest').text='Cricket interest makes the invitation familiar. Six balls of practice add pressure, timing and instant feedback.';
over.speakerNotes.text+='\nThe fan conversation supplies an emotional invitation. Current gameplay demonstrates authored practice and execution, not a simulation of tactical alternatives or verified final-over decision-making. Player outcomes remain separate from actual match outcomes.';

// Jodi's daily relevance is a publishing proposition, illustrated with a sourced archive pack.
const jodi=original[8];
owned(jodi,'One relationship is a manageable').text='A small set of checked relationships gives a reader context. The explanation and source offer a route into the reporting.';
owned(jodi,'Fresh verified pairs').text='Current packs demonstrate the format.\nVerified daily editions are planned.';
const caption=owned(jodi,'Saved archive example');
caption.text='Prototype archive pack: sourced context';
caption.position={left:847,top:666,width:321,height:46};
caption.text.fontSize=17;
const currentArchive=await fs.readFile(path.join(root,'tmp/jodo-d1-390.png'));
const archiveHeight=currentArchive.readUInt32BE(20);
const archiveImage=jodi.images.items[0];
archiveImage.replace({blob:currentArchive.buffer.slice(currentArchive.byteOffset,currentArchive.byteOffset+currentArchive.byteLength),contentType:'image/png',fit:'contain',alt:'Current prototype archive pack with source, date and relationship explanation'});
archiveImage.frame={left:847,top:183,width:321,height:477};
archiveImage.crop={left:0,top:0,right:0,bottom:1-650/archiveHeight};
jodi.speakerNotes.text+='\nVisual source for this revision: supplied tmp/jodo-d1-390.png, current curated archive pack with visible source/date details. The frame crops to the introduction and first complete relationship, preserving its explanation and source. Daily current-affairs relevance depends on the planned editorial workflow. No comprehension uplift is claimed.';

// Replace only three slides, retaining the other ten source slides.
p.slides.keep([0,1,3,4,5,6,7,8,10,12]);
const s3=page('Five entry points into one daily news habit',3,'The five formats have distinct jobs within the publisher’s daily experience. Shabd offers word curiosity and meaning; Jodi explains relationships; Over adds cricket participation; Niti carries a thought into conversation; Nishana provides a familiar personal challenge. The shared home and progress connect choices. These intended contributions explain the starting collection, not a proven optimum or evidence of cross-game conversion. Reader testing should establish each contribution.\nSources: supplied design rationale, organizer brief pp. 7, 9, 11, 13–17, and prototype shared home/progression.');
const roles=[
 ['Aaj Ka Shabd','Word curiosity becomes meaning\nand related reading.',C.word],
 ['Aaj Ki Niti','A morning thought becomes\na conversation worth sharing.',C.niti],
 ['Aaj Ka Over','Cricket interest becomes\nparticipation and excitement.',C.over],
 ['Aaj Ka Nishana','Familiar play becomes\na personal skill challenge.',C.carrom],
 ['Aaj Ki Jodi','A relationship becomes context\nand related reading.',C.jodi]
];
const home=text(s3,'One daily\nnews habit',939,319,267,132,38,C.red,true,'center');
for(let i=0;i<roles.length;i++){
 const y=180+i*82;
 text(s3,roles[i][0],64,y+3,245,67,27,roles[i][2],true);
 const purpose=text(s3,roles[i][1],332,y,503,71,27);
 connect(s3,purpose,home,roles[i][2]);
}
text(s3,'The reader can switch games and keep the same daily habit.',64,628,1128,50,29,C.red,true);
text(s3,'Five is our starting mix. A reader pilot will establish each game’s contribution.',64,688,1060,24,18,C.muted);

// Four-step visual journey. The first invitation is explicitly proposed.
const s10=page('A news visit can lead to play and deeper reading',10,'The first step is a proposed spoiler-free invitation within the Dainik Bhaskar / दैनिक भास्कर app. The local sample feed currently offers article links, not this direct neutral game invitation. The next three frames show the implemented standalone Shabd challenge, its result with meaning and related story, and the in-file article reader. The screenshot demonstration used the authored answer to complete one sample round; it represents a walkthrough, not audience performance. Clicking back returned to the same result. The sample article is sourced reference content, not a current report published by Dainik Bhaskar / दैनिक भास्कर.\nSources: news.html and wordal.html. Article reading remains optional; the invitation should not reveal the answer.');
text(s10,'Proposed app entry, illustrated with prototype sample content',64,144,1140,42,22,C.muted);
const steps=[
 ['01','News visit','journey-news-feed.png','Proposed invitation:\nआज का शब्द खेलें',C.red],
 ['02','Hindi challenge','journey-shabd-play.png','A brief challenge\nin the reader’s language',C.word],
 ['03','Meaning and context','journey-shabd-result.png','A result with meaning\nand a relevant story',C.word],
 ['04','Optional reading','journey-shabd-article.png','Read, then return\nto the saved result',C.red]
];
const headings=[];
for(let i=0;i<steps.length;i++){
 const x=64+i*299;
 text(s10,steps[i][0],x,199,37,35,20,steps[i][4],true);
 headings.push(text(s10,steps[i][1],x+43,193,222,53,23,C.ink,true));
 await picture(s10,steps[i][2],x+6,252,245,345,steps[i][1]+': actual standalone prototype screen');
 text(s10,steps[i][3],x,610,260,65,21,steps[i][4],i===0);
}
for(let i=0;i<3;i++)connect(s10,headings[i],headings[i+1],'#CBC9C1',true);
text(s10,'A small achievement, connected to useful context.',64,683,1060,29,21,C.red,true);

// Daily engagement has horizons; depth and publishing remain honestly scoped.
const s12=page('Reasons to return beyond the first visit',12,'The proposed engagement system combines a satisfying payoff, a fresh invitation and depth through mastery and continuity. These are hypotheses to test rather than forecasts. The prototype currently has authored selectable editions, personal results, Niti cards and shared participation history/levels. Future production work includes checked daily/current publishing, deeper challenge variation and hosted share invitations. A reader may choose a different game on another day while retaining the same home and participation history. This does not demonstrate actual cross-game return behavior.\nPilot question: compare voluntary return days and meaningful article engagement with the ordinary news journey, while monitoring completion, clarity and editorial effort.\nSources: supplied organizer brief p. 9, design rationale, src/systems/progression.js and Doc/Mashal journey.md.');
const horizons=[
 ['Today’s payoff','Finish something satisfying,\nunderstand a connection\nor share a thought.',C.word],
 ['Tomorrow’s invitation','A fresh word, thought,\nverified connection,\nsituation or layout.',C.over],
 ['Depth over time','Improve performance,\nretain personal history,\nexplore varied challenges.',C.carrom]
];
const horizonLabels=[];
for(let i=0;i<horizons.length;i++){
 const x=64+i*402;
 horizonLabels.push(text(s12,horizons[i][0],x,200,347,55,31,horizons[i][2],true));
 text(s12,horizons[i][1],x,287,350,148,27);
}
connect(s12,horizonLabels[0],horizonLabels[1],'#C7C6BF',true);
connect(s12,horizonLabels[1],horizonLabels[2],'#C7C6BF',true);
text(s12,'Shabd today. Nishana tomorrow.\nBoth visits belong to the same daily experience.',64,472,1152,85,31,C.red,true);
text(s12,'Planned development',64,584,1140,36,23,C.muted,true);
text(s12,'Daily publishing, deeper challenge variation and hosted sharing invitations.',64,625,1142,36,23);
text(s12,'Pilot test: voluntary return, useful article engagement and manageable editorial effort.',64,688,1060,24,18,C.muted);

const order=[original[0],original[1],s3,original[3],original[4],original[5],over,original[7],jodi,s10,original[10],s12,original[12]];
p.slides.reorder(order.map(s=>'sl/'+s.id));
if(order.length!==13||p.slides.items.length!==13)throw new Error('Slide count changed');
await (await PresentationFile.exportPptx(p)).save(path.join(build,'candidate.pptx'));
console.log('Exported revision, 13 slides');
for(let i=0;i<order.length;i++){
 await save(path.join(build,'renders',`slide-${String(i+1).padStart(2,'0')}.png`),await p.export({slide:order[i],format:'png',scale:1}));
 const layout=await order[i].export({format:'layout'});
 await fs.writeFile(path.join(build,'renders',`slide-${String(i+1).padStart(2,'0')}.layout.json`),await layout.text());
 console.log('Rendered',i+1);
}
await save(path.join(build,'montage.png'),await p.export({format:'png',montage:{columns:3,slideWidth:480,padding:16,gap:16}}));
