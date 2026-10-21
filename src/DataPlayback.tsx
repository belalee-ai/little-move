import React,{useEffect,useState} from 'react';
import type {PlayerRef} from '@remotion/player';
export const DataPlayback:React.FC<{player:React.RefObject<PlayerRef|null>;duration:number;label?:string}>=({player,duration,label='数据动效'})=>{
 const [frame,setFrame]=useState(0),[playing,setPlaying]=useState(false);
 useEffect(()=>{const p=player.current;if(!p)return;const update=(event:{detail:{frame:number}})=>setFrame(event.detail.frame),status=()=>setPlaying(p.isPlaying());p.addEventListener('frameupdate',update);p.addEventListener('play',status);p.addEventListener('pause',status);setFrame(p.getCurrentFrame());status();return()=>{p.removeEventListener('frameupdate',update);p.removeEventListener('play',status);p.removeEventListener('pause',status);};},[player]);
 return <div className="data-playback"><button aria-label={playing?'暂停'+label:'播放'+label} onClick={()=>{const p=player.current;if(p?.isPlaying())p.pause();else p?.play();}}>{playing?'Ⅱ':'▶'}</button><input type="range" aria-label={label==='数据动效'?'数据预览进度':'动效预览进度'} min={0} max={duration-1} value={Math.min(frame,duration-1)} onChange={e=>{player.current?.pause();player.current?.seekTo(+e.target.value);}}/><span>{(frame/60).toFixed(1)} / {(duration/60).toFixed(1)}s</span></div>;
};
