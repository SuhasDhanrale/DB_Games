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
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={paper:'#F9F9F7',ink:'#20201F',muted:'#61605D',red:'#C93526',word:'#675579',niti:'#826137',over:'#466853',jodi:'#506D8A',carrom:'#8A554A'};
const brief='Source: supplied organizer brief, Doc/Dainik Bhaskar Game Lab 2026.pdf, pp. 6–7, 9–11 and 13–18. The brief asks for a game for a news platform. Dainik Bhaskar Khel is our proposed collection as one submission concept, not a claim that the organizer requested five games.';
const concept='Design basis: Focus on NITI Game, conversation 6aca000c-84c4-83ee-83e8-55c5003f4998, and user refinements on 13 October 2026. Intended benefits are design hypotheses, not measured audience outcomes.';
function txt(s,value,x,y,w,h,size=28,color=C.ink,bold=false){
 const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=value;a.text.style={typeface:/[\u0900-\u097F]/.test(value)?'Nirmala UI':'Arial',fontSize:size,bold,color};return a;
}
function page(title,notes='',accent=C.red){
 const s=p.slides.add();s.background.fill=C.paper;
 txt(s,title,64,47,1152,103,44,C.ink,true);
 txt(s,String(p.slides.items.length).padStart(2,'0'),1172,677, forty(),25,16,C.muted);
 s.speakerNotes.text=notes;return s;
}
function forty(){return 40}
async function picture(s,file,x,y,w,h,caption=''){
 const bytes=await fs.readFile(path.join(root,'Doc/review-images',file));
 s.images.add({blob:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),contentType:file.endsWith('.png')?'image/png':'image/jpeg',alt:caption||'Dainik Bhaskar Khel prototype screen',fit:'contain',position:{left:x,top:y,width:w,height:h}});
 if(caption)txt(s,caption,x,y+h+12,w,48,18,C.muted);
 s.speakerNotes.text+='\nImage source: supplied project screenshot, Doc/review-images/'+file+'. Saved prototype screen, not a fresh end-to-end test.';
}
function section(s,label,body,x,y,w,accent=C.red){txt(s,label,x,y,w,45,27,accent,true);txt(s,body,x,y+52,w,108,27);}

// 1. The submission opens with the product, not an internal selection debate.
{
 const s=p.slides.add();s.background.fill=C.paper;
 txt(s,'DAINIK BHASKAR GAME LAB 2026',64,68,1000,42,24,C.red,true);
 txt(s,'दैनिक भास्कर खेल',64,200,1130,132,91,C.ink,true);
 txt(s,'Dainik Bhaskar Khel',69,349,1070,69,46,C.ink,true);
 txt(s,'A daily play experience within the news habit',69,454,1070,96,33,C.muted);
 txt(s,'खबर से खेल तक, खेल से समझ तक।',69,602,1070,60,29,C.red,true);
 s.speakerNotes.text=brief+'\n'+concept+'\nOpening: The reader already has a reason to open Dainik Bhaskar. Our idea is to give that everyday visit a small moment of participation. Dainik Bhaskar Khel brings short games into that news habit, with different payoffs connected through one daily experience.';
}
// 2. Audience and design insight precede the catalogue.
{
 const s=page('The reader comes for news',brief+'\nThe lunch-break example draws on the Rajesh persona, p. 13. The preference for accessible Hindi follows the audience brief and persona range. The 1–3 minute session length is a design target, not a measured completion time. Carrom can take longer with unlimited attempts.\nPresenter: Rajesh follows cricket and checks his phone during short breaks. He does not need to decide to become a gamer. An invitation tied to what he already cares about can be enough.');
 txt(s,'A few minutes over lunch.\nA cricket score to discuss.',64,174,620,142,43,C.ink,true);
 txt(s,'The brief describes mobile-first Hindi readers who are mostly casual players or new to games.',64,352,595,127,29);
 txt(s,'Our starting point is a familiar action that fits the time they already have.',64,538,600,109,31,C.red,true);
 txt(s,'The design response',800,176,410, fifty(),28,C.red,true);
 txt(s,'Clear Hindi instructions\n\nA short, satisfying finish\n\nA useful or enjoyable payoff',800,255,390,300,29);
 txt(s,'Target session: about 1–3 minutes',800,588,388, seventy(),24,C.muted);
}
// 3. The collection is explicit and unified by the player journey.
{
 const s=page('One daily edition, a choice of play',concept+'\nSource: src/screens/hub.js and src/systems/progression.js. The prototype has five separately playable games within one hub. It shares daily progress and completion history. Choice is the product rationale, not evidence that five is the optimal count.\nPresenter: Someone may want a thought to share in the morning and a skill challenge later. They can choose one game and still participate in the same daily habit. The breadth serves those changing moments.');
 txt(s,'Dainik Bhaskar Khel brings five short games into one familiar home.',64,167,705, ninety(),34,C.ink,true);
 const roles=[['आज का शब्द','A word that opens a story',C.word],['आज की नीति','A thought worth sharing',C.niti],['आज का ओवर','A cricket moment to play',C.over],['आज की जोड़ी','News connections to discover',C.jodi],['आज का निशाना','A familiar aiming challenge',C.carrom]];
 for(let i=0;i<roles.length;i++){const y=291+i*63;txt(s,roles[i][0],64,y,268,46,27,roles[i][2],true);txt(s,roles[i][1],350,y+2,423,46,25);}
 txt(s,'One shared day of progress. One game is enough.',64,635,755, forty(),24,C.red,true);
 await picture(s,'home-simplified-360.jpg',894,148,267,510);
}
// 4. Show the connection in a concrete sequence.
{
 const s=page('Aaj Ka Shabd: a word opens a story',concept+'\nSources: wordal.html and Doc/News Connections and Pitch Revision.md. Five curated Hindi input units, six attempts and a compact 24-key keyboard. The example अनुसंधान and space explainer are supplied prototype material, not current reporting.\nPresenter: The puzzle supplies the curiosity. The reveal supplies meaning. The article gives that word a place in the world. A reader may also enter from a story, with care not to spoil an unsolved puzzle.');
 txt(s,'Solve in Hindi',64,174,370,48,31,C.word,true);
 txt(s,'A compact Hindi keyboard.\nSix attempts to find the word.',64,237,345,125,29);
 txt(s,'Discover the meaning',64,384,375, fifty(),29,C.word,true);
 txt(s,'The result explains the word and offers the story behind it.',64,447,369,156,29);
 await picture(s,'family-wordal.jpg',477,165,263,461,'01   The word challenge');
 await picture(s,'family-wordal-result.jpg',839,165,263,461,'02   Meaning and a related story');
}
// 5. Niti restores the personal origin and social payoff.
{
 const s=page('Aaj Ki Niti: the thought travels further',concept+'\nSource: Doc/Dainik Bhaskar Daily Games Design Rationale.md records the personal spark of seeing an older uncle share a morning thought on WhatsApp. This is a design observation, not population research. Sources: niti.html and its supplied share-card screen. Original writing must remain labeled as original. A hosted invitation is a production extension.\nPresenter: The starting observation was simple: the value of a morning thought was in sending it to someone. Niti makes the reader participate before sharing. Complete the thought, understand it, then make a card that feels worth sending. The relationship to Dainik Bhaskar is trust and a daily ritual. It does not require a forced headline.');
 txt(s,'The idea began with a morning thought shared in a family WhatsApp group.',64,178,680,114,35,C.ink,true);
 section(s,'Complete the thought','Choose the missing phrase and reveal its meaning. A wrong answer still leads to the full thought.',64,338,675,C.niti);
 section(s,'Make something worth sending','Create a Hindi card with clear attribution and Dainik Bhaskar identity.',64,519,675,C.niti);
 await picture(s,'niti-card-with-meaning.png',828,159,365,455,'A share card from the prototype');
}
// 6. Match reporting supplies context while the simulation stays honest.
{
 const s=page('Aaj Ka Over: the reader takes the field',concept+'\nSources: Superover.html and Doc/Asian Games 2026 match context.md. Current gameplay offers batting/bowling and authored 18/15-run practice settings. Do not call those settings verified historical final-over equations. This slide makes no external match-result claim.\nPresenter: Cricket offers a natural invitation from a sports story: how would you handle six balls of pressure? The player bats or bowls, then can return to match coverage. Keep the player’s simulation separate from the real result. Verified historical final-over equations are an extension, not a claim about the current authored targets.');
 txt(s,'A sports story creates the invitation. Six balls make it playable.',64,177,687,109,35,C.ink,true);
 section(s,'A clear role and a clear finish','Choose batting or bowling, read the target, then time the action.',64,330,681,C.over);
 section(s,'Back to the match','The result offers a route to the real story. New match contexts refresh the same familiar controls.',64,500,681,C.over);
 await picture(s,'superover-bowling-position.jpg',837,148,345,492,'Prototype: a six-ball practice scenario');
}
// 7. Jodi is a reusable editorial format, with a concrete understanding payoff.
{
 const s=page('Aaj Ki Jodi: connections behind the news',concept+'\nSources: jodo.html and public/jodo-content.js, revision 2026-10-13.1. The prototype contains sourced archive and evergreen editions. The screenshot depicts an earlier space matching edition and illustrates the interaction only. Current-news and city editions need an editorial publishing workflow.\nPresenter: A name in a headline is easier to understand when you know what it connects to. Jodi asks the reader to make that connection, then explains why it matters. The same matching format can carry sports, science, service news or local developments. The article provides the detail that four pairs cannot.');
 txt(s,'Eight cards. Four relationships.\nA reason behind every match.',64,174,687,109,35,C.ink,true);
 section(s,'Match, then understand','Connect a person with an achievement or an event with its place. Reveal why that relationship matters.',64,327,680,C.jodi);
 section(s,'The story continues in reporting','Each pair has context and a relevant source. New editorial packs give the format a fresh subject.',64,510,680,C.jodi);
 await picture(s,'family-jodo.jpg',859,148,300,492,'Archive example: the matching interaction');
}
// 8. Carrom belongs as tactile play and meaningful progression.
{
 const s=page('Aaj Ka Nishana: a familiar moment of play',brief+'\n'+concept+'\nCarrom appears in the Ram Kishore persona on p. 14, not as evidence of universal familiarity. Source: Carrom_Puzzles.html inspected 13 October 2026. It now preserves coin progress across normal misses, counts shots, and records first completion and replay best. An invalidating foul resets the board while retaining the total. Screenshot predates the new counter.\nPresenter: Sometimes the reader wants a break from reading. Carrom gives us a familiar physical action without needing a board or another player. A small daily layout makes it a challenge with a finish. Everyone can keep trying. The next question is whether they can complete that same board in fewer shots.');
 txt(s,'A familiar Carrom challenge.\nNo board or opponent to arrange.',64,174,690,142,35,C.ink,true);
 section(s,'Keep trying until the goal is complete','Every shot counts. Normal misses keep the board in play, so another attempt can build on the last.',64,354,688,C.carrom);
 section(s,'Tomorrow brings a new layout','Replay today’s board in fewer shots, or share the total as a friendly challenge.',64,534,688,C.carrom);
 await picture(s,'family-carrom.jpg',861,152,300,477,'Carrom board from the prototype');
}
// The news journey connects the game-specific payoffs.
{
 const s=page('The story and the game stay connected',concept+'\nSources: Doc/Opening and news journey revision.md, src/ui/news-reader.js and supplied saved news screen. The production proposition places relevant invitations in the Dainik Bhaskar feed and article endings. The web prototype demonstrates a local news journey, not integration into the live Dainik Bhaskar app.\nPresenter: The collection has a home, but the invitation can appear in the story the reader is already following. Play gives that reader a new way into the subject, and the result offers the reporting again. News supplies context. The game supplies participation. Neither route needs to force the other.');
 section(s,'An invitation in context','A cricket story can invite a six-ball challenge. A word or news connection can invite a small discovery.',64,181,682,C.red);
 section(s,'A result with somewhere to go','Meaning and a relevant story preview give the reader a reason to continue reading.',64,364,682,C.red);
 txt(s,'Reading remains a choice. Returning to the game keeps the reader’s progress.',64,575,681,89,29,C.ink,true);
 await picture(s,'stories-simplified-360.jpg',864,154,300,484,'The prototype’s sample news journey');
}
// Cohesion is also a shared daily rhythm.
{
 const s=page('The next visit belongs to the same habit',concept+'\nSources: src/systems/progression.js, src/ui/torch.js and src/screens/hub.js. Daily participation follows completing any one game. Replays do not increment the daily streak twice. The mashal is a product metaphor, not a claim of tested cultural comprehension.\nPresenter: The five games meet at the daily experience. A Niti today and a Carrom challenge tomorrow still feel like returning to Dainik Bhaskar Khel. Progress records the visit without requiring a five-game checklist. Freshness and personal improvement provide the reason to return.');
 txt(s,'थोड़ा खेल, हर रोज़।',64,176,744,79,47,C.red,true);
 txt(s,'Complete any one game.\nKeep the day’s progress.\nChoose a different game tomorrow.',64,309,710,191,34,C.ink,true);
 txt(s,'The shared मशाल marks consecutive days of play. Weekly history makes the habit visible.',64,541,701,103,28);
 await picture(s,'progress-simplified-360.jpg',868,156,289,488);
}
// 10. The content pipeline links the collection to Dainik Bhaskar’s strengths.
{
 const s=page('Fresh content gives familiar play a future',brief+'\n'+concept+'\nThis table describes the production content model. The prototype uses authored demo editions, not a live newsroom service. Source checks, dates, answer ambiguity review and sensitivity review remain editorial responsibilities. Dainik Bhaskar newsroom and local reporting capabilities are described in the supplied brief, p. 6.\nPresenter: The mechanics stay learnable while editorial content and authored challenges change. Dainik Bhaskar’s language and reporting context can make the collection recognisably its own. Carrom refreshes through level design rather than attaching a headline to a board.');
 const values=[['Experience','What changes','Connection to Dainik Bhaskar'],['Shabd','A curated Hindi word','Vocabulary with a story behind it'],['Niti','A thought and its interpretation','A daily ritual and shareable card'],['Over','A match context or target','Sports coverage made participatory'],['Jodi','Verified relationships and explanations','A reusable news discovery format'],['Nishana','Coin layouts and shot challenges','A familiar break in the daily visit']];
 const t=s.tables.add({rows:6,columns:3,left:64,top:176,width:1152,height:414,columnWidths:[204,447,501],values});
 t.borders.assign({fill:'#DBDAD3',width:0.6});
 for(let r=0;r<6;r++)for(let c=0;c<3;c++){const a=t.getCell(r,c);a.fill=r===0?'#EAE9E3':C.paper;a.text.style={typeface:'Arial',fontSize:24,bold:r===0,color:r===0?C.red:C.ink};}
 txt(s,'City editions and regional language content can extend the same formats.',64,616,1152,56,27,C.red,true);
}
// 11. Judge-facing scope, with honest separation of demo and production.
{
 const s=page('The prototype connects play with its payoff',concept+'\nSources inspected: src/screens/hub.js, wordal.html, niti.html, Superover.html, Carrom_Puzzles.html, jodo.html, public/jodo-content.js and src/systems/progression.js. This is source inspection and saved screen evidence, not a fresh functional QA certification. No adoption, retention or comprehension uplift is claimed.\nPresenter: The web prototype demonstrates the connected journey: choose a game, play, see a meaningful result, and continue into a story or a share. Moving into Dainik Bhaskar would add newsroom publishing, hosted sharing and audience validation. We would measure voluntary return and useful story engagement, with comprehension checks for Jodi.');
 txt(s,'In the mobile web prototype',64,177,560, fifty(),30,C.red,true);
 txt(s,'Five playable games in a shared Hindi home\n\nExplanations and related story journeys\n\nNiti cards and personal play history',64,262,557,331,29);
 txt(s,'With production integration',723,177,485, fifty(),30,C.red,true);
 txt(s,'Editor-managed current and local editions\n\nHosted invitations from shared cards\n\nReader testing and measured return',723,262,475,331,29);
 txt(s,'The demo uses curated sample and archive content with source labels.',64,626,1145, fifty(),24,C.muted);
}
// 12. Close on the coherent offer and a short demonstration route.
{
 const s=page('दैनिक भास्कर खेल',concept+'\nClosing: We began with the small moments already in a news reader’s day. Dainik Bhaskar Khel gives those moments an action and a payoff. The submission is one connected play destination with five short games.\nSuggested demonstration: open the shared home; solve or reveal the labelled Shabd demo; open the related story and return; show the Niti card; show Jodi context and a Carrom shot total. Demonstrate only behavior available in the running prototype.');
 txt(s,'A reader opens Dainik Bhaskar for the news.\nA small moment of play gives them\nsomething to take part in.',64,191,1140,220,47,C.ink,true);
 txt(s,'A story to understand more deeply, or a thought to carry into a conversation.',64,451,1110,104,32,C.muted);
 txt(s,'Prototype walkthrough',64,609,420,44,26,C.red,true);
 txt(s,'Choose a game. Play. Discover its payoff.',493,609,714,44,26);
}
function fifty(){return 50}function seventy(){return 70}function ninety(){return 90}

await fs.mkdir(path.join(build,'renders'),{recursive:true});
await fs.mkdir(out,{recursive:true});
const candidate=path.join(build,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
for(let i=0;i<p.slides.items.length;i++){
 const b=await p.export({slide:p.slides.items[i],format:'png',scale:1});
 await fs.writeFile(path.join(build,'renders',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await b.arrayBuffer()));
 console.log('Rendered',i+1);
}
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const r=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:path.join(out,'Dainik Bhaskar Khel - Submission.pptx'),pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','11'],requiredNativeTableOwnerSlides:[11],fontPolicy:{basis:'design',families:['Arial','Nirmala UI']},verifyArtifactToolImport:true,receiptPath:path.join(build,'validation-full-name.json')});
console.log(JSON.stringify({final:r.finalPath,slides:r.presentationLayout.slide_count,findings:r.presentationLayout.finding_count,warnings:r.presentationLayout.warnings}));


