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
