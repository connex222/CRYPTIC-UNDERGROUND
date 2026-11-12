# CLAUDE.md - Cryptic Underground

Instructions for AI assistants working in this repository.

## What this is

Cryptic Underground is a daily mini cryptic crossword, aimed at Unpick players and sized for a 20-30 minute commute. Daily grids are a random mix of about 66% 5 x 5 and 34% 7 x 7.

- Live: https://connex222.github.io/CRYPTIC-UNDERGROUND/ (GitHub Pages, updates automatically from `main`)
- Sister app: Unpick (repo `Unpick-web`)

## Architecture

- **One self-contained file: `index.html`** (currently V22). All CSS, JavaScript, fonts, grids and clues live inside it.
- Clues are in the `CLUES` object (answer -> list of clues) with matching difficulty ratings in `CLUE_DIFFICULTY`. Every clue must have a difficulty entry in the same position.
- Settings and progress are saved in `localStorage` (keys start with `cu-`). Never rename a key without migrating old data.
- The file name must stay lowercase `index.html`. A second `Index.html` was removed in November 2026 because it clashes on Windows; never add one back.

## Hard rules

- **Fully offline.** No network requests: no CDNs, no fonts or images from the internet, no analytics, no `fetch`. Fonts must be embedded as base64 `woff2`.
- **No external dependencies.**
- Readable in direct sunlight and in the dark (light and dark themes with strong contrast).
- Works one-handed on a phone in portrait, and safe to interrupt at any moment without losing progress.
- Free to use. Do not add adverts, tracking or sign-ups.

## Clue quality

- Every clue must be fair: the wordplay must produce the answer exactly and the definition must match it.
- Check anagram letters and hidden words letter by letter before adding a clue.
- UK spelling and UK general knowledge.

## Working with Shaun (the owner)

- Shaun is not a programmer. Explain every step in plain English, in order, and assume no prior knowledge.
- Always return complete files, never partial snippets or "..." placeholders.
- Use UK English.
- Never delete files to tidy up; move old notes into `docs/` instead.
- Never force-push, rewrite history or rename the repository.
- Before saying a change is finished, check the file opens with no errors in the browser console.

## Fairness release and QA safeguards (November 2026)

- Historical puzzles must remain stable. The original `cu-0282` stays on its first date (9 October 2026); its future 21 November 2027 recurrence uses the independently authored `cu-0282-r2` grid. Never change an already served daily without an explicit migration decision.
- Absolute-day saves use `cu:daily:<index>`. Keep compatibility with the older `cu:<puzzle-id>` local-storage keys on the first rotation. Practice must not change daily streaks.
- Before proposing changes, run `node tests/fairness.cjs`, `node tests/interaction.cjs`, `node tests/rotation.cjs` and `node tests/revised-daily.cjs`. Read `docs/CORRECTION-LEDGER.md` and `docs/GRID-EDITORIAL-REVIEW.md` for the editorial rationale.
- GitHub Actions runs the above checks and a real Chromium browser suite. The browser test dependency is CI-only and must never be added to the standalone offline HTML.
- No single automated script can certify every cryptic definition, pronunciation or alternative answer; retain a human-review register for uncertain clues rather than inventing a parse.
- The owner explicitly approved [PR #2](https://github.com/connex222/CRYPTIC-UNDERGROUND/pull/2), which was **squash-merged on 12 November 2026**; the GitHub Pages deployment for release commit `1752d8a5deb6fb082b6cc866433abe0d3badfff9` succeeded. Physical VoiceOver/TalkBack/NVDA acceptance and continued specialist editorial review remain follow-ups, not completed tests.
