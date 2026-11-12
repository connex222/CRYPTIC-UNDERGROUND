/* Deterministic daily schedule and UK local date/DST tests.
 * Run: node tests/rotation.cjs
 */
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");

function auditRotation(html){
  const read=name=>{
    const start=html.indexOf("var "+name+" = ");
    assert(start>=0,"Missing "+name);
    const end=html.indexOf("\n",start);
    return JSON.parse(html.slice(start+("var "+name+" = ").length,end).replace(/;\s*$/,""));
  };
  const daily=read("ALL_PUZZLES"),practice=read("PRACTICE_PUZZLES"),clues=read("CLUES"),revised=read("REVISED_DAILY_0282");
  assert.equal(daily.length,408);assert.equal(practice.length,50);
  assert.equal(new Set(daily.map(p=>p.id)).size,408,"Daily IDs unique");
  assert.equal(new Set(practice.map(p=>p.id)).size,50,"Practice IDs unique");
  assert.equal(new Set(daily.map(p=>p.id).concat(practice.map(p=>p.id))).size,458,"Daily and practice ID namespaces independent");

  const fn=html.match(/function dayIndex\(\)\{[\s\S]*?\n\}/);
  assert(fn,"dayIndex function must exist");
  const epoch=Date.UTC(2026,0,1);
  let assertions=0;
  function indexAt(iso,tz){
    const original=process.env.TZ;
    process.env.TZ=tz;
    try {
      class FixedDate extends Date {
        constructor(...args){super(...(args.length?args:[iso]));}
        static UTC(...args){return Date.UTC(...args);}
      }
      const run=new Function("Date","EPOCH",fn[0]+"; return dayIndex();");
      return run(FixedDate,epoch);
    }finally{
      if(original===undefined)delete process.env.TZ;
      else process.env.TZ=original;
    }
  }
  const checks=[
    ["2026-01-01T00:01:00Z",0],
    ["2026-01-02T00:01:00Z",1],
    ["2026-03-29T00:30:00Z",87],
    ["2026-03-29T01:30:00Z",87],
    ["2026-03-29T23:30:00Z",88],
    ["2026-10-25T00:30:00Z",297],
    ["2026-10-25T01:30:00Z",297],
    ["2026-10-25T23:30:00Z",297],
    ["2026-10-26T00:30:00Z",298],
    ["2027-01-01T12:00:00Z",365],
    ["2027-02-13T12:00:00Z",408],
    ["2028-02-29T12:00:00Z",789]
  ];
  for(const [iso,expected] of checks){
    assert.equal(indexAt(iso,"Europe/London"),expected,"UK dayIndex mismatch "+iso);
    assertions++;
  }
  // Preserve the first-cycle original; only its future return is replaced.
  const byDay=i=>i>=daily.length && i%daily.length===281 ? revised : daily[i%daily.length];
  assert.equal(byDay(281).id,"cu-0282","the historic 2026 daily must not change");
  assert.equal(byDay(689).id,"cu-0282-r2","corrected puzzle must be served in the next cycle");
  assert.equal(byDay(1097).id,"cu-0282-r2","later cycles keep the revised deterministic version");
  assert.equal(indexAt("2026-10-09T12:00:00Z","Europe/London"),281);
  assert.equal(indexAt("2027-11-21T12:00:00Z","Europe/London"),689);
  assertions+=5;
  for(let i=0;i<408;i++){
    if(i===281) assert.notEqual(byDay(i).id,byDay(i+408).id,"exception must replace the sparse grid");
    else assert.equal(byDay(i).id,byDay(i+408).id,"schedule repeat deterministic "+i);
    assert.equal(byDay(i+408).id,byDay(i+816).id,"future schedule deterministic "+i);
    assert.notEqual("cu:daily:"+i,"cu:daily:"+(i+408),"progress keys must be date scoped");
    assertions+=3;
    for(const e of byDay(i).entries)assert(clues[e.a]&&clues[e.a].length,"daily entry clue supply");
  }
  assert(/SAVE_KEY=CU_PRACTICE \? "cu:"\+P\.id : "cu:daily:"\+PUZZLE_DAY/.test(html),"live code must store by absolute date");
  assert(/PUZZLE_DAY>=PUZZLES\.length && PUZZLE_DAY%PUZZLES\.length===281/.test(html),"live daily must support future-only replacement");
  assertions++;
  return {result:"PASS",assertions,UKTimeZone:"Europe/London",DSTSpring:"2026-03-29",DSTAutumn:"2026-10-25",repeatCycle:408,firstDaily:daily[0].id,firstAfterCycle:byDay(408).id,
    note:"The first-cycle cu-0282 stays archived; its future appearances use cu-0282-r2. All absolute-day keys remain independent; future answers are still contained in offline HTML."};
}
if(require.main===module){
  try{console.log(JSON.stringify(auditRotation(fs.readFileSync(path.resolve(__dirname,"..","index.html"),"utf8")),null,2));}
  catch(err){console.error(err.stack);process.exitCode=1;}
}
module.exports={auditRotation};
