import {MotionSound,type SoundProps} from './MotionSound';
import React,{useState,useRef,useLayoutEffect} from 'react';
import {useCurrentFrame,useVideoConfig,delayRender,continueRender,cancelRender} from 'remotion';
import {studyById,studyTime} from './studies/catalog.js';
import {prepareStudyAssets} from './studies/assets';
import {createVariableRenderer} from './studies/variable.js';
import {createLayoutRenderer} from './studies/layout.js';
import {createSixRenderer} from './studies/six.js';
import {createExperimentalRenderer} from './studies/experimental.js';
import {EXPERIMENTAL_STUDIES} from './studies/experimental-catalog.js';
import {createNineRenderer} from './studies/nine.js';
export type StudyProps=SoundProps&{study:string;speed?:number;scale?:number;colors?:Record<string,string>;text?:string;words?:string[];headline?:string;subline?:string;featureWord?:string;phrases?:string[];logoMode?:'gather'|'flip'|'wave';experimentalMode?:string;portraitSrc?:string;portraitMotion?:number;objectMotion?:number;clockSrc?:string;strokeGain?:number;topText?:string;bottomText?:string};
const Scene:React.FC<StudyProps>=props=>{
 const meta=studyById(props.study)!;
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),time=studyTime(props,frame,fps);
 const root=useRef<HTMLDivElement>(null),renderer=useRef<{draw:(time:number)=>void;dispose:()=>void}|null>(null),latest=useRef(time);latest.current=time;
 const [handle]=useState(()=>delayRender('加载 '+meta.name+' 的字形与素材'));
 useLayoutEffect(()=>{
  let active=true,done=false;
  const finish=()=>{if(!done){done=true;continueRender(handle);}};
  prepareStudyAssets(meta.key,props).then(assets=>{
   if(!active)return;
   const node=root.current!,canvas=node.querySelector('canvas')!;
   renderer.current=meta.key==='variable'?createVariableRenderer(node,props):meta.key==='layout'?createLayoutRenderer(node,props):['mix','ring','logo','mask','stickers','fold'].includes(meta.key)?createSixRenderer(canvas,assets,{...props,key:meta.key}):EXPERIMENTAL_STUDIES.some(s=>s.key===meta.key)?createExperimentalRenderer(canvas,assets,{...props,key:meta.key}):createNineRenderer(canvas,assets,{...props,key:meta.key});
   renderer.current!.draw(latest.current);node.dataset.studyReady='true';finish();
  }).catch(error=>{finish();if(active)cancelRender(error);});
  return()=>{active=false;renderer.current?.dispose();renderer.current=null;finish();};
 },[]);
 useLayoutEffect(()=>{renderer.current?.draw(time);},[time]);
 const background=props.colors?.[meta.palette[0]]??meta.palette[0],color=props.colors?.[meta.palette[1]]??meta.palette[1];
 return <div className="study-motion" data-study={meta.key} data-study-frame={frame} ref={root} style={{position:'absolute',inset:0,overflow:'hidden',backgroundColor:background,fontSynthesis:'none'}}><div style={{width:'100%',height:'100%',transform:`scale(${props.scale??1})`,transformOrigin:'50% 50%'}}>
  {meta.key==='variable'?<svg viewBox="0 0 800 464" style={{display:'block',width:'100%',height:'100%',color,background:background}}><g data-position=""><text data-word="" x={0} y={0} style={{fontFamily:'TypeMotionFlex',fontSize:136,fontWeight:400,fill:'currentColor',fontSynthesis:'none'}}>Breathe</text></g></svg>:meta.key==='layout'?<svg viewBox="0 0 800 520" style={{display:'block',width:'100%',height:'100%',color,background:background}}><style>{`.study-motion[data-study="layout"] .glyph{font-family:ExpressiveTypeFlex,sans-serif;font-size:100px;font-weight:400;fill:currentColor;font-variation-settings:'wght' 580,'opsz' 48;font-synthesis:none}`}</style><g data-letter-layer=""/></svg>:<canvas width={meta.width*2} height={meta.height*2} aria-label={meta.name} style={{display:'block',width:'100%',height:'100%'}}/>}
 </div></div>;
};
// Parameter changes recreate only this study's buffers. Playback is always driven by frame/fps.
export const StudyMotion:React.FC<StudyProps>=props=><><Scene key={JSON.stringify({...props,speed:undefined,soundPreset:undefined,soundVolume:undefined})} {...props}/><MotionSound id={props.study} settings={props} soundPreset={props.soundPreset} soundVolume={props.soundVolume}/></>;
