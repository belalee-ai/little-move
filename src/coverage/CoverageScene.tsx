import React,{useEffect,useState} from 'react';
import {useCurrentFrame,useVideoConfig,delayRender,continueRender,cancelRender} from 'remotion';
import type {DemoProps} from '../DemoMotion';
import {loadPreviewFonts} from '../fonts';import {loadStudyFonts} from '../studies/assets';
import {coverageById} from './catalog.js';import {cue} from './motion.js';
import {TypographyScenes} from './TypographyScenes';import {ImageScenes} from './ImageScenes';import {LayoutScenes} from './LayoutScenes';import {ControlScenes} from './ControlScenes';import {CoverageData,CoverageAudio} from './DataScenes';
export const CoverageScene:React.FC<{p:DemoProps;t:number}>=({p,t})=>{
 const meta=coverageById(p.demo)!;const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig(),[handle]=useState(()=>delayRender('分类补齐字体'));
 useEffect(()=>{Promise.all([loadPreviewFonts(),...(meta.role==='text'?[loadStudyFonts(['SixType','NineSwash'])]:[])]).then(()=>continueRender(handle)).catch(cancelRender);return()=>continueRender(handle);},[handle,meta.role]);
 const props={p,t,mode:meta.mode,variant:meta.variant,category:meta.category};
 return <div data-coverage-mode={meta.mode} data-coverage-category={meta.category} data-coverage-time={t.toFixed(3)} style={{position:'absolute',inset:0,fontFamily:'Noto Sans SC, sans-serif',fontSynthesis:'none',opacity:p.input?1:meta.role==='audio'?1:cue(frame/fps,.03,.3)*(1-cue(frame/fps,durationInFrames/fps-.45,.4))}}>
 {meta.role==='text'?<TypographyScenes {...props}/>:meta.role==='image'?<ImageScenes {...props}/>:meta.role==='layout'?<LayoutScenes {...props}/>:meta.role==='control'?<ControlScenes {...props}/>:meta.role==='audio'?<CoverageAudio {...props}/>:<CoverageData {...props}/>}
 </div>;
};
