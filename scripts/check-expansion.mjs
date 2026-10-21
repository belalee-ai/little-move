import assert from 'node:assert/strict';
import {DEMOS,demoDefaults,demoState} from '../src/demos/catalog.js';
import {FEEDBACK_KEYS,EXTRA_DATA_DEFAULTS} from '../src/demos/expansion-catalog.js';
import {feedbackAt} from '../src/demos/feedback-motion.js';
import {extraDataProgress,bubbleRadius,gaugePoint,treeRects,areaBands} from '../src/demos/extra-data-motion.js';
import {dataValues,validateValues} from '../src/demos/data-motion.js';
const added=DEMOS.filter(d=>Number(d.code)>=81&&Number(d.code)<=100);
assert.equal(added.length,20);assert.equal(added.filter(d=>d.collection==='交互').length,10);assert.equal(added.filter(d=>d.collection==='数据').length,10);
for(const d of added){assert(d.prompt&&d.aliases.includes('新增'));assert.deepEqual(demoDefaults(d.id).images,[]);}
// Autoplay must actually move through materially different states and return.
for(const key of FEEDBACK_KEYS){
 const a=feedbackAt(0,key),b=feedbackAt(7.999,key);
 assert(Math.abs(a.progress-b.progress)<.002&&Math.abs(a.index-b.index)<.002,key+' does not close its loop');
 const poses=Array.from({length:80},(_,i)=>feedbackAt(i/10,key));
 assert(Math.max(...poses.map(p=>p.progress))-Math.min(...poses.map(p=>p.progress))>.65,key+' lacks visible change');
 for(const fps of [25,30,60])for(const speed of [.5,1,2]){
  const p={...demoDefaults('demo-'+key),speed},s=demoState(p,Math.round(fps/speed),fps);
  assert(Number.isFinite(feedbackAt(s.t,key).progress));
 }
}
// Data geometry: area, radius, needle angle and partitions must reconcile.
assert.equal(extraDataProgress(0),0);assert.equal(extraDataProgress(5.2),1);
assert(Math.abs(bubbleRadius(25,100)**2/bubbleRadius(100,100)**2-.25)<1e-9);
assert.deepEqual(gaugePoint(0,100),{x:300,y:334});
assert(Math.abs(gaugePoint(50,100).x-400)<1e-8&&Math.abs(gaugePoint(50,100).y-234)<1e-8);
for(const values of [[40,28,20,12],[0,100,0],[3,4,5,6,7,8,9]])for(const q of [0,.2,.5,1]){
 const rects=treeRects(values,q),total=648*278,sum=values.reduce((s,v)=>s+v,0);
 assert(Math.abs(rects.reduce((s,r)=>s+r.w*r.h,0)-total)<1e-6);
 for(const r of rects){assert(r.x>=76-1e-8&&r.y>=135-1e-8&&r.x+r.w<=724+1e-8&&r.y+r.h<=413+1e-8);if(q===1)assert(Math.abs(r.w*r.h/total-values[r.i]/sum)<1e-9);}
}
assert.deepEqual(areaBands([10,20]).at(-1),[10,20]);
for(const kind of Object.keys(EXTRA_DATA_DEFAULTS)){const p=demoDefaults('demo-'+kind);assert.equal(validateValues(kind,dataValues(p)),'');}
assert(validateValues('bubble',[1,2,3,4,5,6]));assert(validateValues('gauge',[101]));assert(validateValues('multiring',[10,110]));assert(validateValues('radar',[1,2]));assert(validateValues('area',[1]));assert(validateValues('treemap',[0,0]));assert(validateValues('flipcount',[1.2]));assert.equal(validateValues('diverging',[-8,4]),'');
console.log('PASS: 20 additions, automatic control motion and loop closure, frame-rate sampling, bubble area ratios, gauge angles, treemap conservation, area totals and chart-specific input boundaries.');
