# Dainik Bhaskar game jam design

**Revised implementation brief · Version 2 · 10 October 2026**

Build and review one game at a time, each as a self-contained HTML file. A background mock news page gives the games context and connects their results to sample stories. This is a game-jam project with a provisional selection of concepts, not a production-platform specification.

This version supersedes the previous React-first plan, alternative colour palette and tile-arrangement Shabd mechanic. It keeps useful researched content and precise game rules while changing the implementation boundary to standalone HTML.

## 1 What we are building

| File proposed for delivery | Purpose | Status |
|---|---|---|
| `news.html` | Background news feed, article reader and links to available games | Build first as context |
| `wordal.html` | Five-unit Hindi word guessing game | Adapt existing reference |
| `niti.html` | Thought completion, meaning and share card | Provisional candidate |
| `Superover.html` | Six-ball batting/bowling challenge | Existing reference; proposed daily rules |
| `carrom.html` | Short aiming puzzles | Provisional candidate |
| `jodo.html` | Four researched matching pairs | Provisional candidate |

Each game contains its CSS, plain JavaScript, original vector/canvas artwork and all three editions of its own data. No React, framework migration, external content fetch or build step is required to open a finished standalone file. Keep the existing Vite app for optional integrated review. Finishing all five is not a prerequisite to reviewing the first game.

Three days means three selectable demo editions, not a three-day development estimate. Each file has a visible दिन 1 / दिन 2 / दिन 3 selector. The current candidate content covers space, sporting effort and heritage; candidates can be replaced individually after review.

**Deliverable boundary now:** this is the revised plan and supporting data, not implementation of the game files. Existing project files have not been changed. The accompanying rules module is a reference to inline into a game, not a runtime dependency that the HTML must import.

**Use for the next build:** this document plus `three-day-content.json` and `game-rules.mjs`. The reviewed word-game reference has five units per answer, six rows and 24 Hindi keys. Those are explicit requirements.

<!-- page -->

## 2 Existing folder and standalone contract

Inspected project: `E:\WebGames\Dainik Bhaskar`. The root contains `index.html`, separate game HTML files, `src/`, and the Vite project files. No literal `app/` child directory was found at this location. The app entry point is `src/main.js`; screens are under `src/screens/`, and the existing iframe adapter is `src/games/base-html-game.js`.

The existing games are Wordal, Super Over, Penfight, Deshkipark, Baghchal and Lagori. They are references, not a final selection. Do not delete or overwrite unrelated games to make the folder match this proposal. Add new candidate files alongside them and register only the ones being reviewed.

### Every game must work alone

- Open the file directly and start playing without a parent frame, hub, login or network request.
- Inline the required design tokens and component styles from the existing visual system. Do not copy Tailwind’s import directive into a browser style tag; use ordinary CSS.
- Use inline SVG, canvas or CSS artwork. Use installed font fallbacks initially; embed a licensed font if exact offline typography is required. Do not require Google Fonts or a CDN to function.
- Remove the Wordal reference’s top-level redirect in the future standalone implementation. Its present redirect to `/` prevents independent opening.
- Parse `?day=d1`, `?day=d2` or `?day=d3`; default to d1 for missing or invalid values. The visible selector updates the file’s own edition.
- Embed its relevant feature/practice article copy in the same file. “जुड़ी खबर पढ़ें” opens an in-file article panel and returns to the saved game state. The sibling news page is an optional wider context, not a dependency.

### Background page and optional integration

Keep `news.html` beside the games. Direct links are relative: `./wordal.html?day=d1` and `./news.html?day=d1&article=d1-feature`. The news page can use the existing app appearance while remaining independently reviewable. Later, the current app may embed these same files through its iframe adapter; do not rewrite all game logic into `src/`.

Existing `DBGameLab.addScore` and `DBGameLab.endGame` callbacks are optional. Guard their presence at the time of use and never depend on them during startup. Edition is passed in the iframe URL. Keep completion local to the game until integration is explicitly added; there is no requirement to make all games share a score.

File-URL storage behaviour varies by browser. Each file falls back to in-memory progress. Cross-file progress is not guaranteed when files are double-clicked. For a connected walkthrough and shared-origin storage, use the existing local Vite server; standalone play must still work without it.

<!-- page -->

## 3 Background news page and game connections

The page should look like a small news-app home: shared header, edition selector, lead feature, available game cards and a cricket practice story. It is a mock feed, with the label **डेमो समाचार फ़ीड**. Feature facts are sourced; copy is original sample writing. Cricket stories are explicitly fictional practice. Do not invent a Bhaskar journalist or a real publication date.

| Edition | Main feature | Word answer | Niti connection | Jodo connection |
|---|---|---|---|---|
| दिन 1 | Four Indian space missions | अनुसंधान | Asking questions before understanding | Mission and purpose |
| दिन 2 | Selected Paris 2024 achievements | प्रतियोगिता | Regular practice | Athlete, event and medal |
| दिन 3 | Four heritage sites | ऐतिहासिक | Understanding and caring for heritage | Site and state |

**Shabd:** after revealing the word, show its meaning and why it connects with this edition’s article. It need not be hidden in a headline. **Niti:** reveal the thought and interpretation first; a quiet optional link offers a thematically related story, never a claim that the thought was spoken by someone in it. **Jodo:** every pair’s reveal is supported by the linked feature. **Super Over:** its practice article states the challenge; the game does not present a fictional result as an actual score. **Carrom:** a familiar play break in the feed; no forced factual news connection.

### Complete navigation

News card → article → related game. Game result → in-file article panel → same result. Optional “समाचार पेज खोलें” opens the sibling `news.html` with the same edition/article. “खेल पर लौटें” closes an article panel without resetting a round. Browser back should work for page navigation.

The article reader displays category, title, period, supplied paragraphs, sources and game buttons. Feature stories link to Wordal, Niti and Jodo; practice stories link to Super Over. Only render launch buttons for files implemented so far; mark other candidates “जल्द आज़माएँ” with no broken link. Carrom appears in the game module rather than an artificial story link.

The six full sample articles and all three game data sheets are included below. Each standalone game copies its relevant data subset into a `CONTENT` constant. The JSON is the authoring source; users do not need to load it separately at runtime.

<!-- page -->

## 4 Shared appearance and Hindi interaction

Use the inspected `src/styles/design-system.css` and `components.css` as the visual reference. Keep the different play areas, but use the same header, title treatment, buttons, feedback and result layout. These are project tokens, not a claim of an official Bhaskar brand specification.

| Token | Existing project value |
|---|---|
| Primary / dark / accent | `#E23A28` / `#BA2313` / `#F39C12` |
| App background / surface | `#F9F9F7` / `#FFFFFF` |
| Main / secondary text | `#1C1C1C` / `#5C5C5C` |
| Correct / present / absent | `#27AE60` / `#F1C40F` / `#4A4A4A` |
| Font family | Inter, Noto Sans Devanagari, system sans-serif; Nirmala UI fallback |
| Mobile envelope | Maximum width 430 px; responsive below it |
| Spacing | 4, 8, 12, 16, 24, 32 px |
| Corners | 8, 12, 16 px; use consistently |

Copy a small stable token block into each file. Keep palette changes explicit. Use dark text on bright green/yellow feedback, white on dark absent tiles, and test actual contrast. Keep text feedback in addition to colour. Hindi body/options should be comfortably readable, preferably 17–18 px, with generous line height. Do not inherit `user-scalable=no` or inaccessible focus removal from a reference.

**Shared layout:** back/help and title → edition selector → short instruction → activity → result/actions. Use at least 44–48 px practical touch controls and visible keyboard focus. At 360 px, allow article text and long matching cards to scroll rather than shrinking them. Do not hide an overflowing article behind a fixed-height game body.

**Hindi-first means:** intact अक्षर groups, natural instructions, explanations in Hindi and familiar story context. In Wordal, `नु` and `सं` are whole input units, not individual Unicode characters. No streak terminology is needed for this jam. A file can show “इस संस्करण का खेल पूरा”; the news page may show completion only when it actually knows it.

**Game-specific direction:** Wordal keeps its six-by-five board and three eight-key rows. Niti uses a thought and four options. Jodo uses readable matching cards. Super Over uses the existing cricket file as its first art/control reference; the rules below are proposed daily configurations. Carrom uses a top-down board. None requires identical artwork to look like part of the same collection.

<!-- page -->

## 5 Small shared implementation rules

Each file uses a single plain-script closure with `CONTENT`, `state`, `render`, input handlers and save/load helpers. Inline only the rules needed for that game. Avoid a framework migration, global event bus, generic plugin architecture or production backend.

Use local keys `db-jam:v2:<gameId>:<dayId>`. Save edition, current round, first result and practice best separately. Restore Wordal rows/key colours, Niti result, Jodo pairs, cricket between balls and Carrom after a settled shot. Reload during a ball/shot restores its pre-action checkpoint. Storage failure keeps the file playable in memory.

Sound is optional and starts muted. Pause animation on hidden tabs; do not punish a player for switching away. Pointer cancellation cancels a drag before release. Double clicks cannot submit twice. Text buttons remain outside canvas. Reset affects only this file’s jam keys.

Show exactly three edition choices. Changing the edition saves the old state and restores the selected one. Do not infer real calendar streaks from switching demo days. No login, public leaderboard, coins, subscriptions or analytics service is needed.

**Reference modules:** `game-rules.mjs` contains pure calculations for use during authoring and tests. Copy the relevant functions into each HTML’s script, removing `export`. The final HTML must not import this file or fetch the content JSON. Keep the authoring files for consistency, and bump the content version if rules or answers change.

<!-- page -->

## 6 Aaj Ki Niti candidate

**Goal:** complete one thought, understand it and optionally share it. The player is not racing a clock. The three complete entries appear in the daily content sheets.

1. Show the incomplete thought and four vertically stacked options in the supplied order. Selecting an option highlights it but does not submit. The confirmation button reads “यही उत्तर चुनें”.
2. On the first confirmed selection, store it and reveal the full thought. Mark the chosen option and the intended completion with text and icons. Disable further scoring input.
3. Correct copy: “विचार पूरा हुआ”. Wrong copy: “इस विचार का पूरा रूप पढ़ें”. Show the supplied meaning and attribution in both cases.
4. Offer “कार्ड साझा करें”, secondary “आज के खेल”, and the optional themed article. A person can share after a wrong answer; sharing is never a gate.

**Completion and score:** one confirmed response completes the game. Internally store `firstAnswerCorrect`; do not display a numeric Niti score. A “फिर देखें” action reopens the thought without creating another attempt. All wrong options are plausible sentence endings, but the correct answer is the authored completion, not a claim that other values are universally wrong.

### Share card specification

Render a 1080×1350 PNG with 80 px safe margins, warm paper background, heading “आज की नीति”, the exact full thought, smaller meaning, attribution and “भास्कर खेल · डेमो”. Text wraps without clipping. Use the bundled Hindi font; wait for the font before rendering. Do not draw a quote mark that implies a historical speaker.

The supplied attribution is **“मौलिक विचार · डेमो के लिए लिखा गया”** on all three cards. Niti in this pack is original editorial writing. No invented attribution, quotation source or public figure is permitted. If replacing it with Kabir, Rahim or Chanakya later, add a verified primary text reference, exact wording and adaptation label where necessary.

Always provide “कार्ड डाउनलोड करें”. Show native share only if file sharing is supported and the user taps it [T05]. A cancelled share returns to the result without error or extra completion. Clipboard text is a fallback. In a local prototype, do not embed localhost URLs in a shared image or claim a working return link; after hosting, use a validated public route. Native share availability depends on browser and context.

### Acceptance checks

All four options can be selected; only confirmation submits. Wrong answers still reveal meaning and allow download. Refresh after a result preserves it. The three exported cards show exact Hindi content, no clipping and the demo attribution. The article button opens the corresponding feature and returns correctly.


<!-- page -->

## 7 Wordal five unit guessing game

Preserve the supplied reference mechanic: **five Hindi units per answer, six guesses, 24 reusable keys** arranged in three rows of eight. A unit can include a मात्रा or conjunct. This is not an anagram tile bank: pressing a key does not remove it, and the same unit may be entered repeatedly.

Each edition supplies five ordered `answerTokens`. The keyboard remains the same across the three sample editions. Delete removes the last unit of the current row; “जाँचें” submits only a full five-unit row. Lock input during feedback. On an incomplete row, show “5 अक्षर पूरे करें” without consuming a guess.

### Feedback algorithm

First mark exact-position units correct and consume them from the answer’s available counts. Then, left to right, mark unmatched units present only while an unconsumed matching answer unit exists; consume it. All others are absent. This two-pass process prevents repeated input from receiving more yellow matches than the answer contains. Compare normalized unit strings, not JavaScript character counts.

Correct = green and “सही जगह”; present = yellow and “दूसरी जगह”; absent = dark and “इस शब्द में नहीं”. Keyboard state can only improve from absent to present to correct, never downgrade. A correct five-unit sequence wins immediately; six failed full rows reveal the answer. Allow an explicit confirmed “उत्तर देखें” to finish as revealed. No hint or scoring penalty system is needed.

### Guess policy for the jam

The inspected reference declares a small dictionary but its submit path does not enforce it. Preserve that behaviour for this version: accept any five units entered from the 24 keys. Do not pretend there is a complete Hindi dictionary or reject guesses using only the three answers. Label the demo as a five-unit guessing puzzle; a real-word validation dictionary is a separate later decision.

Keep the broad edition topic visible, but do not display a definition that immediately gives away the answer. On result, show the full word, supplied meaning, attempts such as “3/6”, and the related article. The first result is retained; replay is practice. Remove the previous design’s three-check limit, consumed tiles, variable-length answers and 100-point formula.

### Exact three edition targets

| Edition | Answer | Five units |
|---|---|---|
| दिन 1 | अनुसंधान | अ · नु · सं · धा · न |
| दिन 2 | प्रतियोगिता | प्र · ति · यो · गि · ता |
| दिन 3 | ऐतिहासिक | ऐ · ति · हा · सि · क |

These are curated puzzle units, not a universal claim about Hindi letter counting. The existing reference’s examples use the same five-unit approach. Tests must cover duplicate guesses, six-row exhaustion, keyboard colour priority, direct-file opening and correct rendering of every unit.

<!-- page -->

## 8 Jodo mechanics and editorial rules

**Goal:** connect four entities with four unique facts. The player learns the connections even if they arrive without background knowledge. Each edition supplies the exact pair IDs, labels, explanation and source.

Use two columns of four text cards. The left column remains in `leftOrder`; the right column follows `rightOrder`, expressed as one-based indices into `pairs`. Do not reshuffle during a round or on refresh. A correct pair must not happen to align in the initial same row in these three sets.

1. Tap a left card, then a right card, or the reverse. A second tap in the same column changes the selection. Tapping the selected card again deselects it. Keyboard users use tab and enter; drag is optional and never required.
2. A correct match locks both cards, adds a check label and reveals the supplied one-sentence context beneath the board. Leave the explanation until the user taps “आगे”; do not auto-dismiss reading material. Unmatched cards remain in their original slots.
3. A wrong match increments `wrongMatches`, briefly marks both cards, announces “यह जोड़ी नहीं है। फिर चुनें।” and clears the selection after 500 ms. Prevent additional input during that short response.
4. After four correct or assisted matches, show “4 जोड़ियाँ पूरी”, a review of all four explanations and “पूरी कहानी पढ़ें”.

**Help and scoring:** “एक जोड़ी दिखाएँ” automatically locks the lowest-index unmatched pair and reveals its context; increment `assistedPairs`. No life limit. Score on completion is `max(0,100 − 10 × wrongMatches − 15 × assistedPairs)`. No time bonus, since reading comprehension is more important than speed. Result copy identifies help use. A revealed/assisted pair still contributes to completion.

### Content quality rules

Every right label must be unique within the set. In the sports edition, “कांस्य” alone would match three athletes, so the label includes event, category and medal. Do not say “you know all of today’s news” after four pairs; say “आज की 4 जोड़ियाँ समझीं”.

Space mission pairs deliberately specify purpose rather than loosely matching all missions with “अंतरिक्ष”. Sports content is labelled Paris 2024, not today’s medal results. Heritage pairs use four different states. Source IDs resolve to full URLs in the registry. Facts are paraphrased; no external article body or photo is copied.

For new content, an editor must verify both sides, one-to-one uniqueness, date/period, neutral Hindi explanation and article destination. The prototype has no generative runtime content and no automatic scraping. Avoid turning human suffering into scored trivia. A newsroom must approve future sensitive-event topics.

### Acceptance checks

Correct pair locks only its two cards; wrong pair never locks. Help skips already matched pairs. Repeated taps cannot double-count. All twelve explanations and source links resolve. Two cards with long sports labels wrap at 360 px without shrinking below the agreed text size.


<!-- page -->

## 9 Super Over interaction and art direction

**Concept:** a six-ball arcade challenge under the title “सुपर ओवर”. It borrows the drama of a final over; it does not claim to simulate official tie-break rules. Editions 1 and 2 are batting chases. Edition 3 is bowling defence. All scenarios are fictional practice and display **“अभ्यास मैच · काल्पनिक स्थिति”**.

### Batting screen and action

Show target remaining, balls remaining, wickets used and six outcome markers. Draw the pitch centre, batter near the lower crease, bowler at the far end and three field lanes labelled बाएँ, सामने, दाएँ. Highlight the current gap and place simple fielders in the other lanes. This is a visible skill puzzle, not hidden randomness.

Before each ball, let the player select a lane and style: **“सधा शॉट”** (`controlled`) or **“बड़ा शॉट”** (`power`). Default to the previously chosen lane/style; use centre/controlled for the first ball. “तैयार” locks selections and begins a 600 ms countdown. Then the ball moves towards the batter over its configured `travelMs`. Tap the large **“शॉट”** button when the ball reaches the crease marker. One tap resolves one delivery.

For this prototype, lane choice plus timing determine runs. Ball-flight and fielding animation illustrate the already computed outcome; they must not calculate a second independent result. After 700 ms of outcome feedback, the user taps “अगली गेंद”. No automatic next delivery.

### Bowling screen and action

Keep the same camera and HUD. Before each delivery, show the batter’s weakness as a simple practice hint, such as “यॉर्कर से परेशानी”. Choose **यॉर्कर**, **लंबाई की गेंद**, or **धीमी गेंद**, then tap “तैयार”. The timing marker travels over the configured `travelMs`; tap **“गेंद डालें”** as it reaches the target. Correct choice and accurate timing reduce runs or take a wicket.

The weakness hint makes the first bowling prototype learnable. Hiding it or making the batter adaptive is future work, not part of these rules. Labels `yorker`, `length`, `slower` are data keys; players see Hindi.

### Animation and controls

Use simple 2D character silhouettes with three actions: ready, swing/release, celebrate/respond. The ball has a short trail and a crease marker. Animate boundaries to the chosen lane; a wicket can show a catch or stump symbol without additional rules. Use no real player likenesses or team branding.

Support space/enter for the active shot/release control and arrow keys or DOM buttons for selections. Large controls remain outside the canvas. A tutorial practice ball does not consume the daily innings and explicitly explains the timing target. On visibility loss or back navigation, pause and restore the pre-ball checkpoint.


<!-- page -->

## 10 Super Over exact resolution rules

The ideal input timestamp is `deliveryStart + travelMs`. Define `errorMs = inputTimestamp − idealTimestamp`; use its absolute value for quality. Both timestamps must use the same monotonic clock. A tap during the countdown is ignored. A tap after launch resolves once, even if much too early. If there is no tap by `idealTimestamp + 300 ms`, resolve a miss. Do not let duplicate input resolve another ball.

| Timing band | Absolute error |
|---|---|
| Perfect | 0–70 ms inclusive |
| Good | >70–150 ms inclusive |
| Loose | >150–250 ms inclusive |
| Miss | >250 ms or no tap |

### Batting outcomes

“Open” means selected lane equals the supplied gap. Otherwise it is covered.

| Style and lane | Perfect | Good | Loose | Miss |
|---|---|---|---|---|
| Controlled, open | 4 runs | 2 | 1 | 0 |
| Controlled, covered | 1 run | 0 | 0 | 0 |
| Power, open | 6 runs | 4 | wicket | 0 |
| Power, covered | 2 runs | wicket | wicket | 0 |

### Bowling outcomes

| Choice | Perfect | Good | Loose | Miss |
|---|---|---|---|---|
| Matches weakness | wicket | 0 runs | 1 | 6 |
| Other choice | 2 runs | 4 | 6 | 6 |

Wickets always add zero runs. Every resolved delivery consumes one ball. There are no wides, no-balls, extras, strike rotation or new-batter controls. Two wickets or six balls end the innings unless the target has already been reached. Timing feedback says “जल्दी”, “देर से” or “सही समय” alongside the actual outcome.

**Target definition:** `target` is runs needed to win from the start of this scenario. For batting, reaching it is a win immediately; at the end, `target − 1` is a tie and anything less is a loss. For bowling, the running total is opponent runs conceded: reaching target is a loss immediately; a completed innings at `target − 1` is tied; lower is a win. Never label a tied score a successful defence.

Examples: day 1 needs 10; 9 is tied after the innings ends. Day 2 needs 15; 14 is tied. Day 3’s opponent needs 12; 10 or fewer conceded wins, 11 ties, 12 loses. End on reaching the target even if balls remain. A two-wicket innings tied on runs is still a tie in this simplified game.

**Results:** show outcome, runs, wickets and balls used. There is no unrelated 100-point cricket score. Offer practice replay and the scenario article, labelled as fictional. Keep first result and best practice result separately. Use `game-rules.mjs` as the executable reference; its scoring and termination boundaries have been checked, but UI timing and device latency have not yet been playtested.


<!-- page -->

## 11 Aaj Ka Shot mechanics and physics

**Goal:** solve a short Carrom layout with a limited number of shots. This is a puzzle with a striker and targets, not a full rulebook game with turns, queen cover and an opponent. Day 1 uses one coin; day 2 adds a bank condition; day 3 uses two coins in any order.

Use logical board coordinates from `(0,0)` at top left to `(1000,1000)` at bottom right. Scale uniformly to the available width. The playing wall bounds are 40–960. Four pocket centres are `(60,60)`, `(940,60)`, `(60,940)`, `(940,940)` with capture radius 42. Coins have radius 18 and mass 1; striker radius 24 and mass 2.

### Aim and release

First move the striker along the baseline `y=820`, `x=250…750`, using a slider or dragging the placement handle. Then drag back from the striker to set direction and power. Angle 0 points straight up; positive angles point right. Limit to −80…80 degrees. Drag under 12 logical units cancels; otherwise speed is `400 + 1400 × clamp((dragDistance − 12)/168,0,1)`. Release fires once. Show a 150-unit aim line and a power meter, not a guaranteed full trajectory.

Provide button alternatives: left/right placement, angle and power sliders, and “शॉट लगाएँ”. Striker placement and firing must be separate states so moving it does not accidentally take a shot. Disable input while any body is moving. Consume a shot on release, never on cancelled drag.

### Simulation and shot settlement

Use the supplied original fixed-step model: `dt=1/120 s`, exponential drag `v *= exp(−0.65×dt)`, wall restitution 0.85, disk restitution 0.88 and circular impulse collisions. Resolve pocket sensors before walls. Stop each body below 5 units/s; force settlement at 12 seconds. Maintain an accumulator; if the app cannot keep up or becomes hidden, pause/restart the saved shot rather than simulating a huge elapsed time.

After a valid shot, pocketed target coins remain removed and other targets retain their settled positions. Reposition the striker on the baseline before the next shot. Store pre-shot and post-shot snapshots. For this puzzle version, a striker pocket is a foul: consume the shot and restore every target to its pre-shot position, undoing targets pocketed on that shot. Show “स्ट्राइकर पॉकेट में गया। गोटियाँ वापस रखी गईं।”

Day 2 requires the striker to touch any wall **before its first target collision on that shot**. A direct pocket does not satisfy the puzzle: consume the shot and restore the pre-shot targets. No bank requirement applies to days 1 or 3. Empty shots may move targets normally.

**Finish:** if all targets are removed on a valid settled shot, win; otherwise lose when shots reach the limit. Score is `max(0,100 − 20 × (shotsUsed − 1))` on success, 0 on failure. Show “2 शॉट में पूरा” prominently; replay resets the full layout and is practice. Do not claim a physically exact Carrom simulation: the supplied parameters and demo solutions establish feasibility, while touch feel still requires tuning.


<!-- page -->

## 12 Content ownership and candidate build order

The seed contains fifteen candidate game configurations, six articles and twelve sourced Jodo pairs. It does not make the candidate lineup final. Keep each game independent so an experiment can be replaced without rebuilding the rest.

**Build order:** (1) simple background `news.html`; (2) corrected standalone `wordal.html`; (3) Niti; (4) Jodo; (5) review/adapt the existing Super Over; (6) Carrom if retained. Review each file with the user before moving its mechanics beyond the agreed version. The other existing games remain available as references.

Every candidate needs its own first-play instruction, complete round, result, three-day selector and story connection. The news page launches only available candidates. Do not delay a useful single-game review until all five are complete.

**Content fields:** Niti options and attribution, Shabd five answer units and keyboard, Jodo one-to-one pairs and source IDs, cricket six delivery values, Carrom layouts, and complete article paragraphs are supplied in JSON. All IDs must resolve. Feature article sources are real; Niti thoughts are original demo writing; cricket situations are fictional practice.

**Validation before handoff:** each final HTML opens independently with network disabled; no missing stylesheet/script or top-level redirect; all edition content is included; related story opens inside it; return preserves the result. Then check sibling news links and optional iframe integration through the existing local server. The reference rules and data checks are separate from these future UI checks.

<!-- page -->

## 13 Three day content sheets

Copy each game’s three records into its HTML. The 24 Shabd keys below are reusable input keys, not consumable tiles. “Topic” is shown before play; “Meaning” only after the answer is revealed. All article connections work through the in-file reader.

### दिन 1 · जिज्ञासा और खोज

**Edition ID:** `d1` · **Period label:** अंतरिक्ष विशेष

#### Niti

**Prompt:** नई बात समझने की शुरुआत ___ से होती है।

**o1:** जल्दी मान लेने | **o2:** सवाल पूछने | **o3:** चुप रहने | **o4:** नकल करने

**Answer:** `o2` · **Full thought:** नई बात समझने की शुरुआत सवाल पूछने से होती है।

**Meaning:** जो समझ न आए, उसके बारे में पूछना सीखने का पहला कदम है।

**Attribution:** मौलिक विचार · डेमो के लिए लिखा गया · **Article CTA:** खोज की एक कहानी पढ़ें

#### Shabd

**Topic before play:** खोज और अध्ययन

**Answer:** अनुसंधान · **Slots:** अ | नु | सं | धा | न

**24 reusable keys in display order:** k1 अ · k2 नु · k3 सं · k4 धा · k5 न · k6 प्र · k7 ति · k8 यो · k9 गि · k10 ता · k11 ऐ · k12 हा · k13 सि · k14 क · k15 आ · k16 का · k17 श · k18 वा · k19 णी · k20 रा · k21 ज · k22 नी · k23 म · k24 भा

**Meaning after reveal:** किसी विषय को व्यवस्थित ढंग से खोजने और समझने का काम। · **Guesses:** 6

#### Jodo

**Title:** मिशन और उसका काम · **Instruction:** मिशन को उसके मुख्य काम से जोड़ें।

**Left order:** [1, 2, 3, 4] · **Right order:** [3, 1, 4, 2] (one-based pair indices)

| Pair | Left and correct right | Reveal and source |
|---|---|---|
| d1-p1 | चंद्रयान-3 → **चाँद पर उतरना और रोवर चलाना** | चंद्रयान-3 के उद्देश्यों में सुरक्षित उतरना, रोवर चलाना और चाँद पर प्रयोग करना शामिल था। [S01] |
| d1-p2 | आदित्य-एल1 → **सूर्य का अध्ययन** | आदित्य-एल1 सूर्य का अध्ययन करने के लिए बनाया गया मिशन है। [S02] |
| d1-p3 | मंगलयान → **मंगल की सतह और वायुमंडल** | मंगलयान के वैज्ञानिक उद्देश्यों में मंगल की सतह और वायुमंडल का अध्ययन शामिल था। [S03] |
| d1-p4 | एस्ट्रोसैट → **अलग-अलग तरंगों में खगोलीय पिंड देखना** | एस्ट्रोसैट एक्स-रे, दृश्य और पराबैंगनी प्रकाश में एक साथ अवलोकन कर सकता है। [S04] |

**All three article links:** `d1-feature`. Niti share text uses the full thought, attribution and ‘आज की नीति · भास्कर खेल डेमो’. Shabd uses its standard article label; Jodo uses ‘पूरी कहानी पढ़ें’.

<!-- page -->

### दिन 2 · अभ्यास और प्रयास

**Edition ID:** `d2` · **Period label:** पेरिस 2024 की यादें

#### Niti

**Prompt:** छोटा अभ्यास भी काम आता है, जब हम उसे ___।

**o1:** एक बार करके छोड़ दें | **o2:** सिर्फ सोचते रहें | **o3:** नियमित दोहराएँ | **o4:** दूसरों पर छोड़ दें

**Answer:** `o3` · **Full thought:** छोटा अभ्यास भी काम आता है, जब हम उसे नियमित दोहराएँ।

**Meaning:** रोज थोड़ा अभ्यास करने से अपनी गलतियों को समझने और सुधारने का मौका मिलता है।

**Attribution:** मौलिक विचार · डेमो के लिए लिखा गया · **Article CTA:** खेल की एक कहानी पढ़ें

#### Shabd

**Topic before play:** खेल और मुकाबला

**Answer:** प्रतियोगिता · **Slots:** प्र | ति | यो | गि | ता

**24 reusable keys in display order:** k1 अ · k2 नु · k3 सं · k4 धा · k5 न · k6 प्र · k7 ति · k8 यो · k9 गि · k10 ता · k11 ऐ · k12 हा · k13 सि · k14 क · k15 आ · k16 का · k17 श · k18 वा · k19 णी · k20 रा · k21 ज · k22 नी · k23 म · k24 भा

**Meaning after reveal:** ऐसा आयोजन जिसमें भाग लेने वाले तय नियमों के अनुसार मुकाबला करते हैं। · **Guesses:** 6

#### Jodo

**Title:** पेरिस 2024 के खिलाड़ी · **Instruction:** खिलाड़ी को उसकी स्पर्धा और पदक से जोड़ें।

**Left order:** [1, 2, 3, 4] · **Right order:** [4, 3, 1, 2] (one-based pair indices)

| Pair | Left and correct right | Reveal and source |
|---|---|---|
| d2-p1 | मनु भाकर → **10 मीटर एयर पिस्टल महिला · कांस्य** | मनु भाकर ने पेरिस 2024 में महिला 10 मीटर एयर पिस्टल स्पर्धा में कांस्य जीता। [S05] |
| d2-p2 | नीरज चोपड़ा → **भाला फेंक पुरुष · रजत** | नीरज चोपड़ा ने पेरिस 2024 में पुरुष भाला फेंक में रजत पदक जीता। [S06] |
| d2-p3 | स्वप्निल कुसाले → **50 मीटर राइफल 3 पोज़िशन पुरुष · कांस्य** | स्वप्निल कुसाले ने पेरिस 2024 में पुरुष 50 मीटर राइफल 3 पोज़िशन में कांस्य जीता। [S07] |
| d2-p4 | अमन सहरावत → **57 किग्रा फ्रीस्टाइल कुश्ती पुरुष · कांस्य** | अमन सहरावत ने पेरिस 2024 में पुरुष 57 किग्रा फ्रीस्टाइल कुश्ती में कांस्य जीता। [S08] |

**All three article links:** `d2-feature`. Niti share text uses the full thought, attribution and ‘आज की नीति · भास्कर खेल डेमो’. Shabd uses its standard article label; Jodo uses ‘पूरी कहानी पढ़ें’.

<!-- page -->

### दिन 3 · विरासत और देखभाल

**Edition ID:** `d3` · **Period label:** भारत की विरासत

#### Niti

**Prompt:** विरासत अगली पीढ़ी तक पहुँचती है, जब हम उसे ___।

**o1:** केवल तस्वीरों में देखें | **o2:** भुला दें | **o3:** अपना नाम दें | **o4:** समझें और सँभालें

**Answer:** `o4` · **Full thought:** विरासत अगली पीढ़ी तक पहुँचती है, जब हम उसे समझें और सँभालें।

**Meaning:** पुरानी जगहों और परंपराओं का महत्व जानना उनकी देखभाल की शुरुआत हो सकता है।

**Attribution:** मौलिक विचार · डेमो के लिए लिखा गया · **Article CTA:** विरासत की एक कहानी पढ़ें

#### Shabd

**Topic before play:** इतिहास और धरोहर

**Answer:** ऐतिहासिक · **Slots:** ऐ | ति | हा | सि | क

**24 reusable keys in display order:** k1 अ · k2 नु · k3 सं · k4 धा · k5 न · k6 प्र · k7 ति · k8 यो · k9 गि · k10 ता · k11 ऐ · k12 हा · k13 सि · k14 क · k15 आ · k16 का · k17 श · k18 वा · k19 णी · k20 रा · k21 ज · k22 नी · k23 म · k24 भा

**Meaning after reveal:** इतिहास से जुड़ा हुआ। · **Guesses:** 6

#### Jodo

**Title:** धरोहर और राज्य · **Instruction:** धरोहर को उसके राज्य से जोड़ें।

**Left order:** [1, 2, 3, 4] · **Right order:** [2, 4, 1, 3] (one-based pair indices)

| Pair | Left and correct right | Reveal and source |
|---|---|---|
| d3-p1 | धोलावीरा → **गुजरात** | धोलावीरा गुजरात में स्थित हड़प्पा सभ्यता का स्थल है। [S09] |
| d3-p2 | हम्पी → **कर्नाटक** | हम्पी के स्मारक कर्नाटक में विजयनगर के इतिहास से जुड़े हैं। [S10] |
| d3-p3 | साँची → **मध्य प्रदेश** | साँची के बौद्ध स्मारक मध्य प्रदेश में हैं। [S11] |
| d3-p4 | कोणार्क सूर्य मंदिर → **ओडिशा** | कोणार्क का सूर्य मंदिर ओडिशा में है। [S12] |

**All three article links:** `d3-feature`. Niti share text uses the full thought, attribution and ‘आज की नीति · भास्कर खेल डेमो’. Shabd uses its standard article label; Jodo uses ‘पूरी कहानी पढ़ें’.

<!-- page -->

### दिन 1 play configurations and news copy

#### Super Over

**ID:** `d1-superover` · **Mode:** `bat` · **Target to win:** 10 · **Limits:** 6 balls, 2 wickets.

**Instruction:** खाली दिशा चुनें। गेंद निशान पर आए, तब शॉट खेलें। **Label:** अभ्यास मैच · काल्पनिक स्थिति

| Ball | Travel or timing duration | Gap or batter weakness |
|---|---|---|
| 1 | 1400 ms | L |
| 2 | 1300 ms | C |
| 3 | 1500 ms | R |
| 4 | 1200 ms | L |
| 5 | 1400 ms | R |
| 6 | 1300 ms | C |



L = बाएँ; C = सामने; R = दाएँ. Yorker = यॉर्कर; length = लंबाई की गेंद; slower = धीमी गेंद. Gap/weakness is visible before the action.

#### Carrom

**ID:** `d1-carrom` · **Title:** सीधा निशाना · **Objective:** 2 शॉट में लाल गोटी किसी पॉकेट में डालें।

**Targets:** `red` at (390, 410). **Shot limit:** 2. **Bank required:** false. No blockers or required coin order.

**Reference solution for developer replay:** shot 1: striker x=500, angle=-12°, speed=600 → red. Use sequential settled positions. These prove feasibility in the reference model; do not show them by default to players.

<!-- page -->

### दिन 1 sample articles

Show the feed-level demo label and each article’s type and period. These are complete original sample texts, not copied Bhaskar reports.

#### भारत के चार अंतरिक्ष मिशन क्या खोजते हैं

**ID:** `d1-feature` · **Category:** विज्ञान · **Type:** `researched-demo`

**Period:** अंतरिक्ष मिशनों पर संदर्भ लेख

**Card summary:** चाँद, सूर्य, मंगल और दूर के खगोलीय पिंडों को समझने के अलग-अलग तरीके।

भारत के अंतरिक्ष मिशनों के काम एक जैसे नहीं हैं। चंद्रयान-3 के उद्देश्यों में चाँद पर सुरक्षित उतरना, रोवर चलाना और वहीं वैज्ञानिक प्रयोग करना शामिल था। आदित्य-एल1 सूर्य के अध्ययन के लिए बनाया गया है।

मंगलयान के वैज्ञानिक उद्देश्यों में मंगल की सतह और वायुमंडल को समझना शामिल था। एस्ट्रोसैट खगोलीय पिंडों को एक्स-रे, दृश्य और पराबैंगनी प्रकाश में एक साथ देख सकता है।

इस डेमो संस्करण के जोड़ो खेल में हर मिशन को उसके काम से मिलाइए। आज का शब्द भी इसी विषय से जुड़ा है। यह संदर्भ सामग्री है, किसी नई घटना की खबर नहीं।

**Sources:** S01, S02, S03, S04

**Article buttons:** आज का शब्द खेलें · जोड़ो खेलें · आज की नीति देखें

#### अभ्यास चुनौती में 6 गेंदों पर 10 रन चाहिए

**ID:** `d1-cricket` · **Category:** क्रिकेट अभ्यास · **Type:** `fictional-practice`

**Period:** काल्पनिक अभ्यास स्थिति

**Card summary:** सही समय और सही चुनाव की छह गेंदों वाली चुनौती।

यह एक काल्पनिक क्रिकेट अभ्यास स्थिति है। आपकी टीम को जीतने के लिए आखिरी 6 गेंदों में 10 रन चाहिए। दो विकेट गिरने पर पारी रुक जाएगी।

मैदान की खाली दिशा देखें और सधे हुए या बड़े शॉट में से चुनें। गेंद निशान तक पहुँचे, तब शॉट खेलें। यह किसी वास्तविक मैच का स्कोर या परिणाम नहीं है।

**Sources:** Original fictional practice scenario; no real match claimed.

**Article button:** सुपर ओवर खेलें

**Feed order:** `d1-feature` → five-game module → `d1-cricket`. Both articles link back to `./news.html?day=d1`.

<!-- page -->

### दिन 2 play configurations and news copy

#### Super Over

**ID:** `d2-superover` · **Mode:** `bat` · **Target to win:** 15 · **Limits:** 6 balls, 2 wickets.

**Instruction:** खाली दिशा चुनें। गेंद निशान पर आए, तब शॉट खेलें। **Label:** अभ्यास मैच · काल्पनिक स्थिति

| Ball | Travel or timing duration | Gap or batter weakness |
|---|---|---|
| 1 | 1200 ms | R |
| 2 | 1000 ms | L |
| 3 | 1300 ms | C |
| 4 | 1100 ms | R |
| 5 | 1000 ms | C |
| 6 | 1200 ms | L |



L = बाएँ; C = सामने; R = दाएँ. Yorker = यॉर्कर; length = लंबाई की गेंद; slower = धीमी गेंद. Gap/weakness is visible before the action.

#### Carrom

**ID:** `d2-carrom` · **Title:** किनारे से निशाना · **Objective:** 3 शॉट में लाल गोटी डालें। उस शॉट में स्ट्राइकर पहले किनारे से टकराए।

**Targets:** `red` at (500, 420). **Shot limit:** 3. **Bank required:** true. No blockers or required coin order.

**Reference solution for developer replay:** shot 1: striker x=500, angle=-39°, speed=1500 → red. Use sequential settled positions. These prove feasibility in the reference model; do not show them by default to players.

<!-- page -->

### दिन 2 sample articles

Show the feed-level demo label and each article’s type and period. These are complete original sample texts, not copied Bhaskar reports.

#### पेरिस 2024 में इन चार खिलाड़ियों ने किन स्पर्धाओं में पदक जीते

**ID:** `d2-feature` · **Category:** खेल · **Type:** `researched-demo`

**Period:** ऐतिहासिक संदर्भ · पेरिस ओलंपिक 2024

**Card summary:** चार नाम, चार अलग स्पर्धाएँ। पदक के साथ स्पर्धा पहचानिए।

पेरिस ओलंपिक 2024 में मनु भाकर ने महिला 10 मीटर एयर पिस्टल में कांस्य पदक जीता। नीरज चोपड़ा ने पुरुष भाला फेंक में रजत पदक हासिल किया।

स्वप्निल कुसाले ने पुरुष 50 मीटर राइफल 3 पोज़िशन में कांस्य जीता। अमन सहरावत ने पुरुष 57 किग्रा फ्रीस्टाइल कुश्ती में कांस्य पदक जीता।

इन चार उपलब्धियों को सही स्पर्धा के साथ पहचानना आज के जोड़ो खेल की चुनौती है। यह चयन पूरी भारतीय पदक सूची नहीं है। आज की नीति अभ्यास पर एक अलग मौलिक विचार है; इसे किसी खिलाड़ी का कथन न मानें।

**Sources:** S05, S06, S07, S08

**Article buttons:** आज का शब्द खेलें · जोड़ो खेलें · आज की नीति देखें

#### अभ्यास चुनौती में 6 गेंदों पर 15 रन चाहिए

**ID:** `d2-cricket` · **Category:** क्रिकेट अभ्यास · **Type:** `fictional-practice`

**Period:** काल्पनिक अभ्यास स्थिति

**Card summary:** सही समय और सही चुनाव की छह गेंदों वाली चुनौती।

यह एक काल्पनिक क्रिकेट अभ्यास स्थिति है। आपकी टीम को जीतने के लिए आखिरी 6 गेंदों में 15 रन चाहिए। दो विकेट गिरने पर पारी रुक जाएगी।

मैदान की खाली दिशा देखें और सधे हुए या बड़े शॉट में से चुनें। गेंद निशान तक पहुँचे, तब शॉट खेलें। यह किसी वास्तविक मैच का स्कोर या परिणाम नहीं है।

**Sources:** Original fictional practice scenario; no real match claimed.

**Article button:** सुपर ओवर खेलें

**Feed order:** `d2-feature` → five-game module → `d2-cricket`. Both articles link back to `./news.html?day=d2`.

<!-- page -->

### दिन 3 play configurations and news copy

#### Super Over

**ID:** `d3-superover` · **Mode:** `bowl` · **Target to win:** 12 · **Limits:** 6 balls, 2 wickets.

**Instruction:** कमजोरी देखें। गेंद चुनें और सही समय पर डालें। **Label:** अभ्यास मैच · काल्पनिक स्थिति

| Ball | Travel or timing duration | Gap or batter weakness |
|---|---|---|
| 1 | 1400 ms | yorker |
| 2 | 1200 ms | slower |
| 3 | 1300 ms | length |
| 4 | 1100 ms | yorker |
| 5 | 1200 ms | length |
| 6 | 1000 ms | slower |



L = बाएँ; C = सामने; R = दाएँ. Yorker = यॉर्कर; length = लंबाई की गेंद; slower = धीमी गेंद. Gap/weakness is visible before the action.

#### Carrom

**ID:** `d3-carrom` · **Title:** दो गोटियाँ · **Objective:** 3 शॉट में दोनों गोटियाँ किसी भी क्रम में डालें।

**Targets:** `red` at (360, 400); `white` at (640, 400). **Shot limit:** 3. **Bank required:** false. No blockers or required coin order.

**Reference solution for developer replay:** shot 1: striker x=500, angle=-6°, speed=1800 → red; shot 2: striker x=500, angle=6°, speed=1800 → white. Use sequential settled positions. These prove feasibility in the reference model; do not show them by default to players.

<!-- page -->

### दिन 3 sample articles

Show the feed-level demo label and each article’s type and period. These are complete original sample texts, not copied Bhaskar reports.

#### भारत की चार धरोहरें और उनके राज्य

**ID:** `d3-feature` · **Category:** संस्कृति · **Type:** `researched-demo`

**Period:** विश्व धरोहर स्थलों पर संदर्भ लेख

**Card summary:** गुजरात से ओडिशा तक, चार जगहों की पहचान और इतिहास।

धोलावीरा गुजरात में हड़प्पा सभ्यता का एक स्थल है। वहाँ की जल व्यवस्था उस समय की नगर योजना को समझने में मदद करती है। कर्नाटक के हम्पी में विजयनगर के अवशेष हैं।

मध्य प्रदेश में साँची के बौद्ध स्मारक हैं। ओडिशा का कोणार्क सूर्य मंदिर सूर्य के रथ की कल्पना से जुड़ी अपनी बनावट के लिए जाना जाता है। ये चारों स्थल यूनेस्को की विश्व धरोहर सूची में दर्ज हैं।

आज के जोड़ो में इन स्थानों को उनके राज्यों से मिलाइए। शब्द खेल में इसी विषय का एक शब्द मिलेगा। यह संदर्भ लेख है; किसी नए संरक्षण अभियान या घोषणा का दावा नहीं करता।

**Sources:** S09, S10, S11, S12

**Article buttons:** आज का शब्द खेलें · जोड़ो खेलें · आज की नीति देखें

#### अभ्यास चुनौती में 11 रन बचाइए

**ID:** `d3-cricket` · **Category:** क्रिकेट अभ्यास · **Type:** `fictional-practice`

**Period:** काल्पनिक अभ्यास स्थिति

**Card summary:** सही समय और सही चुनाव की छह गेंदों वाली चुनौती।

यह एक काल्पनिक क्रिकेट अभ्यास स्थिति है। मेहमान टीम को 6 गेंदों में जीतने के लिए 12 रन चाहिए। उसे 10 या कम पर रोकने पर आप जीतेंगे; 11 पर बराबरी होगी।

हर गेंद से पहले बल्लेबाज की कमजोर जगह का संकेत पढ़ें। गेंद का प्रकार चुनकर सही समय पर डालें। दो विकेट लेने पर पारी रुकती है। यह किसी वास्तविक मैच का परिणाम नहीं है।

**Sources:** Original fictional practice scenario; no real match claimed.

**Article button:** सुपर ओवर खेलें

**Feed order:** `d3-feature` → five-game module → `d3-cricket`. Both articles link back to `./news.html?day=d3`.

<!-- page -->

## 14 One game at a time handoff

**Instruction for the next Codex implementation:** use the inspected existing app and visual system as references. Build only the requested candidate as one self-contained HTML file, including its three demo editions and related story copy. Keep it independently openable. Do not introduce React or require runtime imports, a parent iframe, a JSON fetch or a news backend. Use the corrected Wordal rules exactly when that game is requested.

Build the background news page as a separate sibling HTML when requested; use relative links and the shared look. Keep the existing root/index and other games intact unless the user asks to modify them. Optional app registration follows independent gameplay verification.

### Review checklist per file

- Can it open directly and work without a network connection?
- Are all three editions playable, with exact data and no broken story links?
- Is the five-by-six Wordal grid correct, with 24 repeatable keys and duplicate-aware feedback?
- Are game input, pause, refresh, reset and replay understandable?
- Does the article panel close back to the same game state?
- Is the Hindi readable at 360 and 430 px, with keyboard focus and text alternatives to colour?
- Does it share the existing app palette and button appearance?

For Niti, test wrong answers and share-card download. For Jodo, test every pair, long labels and help. For cricket, test exact timing boundaries, target/tie rules and duplicate taps. For Carrom, replay the reference solutions and test foul rollback. These remain playable-build checks, not claims already validated by this document.

**Package status:** the data and reference-rule checks have been run; Carrom solution inputs were retained from the checked model. No standalone game files or background page were implemented in this revision. The next action is to choose the first file to build, rather than implement a production app.

<!-- page -->

## 15 Sources and project references

The uploaded Game Lab PDF and earlier discussion provide the brief and candidate roles. The inspected `wordal.html`, `Superover.html`, `src/main.js`, `src/games/base-html-game.js`, `src/styles/design-system.css` and `package.json` establish the existing project structure and visual reference. Their existence does not make every existing mechanic or game final.

The researched feature facts below are retained from version 1. The mock stories are original summaries; source links provide traceability. No new current-news claim is added in this revision.

**S01 · [ISRO Chandrayaan 3 objectives](https://www.isro.gov.in/ISRO_EN/Chandrayaan3_New.html)**  
Soft landing, rover and in situ lunar experiments.

**S02 · [ISRO Aditya L1 mission details](https://www.isro.gov.in/Aditya_L1-MissionDetails.html)**  
Mission dedicated to studying the Sun.

**S03 · [ISRO Mars Orbiter objectives](https://www.isro.gov.in/mission_objective_C25.html)**  
Mars surface and atmospheric studies.

**S04 · [ISRO AstroSat](https://www.isro.gov.in/AstroSat.html)**  
Simultaneous observations in X-ray, optical and ultraviolet bands.

**S05 · [PIB Manu Bhaker bronze 28 July 2024](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2038138&lang=2&reg=48)**  
Women’s 10m air pistol bronze at Paris 2024.

**S06 · [PIB Neeraj Chopra silver 9 August 2024](https://www.pib.gov.in/FeaturesDeatils.aspx?ModuleId=2&NoteId=153309&lang=2&reg=48)**  
Men’s javelin silver at Paris 2024.

**S07 · [PIB Swapnil Kusale bronze 1 August 2024](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2040211&lang=2&reg=48)**  
Men’s 50m rifle three positions bronze at Paris 2024.

**S08 · [PIB Aman Sehrawat bronze 9 August 2024](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2043947&lang=2&reg=48)**  
Men’s freestyle wrestling 57kg bronze at Paris 2024.

**S09 · [UNESCO Dholavira](https://whc.unesco.org/en/list/1645/)**  
Harappan city in Gujarat with water management features.

**S10 · [UNESCO Hampi](https://whc.unesco.org/en/list/241/)**  
Vijayanagara remains in Karnataka.

**S11 · [UNESCO Sanchi](https://whc.unesco.org/en/list/524/)**  
Buddhist monuments in Madhya Pradesh.

**S12 · [UNESCO Konark](https://whc.unesco.org/en/list/246/)**  
Sun Temple in Odisha; the listing uses the former spelling Orissa.

**T03 · [MDN Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)**  
Mouse and touch handling, pointer capture and cancellation.

**T04 · [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)**  
Animation timing and visibility considerations.

**T05 · [MDN Web Share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)**  
Native share support is conditional; provide a fallback.