import assert from 'node:assert/strict';
import {portraitPose,deformPortraitPoint,portraitContact,PORTRAIT_CONTACTS} from '../src/studies/portrait-rig.js';
const points=[...Object.values(PORTRAIT_CONTACTS),[792,456],[1056,432],[312,752],[312,864],[216,984],[96,1080],[480,624],[576,912],[384,1440]];
for(const key of ['mask','stickers','fold']){
 for(const gain of [0,1,1.2]){
  let maxStep=0,minArea=Infinity,handTravel=0;
  const rest=deformPortraitPoint(...PORTRAIT_CONTACTS.raised,portraitPose(key,0,gain));
  for(let frame=0;frame<=720;frame++){
   const t=frame/120,pose=portraitPose(key,t,gain),prev=portraitPose(key,Math.max(0,t-1/120),gain);
   for(const [x,y] of points){
    const a=deformPortraitPoint(x,y,pose),b=deformPortraitPoint(x+4,y,pose),c=deformPortraitPoint(x,y+4,pose),before=deformPortraitPoint(x,y,prev);
    assert(a.every(Number.isFinite));
    minArea=Math.min(minArea,((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/16);
    maxStep=Math.max(maxStep,Math.hypot(a[0]-before[0],a[1]-before[1]));
   }
   const hand=deformPortraitPoint(...PORTRAIT_CONTACTS.raised,pose);handTravel=Math.max(handTravel,Math.hypot(hand[0]-rest[0],hand[1]-rest[1]));
   if(gain===0)for(const [x,y] of points)assert.deepEqual(deformPortraitPoint(x,y,pose),[x,y]);
  }
  assert(minArea>.15,key+' folded or collapsed a visible joint');
  assert(maxStep<13,key+' has a discontinuous pose');
  if(gain>0)assert(handTravel>20,key+' has no independent hand action');
  for(const [x,y] of points){const a=deformPortraitPoint(x,y,portraitPose(key,0,gain)),b=deformPortraitPoint(x,y,portraitPose(key,6,gain));assert(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-6,key+' loop jumps')}
 }
 const placement={x:408,bottom:486,height:448},contact=portraitContact('raised',portraitPose(key,1.8),placement);
 assert(contact.x>0&&contact.x<800&&contact.y>0&&contact.y<480,'hand contact escaped frame');
}
console.log('PASS: three frame-driven photo puppets, independent hand movement, fixed-pose mode, visible-joint orientation, continuous movement and matching loop poses.');
