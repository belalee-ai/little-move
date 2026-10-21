import assert from 'node:assert/strict';
import {criticalSample,gestureAt,rankRoute,polyMorph,staged,unrollStrip} from '../src/coverage/motion.js';
// Position and velocity are conserved when a moving interaction is reversed.
let state={from:0,to:1,velocity:0,time:0,direct:false};
for(const clock of [.04,.09,.17,.33]){
 const old=criticalSample(state,clock),next={from:old.value,to:state.to===1?0:1,velocity:old.velocity,time:clock,direct:false},atSwitch=criticalSample(next,clock);
 assert(Math.abs(old.value-atSwitch.value)<1e-12);assert(Math.abs(old.velocity-atSwitch.velocity)<1e-12);state=next;
}
assert.equal(criticalSample({from:.4,to:.4,velocity:3,time:0,direct:true},.2).velocity,0);
assert.deepEqual(criticalSample(state,.34,true),{value:state.to,velocity:0});
for(const mode of ['freedrag','dropbasket','brush','scrubtrack','rotary','stretch'])for(const fps of[25,30,60]){
 for(let frame=0;frame<fps*8;frame++){const a=gestureAt(mode,frame/fps);assert(Number.isFinite(a.x)&&Number.isFinite(a.y));assert(a.x>=-.05&&a.x<=1.05);}
}
assert(gestureAt('dropbasket',4).complete);assert(!gestureAt('dropbasket',1).complete);assert(Math.abs(gestureAt('freedrag',5).x-.5)<.001);assert(gestureAt('freedrag',2).held&&!gestureAt('freedrag',4).held);
// Every ranking identity reaches its own destination instead of replacing labels in place.
for(let i=0;i<6;i++){const end=rankRoute(i,5-i,1);assert.equal(end.x,620);assert.equal(end.y,100+(5-i)*58);}
const a=[[1,2],[3,4],[5,6]],b=[[7,8],[9,10],[11,12]];assert.equal(polyMorph(a,b,0),'M1 2 L3 4 L5 6Z');assert.equal(polyMorph(a,b,1),'M7 8 L9 10 L11 12Z');
for(const t of [.6,1.3,5.5,6.1])assert(Number.isFinite(staged(t)));
console.log('PASS: velocity-preserving reversal; reduced state feedback; six distinct gesture sequences; rank identity routes; continuous geometric morph endpoints.');

for(const k of[0,.1,.3,.5,.8,.99999,1])for(const xy of unrollStrip(.2,.5,k))assert(xy.every(Number.isFinite));
const flat=unrollStrip(0,1,1);assert.deepEqual(flat[0],[115,281]);assert.deepEqual(flat[24],[685,281]);assert.deepEqual(flat.at(-1),[115,209]);
