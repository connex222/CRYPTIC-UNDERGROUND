
function runInteraction(html){
 const ok=(x,m)=>{if(!x)throw Error("Interaction QA failed: "+m);};
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);ok(scripts.length===3,"script count");
 const storage=new Map();let checks=0;
 function open(hash,dateOverride){
  let doc,now=dateOverride||"2026-11-12T13:59:00Z",reloads=0,promptText="";
  class Node {
   constructor(tag="div",id=""){
    this.tagName=tag.toUpperCase();this.id=id;this.className="";this.style={};this.dataset={};
    this.children=[];this.events={};this.attributes={};this.tabIndex=0;this.disabled=false;
    this.textContent="";this.innerHTML="";this.hidden=false;this._watch=[];
    const self=this;
    this.classList={
     contains(n){return self.className.split(/\s+/).includes(n);},
     add(n){if(!this.contains(n))self.className+=(self.className?" ":"")+n;self._watch.forEach(f=>f());},
     remove(n){self.className=self.className.split(/\s+/).filter(v=>v!==n).join(" ");self._watch.forEach(f=>f());},
     toggle(n,force){let b=force===undefined?!this.contains(n):force;if(b)this.add(n);else this.remove(n);return b;}
    };
   }
   addEventListener(k,fn){(this.events[k]||(this.events[k]=[])).push(fn);}
   dispatch(k,e={}){e.target=e.target||this;e.preventDefault=e.preventDefault||function(){this.prevented=true;};for(const f of this.events[k]||[])f.call(this,e);return e;}
   click(){return this.dispatch("click");}
   appendChild(x){x.parentNode=this;this.children.push(x);return x;}
   insertBefore(x,b){x.parentNode=this;let i=this.children.indexOf(b);if(i<0)this.children.push(x);else this.children.splice(i,0,x);}
   get nextSibling(){return this.parentNode?.children[this.parentNode.children.indexOf(this)+1]||null;}
   setAttribute(k,v){this.attributes[k]=String(v);}
   getAttribute(k){return this.attributes[k]||null;}
   focus(){doc.activeElement=this;}
   closest(q){return this.tagName==="BUTTON"&&q.includes("button")?this:null;}
   getBoundingClientRect(){return {height:this.id==="keys"?150:40};}
   querySelectorAll(q){if(q===".cell")return this.children.filter(x=>x.classList.contains("cell"));if(q==="button,[href],[tabindex]")return this.children.filter(x=>x.tagName==="BUTTON");return [];}
  }
  const nodes={};for(const m of html.matchAll(/\bid="([^"]+)"/g))nodes[m[1]]=new Node("div",m[1]);
  const el=id=>nodes[id]||(nodes[id]=new Node("div",id));
  ["prev","next","bDirection","bPencil","bHint","bCheck","bReveal","bWhatsApp","bReference","bClose","bShare","referenceClose"].forEach(id=>el(id).tagName="BUTTON");
  el("board").className="board";el("reference").className="reference";el("banner").className="banner";
  el("hintPanel").hidden=true;
  const levelButtons=["all","easy","medium","hard"].map(v=>{const n=new Node("button");n.className="df-btn";n.dataset.level=v;return n;});
  const body=new Node("body","body"),stage=new Node("div","stage"),header=new Node("header","header");
  body.appendChild(header);body.appendChild(stage);
  stage.appendChild(el("board"));header.appendChild(el("streak"));
  body.appendChild(el("keys"));body.appendChild(el("banner"));body.appendChild(el("reference"));
  el("banner").appendChild(el("bShare"));el("banner").appendChild(el("bClose"));
  el("reference").appendChild(el("referenceClose"));
  doc={
   body,activeElement:body,hidden:false,events:{},
   createElement:tag=>new Node(tag),
   getElementById:el,
   querySelector:q=>q===".ref"?el("ref"):null,
   querySelectorAll:q=>q===".df-btn"?levelButtons:[],
   addEventListener(k,fn){(this.events[k]||(this.events[k]=[])).push(fn);},
   dispatch(k,e){for(const fn of this.events[k]||[])fn(e);}
  };
  class Clock extends Date {constructor(...a){super(...(a.length?a:[now]));}static now(){return Date.parse(now);}}
  const localStorage={getItem(k){return storage.has(k)?storage.get(k):null;},setItem(k,v){storage.set(k,String(v));},removeItem(k){storage.delete(k);}};
  const location={hash:hash||"",search:"",reload(){reloads++;}};
  const win={innerWidth:390,innerHeight:844,events:{},addEventListener(k,f){(this.events[k]||(this.events[k]=[])).push(f);},dispatch(k){for(const f of this.events[k]||[])f();},prompt(t,v){promptText=v;},confirm(){return false;},open(){}};
  class MutationObserver {constructor(f){this.f=f;}observe(el){el._watch.push(this.f);}}
  const computed=el=>({position:["banner","toast","reference"].includes(el.id)?"fixed":"static",display:"block",paddingTop:"8px",paddingBottom:"8px"});
  const returned="\nreturn {P,entries,letters,pencilled,locked,cellEls,PUZZLE_DAY,CU_PRACTICE,dayIndex,type,backspace,tapCell,checkDone, current(){return {cur,pos,hintsUsed,guideUsed,revealed,done};},select(i,k){cur=i;pos=k;hintStep=0;hideHint();draw();}};";
  let counter=0;
  const api=(new Function("document","window","location","localStorage","navigator","Date","setTimeout","clearTimeout","MutationObserver","getComputedStyle",scripts.join("\n")+returned))
     (doc,win,location,localStorage,{},Clock,()=>++counter,()=>{},MutationObserver,computed);
  return {api,el,doc,body,win,location,setNow:v=>now=v,getReloads:()=>reloads,getPrompt:()=>promptText};
 }
 function numberedInReadingOrder(entries){
  const starts=new Map();
  entries.forEach(e=>starts.set(e.r+","+e.c,[e.r,e.c]));
  const keys=[...starts.values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const nums=new Map(keys.map((p,i)=>[p[0]+","+p[1],i+1]));
  return entries.every(e=>e.num===nums.get(e.r+","+e.c));
 }
 let a=open(""),api=a.api,el=a.el;
 ok(el("board").children.length===api.P.size*api.P.size,"board renders");checks++;
 ok(numberedInReadingOrder(api.entries),"daily clue numbers in reading order");checks++;
 ok(!api.current().done,"starts unfinished");checks++;
 let sq=api.entries[0].cells[0];ok(api.cellEls[sq[0]][sq[1]].getAttribute("role")==="button","screen-reader square label");checks++;
 el("bHint").click();ok(api.current().guideUsed===1&&api.current().hintsUsed===0,"stage 1 does not reveal");checks++;
 el("bHint").click();ok(api.current().guideUsed===2&&api.current().hintsUsed===0,"stage 2 does not reveal");checks++;
 el("bHint").click();ok(api.current().hintsUsed===1,"stage 3 reveals one letter");checks++;
 let target=null;
 for(let i=0;i<api.entries.length&&!target;i++)for(let k=0;k<api.entries[i].cells.length;k++){const [r,c]=api.entries[i].cells[k];if(!api.locked[r][c]){target=[i,k];break;}}
 ok(target,"editable square exists");
 api.select(...target);el("bPencil").click();
 let e=api.entries[target[0]],k=target[1],[r,c]=e.cells[k];
 api.type(e.a[k]);ok(api.pencilled[r][c],"pencil entry saved");checks++;
 el("bPencil").click();api.select(...target);api.type(e.a[k]);ok(!api.pencilled[r][c],"ink replaces pencil");checks++;
 let crossing=null;
 for(let i=0;i<api.entries.length&&!crossing;i++)for(let k=0;k<api.entries[i].cells.length;k++){
  const [rr,cc]=api.entries[i].cells[k];
  if(api.locked[rr][cc])continue;
  if(api.entries.filter(x=>x.cells.some(y=>y[0]===rr&&y[1]===cc)).length===2){crossing=[i,k];break;}
 }
 ok(crossing,"found intersection");api.select(...crossing);e=api.entries[crossing[0]];
 api.type(e.a[crossing[1]]==="Z"?"A":"Z");el("bCheck").click();
 ok(el("toast").textContent==="1 square incorrect","no double count at crossing");checks++;
 const rev=api.current().revealed;el("bReveal").click();ok(api.current().revealed===rev,"cancelled reveal safe");checks++;
 const key="cu:daily:"+api.PUZZLE_DAY;
 ok(storage.has(key),"saves by absolute day");checks++;
 a=open("");api=a.api;el=a.el;
 ok(api.current().hintsUsed===1&&api.current().guideUsed===2,"refresh retains hints");checks++;
 for(let i=0;i<api.entries.length;i++)for(let k=0;k<api.entries[i].cells.length;k++){api.select(i,k);api.type(api.entries[i].a[k]);}
 ok(api.current().done&&el("banner").classList.contains("up"),"complete crossword run");checks++;
 ok(storage.get("cu:done:daily:"+api.PUZZLE_DAY)==="1","day completion stored");checks++;
 el("bShare").click();ok(a.getPrompt().includes("No spoilers.")&&!a.getPrompt().includes("Across"),"share no answers");checks++;
 const completedLetters=JSON.stringify(api.letters),finalStats=api.current();
 el("bClose").click();
 api.type("Z");api.backspace();el("bHint").click();el("bReveal").click();
 const clear=el("keys").children.flatMap(x=>x.children).find(x=>x.textContent==="CLEAR");
 ok(!!clear,"clear control exists");clear.click();
 ok(JSON.stringify(api.letters)===completedLetters,"finished grid cannot be changed by keyboard, hint, reveal or Clear");checks++;
 ok(api.current().revealed===finalStats.revealed&&api.current().hintsUsed===finalStats.hintsUsed,"completed results are immutable");checks++;
 el("bClose").click();const ev={key:"Tab",target:a.body,prevented:false,preventDefault(){this.prevented=true;}};
 a.doc.dispatch("keydown",ev);ok(!ev.prevented,"keyboard Tab not trapped");checks++;
 a.setNow("2026-11-13T09:00:00Z");a.win.dispatch("focus");ok(a.getReloads()===1,"date rollover refresh");checks++;
 const oldStreak=storage.get("cu:streak"),oldDay=storage.get("cu:lastDay");
 const practice=open("#practice"),p=practice.api;
 ok(p.CU_PRACTICE,"practice loads");checks++;
 ok(numberedInReadingOrder(p.entries),"practice clue numbers in reading order");checks++;
 for(let i=0;i<p.entries.length;i++)for(let k=0;k<p.entries[i].cells.length;k++){p.select(i,k);p.type(p.entries[i].a[k]);}
 ok(p.current().done,"practice completes");checks++;
 ok(storage.get("cu:streak")===oldStreak&&storage.get("cu:lastDay")===oldDay,"practice does not change daily streak");checks++;
 const archived=open("","2026-10-09T12:00:00Z");
 ok(archived.api.P.id==="cu-0282"&&archived.api.entries.length===4,"2026 historic crossword remains unchanged");checks++;
 archived.api.select(0,0);archived.api.type(archived.api.entries[0].a[0]);
 const oldProgress=storage.get("cu:daily:281");
 ok(!!oldProgress,"historic progress written to its own day");checks++;
 const revised=open("","2027-11-21T12:00:00Z");
 ok(revised.api.P.id==="cu-0282-r2"&&revised.api.entries.length===14,"2027 corrected crossword loaded");checks++;
 ok(revised.api.entries.every(x=>x.clue&&x.difficulty),"authored revision clues and grades preserved");checks++;
 for(let i=0;i<revised.api.entries.length;i++)for(let k=0;k<revised.api.entries[i].cells.length;k++){
  revised.api.select(i,k);revised.api.type(revised.api.entries[i].a[k]);
 }
 ok(revised.api.current().done,"future crossword completes");checks++;
 ok(storage.get("cu:daily:281")===oldProgress,"future revision does not overwrite past progress");checks++;
 ok(storage.get("cu:done:daily:689")==="1","future revision has independent completion record");checks++;
 return {result:"PASS simulated daily, practice and future-cycle repair",checks,daily:a.api.P.id,practice:p.P.id,revised:revised.api.P.id,screenReader:"ARIA attributes inspected in mock; physical assistive technology pending"};
}
if(typeof module!=="undefined"&&module.exports){module.exports={runInteraction};if(require.main===module){
 const fs=require("node:fs"),path=require("node:path"),html=fs.readFileSync(path.resolve(__dirname,"..","index.html"),"utf8");
 try{console.log(JSON.stringify(runInteraction(html),null,2));}catch(e){console.error(e.stack);process.exitCode=1;}
}}
