import {softStep,pathAt} from '../motion-curves.js';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const cue=(t,start,duration)=>softStep((t-start)/duration);
export const slideProgress=t=>cue(t,.95,1.95)*(1-cue(t,5.25,1.15));
export const slideRelease=value=>value>=.9?1:0;
export const radialProgress=t=>clamp(cue(t,.65,.85)-cue(t,2.85,.75)+cue(t,4.25,.85)-cue(t,6.55,.85));
const dockPoints=[[0,.13,.58],[1,.24,.58],[2.2,.40,.58],[3.45,.68,.58],[4.5,.87,.58],[5.7,.59,.58],[6.6,.25,.58],[8,.13,.58]];
export function replacementPointerAt(t,key){if(key==='magnet')return {x:(210+380*slideProgress(t))/800,y:.51,gain:1};const [x,y]=pathAt(dockPoints,t,true);return {x,y,gain:1};}
export function dockItems(x,gain,strength=1){
 const items=Array.from({length:5},(_,i)=>{const base=252+i*74,focus=Math.exp(-Math.pow((base-x*800)/90,2))*gain;return {base,y:280-focus*32*strength,size:58+focus*32*strength,focus,x:0};});
 const total=items.reduce((sum,item)=>sum+item.size,0)+4*16;let cursor=400-total/2;
 return items.map(item=>{const next={...item,x:cursor+item.size/2};cursor+=item.size+16;return next;});
}
export function radialItem(progress,index){const q=cue(progress,index*.055,.76),angle=-Math.PI/2+index*Math.PI*2/5+(1-q)*.32,radius=q*133;return {x:400+Math.cos(angle)*radius,y:255+Math.sin(angle)*radius,q};}
