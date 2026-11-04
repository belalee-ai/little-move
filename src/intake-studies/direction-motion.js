import {clamp,mod} from './motion.js';
export const edges=[[0,-1],[1,0],[0,1],[-1,0]];
export function entryEdge(x,y){
 const dx=x-.5,dy=y-.5;
 return Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?2:0);
}
const ease=x=>{const q=clamp(x);return q*q*q*(10+q*(-15+6*q));};
// Every card demonstrates a different entry edge and a different exit edge.
export function directionAuto(t,i,reduced=false){
 const u=mod(t,8)-i*2;
 if(reduced)return {x:0,y:0,shown:true};
 if(u<.18||u>=1.7)return {x:edges[i][0],y:edges[i][1],shown:false};
 if(u<.72){const q=1-ease((u-.18)/.54);return {x:edges[i][0]*q,y:edges[i][1]*q,shown:true};}
 if(u<1.06)return {x:0,y:0,shown:true};
 const q=ease((u-1.06)/.54),out=edges[(i+1)%4];
 return {x:out[0]*q,y:out[1]*q,shown:true};
}
export function overlayRest(edge=0){return {x:edges[edge][0],y:edges[edge][1],vx:0,vy:0,tx:edges[edge][0],ty:edges[edge][1],frame:0,shown:false,inside:false};}
export function overlayAt(c,frame,fps,period,reduced=false){
 if(reduced)return {x:c.tx,y:c.ty,vx:0,vy:0};
 const t=mod(frame-c.frame,period)/fps,w=14,e=Math.exp(-w*t);
 const axis=(x,v,target)=>{const a=x-target,b=v+w*a;return [target+(a+b*t)*e,(b-w*(a+b*t))*e];};
 const [x,vx]=axis(c.x,c.vx,c.tx),[y,vy]=axis(c.y,c.vy,c.ty);
 return {x,y,vx,vy};
}
export function overlayTo(c,edge,inside,frame,fps,period,reduced=false){
 const state=c.shown?overlayAt(c,frame,fps,period,reduced):{x:edges[edge][0],y:edges[edge][1],vx:0,vy:0};
 return {...state,tx:inside?0:edges[edge][0],ty:inside?0:edges[edge][1],frame,shown:true,inside};
}
