/* Zero-dependency data and static UX checks: node tests/fairness.cjs */
function audit(html){
  const assert=(ok,message)=>{if(!ok)throw Error("QA failed: "+message);};
  function bank(name){
    const prefix="var "+name+" = ";
    const start=html.indexOf(prefix);
    assert(start>=0,"missing "+name);
    const end=html.indexOf("\n",start);
    return JSON.parse(html.slice(start+prefix.length,end).trim().replace(/;\s*$/,""));
  }
  const clues=bank("CLUES"),diff=bank("CLUE_DIFFICULTY");
  const daily=bank("ALL_PUZZLES"),practice=bank("PRACTICE_PUZZLES");
  const variants=Object.values(clues).reduce((n,x)=>n+x.length,0);
  const levels={easy:0,medium:0,hard:0};
  assert(Object.keys(clues).length===1532,"answer bank unexpectedly changed");
  assert(variants===2523,"clue bank unexpectedly changed");
  for(const [answer,forms] of Object.entries(clues)){
    assert(/^[A-Z]+$/.test(answer),"invalid answer characters: "+answer);
    assert(Array.isArray(forms)&&forms.length>0,"missing variants: "+answer);
    assert(Array.isArray(diff[answer])&&diff[answer].length===forms.length,"misaligned ratings: "+answer);
    for(let i=0;i<forms.length;i++){
      assert(typeof forms[i]==="string"&&forms[i].trim().length>0,"blank clue: "+answer+" "+i);
      assert(levels[diff[answer][i]]!==undefined,"unknown difficulty: "+answer+" "+i);
      levels[diff[answer][i]]++;
    }
  }
  assert(daily.length===408&&practice.length===50,"puzzle schedule unexpectedly changed");
  const used=new Set();let crossings=0,checkedCells=0,entriesCount=0;
  for(const p of [...daily,...practice]){
    assert(p.size===5||p.size===7,"unexpected size "+p.id);
    assert(p.grid.length===p.size&&p.grid.every(row=>row.length===p.size),"grid size: "+p.id);
    const cells=new Map(),directions=new Set();
    for(const e of p.entries){
      entriesCount++;
      assert(clues[e.a],"unclued entry: "+p.id+" "+e.a);
      assert(e.dir==="A"||e.dir==="D","invalid direction "+p.id);
      assert(Number.isInteger(e.r)&&Number.isInteger(e.c),"invalid start "+p.id);
      used.add(e.a);
      const id=e.r+","+e.c+","+e.dir;
      assert(!directions.has(id),"duplicate entry "+p.id+" "+id);
      directions.add(id);
      for(let k=0;k<e.a.length;k++){
        const r=e.r+(e.dir==="D"?k:0),c=e.c+(e.dir==="A"?k:0);
        assert(r>=0&&r<p.size&&c>=0&&c<p.size,"out-of-bounds "+p.id+" "+e.a);
        assert(p.grid[r][c]!=="#","entry on blocked cell "+p.id+" "+e.a);
        const key=r+","+c,old=cells.get(key);
        if(old!==undefined){crossings++;assert(old===e.a[k],"inconsistent crossing: "+p.id+" "+key);}
        cells.set(key,e.a[k]);
      }
    }
    for(let r=0;r<p.size;r++)for(let c=0;c<p.size;c++){
      if(p.grid[r][c]!=="#"){
        checkedCells++;
        assert(cells.has(r+","+c),"uncovered square "+p.id+" "+r+","+c);
      }else assert(!cells.has(r+","+c),"blocked square occupied "+p.id);
    }
  }
  assert(used.size===1532,"answer coverage discrepancy");
  const palindromeIssues=[];
  for(const [answer,forms] of Object.entries(clues))
    for(let i=0;i<forms.length;i++)
      if(/\b(either way|both ways)\b/i.test(forms[i])&&answer!==answer.split("").reverse().join(""))
        palindromeIssues.push({answer,clue:forms[i],difficulty:diff[answer][i]});
  const known=new Set(["NOUN|Name, either way","RACER|Runner either way","WEE|Small, either way"]);
  assert(palindromeIssues.every(x=>known.has(x.answer+"|"+x.clue)),"new unreviewed false palindrome claim");
  const verified=[
    ["ACID","Sour part of placid","easy", "PLACID".includes("ACID")],
    ["ADULT","Mature: dual time revised","easy","ADULT".split("").sort().join("")==="DUALT".split("").sort().join("")],
    ["ALERT","Later, out — warning","easy","ALERT".split("").sort().join("")==="LATER".split("").sort().join("")],
    ["ABIDE","Stand a bid, English","medium","A"+"BID"+"E"==="ABIDE"],
    ["ALARM","Alert: a learner's limb","medium","A"+"L"+"ARM"==="ALARM"],
    ["ABSENCE","Non-appearance of cab seen arriving erratically","medium","ABSENCE".split("").sort().join("")==="CABSEEN".split("").sort().join("")],
    ["ABORT","Halt a bishop's scrap","hard","A"+"B"+"ORT"==="ABORT"],
    ["ANTENNA","Aerial stake by two new, one","hard","ANTE"+"N"+"N"+"A"==="ANTENNA"],
    ["DUO","Pair: instrument returned","hard","OUD".split("").reverse().join("")==="DUO"],
    ["YELP","Cry for help, changing hospital to unknown","hard","HELP".replace("H","Y")==="YELP"]
  ];
  for(const [answer,clue,level,proof] of verified){
    assert(proof,"bad proof: "+answer);
    const i=clues[answer].indexOf(clue);
    assert(i>=0&&diff[answer][i]===level,"missing/changed verified clue: "+answer);
  }
  const ids=["board","bDirection","bPencil","hintPanel","bHint","bCheck","bReveal","bShare","bReference"];
  for(const id of ids)assert(html.includes('id="'+id+'"'),"missing UI element "+id);
  assert(/role="group" aria-label="Crossword grid/.test(html),"grid group missing accessible label");
  assert(!html.includes("user-scalable=no"),"zoom disabled");
  assert(/var SAVE_KEY=CU_PRACTICE \? "cu:"\+P\.id : "cu:daily:"\+PUZZLE_DAY/.test(html),"daily key not scoped by date");
  assert(/pencilled\[e\.cells\[k\]\[0\]\]\[e\.cells\[k\]\[1\]\]/.test(html),"pencil completion guard missing");
  assert(!/ev\.key==="Tab"\)\{ ev\.preventDefault\(\); hop/.test(html),"keyboard Tab trapped");
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert(scripts.length===3,"unexpected script count");
  scripts.forEach((m,i)=>{try{new Function(m[1]);}catch(e){throw Error("script "+(i+1)+" syntax: "+e.message);}});
  return {result:"PASS (static and corpus checks)",grids:daily.length+practice.length,daily:daily.length,practice:practice.length,answers:used.size,clues:variants,levels,crossings,checkedCells,entryCount:entriesCount,verifiedParsings:verified.length,editorialExceptions:palindromeIssues,warning:"Future answers remain inspectable in the offline HTML. Device/screen-reader QA outstanding."};
}
if(typeof module!=="undefined"&&module.exports){
  module.exports={audit};
  if(require.main===module){
    const fs=require("node:fs"),path=require("node:path");
    const html=fs.readFileSync(path.resolve(__dirname,"..","index.html"),"utf8");
    try{console.log(JSON.stringify(audit(html),null,2));}catch(e){console.error(e.stack);process.exitCode=1;}
  }
}
