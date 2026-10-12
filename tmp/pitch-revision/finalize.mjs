import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root='E:/WebGames/Dainik Bhaskar';
const build=path.join(root,'tmp/pitch-revision');
const out=path.join(root,'output/pitch-revision');
const skill='C:/Users/Suhas/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations';
const python='C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const candidate=path.join(build,'candidate.pptx');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:path.join(out,'Dainik Bhaskar Daily Games Pitch.pptx'),pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','2','--require-native-table-slide','9','--require-native-table-slide','10'],requiredNativeTableOwnerSlides:[2,9,10],fontPolicy:{basis:'design',families:['Arial','Nirmala UI']},verifyArtifactToolImport:true,receiptPath:path.join(build,'validation.json')});
console.log(JSON.stringify(result));


