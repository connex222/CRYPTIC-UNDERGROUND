# CRYPTIC UNDERGROUND — fairness development QA record

**Date:** 12 November 2026  
**Repository:** connex222/CRYPTIC-UNDERGROUND  
**Branch:** `improvement/cryptic-underground-fairness`  
**Release decision:** **DO NOT MERGE / DO NOT DEPLOY** until editorial and physical accessibility acceptance.

## What changed

- Restored conventional row-major crossword numbering, with matching numbers for across/down clues starting at the same square. Source-order numbering was wrong in all 408 daily grids.
- Removed `user-scalable=no`, added labelled/focusable grid squares, directional arrow keys, a visible across/down toggle, and retained normal Tab navigation.
- Corrected tapping: selecting another cell in the current entry no longer silently changes direction; tapping the selected crossing cell can switch.
- Added tentative pencil entries in shared crossing cells. Pencil state survives refresh. A correct-but-pencilled solution must be inked before completion.
- Added three-stage assistance: (1) definition/enumeration strategy, (2) construction guidance, (3) explicit one-letter reveal. No letter is exposed in the first two stages. Guidance is counted honestly in results.
- Made `Check` count a crossing square once rather than twice; protected word reveals with a confirmation; disabled difficulty-filter choices that do not occur in a particular grid.
- Added an accessible clue live region, modal reference focus return and focus trap, and a spoiler-free completion sharing control.
- Changed daily progress to `cu:daily:<absolute day index>` (plus `cu:done:daily:<index>`) to avoid overwritten saves after the 408-day puzzle cycle. First-cycle legacy progress is read if needed; existing streak keys are retained. Practice completion no longer alters daily streak.
- Reloads a stale daily on returning to an app that was open across a local date boundary.
- Preserved all 2,523 clue variants, all answer keys, all 458 puzzle grids, existing service names, responsive art and the single-file/offline architecture.

## Automated checks executed successfully

The committed tests require Node.js only and no external packages:

```bash
node tests/fairness.cjs
node tests/interaction.cjs
```

| Test | Result | Evidence |
|---|---|---|
| Bank alignment | PASS | 1,532 answers, 2,523 variants, all difficulty array positions present |
| Structural puzzle checks | PASS | 408 daily and 50 practice; 4,926 entry placements |
| Crossings and coverage | PASS | 9,083 crossing overlaps and 11,659 playable squares without conflict |
| JavaScript compilation | PASS | All three inline scripts parsed |
| Sample clue mechanisms | PASS | 10 hand-checked examples across easy, medium and hard; machine-verifiable letter operations |
| Invalid palindrome scan | **3 editorial exceptions** | NOUN, RACER and WEE variants are preserved but need editor approval |
| Simulated complete daily | PASS | Full solution, scored completion, saved absolute-day result and spoiler-free sharing |
| Simulated complete practice | PASS | Full solution, no mutation of daily streak |
| Interaction recovery | PASS | 22 assertions including hints, pencil, crossing error count, reveal cancellation, refresh and rollover |
| Numbering | PASS | Daily and practice clue numbers are in reading order |
| Accessibility structure | PARTIAL | Zoom enabled, labelled focusable cells, normal Tab, aria-live, dialog attributes; no real assistive-technology test yet |
| Mobile layout | NOT VERIFIED | Responsive CSS inspected; no real-device/browser rendering tested |

**Execution method:** Both test functions were executed against the current GitHub branch HTML in a JavaScript runtime. The interaction suite uses a simulated DOM and runs all three inline game scripts; this is not a real Chrome/Safari/Firefox or screen-reader test. The Node CLI entrypoints are committed, but those exact commands have not separately been executed in GitHub Actions.

## Required manual acceptance (not claimed complete)

- On Windows Chrome/Edge with NVDA: Tab through controls, select squares, change across/down and confirm the clue and coordinates are intelligible; focus must remain in the reference dialogue and return to its opener.
- On iPhone Safari with VoiceOver and Android Chrome with TalkBack: check touch target sizes, zoom, announcement order, on-screen keyboard, hint visibility and completion dialog.
- Repeat at 320px, 375px, 768px and desktop widths, and 200% zoom; check 5×5 and 7×7 grids and landscape. Ensure the sticky keyboard does not cover selected squares or controls.
- Solve a puzzle solely through reachable UI controls; complete a full grid with crossings, pencil entries, a correction and no forced hints. Repeat with all stages of help.
- Refresh halfway through a grid; return to the browser after local midnight; verify the new daily displays without corrupting previous progress. Exercise DST and locale date boundaries on a device.
- Approve or revise the three confirmed false-palindrome clues and adjudicate the 11 difficulty/definition candidates in `docs/EDITORIAL-EXCEPTIONS.md` before release. No clue text has been silently changed.
- Review alternate defensible answers, UK homophones, punctuation, fairness of abbreviation choices and any clue-specific ambiguity: the app uses exact canonical grid answers and has no independently approved alternative-answer bank.

## Architectural decision still required

All future grids and answers remain bundled in the offline `index.html`. This guarantees no-network play and deterministic rotation but cannot guarantee future-answer secrecy against inspection. True secrecy would need a staged delivery model, contrary to the existing offline requirement. No such architectural change is part of this branch.

**No merges, live GitHub Pages changes, Render deployments or release tags have been performed as part of this review.**
