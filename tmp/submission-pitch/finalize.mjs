import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const root='E:/WebGames/Dainik Bhaskar';
const build=path.join(root,'tmp/submission-pitch');
const out=path.join(root,'output/submission-pitch');
const skill='C:/Users/Suhas/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations';
const python='C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES='C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';

const candidate=path.join(build,'candidate.pptx');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const r=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:path.join(out,'Dainik Bhaskar Khel - Submission.pptx'),pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','11'],requiredNativeTableOwnerSlides:[11],fontPolicy:{basis:'design',families:['Arial','Nirmala UI']},verifyArtifactToolImport:true,receiptPath:path.join(build,'validation-full-name.json')});
console.log(JSON.stringify({final:r.finalPath,slides:r.presentationLayout.slide_count,findings:r.presentationLayout.finding_count,warnings:r.presentationLayout.warnings}));


