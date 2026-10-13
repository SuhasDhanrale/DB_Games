# Result screen copy review

Reviewed 14 October 2026. Scope: the five daily games in the home collection, their result variants, Niti's share flow, and the shared Mashal celebration.

The biggest opportunities are Jodi and Over. Nishana is already compact. Across the collection, the result is often stated once by the shared celebration and again by a status, score, or explanatory sentence. Keep one outcome, useful performance facts, the game's payoff, and its next actions.

These are recommendations; result-screen changes have not been applied in this review.

## What to cut, combine, and retain

| Game | Cut from the immediate result | Combine or reuse | Retain |
| --- | --- | --- | --- |
| Aaj Ka Shabd | Separate praise paragraph; long news excerpt; redundant explanation of what to read next | Celebration and attempt pill become one outcome row; reuse a compact story teaser | Revealed word, full meaning, attempt count, related headline, news and more-games actions |
| Aaj Ki Niti | Unused answer options after confirmation; “अब उसका अर्थ जानें”; long card-making button text | Put answer status with the completed thought; retain one meaning block; shorten the share sheet | Full thought, meaning, selected wrong answer when relevant, card creation, attribution on the shared card |
| Aaj Ka Over | Two repeated publisher subtitles; separate “आपका स्कोरकार्ड” heading; repeated win/retry sentences | One outcome and one match-margin/target sentence; compact story teaser shared with Shabd | Runs, wickets, balls or target context, selected team, replay, clear distinction between the player's game and the real match |
| Aaj Ka Nishana | Generic practice advice; “पहली पूर्णता” on the initial result where it repeats the current shots | Outcome and current shot count; show historical comparison only on replay | Current shots; first result and best replay when comparison is useful; replay and more-games actions |
| Aaj Ki Jodi | Three introductory lines; repeated source/date/archive blocks; the second article title in each link | Pair title plus one useful takeaway; move detailed explanation and sourcing into the existing article reader | All four correct relationships, score, hint/mistake honesty, one visible edition/archive label, access to each article |

## Concrete copy direction

### Shabd

Current first-try result uses “कमाल!”, “पहली कोशिश में शब्द खोज लिया।” and “1/6 कोशिशों में हल किया”. Replace all three with **“शब्द मिला · 1/6 प्रयास”** alongside the existing stamp. Other solves use their actual attempt count. An exhausted round uses **“शब्द नहीं मिला · 6/6 प्रयास”**; an early reveal, if available, needs its own **“उत्तर देखा”** state.

Keep the answer and meaning together, with the short label **“अर्थ”**. For the news connection, retain **“जुड़ी खबर”**, the existing headline and **“खबर पढ़ें”**. The paragraph excerpt can live in the reader. The word's full definition earns its space; shorten repeated surrounding instructions first.

### Niti

Keep the completed thought with **“सही उत्तर”** or **“चुना उत्तर सही नहीं था”** as a small status. The highlighted correct phrase already shows the answer. On an incorrect choice, retain **“आपने चुना: अपनी राय बनाने”** for this edition; remove the two other distractors. On a correct choice, remove the entire disabled options grid.

Keep the meaning with **“अर्थ”**, and change **“विचार कार्ड बनाएं एवं साझा करें →”** to **“कार्ड बनाएं”**. This button opens the studio, so the separate studio action remains **“कार्ड साझा करें”**.

The share sheet needs its title and three actions: **“ऐप पर साझा करें”**, **“कार्ड डाउनलोड करें”**, **“टेक्स्ट कॉपी करें”**. Cut the subtitle and each action's explanatory sentence. PNG and 1080×1350 do not help the reader choose an action here. Preserve the original-writing/demo attribution on the generated card and copied thought.

### Over

Use **“आप जीत गए!”** or **“इस बार हार हुई”** once, then the scorecard. The win explanation can be **“लक्ष्य पूरा · 4 गेंद”** for the captured batting result; a batting loss can use **“लक्ष्य से 18 रन कम”** for the captured zero-run result. These are examples, not constants. Bowling needs its own defended/conceded context, and the score must clearly identify the team it describes.

Keep at most one publisher identity in the result. The collection/game header already names the game. Remove the two “Dainik Bhaskar / दैनिक भास्कर … विशेष” subtitles and the extra “आपका स्कोरकार्ड” heading.

Present the news connection as **“असली मैच”** plus a short headline and **“खबर पढ़ें”**. Move its full score/date paragraph and official score link into the story reader. The “असली मैच” label must survive this reduction so the simulated result is never mistaken for the actual match.

Boundaries are a secondary performance detail: they can sit in an expandable scorecard if the immediate screen still feels busy. Runs and wickets remain visible.

### Nishana

Initial result: **“लक्ष्य पूरा · 1 शॉट”** and the two actions. This replaces the celebration sentence, “कुल शॉट: 1”, and “पहली पूर्णता: 1 शॉट”.

Replay result: **“लक्ष्य पूरा · 4 शॉट”**, then **“पहली बार: 1 · सर्वश्रेष्ठ अभ्यास: 4”** for the captured state. Keep the distinction between the first completion and practice best; do not silently turn “best replay” into an overall personal best. Omit the comparison when no replay exists.

### Jodi

Use **“चारों जोड़ियाँ पूरी · 100 अंक”** with **“गलत जोड़: 0 · संकेत: 0”** as compact performance facts. A hinted completion uses the actual score and hint count. Remove “आज की खबरों से चार बातें समझीं”, the instruction to look above for source dates, and “हर जोड़ी के बारे में जानें”. Matching establishes completion, not proof that someone understood the facts; the authored editions also include archive material.

Each row needs its relationship title and one takeaway. For example, the existing Chandrayaan row can combine its two paragraphs into: **“विक्रम 23 अगस्त 2023 को उतरा—चंद्र सतह पर सुरक्षित उतरने और प्रयोग करने की क्षमता दिखाई।”** The compact row can open the existing article reader as a whole, avoiding another long article title beneath it.

Reuse the existing article reader for the full explanation, “क्यों मायने रखता है”, source, date and editorial-demo attribution. Those fields are already rendered there. Keep one visible edition/archive label above the result; source details remain available inside each article. Where content warrants a longer explanation, use an expansion rather than squeezing it into a tiny font.

## Shared text and components

The five games already use `src/ui/result-celebration.js`. Adapt that component to own the compact outcome; don't add another result banner. Its stamp, accessible status announcement, sound preference and reduced-motion support can be retained with fewer words.

Standardize repeated actions: **“फिर खेलें”**, **“और खेल”**, **“खबर पढ़ें”**, **“कार्ड बनाएं”**, **“कार्ड साझा करें”**. Keep “अभ्यास” as a small mode label where relevant. Only show actions a game actually supports.

Shabd and Over can reuse one story-teaser structure: context label, headline, read action. Context remains game specific. Jodi can reuse its existing insight renderer and article reader, with a compact result presentation and full detail in the reader.

The Mashal popup currently adds another “शानदार!”, journey/day labels, a level, progress, and the daily-counting rule. On an ordinary newly counted completion, combine this into an inline row on the result: **“मशाल +1 · स्तर 1 · 1/5 खेल”**. Retain the fuller celebration for a level increase. Explain “हर नया दैनिक खेल एक बार जोड़ता है” on the hub or first introduction. A replay must never show a fresh +1. Keep consecutive-day streaks separate from cumulative level progress.

## Order of work and review evidence

Start with Jodi's four detail blocks and Over's repeated headings. Then consolidate shared celebration copy, remove Niti's completed options, and compact Nishana's comparison. Merge Mashal into the result as a separate interaction change, because it affects the reward presentation as well as text.

Reviewed rendered success results for all five games at 390×844, Shabd after six unsuccessful attempts, Niti after an incorrect choice, Over after a batting loss, Jodi with a hint, Nishana replay, Niti's studio/share sheet, and Mashal inside the collection. Over and Nishana used controlled result-state fixtures; this was a result-content review, not a gameplay-physics test. The other authored editions and desktop layouts were inspected in source where relevant, not exhaustively rendered.

Text inventory: [inventory.json](../tmp/result-copy-audit/inventory.json). Review captures and the collection script are in `tmp/result-copy-audit/` and `tmp/result-copy-audit.mjs`.

Source entry points: `src/ui/result-celebration.js`, `src/ui/torch.js`, `wordal.html` (`populateResultScreen`), `niti.html` (`renderStep1` and share sheet), `Superover.html` (`resultModal` and `endMatch`), `Carrom_Puzzles.html` (`showModal`), and `jodo.html` (`renderInsights`, `renderResultPanel`, `openArticleModal`).
