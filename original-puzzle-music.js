/* Cryptic Underground: unobtrusive original music and safe route back to Games Night. */
(() => {
  'use strict';
  const host=document.querySelector("header .svcstrip");
  if(!host||document.getElementById('gnReturn'))return;
  const style=document.createElement('style');
  style.textContent="\n.gn-nav{display:inline-flex;gap:4px;align-items:center;flex:0 0 auto;white-space:nowrap}\n.gn-action{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-width:40px;min-height:40px;padding:5px 8px;border:1px solid currentColor;border-radius:8px;background:transparent;color:inherit;font:600 12px/1.1 system-ui,sans-serif;text-decoration:none;cursor:pointer;letter-spacing:0;opacity:.78}\n.gn-action:hover{opacity:1}\n.gn-action:focus-visible{outline:3px solid currentColor;outline-offset:2px}\n.gn-action[aria-pressed=true]{opacity:1}\n@media(max-width:600px){.gn-action{padding:5px;min-width:40px;min-height:40px}.gn-wide{display:none}}\n@media(max-width:425px){.gn-nav{gap:2px}.gn-action{min-width:35px;min-height:42px}}\n\nheader .svcstrip{flex-wrap:wrap;white-space:normal}\n@media(max-height:600px){header .gn-action{min-height:33px;font-size:12px}}\n";
  document.head.appendChild(style);
  const nav=document.createElement('span');
  nav.className='gn-nav';
  nav.innerHTML='<a id="gnReturn" class="gn-action" href="https://games-night-wfmz.onrender.com/" aria-label="Back to Games Night Lobby" title="Back to Games Night Lobby">← <span class="gn-wide">Lobby</span></a><button class="gn-action" id="gnMusic" type="button" aria-pressed="false" aria-label="Play Cryptic Underground music" title="Play Cryptic Underground music">♫ <span class="gn-wide">Music</span></button>';
  host.appendChild(nav);
  const musicBtn=nav.querySelector('#gnMusic');
  const track=new Audio("https://cdn.creativeclaw.co/u/f3e7a3b1/audio/ec0461d2-d33b-4bb8-ae6e-4c7acdd58570.mp3");
  track.loop=true;
  track.preload='none';
  track.volume=0.095;
  let wanted=false;
  function redraw(){
    musicBtn.setAttribute('aria-pressed',String(wanted));
    musicBtn.setAttribute('aria-label',wanted?'Mute Cryptic Underground music':'Play Cryptic Underground music');
    musicBtn.title=wanted?'Mute Cryptic Underground music':'Play Cryptic Underground music';
  }
  musicBtn.addEventListener('click',()=>{
    if(wanted){wanted=false;track.pause();redraw();return;}
    track.play().then(()=>{wanted=true;redraw()}).catch(()=>{wanted=false;redraw();musicBtn.title='Audio unavailable; please try again';});
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)track.pause();
    else if(wanted)track.play().catch(()=>{wanted=false;redraw()});
  });
  nav.querySelector('#gnReturn').addEventListener('click',()=>track.pause());
  // Cryptic Underground sizes its board around the actual available height.
  requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
})();