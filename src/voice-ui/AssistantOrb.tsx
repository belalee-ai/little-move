import React,{useId} from 'react';
import {orbAutoWeights,orbModel} from './orb-motion.js';
import {abs,button,useMotionValue} from './shared';
import type {DemoProps} from '../DemoMotion';
type Props={p:DemoProps;time:number;clock:number;auto:boolean;reduced:boolean;mode:number;onChange:(mode:number)=>void};
export const AssistantOrb:React.FC<Props>=({p,time,clock,auto,reduced,mode,onChange})=>{
 const [listen,toListen]=useMotionValue(0,clock,reduced),[think,toThink]=useMotionValue(0,clock,reduced),[speak,toSpeak]=useMotionValue(0,clock,reduced);
 const visualTime=auto?time:clock,weights=auto?orbAutoWeights(time):[listen,think,speak],a=orbModel(visualTime,weights,p.strength??1,reduced);
 const id='orb'+useId().replace(/[^a-zA-Z0-9]/g,''),color=p.accent??'#567dbe';
 const select=(next:number)=>{toListen(next===1?1:0);toThink(next===2?1:0);toSpeak(next===3?1:0);onChange(next);};
 const path='M'+a.points.map((point:{x:number;y:number})=>point.x.toFixed(2)+','+point.y.toFixed(2)).join('L')+'Z';
 const labels=['待机','聆听','思考','说话'];
 return <div data-assistant-orb="" data-orb-state={labels[mode]} data-orb-radius={a.radius.toFixed(2)} data-orb-thinking={a.think.toFixed(3)} data-orb-speaking={a.speak.toFixed(3)}>
  <svg width="800" height="500" aria-hidden="true">
   <defs>
    <radialGradient id={id+'halo'}><stop stopColor={color} stopOpacity=".32"/><stop offset=".55" stopColor={color} stopOpacity=".18"/><stop offset="1" stopColor={color} stopOpacity="0"/></radialGradient>
    <radialGradient id={id+'body'} cx={`${35+Math.sin((reduced?0:visualTime)*.7)*7}%`} cy="27%" r="82%"><stop stopColor="#fff"/><stop offset=".25" stopColor="#e7f1ff"/><stop offset=".64" stopColor="#acc8eb"/><stop offset="1" stopColor={color}/></radialGradient>
    <radialGradient id={id+'veil'} cx="50%" cy="50%"><stop stopColor="#fff" stopOpacity=".7"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
   </defs>
   <ellipse cx="400" cy="304" rx={a.radius*1.15} ry="13" fill={`url(#${id}halo)`} opacity=".32"/>
   <circle cx="400" cy="214" r={a.halo} fill={`url(#${id}halo)`} opacity={a.glow}/>
   <path d={path} fill={`url(#${id}body)`}/>
   <ellipse cx={390-a.listen*4} cy={199-a.think*6} rx={a.radius*.71} ry={a.radius*.67} fill={`url(#${id}veil)`} opacity={.45+a.speak*.2}/>
   {a.orbit.map((dot:{x:number;y:number;r:number;opacity:number},i:number)=><circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={color} opacity={dot.opacity}/>)}
   {[0,1,2].map(i=><circle key={i} cx={386+i*14} cy="214" r={3+a.listen*1.2} fill="#fff" opacity={a.listen*(reduced?.8:.5+.45*Math.sin(visualTime*3-i*.8)**2)}/>)}
   <g opacity={a.speak}>{a.bars.map((height:number,i:number)=><rect key={i} x={353+i*7.5} y={214-height/2} width="3.5" height={height} rx="1.75" fill="#fff"/>)}</g>
  </svg>
  <div role="status" style={{...abs,left:230,top:332,width:340,textAlign:'center',fontSize:20,color:'#313940'}}>{['等待唤醒','正在聆听','思考中','正在说话'][mode]}</div>
  <div role="group" aria-label="语音助手状态" style={{...abs,left:208,top:391,width:384,padding:4,display:'flex',gap:4,borderRadius:25,background:'#e9eae8'}}>{labels.map((label,i)=><button key={label} disabled={auto} aria-label={'切换到'+label} aria-pressed={mode===i} onClick={()=>select(i)} style={{...button,flex:1,height:38,borderRadius:20,fontSize:14,background:mode===i?'#fff':'transparent',color:mode===i?'#303940':'#808883',boxShadow:mode===i?'0 1px 4px #00000009':'none'}}>{label}</button>)}</div>
 </div>;
};
