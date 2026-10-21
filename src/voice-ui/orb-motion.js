import {clamp,cue,levelAt} from './motion.js';
/** State weights, not ordinal interpolation: listening -> speaking never passes through thinking. */
export function orbAutoWeights(t){
 return [cue(t,.35,.45)*(1-cue(t,2.5,.34)),cue(t,2.5,.34)*(1-cue(t,3.5,.4)),cue(t,3.5,.4)*(1-cue(t,6.5,.5))];
}
export function orbModel(time,weights,strength=1,reduced=false){
 const t=reduced?0:time,[listen,think,speak]=weights.map(v=>clamp(v)),idle=clamp(1-listen-think-speak);
 const incoming=reduced?.35:levelAt(t,strength),outgoing=reduced?.5:.12+.88*levelAt(t*1.15+.35,strength);
 const radius=59+listen*(9+incoming*7)+think*7+speak*(17+outgoing*10)+idle*Math.sin(t*1.15)*1.3;
 const points=Array.from({length:96},(_,i)=>{const angle=i/96*Math.PI*2;
  const ripple=reduced?0:listen*(1+incoming*2.5)*Math.sin(angle*2+t*1.4)+think*2.3*Math.sin(angle*3-t*1.25)+speak*(2+outgoing*4)*Math.sin(angle*3-t*2.1);
  const r=radius+ripple;return {x:400+Math.cos(angle)*r,y:214+Math.sin(angle)*r};
 });
 const orbit=Array.from({length:3},(_,i)=>{const theta=t*1.8+i*Math.PI*2/3;return {x:400+Math.cos(theta)*103,y:214+Math.sin(theta)*35,r:3.4+(Math.sin(theta)+1)*.7,opacity:think*(.3+.6*(Math.sin(theta)+1)/2)};});
 const bars=Array.from({length:13},(_,i)=>{const center=Math.exp(-(((i-6)/4.2)**2)),wave=reduced?.6:.45+.55*Math.sin(t*6-i*.62)**2;return 4+speak*center*(8+outgoing*39)*wave;});
 return {radius,points,orbit,bars,listen,think,speak,idle,incoming,outgoing,halo:radius*1.95,glow:.48+listen*.15+think*.12+speak*(.17+outgoing*.15)};
}
