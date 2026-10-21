import assert from 'node:assert/strict';
import {rollingCounterAt} from '../src/demos/counter-motion.js';
for(const target of [0,9,10,999,1000,38640,-38640,999999999]){
 const first=rollingCounterAt(target,0),last=rollingCounterAt(target,5.2);
 assert(first.slots.every(s=>s.position===0));
 assert.equal(last.slots.map(s=>s.char===','?',':String(Math.round(s.position)%10)).join(''),Math.abs(target).toLocaleString('en-US'));
 assert.equal(last.progress,1);assert.equal(last.negative,target<0);
 for(const fps of [25,30,60]){
  let previous=first;
  for(let frame=1;frame<=fps*6;frame++){
   const state=rollingCounterAt(target,frame/fps);
   assert.equal(state.width,first.width,'no width jump at thousands / digit transitions');
   assert(state.progress>=previous.progress);
   state.slots.forEach((slot,i)=>{assert(slot.position>=previous.slots[i].position);assert(slot.position-previous.slots[i].position<.48,'wheel travel must be bounded at low fps');});
   previous=state;
  }
 }
 // Both acceleration and settling have zero velocity at their boundary.
 const h=1e-4;
 assert(rollingCounterAt(target,.35+h).slots[0].position<1e-8);
 const lastDigit=last.slots.at(-1),end=last.end;
 assert(Math.abs(rollingCounterAt(target,end-h).slots.at(-1).position-lastDigit.position)<1e-8);
}
console.log('PASS: continuous reel travel, fixed widths, bounded speed, exact target digits, thousands and negative sign, acceleration and settling at 25/30/60fps.');
