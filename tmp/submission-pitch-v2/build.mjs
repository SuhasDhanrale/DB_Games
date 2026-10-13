import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {FileBlob,PresentationFile} from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
process.on('uncaughtException',error=>{console.error(error.stack??String(error));process.exit(1);});

const root='E:/WebGames/Dainik Bhaskar';
const build=path.join(root,'tmp/submission-pitch-v2');
const out=path.join(root,'output/submission-pitch-v2');
const skill='C:/Users/Suhas/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations';
const source=path.join(root,'output/submission-pitch/Dainik Bhaskar Khel - Submission.pptx');
const python='C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES='C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const C={paper:'#F9F9F7',ink:'#20201F',muted:'#61605D',red:'#C93526',word:'#675579',niti:'#826137',over:'#466853',jodi:'#506D8A',carrom:'#8A554A',pword:'#E9E3EF',pniti:'#F3E6CD',pover:'#E2EBDF',pjodi:'#E3EAF0',pcarrom:'#F1E1DB'};
const brief='Source: supplied Dainik Bhaskar Game Lab 2026 brief, Doc/Dainik Bhaskar Game Lab 2026.pdf, pp. 7, 9, 11 and 13–18. Personas are supplied design context, not independent audience research.';
const rationale='Source: supplied Bhaskar Daily Games Design Rationale.docx, output/design-rationale, 12 October 2026. Proposed benefits and repeat reasons are product hypotheses, not measured retention or comprehension outcomes.';
const games=[['Aaj Ka Shabd','आज का शब्द',C.word],['Aaj Ki Niti','आज की नीति',C.niti],['Aaj Ka Over','आज का ओवर',C.over],['Aaj Ka Nishana','आज का निशाना',C.carrom],['Aaj Ki Jodi','आज की जोड़ी',C.jodi]];

await fs.mkdir(path.join(build,'renders'),{recursive:true});
await fs.mkdir(out,{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load(source));
const sourceInspect=await p.inspect({kind:'slide,textbox,shape,image,table,layout',maxChars:90000});
await fs.writeFile(path.join(build,'source-inspection.ndjson'),sourceInspect.ndjson);
const news=p.slides.items[8];
await saveBlob(path.join(build,'news-before.png'),await p.export({slide:news,format:'png',scale:1}));
p.slides.keep([8]);
console.log('Imported source; retained news journey',news.id);

function text(s,value,x,y,w,h,size=28,color=C.ink,bold=false,align='left'){
 const a=s.shapes.add({name:value.slice(0,52),geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=value;
 a.text.style={typeface:/[\u0900-\u097F]/.test(value)?'Nirmala UI':'Arial',fontSize:size,bold,color,alignment:align,verticalAlignment:'top',autoFit:'none',insets:0};
 return a;
}
function page(title,notes=''){
 const s=p.slides.add();s.background.fill=C.paper;
 text(s,title,64,47,1152,107,44,C.ink,true);
 s.speakerNotes.text=notes;
 return s;
}
function connect(s,a,b,color='#C7C6BF'){
 return s.shapes.connect(a,b,{kind:'elbow',fromSide:'right',toSide:'left',line:{style:'solid',fill:color,width:1.5}});
}
async function picture(s,file,x,y,w,h,caption='',absolute=false){
 const f=absolute?file:path.join(root,'Doc/review-images',file);
 const b=await fs.readFile(f);
 s.images.add({blob:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),contentType:f.endsWith('.jpg')?'image/jpeg':'image/png',alt:caption||'Saved Dainik Bhaskar / दैनिक भास्कर prototype screen',fit:'contain',position:{left:x,top:y,width:w,height:h}});
 if(caption)text(s,caption,x,y+h+12,w,44,18,C.muted);
 s.speakerNotes.text+='\nVisual source: '+(absolute?'built-in imagegen editorial illustration of hypothetical reader moments, '+f:'supplied saved prototype screen, Doc/review-images/'+file)+'.';
}
function rationaleBlock(s,heading,body,x,y,w,color){
 text(s,heading,x,y,w,44,26,color,true);
 text(s,body,x,y+51,w,119,28);
}
function gameTitle(s,en,hi,color){
 text(s,hi,64,127,1145,47,28,color,true);
}
async function saveBlob(file,blob){await fs.writeFile(file,new Uint8Array(await blob.arrayBuffer()));}

// 1. Everyday conversations precede the game ideas. Native editable callouts.
const s1=p.slides.add();s1.background.fill=C.paper;
const voices=[
 ['यार, आख़िरी ओवर में वो गेंद क्यों डाली? भारत को वहाँ कुछ और करना चाहिए था!',66,54,550,183,C.pover],
 ['बचपन में तो हर खेल में अच्छा था… अब खेलने का टाइम ही नहीं मिलता!',669,70,543,174,C.pcarrom],
 ['काम में इतना उलझा रहा कि खबरें ही नहीं पढ़ पाया। आजकल चल क्या रहा है?',98,286,510,177,C.pjodi],
 ['सुबह वाला सुविचार व्हाट्सऐप स्टेटस पर लगाया था। परिवार के ग्रुप में भी भेज दिया।',661,289,551,185,C.pniti],
 ['कोई सवाल अटक जाए, तो जवाब मिले बिना चैन नहीं पड़ता!',307,499,682,108,C.pword],
];
for(const [value,x,y,w,h,fill] of voices){
 const bubble=s1.shapes.add({name:'Illustrative everyday dialogue',geometry:'wedgeRoundRectCallout',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0},adjustmentList:[{name:'adj1',formula:'val -28000'},{name:'adj2',formula:'val 62000'}]});
 bubble.text=value;bubble.text.style={typeface:'Nirmala UI',fontSize:31,color:C.ink,bold:false,verticalAlignment:'middle',alignment:'left',insets:{left:25,right:25,top:15,bottom:26},autoFit:'none'};
}
text(s1,'रोज़मर्रा की बातें। यहीं से शुरू हुए खेलों के विचार।',64,648,1152,55,37,C.red,true,'center');
s1.speakerNotes.text='Opening: ordinary conversations and routines gave us the starting observations. Cricket fans discuss decisions, adults remember childhood skill, busy readers miss updates, an uncle shares a morning thought, and curiosity makes an unanswered question linger. These are illustrative authored dialogues, not quotations from interviewed readers. The cricket line is a hypothetical fan conversation and reports no actual match outcome. Game ideas emerge from these habits later.\n'+brief+'\n'+rationale;

// 2. Establish reader context and the full publisher identity.
const s2=page('The daily news visit already has a place',brief+'\nRajesh follows cricket during commute/lunch/before bed. Neha follows stories useful in class and plays word puzzles. Ram Kishore recognises Carrom and matching on family phones. Mahendra uses smartphones extensively and has action-game experience. Om Prakash has never played mobile games and prefers clear headlines, images and audio. These are overlapping entry points, not five exclusive segments. The illustration represents hypothetical everyday moments.');
text(s2,'Dainik Bhaskar / दैनिक भास्कर',64,151,1152,57,35,C.red,true);
await picture(s2,path.join(build,'assets/reader-day-opening.png'),42,220,1195,398,'',true);
text(s2,'News around work and family',64,617,361,48,25,C.ink,true);
text(s2,'Hindi and familiar interactions',449,617,368,48,25,C.ink,true);
text(s2,'Different comfort with games',848,617,363,48,25,C.ink,true);

// 3. Native selection diagram, with the product hypothesis visible.
const s3=page('Why five games within one daily destination',rationale+'\nThe selection balances language and thought, physical skill and factual discovery. It offers different entry points while retaining a small collection. The five motivations overlap; they are not audience categories or measured clusters. A starting collection of five has not been shown to outperform a single game. Test first starts, completion and voluntary return to determine which formats earn their place.');
const destination=text(s3,'One daily\nplay experience',428,284,341,114,39,C.red,true,'center');
const motives=[['Curiosity',C.word],['Reflection',C.niti],['Excitement',C.over],['Mastery',C.carrom],['Discovery',C.jodi]];
for(let i=0;i<motives.length;i++){
 const a=text(s3,motives[i][0],64,191+i*78,274,55,33,motives[i][1],true);
 connect(s3,a,destination,motives[i][1]);
}
text(s3,'Each format earns its place',840,189,362,75,29,C.ink,true);
text(s3,'A familiar starting point\n\nA distinct, satisfying payoff\n\nRoom to refresh and improve',840,289,362,244,26);
text(s3,'One game is enough to take part.',420,499,365,89,28,C.red,true,'center');
text(s3,'Five is our starting collection. Reader testing should decide what earns a place.',64,638,1152,43,22,C.muted);

// 4. Required native editable comparison table.
const s4=page('Five complementary reasons to play',rationale+'\nShabd centres on solving and meaning. Niti gives a reflective, expressive payoff. Over supplies excitement and timing skill. Nishana provides familiar aiming and visible improvement. Jodi centres on factual relationships and explanations. Complementarity is portfolio range; it does not imply proven cross-game conversion. Current prototypes use curated authored editions. Fresh daily publishing is a planned editorial workflow.');
const values=[
 ['Experience','Everyday entry point','Distinct payoff','Reason to return'],
 ['Aaj Ka Shabd','An unanswered question','Solve and discover meaning','A fresh word\nFewer guesses'],
 ['Aaj Ki Niti','A morning thought to share','Reflection and expression','A fresh thought\nA new conversation'],
 ['Aaj Ka Over','A cricket conversation','Excitement and timing skill','A new situation\nBetter execution'],
 ['Aaj Ka Nishana','Childhood play, little time','Familiar aiming and mastery','A new layout\nFewer shots'],
 ['Aaj Ki Jodi','Catching up with the news','Relationships explained','Fresh verified connections'],
];
const t=s4.tables.add({rows:6,columns:4,left:64,top:160,width:1152,height:475,columnWidths:[239,290,316,307],values});
t.borders.assign({fill:'#DCDAD3',width:0.6});
t.rows[0].height=60;
for(let r=1;r<6;r++)t.rows[r].height=83;
for(let r=0;r<6;r++)for(let c=0;c<4;c++){
 const cell=t.getCell(r,c);cell.fill=r===0?'#EAE9E3':C.paper;
 cell.text.style={typeface:'Arial',fontSize:r===0?23:24,bold:r===0||c===0,color:r===0?C.red:c===0?games[r-1][2]:C.ink};
}
t.cells.block({row:0,column:0,rowCount:6,columnCount:4}).assign({margins:{left:10,right:10,top:10,bottom:8},anchor:'center'});
text(s4,'Quiet reflection, skill play and news discovery give the daily home range.',64,657,1090,42,25,C.red,true);

// 5. Shabd: curiosity -> selected format -> editorial payoff.
const s5=page('Why Aaj Ka Shabd',rationale+'\nThe familiar daily word-puzzle pattern is a design starting point, not an exact-clone proposition or traction claim. Hindi presentation, curated input and editorial meaning make this version relevant to the intended reader. The supplied screen uses an authored space-explainer example, not a current news claim. Return and vocabulary benefits remain hypotheses. Source: wordal.html and supplied rationale.');
gameTitle(s5,'Aaj Ka Shabd','आज का शब्द',C.word);
text(s5,'Curiosity makes a small\nchallenge hard to leave alone.',64,218,715,116,40,C.ink,true);
rationaleBlock(s5,'Why the word-puzzle format','A fresh answer keeps the invitation simple. Hindi lets that curiosity live in the reader’s own language.',64,377,713,C.word);
text(s5,'The payoff continues into meaning\nand a relevant story.',64,572,707,82,29,C.word,true);
await picture(s5,'celebration-wordal-360.png',846,179,319,481,'Prototype example: meaning and a story');

// 6. Niti: personal observation -> an expressive daily ritual.
const s6=page('Why Aaj Ki Niti',rationale+'\nThe personal design observation was an older uncle sharing a morning suvichar on WhatsApp. This is not a demographic research result. A thought-completion interaction encourages reflection before producing a card. A wrong answer still receives meaning and can share. The screen depicts an original demo thought with explicit attribution. Hosted share-to-play invitations are a future integration, not a demonstrated acquisition channel. Source: niti.html.');
gameTitle(s6,'Aaj Ki Niti','आज की नीति',C.niti);
await picture(s6,'niti-card-with-meaning.png',64,202,350,435,'Original demo thought and share card');
text(s6,'An uncle’s morning thought\nalready has somewhere to go.',492,220,709,119,40,C.ink,true);
rationaleBlock(s6,'Why reflection belongs here','The habit is sharing something meaningful with family. Niti adds a moment of participation before that conversation.',492,380,700,C.niti);
text(s6,'A calm, expressive choice.\nA fresh thought for another day.',492,568,695,82,29,C.niti,true);

// 7. Over: sports participation, with practice scope visible.
const s7=page('Why Aaj Ka Over',brief+'\n'+rationale+'\nRajesh follows cricket and plays gully cricket. The fan dialogue illustrates an ordinary discussion, not a factual match claim. The prototype uses authored six-ball practice targets. Those targets and player results are separate from historical match equations and outcomes. Source: Superover.html and Doc/Asian Games 2026 match context.md. This slide reports no actual match scores or results.');
gameTitle(s7,'Aaj Ka Over','आज का ओवर',C.over);
text(s7,'The fan has an opinion.\nA short challenge lets them take part.',64,219,730,133,40,C.ink,true);
rationaleBlock(s7,'Why cricket earns a place','A familiar sports interest offers an immediate invitation. Timing and feedback bring excitement alongside the quieter games.',64,391,716,C.over);
text(s7,'New situations and better execution\ngive the same format room to grow.',64,577,716,80,29,C.over,true);
await picture(s7,'superover-bowling-position.jpg',851,183,316,461,'Prototype: authored six-ball practice');

// 8. Nishana: familiar skill and measurable personal improvement.
const s8=page('Why Aaj Ka Nishana',brief+'\n'+rationale+'\nRam Kishore already plays Carrom on family phones. Familiarity is persona evidence, not a claim about every Indian reader. Current source Carrom_Puzzles.html allows attempts until completion, retains progress after normal misses, counts total shots and records first completion and best replay. This later implementation supersedes the supplied rationale’s older limited-shot statement. The saved board image predates the shot-counter revision and illustrates the play surface. Friend challenges and deeper progression are proposed extensions.');
gameTitle(s8,'Aaj Ka Nishana','आज का निशाना',C.carrom);
await picture(s8,'carrom-flow-mobile.png',69,192,277,466,'Saved prototype board');
text(s8,'Childhood skill still feels familiar.\nA full match needs time and company.',433,216,777,135,39,C.ink,true);
rationaleBlock(s8,'Why a small Carrom challenge','Aiming offers a satisfying physical break. Keep trying to finish, then compare your own shot total on a replay.',433,387,760,C.carrom);
text(s8,'A fresh layout offers variety.\nFewer shots make improvement visible.',433,576,768,86,29,C.carrom,true);

// 9. Jodi: discovery leads into reporting, never substitutes for it.
const s9=page('Why Aaj Ki Jodi',brief+'\n'+rationale+'\nRam Kishore plays basic matching and quizzes; Neha follows stories useful in class. The game proposes a small entry into understanding factual relationships. Matching is not evidence of comprehension improvement, and does not replace reading reporting. Every pair requires a checked source and clear explanation. Current public/jodo-content.js contains authored archive and evergreen packs. The saved result screen is an earlier space archive illustration, not a representation of current pack revision or current news. Planned daily publishing requires editorial review.');
gameTitle(s9,'Aaj Ki Jodi','आज की जोड़ी',C.jodi);
text(s9,'A small connection can make\na news story easier to follow.',64,219,741,130,40,C.ink,true);
rationaleBlock(s9,'Why matching earns a place','One relationship is a manageable starting point. Its explanation can spark curiosity about the reporting behind it.',64,384,719,C.jodi);
text(s9,'Fresh verified pairs broaden the subject.\nRelated reading supplies the depth.',64,577,729,83,29,C.jodi,true);
await picture(s9,'family-jodo-result.jpg',858,184,298,470,'Saved archive example: explanations');

// 10. Retain the strong original news-journey slide and change its page number.
for(const a of news.shapes.items){
 if(a.position.left>=1160&&a.position.width<60){a.text='10';a.position={...a.position,top:686};}
}
news.speakerNotes.text+='\nNarrative: Shabd and Jodi have direct editorial connections. Over uses a sports invitation. A Niti story can enrich a thought when relevant. Nishana is an evergreen break with no forced story link. Current content is curated sample/archive content; live news-app and daily newsroom publishing remain future integration.';

// 11. Native diagram of five choices meeting at one participation record.
const s11=page('Why it feels like one daily experience',rationale+'\nSources: src/screens/hub.js, src/systems/progression.js and Doc/Mashal journey.md. The prototype shares a Hindi home, selected edition and personal participation history. Completion of any one game marks that calendar day. Replays and switching demo editions do not add days. Shared navigation and consistent result language help the experiences belong together. Cross-game movement is an opportunity to test, not a measured behavior.');
text(s11,'Different choices can belong\nto the same daily habit.',64,169,736,98,37,C.ink,true);
const daily=text(s11,'One shared\nday of progress',489,365,286,100,32,C.red,true,'center');
for(let i=0;i<games.length;i++){
 const a=text(s11,games[i][1],64,304+i*59,276,46,27,games[i][2],true);
 connect(s11,a,daily,games[i][2]);
}
text(s11,'Complete any one game.\nReturn through any game.',472,541,320,81,27,C.red,true,'center');
await picture(s11,'home-simplified-360.jpg',892,157,255,494,'The shared Hindi home');

// 12. Daily engagement as systems and proposed development, not a forecast.
const s12=page('The daily engagement system we propose',brief+'\n'+rationale+'\nSources: src/systems/progression.js and Doc/Mashal journey.md. Current shared participation records distinct calendar dates. Earned levels accumulate participation while gaps can reset a consecutive-day streak. There are no coins, fabricated XP or audience retention figures. The prototype has authored selectable editions and Niti cards. Checked current/local publishing, deeper difficulty variation and hosted invitations are planned. Measure first starts, completions, later voluntary returns, useful article engagement, comprehension and editorial effort against an ordinary news journey.');
const mechanisms=[
 ['Freshness','New content or a new layout',C.word],
 ['Mastery','Fewer guesses, better timing, fewer shots',C.over],
 ['Continuity','Personal history and accumulated participation',C.carrom],
 ['Sharing','A Niti card carries the thought into conversation',C.niti],
];
for(let i=0;i<mechanisms.length;i++){
 const y=188+i*80;
 text(s12,mechanisms[i][0],64,y,190,45,29,mechanisms[i][2],true);
 text(s12,mechanisms[i][1],284,y+1,566,62,26);
}
text(s12,'Planned evolution',64,548,738,45,26,C.red,true);
text(s12,'Verified daily publishing, deeper challenge variation\nand hosted invitations from shared cards.',64,594,738,75,25);
await picture(s12,'torch-carrom-390.png',905,169,252,491,'Prototype participation and levels');
text(s12,'A hypothesis to test through voluntary return and useful engagement.',64,688,1060,23,17,C.muted);

// 13. Return to the opening habits and the publisher's proposition.
const s13=page('Dainik Bhaskar / दैनिक भास्कर',rationale+'\nClosing: ordinary habits gave us the starting points. One daily destination gives those interests a short, approachable moment of participation. Reporting supplies context and meaning where useful. Niti can carry a thought into a conversation, while Nishana offers familiar skill play. The five choices form one submission concept. The benefits should earn validation with readers. A brief prototype demonstration can follow this close.');
text(s13,'रोज़मर्रा की आदतों से,\nरोज़ के खेल तक।',64,209,1152,208,72,C.ink,true);
text(s13,'A small moment of participation\nwithin the daily news habit.',64,455,1130,106,36,C.muted);
text(s13,'खबर से खेल तक, खेल से समझ तक।',64,609,1152,69,39,C.red,true);

const order=[s1,s2,s3,s4,s5,s6,s7,s8,s9,news,s11,s12,s13];
p.slides.reorder(order.map(s=>s.id.startsWith('sl/')?s.id:`sl/${s.id}`));
if(p.slides.items.length!==13)throw new Error('Unexpected slide count');
for(let i=0;i<order.length;i++){
 if(i===0||i===9)continue;
 text(order[i],String(i+1).padStart(2,'0'),1172,686,40,24,16,C.muted);
}

const candidate=path.join(build,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
console.log('Exported editable draft, 13 slides');
for(let i=0;i<order.length;i++){
 await saveBlob(path.join(build,'renders',`slide-${String(i+1).padStart(2,'0')}.png`),await p.export({slide:order[i],format:'png',scale:1}));
 const layout=await order[i].export({format:'layout'});
 await fs.writeFile(path.join(build,'renders',`slide-${String(i+1).padStart(2,'0')}.layout.json`),await layout.text());
 console.log('Rendered',i+1);
}
await saveBlob(path.join(build,'montage.png'),await p.export({format:'png',montage:{columns:3,slideWidth:480,gap:16,padding:16}}));
const final=path.join(out,'Dainik Bhaskar Khel - Submission v2.pptx');
if(process.argv.includes('--finalize')){
 const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
 const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),explicitTotalSlideCount:13,layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','4'],requiredNativeTableOwnerSlides:[4],fontPolicy:{basis:'reference',families:['Arial','Nirmala UI'],referencePath:source},verifyArtifactToolImport:true,receiptPath:path.join(build,'validation-v2.json')});
 console.log(JSON.stringify({final:result.finalPath,slides:result.presentationLayout.slide_count,findings:result.presentationLayout.finding_count,warnings:result.presentationLayout.warnings}));
}
