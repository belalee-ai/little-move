import {softStep,pathAt} from '../motion-curves.js';
const mod=(n,d)=>((n%d)+d)%d;
const points=[[0,.13,.82],[.65,.30,.52],[1.7,.66,.29],[3.15,.76,.61],[4.6,.40,.73],[6,.35,.39],[7.15,.13,.82],[8,.13,.82]];
export function imagePointerAt(t){const [x,y]=pathAt(points,t,true);return {x,y,gain:1}}
export function revealPhotoState(time){
 const t=mod(time,8),span=8/3,local=mod(t,span),phase=mod(t+.34,8),slot=Math.floor(phase/span),cross=mod(phase,span);
 // The outgoing photograph stays opaque beneath the incoming one. No blank
 // frame and no partially transparent pair revealing the background.
 return {open:softStep(Math.min(local,span-local)/.76),from:cross<.68?mod(slot-1,3):slot,to:slot,blend:cross<.68?softStep(cross/.68):1};
}
export function followPhotoWeights(y){
 const a=softStep((y-(55+370/3)/500+.036)/.072),b=softStep((y-(55+740/3)/500+.036)/.072);
 return [1-a,a-b,b];
}
export function loopFocus(position,index,count=3){const distance=Math.abs(mod(position-index+count/2,count)-count/2);return Math.max(0,1-distance)}
