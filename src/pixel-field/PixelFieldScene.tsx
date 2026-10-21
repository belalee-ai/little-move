import React,{useId} from 'react';
import {staticFile} from 'remotion';
import type {DemoProps} from '../DemoMotion';
import {demoFrames} from '../demos/catalog.js';
import {fieldOffsets,fieldSamples,fieldPointerAt,liveFieldSamples} from './motion.js';

export const PixelFieldScene:React.FC<{p:DemoProps;frame:number;fps:number}>=({p,frame,fps})=>{
 const t=frame/fps*Math.max(.5,Math.min(2,p.speed??1));
 const reduced=!!p.reducedMotion;
 const samples=p.input?liveFieldSamples(p.input.fieldTrail??[],frame,fps,demoFrames(p,fps)):fieldSamples(t);
 const tiles=fieldOffsets(samples,p.strength,reduced);
 const pt=fieldPointerAt(t),src=p.images?.[0]??'/pixel-field/quiet-courtyard.svg';
 const href=src.startsWith('/')?staticFile(src.slice(1)):src;
 const id='pixel-'+useId().replace(/[^a-z0-9]/gi,'');
 const aspect=p.fit==='contain'?'xMidYMid meet':'xMidYMid slice';
 return <svg data-pixel-field="" data-distortion={Math.max(...tiles.map(d=>Math.hypot(d.dx,d.dy))).toFixed(3)} viewBox="0 0 800 500" width="800" height="500" role="img" aria-label="图片像素扰动：局部方块随指针错位采样，再连续复原">
  <defs><clipPath id={id}><rect x="40" y="40" width="720" height="420" rx="17"/></clipPath></defs>
  <g clipPath={`url(#${id})`}>
   <rect x="40" y="40" width="720" height="420" fill="#deded6"/>
   <image href={href} x="40" y="40" width="720" height="420" preserveAspectRatio={aspect}/>
   {tiles.map((tile,i)=>Math.hypot(tile.dx,tile.dy)<.025?null:<svg key={i} x={40+tile.x} y={40+tile.y} width="30.15" height="30.15" viewBox="0 0 30.15 30.15" overflow="hidden"><image href={href} x={-tile.x+tile.dx} y={-tile.y+tile.dy} width="720" height="420" preserveAspectRatio={aspect}/></svg>)}
  </g>
  {!p.input&&!reduced&&pt.active&&<g transform={`translate(${40+pt.x*720},${40+pt.y*420})`} pointerEvents="none"><circle r="11" fill="#fff" fillOpacity=".22" stroke="#fff" strokeOpacity=".7"/><circle r="2.5" fill="#fff"/></g>}
 </svg>;
};
