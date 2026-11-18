'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');

test('downloaded index.html includes fullscreen and music controls without JavaScript dependencies',()=>{
 assert.equal([...html.matchAll(/<script\b[^>]*\bsrc\s*=/gi)].length,0,
  'Every browser script must be embedded to preserve single-file offline operation');
 assert.ok(html.includes('collection-fullscreen-control'));
 assert.ok(html.includes('Cryptic Underground music'));
 assert.ok(html.includes('gnReturn'),'Games Night navigation must remain available');
 for(const name of ['collection-fullscreen.js','original-puzzle-music.js']){
  const original=fs.readFileSync(path.join(root,name),'utf8').trim();
  assert.ok(html.includes(original),'Embedded '+name+' must match approved source exactly');
 }
});
test('all embedded controller scripts parse',()=>{
 const all=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
 assert.ok(all.length>=3,'expected game, fullscreen and music controller scripts');
 for(let i=0;i<all.length;i++){
  if(/type\s*=\s*["'](?:text\/plain|application\/json)["']/i.test(all[i][1]))continue;
  new vm.Script(all[i][2],{filename:'index.html inline script '+i});
 }
});
