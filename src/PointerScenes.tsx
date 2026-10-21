import React,{useRef} from 'react';
import type {DemoProps} from './DemoMotion';
import {clamp,cue} from './demos/motion.js';
import {dockItems,slideProgress,radialProgress,radialItem,slideRelease} from './demos/pointer-motion.js';
type State={t:number;p:number;x:number;y:number;gain:number;index?:number};
const a:React.CSSProperties={position:'absolute'};
const button:React.CSSProperties={border:0,padding:0,font:'inherit',cursor:'pointer'};
const paths=[
 <path key="home" d="M7 19L20 8L33 19V34H24V24H16V34H7Z"/>,
 <path key="folder" d="M5 12H16L20 16H35V33H5ZM5 16H20"/>,
 <g key="notes"><rect x="8" y="6" width="24" height="29" rx="3"/><path d="M14 15H26M14 21H26M14 27H22"/></g>,
 <g key="sound"><path d="M7 17H13L21 10V32L13 25H7ZM27 14Q35 21 27 28M30 8Q43 21 30 34"/></g>,
 <g key="search"><circle cx="17" cy="17" r="10"/><path d="M24 24L34 34"/></g>
];
const Icon:React.FC<{index:number;color?:string;size?:number}>=({index,color='currentColor',size=36})=><svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{paths[index%5]}</svg>;
export const PointerObjectScene:React.FC<{p:DemoProps;s:State;kind:string;auto:boolean}>=({p,s,kind,auto})=>{
 const n=p.native,accent=p.accent??'#292928',lastDrag=useRef(0),names=['Home','Files','Notes','Sound','Search'];
 const rgb=[1,3,5].map(i=>parseInt(accent.slice(i,i+2),16)),light=rgb.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0)>145,fg=light?'#242424':'#fff';
 const pointer=(e:React.PointerEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();n?.onPointer((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height,true);};
 if(kind==='tilt'){
  const items=dockItems(s.x,s.gain,p.strength??1),barWidth=items[4].x+items[4].size/2-(items[0].x-items[0].size/2)+34,nearest=items.reduce((best,item,i)=>item.focus>items[best].focus?i:best,0),label=items[nearest];
  return <div data-dock-focus={nearest} style={{...a,inset:0}} onPointerMove={pointer} onPointerLeave={()=>n?.onPointer(.5,.5,false)}>
   <div style={{...a,left:155,top:231,width:490,height:98,borderRadius:28,background:'#e6e6e1',boxShadow:'inset 0 0 0 1px #00000004',transform:`scaleX(${barWidth/490})`}}/>
   {items.map((item,i)=>{const focused=item.focus>.82;return <button key={i} type="button" aria-label={'预览'+names[i]} tabIndex={n?0:-1} onFocus={()=>n?.onPointer(item.base/800,.56,true)} onClick={()=>n?.onPointer(item.base/800,.56,true)} onKeyDown={e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const next=clamp(i+(e.key==='ArrowRight'?1:-1),0,4);n?.onPointer((252+next*74)/800,.56,true);(e.currentTarget.parentElement?.querySelectorAll('button')[next] as HTMLButtonElement)?.focus();}}} style={{...button,...a,left:item.x-36,top:item.y-36,width:72,height:72,borderRadius:21,background:focused?accent:'#fff',color:focused?fg:'#30302e',transform:`scale(${item.size/72})`,boxShadow:`0 ${3+item.focus*7}px ${10+item.focus*13}px #00000012`,willChange:'transform',pointerEvents:n?'auto':'none'}}><Icon index={i}/></button>;})}
   <div style={{...a,left:label.x-55,top:label.y-label.size/2-43,width:110,textAlign:'center',fontSize:17,color:'#33332f',opacity:Math.pow(label.focus,2)}}>{names[nearest]}</div>
  </div>;
 }
 if(kind==='magnet'){
  const q=auto?slideProgress(s.t):clamp((s.index??0)/2),done=q>.985,travel=q*380,scrub=(v:number,release=false)=>{lastDrag.current=v;if(n?.onScrub)n.onScrub(v,release);else n?.onSelect(v*2);};
  return <div data-slide-progress={q} style={{...a,inset:0,color:'#292928'}}>
   <div style={{...a,left:155,top:202,width:490,height:96,borderRadius:50,background:'#fff',overflow:'hidden',boxShadow:'0 8px 22px #0000000a,inset 0 0 0 1px #0000000b'}}>
    <div style={{...a,inset:0,borderRadius:50,background:accent,transformOrigin:'left',transform:`scaleX(${q})`}}/>
    <div style={{...a,inset:0,display:'grid',placeItems:'center',fontSize:25,letterSpacing:-.6,opacity:1-cue(q,.10,.50)}}>Slide to confirm</div>
    <div role="status" style={{...a,inset:0,display:'grid',placeItems:'center',fontSize:25,color:fg,opacity:cue(q,.82,.18),transform:`translateY(${(1-cue(q,.82,.18))*10}px)`}}>Confirmed</div>
    <div style={{...a,left:10,top:10,width:76,height:76,borderRadius:'50%',display:'grid',placeItems:'center',background:done?'#fff':accent,color:done?accent:fg,transform:`translate3d(${travel}px,0,0) scaleX(${1+.06*Math.sin(q*Math.PI)})`,boxShadow:done?'0 2px 7px #00000018':'none'}}><svg width="37" height="37" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 20H31M23 12L31 20L23 28" opacity={1-cue(q,.7,.2)}/><path d="M10 20L17 27L31 12" pathLength="1" strokeDasharray="1" strokeDashoffset={1-cue(q,.8,.2)} opacity={cue(q,.8,.2)}/></svg></div>
    <input type="range" aria-label="滑动确认示例" min="0" max="100" step="1" value={Math.round(q*100)} tabIndex={n?0:-1} onChange={e=>scrub(+e.target.value/100)} onPointerUp={()=>scrub(slideRelease(lastDrag.current),true)} onPointerCancel={()=>scrub(0,true)} onKeyUp={e=>{if(['End','Enter',' '].includes(e.key))scrub(1,true);}} style={{...a,inset:0,width:'100%',height:'100%',margin:0,opacity:0,cursor:done?'default':'ew-resize',pointerEvents:n?'auto':'none'}}/>
   </div>
   <button type="button" onClick={()=>scrub(0,true)} tabIndex={n&&done?0:-1} aria-label="重置滑动确认" style={{...button,...a,left:350,top:337,width:100,height:38,borderRadius:10,background:'transparent',color:'#85857f',fontSize:16,opacity:done?1:0,pointerEvents:n&&done?'auto':'none'}}>Reset</button>
  </div>;
 }
 const progress=auto?radialProgress(s.t):s.p;
 return <div data-radial-progress={progress} style={{...a,inset:0}} onKeyDown={e=>{if(e.key==='Escape'&&progress>.1){e.preventDefault();n?.onToggle();}}}>
  {[0,1,2,3,4].map(i=>{const pose=radialItem(progress,i);return <button type="button" key={i} aria-label={'选择'+names[i]} tabIndex={n&&pose.q>.85?0:-1} onClick={()=>{n?.onSelect(i);n?.onToggle();}} style={{...button,...a,left:pose.x-34,top:pose.y-34,width:68,height:68,borderRadius:'50%',background:'#fff',color:'#292928',opacity:pose.q,transform:`scale(${.35+.65*pose.q}) rotate(${(1-pose.q)*-24}deg)`,boxShadow:'0 8px 22px #0000000c,inset 0 0 0 1px #00000005',pointerEvents:n&&pose.q>.85?'auto':'none',willChange:'transform,opacity'}}><Icon index={i} size={30}/><span style={{...a,left:-16,top:78,width:100,fontSize:14,color:'#83837b',opacity:pose.q}}>{names[i]}</span></button>;})}
  <button type="button" aria-label="展开径向菜单" aria-expanded={progress>.5} tabIndex={n?0:-1} onClick={()=>n?.onToggle()} style={{...button,...a,left:356,top:211,width:88,height:88,borderRadius:'50%',background:accent,color:fg,display:'grid',placeItems:'center',boxShadow:'0 10px 24px #00000015',transform:`scale(${1-.045*Math.sin(progress*Math.PI)})`,pointerEvents:n?'auto':'none'}}><svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" style={{transform:`rotate(${progress*135}deg)`}}><path d="M7 16H25M16 7V25"/></svg></button>
 </div>;
};
