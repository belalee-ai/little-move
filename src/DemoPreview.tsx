import {isCoverage,isCoverageAudio,COVERAGE_NATIVE_KEYS} from './coverage/catalog.js';
import {useLiveSound} from './useLiveSound';
import {isVoiceUI} from './voice-ui/catalog.js';
import {isVerification} from './verification/catalog.js';
import {isBatch,BATCH_CONTROL_KEYS} from './batch/catalog.js';
import {DataPlayback} from './DataPlayback';
import {isDataDemo} from './demos/data-motion.js';
import React,{useRef,useState,useEffect} from 'react';
import {Player,type PlayerRef} from '@remotion/player';
import {DemoMotion,type DemoProps,type DemoInput} from './DemoMotion';
import {demoById,demoFrames,demoState,clamp} from './demos/catalog.js';
import {nativeKeys,type NativeControls} from './NativeScenes';
import {rubber,releaseIndex,accordionHit,mod} from './demos/motion.js';
export const DemoPreview:React.FC<{value:DemoProps;reduced:boolean;playerRef:(r:PlayerRef|null)=>void}>=({value,reduced,playerRef})=>{
 const batch=isCoverage(value.demo)||isBatch(value.demo)||isVerification(value.demo)||isVoiceUI(value.demo),meta=demoById(value.demo)!,ref=useRef<PlayerRef|null>(null),[live,setLive]=useState(false);
 const liveSound=useLiveSound(value.demo,value,live,ref);
 const [text,setText]=useState(''),[focused,setFocused]=useState(false);
 const initial:DemoInput={x:.5,y:.5,progress:meta.key==='compare'?.5:0,index:0,active:false,vx:0,vy:0};
 const [input,setInput]=useState<DemoInput>(initial),inputRef=useRef(input);inputRef.current=input;
 const drag=useRef<{x:number;index:number;lastX:number;lastFrame:number;velocity:number}|null>(null),pointer=useRef<{x:number;y:number;frame:number}|null>(null);
 const frame=()=>ref.current?.getCurrentFrame()??0;
 const resolved=()=>demoState({...value,input:inputRef.current},frame(),60);
 const patch=(next:Partial<DemoInput>,kind:'pointer'|'layout'|'snap'|'direct'='layout',velocity=0)=>{
  if((!reduced||meta.key==='hold'||isVoiceUI(value.demo))&&!ref.current?.isPlaying())ref.current?.play();
  setInput(previous=>{const state=demoState({...value,input:previous},frame(),60),current:DemoInput={x:state.x,y:state.y,progress:state.p,index:state.index,active:state.active,vx:state.vx,vy:state.vy};
   return {...previous,...next,transition:kind==='direct'||reduced?undefined:{from:current,frame:frame(),duration:kind==='snap'?.68:kind==='pointer'?.12:meta.key==='upload'&&next.progress===1?3.7:.48,kind,velocity}} as DemoInput;
  });
 };
 useEffect(()=>{const player=ref.current,tr=input.transition;if(!player||!tr)return;const finish=(event:{detail:{frame:number}})=>{const elapsed=mod(event.detail.frame-tr.frame,demoFrames(value));if(elapsed>=(tr.duration??.28)*60)setInput(current=>({...current,transition:undefined}));};player.addEventListener('frameupdate',finish);return()=>player.removeEventListener('frameupdate',finish);},[input.transition,value]);
 const coords=(event:React.PointerEvent<HTMLDivElement>)=>{const r=event.currentTarget.parentElement!.getBoundingClientRect();return {x:clamp((event.clientX-r.left)/r.width),y:clamp((event.clientY-r.top)/r.height)};};
 const move=(event:React.PointerEvent<HTMLDivElement>)=>{
  const pt=coords(event),f=frame(),last=pointer.current,dt=last?Math.max(1,mod(f-last.frame,demoFrames(value)))/60:1/60,vx=last?clamp((pt.x-last.x)/dt,-3,3):0,vy=last?clamp((pt.y-last.y)/dt,-3,3):0;pointer.current={...pt,frame:f};
  if(meta.key==='compare'&&drag.current)patch({...pt,progress:clamp((pt.x*800-58)/684),active:true},'direct');
  else if(meta.key==='drag'&&drag.current){const grip=drag.current,elapsed=Math.max(1,mod(f-grip.lastFrame,demoFrames(value)))/60;grip.velocity=clamp((grip.lastX-pt.x)*800/334/elapsed,-7,7);grip.lastX=pt.x;grip.lastFrame=f;patch({...pt,index:rubber(grip.index+(grip.x-pt.x)*800/334),active:true,vx,vy},'direct');}
  else if(['parallax','tilt','magnet','follow'].includes(meta.key))patch({...pt,active:true,vx,vy},'pointer');
 };
 const release=(event:React.PointerEvent<HTMLDivElement>)=>{
  const grip=drag.current;if(!grip)return;
  if(meta.key==='drag'){const idle=mod(frame()-grip.lastFrame,demoFrames(value))/60,velocity=idle>.12?0:grip.velocity;patch({index:releaseIndex(resolved().index,velocity),active:false,vx:0,vy:0},'snap',velocity);}
  else patch({active:false},'direct');
  drag.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
 };
 const activate=(pt:{x:number;y:number})=>{
  if(meta.key==='accordion')patch({...pt,index:accordionHit(pt.x*800,resolved().index),active:true});
  else patch({...pt,active:true,progress:1-inputRef.current.progress});
 };
 const native:NativeControls={reducedMotion:reduced,text,focused,onScrub:(v,release=false)=>patch(meta.key==='sheet'?{progress:v,active:true}:{index:v*2,active:true},release?'layout':'direct'),onText:next=>{setText(next);patch({progress:BATCH_CONTROL_KEYS.includes(meta.key)?inputRef.current.progress:next.length||focused?1:0,active:true});},onFocus:next=>{setFocused(next);patch({progress:next||text.length?1:0,active:next});},onSelect:index=>patch({index,active:true}),onToggle:()=>patch({progress:1-inputRef.current.progress,active:true}),onPointer:(x,y,active)=>patch({x,y,active},'pointer')};
 return <div className={isDataDemo(value.demo)||batch?"demo-preview is-data":"demo-preview"} data-live={live} {...liveSound.handlers} data-input-index={input.index} data-input-transition={input.transition?.kind??'none'}>
  <audio ref={liveSound.audioRef} data-live-sfx="" hidden preload="none"/>
  <Player ref={r=>{ref.current=r;playerRef(r);}} component={DemoMotion} inputProps={{...value,...(live?{input,...(nativeKeys.includes(meta.key)?{native}:{})}:{} )}} durationInFrames={demoFrames(value)} compositionWidth={800} compositionHeight={500} fps={60} clickToPlay={!(live&&nativeKeys.includes(meta.key))} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={!isDataDemo(value.demo)&&!(live&&nativeKeys.includes(meta.key))} initiallyMuted={meta.key==='voice'||isCoverageAudio(value.demo)} numberOfSharedAudioTags={isCoverage(value.demo)?2:5} controls={!batch&&!isDataDemo(value.demo)&&!(live&&nativeKeys.includes(meta.key))} loop autoPlay={false} style={{width:'100%'}}/>
  {liveSound.error&&<span className="live-sound-error" role="status">{liveSound.error}</span>}
  {(isDataDemo(value.demo)||batch)&&!(live&&(COVERAGE_NATIVE_KEYS.includes(meta.key)||BATCH_CONTROL_KEYS.includes(meta.key)||isVerification(value.demo)||isVoiceUI(value.demo)))&&<DataPlayback player={ref} duration={demoFrames(value)} label={isDataDemo(value.demo)?'数据动效':'动效'}/>}
  {meta.trigger!=='自动'&&<button className="demo-mode" aria-label={live?'自动演示':'亲手试试'} title={live?'自动演示':'亲手试试'} aria-pressed={live} onClick={()=>{setLive(v=>!v);setInput(initial);drag.current=null;pointer.current=null;if(!reduced)ref.current?.play();}}><svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">{live?<path d="M8 5L19 12L8 19Z" fill="currentColor" stroke="none"/>:<path d="M5 3L19 15L12 16L9 22Z"/>}</svg></button>}
  {live&&!nativeKeys.includes(meta.key)&&<div className="demo-input" tabIndex={0} role="group" aria-label={meta.name+'操作区：'+(meta.trigger==='拖动'?'拖动或按左右方向键':meta.trigger==='点击'?'点击或按空格切换':'移动指针，或用方向键体验')} style={{touchAction:'none'}}
   onPointerMove={move} onPointerLeave={()=>{pointer.current=null;if(!drag.current)patch({x:.5,y:.5,active:false,vx:0,vy:0},'pointer');}}
   onPointerDown={event=>{const pt=coords(event),f=frame();pointer.current={...pt,frame:f};if(['compare','drag'].includes(meta.key)){drag.current={x:pt.x,index:resolved().index,lastX:pt.x,lastFrame:f,velocity:0};event.currentTarget.setPointerCapture(event.pointerId);patch({...pt,active:true,...(meta.key==='compare'?{progress:clamp((pt.x*800-58)/684)}:{})},'direct');}else if(meta.trigger==='点击')activate(pt);else patch({...pt,active:true},'pointer');}}
   onPointerUp={release} onPointerCancel={event=>{if(meta.key==='drag'&&drag.current)drag.current.velocity=0;release(event);}}
   onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Enter','Escape'].includes(event.key))return;event.preventDefault();if(event.key==='Escape'){setLive(false);return;}const dir=['ArrowLeft','ArrowUp'].includes(event.key)?-1:1;patch({x:clamp(input.x+(event.key==='ArrowLeft'?-.15:event.key==='ArrowRight'?.15:0)),y:clamp(input.y+(event.key==='ArrowUp'?-.15:event.key==='ArrowDown'?.15:0)),progress:meta.trigger==='点击'?1-input.progress:clamp(input.progress+dir*.15),index:clamp(Math.round(input.index)+dir,0,2),active:true,vx:0,vy:0},meta.key==='drag'?'snap':'layout');}}
  />}
  {live&&!nativeKeys.includes(meta.key)&&<span className="sr-only">{meta.trigger==='拖动'?'拖动体验 · 方向键可调':meta.trigger==='点击'?'点击切换 · 空格可切换':'移动指针 · 方向键可调'}</span>}
 </div>;
};
