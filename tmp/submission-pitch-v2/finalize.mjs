import path from 'node:path';
import {pathToFileURL} from 'node:url';
process.on('uncaughtException',error=>{console.error(error.stack??String(error));process.exit(1);});
const root='E:/WebGames/Dainik Bhaskar';
const build=path.join(root,'tmp/submission-pitch-v2');
const skill='C:/Users/Suhas/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations';
process.env.RUNTIME_NODE_MODULES='C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const result=await finalizePresentation({
 workspaceDir:root,candidatePath:path.join(build,'candidate.pptx'),
 finalPath:path.join(root,'output/submission-pitch-v2/Dainik Bhaskar Khel - Submission v2.pptx'),
 pythonExecutable:'C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
 integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
 explicitTotalSlideCount:13,
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','4'],
 requiredNativeTableOwnerSlides:[4],
 fontPolicy:{basis:'reference',families:['Arial','Nirmala UI'],referencePath:path.join(root,'output/submission-pitch/Dainik Bhaskar Khel - Submission.pptx'),referenceSha256:'91d7bd9a2553f6998796b82874491ec30e5cd0ff81147dd58f2e9a364db13b2c'},
 verifyArtifactToolImport:true,receiptPath:path.join(build,'validation-v2.json')
});
console.log(JSON.stringify({final:result.finalPath,slides:result.presentationLayout.slide_count,findings:result.presentationLayout.finding_count,warnings:result.presentationLayout.warnings}));
