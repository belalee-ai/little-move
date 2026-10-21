import React,{useEffect,useRef,useState} from 'react';
import {staticFile} from 'remotion';
import type {PlayerRef} from '@remotion/player';
import type {SoundProps} from './MotionSound';
import {recommendedSound,resolvedSound,SOUND_OPTIONS} from './sound-cues.js';
let audition:HTMLAudioElement|null=null;
export const stopSoundAudition=()=>{if(audition){const previous=audition;audition=null;previous.pause();previous.removeAttribute('src');previous.load();}};
export async function auditionSound(kind:string,volume:number){
 stopSoundAudition();if(kind==='off')return;
 const audio=new window.Audio(staticFile('sounds/'+kind+'.wav'));audition=audio;audio.volume=Math.max(0,Math.min(1,volume));
 try{await audio.play();}catch(error){if(audition===audio){stopSoundAudition();throw error;}}
}
const labelFor=(key:string)=>SOUND_OPTIONS.find(([id])=>id===key)?.[1]??'关闭';
export const SoundOptions:React.FC<{id:string;code:string;value:SoundProps;player:()=>PlayerRef|null;onChange:(value:SoundProps)=>void}>=({id,code,value,player,onChange})=>{
 const [open,setOpen]=useState(false),[error,setError]=useState('');const root=useRef<HTMLDivElement>(null),button=useRef<HTMLButtonElement>(null);
 const preset=value.soundPreset??'off',kind=resolvedSound(id,preset),volume=value.soundVolume??.35,recommend=recommendedSound(id);
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open]);
 useEffect(()=>()=>stopSoundAudition(),[]);
 const change=(next:string)=>{setError('');stopSoundAudition();if(next!=='off')player()?.unmute();onChange({...value,soundPreset:next});if(resolvedSound(id,next)!=='off'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)requestAnimationFrame(()=>{const p=player();if(p&&!p.getContainerNode()?.closest('[data-live="true"]')){p.seekTo(0);p.play();}});};
 return <div className="sound-options" ref={root} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();setOpen(false);button.current?.focus();}}}>
  <button ref={button} className="sound-toggle" aria-label={code+'音效设置'} aria-expanded={open} aria-controls={'sound-'+code} data-enabled={kind!=='off'} onClick={()=>setOpen(v=>!v)} title={kind==='off'?'音效已关闭':'音效：'+labelFor(kind)}><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 9h4l5-4v14l-5-4H4z"/>{kind==='off'?<path d="m17 9 5 6m0-6-5 6"/>:<path d="M17 8q5 4 0 8M16 11q1 1 0 2"/>}</svg><span>音效</span></button>
  {open&&<div className="sound-popover" id={'sound-'+code} role="group" aria-label={code+'音效选项'}>
   <label>音效<select autoFocus aria-label={code+'音效音色'} value={preset} onChange={e=>change(e.target.value)}>{SOUND_OPTIONS.map(([key,label])=><option key={key} value={key}>{key==='auto'?'推荐 · '+(recommend==='off'?'保持安静':labelFor(recommend)):label}</option>)}</select></label>
   <label>音量<span>{Math.round(volume*100)}%</span><input aria-label={code+'音效音量'} type="range" min="0" max="1" step=".05" value={volume} onChange={e=>{stopSoundAudition();onChange({...value,soundVolume:+e.target.value});}}/></label>
   <div className="sound-buttons"><button disabled={kind==='off'||volume===0} onClick={async()=>{setError('');player()?.pause();try{await auditionSound(kind,volume);}catch{setError('未能播放，请再点一次试听。');}}}>试听音色</button><button onClick={()=>change('off')}>关闭音效</button></div>
   <p>预览每次开启一张卡片的音效。</p>{error&&<p role="status">{error}</p>}
  </div>}
 </div>;
};
