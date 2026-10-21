import React,{useEffect,useRef,useState} from 'react';
import {useCurrentFrame,useVideoConfig,delayRender,continueRender,cancelRender} from 'remotion';
import {loadPreviewFonts} from '../fonts';
import type {DemoProps} from '../DemoMotion';
import {settleSample} from './motion.js';
export const abs:React.CSSProperties={position:'absolute'};
export const button:React.CSSProperties={font:'inherit',color:'inherit',border:0,padding:0,cursor:'pointer',display:'grid',placeItems:'center',background:'transparent'};
export const card:React.CSSProperties={borderRadius:22,background:'#fff',boxShadow:'0 14px 35px #2931380b'};
export const Icon:React.FC<{name:string;size?:number;color?:string;progress?:number}>=({name,size=28,color='currentColor',progress=1})=><svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{name==='mic'?<><rect x="11" y="3" width="10" height="18" rx="5"/><path d="M7 15v2a9 9 0 0 0 18 0v-2M16 26v4M11 30h10"/></>:name==='play'?<path d="M11 6L26 16 11 26Z" fill={color} stroke="none"/>:name==='pause'?<><path d="M12 7v18M21 7v18" strokeWidth="4"/></>:name==='stop'?<rect x="8" y="8" width="16" height="16" rx="3" fill={color} stroke="none"/>:name==='check'?<path d="M7 17l6 6L26 9" pathLength={1} strokeDasharray="1" strokeDashoffset={1-progress} strokeWidth="2.5"/>:name==='search'?<><circle cx="13" cy="13" r="8"/><path d="M19 19l9 9"/></>:name==='speaker'?<><path d="M4 12h5l7-6v20l-7-6H4Z"/>{progress>.05&&<path d="M21 11q5 5 0 10"/>}{progress>.55&&<path d="M25 6q10 10 0 20"/>}</>:name==='chevron'?<path d="M8 12l8 8 8-8"/>:name==='phone'?<path d="M5 23l5-5h12l5 5v4h-6v-4H11v4H5Z" fill={color}/>:name==='close'?<path d="M8 8l16 16M24 8L8 24"/>:<path d="M16 6v20M6 16h20"/>}</svg>;
export function useUI(p:DemoProps){const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig(),[font]=useState(()=>delayRender('Voice UI type'));useEffect(()=>{loadPreviewFonts().then(()=>continueRender(font)).catch(cancelRender);},[font]);const clock=useRef({last:frame,ticks:frame});if(clock.current.last!==frame){clock.current.ticks+=(frame-clock.current.last+durationInFrames)%durationInFrames;clock.current.last=frame;}return{frame,fps,clock:clock.current.ticks/fps,auto:!p.input,reduced:!!p.native?.reducedMotion,wake:()=>p.native?.onPointer(.5,.5,true)};}
export function useMotionValue(value:number,clock:number,reduced=false){
 const m=useRef({from:value,to:value,velocity:0,time:clock,direct:true}),[,refresh]=useState(0);
 const sample=()=>settleSample(m.current,clock,reduced);
 const set=(to:number,direct=false,velocity?:number)=>{const current=sample(),previous=m.current,dt=Math.max(1/60,clock-previous.time),v=velocity??(direct?Math.max(-40,Math.min(40,(to-current.value)/dt)):current.velocity);m.current={from:direct?to:current.value,to,velocity:v,time:clock,direct};refresh(n=>n+1);};
 return [sample().value,set] as const;
}
export const timeLabel=(seconds:number)=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
export const Wave:React.FC<{heights:number[];color:string;width?:number;progress?:number}>=({heights,color,width=360,progress=1})=><svg aria-hidden="true" width={width} height="100" viewBox={`0 0 ${width} 100`}>{heights.map((h,i)=><rect key={i} x={i*width/heights.length+1} y={50-h/2} width={Math.max(2,width/heights.length-4)} height={h} rx="2" fill={color} opacity={i/heights.length<=progress?1:.2}/>)}</svg>;
