import React,{useEffect,useId,useRef,useState} from 'react';
import {Img,staticFile} from 'remotion';
import type {DemoProps} from '../DemoMotion';
import {demoFrames} from '../demos/catalog.js';
import {autoScrollAt,autoMagnetAt,scrollVisual,springAt,retarget,rest,clamp,mod,magnetPose,gridHomes} from './motion.js';
const absolute:React.CSSProperties={position:'absolute'};
const curveMap='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="450" height="400"><defs><linearGradient id="g">'+Array.from({length:41},(_,i)=>'<stop offset="'+i/40+'" stop-color="rgb('+Math.round(128+127*Math.sin(i/40*Math.PI))+',128,128)"/>').join('')+'</linearGradient></defs><rect width="450" height="400" fill="url(#g)"/></svg>');
const asset=(src:string)=>src.startsWith('/')?staticFile(src.slice(1)):src;
function useCommand(frame:number,fps:number,period:number,live:boolean,reduced:boolean,initial=0){
 const [command,setCommand]=useState(()=>rest(initial));
 useEffect(()=>setCommand(rest(initial)),[live,initial]);
 useEffect(()=>{if(!live)return;setCommand(c=>c.from===c.target&&c.velocity===0?c:mod(frame-c.frame,period)/fps>2?{...rest(c.target),frame}:c);},[frame,fps,period,live]);
 const moveTo=(target:number)=>setCommand(c=>retarget(c,target,frame,fps,period,reduced));
 return {state:springAt(command,frame,fps,period,reduced),moveTo,target:command.target};
}

export const ScrollGrainScene:React.FC<{p:DemoProps;frame:number;fps:number}>=({p,frame,fps})=>{
 const live=!!p.native,reduced=!!p.native?.reducedMotion||!!p.reducedMotion;
 const period=demoFrames(p,fps),motion=useCommand(frame,fps,period,live,reduced);
 const t=frame/fps*clamp(p.speed??1,.5,2),state=live?motion.state:autoScrollAt(t),visual=scrollVisual(state,p.strength,reduced);
 const root=useRef<HTMLDivElement>(null),drag=useRef<number|null>(null);
 const wheel=useRef((delta:number)=>{});wheel.current=delta=>motion.moveTo(clamp(motion.target+delta/1000));
 useEffect(()=>{const el=root.current;if(!el||!live)return;const handler=(event:WheelEvent)=>{event.preventDefault();wheel.current(event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?400:1));};el.addEventListener('wheel',handler,{passive:false});return()=>el.removeEventListener('wheel',handler);},[live]);
 const key=useId().replace(/[^a-z0-9]/gi,''),clip='scroll-clip-'+key,grain='scroll-grain-'+key;
 const images=p.images??[],bow=visual.bow;
 const image=(i:number)=><image key={i} href={asset(images[i])} x={i%2?286:64} y={68+i*320-visual.offset} width="450" height="270" preserveAspectRatio={p.fit==='contain'?'xMidYMid meet':'xMidYMid slice'} filter={Math.abs(bow)>.001||visual.grain>.001?`url(#${grain})`:undefined} data-scroll-image={i}/>;
 return <div ref={root} tabIndex={live?0:-1} role={live?'group':undefined} aria-label={live?'滚动扭曲与颗粒操作区：滚轮、上下拖动或方向键':undefined} data-scroll-study="" data-scroll-position={state.position.toFixed(4)} data-scroll-bow={bow.toFixed(3)} style={{...absolute,inset:0,touchAction:live?'none':'auto',outlineOffset:-6,pointerEvents:live?'auto':'none'}}
  onKeyDown={event=>{if(!live)return;const change=event.key==='ArrowDown'?.2:event.key==='ArrowUp'?-.2:0;if(change||['Home','End'].includes(event.key)){event.preventDefault();motion.moveTo(event.key==='Home'?0:event.key==='End'?1:clamp(motion.target+change));}}}
  onPointerDown={event=>{if(!live)return;drag.current=event.clientY;event.currentTarget.setPointerCapture(event.pointerId);}}
  onPointerMove={event=>{if(drag.current===null)return;const delta=drag.current-event.clientY;drag.current=event.clientY;wheel.current(delta*2.3);}}
  onPointerUp={event=>{drag.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}
  onPointerCancel={()=>{drag.current=null;}}>
  <svg viewBox="0 0 800 500" width="800" height="500" role="img" aria-label="滚动速度改变图片弧面方向和细颗粒，停止后恢复平整">
   <defs><clipPath id={clip}><rect x="28" y="26" width="744" height="448" rx="17"/></clipPath>
    <filter id={grain} x="0" y="-40%" width="100%" height="180%" colorInterpolationFilters="sRGB">
     <feImage href={curveMap} preserveAspectRatio="none" result="curve"/>
     <feDisplacementMap in="SourceGraphic" in2="curve" scale={bow*2} xChannelSelector="B" yChannelSelector="R" result="bent"/>
     <feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="2" seed={reduced?17:17+Math.floor(t*18)} result="noise"/>
     <feColorMatrix in="noise" type="matrix" values={`.333 .333 .333 0 0  .333 .333 .333 0 0  .333 .333 .333 0 0  0 0 0 ${visual.grain} 0`} result="texture"/>
     <feBlend in="bent" in2="texture" mode="soft-light"/><feComposite in2="bent" operator="in"/>
    </filter>
   </defs>
   <g clipPath={`url(#${clip})`}>{[0,1,2].map(image)}</g>
   <path d="M758 120v260" stroke="#262b2720" strokeWidth="2"/><path d={`M758 ${120+clamp(state.position)*214}v46`} stroke="#4f6258" strokeWidth="3" strokeLinecap="round"/>
  </svg>
 </div>;
};

export const MagneticGridScene:React.FC<{p:DemoProps;frame:number;fps:number}>=({p,frame,fps})=>{
 const live=!!p.native,reduced=!!p.native?.reducedMotion||!!p.reducedMotion,period=demoFrames(p,fps);
 const opening=useCommand(frame,fps,period,live,reduced),mx=useCommand(frame,fps,period,live,reduced,.5),my=useCommand(frame,fps,period,live,reduced,.5),gain=useCommand(frame,fps,period,live,reduced);
 const [selected,setSelected]=useState(2),refs=useRef<Array<HTMLButtonElement|null>>([]),wasOpen=useRef(false),closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>setSelected(2),[live]);
 const automatic=autoMagnetAt(frame/fps*clamp(p.speed??1,.5,2));
 const state=live?{open:clamp(opening.state.position),selected,x:mx.state.position,y:my.state.position,gain:gain.state.position}:automatic;
 useEffect(()=>{if(!live)return;if(state.open>.005&&opening.target===1&&!wasOpen.current){wasOpen.current=true;closeRef.current?.focus();}else if(state.open<.005&&opening.target===0&&wasOpen.current){wasOpen.current=false;refs.current[selected]?.focus();}},[state.open,opening.target,selected,live]);
 const point=(x:number,y:number)=>{mx.moveTo(x);my.moveTo(y);gain.moveTo(1);};
 const close=()=>opening.moveTo(0);
 const images=p.images??[];
 return <div role={live?'group':undefined} aria-label={live?'磁吸网格聚焦操作区':undefined} data-magnetic-study="" data-magnetic-open={state.open.toFixed(4)} style={{...absolute,inset:0,perspective:1000,transformStyle:'preserve-3d',pointerEvents:live?'auto':'none'}}
  onKeyDown={e=>{if(live&&e.key==='Escape'){e.preventDefault();close();}}}
  onPointerMove={e=>{if(!live||opening.target===1)return;const r=e.currentTarget.getBoundingClientRect();point(clamp((e.clientX-r.left)/r.width),clamp((e.clientY-r.top)/r.height));}}
  onPointerLeave={()=>{if(live){mx.moveTo(.5);my.moveTo(.5);gain.moveTo(0);}}}>
  {[0,1,2,3,4,5].map(i=>{
   const pose=magnetPose(i,state,p.strength,reduced),isSelected=i===state.selected;
   return <button key={i} ref={el=>{refs.current[i]=el;}} aria-label={'查看建筑 '+(i+1)} aria-expanded={isSelected&&state.open>.5} disabled={!live||opening.target===1||state.open>.05} data-magnetic-tile={i} style={{...absolute,left:0,top:0,width:pose.w,height:pose.h,padding:0,border:0,borderRadius:12,overflow:'hidden',background:'#d5d9cd',transform:`translate3d(${pose.x}px,${pose.y}px,${pose.depth}px) rotate(${pose.angle}deg) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg)`,opacity:pose.opacity,zIndex:isSelected?20:1,boxShadow:`0 ${8+pose.depth*.06}px 26px #24352b18`,cursor:live?'pointer':'default',willChange:'transform,width,height',color:'inherit'}}
    onFocus={()=>{if(live&&opening.target===0){const h=gridHomes[i];point((h.x+h.w/2)/800,(h.y+h.h/2)/500);}}}
    onClick={()=>{if(!live)return;setSelected(i);opening.moveTo(1);}}>
    <Img src={asset(images[i])} alt={'原创建筑示意 '+(i+1)} style={{width:'100%',height:'100%',objectFit:p.fit??'cover',display:'block'}} draggable={false}/>
   </button>;
  })}
  {state.open>.01&&<div style={{...absolute,left:116,top:438,opacity:clamp((state.open-.6)/.4),fontFamily:'Arial,sans-serif',fontSize:19,letterSpacing:-.3,color:'#364b40',pointerEvents:'none'}}>Quiet forms</div>}
  {live&&state.open>.005&&<button ref={closeRef} aria-label="返回网格" onClick={close} style={{...absolute,left:26,top:18,zIndex:40,width:42,height:42,border:0,borderRadius:'50%',background:'#fff',boxShadow:'0 2px 10px #0001',fontSize:24,color:'#303b33',cursor:'pointer'}}>×</button>}
 </div>;
};
