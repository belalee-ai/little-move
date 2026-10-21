import assert from 'node:assert/strict';
import {penAt,penSamples,penLength,sandAt,histogramAt,clipFold} from '../src/demos/original-quality-motion.js';
import {settleSample} from '../src/voice-ui/motion.js';
import {DEMOS} from '../src/demos/catalog.js';
assert.equal(new Set(DEMOS.map(d=>d.code)).size,DEMOS.length);
// Arc-length traversal stays on the rendered polyline and has bounded speed.
for(let i=1;i<=1000;i++){const a=penAt((i-1)/1000),b=penAt(i/1000);assert(Math.hypot(a.x-b.x,a.y-b.y)<=penLength/1000+.001);}
assert.deepEqual(penAt(0),penSamples[0]);assert.equal(penAt(1).x,700);
// Every grain is tracked through the neck and both 4-second joins are continuous.
for(let i=0;i<72;i++){for(let f=0;f<=480;f++){const p=sandAt(f/60,i);assert(Object.values(p).filter(v=>typeof v==='number').every(Number.isFinite));assert(p.x>=340&&p.x<=460&&p.y>=110&&p.y<=400);}for(const t of [4,8]){const a=sandAt(t-1e-7,i),b=sandAt(t+1e-7,i);assert(Math.hypot(a.x-b.x,a.y-b.y)<1e-4);}}
for(const values of [[3,8,15,22,18,11,6,2],[0,0],[1000000,1,20]]){let old=values.map(()=>0);for(let f=0;f<=480;f++){const bins=histogramAt(values,f/60);bins.forEach((bin,i)=>{assert(bin.count>=old[i]-1e-6&&bin.count<=values[i]+1e-6);old[i]=bin.count;});}old.forEach((n,i)=>assert(Math.abs(n-values[i])<1e-6));}
// Retarget an in-flight control: both position and velocity are preserved.
for(const time of [.03,.08,.15,.28]){const a={from:0,to:1,velocity:0,time:0,direct:false},at=settleSample(a,time),b={from:at.value,to:0,velocity:at.velocity,time,direct:false},next=settleSample(b,time);assert(Math.abs(next.value-at.value)<1e-9);assert(Math.abs(next.velocity-at.velocity)<1e-9);assert.deepEqual(settleSample(b,time,true),{value:0,velocity:0});}
const rect=[[0,0],[340,0],[340,260],[0,260]],area=ps=>Math.abs(ps.reduce((s,p,i)=>{const b=ps[(i+1)%ps.length];return s+p[0]*b[1]-b[0]*p[1];},0))/2;
for(let cut=1;cut<600;cut++){const front=clipFold(rect,cut),back=clipFold(rect,cut,false);assert(Math.abs(area(front)+area(back)-340*260)<1e-6);}
console.log('PASS: original IDs, arc-length pen tracking, continuous sand transfer, conserved histogram mass, interruption velocity, reduced motion, and complementary paper folds.');
