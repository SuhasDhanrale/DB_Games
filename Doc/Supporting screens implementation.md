# Supporting screens implementation

Implemented 12 October 2026 following the approved navigation and supporting-screens review.

## Experience

- The five illustrated home cards retain their established appearance. The four-tab bottom bar is removed. The torch and week tracker open **मेरे खेल**; the header settings button opens a compact preferences sheet.
- Public ranking no longer appears in navigation or results. Old ranking links show the home. Old profile links open personal progress.
- Progress contains actual first daily results, separate practice results, recent played days and suitable skill measures. Wordal shows attempts/solve history; Niti shows completion and access to its card; Jodo shows mismatches/assistance; cricket separates batting and bowling measures; Carrom records shots. There is no XP, level or achievement catalogue in these views.
- **खेल और कहानियाँ** remains a small demo entry. The reader shares the home palette and typography, uses a simple back action, and filters edition-specific stories to the selected edition. Sample/editorial context and source information remain visible.
- Reading a feature that exposes Wordal's answer marks that edition as practice. The invitation and Wordal both say so, and the result does not become an unspoiled first daily result.
- Wordal's related-story action uses the common reader in the integrated app. Closing it preserves the mounted game/result. Standalone Wordal retains its embedded reader.

## Saved state

Preferences, results and rounds use scoped browser storage with an in-memory fallback. The progress sheet explains when persistent storage is blocked. Refresh preserves the selected demo edition; switching among three authored editions does not create imaginary playing days. The initial streak is zero.

Wordal saves partial input and guesses; Niti saves the selected option and card/result view; Jodo saves matches and its first result; cricket saves settled ball checkpoints and completed results; Carrom saves the current puzzle, striker position, shots and completion. Refresh during motion resumes at a checkpoint rather than reconstructing an unfinished physics simulation.

Reset is tucked inside settings and requires an explicit confirmation in the product. It clears only this prototype's rounds, results and torch history; language, audio preferences and unrelated browser storage remain intact.

## Verification

- `npm run build` passed. Vite continues to report classic-script packaging notices for public helper/vendor scripts; those files are copied into the built output.
- `node qa-ux-state.mjs` passed: persistence, stable edition on refresh, zero initial streak, canonical game aliases, immutable first results, practice separation, retained practice bests, edition completion recovery, scoped reset, blocked-storage fallback and inline-script syntax.
- Browser checks passed for the home, personal-progress and settings sheets, Hindi/English settings, unfinished Niti selection recovery, a real Niti completion, Wordal's article-first practice result, common-reader return, Wordal result recovery, cricket checkpoint recovery and cricket completed-result refresh without a duplicate daily award.
- The home was visually checked at 360px width. No browser error logs appeared during the checked flows.

Saved previews:

- `Doc/review-images/home-simplified-360.jpg`
- `Doc/review-images/progress-simplified-360.jpg`
- `Doc/review-images/stories-simplified-360.jpg`

This remains a three-edition demo with device-local progress. No accounts, hosted publication, new editorial reporting or retention claims are part of this change. Existing concurrent game return/team/result-presentation work was preserved.
