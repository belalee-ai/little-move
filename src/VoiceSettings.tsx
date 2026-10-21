import React,{useEffect,useRef,useState} from 'react';
import type {DemoProps} from './DemoMotion';
import {analyzeVoiceChannels,voiceTimeLabel} from './demos/voice-motion.js';
export const VoiceSettings:React.FC<{value:DemoProps;onChange:(p:DemoProps)=>void}>=({value,onChange})=>{
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),request=useRef(0),latest=useRef(value);latest.current=value;
 useEffect(()=>()=>{request.current++;},[]);
 const load=async(file:File)=>{
  const token=++request.current;setError('');
  if(file.size>12*1024*1024){setError('请选择12MB以内的音频。');return;}
  setBusy(true);
  try{
   const bytes=await file.arrayBuffer(),context=new OfflineAudioContext(1,1,44100),decoded=await context.decodeAudioData(bytes.slice(0));
   const analysis=analyzeVoiceChannels(Array.from({length:decoded.numberOfChannels},(_,i)=>decoded.getChannelData(i)),decoded.sampleRate);
   const audioSrc=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('音频无法读取。'));reader.readAsDataURL(file);});
   if(token===request.current)onChange({...latest.current,audioSrc,audioName:file.name,audioDuration:analysis.duration,audioEnvelope:analysis.envelope});
  }catch(cause){if(token===request.current)setError(cause instanceof Error&&cause.message.includes('请选择')?cause.message:'音频无法解码，请换成MP3、WAV或M4A。');}
  finally{if(token===request.current)setBusy(false);}
 };
 return <div>
  <label className="study-asset">显示方式<select aria-label="语音波形样式" value={value.voiceStyle??'live'} onChange={e=>onChange({...value,voiceStyle:e.target.value as DemoProps['voiceStyle']})}><option value="live">说话起伏</option><option value="timeline">波形进度</option></select></label>
  <label className="study-asset">替换语音<input type="file" accept="audio/*,.mp3,.wav,.m4a" aria-label="替换语音音频" disabled={busy} onChange={e=>{const file=e.target.files?.[0];e.currentTarget.value='';if(file)void load(file);}}/><span role="status">{busy?'正在分析音量…':value.audioSrc?`${value.audioName??'本地音频'} · ${voiceTimeLabel(value.audioDuration??8)}`:'节奏示例（无声）'}</span></label>
  {value.audioSrc&&<button onClick={()=>{request.current++;onChange({...value,audioSrc:undefined,audioName:undefined,audioDuration:undefined,audioEnvelope:undefined});}}>恢复节奏示例</button>}
  {error&&<p role="alert">{error}</p>}
  <p className="study-form-note">支持0.5秒至2分钟、12MB以内的音频。仅在本机分析；替换后按真实音量起伏，时长与进度同步更新。预览默认静音，可打开播放器声音。下载配置包含音频。</p>
 </div>;
};
