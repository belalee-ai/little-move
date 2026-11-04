import React,{useEffect,useRef,useState} from 'react';
import type {DemoProps} from '../DemoMotion';
import {demoFrames} from '../demos/catalog.js';
import {clamp,mod} from './motion.js';
import {directionAuto,entryEdge,overlayAt,overlayRest,overlayTo} from './direction-motion.js';
const absolute:React.CSSProperties={position:'absolute'};
const homes=[[72,66],[412,66],[72,260],[412,260]];
export const DirectionOverlay:React.FC<{p:DemoProps;frame:number;fps:number}>=({p,frame,fps})=>{
 const live=!!p.native,reduced=!!p.reducedMotion||!!p.native?.reducedMotion,period=demoFrames(p,fps);
 const [commands,setCommands]=useState(()=>homes.map((_,i)=>overlayRest(i)));
 const hovered=useRef(new Set<number>());
 useEffect(()=>{setCommands(homes.map((_,i)=>overlayRest(i)));hovered.current.clear();},[live]);
 // Settle on the player's clock before it wraps; never restart an old spring at the loop seam.
 useEffect(()=>{if(!live)return;setCommands(old=>{
  let changed=false;const next=old.map(c=>{
   if(!c.shown||mod(frame-c.frame,period)/fps<1.2||c.x===c.tx&&c.y===c.ty&&c.vx===0&&c.vy===0)return c;
   changed=true;return {...c,x:c.tx,y:c.ty,vx:0,vy:0,frame,shown:c.inside};
  });return changed?next:old;
 });},[frame,live,period,fps]);
 const move=(i:number,edge:number,inside:boolean)=>setCommands(old=>old.map((c,j)=>j===i?overlayTo(c,edge,inside,frame,fps,period,reduced):c));
 const edgeAt=(e:React.PointerEvent<HTMLButtonElement>)=>{const r=e.currentTarget.getBoundingClientRect();return entryEdge((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);};
 const accent=p.accent??'#292928',rgb=/^#[a-f\d]{6}$/i.test(accent)?[1,3,5].map(i=>parseInt(accent.slice(i,i+2),16)/255):[0,0,0];
 const linear=rgb.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),text=linear[0]*.2126+linear[1]*.7152+linear[2]*.0722>.179?'#202120':'#fafaf7';
 return <div data-direction-study="" style={{...absolute,inset:0,pointerEvents:live?'auto':'none'}}>
  {homes.map(([x,y],i)=>{
   const c=commands[i],pose=live?{...overlayAt(c,frame,fps,period,reduced),shown:c.shown}:directionAuto(frame/fps*clamp(p.speed??1,.5,2),i,reduced);
   return <button key={i} type="button" tabIndex={live?0:-1} aria-label={'方向遮罩 '+(i+1)} aria-pressed={live?c.inside:undefined} data-direction-tile={i} data-overlay-x={pose.x.toFixed(4)} data-overlay-y={pose.y.toFixed(4)}
    style={{...absolute,left:x,top:y,width:316,height:174,border:0,padding:0,borderRadius:12,background:['#e5e7e2','#e9e7e0','#dedfdc','#e7e8e4'][i],overflow:'hidden',cursor:live?'pointer':'default',outlineOffset:4,color:'#343b35'}}
    onPointerEnter={e=>{if(!live||e.pointerType==='touch')return;hovered.current.add(i);move(i,edgeAt(e),true);}}
    onPointerLeave={e=>{if(!live||e.pointerType==='touch')return;hovered.current.delete(i);move(i,edgeAt(e),false);}}
    onFocus={e=>{if(live&&!hovered.current.has(i)&&e.currentTarget.matches(':focus-visible'))move(i,0,true);}}
    onBlur={()=>{if(live)move(i,2,false);}}
    onClick={e=>{if(live&&(e.detail===0||!hovered.current.has(i)||e.nativeEvent instanceof PointerEvent&&e.nativeEvent.pointerType==='touch'))move(i,0,!c.inside);}}
    onKeyDown={e=>{if(!live)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();move(i,2,false);}else if(['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'].includes(e.key)){e.preventDefault();move(i,['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'].indexOf(e.key),!c.inside);}}}>
    <svg aria-hidden="true" width="316" height="174" viewBox="0 0 316 174" style={{display:'block'}}>
     {i===0?<><circle cx="143" cy="87" r="47" fill="currentColor"/><circle cx="185" cy="87" r="47" fill="#bfc6ba"/></>:i===1?<g fill="none" stroke="currentColor" strokeWidth="10">{[0,1,2].map(n=><rect key={n} x={111+n*11} y={40+n*11} width="72" height="72" rx="14"/>)}</g>:i===2?<path d="M95 121L158 39L221 121Z" fill="none" stroke="currentColor" strokeWidth="11" strokeLinejoin="round"/>:<g fill="currentColor">{[0,1,2,3].map(n=><rect key={n} x={101+n*28} y={47+n%2*18} width="17" height={80-n%2*36} rx="8"/>)}</g>}
    </svg>
    <span data-direction-overlay="" style={{...absolute,inset:0,background:accent,color:text,transform:`translate3d(${pose.x*100}%,${pose.y*100}%,0)`,visibility:pose.shown?'visible':'hidden',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',fontFamily:'Arial,sans-serif',fontSize:27,fontWeight:400,pointerEvents:'none',willChange:reduced?'auto':'transform'}}>
     <span style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',maxWidth:220}}>{p.title||'Explore'}</span><span aria-hidden="true" style={{fontSize:32,marginLeft:12}}>↗</span>
    </span>
   </button>;
  })}
 </div>;
};
