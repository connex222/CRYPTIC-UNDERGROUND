/* Chromium end-to-end accessibility and mobile layout smoke QA.
 * CI only: npm install --no-save playwright && npx playwright install --with-deps chromium
 * then node tests/browser.cjs. Does not modify or deploy the product.
 */
const fs=require("node:fs");
const path=require("node:path");
const http=require("node:http");
const assert=require("node:assert/strict");
const {chromium}=require("playwright");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"));
const shots=path.join(__dirname,".browser-evidence");
fs.mkdirSync(shots,{recursive:true});
let assertions=0;
function check(value,message){assert(value,message);assertions++;}
async function main(){
 const server=http.createServer((req,res)=>{
  if(req.url==="/favicon.ico"){res.writeHead(204);res.end();return;}
  res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"});
  res.end(html);
 });
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const base="http://127.0.0.1:"+server.address().port+"/";
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  const issues=[];
  async function open(width,height,now,mode){
   const context=await browser.newContext({viewport:{width,height},locale:"en-GB",timezoneId:"Europe/London",
    reducedMotion:"reduce",isMobile:width<=400,hasTouch:width<=400});
   await context.route("**/*",route=>{
    if(route.request().url().startsWith(base))return route.continue();
    issues.push("Unexpected external request: "+route.request().url());
    return route.abort();
   });
   await context.addInitScript((date)=>{
    const RealDate=Date;
    class FixedDate extends RealDate {
     constructor(...args){super(...(args.length?args:[date]));}
     static now(){return new RealDate(date).getTime();}
    }
    window.Date=FixedDate;
   },now);
   const page=await context.newPage();
   page.on("pageerror",error=>issues.push("Page exception: "+error.message));
   await page.goto(base+(mode||""),{waitUntil:"load"});
   await page.locator(".cell:not(.blocked)").first().waitFor({state:"visible"});
   return {context,page};
  }
  async function layout(page,width,label){
   const state=await page.evaluate(()=>{
    const root=document.documentElement;
    const box=x=>{const e=document.querySelector(x);if(!e)return null;const b=e.getBoundingClientRect();
     return {x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom};};
    return {scrollWidth:root.scrollWidth,board:box("#board"),keyboard:box("#keys"),
     hint:box("#bHint"),direction:box("#bDirection"),innerWidth:innerWidth,innerHeight:innerHeight,
     zoomDisabled:document.querySelector("meta[name='viewport']").content.includes("user-scalable=no")};
   });
   check(!state.zoomDisabled,label+" permits pinch zoom");
   check(state.scrollWidth<=width+3,label+" no horizontal overflow: "+JSON.stringify(state));
   check(state.board.width>80&&state.board.right<=width+4,label+" board fits viewport");
   check(state.keyboard.width>100&&state.keyboard.right<=width+4,label+" keyboard fits viewport");
   check(state.direction.right<=width+4&&state.hint.right<=width+4,label+" solver controls fit viewport");
   check(await page.locator('#bHint').isVisible(),label+" hint available");
  }
  async function solveUsingUI(page){
   const puzzle=await page.evaluate(()=>{
    const map=new Map();
    for(const e of entries)for(let k=0;k<e.cells.length;k++){
     const [r,c]=e.cells[k];map.set(r+","+c,{r,c,letter:e.a[k]});
    }
    return {size:N,id:P.id,entries:entries.length,cells:[...map.values()]};
   });
   for(const cell of puzzle.cells){
    await page.locator("#board .cell").nth(cell.r*puzzle.size+cell.c).click();
    await page.keyboard.press(cell.letter);
   }
   await page.locator("#banner.up").waitFor({state:"visible",timeout:15000});
   check(await page.locator("#bannerMsg").isVisible(),puzzle.id+" shows results");
   check(await page.locator("#bShare").isVisible(),puzzle.id+" spoiler-free share exists");
   return puzzle;
  }
  const primary=await open(390,844,"2026-11-12T14:00:00Z","");
  await layout(primary.page,390,"Mobile 390");
  const count=await primary.page.locator("#board .cell").count();
  check(count===25||count===49,"correct grid dimensions");
  check(await primary.page.locator('.cell[tabindex="0"]').count()===1,"one roving keyboard focus square");
  let before=await primary.page.locator(".cell.locked").count();
  await primary.page.locator("#bHint").click();
  check(await primary.page.locator("#hintPanel").isVisible(),"stage 1 appears");
  check(await primary.page.locator(".cell.locked").count()===before,"stage 1 reveals nothing");
  await primary.page.locator("#bHint").click();
  check(await primary.page.locator(".cell.locked").count()===before,"stage 2 reveals nothing");
  await primary.page.locator("#bHint").click();
  check(await primary.page.locator(".cell.locked").count()===before+1,"stage 3 reveals one letter");
  await primary.page.locator("#bPencil").click();
  check(await primary.page.locator("#bPencil").getAttribute("aria-pressed")==="true","pencil mode accessible");
  const blank=await primary.page.evaluate(()=>{
   for(const e of entries)for(let k=0;k<e.cells.length;k++){
    const [r,c]=e.cells[k];if(!locked[r][c])return {r,c,a:e.a[k],size:N};
   }
  });
  await primary.page.locator("#board .cell").nth(blank.r*blank.size+blank.c).click();
  await primary.page.keyboard.press(blank.a);
  check(await primary.page.locator("#board .cell").nth(blank.r*blank.size+blank.c).evaluate(el=>el.classList.contains("pencil")),"pencil entry visually distinct");
  await primary.page.locator("#bPencil").click();
  await primary.page.locator("#board .cell").nth(blank.r*blank.size+blank.c).click();
  await primary.page.keyboard.press(blank.a);
  check(!(await primary.page.locator("#board .cell").nth(blank.r*blank.size+blank.c).evaluate(el=>el.classList.contains("pencil"))),"inking resolves tentative entry");
  await primary.page.reload();
  check(await primary.page.locator(".cell.locked").count()===before+1,"refresh retains given letter");
  const route=await primary.page.locator("#bReference");
  await route.click();
  check(await primary.page.locator("#reference").getAttribute("aria-hidden")==="false","guide opens as dialogue");
  await primary.page.keyboard.press("Escape");
  check(await primary.page.locator("#reference").getAttribute("aria-hidden")==="true","guide closes with Escape");
  check(await route.evaluate(e=>document.activeElement===e),"guide returns focus to opener");
  const result=await solveUsingUI(primary.page);
  await primary.page.addInitScript(()=>{Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async text=>{window.__sharedResult=text;}}});});
  await primary.page.evaluate(()=>{Object.defineProperty(navigator,"clipboard",{configurable:true,value:{writeText:async text=>{window.__sharedResult=text;}}});});
  await primary.page.locator("#bShare").click();
  const shared=await primary.page.evaluate(()=>window.__sharedResult);
  check(shared&&shared.includes("No spoilers.")&&!shared.includes("Across")&&!shared.includes("Down"),"shared result omits clues");
  await primary.page.screenshot({path:path.join(shots,"mobile-completion.png"),fullPage:true});
  await primary.context.close();
  for(const [w,h,description] of [[320,650,"Small phone 320"],[768,1024,"Tablet 768"],[1280,800,"Desktop 1280"]]){
   const sample=await open(w,h,"2026-11-12T14:00:00Z","");
   await layout(sample.page,w,description);
   if(w===1280)await sample.page.screenshot({path:path.join(shots,"desktop.png"),fullPage:true});
   await sample.context.close();
  }
  const archived=await open(390,844,"2026-10-09T12:00:00Z","");
  const old=await archived.page.evaluate(()=>({id:P.id,entries:entries.length}));
  check(old.id==="cu-0282"&&old.entries===4,"archived 2026 puzzle untouched");
  await archived.context.close();
  const revised=await open(390,844,"2027-11-21T12:00:00Z","");
  await layout(revised.page,390,"Corrected 7x7 mobile");
  const revisedPuzzle=await revised.page.evaluate(()=>({id:P.id,entries:entries.length,authored:entries.every(x=>!!x.clue&&!!x.difficulty)}));
  check(revisedPuzzle.id==="cu-0282-r2"&&revisedPuzzle.entries===14&&revisedPuzzle.authored,"corrected grid and clues load");
  await solveUsingUI(revised.page);
  await revised.context.close();
  check(!issues.length,issues.join("\n"));
  return {result:"PASS",assertions,primaryDaily:result.id,revision:revisedPuzzle.id,
   checkedLayouts:["320x650","390x844","768x1024","1280x800"],
   notes:"Chromium verifies controls and layout; NVDA, VoiceOver and TalkBack device review remains separate."};
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
main().then(x=>console.log(JSON.stringify(x,null,2)),err=>{console.error(err.stack);process.exitCode=1;});
