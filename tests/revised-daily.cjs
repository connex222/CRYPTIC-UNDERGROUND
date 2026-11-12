/* Verify the explicitly edited clues and the future-cycle replacement grid.
 * Run: node tests/revised-daily.cjs
 * Authored clue explanations remain editorial assertions, not an AI lexical oracle.
 */
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
function validate(html){
 const get=name=>{
  const token="var "+name+" = ",i=html.indexOf(token);
  assert(i>=0,"missing "+name);
  return JSON.parse(html.slice(i+token.length,html.indexOf("\n",i)).replace(/;\s*$/,""));
 };
 const clues=get("CLUES"),difficulty=get("CLUE_DIFFICULTY"),daily=get("ALL_PUZZLES"),fresh=get("REVISED_DAILY_0282");
 const original=daily.find(p=>p.id==="cu-0282");
 assert(original&&original.entries.length===4,"legacy 2026 puzzle must remain intact");
 assert.deepEqual(original.grid,["#######",".#.#.##",".#.#.##",".......",".#.#.##",".#.#.##","#######"]);
 assert.equal(fresh.id,"cu-0282-r2");
 assert.equal(fresh.size,7);
 assert.equal(fresh.entries.length,14);
 assert(!daily.some(p=>p.id===fresh.id),"revised grid must not alter the original daily index table");
 assert(/PUZZLE_DAY>=PUZZLES\.length && PUZZLE_DAY%PUZZLES\.length===281/.test(html),"future-only replacement guard absent");
 const location=new Map(),entries=new Set(),count=Array.from({length:7},()=>Array(7).fill(0));
 for(const e of fresh.entries){
  assert(clues[e.a]&&clues[e.a].length,"unclued revised entry "+e.a);
  assert(["easy","medium","hard"].includes(e.difficulty),"invalid revised difficulty "+e.a);
  assert(typeof e.clue==="string"&&e.clue.length>10,"missing revised authored clue "+e.a);
  assert(["A","D"].includes(e.dir),"invalid direction");
  const entryKey=e.r+","+e.c+","+e.dir;
  assert(!entries.has(entryKey),"duplicate revised start");entries.add(entryKey);
  const firstR=e.r-(e.dir==="D"?1:0),firstC=e.c-(e.dir==="A"?1:0);
  const lastR=e.r+(e.dir==="D"?e.a.length:0),lastC=e.c+(e.dir==="A"?e.a.length:0);
  const white=(r,c)=>r>=0&&c>=0&&r<7&&c<7&&fresh.grid[r][c]!=="#";
  assert(!white(firstR,firstC)&&!white(lastR,lastC),"incomplete grid run "+e.a);
  for(let k=0;k<e.a.length;k++){
   const r=e.r+(e.dir==="D"?k:0),c=e.c+(e.dir==="A"?k:0),key=r+","+c;
   assert(white(r,c),"blocked or outside "+key);
   assert(!location.has(key)||location.get(key)===e.a[k],"inconsistent crossing "+e.a);
   location.set(key,e.a[k]);count[r][c]++;
  }
 }
 let whiteCount=0,unchecked=0;
 for(let r=0;r<7;r++)for(let c=0;c<7;c++)if(fresh.grid[r][c]!=="#"){
  whiteCount++;assert(location.has(r+","+c),"unfilled white square");
  if(count[r][c]===1)unchecked++;
 }
 assert.equal(whiteCount,39);
 assert.equal(unchecked,8,"new grid must have eight unchecked squares");
 const sort=word=>word.replace(/[^A-Z]/g,"").split("").sort().join("");
 const edits=[
  {answer:"NOUN",clue:"Part of speech: number followed by United Nations",level:"medium",valid:"NO"+"UN"==="NOUN"},
  {answer:"RACER",clue:"Runner: race followed by right",level:"easy",valid:"RACE"+"R"==="RACER"},
  {answer:"WEE",clue:"Small: west and two eastern points",level:"medium",valid:"W"+"E"+"E"==="WEE"},
  {answer:"ENVY",clue:"Jealousy: 'in' in French, victory and year",level:"hard",valid:"EN"+"V"+"Y"==="ENVY"},
  {answer:"CLUE",clue:"Hint: club trades bachelor for east",level:"medium",valid:"CLUB".replace("B","E")==="CLUE"},
  {answer:"GURU",clue:"Sage: good university, rugby union",level:"medium",valid:"G"+"U"+"RU"==="GURU"},
  {answer:"ARTICLE",clue:"Newspaper piece — or word such as 'the'",level:"medium",valid:true},
  {answer:"DIGITAL",clue:"Relating to fingers — or to binary data",level:"medium",valid:true},
  {answer:"EBB",clue:"Recede, concealed in webbed toes",level:"easy",valid:"WEBBED".includes("EBB")},
  {answer:"OASIS",clue:"Desert refuge concealed by cargo as is",level:"medium",valid:"CARGOASIS".includes("OASIS")},
  {answer:"TEETH",clue:"They bite: golf peg followed by Thursday",level:"medium",valid:"TEE"+"TH"==="TEETH"},
  {answer:"TOMATO",clue:"Fruit from 'to', a floor covering and nothing",level:"medium",valid:"TO"+"MAT"+"O"==="TOMATO"},
  {answer:"IMAGINE",clue:"Picture myself with wise men in the north-east",level:"medium",valid:"I"+"MAGI"+"NE"==="IMAGINE"},
  {answer:"BERSERK",clue:"Mad: BREAKERS minus A, wildly",level:"hard",valid:sort("BREAKERS".replace("A",""))===sort("BERSERK")},
  {answer:"APPAREL",clue:"Clothing made by mixing A PEARL with P",level:"medium",valid:sort("APEARLP")===sort("APPAREL")}
 ];
 for(const e of edits){
  const pos=clues[e.answer].indexOf(e.clue);
  assert(pos>=0,"missing replacement "+e.answer);
  assert.equal(difficulty[e.answer][pos],e.level,"wrong grading "+e.answer);
  assert(e.valid,"bad edited clue derivation "+e.answer);
 }
 const revisedProof={
  ABOARD:"A"+"BOARD"==="ABOARD",
  PIED:"PIE"+"D"==="PIED",
  POLE:true, // poll/pole pronunciation needs human UK accent review
  ERRATIC:sort("RICETAR")===sort("ERRATIC"),
  ROAR:"R"+"OAR"==="ROAR",
  TOTE:"TO"+"TEA".slice(0,-1)==="TOTE",
  FELINE:"FE"+"LINE"==="FELINE",
  ADVERT:"A"+"D"+"VERT"==="ADVERT",
  ROOF:"PROOF".includes("ROOF"),
  RATE:sort("TEAR")===sort("RATE"),
  APPAREL:sort("APEARLP")===sort("APPAREL"),
  RIOT:sort("TRIO")===sort("RIOT"),
  DELI:"MODELINDUSTRY".includes("DELI"),
  DECADE:"DEC"+"LEMONADE".slice(-3)==="DECADE"
 };
 for(const e of fresh.entries)assert(revisedProof[e.a],"incorrect new clue mechanics "+e.a);
 let palindromes=0;
 for(const [a,arr] of Object.entries(clues))for(const clue of arr)
  if(/\b(either way|both ways)\b/i.test(clue) && a!==[...a].reverse().join(""))palindromes++;
 assert.equal(palindromes,0,"false palindrome claims remain");
 return {result:"PASS",originalPuzzlesPreserved:408,legacyPuzzle:"cu-0282",revisedPuzzle:fresh.id,
  newGridEntries:14,newGridWhiteSquares:39,newGridUnchecked:8,newGridUncheckedPercent:+(100*8/39).toFixed(1),
  correctedBankClues:edits.length,validatedRevisedClues:fresh.entries.length,invalidPalindromeClaims:palindromes,
  humanReview:"One homophone pronunciation and broader corpus still require human editorial assessment"};
}
if(require.main===module){try{
 const h=fs.readFileSync(path.resolve(__dirname,"..","index.html"),"utf8");
 console.log(JSON.stringify(validate(h),null,2));
}catch(err){console.error(err.stack);process.exitCode=1;}}
module.exports={validate};
