import React from 'react';
import {Audio,Sequence,staticFile,useVideoConfig} from 'remotion';
import {soundCues,SOUND_SECONDS} from './sound-cues.js';
export type SoundProps={soundPreset?:string;soundVolume?:number};
export const MotionSound:React.FC<SoundProps&{id:string;settings:Record<string,any>}>=({id,settings,soundPreset,soundVolume=.35})=>{
 const {fps,durationInFrames}=useVideoConfig();
 if(!soundPreset||soundPreset==='off')return null;
 const cues=soundCues(id,{...settings,soundPreset},fps,durationInFrames) as {frame:number;kind:string}[];
 return <>{cues.map(({frame,kind},i)=><Sequence key={frame+'-'+i} from={frame} durationInFrames={Math.min(durationInFrames-frame,Math.ceil((SOUND_SECONDS[kind as keyof typeof SOUND_SECONDS]??.44)*fps))} layout="none" name={'音效 '+kind}><Audio src={staticFile('sounds/'+kind+'.wav')} volume={Math.max(0,Math.min(1,soundVolume))}/></Sequence>)}</>;
};
