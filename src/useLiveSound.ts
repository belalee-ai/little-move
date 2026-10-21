import {useEffect,useRef,useState} from 'react';
import type React from 'react';
import type {PlayerRef} from '@remotion/player';
import {staticFile} from 'remotion';
import {resolvedSound} from './sound-cues.js';
import type {SoundProps} from './MotionSound';
/** Native gestures are event-driven. Automatic cues are disabled by MotionSound in live mode. */
export function useLiveSound(id:string,value:SoundProps,live:boolean,player:React.RefObject<PlayerRef|null>){
 const audio=useRef<HTMLAudioElement|null>(null),last=useRef(-Infinity),[error,setError]=useState('');
 const stop=()=>{audio.current?.pause();};
 useEffect(()=>{
  const p=player.current,element=audio.current;const sync=()=>{stop();};const visibility=()=>{if(document.hidden)stop();};
  p?.addEventListener('pause',sync);p?.addEventListener('seeked',sync);p?.addEventListener('mutechange',sync);p?.addEventListener('volumechange',sync);document.addEventListener('visibilitychange',visibility);
  return()=>{element?.pause();p?.removeEventListener('pause',sync);p?.removeEventListener('seeked',sync);p?.removeEventListener('mutechange',sync);p?.removeEventListener('volumechange',sync);document.removeEventListener('visibilitychange',visibility);};
 },[id,live,value.soundPreset,value.soundVolume,player]);
 const emit=(typing=false)=>{
  const p=player.current,kind=resolvedSound(id,value.soundPreset);if(!live||kind==='off'||p?.isMuted()||document.hidden)return;
  const now=performance.now();if(now-last.current<55)return;last.current=now;stop();setError('');
  const element=audio.current;if(!element)return;element.src=staticFile('sounds/'+(typing&&value.soundPreset==='auto'?'tick':kind)+'.wav');element.volume=Math.max(0,Math.min(1,(value.soundVolume??.35)*(p?.getVolume()??1)));
  element.play().catch(e=>{if(e.name!=='AbortError')setError('音效未能播放，请关闭后重新开启。');});
 };
 const target=(e:React.SyntheticEvent)=>e.target instanceof Element&&e.target.closest('[data-demo],.demo-input');
 return {error,audioRef:audio,handlers:{
  onClickCapture:(e:React.MouseEvent)=>{if(target(e)&&e.target instanceof Element&&e.target.closest('button,[role="button"],[role="switch"],input[type="checkbox"],input[type="range"],.demo-input'))emit();},
  onPointerDownCapture:(e:React.PointerEvent)=>{if(target(e)&&id==='demo-push-talk')emit();},
  onPointerUpCapture:(e:React.PointerEvent)=>{if(target(e)&&e.target instanceof Element&&e.target.closest('input[type="range"],.demo-input'))emit();},
  onFocusCapture:(e:React.FocusEvent)=>{if(target(e)&&e.target instanceof HTMLInputElement&&e.target.type!=='range')emit();},
  onInputCapture:(e:React.FormEvent)=>{if(target(e)&&(e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLInputElement&&e.target.type!=='range'))emit(true);},
  onWheelCapture:(e:React.WheelEvent)=>{if(target(e)&&id==='demo-ios-wheel')emit();},
  onKeyDownCapture:(e:React.KeyboardEvent)=>{if(target(e)&&!e.repeat&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))emit();},
 }};
}
