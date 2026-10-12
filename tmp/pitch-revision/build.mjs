import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from 'file:///C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const root='E:/WebGames/Dainik Bhaskar';
const build=path.join(root,'tmp/pitch-revision');
const out=path.join(root,'output/pitch-revision');
const skill='C:/Users/Suhas/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations';
const python='C:/Users/Suhas/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={bg:'#F9F9F7',ink:'#20201F',muted:'#62625E',red:'#C93526'};
const brief='Source: supplied Doc/Dainik Bhaskar Game Lab 2026.pdf, pp. 7, 9–11, 13–18. This is the organizer brief. The separate root-level GBL document is a project design document, not a requirement to submit five games.';
const basis='Design basis: user feedback of 13 October 2026 and Doc/Bhaskar Daily Games Design Rationale.md. Proposed benefits remain hypotheses. No player testing or measured retention results are available.';
function text(s,txt,x,y,w,h,size=26,color=C.ink,bold=false,font='Arial'){
 const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=txt;a.text.style={typeface:/[\u0900-\u097F]/.test(txt)?'Nirmala UI':font,fontSize:size,color,bold};return a;
}
function slide(title,notes=''){
 const s=p.slides.add();s.background.fill=C.bg;
 text(s,title,64,52,1152,105,44,C.ink,true);
 text(s,String(p.slides.items.length).padStart(2,'0'),1170,669,45,24,16,C.muted);
 s.speakerNotes.text=notes;return s;
}
function para(s,label,body,y,w=720){text(s,label,64,y,w,35,27,C.red,true);text(s,body,64,y+43,w,84,26);}
async function shot(s,file,x=894,y=168,w=250,h=466){
 const data=await fs.readFile(path.join(root,'Doc/review-images',file));
 s.images.add({blob:data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),contentType:file.endsWith('.png')?'image/png':'image/jpeg',alt:'Existing prototype reference',fit:'contain',position:{left:x,top:y,width:w,height:h}});
 text(s,'Existing prototype reference',x-26,641,w+52,25,16,C.muted);
}
function table(s,values,widths,y=180,rowH=66){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:64,top:y,width:1152,height:values.length*rowH,columnWidths:widths,values});
 t.borders.assign({fill:'#D9D8D2',width:0.7,style:'solid'});
 for(let r=0;r<values.length;r++)for(let c=0;c<values[0].length;c++){
  const cell=t.getCell(r,c);cell.fill=r===0?'#EAE9E3':C.bg;
  cell.text.style={typeface:'Arial',fontSize:r===0?22:23,color:r===0?C.red:C.ink,bold:r===0};
 }
 return t;
}

{
const s=p.slides.add();s.background.fill=C.bg;
text(s,'DAINIK BHASKAR',64,72,900,46,27,C.red,true);
text(s,'Daily games\nfor the news reader',64,204,1152,190,68,C.ink,true);
text(s,'Five proposed experiences, with a clear reason for each',68,431,1060,84,31,C.muted);
text(s,'Pitch review   /   13 October 2026',68,617,850,35,22,C.muted);
s.speakerNotes.text=basis+'\nPresenter: We are proposing a small daily collection. The first three concepts have clearer roles today. This pitch explains what Carrom and Jodi must add to justify the extra scope.';
}
{
const s=slide('Why five games?',brief+'\n'+basis+'\nFive is a portfolio hypothesis. The brief asks for a game for a news platform, not five games. Cricket and Carrom overlap in skill play. Carrom must show an audience or return benefit beyond cricket. Jodi must demonstrate understanding beyond a summary.');
text(s,'Each addition must serve a need the others leave open.',64,156,1152,54,28,C.muted);
table(s,[['Game','Reader’s reason','Contribution to test'],['Aaj Ka Shabd','Solve a Hindi word','Curiosity about a story'],['Aaj Ki Niti','Complete a thought worth sharing','Reflection and sharing'],['Aaj Ka Over','Play a cricket pressure situation','Participation in a sports moment'],['Aaj Ka Nishana','Solve a familiar aiming challenge','Skill play without cricket knowledge'],['Aaj Ki Jodi','Connect people, events and facts','Understanding news connections']],[260,417,475],229,57);
text(s,'The test: do Carrom and Jodi add value beyond the first three?',64,603,1130,44,28,C.red,true);
}
{
const s=slide('Why a Hindi word game?',basis+'\nScreenshot: Doc/review-images/torch-wordal-390.png, saved prototype reference. Example vocabulary and story shown in the prototype are illustrative, not a claim of current news. Preserve five curated Hindi units, six attempts and 24 reusable input keys.');
para(s,'Aaj Ka Shabd  /  आज का शब्द','A short word challenge turns familiar Hindi into a daily puzzle.',173);
para(s,'The Bhaskar connection','The reveal explains the word, then offers a specific related story.',324);
para(s,'What makes tomorrow different?','A new curated word. Improvement through fewer guesses and a personal solve history.',475);
await shot(s,'torch-wordal-390.png');
}
{
const s=slide('Why complete a thought?',basis+'\nOrigin: user’s observation of morning wisdom sharing. This is a design insight, not measured audience behavior. Sources must distinguish original writing from verified quotations. Screenshot: Doc/review-images/niti-card-with-meaning.png. A working recipient invitation requires a hosted URL.');
para(s,'Aaj Ki Niti  /  आज की नीति','Choose the missing phrase, reveal its meaning, and create a card worth sharing.',173);
para(s,'The Bhaskar connection','A thoughtful daily interaction continues into a family or friends’ conversation.',324);
para(s,'The payoff is the thought','Sharing remains available after a wrong answer. Attribution must be honest and readable.',475);
await shot(s,'niti-card-with-meaning.png');
}
{
const s=slide('Why replay a cricket moment?',brief+'\n'+basis+'\nThe Rajesh persona follows cricket. Proposed integration: a verified current or archive equation provides context. Keep authored practice and historical situations distinct. A last over is not necessarily a tie-breaking Super Over. Screenshot: Doc/review-images/superover-start-simplified.jpg.');
para(s,'Aaj Ka Over  /  आज का ओवर','A six-ball situation gives the reader a clear target and a brief moment of pressure.',173);
para(s,'The Bhaskar connection','Sports coverage supplies the situation. The result can link back to what actually happened.',324);
para(s,'The next reason to play','A different equation or match context, with timing and execution to improve.',475);
await shot(s,'superover-start-simplified.jpg');
}
{
const s=slide('Why add Carrom after cricket?',brief+'\n'+basis+'\nThe Ram Kishore persona mentions carrom on family phones. This does not establish universal familiarity or lack of access to a board. Proposed rules: ordinary misses continue from the settled board; an invalidating foul resets the layout but retains total shots. First completion and replay best are separate. Existing Carrom_Puzzles.html counts shots but resets the layout on a miss and says only one shot in its rules. Screenshot predates the proposed change.');
para(s,'Aaj Ka Nishana  /  आज का निशाना','Aiming and pocketing offer a familiar skill challenge without needing cricket knowledge.',173);
para(s,'A different board each day','A player can try a small Carrom challenge alone, without arranging a physical game.',324);
para(s,'Completion first, fewer shots next','Keep playing until the objective is complete. Count every shot, then offer a better-score replay.',475);
await shot(s,'family-carrom.jpg');
}
{
const s=slide('What makes Jodi more than matching?',basis+'\nProposed positioning supersedes generic general-knowledge packs as the headline case. Existing evergreen packs may remain clearly labeled. A matching relationship must be unambiguous even after shuffling. Screenshot: Doc/review-images/torch-jodo-390.png shows an existing evergreen space pack, not a live-news edition.');
para(s,'Aaj Ki Jodi  /  आज की जोड़ी','Match four relationships from selected news: a person and achievement, or an event and place.',173);
para(s,'The explanation earns the interaction','Each correct pair reveals why the connection matters and links to its relevant story.',324);
para(s,'A useful reason to share','Invite someone to try the same edition with a spoiler-free result. Four pairs are a small discovery.',475);
await shot(s,'torch-jodo-390.png');
}
{
const s=slide('Does Jodi compete with the news?',brief+'\n'+basis+'\nEditorial guardrails: verified source and publication date on every pair, truthful freshness labels, optional article links, and no claim that the user has consumed all important news. Sensitive suffering should not become a scored matching game. Whether Jodi complements or substitutes for reading is unknown until tested.');
text(s,'It could, if four pairs imply that the reader knows the whole story.',64,169,1148,89,34,C.red,true);
text(s,'The proposed promise',64,295,530,42,28,C.ink,true);
text(s,'आज की खबरों से\nचार बातें समझीं',64,352,548,117,38,C.ink,true,'Nirmala UI');
text(s,'The article adds what matching cannot',692,295,515,74,28,C.ink,true);
text(s,'Why it happened, what changed, and what it means for the reader.\n\nEach pair offers a direct route to that context.',692,382,510,177,28);
text(s,'Test understanding and article engagement against the ordinary reading journey.',64,598,1140, sixty(),25,C.muted);
}
{
const s=slide('What brings the reader back?',basis+'\nTarget sessions are brief, typically about 1–3 minutes, but unlimited Carrom attempts can take longer. Fresh content is a proposed return mechanism, not evidence of retention. One game completed is sufficient for daily participation. Avoid cross-board comparisons in Carrom.');
table(s,[['Experience','Freshness','Meaningful progress'],['Shabd and Niti','A new word or thought','Solve history or saved thoughts'],['Over','A different cricket situation','Better execution on the same challenge'],['Nishana','A new authored board layout','Fewer shots on that same layout'],['Jodi','New verified news relationships','Connections understood and revisited']],[280,420,452],179,78);
text(s,'One game can be enough for today. The next edition provides the invitation to return.',64,600,1110, seventy(),28,C.red,true);
}
{
const s=slide('What needs to change before submission?',basis+'\nScope: this deliverable is a pitch revision and separate implementation prompts. No game code was changed. Current state derives from Carrom_Puzzles.html and jodo.html source inspection plus the saved screenshots. These are not results of a fresh end-to-end prototype QA run.');
table(s,[['Area','Current evidence','Submission requirement'],['Carrom','Counts shots, resets after a miss','Continue play and make totals visible'],['Jodi','Matching and explanation screens','A sourced news round with per-pair links'],['Sharing','Niti card reference exists','Honest export and recipient invitation'],['Daily editions','Authored demo content exists','Show fresh challenges and retained state']],[215,400,537],184,79);
text(s,'A working path through the prototype is stronger evidence than a feature promise.',64,611,1140, fifty(),25,C.red,true);
}
{
const s=slide('How will we know five is worth it?',brief+'\n'+basis+'\nSuggested evaluation: compare a three-game collection (Shabd, Niti, Over) against five with comparable exposure, and compare Jodi with a text summary containing the same facts. Observe comprehension, starts, completions, voluntary return, article engagement and editorial preparation effort. Do not choose sample size or success thresholds without a research plan.');
text(s,'Three clearer concepts give us a base. Carrom and Jodi must show what they add.',64,165,1135,90,33,C.ink,true);
para(s,'Carrom earns its place if…','It attracts readers the other games miss, or gives them a distinct reason to return.',305,1110);
para(s,'Jodi earns its place if…','Readers understand the connections better than from a short summary, with a useful path into reporting.',455,1110);
text(s,'Five remains a testable proposal. Reader evidence should determine the final collection.',64,618,1120,48,24,C.red,true);
}
function sixty(){return 60}function seventy(){return 70}function fifty(){return 50}

await fs.mkdir(path.join(build,'renders'),{recursive:true});
const candidate=path.join(build,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
for(let i=0;i<p.slides.items.length;i++){
 const blob=await p.export({slide:p.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,'renders',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await blob.arrayBuffer()));
 console.log('Rendered slide',i+1);
}
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:path.join(out,'Dainik Bhaskar Daily Games Pitch.pptx'),pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','2','--require-native-table-slide','9','--require-native-table-slide','10'],requiredNativeTableOwnerSlides:[2,9,10],fontPolicy:{basis:'design',families:['Arial','Nirmala UI']},verifyArtifactToolImport:true,receiptPath:path.join(build,'validation.json')});
console.log(JSON.stringify(result));



