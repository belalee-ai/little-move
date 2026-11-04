import assert from 'node:assert/strict';
import fs from 'node:fs';
import {demoById,demoDefaults,demoFrames} from '../src/demos/catalog.js';
import {edges,entryEdge,directionAuto,overlayRest,overlayTo,overlayAt} from '../src/intake-studies/direction-motion.js';
const p=demoDefaults('demo-direction-overlay'),m=demoById(p.demo);
assert.equal(m.code,'294');assert.equal(m.trigger,'指针');assert.equal(m.signature,'pointer-edge-entry-exit-overlay-slide');assert.equal(p.images.length,0);
assert(fs.readFileSync('src/NativeScenes.tsx','utf8').includes("nativeKeys=['direction-overlay'"));
for(const [x,y,want] of [[.5,0,0],[1,.5,1],[.5,1,2],[0,.5,3],[.9,.4,1],[.1,.7,3]])assert.equal(entryEdge(x,y),want);
for(const fps of [25,30,60])for(const speed of [.5,1,2]){
 const n=demoFrames({...p,speed},fps);
 for(let i=0;i<4;i++){
  const poses=Array.from({length:n},(_,f)=>directionAuto(f/fps*speed,i));
  assert(poses.some(s=>s.shown&&s.x===0&&s.y===0),'Must fully cover each card');
  assert(poses.some(s=>s.shown&&Math.hypot(s.x,s.y)>.1&&Math.hypot(s.x,s.y)<.9),'Must have visible in-between states');
  for(let f=1;f<n;f++)if(poses[f].shown&&poses[f-1].shown)assert(Math.hypot(poses[f].x-poses[f-1].x,poses[f].y-poses[f-1].y)<.3,'No visible jumps');
  assert.equal(poses[0].shown,false);assert.equal(poses.at(-1).shown,false);
  assert.deepEqual(directionAuto(1,i,true),directionAuto(7,i,true),'Reduced motion is static');
 }
 for(let edge=0;edge<4;edge++){
  const enter=overlayTo(overlayRest(edge),edge,true,0,fps,n);
  const moving=overlayAt(enter,fps*.1,fps,n),exit=overlayTo(enter,(edge+1)%4,false,fps*.1,fps,n),reversed=overlayAt(exit,fps*.1,fps,n);
  assert.deepEqual(moving,reversed,'Interruption must preserve both position and velocity');
  const end=overlayAt(exit,fps*1.4,fps,n);assert(Math.hypot(end.x-edges[(edge+1)%4][0],end.y-edges[(edge+1)%4][1])<1e-5);
  const wrapped=overlayTo(overlayRest(edge),edge,true,n-3,fps,n),before=overlayAt(wrapped,n-1,fps,n),after=overlayAt(wrapped,0,fps,n);
  const sameAge=overlayTo(overlayRest(edge),edge,true,0,fps,n);
  assert.deepEqual(before,overlayAt(sameAge,2,fps,n));assert.deepEqual(after,overlayAt(sameAge,3,fps,n),'Wrapping the player clock must equal an uninterrupted spring of the same age');
  assert.deepEqual(overlayAt(enter,1,fps,n,true),{x:0,y:0,vx:0,vy:0});
 }
}
console.log('PASS 294: four physical entry/exit edges, full coverage and intermediate motion, exact loop rest, interruption position/velocity continuity, live clock wrap, reduced motion, asset-free registration.');
