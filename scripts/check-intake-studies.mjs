import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {autoScrollAt,autoMagnetAt,scrollVisual,springAt,retarget,rest,magnetPose} from '../src/intake-studies/motion.js';
import {demoDefaults,demoById,demoUsesImages,demoFrames} from '../src/demos/catalog.js';
const assets=[];
for(const [id,code,n]of [['demo-scroll-grain','292',3],['demo-magnetic-grid','293',6]]){
 assert.equal(demoById(id).code,code);assert(demoUsesImages(id));
 const p=demoDefaults(id);assert.equal(p.images.length,n);
 for(const asset of p.images){assert(fs.existsSync('public'+asset));assets.push(crypto.createHash('sha256').update(fs.readFileSync('public'+asset)).digest('hex'));}
 for(const fps of[25,30,60])for(const speed of[.5,1,2])for(let frame=0;frame<demoFrames({...p,speed},fps);frame++){
  const t=frame/fps*speed,state=autoScrollAt(t),visual=scrollVisual(state,1.5);
  assert(state.position>=0&&state.position<=1);assert(Math.abs(visual.bow)<=76);assert(visual.grain>=0&&visual.grain<=.16);
  const m=autoMagnetAt(t);
  for(let i=0;i<6;i++){const pose=magnetPose(i,m,1.5);assert(Object.values(pose).every(Number.isFinite));assert(pose.opacity>=0&&pose.opacity<=1);assert(pose.w>=186&&pose.w<=568);assert(pose.h>=148&&pose.h<=356);}
 }
}
assert.equal(new Set(assets).size,9);
assert.deepEqual(autoScrollAt(0),autoScrollAt(8));assert.deepEqual(autoMagnetAt(0),autoMagnetAt(8));
assert(scrollVisual(autoScrollAt(1.3)).bow>25);assert(scrollVisual(autoScrollAt(5.5)).bow<-25);
assert.equal(scrollVisual(autoScrollAt(2.5)).bow,0);assert.equal(scrollVisual(autoScrollAt(1.3),1,true).grain,0);
for(const f of[3,9,17,28,70]){
 const command={from:.15,target:.9,velocity:.2,frame:0},before=springAt(command,f,60,480),next=retarget(command,.05,f,60,480),after=springAt(next,f,60,480);
 assert(Math.abs(before.position-after.position)<1e-12);assert(Math.abs(before.velocity-after.velocity)<1e-12);
}
assert.deepEqual(springAt(rest(.7),470,60,480),{position:.7,velocity:0});
const open=autoMagnetAt(4);assert.equal(open.open,1);const selected=magnetPose(2,open);assert.deepEqual([selected.x,selected.y,selected.w,selected.h],[116,64,568,356]);
for(const i of[0,1,3,4,5])assert.equal(magnetPose(i,open).opacity,0);
assert.equal(magnetPose(2,{...autoMagnetAt(1),gain:1},1,true).depth,0);
console.log('PASS: 292/293 registration, nine unique original assets, frame/speed ranges, signed scroll curvature, settling, velocity-preserving reversals, complete grid withdrawal, exact shared-image endpoints and reduced motion.');
