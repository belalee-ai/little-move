import {MotionSound,type SoundProps} from './MotionSound';
import React,{useEffect,useState} from 'react';
import {delayRender,continueRender,cancelRender,useCurrentFrame,useVideoConfig,spring,Interactive,type InteractivitySchema} from 'remotion';
import {TextVisual} from './TextVisual.jsx';
export type MotionProps=SoundProps&{text:string;englishText:string;bilingual:boolean;impact:number;effect:string;color:string;accent:string;background:string;transparentBackground:boolean;fontFamily:string;fontSize:number;speed:number;startSeconds:number;scatter:number;seed:number;lightOnDark?:boolean;lightColor?:string;markerColor?:string;karaokeColor?:string;alternateText?:string;englishAlternateText?:string;style?:React.CSSProperties};
import {loadPreviewFonts} from './fonts';
export {loadPreviewFonts} from './fonts';
const Inner:React.FC<MotionProps>=({style,...props})=>{
 const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig();
 const [handle]=useState(()=>delayRender('Loading bundled Chinese fonts'));
 useEffect(()=>{loadPreviewFonts(props.fontFamily).then(()=>continueRender(handle)).catch(cancelRender);},[handle,props.fontFamily]);
 return <Interactive.Div name="文字动效" style={{position:'absolute',inset:0,...style}}><TextVisual props={props} frame={frame} fps={fps} durationInFrames={durationInFrames} spring={spring}/><MotionSound id={props.effect} settings={props} soundPreset={props.soundPreset} soundVolume={props.soundVolume}/></Interactive.Div>;
};
const schema={
 alternateText:{type:'text-content',default:'让表达更有力量',description:'换词中文'},englishAlternateText:{type:'text-content',default:'Give ideas a voice',description:'换词英文'},
 text:{type:'text-content',default:'把重点讲清楚',description:'中文整句'},
 englishText:{type:'text-content',default:'Make the point clear',description:'英文对比'},bilingual:{type:'boolean',default:true,description:'中英对比'},impact:{type:'number',hiddenFromList:false,default:1.4,min:.6,max:1.8,description:'动感强度'},
 effect:{type:'enum',default:'gather',description:'动效',variants:{word:{},blur:{},mask:{},typewriter:{},wave:{},flip:{},gather:{},typing:{},fade:{},slide:{},bounce:{},zoom:{},tracking:{},spin:{},roll:{},flipUp:{},scramble:{},glitch:{},shine:{},gradient:{},outline:{},neon:{},echo:{},focus:{},marquee:{},circle:{},cycle:{},highlight:{},impact:{},karaoke:{}}},
 color:{type:'color',default:'#203222',description:'文字颜色'},accent:{type:'color',default:'#A9E83F',description:'光标颜色'},background:{type:'color',default:'#F8FBF2',description:'底色'},
 lightOnDark:{type:'boolean',default:true,description:'光影深色底'},
 lightColor:{type:'color',default:'#26D9FF',description:'霓虹颜色'},
 markerColor:{type:'color',default:'#E7FF3F',description:'荧光标记颜色'},
 karaokeColor:{type:'color',default:'#6936F5',description:'歌词高亮颜色'},
 transparentBackground:{type:'boolean',default:false,description:'透明背景'},fontFamily:{type:'font-family',default:'Noto Sans SC',description:'字体'},
 fontSize:{type:'number',hiddenFromList:false,default:128,min:56,max:150,description:'字号'},speed:{type:'number',hiddenFromList:false,default:1,min:.5,max:2,description:'动作速度'},
 startSeconds:{type:'number',hiddenFromList:false,default:.3,min:0,max:2,description:'触发时间（秒）'},scatter:{type:'number',hiddenFromList:false,default:1,min:.2,max:1.3,description:'散字幅度'},seed:{type:'number',hiddenFromList:false,default:17,min:0,max:999,integer:true,description:'散字排列'}
} as const satisfies InteractivitySchema;
export const TextMotion=Interactive.withSchema({Component:Inner,componentName:'TextMotion',schema,wrapInSequence:true});
