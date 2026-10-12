# Game family design

Applied on 12 October 2026 to the five games in the home collection.

The home cards and game screens now use one palette defined in `src/styles/game-family-tokens.css`: warm paper, dark ink, matte surfaces, and lavender (Shabd), ochre (Niti), sage (Super Over), terracotta (Carrom), and blue (Jodo). The home card colours are preserved.

`src/styles/game-family.css` supplies the common navigation header, typography, instruction cards, buttons, help panels, results, and compact phone adjustments. Every embedded HTML game loads this stylesheet after its local styles. First-play walkthroughs use the same game palette.

The game boards and content retain their individual presentation. Correct and incorrect answers, matched pairs, letter evaluations, cricket outcomes, and timing feedback retain meaningful gameplay colours. Niti's generated share-card artwork is preserved.

The outer header contains Back, the collection and game names, and How to play. Game-specific counters remain next to the board. Jodo and Carrom keep their own result screens while still submitting results to the platform, avoiding a second platform popup over their results.

Validation: production build passed; all five games reviewed at 390 × 844 and 360 × 640. Checked each help entry, navigation, Shabd submission and result, Niti answer/meaning and card studio, Super Over role selection/start and rules, Carrom retry, and Jodo's four matches and result. Fixed the cricket modal's production CSS visibility conflict and compacted Jodo's small-screen spacing.

Visual comparison: `Doc/review-images/game-family-comparison.png`.
