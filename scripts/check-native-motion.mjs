import assert from 'node:assert/strict';
import {bentoGrowth,gridPose} from '../src/demos/native-motion.js';
import {demoDefaults,demoState,demoFrames} from '../src/demos/catalog.js';
const close=(a,b)=>Math.abs(a-b)<1e-7;
const samples=new Set();
for(const fps of [25,30,60])for(let f=0;f<=8*fps;f++){
 const t=f/fps,g=bentoGrowth(t);
 assert(g.progress>=0&&g.progress<=1&&g.count>=0&&g.count<=12&&g.percent>=0&&g.percent<=84);
 assert(close(g.head.y,190-g.percent/84*150),'chart head must match its percentage');
 assert(close(g.head.x,14+g.progress*332),'chart must grow along the data');
 samples.add(Math.round(g.count));
 for(let i=0;i<6;i++)for(const strength of [.5,1,1.5]){
  const p=gridPose(t,i,undefined,strength);
  assert(Object.values(p).every(Number.isFinite));
  assert(p.x>=18&&p.y>=18&&p.x+p.w<=782&&p.y+p.h<=482,'reordering must stay inside the stage');
 }
}
assert(samples.size===13,'counter must visibly pass through all intermediate values');
assert(bentoGrowth(1).percent>8&&bentoGrowth(2.5).percent>bentoGrowth(1).percent,'data growth must be visible early');
assert(bentoGrowth(4).count===12&&bentoGrowth(4).percent===84);
assert(bentoGrowth(0).progress===0&&bentoGrowth(8).progress===0);
for(let i=0;i<6;i++)assert.deepEqual(gridPose(0,i),gridPose(8,i));
const arrangements=[0,2.3,5].map(t=>[...Array(6)].map((_,i)=>{const p=gridPose(t,i);return `${p.x},${p.y}`}));
assert(arrangements.every(a=>new Set(a).size===6),'settled cards must occupy distinct cells');
assert.notDeepEqual(arrangements[0],arrangements[1]);assert.notDeepEqual(arrangements[0],arrangements[2]);
for(const key of ['tilt','magnet'])for(const fps of [25,30,60])for(const speed of [.5,1,2]){
 const p={...demoDefaults('demo-'+key),speed},states=Array.from({length:demoFrames(p,fps)},(_,f)=>demoState(p,f,fps));
 assert(Math.max(...states.map(s=>s.x))-Math.min(...states.map(s=>s.x))>(key==='tilt'?.6:.45),'automatic pointer needs a visible sweep');
}
console.log('PASS: intermediate counter values, chart/value synchronization, early growth, three distinct grid arrangements, safe bounds, exact loop ends, and visible pointer trajectories at 25/30/60fps.');
