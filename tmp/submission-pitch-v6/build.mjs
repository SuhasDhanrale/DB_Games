import fs from 'node:fs/promises';
import path from 'node:path';
import {FileBlob,PresentationFile} from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
process.on('uncaughtException',e=>{console.error(e.stack??String(e));process.exit(1);});
const root='E:/WebGames/Dainik Bhaskar';
const dir=path.join(root,'tmp/submission-pitch-v6');
await fs.mkdir(path.join(dir,'renders'),{recursive:true});
await fs.mkdir(path.join(root,'output/submission-pitch-v6'),{recursive:true});
const source=path.join(root,'output/submission-pitch-v5/Dainik Bhaskar Khel - Submission v5.pptx');
const p=await PresentationFile.importPptx(await FileBlob.load(source));
const s=p.slides.items[1];
async function save(file,blob){await fs.writeFile(file,new Uint8Array(await blob.arrayBuffer()));}
await save(path.join(dir,'before.png'),await p.export({slide:s,format:'png',scale:1}));
await fs.writeFile(path.join(dir,'before-inspection.ndjson'),(await p.inspect({kind:'slide,textbox,shape,layout',maxChars:150000})).ndjson);
const bubbles=s.shapes.items.filter(a=>a.name==='Illustrative everyday dialogue');
if(bubbles.length!==5)throw new Error('Expected five inspected dialogue bubbles');
const names=['राजेश वर्मा, 36 वर्ष','राम किशोर वर्मा, 43 वर्ष','महेंद्र मीणा, 35 वर्ष','ओम प्रकाश मौर्य, 53 वर्ष','नेहा यादव, 28 वर्ष'];
const colors=['#466853','#526B78','#506D8A','#826137','#675579'];
function text(value,x,y,w,h,size,color,bold=false){
 const a=s.shapes.add({name:value,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=value;a.text.style={typeface:'Nirmala UI',fontSize:size,bold,color,alignment:'left',verticalAlignment:'top',autoFit:'none',insets:0};return a;
}
for(let i=0;i<5;i++){
 const a=bubbles[i];
 if(i===4)a.position={...a.position,top:491,height:130};
 a.text.style={typeface:'Nirmala UI',fontSize:30,color:'#20201F',bold:false,alignment:'left',verticalAlignment:'top',autoFit:'none',insets:{left:25,right:25,top:49,bottom:17}};
 text(names[i],a.position.left+25,a.position.top+13,a.position.width-50,30,21,colors[i],true);
}
const closing=s.shapes.items.find(a=>a.name.startsWith('रोज़मर्रा की बातें।'));
if(!closing)throw new Error('Missing closing line');
closing.position={...closing.position,top:646,height:45};closing.text.fontSize=34;
const note=text('काल्पनिक संवाद, दिए गए पाठक व्यक्तित्वों से प्रेरित।',64,693,1152,25,18,'#61605D');
note.text.alignment='center';
s.speakerNotes.text+='\nVersion 6: labels use names and ages from the organizer brief, pp. 13–17: Rajesh Verma 36, Ram Kishore Verma 43, Mahendra Meena 35, Om Prakash Maurya 53 and Neha Yadav 28. Dialogue mapping is illustrative design storytelling, not actual quotations, interviews or verified behavior of these individuals. A visible Hindi caption makes that clear. Existing dialogue wording is unchanged. Source: Doc/Dainik Bhaskar Game Lab 2026.pdf.';
if(p.slides.items.length!==14)throw new Error('Slide count changed');
await (await PresentationFile.exportPptx(p)).save(path.join(dir,'candidate.pptx'));
for(let i=0;i<14;i++){
 await save(path.join(dir,'renders',`slide-${String(i+1).padStart(2,'0')}.png`),await p.export({slide:p.slides.items[i],format:'png',scale:1}));
}
await save(path.join(dir,'montage.png'),await p.export({format:'png',montage:{columns:3,slideWidth:480,padding:16,gap:16}}));
const layout=await s.export({format:'layout'});
await fs.writeFile(path.join(dir,'slide-02.layout.json'),await layout.text());
console.log('Built and rendered 14 slides; updated dialogue labels only.');
