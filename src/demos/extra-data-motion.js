import {clamp,cue} from './motion.js';
export const extraDataProgress=t=>cue(t,.65,3.8);
export const bubbleRadius=(value,max,progress=1)=>Math.sqrt(Math.max(0,value)/Math.max(1,max))*72*Math.sqrt(clamp(progress));
export const gaugePoint=(percent,r=163)=>{const angle=Math.PI+clamp(percent/100)*Math.PI;return {x:400+Math.cos(angle)*r,y:334+Math.sin(angle)*r};};
export function treeRects(values,progress=1){
 const total=values.reduce((s,v)=>s+v,0),weights=values.map(v=>(1-progress)/values.length+progress*(total?v/total:1/values.length)),rects=[];
 function split(ids,x,y,w,h,depth){if(ids.length===1){rects.push({i:ids[0],x,y,w,h,share:weights[ids[0]]});return;}const pivot=Math.ceil(ids.length/2),left=ids.slice(0,pivot),right=ids.slice(pivot),sum=ids.reduce((s,i)=>s+weights[i],0),ratio=sum?left.reduce((s,i)=>s+weights[i],0)/sum:.5;
  if(depth%2===0){split(left,x,y,w*ratio,h,depth+1);split(right,x+w*ratio,y,w*(1-ratio),h,depth+1);}
  else{split(left,x,y,w,h*ratio,depth+1);split(right,x,y+h*ratio,w,h*(1-ratio),depth+1);}
 }
 split(values.map((_,i)=>i),76,135,648,278,0);return rects;
}
/** @param {number[]} values */
export const areaBands=values=>[0,.44,.76,1].map(f=>values.map(v=>v*f));
