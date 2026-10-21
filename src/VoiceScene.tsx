import React from 'react';
import {Audio,staticFile} from 'remotion';
import type {DemoProps} from './DemoMotion';
import {voiceAt,voiceTimeLabel} from './demos/voice-motion.js';
export const VoiceScene:React.FC<{p:DemoProps;frame:number;fps:number}>=({p,frame,fps})=>{
 const state=voiceAt(p,frame,fps),timeline=p.voiceStyle==='timeline',bars=timeline?state.timeline:state.bars,color=p.accent??'#292928';
 const background=p.background??'#f3f3f1',hex=background.replace('#',''),dark=hex.length===6&&parseInt(hex.slice(0,2),16)*.299+parseInt(hex.slice(2,4),16)*.587+parseInt(hex.slice(4,6),16)*.114<140,text=dark?'#eeeeea':'#575752';
 const x=108+state.progress*584;
 return <>
  {p.audioSrc&&<Audio src={p.audioSrc.startsWith('/')?staticFile(p.audioSrc.slice(1)):p.audioSrc} playbackRate={p.speed??1}/>}
  <svg data-voice-time={state.time.toFixed(3)} data-voice-level={state.level.toFixed(3)} data-voice-style={timeline?'timeline':'live'} viewBox="0 0 800 500" width={800} height={500} role="img" aria-label={timeline?'语音波形和已播放进度':'随语音音量起伏的声波与播放进度'}>
   <g fill={color}>
    {bars.map((bar,i)=><rect data-voice-bar={i} key={i} x={bar.x} y={240-bar.height/2} width={5} height={bar.height} rx={2.5} opacity={timeline?.18:.4+.6*Math.min(1,(bar.height-6)/110)}/>)}
    {timeline&&<svg x="108" y="140" width={Math.max(0,state.progress*584)} height="200" viewBox={`108 140 ${Math.max(.001,state.progress*584)} 200`} overflow="hidden"><g>{bars.map((bar,i)=><rect key={i} x={bar.x} y={240-bar.height/2} width={5} height={bar.height} rx={2.5}/>)}</g></svg>}
   </g>
   {timeline&&<g stroke={color} opacity=".8"><line x1={x} y1="132" x2={x} y2="334" strokeWidth="1.2"/><circle cx={x} cy="132" r="3" fill={color} stroke="none"/></g>}
   <rect x="108" y="357" width="584" height="3" rx="1.5" fill={text} opacity=".13"/>
   <rect x="108" y="357" width={584*state.progress} height="3" rx="1.5" fill={color}/>
   <g fill={text} fontFamily="Arial, sans-serif" fontSize="15" style={{fontVariantNumeric:'tabular-nums'}}><text x="108" y="389">{voiceTimeLabel(state.time)}</text><text x="692" y="389" textAnchor="end">{voiceTimeLabel(state.duration)}</text></g>
  </svg>
 </>;
};
