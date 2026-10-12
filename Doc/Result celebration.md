# Shared game result celebration

The five daily games use `src/ui/result-celebration.js` and `src/styles/result-celebration.css` inside their existing results. Each game's muted colour and a small illustrated ink stamp keep the celebration consistent with the paper surfaces in the collection.

The component shows a short heading and one or two sentences immediately. Motion lasts 1.5 seconds; **छोड़ें / Skip** ends it without dismissing the result. Existing result actions work throughout. Reduced motion and restored results show the finished card directly. Success plays a brief sound through the game's audio bridge when available, respecting the saved sound preference.

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

| Game | Details used for praise |
| --- | --- |
| Shabd | `solved`, `attempts`: first-try recognition, successful persistence, or honest encouragement |
| Niti | `correct`: completion of the thought, or an invitation to read the correct answer and meaning |
| Cricket | `won`: one simple win or retry message; the existing scorecard keeps the factual detail |
| Carrom | `shots`: a one-shot achievement or recognition of continued practice |
| Jodo | `wrongMatches`, `assistedPairs`: “Perfect” only with zero mistakes and zero hints; assisted completion acknowledges the hint |

The component does not award progress. The existing game completion and mashal system still owns daily play and streaks. Revealing Shabd early remains separate from completing the round.

Validation: `qa-result-celebration.mjs` checks all five games at phone and desktop sizes, skipping, honest outcomes, restoration, replay, English, reduced motion, and the embedded hub/mashal flow. `qa-torch-state.mjs` covers daily progress and streak state. Set `CELEBRATION_QA_URL` and `TORCH_QA_URL` to the local preview when using a different port.
