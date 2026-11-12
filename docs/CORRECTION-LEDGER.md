# CRYPTIC UNDERGROUND — editorial correction ledger

**Branch:** `improvement/cryptic-underground-fairness`  
**Date:** 12 November 2026  
**Scope:** Corrected confirmed wordplay errors and under-specified direct definitions while preserving all original solution strings, crossing letters and clue variant counts.

## Corrected original clue variants (16)

| Answer | Revised clue | Mechanism / editorial proof | Difficulty |
|---|---|---|---|
| NOUN | Part of speech: number followed by United Nations | NO (abbreviation of number) + UN (United Nations) = NOUN | Medium |
| RACER | Runner: race followed by right | RACE + R (right) = RACER | Easy |
| WEE | Small: west and two eastern points | W (west) + E + E (east) = WEE | Medium |
| ENVY | Jealousy: 'in' in French, victory and year | EN (French “in”) + V (victory) + Y (year) = ENVY | Hard |
| CLUE | Hint: club trades bachelor for east | CLUB, replace B (bachelor) with E (east) = CLUE | Medium |
| GURU | Sage: good university, rugby union | G + U + RU = GURU | Medium |
| ARTICLE | Newspaper piece — or word such as 'the' | Double definition: newspaper article and grammatical article | Medium |
| DIGITAL | Relating to fingers — or to binary data | Double definition: anatomical digital and computing digital | Medium |
| EBB | Recede, concealed in webbed toes | Hidden answer: W[EBB]ED | Easy |
| OASIS | Desert refuge concealed by cargo as is | Hidden answer: CARG[OASIS] | Medium |
| TEETH | They bite: golf peg followed by Thursday | TEE + TH = TEETH | Medium |
| TOMATO | Fruit from 'to', a floor covering and nothing | TO + MAT + O = TOMATO | Medium |
| IMAGINE | Picture myself with wise men in the north-east | I + MAGI + NE = IMAGINE | Medium |
| BERSERK | Mad: BREAKERS minus A, wildly | (BREAKERS − A)* = BERSERK; “wildly” indicates the anagram | Hard |
| APPAREL | Clothing made by mixing A PEARL with P | (A PEARL + P)* = APPAREL. Original “PA'S PEARL” incorrectly supplied eight letters | Medium |
| AROUSED | Excited: an article followed by 'woken up' | A (article) + ROUSED (woken up) = AROUSED. Original “a stirred” lacked sufficient fodder | Medium |

The three original false-palindrome variants for NOUN, RACER and WEE have been replaced; all updated examples have letter-by-letter regression checks in `tests/revised-daily.cjs`. No variant or answer key has been deleted.

## Replacement for the exceptionally sparse daily grid

The original `cu-0282` remains unmodified on **9 October 2026**, so historical progress and the published 2026 schedule stay intact. A fresh `cu-0282-r2` (same Circle identity) is selected for the slot's next appearance on **21 November 2027**, and future recurrences.

- Old grid: 7×7, 4 clues, 19 playable squares, 16 unchecked (84.2%).
- New grid: 7×7, 14 clues, 39 playable squares, 8 unchecked (20.5%).
- The new grid uses 14 authored clue explanations/ratings and passes every crossing, enumeration and entry-boundary check.
- No old progress or streak key is overwritten: daily states are indexed by absolute date.
- The replacement retains the 7×7 difficulty category and has a measured mixture of easy, medium and hard clues.

### New grid's 14 clue constructions

| Answer | Wordplay |
|---|---|
| ABOARD | A + BOARD (plank) |
| PIED | PIE + D (daughter) |
| POLE | Homophone of POLL (survey); UK pronunciation to confirm by human editor |
| ERRATIC | (RICE TAR)* |
| ROAR | R (right) + OAR |
| TOTE | TO + TE (TEA without its final letter) |
| FELINE | FE (iron chemical symbol) + LINE |
| ADVERT | A + D (daughter) + VERT (French “green”) |
| ROOF | Hidden in P[ROOF] |
| RATE | (TEAR)* |
| APPAREL | (A PEARL + P)* |
| RIOT | (TRIO)* |
| DELI | Hidden in MO[DELI]NDUSTRY |
| DECADE | DEC (December) + ADE (last three of LEMONADE) |

All 14 original-solution words already existed in the clue bank. The new puzzle specifies its own fair, deterministic clue variants, without altering other days that happen to use the same answers.

## Still subject to editorial judgement

- The remaining **59** flagged 7×7 grids have exactly 40% unchecked squares. This does **not** prove they are invalid. Preserve them until a human setter evaluates their house style and difficulty.
- Exact alternative synonyms cannot automatically be accepted when the crossing grid fixes a canonical string. They need a curated alternate-answer policy, not heuristic acceptance.
- The 2,523 clue variants have been structurally audited and the demonstrably faulty variants above corrected; this is **not** a claim that every remaining surface, homophone and obscure abbreviation received an independent human editorial sign-off.
- Future answers remain inspectable in the fully offline HTML. This limitation cannot be fixed without changing the existing no-network delivery requirement.

## Automated evidence

Run:
```sh
node tests/fairness.cjs
node tests/interaction.cjs
node tests/rotation.cjs
node tests/revised-daily.cjs
node tests/editorial-review.cjs
```

The GitHub Actions workflow also runs Chromium-based browser QA using `tests/browser.cjs`. All checks are read-only or operate on a test copy; there are no merge, release or deployment actions.

**Release status:** draft PR only. Physical screen-reader acceptance and final editorial sign-off remain outstanding.
