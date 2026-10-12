# Separate coding prompts

These are implementation requests for later. No game code was changed for this pitch revision.
Naming assumption: retain the existing full names, including आज की जोड़ी / Aaj Ki Jodi. The requested alternative name was unclear.

## 1. Carrom: continue until completion
Update `Carrom_Puzzles.html` so the player can keep taking shots until the daily objective is complete.
Show a persistent Hindi counter, “कुल शॉट: N”, and increment it once per valid released shot, including misses and fouls.
After a normal miss, keep settled coin positions and pocketed progress, return the striker to the baseline, and allow another shot.
If a foul makes the objective impossible, reset the layout with a clear explanation while retaining the cumulative shot count.
Remove the one-shot rule, preserve the board and total across reloads, and award daily completion only once.
Verify multiple misses, multi-shot completion, a foul, reload, and replay after completion in both standalone and embedded modes.

## 2. Carrom: daily challenge and meaningful improvement
Give each authored Carrom layout a stable challenge ID and show the same daily layout to everyone on that edition.
Vary the challenge through coin placement and bank-shot opportunities, keeping controls familiar and objectives achievable across multiple shots.
Store the first completion total and best completed replay separately, using fewer shots as the better result.
Compare scores only for the same layout and rules version; do not treat different daily boards as equally difficult.
After completion, offer an optional replay and a share result containing challenge ID, total shots, and Dainik Bhaskar attribution.
Check edition changes, stored best scores, fresh replay counters, and that repeated play does not award extra daily completion.

## 3. Aaj Ki Jodi: understand connections in the news
Revise `jodo.html` so each daily round matches four unambiguous relationships drawn from selected, verified news stories.
Give each pair an explanation, source/date, freshness label, and its own relevant article destination.
Reveal why the relationship matters after each correct match, allow retries, and preserve progress when opening an article.
Replace any “you are fully caught up” promise with “आज की खबरों से चार बातें समझीं”; label archive or evergreen editions honestly.
Keep the content editor-authored and mark sample reporting as demo content rather than implying Bhaskar published it.
Verify unique answers, per-pair article links, source labels, hint behavior, and return-to-game state on mobile.

## 4. Names, branding, and share invitations
Use “Dainik Bhaskar / दैनिक भास्कर” consistently and retain the established full daily game names across the hub, rules, results, and shares.
Use “आज की जोड़ी / Aaj Ki Jodi” for the matching game unless a replacement name is explicitly confirmed.
Give Jodi a spoiler-free share card showing the edition and completion result with an invitation to try the same round.
Keep Niti sharing focused on the complete thought and its honest attribution, and Carrom sharing focused on shots taken.
Use an actual hosted edition link only when available; otherwise provide image/text export with an honest local-demo fallback.
Check readable Hindi, accurate names, no answer leakage in Jodi shares, and share cancellation or unsupported-browser behavior.
