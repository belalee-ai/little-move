import {clamp,mix,cue,easeMove,smooth} from './motion.js';

const origin=i=>({x:66+i%3*226,y:62+Math.floor(i/3)*185,w:216,h:166});
const tall=i=>{const slot=[3,0,4,1,5,2][i];return {x:146+slot%2*260,y:36+Math.floor(slot/2)*143,w:246,h:128}};
const reordered=i=>origin([2,5,1,4,0,3][i]);
/** Three readable arrangements, connected by staggered arcs and a small settling turn. */
export function gridPose(t,i,manual,strength=1){
 const a=origin(i),b=tall(i),c=reordered(i);
 let from=a,to=b,v=manual;
 if(manual===undefined){
  const stages=[[.45+i*.07,1.12,a,b],[3.1+(5-i)*.06,1.1,b,c],[6.05+i*.055,1.15,c,a]];
  v=0;
  for(const [start,duration,f,d]of stages){if(t<start)break;from=f;to=d;v=cue(t,start,duration,easeMove);}
 }
 const travel=v===0||v===1?0:Math.sin(Math.PI*v),turn=Math.sin(Math.PI*2*v)*travel;
 return {x:mix(from.x,to.x,v)+travel*(i%2?12:-12)*strength,y:mix(from.y,to.y,v)-travel*Math.min((32+i%3*10)*strength,Math.min(from.y,to.y)-18),w:mix(from.w,to.w,v),h:mix(from.h,to.h,v),angle:travel?turn*(i%2?5:-5)*strength:0,lift:travel};
}

// A sampled trend rather than a fixed decorative path. The head and percentage
// use the same interpolated observation, so the displayed value follows the line.
const trend=[0,.16,.24,.19,.49,.42,.76,.71,1];
const observation=u=>{const at=clamp(u)*(trend.length-1),i=Math.min(trend.length-2,Math.floor(at)),q=at-i,s=q*q*(3-2*q);return mix(trend[i],trend[i+1],s)};
export function bentoGrowth(t,manual){
 const progress=manual===undefined?cue(t,.15,3.8,smooth)*(1-cue(t,6.05,1.5,smooth)):clamp(manual);
 const amount=observation(progress),count=12*progress,percent=84*amount;
 const steps=Math.max(1,Math.ceil(progress*96)),points=Array.from({length:steps+1},(_,i)=>{const u=progress*i/steps;return {x:14+u*332,y:190-observation(u)*150}});
 const d=points.map((pt,i)=>(i?'L':'M')+pt.x.toFixed(3)+' '+pt.y.toFixed(3)).join(' '),head=points.at(-1)??{x:14,y:190};
 return {progress,count,percent,d,area:d+` L${head.x} 205 L14 205 Z`,head};
}
export const magnetPress=t=>cue(t,3.65,.24)*(1-cue(t,4.8,.32));
