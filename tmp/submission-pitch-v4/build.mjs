import fs from 'node:fs/promises';
import path from 'node:path';
import {FileBlob,PresentationFile} from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
process.on('uncaughtException',e=>{console.error(e.stack??String(e));process.exit(1);});
const root='E:/WebGames/Dainik Bhaskar';
const build=path.join(root,'tmp/submission-pitch-v4');
const source=path.join(root,'output/submission-pitch-v3/Dainik Bhaskar Khel - Submission v3.pptx');
await fs.mkdir(path.join(build,'renders'),{recursive:true});
await fs.mkdir(path.join(root,'output/submission-pitch-v4'),{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load(source));
const original=[...p.slides.items];
const inspected=await p.inspect({kind:'slide,textbox,shape,image,table,layout',maxChars:100000});
await fs.writeFile(path.join(build,'source-inspection.ndjson'),inspected.ndjson);
const cover=p.slides.add();cover.background.fill='#F9F9F7';
function text(value,x,y,w,h,size,color='#20201F',bold=false){
 const a=cover.shapes.add({name:value,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=value;a.text.style={typeface:/[\u0900-\u097F]/.test(value)?'Nirmala UI':'Arial',fontSize:size,color,bold,insets:0,autoFit:'none'};
 return a;
}
text('Dainik Bhaskar / दैनिक भास्कर',64,71,1152,53,30,'#C93526',true);
text('GAME LAB 2026',64,132,1152,35,20,'#61605D');
text('दैनिक भास्कर खेल',64,246,1152,126,88,'#20201F',true);
text('Dainik Bhaskar Khel',69,385,1147,77,49,'#20201F',true);
text('One daily play experience, five complementary games',69,498,1137,94,32,'#61605D');
text('खबर से खेल तक, खेल से समझ तक।',69,624,1137,63,33,'#C93526',true);
cover.speakerNotes.text='Dainik Bhaskar Khel / दैनिक भास्कर खेल. A Game Lab 2026 submission proposing one daily play experience containing five complementary games. The next slide introduces ordinary conversations and routines from which the game ideas emerged. The collection name and approved proposition are established project material. Intended engagement benefits remain hypotheses to validate with readers.';
for(let i=0;i<original.length;i++){
 const footer=original[i].shapes.items.find(a=>a.position.left>=1160&&a.position.width<=60&&a.position.top>=670);
 if(footer)footer.text=String(i+2).padStart(2,'0');
}
const order=[cover,...original];
p.slides.reorder(order.map(s=>'sl/'+s.id));
if(p.slides.items.length!==14)throw new Error('Expected 14 slides with cover');
await (await PresentationFile.exportPptx(p)).save(path.join(build,'candidate.pptx'));
for(let i=0;i<order.length;i++){
 const blob=await p.export({slide:order[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,'renders',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
 console.log('Rendered',i+1);
}
const montage=await p.export({format:'png',montage:{columns:3,slideWidth:480,padding:16,gap:16}});
await fs.writeFile(path.join(build,'montage.png'),new Uint8Array(await montage.arrayBuffer()));
