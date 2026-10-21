import {CoverageScene} from './coverage/CoverageScene';
import {isCoverage} from './coverage/catalog.js';
import {MotionSound,type SoundProps} from './MotionSound';
import {VoiceControls} from './voice-ui/VoiceControls';
import {AppleControls} from './voice-ui/AppleControls';
import {VOICE_CONTROL_KEYS,APPLE_CONTROL_KEYS} from './voice-ui/catalog.js';
import {VerificationScene} from './verification/VerificationScene';
import {VERIFICATION_KEYS} from './verification/catalog.js';
import {BatchTextScene} from './batch/TextScenes';
import {BatchGraphicScene} from './batch/GraphicScenes';
import {BatchControlScene} from './batch/ControlScenes';
import {BatchDataScene} from './batch/DataScenes';
import {BATCH_TEXT_KEYS,BATCH_GRAPHIC_KEYS,BATCH_CONTROL_KEYS,BATCH_DATA_KEYS} from './batch/catalog.js';
import {VoiceScene} from './VoiceScene';
import React from 'react';
import {FeedbackScene} from './FeedbackScenes';
import {ExtraDataScene} from './ExtraDataScenes';
import {FEEDBACK_KEYS,EXTRA_DATA_DEFAULTS} from './demos/expansion-catalog.js';
import {ParallaxScene} from './ParallaxScene';
import {DataScene} from './DataScenes';
import {isDataDemo} from './demos/data-motion.js';
import {NativeScene,contentKeys,type NativeControls} from './NativeScenes';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {demoById,demoDefaults,demoState,mix,clamp} from './demos/catalog.js';
import {cue,mod} from './demos/motion.js';
import {revealPhotoState,loopFocus} from './demos/image-motion.js';
export type DemoInput={x:number;y:number;progress:number;index:number;active:boolean;vx?:number;vy?:number;transition?:{from:DemoInput;frame:number;duration?:number;kind?:'pointer'|'layout'|'snap';velocity?:number}};
export type DemoProps=SoundProps&{demo:string;speed?:number;strength?:number;background?:string;accent?:string;title?:string;fit?:'contain'|'cover';images?:string[];input?:DemoInput;native?:NativeControls;dataValues?:string;dataStartValues?:string;dataLabels?:string;unit?:string;motionText?:string;replacementText?:string;verifyTolerance?:number;voiceStyle?:'live'|'timeline';audioSrc?:string;audioName?:string;audioDuration?:number;audioEnvelope?:number[]};
const box:React.CSSProperties={position:'absolute',overflow:'hidden'};
const themes=['#bad1d7','#eed0b7','#dce4d2','#d6c9dc','#e6c7be','#ccd8c1'];
export const DemoMotion:React.FC<DemoProps>=props=>{
 const p={...demoDefaults(props.demo),...props},meta=demoById(p.demo)!,frame=useCurrentFrame(),{fps}=useVideoConfig(),s=demoState(p,frame,fps),z=p.strength??1;
 const image=(i:number,style:React.CSSProperties={})=>{const src=p.images?.[mod(i,p.images.length)]||demoDefaults(p.demo).images[mod(i,3)];return <Img src={src.startsWith('/')?staticFile(src.slice(1)):src} draggable={false} style={{width:'100%',height:'100%',objectFit:p.fit,display:'block',...style}}/>;};
 const label=(text:string,x:number,y:number,size=18,style:React.CSSProperties={})=><div style={{position:'absolute',left:x,top:y,fontSize:size,lineHeight:1.15,...style}}>{text}</div>;
 const panel=(i:number,x:number,y:number,w:number,h:number,style:React.CSSProperties={},content?:React.ReactNode)=><div key={i} data-tile={i} style={{...box,left:0,top:0,width:w,height:h,transform:`translate3d(${x}px,${y}px,0)`,borderRadius:14,background:themes[mod(i,6)],...style}}>{content??image(i)}</div>;
 const autoCursor=(x=s.x*800,y=s.y*500,opacity=s.gain,press=0)=><div style={{position:'absolute',left:0,top:0,transform:`translate3d(${x}px,${y}px,0)`,opacity,zIndex:40,pointerEvents:'none'}}>{press>.01&&<span style={{position:'absolute',left:-20,top:-20,width:40,height:40,border:'2px solid #1b2928',borderRadius:'50%',opacity:press,transform:`scale(${1+(1-press)*.4})`}}/>}<svg width="30" height="36" viewBox="0 0 30 36" style={{filter:'drop-shadow(0px 2px 2px #0004)',transform:`scale(${1-press*.14})`}}><path d="M3 2L24 22L14 23L10 32Z" fill="#fafbf8" stroke="#202922" strokeWidth="1.8" strokeLinejoin="round"/></svg></div>;
 const auto=!p.input,t=s.t;
 let scene:React.ReactNode;
 switch(meta.key){
 case 'reveal':{
  const state=revealPhotoState(t),w=mix(140,690,state.open),h=mix(260,374,state.open),top=(432-h)/2,side=(690-w)/2;
  const layers=(backdrop=false)=>[0,1,2].map(i=>{
    const opacity=i===state.to?state.blend:i===state.from?1:0,phase=t*Math.PI/4+i*Math.PI*2/3;
    return <div key={i} data-photo={i} style={{...box,inset:0,opacity,zIndex:i===state.to?2:i===state.from?1:0,transform:`scale(${backdrop?1.12:1.035+.012*Math.sin(phase)}) translateY(${backdrop?0:4*Math.cos(phase)*z}px)`,willChange:'transform, opacity'}}>{image(i)}</div>;
  });
  scene=<><div style={{...box,inset:'48px 55px',opacity:.1,filter:'blur(14px)',transform:'translateZ(0)'}}>{layers(true)}</div><div style={{...box,left:55,top:34,width:690,height:432,clipPath:`inset(${top}px ${side}px round ${mix(58,12,state.open)}px)`,willChange:'clip-path',transform:'translateZ(0)'}}>{layers()}</div></>;
  break;}
 case 'carousel':{
  scene=<>{[0,1,2].map(i=>{const angle=(i-s.turn)*Math.PI*2/3,depth=(1+Math.cos(angle))/2,x=195+Math.sin(angle)*205,y=58+(1-depth)*18,scale=.73+depth*.27;return <div key={i} data-tile={i} style={{...box,left:0,top:0,width:410,height:350,borderRadius:16,background:'#fafbf7',padding:12,transform:`translate3d(${x}px,${y}px,${depth*20}px) perspective(900px) rotateY(${Math.sin(angle)*-24}deg) rotate(${Math.sin(angle)*7}deg) scale(${scale})`,zIndex:[0,1,2].filter(j=>Math.cos((j-s.turn)*Math.PI*2/3)<=Math.cos(angle)).length,willChange:'transform',backfaceVisibility:'hidden',boxShadow:'0 24px 38px #18302e24'}}><div style={{height:326,overflow:'hidden',borderRadius:7,background:themes[i]}}>{image(i)}</div></div>;})}<div style={{...box,bottom:35,left:345,display:'flex',gap:12}}>{[0,1,2].map(i=><span key={i} style={{width:7+27*loopFocus(s.turn,i),height:5,borderRadius:6,opacity:.3+.7*loopFocus(s.turn,i),background:'#3d5657'}}/>)}</div></>;break;}
 case 'parallax':{scene=<><ParallaxScene p={p} s={s}/>{auto&&autoCursor()}</>;break;}
 case 'compare':{
  const cut=auto ? .5+.4*Math.sin(t*Math.PI/4) : s.p,paired=p.images[0]===p.images[1];
  scene=<><div style={{...box,left:58,top:49,width:684,height:390,borderRadius:16,background:themes[0],boxShadow:'0 16px 36px #18342f10'}}>{image(0,{filter:paired?'grayscale(1) contrast(.85)':'none'})}<div style={{...box,inset:0,clipPath:`inset(0 ${(1-cut)*100}% 0 0)`}}>{image(1)}</div><div style={{...box,top:0,bottom:0,left:cut*684-1,width:2,background:'#fdfbf4',boxShadow:'0 0 12px #142d3b55'}}/><div style={{...box,left:clamp(cut*684-22,0,640),top:174,width:44,height:44,borderRadius:'50%',background:'#fafbf5ed',color:'#29444c',display:'grid',placeItems:'center',fontSize:23,boxShadow:'0 4px 18px #0002'}}>↔</div></div>{auto&&autoCursor(58+cut*684,250,.8)}</>;break;}
 case 'drag':{
  scene=<>{[-1,0,1,2,3].map(i=>{const distance=Math.abs(i-s.index),focus=1-clamp(distance),x=243+(i-s.index)*334,y=65+(1-focus)*13-s.grab*10*focus,scale=.88+.12*focus+s.grab*.025*focus;return panel(i+3,x,y,314,344,{overflow:'visible',background:'transparent',transform:`translate3d(${x}px,${y}px,0) rotate(${clamp(s.vx,-2,2)*-2*focus}deg) scale(${scale})`,willChange:'transform',boxShadow:'0 18px 30px #00000018'},<div style={{...box,inset:0,borderRadius:16,background:'#f6f6f7',padding:10}}><div style={{height:324,borderRadius:8,overflow:'hidden',background:themes[mod(i,3)]}}>{image(mod(i,3))}</div></div>);})}{[0,1,2].map(i=><div key={i} style={{...box,left:363+i*28,top:449,width:7+16*Math.max(0,1-Math.abs(s.index-i)),height:5,borderRadius:8,opacity:.3+.7*Math.max(0,1-Math.abs(s.index-i)),background:'#55585f'}}/>)}{auto&&autoCursor(s.x*800,s.y*500,.65+.35*s.grab,s.grab*.7)}</>;break;}
 }
 if(contentKeys.includes(meta.key))scene=<><NativeScene p={p} s={s} kind={meta.key} auto={auto}/>{auto&&['tilt','magnet'].includes(meta.key)&&autoCursor(s.x*800,s.y*500,s.gain,0)}</>;
 if(isDataDemo(p.demo)&&!BATCH_DATA_KEYS.includes(meta.key))scene=Object.hasOwn(EXTRA_DATA_DEFAULTS,meta.key)?<ExtraDataScene p={p} frame={frame} fps={fps} kind={meta.key}/>:<DataScene p={p} frame={frame} fps={fps}/>;
 if(BATCH_TEXT_KEYS.includes(meta.key))scene=<BatchTextScene p={p} t={t} kind={meta.key}/>;
 if(BATCH_GRAPHIC_KEYS.includes(meta.key))scene=<BatchGraphicScene p={p} t={t} kind={meta.key}/>;
 if(BATCH_CONTROL_KEYS.includes(meta.key))scene=<BatchControlScene p={p} t={t} kind={meta.key} state={s}/>;
 if(BATCH_DATA_KEYS.includes(meta.key))scene=<BatchDataScene p={p} t={t} kind={meta.key}/>;
 if(VERIFICATION_KEYS.includes(meta.key))scene=<VerificationScene p={p} t={t} kind={meta.key}/>;
 if(VOICE_CONTROL_KEYS.includes(meta.key))scene=<VoiceControls p={p} t={t} kind={meta.key}/>;
 if(APPLE_CONTROL_KEYS.includes(meta.key))scene=<AppleControls p={p} t={t} kind={meta.key}/>;
 if(meta.key==='voice')scene=<VoiceScene p={p} frame={frame} fps={fps}/>;
 if(FEEDBACK_KEYS.includes(meta.key))scene=<FeedbackScene p={p} t={t} kind={meta.key} state={s}/>;
 if(isCoverage(p.demo))scene=<CoverageScene p={p} t={t}/>;
 return <AbsoluteFill data-demo={meta.key} data-demo-frame={frame} data-demo-index={s.index} style={{background:p.background,color:['grid','bento','expand','accordion','tilt','magnet','follow','drag','press','input','switch','tabs'].includes(meta.key)?'#242528':'#253f40',fontFamily:'Arial, sans-serif',overflow:'hidden'}}>{scene}<MotionSound id={p.demo} settings={p} soundPreset={p.soundPreset} soundVolume={p.soundVolume}/></AbsoluteFill>;
};
