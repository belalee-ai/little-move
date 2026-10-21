import assert from 'node:assert/strict';
import {orbAutoWeights,orbModel} from '../src/voice-ui/orb-motion.js';
import {settle} from '../src/voice-ui/motion.js';
for(const fps of [25,30,60])for(const speed of [.5,1,2])for(let frame=0;frame<8*fps/speed;frame++){
 const t=frame/fps*speed,w=orbAutoWeights(t),a=orbModel(t,w,1.5);
 assert(w.every(v=>v>=0&&v<=1));assert(w.reduce((s,v)=>s+v,0)<=1.000001);
 assert(a.points.every(p=>Number.isFinite(p.x)&&p.x>260&&p.x<540&&Number.isFinite(p.y)&&p.y>80&&p.y<340));
 assert(a.bars.every(v=>Number.isFinite(v)&&v>=4&&v<70));
 const b=orbModel((frame*2)/(fps*2)*speed,w,1.5);assert.deepEqual(a,b,'Same timestamp must give same geometry at every fps');
}
assert(orbAutoWeights(1.4)[0]>.99);assert(orbAutoWeights(3.1)[1]>.99);assert(orbAutoWeights(4.5)[2]>.99);assert(orbAutoWeights(7.2).every(v=>v===0));
assert(orbModel(4.48,[0,0,1]).radius>orbModel(4.48,[0,1,0]).radius+8,'Speaking must read differently from thinking');
assert.notDeepEqual(orbModel(4,[0,0,1]).bars,orbModel(4.2,[0,0,1]).bars,'Speaking waveform actually changes');
assert.notDeepEqual(orbModel(3,[0,1,0]).orbit,orbModel(3.2,[0,1,0]).orbit,'Thinking dots actually travel');
for(const w of [[0,0,0],[1,0,0],[0,1,0],[0,0,1]])assert.deepEqual(orbModel(1,w,1,true),orbModel(5,w,1,true),'Reduced-motion geometry must stay still');
for(let t=0;t<.7;t+=1/60){const weights=[settle(1,0,0,t),0,settle(0,1,0,t)];assert.equal(orbModel(t,weights).think,0,'Direct listening-to-speaking must not show thinking');}
for(const boundary of [.35,2.5,3.5,6.5,7]){const a=orbModel(boundary-.00001,orbAutoWeights(boundary-.00001)),b=orbModel(boundary+.00001,orbAutoWeights(boundary+.00001));assert(Math.abs(a.radius-b.radius)<.01,'No radius jump at a state boundary');}
console.log('PASS: assistant state contrast, animated speech/thinking, continuous transitions, no phantom states, safe bounds, fps/speed parity and reduced motion.');
