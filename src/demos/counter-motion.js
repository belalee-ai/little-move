const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>{const x=clamp(v);return clamp(x*x*x*(x*(x*6-15)+10));};
// Bounded wheel travel avoids undersampling thousands of digit changes per second.
// Each reel starts at zero, makes one or two turns, then reaches its exact digit.
// Intermediate reel faces are presentation states, not measured live totals.
export function rollingCounterAt(target,time){
 const value=Math.trunc(Number.isFinite(target)?target:0),str=Math.abs(value).toLocaleString('en-US'),digits=str.replaceAll(',','').length;
 let digitIndex=0,x=value<0?55:0;
 const slots=[...str].map(c=>{
  const left=x;x+=c===','?31:73;
  if(c===',')return {char:c,x:left,position:0};
  const index=digitIndex++,digit=Number(c),start=.35+index*.075,duration=3.25+index*.055,progress=smooth((time-start)/duration),turns=digit===0?20:10+digit;
  return {char:c,x:left,position:turns*progress};
 });
 const end=.35+(digits-1)*.075+3.25+(digits-1)*.055,progress=smooth((time-.35)/(end-.35));
 return {slots,width:x,negative:value<0,progress,end};
}
