import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
process.on('uncaughtException',e=>{console.error(e.stack??String(e));process.exit(1);});
const root='E:/WebGames/Dainik Bhaskar';
const build=path.join(root,'tmp/submission-pitch-v5');
const skill='C:/Users/Suhas/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations';
const source=path.join(root,'output/submission-pitch-v4/Dainik Bhaskar Khel - Submission v4.pptx');
process.env.RUNTIME_NODE_MODULES='C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const result=await finalizePresentation({
 workspaceDir:root,candidatePath:path.join(build,'candidate.pptx'),
 finalPath:path.join(root,'output/submission-pitch-v5/Dainik Bhaskar Khel - Submission v5.pptx'),
 pythonExecutable:'C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 explicitTotalSlideCount:14,
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','5'],
 requiredNativeTableOwnerSlides:[5],
 fontPolicy:{basis:'reference',families:['Arial','Nirmala UI'],referencePath:source,referenceSha256:createHash('sha256').update(await fs.readFile(source)).digest('hex')},
 verifyArtifactToolImport:true,receiptPath:path.join(build,'validation-v5.json')
});
console.log(JSON.stringify({final:result.finalPath,slides:result.presentationLayout.slide_count,findings:result.presentationLayout.finding_count,warnings:result.presentationLayout.warnings}));

