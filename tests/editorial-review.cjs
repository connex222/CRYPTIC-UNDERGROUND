/* Editorial diagnostics. No approved clue or grid is changed by this audit.
 * Run: node tests/editorial-review.cjs
 */
const fs = require("node:fs");
const path = require("node:path");

function inspect(html) {
  function read(name) {
    const marker = "var " + name + " = ";
    const start = html.indexOf(marker);
    if (start < 0) throw Error("Missing corpus constant " + name);
    const end = html.indexOf("\n", start);
    return JSON.parse(html.slice(start + marker.length, end).trim().replace(/;\s*$/, ""));
  }
  const clues = read("CLUES");
  const ratings = read("CLUE_DIFFICULTY");
  const puzzles = read("ALL_PUZZLES").concat(read("PRACTICE_PUZZLES"));
  const palindromeClaims = [], repeatedText = [], poorCrossing = [], suspiciousHard = [];
  const seen = new Map();
  let cells = 0, unchecked = 0, malformedRuns = 0, disjoint = 0;

  for (const [answer, variants] of Object.entries(clues)) {
    variants.forEach((clue, i) => {
      const norm = clue.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (seen.has(norm) && seen.get(norm).answer !== answer)
        repeatedText.push({ answer, clue, conflictsWith: seen.get(norm) });
      else if (!seen.has(norm)) seen.set(norm, { answer, clue });
      if (/\b(?:either way|both ways)\b/i.test(clue) &&
          answer !== [...answer].reverse().join(""))
        palindromeClaims.push({ answer, clue, difficulty: ratings[answer][i] });
      if (ratings[answer][i] === "hard" && /\b(?:the green-eyed monster|not analogue|desert spring|it may be across or down)\b/i.test(clue))
        suspiciousHard.push({answer,clue,reason:"Direct definition or familiar phrase rated hard — editorial judgement required"});
    });
  }

  for (const p of puzzles) {
    const occupancy = Array.from({ length: p.size }, () => Array(p.size).fill(0));
    const inWhite = (r,c) => r >= 0 && c >= 0 && r < p.size && c < p.size && p.grid[r][c] !== "#";
    for (const e of p.entries) {
      for (let k=0; k<e.a.length; k++)
        occupancy[e.r+(e.dir==="D"?k:0)][e.c+(e.dir==="A"?k:0)]++;
      if (inWhite(e.r-(e.dir==="D"?1:0),e.c-(e.dir==="A"?1:0)) ||
          inWhite(e.r+(e.dir==="D"?e.a.length:0),e.c+(e.dir==="A"?e.a.length:0)))
        malformedRuns++;
    }
    let white = 0, one = 0;
    for (let r=0;r<p.size;r++) for (let c=0;c<p.size;c++)
      if(inWhite(r,c)) { white++; if(occupancy[r][c] === 1) one++; }
    cells+=white; unchecked+=one;
    const pct = +(100*one/white).toFixed(1);
    if (pct>=40) poorCrossing.push({
      id:p.id, size:p.size, answers:p.entries.length, white, unchecked:one,
      uncheckedPercent:pct, severity:pct>50?"CRITICAL — exceptional sparseness":"REVIEW — high unchecked ratio"
    });
  }

  poorCrossing.sort((a,b)=>b.uncheckedPercent-a.uncheckedPercent || a.id.localeCompare(b.id));
  const flagCount = {unfairPalindrome:palindromeClaims.length,duplicateClueDifferentAnswer:repeatedText.length,
    highUncheckedRatio:poorCrossing.length,criticalSparse:poorCrossing.filter(p=>p.uncheckedPercent>50).length,
    hardDirectDefinitionSamples:suspiciousHard.length};
  return {
    purpose:"Editorial triage, not automatic correction or comprehensive clue certification",
    puzzleCount:puzzles.length, playableCells:cells, uncheckedCells:unchecked,
    puzzlesWithHighUncheckedRatio:poorCrossing.length, malformedEntryBoundaries:malformedRuns,
    flags:flagCount,
    invalidPalindromeClues:palindromeClaims,
    identicalClueDifferentAnswer:repeatedText,
    sparseGridCandidates:poorCrossing,
    directDefinitionHardCandidates:suspiciousHard,
    policy:"All exceptions require setter approval; scripts must not change authored clues or solutions."
  };
}

if (require.main === module) {
  try {
    const html = fs.readFileSync(path.resolve(__dirname, "..", "index.html"), "utf8");
    const result = inspect(html);
    process.stdout.write(JSON.stringify(result,null,2)+"\n");
  } catch (err) { console.error(err.stack); process.exitCode = 1; }
}
module.exports = { inspect };
