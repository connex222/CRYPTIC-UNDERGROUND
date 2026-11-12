# Cryptic Underground — editorial exception register
Branch: `improvement/cryptic-underground-fairness`  
Review date: 12 November 2026  
Status: **human editorial decisions required; no clue corpus rewritten.**

## Corpus audit

- 408 daily puzzles and 50 separate practice puzzles
- 1,532 answer keys, 2,523 clue variants; difficulty counts: easy 1,081; medium 1,327; hard 115
- Automated structural checks found **0** missing clues, difficulty-list mismatches, blocked/out-of-bounds entries, uncovered grid cells, or crossing-letter conflicts across all 458 puzzles.
- Structural correctness is **not** proof that every variant's wordplay and definition are fair. UK pronunciations, surface grammar, abbreviations and cryptic definitions need trained human review.
- Answer strings contain letters A–Z only; answers are displayed with enumeration equal to string length, so any intended hyphenated or multiple-word phrase would need separate review.

## Confirmed P0 wordplay errors — preserve pending approval

| Answer | Exact clue | Rating | Problem | Decision |
|---|---|---|---|---|
| NOUN | Name, either way | hard | NOUN reversed is NUON, not NOUN. Claimed palindrome fails. | Review/remove or explicitly replace |
| RACER | Runner either way | hard | RACER reversed is RECAR, not RACER. Claimed palindrome fails. | Review/remove or explicitly replace |
| WEE | Small, either way | hard | WEE reversed is EEW, not WEE. Claimed palindrome fails. | Review/remove or explicitly replace |

The reproducible audit checks every clue containing “either way” or “both ways”; all other such claim/answer pairs currently pass the palindrome condition.

## Difficulty / definition-only candidates — human review

These are **flags**, not automatic corrections. Some cryptic definitions are acceptable, but rating must reflect actual construction, not a word's apparent obscurity.

| Answer | Exact clue | Rating | Review question |
|---|---|---|---|
| ENVY | The green-eyed monster | hard | Is this simply a stock definition rather than cryptic wordplay? |
| CLUE | It may be across or down | hard | Straight definition; where is the cryptic misdirection? |
| GURU | Sage in the ashram | hard | Straight definition; difficulty appears inflated |
| ARTICLE | Item such as 'the' | hard | Direct example/definition, little evidence for hard |
| DIGITAL | Not analogue | hard | Antonym alone; no visible construction |
| EBB | Decline of the tide | hard | Ordinary dictionary meaning |
| OASIS | Desert spring | hard | Ordinary definition; no second route |
| TEETH | They're set in a smile | hard | Possibly a cryptic definition, but likely easy |
| TOMATO | Old love apple | hard | Historical synonym; no cryptic operation |
| IMAGINE | Lennon's call to picture it | hard | Cultural trivia with a direct definition |
| BERSERK | Mad, like a Norse warrior | hard | Definition/allusion, not clear advanced wordplay |

## Sample verified parsings (editorial examples, not all-corpus certification)

| Level | Answer | Existing clue | Definition | Wordplay and indicator |
|---|---|---|---|---|
| Easy | ACID | Sour part of placid | Sour | PL[ACID], “part of” is a hidden-word indicator |
| Easy | ADULT | Mature: dual time revised | Mature | DUAL + T (time); “revised” indicates anagram → ADULT |
| Easy | ALERT | Later, out — warning | warning | LATER anagrammed by “out” → ALERT |
| Medium | ABIDE | Stand a bid, English | Stand (tolerate) | A + BID + E (English) → ABIDE |
| Medium | ALARM | Alert: a learner's limb | Alert | A + L (learner) + ARM (limb) → ALARM |
| Medium | ABSENCE | Non-appearance of cab seen arriving erratically | Non-appearance | CABSEEN anagram (“erratically”) → ABSENCE |
| Hard | ABORT | Halt a bishop's scrap | Halt | A + B (bishop) + ORT (scrap) → ABORT; archaic ORT supports advanced grade |
| Hard | ANTENNA | Aerial stake by two new, one | Aerial | ANTE (stake) + N + N (two “new”) + A (one) → ANTENNA; wording needs final human check |
| Hard | DUO | Pair: instrument returned | Pair | OUD (instrument) reversed by “returned” → DUO |
| Hard | YELP | Cry for help, changing hospital to unknown | Cry | HELP with H (hospital) replaced by Y (unknown) → YELP |

These ten examples were checked letter by letter. The existing app's Stage 2 authored hints apply only to exact approved-style examples; other clues get general method guidance, not fabricated parsing.

## Editorial process

1. Review the three **confirmed failures** before considering a merge. Do not change their answer keys or crossings: any fix must preserve the grid answer exactly, or require puzzle-level review.
2. Review the eleven **difficulty / definition** candidates. Accept and document deliberate cryptic definitions where defensible; otherwise approve a replacement variant and updated difficulty rating.
3. Sample remaining variants systematically by clue type and difficulty. In particular, individually assess all homophones for UK pronunciation and all abbreviations for recognised cryptic usage.
4. Record the adjudication and parsing for every approved change; preserve clue/difficulty index alignment.
5. Re-run `node tests/fairness.test.cjs` after any change.

## Future-answer secrecy limitation

The application is a **single offline HTML file containing all 408 daily grids and their solutions**. Its schedule is deterministic, but anyone inspecting the distributed HTML can access future answers. Client-side obfuscation would not fix this. Genuine future-answer secrecy requires a content delivery or encrypted-key release redesign that conflicts with the current fully-offline requirement; no such change was made.

## Verification limits

Static inspection and simulated solving checks do not replace real NVDA/VoiceOver/TalkBack or physical iPhone/Android small-screen testing. No browser/device acceptance run is claimed. No merge or deployment is authorised by this report.
