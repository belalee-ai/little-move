import {useRef,useState} from 'react';
import {criticalSample} from './motion.js';
// Retarget from sampled position AND velocity; only the new coverage scenes use this hook.
export function useContinuousValue(initial:number,clock:number,reduced=false){
 const ref=useRef({from:initial,to:initial,velocity:0,time:clock,direct:true}),[,refresh]=useState(0);
 const sample=()=>criticalSample(ref.current,clock,reduced);
 const set=(to:number,direct=false)=>{const previous=ref.current,current=sample(),dt=Math.max(1/60,clock-previous.time),velocity=direct?Math.max(-4,Math.min(4,(to-current.value)/dt)):current.velocity;ref.current={from:direct?to:current.value,to,velocity,time:clock,direct};refresh(n=>n+1);};
 return [sample().value,set,ref.current.to] as const;
}
