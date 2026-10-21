# Shared game result celebration

The five daily games use `src/ui/result-celebration.js` and `src/styles/result-celebration.css` inside their existing results. Each game's muted colour and a small illustrated ink stamp keep the celebration consistent with the paper surfaces in the collection.

The component owns one factual outcome, combining completion with attempts, shots, or points where relevant. Its optional second line carries useful details such as a wrong choice, hint count, practice mode or replay comparison. Generic praise and instructional paragraphs were removed on 14 October 2026. Motion lasts 1.5 seconds; **छोड़ें / Skip** ends it without dismissing the result. Existing result actions work throughout. Reduced motion and restored results show the finished card directly. Success plays a brief sound through the game's audio bridge when available, respecting the saved sound preference.

HTML game modules import the component before resolving `gameIntroReady`. Their result handlers call:

```js
window.DBResultCelebration.show(slot, {
  game: 'cricket',
  details: { won: isWin },
  lang: currentLang,
  animate: !restoringResult,
});
```

Use `window.DBResultCelebration.clear(slot)` when resetting a round or replacing results with rules. Module consumers can import `showResultCelebration`, `clearResultCelebration`, and `resultCopy` directly.

| Game | Details used for the result |
| --- | --- |
| Shabd | `solved`, `attempts`, `practice`: solve, exhausted attempts or early reveal, with the actual attempt count |
| Niti | `correct`, `selectedText`: correct answer or the reader's wrong choice; the full thought shows the correction |
| Cricket | `won`: one win/loss heading; the scorecard keeps factual detail and identifies opponent runs when bowling |
| Carrom | `shots`, `practice`, `firstCompletionShots`, `bestReplayShots`: current shots with a practice-only comparison |
| Jodo | `score`, `wrongMatches`, `assistedPairs`, `practice`: completion, points and transparent mistakes/hints |

The component does not award progress. The existing game completion and mashal system still owns daily play and streaks. Revealing Shabd early remains separate from completing the round.

Ordinary Mashal rewards appear inline through `src/ui/torch.js`; only newly earned level increases open its larger celebration. The result exposes `[data-mashal-progress]` slots. Niti supplies one in each step, with only the active step visible. The hub/profile retains the participation rule and consecutive-day streak context.

Validation: `qa-result-copy.mjs` checks the five result layouts, wrong answers, exhausted attempts, hints, replay comparisons, article access, share options, English, animation skipping and reduced motion. `npm run test:mashal` checks progression plus emitted single-file and production assets, including milestones, quick Niti navigation, aliases, daily guards, restoration, replay and older WebViews.
