# Navigation and supporting screens UX review

12 October 2026 · Review only · No application changes proposed here have been implemented.

This review uses the live local homepage, ranking, profile, news feed and an article, plus the current source and the project design notes. It is a design recommendation, not a usability study or evidence of retention.

The reference is the existing homepage and the product promise: **थोड़ा खेल, हर रोज़।** A reader picks a mood, plays briefly, sees a meaningful result and can return tomorrow. The news connection remains important: **खबर से खेल तक, खेल से समझ तक।**

## Recommendation

Keep the homepage's five illustrated cards and calm visual language. Remove public ranking from the initial product. Replace the current profile with a small personal-progress view when useful history is available. Keep related stories, but make them part of the game journey rather than a competing news homepage.

For the first revision, there is no need to replace four bottom tabs with four new ones. Prefer a single game home, a compact settings entry and a progress sheet opened from the existing torch/week tracker. News can open from game results and contextual article invitations. Removing the bottom bar would also give the game cards more vertical room; this is a navigation change, not a redesign of the cards.

If a second destination proves necessary after testing, use **मेरे खेल** for real history. Do not ship an empty destination just to fill the navigation.

## What is wrong today

| Area | Observed issue | Product implication |
|---|---|---|
| Ranking | Randomly generated players and scores, without a visible sample-data label | The screen implies a real competition that does not exist. |
| Ranking controls | Weekly/all-time buttons have no handlers; game selector is a placeholder | Controls promise choices that do not change the results. |
| Ranking selector | Alias registrations appear as duplicate game names | A five-game collection appears more complicated than it is. |
| Profile | Generic “Player” avatar, level, XP, total score and 11 achievement rows | The experience reads as a generic gaming dashboard instead of a brief daily ritual. |
| Profile copy | Mixed Hindi/English and visible `ach.first_game`-style translation keys | The supporting screen feels unfinished and disconnected from the Hindi-first home. |
| Profile data | Fresh demo shows a 12-day streak beside zero games played | Seeded walkthrough data needs an explicit demo explanation; it should not become a claim about a real player's history. |
| News | Separate masthead, yellow accent bar, cream surfaces, prominent red return button and lengthy feed cards | Shared branding does not currently produce the same visual family as the home. |
| News editions | Stories from other editions remain in the feed; active-edition stories are merely sorted first | “Today's” collection does not have a clear content boundary. |
| Wordal entry | Feed labels/excerpts and article copy expose the answer अनुसंधान | Article-first readers can reach an already-spoiled word challenge. |

## Ranking: remove from primary navigation

Competition is not required to support mastery. Personal improvement is enough for this version. Niti is reflection and sharing; it has no useful public rank. Wordal, cricket, Jodo and Carrom also have different measures of success, so a common point total is not a meaningful account of ability.

Even a future per-game ranking would require equivalent puzzles/conditions, a defined first-attempt policy, real submissions and handling for readers who have already seen an answer. Those requirements are additional product work, not a styling fix.

Preserve suitable personal bests and optional result sharing. Revisit competition only if player research shows demand, initially within a specific game or an optional challenge between friends. Until then, remove rank from result panels too; hiding the tab alone would leave the same message elsewhere.

## Profile: keep the useful information, remove the gaming identity

An account/profile destination has little purpose in the current local prototype. Users need access to their play and preferences, not a placeholder identity.

Useful personal history would contain:

- Games played this week and today's completed games.
- Wordal: first-result history, solve rate and attempts used.
- Cricket: daily challenge result; practice best shown separately.
- Carrom: completed puzzles and shots used.
- Jodo: completed connections and mistakes, if recorded reliably.
- Niti: completed thoughts and access to the day's share card; no numeric rank.

Only show metrics that the game actually records. Do not infer unavailable history from XP or aggregate scores. Distinguish first daily results from repeated practice. Progress stored on this device should be described accordingly, without suggesting account sync.

Remove XP, levels, cumulative cross-game score and the locked-achievement catalogue from the interface. Retain the established torch and week tracker, with encouraging wording and no requirement to finish all five games. Put language, audio and help in compact settings; place reset deeper in that view.

## समाचार: preserve the connection, change its role

The existing prototype feed is useful for demonstrating **article → game**. Keep that demo entry available for presentations. For the reader experience, prioritise **game → result/meaning → optional related story → return to the same result**.

Use **इस खेल से जुड़ी खबर** on a result card, with a specific headline, a short explanation of the connection, source/date and one clear action. Do not force reading or attach a story to Carrom merely for consistency. Niti's story connection can also remain optional.

The reader should inherit the home's paper colour, typography, spacing, flat surfaces and restrained accents. Keep article text comfortable to read; visual consistency does not mean squeezing a story into a game card. Use a simple back action rather than repeating a large “आज के खेल” button and brand masthead.

Separate current reporting, explainers, archives and evergreen material clearly. In the prototype, retain the demo label and source information. An article that reveals Wordal's answer should lead to a clearly labelled practice experience or a different unspoiled puzzle, rather than presenting that same answer as a fresh scored challenge.

## What to add first

1. **Reliable continuity:** resume an unfinished game; article return must preserve the exact round/result.
2. **Meaningful results:** explain the word, thought or connection, then offer sharing and relevant reading where appropriate.
3. **Light personal history:** real per-game results available through the existing progress area, with an inviting first-use state.
4. **Consistent supporting surfaces:** shared paper, type, spacing, buttons, Hindi copy and back behaviour.

These are behaviours and lightweight surfaces, not additional mandatory tabs. An archive of past puzzles, saved stories, friend challenges and accounts can wait until the daily experience demonstrates a need for them.

## Suggested scope of the next revision

First simplify navigation and remove public-ranking/XP/achievement messaging throughout the interface. Then restyle the reader and its contextual entry points, fixing answer spoilers and edition scope. Add personal history only after checking what each game saves. Preserve the homepage artwork, five game identities and existing gameplay.

Review success by checking whether a new reader can pick a game quickly, return from a story without losing progress, understand their result and find preferences. Any claims about increased engagement or retention require actual user testing.

## Evidence locations

- `MEMORY.md`: moods, short sessions, mastery and no grinding.
- `Doc/Opening and news journey revision.md`: existing news navigation and merged settings decisions; this review recommends revisiting their presentation.
- `src/screens/hub.js` and `src/styles/hub.css`: current homepage.
- `src/screens/leaderboard.js` and `src/systems/leaderboard.js`: placeholder controls and generated rankings.
- `src/screens/profile.js`, `src/systems/engagement.js` and `src/systems/progression.js`: profile, achievements and seeded progression.
- `src/ui/components.js`: bottom navigation and shared result rank.
- `news.html`: separate visual tokens, mixed-edition feed and answer disclosure.
- `wordal.html`: current edition answer and article association.
