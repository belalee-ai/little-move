import {Easing} from 'remotion';
import {softStep,hermite,pathAt} from '../motion-curves.js';
import {replacementPointerAt} from './pointer-motion.js';
import {imagePointerAt} from './image-motion.js';
export const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
export const mix=(a,b,p)=>a+(b-a)*p;
export const easeOut=Easing.bezier(.23,1,.32,1);
export const easeMove=Easing.bezier(.77,0,.175,1);
export const smooth=n=>{const p=clamp(n);return p*p*(3-2*p);};
export const cue=(t,start,duration=.7,curve=easeOut)=>curve(clamp((t-start)/duration));
export const mod=(n,d)=>((n%d)+d)%d;
export const rubber=n=>n<0?-.28*(1-Math.exp(n*2.7)):n>2?2+.28*(1-Math.exp((2-n)*2.7)):n;
export function springValue(from,to,velocity,t){const alpha=13,w=Math.sqrt(230-alpha*alpha),d=from-to;return to+Math.exp(-alpha*t)*(d*Math.cos(w*t)+(velocity+alpha*d)/w*Math.sin(w*t));}
export function itemProgress(t,i=0){return cue(t,.65+i*.065,.85,easeMove)*(1-cue(t,5.05+(5-i)*.045,.75,easeMove));}
const pointerPoints=[[0,.13,.82,0],[.65,.30,.52,1],[1.7,.66,.29,1],[3.15,.76,.61,1],[4.6,.40,.73,1],[6.0,.35,.39,1],[7.15,.13,.82,0],[8,.13,.82,0]];
export function pointerAt(t){let i=0;while(i<pointerPoints.length-2&&t>pointerPoints[i+1][0])i++;const a=pointerPoints[i],b=pointerPoints[i+1],p=easeMove(clamp((t-a[0])/(b[0]-a[0])));return {x:mix(a[1],b[1],p),y:mix(a[2],b[2],p),gain:mix(a[3],b[3],p)};}
export function showcasePointerAt(t,key){return replacementPointerAt(t,key)}
export function stageIndex(t){return cue(t,1.3,.68,easeMove)+cue(t,3.5,.68,easeMove)-2*cue(t,6,.78,easeMove);}
export function carouselTurn(t){const span=8/3,step=Math.floor(t/span),local=t-step*span;return step+softStep((local-.95)/1.65);}
export function resolveDemoState(p,frame,fps=60){
 const speed=clamp(p.speed??1,.5,2),t=mod(frame/fps*speed,8),key=p.demo.replace('demo-',''),trajectory=['tilt','magnet'].includes(key)?time=>showcasePointerAt(time,key):key==='drag'?dragPointerAt:key==='parallax'?imagePointerAt:pointerAt,pointer=trajectory(t),previous=trajectory(mod(t-.08,8));
 let input=p.input,gain=input?(input.active?1:0):pointer.gain;
 let vx=(pointer.x-previous.x)/.08,vy=(pointer.y-previous.y)/.08;
 if(input?.transition){const tr=input.transition,seconds=mod(frame-tr.frame,Math.ceil(8*fps/speed))/fps,duration=tr.duration??.28,q=easeOut(clamp(seconds/duration)),from=tr.from;gain=mix(from.active?1:0,input.active?1:0,q);input={...input,...Object.fromEntries(['x','y','progress','index','vx','vy'].map(k=>[k,tr.kind==='snap'&&k==='index'?springValue(from[k]??0,input[k]??0,tr.velocity??0,seconds):mix(from[k]??0,input[k]??0,q)]))};vx=input.vx??0;vy=input.vy??0;}
 const enter=cue(t,.1,.8),exit=1-cue(t,7.1,.7),presence=enter*exit;
 const i=stageIndex(t),index=key==='drag'?dragIndex(t):i;
 return {t,grab:input?gain:(key==='drag'?pointer.gain:0),p:input?clamp(input.progress):itemProgress(t),x:input?clamp(input.x):pointer.x,y:input?clamp(input.y):pointer.y,index:input?(key==='drag'?input.index:clamp(input.index,0,2)):index,gain:input?gain:presence,active:input?input.active:presence>.01,turn:carouselTurn(t),vx:input?(input.vx??0):vx,vy:input?(input.vy??0):vy,press:Math.exp(-Math.pow((t-.65)/.08,2))+Math.exp(-Math.pow((t-5.05)/.08,2))};
}
export const releaseIndex=(index,velocity)=>clamp(Math.round(index+clamp(velocity,-7,7)*.16),0,2);
export function accordionHit(x,index){const weights=[0,1,2].map(i=>Math.pow(Math.max(0,1-Math.abs(index-i)),1.3)),sum=weights.reduce((a,b)=>a+b,0);let left=44;for(let i=0;i<3;i++){left+=110+weights[i]/(sum||1)*358;if(x<=left)return i;left+=10;}return 2;}
export function dragIndex(t){let result=0;for(const [start,from,to]of [[1,0,1],[3.1,1,2],[5.1,2,1],[6.5,1,0]]){if(t<start)break;const release=start+.38,grip=from+(to-from)*.62,velocity=(to-from)*1.4;if(t<release)return hermite(from,grip,0,velocity,(t-start)/.38,.38);if(t<release+.78)return springValue(grip,to,velocity,t-release);result=to;}return result;}
const dragPoints=[[0,.70,.78,0],[.9,.70,.72,1],[1.38,.43,.72,1],[1.8,.34,.84,0],[2.6,.70,.72,0],[3.1,.70,.72,1],[3.48,.43,.72,1],[3.95,.34,.84,0],[4.7,.32,.72,0],[5.1,.32,.72,1],[5.48,.59,.72,1],[5.95,.70,.84,0],[6.15,.32,.72,0],[6.5,.32,.72,1],[6.88,.59,.72,1],[7.4,.70,.84,0],[8,.70,.78,0]];
export function dragPointerAt(t){const [x,y,gain]=pathAt(dragPoints,t,true);return {x,y,gain:clamp(gain)};}
