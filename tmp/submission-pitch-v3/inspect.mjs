import fs from 'node:fs/promises';
import {FileBlob,PresentationFile} from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
process.on('uncaughtException',e=>{console.error(e.stack??String(e));process.exit(1);});
const build='E:/WebGames/Dainik Bhaskar/tmp/submission-pitch-v3';
await fs.mkdir(build,{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load('E:/WebGames/Dainik Bhaskar/output/submission-pitch-v2/Dainik Bhaskar Khel - Submission v2.pptx'));
const r=await p.inspect({kind:'slide,textbox,shape,image,table,layout',maxChars:100000});
await fs.writeFile(build+'/source-inspection.ndjson',r.ndjson);
for(const n of [3,7,9,10,12]){
 const s=p.slides.items[n-1];
 console.log(JSON.stringify({slide:n,id:s.id,shapes:s.shapes.items.map(a=>({id:a.id,name:a.name,left:a.position.left,top:a.position.top})),images:s.images.items.map(i=>({id:i.id,alt:i.alt}))}));
}
