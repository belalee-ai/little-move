import assert from 'node:assert/strict';
import {ballState,stickerFlight,foldProgress,foldShade,ribbonGeometry,ribbonRuns,stickerBeats} from '../src/studies/object-motion.js';
import {imagePointerAt,revealPhotoState,followPhotoWeights} from '../src/demos/image-motion.js';
import {dragIndex,carouselTurn} from '../src/demos/motion.js';
const eps=.000001;
const derivative=(f,t)=>(f(t+eps)-f(t-eps))/(eps*2);
const joins=(f,times,tolerance=.15)=>{for(const t of times){assert(Math.abs(f(t-eps)-f(t+eps))<.02,'position jump at '+t);assert(Math.abs(derivative(f,t-eps)-derivative(f,t+eps))<tolerance,'velocity jump at '+t)}};
for(const axis of ['x','y','squash'])joins(t=>ballState(t)[axis],stickerBeats);
joins(dragIndex,[1,1.38,3.1,3.48,5.1,5.48,6.5,6.88],.01);
joins(foldProgress,[.55,1.75,2.85,4.35],.001);
joins(carouselTurn,[.95,2.6,8/3,8/3+.95,16/3],.001);
for(const axis of ['x','y']){
 joins(t=>imagePointerAt(t)[axis],[.65,1.7,3.15,4.6,6,7.15,8],.001);
 assert(Math.abs(derivative(t=>imagePointerAt(t)[axis],0)-derivative(t=>imagePointerAt(t)[axis],8))<1e-7);
}
const targets=[['HEY!',155,120,76,-.13],['WAIT',648,140,68,.1],['YES',150,322,77,-.1],["LET'S GO",516,370,86,.035]];
for(let i=0;i<4;i++)for(const key of ['x','y','alpha','scale','angle'])joins(t=>stickerFlight(t,i,targets[i])[key],[stickerBeats[i],stickerBeats[i]+.54,4.65+i*.07,5.5+i*.07],.15);
for(let frame=0;frame<=480;frame++){
 const t=frame/60,state=revealPhotoState(t),weights=followPhotoWeights(imagePointerAt(t).y);
 assert(state.open>=0&&state.open<=1&&state.blend>=0&&state.blend<=1);
 assert([state.from,state.to].every(i=>i>=0&&i<3));
 assert(Math.abs(weights.reduce((sum,w)=>sum+w,0)-1)<1e-8&&weights.every(w=>w>=0&&w<=1));
 if(t<=6){
  const points=ribbonGeometry(t),ball=ballState(t);assert(points.every(p=>Object.values(p).every(Number.isFinite)));
  for(const front of [false,true])for(const run of ribbonRuns(points,front))assert(run.every(p=>front?p.z>=-1e-9:p.z<=1e-9));
  assert(ball.x>45&&ball.x<755&&ball.y>45&&ball.y<435,'ball cropped');
  for(let i=0;i<4;i++){const f=stickerFlight(t,i,targets[i]);assert(f.alpha>=0&&f.alpha<=1&&Object.values(f).every(Number.isFinite))}
  if(frame){const previous=foldShade(foldProgress((frame-1)/60)).match(/\d+/g).map(Number),current=foldShade(foldProgress(t)).match(/\d+/g).map(Number);assert(current.every((v,i)=>Math.abs(v-previous[i])<=1),'paper lighting flashes')}
 }
}
assert.deepEqual(revealPhotoState(0),revealPhotoState(8));
for(let i=0;i<4;i++)assert.equal(stickerFlight(6,i,targets[i]).alpha,0);
for(const key of ['x','y'])assert(Math.abs(ballState(0)[key]-ballState(6)[key])<1e-8);
for(let i=0;i<181;i++)for(const key of ['x','y','z','half'])assert(Math.abs(ribbonGeometry(0)[i][key]-ribbonGeometry(6)[i][key])<1e-7);
console.log('PASS: continuous position/velocity at ball, sticker, drag and photo-path joins; continuous paper lighting; exact ribbon crossings; mounted photo crossfades; and matching loop boundaries.');
