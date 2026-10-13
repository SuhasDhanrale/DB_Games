import fs from 'node:fs/promises';
import {FileBlob,PresentationFile} from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
process.on('uncaughtException',e=>{console.error(e.stack??String(e));process.exit(1);});
const dir='E:/WebGames/Dainik Bhaskar/tmp/submission-pitch-v5';
await fs.mkdir(dir,{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load('E:/WebGames/Dainik Bhaskar/output/submission-pitch-v4/Dainik Bhaskar Khel - Submission v4.pptx'));
const r=await p.inspect({kind:'slide,textbox,shape,image,table,layout',maxChars:110000});
await fs.writeFile(dir+'/source-inspection.ndjson',r.ndjson);
for(const n of [1,3,5,6,7,9,14]){
 const s=p.slides.items[n-1];
 console.log(JSON.stringify({slide:n,id:s.id,shapes:s.shapes.items.map(a=>({id:a.id,name:a.name,color:a.text.color,fill:a.fill,line:a.line})),tableCount:s.tables.items.length}));
}
