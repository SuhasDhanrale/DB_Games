# Bhaskar Game Lab — news connections and pitch revision

**Review supplement to the v2 implementation brief · 10 October 2026**

## The proposition

**खबर से खेल तक, खेल से समझ तक।**

Bhaskar can turn a few minutes of play into curiosity about the world, understanding of a story, and a reason to return. The opportunity is an interactive layer within the news habit: a word discovered, a connection understood, a cricket moment replayed, or a thought worth sharing.

This is a product hypothesis to demonstrate and test, not a claim of proven retention. Five games remain provisional. Build each as a standalone HTML file and connect them through the mock news page. The protest story discussed in chat is excluded.

## What the previous plan missed

| Gap in v2 | Revised direction |
|---|---|
| One broad educational theme per day made the feed feel like a worksheet | Each edition mixes current service news, technology, culture and sport. Some archive and evergreen content is explicitly labelled. |
| Wordle had an article link but not a compelling reason to tap | Reveal meaning, explain why this word connects with the story, then offer a specific article preview. |
| Fictional cricket practice weakened the editorial pitch | Add researched match situations and compare the simulated result with the actual outcome. |
| Niti sharing lacked a complete discovery journey | Show the share card and the recipient landing experience, with a visible invitation to play. |
| Jodo depended on one feature article | Each pair can point to its own story and explanation; a mixed-news round is possible. |
| All games risked feeling like a separate games section | Place contextual invitations in the home feed and relevant article endings. |
| Local relevance was underdeveloped | Show a clearly labelled sample city card now; demonstrate verified city-specific editions as future potential. |
| Daily engagement was mostly described as a streak | Fresh editorial content, skill improvement and personal history provide separate reasons to return. Hindi streak terminology remains undecided. |

## Wordal: the flagship demonstration

Keep **five authored Hindi units, six attempts and 24 reusable keyboard keys**. A unit may include a matra or conjunct; do not split JavaScript characters to make a word fit. Example: **बहुभाषिक → ब / हु / भा / षि / क**.

The recommended journey:

1. A neutral feed invitation says **आज का शब्द खेलें**. Do not expose the answer in its headline.
2. The player solves or exhausts the attempts. Reveal the answer in either case.
3. Show **बहुभाषिक — कई भाषाओं से संबंधित।**
4. A card headed **इस शब्द से जुड़ी खबर** explains: **अपनी भाषा में डिजिटल सेवाएँ समझना आसान हो सकता है। जानिए भाषा तकनीक इसमें कैसे मदद करती है।**
5. Button **भाषा तकनीक की खबर पढ़ें** opens the sample article. Returning restores the result.

Use **आज यह शब्द खबरों में क्यों है?** only when the supporting story is genuinely current. For an August article shown in October, use the timeless heading above and display the source date. No automatic redirect, mandatory article reading or fabricated Bhaskar URL.

Standalone game: open an embedded article panel. Connected demo: also offer **समाचार फ़ीड पर जाएँ**, preserving edition and article ID in the link. The article can invite a reader into the game, but a reader who already saw the answer must not be presented as solving an unspoiled competitive challenge.

## A researched, non-political story mix

These are original demo headlines and short sample copy based on the linked sources, not articles published by Bhaskar. The prototype must say **डेमो समाचार फ़ीड** and expose source/date details.

### A. Current service story: postal week

**Sample headline:** डाक सप्ताह: रोज़मर्रा की सेवाओं से जुड़ने का मौका

**Sample copy:** राष्ट्रीय डाक सप्ताह 9 से 15 अक्टूबर 2026 तक मनाया जा रहा है। इसकी शुरुआत विश्व डाक दिवस से हुई। कार्यक्रम का समापन 15 अक्टूबर को टेक्नोलॉजी और इनोवेशन डे के साथ होना निर्धारित है। यह अवसर डाक सेवाओं की बदलती भूमिका को समझने का है।

**Use:** timely home-feed story and Jodo pair. Avoid claiming that a specific local branch is holding an event without a branch-level notice. Source published 6 October: [PIB postal-week announcement](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2319660&lang=2&reg=48).

### B. Technology explainer: language access

**Sample headline:** अपनी भाषा में डिजिटल सेवाएँ: भाषा तकनीक क्या बदल सकती है?

**Sample copy:** BHASHINI और नीति आयोग ने बहुभाषी तथा आवाज़ आधारित डिजिटल सेवाओं को आगे बढ़ाने के लिए सहयोग की घोषणा की थी। लक्ष्य लोगों तक उनकी पसंद की भारतीय भाषाओं में जानकारी और सेवाएँ पहुँचाना है। अनुवाद और आवाज़ आधारित सुविधाएँ इस दिशा में उपयोगी उपकरण हो सकती हैं।

**Use:** Wordal’s बहुभाषिक answer, a Jodo technology pair, and a practical explainer. Label **तकनीक समझें · स्रोत: 12 अगस्त 2026**, not breaking news. This is about language access; the NITI Aayog organisation is unrelated to the game Aaj Ki Niti. [PIB announcement](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298661&lang=1&reg=3).

### C. Culture candidate: performances reaching schools

**Proposed headline:** स्कूलों तक पहुँचा शास्त्रीय कला का अनुभव

An Arunachal Pradesh government search result describes SPIC MACAY outreach in remote and border areas, including a 5–9 October phase. This is a useful current culture candidate, but the full page could not be opened during this review. **Keep this slot in editorial review; do not ship detailed dates, performers or a scored answer from the snippet alone.** Use the previously verified heritage material as the fallback, labelled evergreen. [Government story to verify](https://arunachalipr.gov.in/post/spic-macay-takes-indian-heritage-to-remote-and-border-areas-of-arunachal-pradesh).

### D. Cricket archive: a real pressure situation

**Sample headline:** आखिरी छह गेंदें: दबाव में बदलता मैच

**Sample copy:** 2024 के पुरुष टी20 विश्व कप में भारत के खिलाफ पाकिस्तान को आखिरी ओवर में 18 रन चाहिए थे। भारत ने मुकाबला छह रन से जीता। इस चुनौती में उसी शुरुआती समीकरण से खेलकर देखें—आपका परिणाम एक सरल खेल-सिमुलेशन होगा।

**Use:** entry into Super Over’s **आखिरी ओवर चुनौती**. Display **यादगार मुकाबला · 9 जून 2024**. This was a final over, not a tie-breaking Super Over; preserve the working game title but distinguish the mode. [ICC match roundup](https://www.icc-cricket.com/news/final-over-thrillers-in-the-2024-men-s-t20-world-cup).

## Three selectable editions, with a mix in each

The selectors represent three curated demo editions, not invented reports from three future dates. Freeze their content for judging and show the research date separately.

| Component | Edition 1 | Edition 2 | Edition 3 |
|---|---|---|---|
| Feed lead | Postal-week service news | Language-technology explainer | Verified heritage fallback; culture candidate only after review |
| Other feed cards | Language, cricket archive, culture | Postal services, cricket archive, culture | Technology, postal services, cricket archive |
| Wordal | बहुभाषिक: language explainer | प्रतियोगिता: sports story | ऐतिहासिक: heritage feature |
| Niti theme | Understanding another person | Regular practice | Learning from the past |
| Super Over | Chase 18 from 6, India–Pakistan archive | Chase 11 from 6, South Africa–Bangladesh archive | Chase 8 from 6, South Africa–Nepal archive |
| Jodo | Mixed-news connections | Existing verified athlete pairs | Existing verified heritage pairs |
| Carrom | Existing puzzle 1 | Existing puzzle 2 | Existing puzzle 3 |

ICC’s roundup supports the three cricket equations and the actual outcomes: Pakistan lost by six runs, Bangladesh by four, and Nepal by one. Use the actual outcome as a result card, not a claim that the simplified simulation reproduces professional decision-making. Do not invent ball-by-ball details. All three are **archive challenges**, not current fixtures. Future current-match editions require a verified scorecard before publication. [ICC source](https://www.icc-cricket.com/news/final-over-thrillers-in-the-2024-men-s-t20-world-cup).

For these simplified six-ball challenges: target reached ends the attempt successfully; exactly one fewer than the target after six balls is a tie; fewer runs is a loss. Keep a practice wicket allowance explicitly separate from historical wickets. Show **आपका खेल** and **असली मैच** in different result blocks.

## Jodo: one mechanic, editorial variety

Tap one item on the left and one on the right. Correct pairs lock; incorrect pairs remain available, with no elimination. A reveal explains the relationship. Each finished pair has an optional story link, and the round ends after all four matches.

Edition 1’s complete proposed round:

| Left | Matching right | Explanation and article destination |
|---|---|---|
| राष्ट्रीय डाक सप्ताह 2026 | 9–15 अक्टूबर | The announced week connects postal services with a timely public-service story; postal article. |
| BHASHINI | बहुभाषी डिजिटल सेवाएँ | Language technology supports access across languages; technology article. |
| भारत–पाकिस्तान, 2024 विश्व कप | आखिरी ओवर में 18 रन की ज़रूरत | The equation was Pakistan’s chase requirement; cricket archive article. |
| दक्षिण अफ्रीका–नेपाल, 2024 विश्व कप | आखिरी ओवर में 8 रन की ज़रूरत | The equation was Nepal’s chase requirement; separate section in the cricket archive article. |

The two cricket rows deliberately specify who needed the runs in their reveals. Shuffle both columns without changing pair IDs. No question should rely on an unverified live update. This first round demonstrates cross-story linking; later editorial rounds should broaden the mix beyond two cricket pairs.

## The other games’ distinct jobs

**Aaj Ki Niti — reflection and sharing.** Complete a thought, see its meaning, then create a clean share card. Retain the original demo thoughts from v2 with an explicit original-writing label. Do not invent a famous author. Show a preview of what a recipient opens: the thought’s date/edition, Bhaskar Game Lab identity and **आप भी आज की नीति खेलें**. A working hosted return link is future integration; local files cannot demonstrate external WhatsApp acquisition reliably. An optional related story should enrich the thought, not force every thought onto a headline.

**Super Over — news supplies playable situations.** Start with the verified archive equations above. Timing and shot feedback remain the game’s core; relevant news gives the scenario meaning. Keep the existing mechanics and visual direction as references, updating targets and result copy together.

**Carrom — a familiar skill break.** Keep it evergreen. Daily layouts and personal improvement provide its return reason. A news connection is unnecessary; a comfortable play break belongs in the portfolio too.

## Shared presentation and implementation changes

Retain the existing visual system: Bhaskar red #E23A28, warm background #F9F9F7, dark text #1C1C1C, common header, cards, buttons and result-panel structure. Each game may have its own play surface. Do not make the cricket field look like a word grid merely to achieve consistency.

Use the existing v2 standalone rules and packaging. This supplement supersedes its editorial positioning and proposed article routing; **the v2 JSON and PDFs have not been rewritten by this supplement**. Apply these changes together during implementation:

1. Update each edition’s word, five-unit answer and 24-key layout. बहुभाषिक requires keys absent from the old shared layout. Validate 24 unique keys and every required answer unit before shipping; do not change only the answer string.
2. Add per-article `id`, `headline`, `body`, `sourceUrl`, `sourcePublishedAt`, `verifiedAt` and `freshness` (`current`, `explainer`, `archive`, `evergreen`). Keep `review` candidates out of playable content.
3. Add `relatedArticleId` and `connectionCopy` to Wordal; `articleId`, `sourceUrl` and `explanation` to each Jodo pair.
4. Add `matchLabel`, `matchDate`, `modeLabel`, `target`, `actualOutcome` and `sourceUrl` to cricket content. Replace fictional story text wherever a real scenario is selected.
5. Give the feed an article reader and contextual game links. Games retain embedded article copies for independent opening. Both copies must come from the same authored content during packaging.
6. Check article-return state, missing-story fallback, all three edition selectors, keyboard coverage, pair IDs, cricket targets and visible source labels. Keep the existing Carrom validation.

Hindi interface copy should be natural and easy to read. Do not claim a culturally distinctive streak system has been solved: retain simple **आज खेला** and **कल नया खेल मिलेगा** wording for review. No guilt message or requirement to finish all five games.

## The judge walkthrough and commercial case

**A 90-second demonstration:** start on the mixed news feed; enter Wordal; use a clearly labelled demo-reveal control to show meaning and its story card; open the article and return; show one Jodo pair with a sourced explanation; show a cricket result beside the actual outcome; finish on the Niti share preview and switch editions to prove fresh content fits the same games.

The pitch is that Bhaskar already has editorial knowledge, language context and local relevance. Reusable games can make that content participatory. Demonstrate the user benefit first; present city editions, editor-managed daily packs, verified current-match challenges and share-to-play links as expansion opportunities, not implemented features.

Measure game starts and completions, result-to-article taps, article engagement after play, return on another day, and share-link arrivals when hosting exists. Compare with the ordinary article journey rather than claiming that more screen time automatically means better engagement. There is no retention or revenue forecast in this prototype.

**Review decision:** lead with Wordal → related news as the clearest proof, support it with Jodo and real cricket context, and let Niti and Carrom show the portfolio’s range. A small, coherent journey is more persuasive than five disconnected finished games.
