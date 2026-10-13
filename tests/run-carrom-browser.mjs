import {spawn} from 'node:child_process';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5187'],{stdio:'pipe',windowsHide:true});
try {await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(d.toString().includes('Local:'))resolve();});server.on('error',reject);});process.env.CARROM_URL='http://127.0.0.1:5187';await import('./carrom-browser.mjs');}finally{server.kill();}
