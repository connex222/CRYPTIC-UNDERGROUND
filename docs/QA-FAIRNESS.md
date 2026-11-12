# CRYPTIC UNDERGROUND — Fairness and Accessibility QA

**Review date:** 12 November 2026  
**Repository:** `connex222/CRYPTIC-UNDERGROUND`  
**Release branch:** `main` (squash-merged from `improvement/cryptic-underground-fairness`)  
**Pull request:** [Merged PR #2](https://github.com/connex222/CRYPTIC-UNDERGROUND/pull/2)  
**Release commit:** `1752d8a5deb6fb082b6cc866433abe0d3badfff9`  
**Final pre-merge tests:** [Successful run 43246582924](https://github.com/connex222/CRYPTIC-UNDERGROUND/actions/runs/43246582924)  
**Production deployment:** [GitHub Pages build 43247364895 — successful](https://github.com/connex222/CRYPTIC-UNDERGROUND/actions/runs/43247364895)  
**Release status:** **Merged and deployed via GitHub Pages on 12 November 2026; device and editorial follow-ups remain open.**

## Confirmed changes

### Editorial and grid quality

- **16 flawed, ambiguous or excessively definition-led clue variants** have been corrected; all original answer keys remain unchanged, preserving every existing crossing and clue count.
- The three demonstrably false “either way” palindrome constructions have been replaced. The automated scan now returns **zero invalid palindrome claims**.
- The invalid APPAREL anagram (original fodder contained eight letters for a seven-letter solution) and missing AROUSED wordplay have been repaired.
- A fresh, authored 14-entry 7×7 grid `cu-0282-r2` replaces the old four-entry, 84.2%-unchecked grid **only when the slot next occurs on 21 November 2027**; the original puzzle on 9 October 2026 is unmodified.
- The future grid has 39 playable cells with only 8 unchecked (20.5%) and independently authored clue variants. Its entries, crossings, wordplay derivations and difficulty labels are tested.
- Conventional row-by-row crossword numbering replaces source-list numbering in the original daily and practice grids.
- The other 59 grids with 40% unchecked letters remain review candidates, *not* confirmed defects. Do not rewrite valid house-style grids automatically.

### Solving, accessibility and progress

- Keyboard arrows select across/down predictably. The on-screen direction toggle, labelled active cell and non-trapping Tab navigation provide alternative control paths.
- Pencil marks are visible, saved and required to be inked before the grid counts as solved.
- Three progressive hint stages show a definition tactic, then construction help, then (only on explicit request) one answer letter. Soft guidance is counted in results.
- Checking a crossing square counts its error once, not once per intersecting word.
- Full word reveal now requires confirmation. Completed grids refuse further delete, clear, typing, hints and reveals; the recorded result stays immutable.
- Focus handling in reference and completion dialogs, screen-reader live regions, accessibility labels and unrestricted browser zoom have been improved.
- Daily progress uses absolute-date keys, preventing overwritten attempts when the 408-day rotation repeats. Old first-cycle saves are read compatibly, and practice never changes daily streaks.
- The open-across-midnight case reloads the correct daily on returning to the tab. Spoiler-free sharing is available after completion.

## Automated evidence

| Test | Latest verified result | What was proved |
|---|---|---|
| `tests/fairness.cjs` | PASS | 408 historical daily grids, 50 practice grids, 1,532 answer keys, 2,523 clue variants, 4,926 word placements, 9,083 matching crossings and 11,659 filled squares |
| `tests/interaction.cjs` | **PASS — 31 assertions** | Complete simulated daily/practice/future-revision puzzles, pencil, staged hints, refresh, reveal cancellation, completion immutability and past-state preservation |
| `tests/rotation.cjs` | **PASS — 1,242 assertions** | Deterministic schedule, UK spring/autumn DST transitions, unique date save keys, historic preservation and corrected future-cycle selection |
| `tests/revised-daily.cjs` | PASS | Letter proofs for 16 corrected bank variants and 14 replacement-grid clues; 0 false-palindrome claims; 20.5% checked-grid target met |
| `tests/editorial-review.cjs` | PASS (report generation) | Machine-readable list of residual unchecked-grid candidates; does not silently rewrite clues |
| `tests/browser.cjs` | **PASS — 54 Chromium assertions** | Real browser launch, no external runtime requests, four viewport layouts, clue control focus, staged hints, pencil, reload, reference and results focus, sharing, immutable completion, historical and future full solves |
| Browser screenshots | Uploaded as Actions artifact | Evidence images for small-screen completion and desktop presentation |
| CI | **Both jobs passed** | GitHub-hosted Node 22 logic QA and real headless Chromium QA; that QA workflow does not itself publish or deploy (GitHub Pages separately deployed the approved `main` merge) |

The CI is implemented at `.github/workflows/cryptic-fairness.yml`. Run the dependency-free suites with:

```bash
node tests/fairness.cjs
node tests/interaction.cjs
node tests/rotation.cjs
node tests/revised-daily.cjs
node tests/editorial-review.cjs
```

The Chromium browser suite is deliberately a **test-only development dependency**, not a runtime requirement. Production remains one offline `index.html` without a network dependency or analytics.

## Unresolved acceptance work

**A full human editorial sign-off has not happened.** Automated letter algebra cannot certify every one of 2,523 cryptic clue surfaces. In particular, uncommon abbreviations, UK homophones, alternate defensible answers and unusual clue conventions still need sampled expert review. The precise correction record is in [CORRECTION-LEDGER.md](CORRECTION-LEDGER.md); the original exception audit remains archived in [EDITORIAL-EXCEPTIONS.md](EDITORIAL-EXCEPTIONS.md).

**Real assistive-technology acceptance is still outstanding.** Headless Chromium and simulated mobile viewports are meaningful automated evidence, but not substitutes for a blind tester using NVDA on Windows, VoiceOver on iPhone or TalkBack on Android. Test physical touch targets, focus announcements, 200% zoom, landscape, reduced motion and screen-reader complete solves.

**Future-answer secrecy cannot be guaranteed while fully offline.** Every future puzzle solution ships inside the standalone HTML. Deterministic daily selection and date-scoped saving are enforced, but client-side encryption/obfuscation without a secret delivered later does not prevent inspection. A truly secret daily release requires a separately approved content-delivery design.

## Release and outstanding acceptance

**The owner explicitly authorised merge and deployment on 12 November 2026.** PR #2 was squash-merged into `main`; its GitHub Pages deployment reported success. The two automated QA jobs passed at the final branch head. The app source remains offline-capable.

The release does **not** certify every clue as professionally proofread or assert that physical NVDA, VoiceOver and TalkBack testing has been performed. These remain documented follow-ups, not hidden or waived findings.

For a subsequent release, preserve existing progress; run the Node and Chromium checks and record any new editorial exceptions before merging.
