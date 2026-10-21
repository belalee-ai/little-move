import {COVERAGE_NATIVE_KEYS} from './coverage/catalog.js';
import {VOICE_UI_KEYS} from './voice-ui/catalog.js';
import {VERIFICATION_KEYS} from './verification/catalog.js';
import {BATCH_CONTROL_KEYS} from './batch/catalog.js';
import React from 'react';
import {PointerObjectScene} from './PointerScenes';
import {FEEDBACK_KEYS} from './demos/expansion-catalog.js';
import {clamp,mix} from './demos/catalog.js';
import {cue,smooth} from './demos/motion.js';
import {gridPose,bentoGrowth} from './demos/native-motion.js';
import type {DemoProps} from './DemoMotion';
export type NativeControls={reducedMotion?:boolean;text:string;focused:boolean;onText:(text:string)=>void;onFocus:(focused:boolean)=>void;onSelect:(index:number)=>void;onToggle:()=>void;onPointer:(x:number,y:number,active:boolean)=>void;onScrub?:(value:number,release?:boolean)=>void};
type State={t:number;p:number;index:number;x:number;y:number;gain:number;press:number};
const absolute:React.CSSProperties={position:'absolute'};
// Matte surfaces: hierarchy comes from tone and elevation, shared by preview and export.
const surface={white:'#ffffff',soft:'#f8f8f6',muted:'#e9e9e6',dark:'#292928',thumb:'#ffffff'};
const colors=[surface.white,surface.muted,surface.soft,'#e1e1de','#f0f0ed',surface.dark];
const ink=(i:number)=>i===5?'#f7f7f5':'#262625';
const edge='0 0 0 1px #2424240b';
const colorChannels=(color:string)=>/^#[\da-f]{6}$/i.test(color)?[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)):[52,54,58];
const accentForeground=(color:string)=>{
 const [r,g,b]=colorChannels(color).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
 return .2126*r+.7152*g+.0722*b>.179?'#242528':'#f7f7f8';
};
const blendInk=(from:string,to:string,p:number)=>`rgb(${colorChannels(from).map((v,i)=>Math.round(mix(v,colorChannels(to)[i],clamp(p)))).join(',')})`;
const titles=['Research','Design','Prototype','Feedback','Build','Launch'];
const button:React.CSSProperties={font:'inherit',border:0,padding:0,color:'inherit',cursor:'pointer'};
export const nativeKeys=['scroll-grain','magnetic-grid',...COVERAGE_NATIVE_KEYS,...VOICE_UI_KEYS,...VERIFICATION_KEYS,...BATCH_CONTROL_KEYS,...FEEDBACK_KEYS,'tilt','follow','accordion','magnet','press','input','switch','tabs'];
export const contentKeys=['grid','bento','expand','accordion','tilt',...nativeKeys.filter(key=>!FEEDBACK_KEYS.includes(key))];
export const NativeScene:React.FC<{p:DemoProps;s:State;kind:string;auto:boolean}>=({p,s,kind,auto})=>{
 const n=p.native,q=s.p,t=s.t,selected=n?Math.round(p.input?.index??s.index):Math.round(s.index),accent=p.accent??'#34363a',onAccent=accentForeground(accent);
 const tile=(i:number,x:number,y:number,w:number,h:number,style:React.CSSProperties,content:React.ReactNode)=><div key={i} data-tile={i} style={{...absolute,left:x,top:y,width:w,height:h,borderRadius:14,overflow:'hidden',color:ink(i),boxShadow:edge,...style}}>{content}</div>;
 const caption=(text:string,x:number,y:number,size=16,extra:React.CSSProperties={})=><div style={{...absolute,left:x,top:y,fontSize:size,...extra}}>{text}</div>;
 if(kind==='grid')return <>{[0,1,2,3,4,5].map(i=>{
  const pose=gridPose(t,i,auto?undefined:q,p.strength??1),{x,y,w,h,angle,lift}=pose;
  return tile(i,x,y,w,h,{background:colors[i],transform:`rotate(${angle}deg) scale(${1+lift*.035})`,zIndex:Math.round(lift*10),boxShadow:`${edge},0 ${2+lift*14}px ${18+lift*12}px #00000010`},caption(titles[i],20,(h-31)/2,27,{fontWeight:550,letterSpacing:-.8}));
 })}</>;
 if(kind==='bento'){
  const growth=bentoGrowth(t,auto?undefined:q),plot=<svg data-bento-progress={growth.progress} viewBox="0 0 360 220" width="100%" height="100%" style={{overflow:'visible'}}>
   <path d="M14 190H346M14 140H346M14 90H346M14 40H346" fill="none" stroke="#2626250c"/>
   <path d={growth.area} fill="#29292808"/>
   <path d={growth.d} fill="none" stroke="#444442" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
   <circle cx={growth.head.x} cy={growth.head.y} r="10" fill="#2929280c"/>
   <circle cx={growth.head.x} cy={growth.head.y} r="4.8" fill="#292928" stroke="white" strokeWidth="2"/>
  </svg>;
  return <>{tile(0,48,52,mix(336,498,q),388,{background:surface.white,color:'#242528'},<div style={{...absolute,left:22,right:22,bottom:45,height:280}}>{plot}</div>)}
   {tile(1,mix(400,562,q),52,mix(344,182,q),186,{background:surface.white,color:'#242528'},caption(String(Math.round(growth.count)),22,62,66,{letterSpacing:-3,fontVariantNumeric:'tabular-nums'}))}
   {tile(2,mix(400,562,q),254,mix(344,182,q),186,{background:surface.muted,color:'#242528'},<>
    <div data-bento-percent={growth.percent} style={{...absolute,left:22,top:62,fontSize:53,letterSpacing:-2,fontVariantNumeric:'tabular-nums'}}>{Math.round(growth.percent)}%</div>
    <div style={{...absolute,left:22,right:22,bottom:28,height:7,background:'#24252812',borderRadius:8}}><div style={{width:growth.percent+'%',height:'100%',borderRadius:8,background:'#424240'}}/></div>
   </>)}
  </>;
 }
 if(kind==='expand'){
  const lead=cue(q,.4,.6,smooth),x=mix(66,56,q),y=mix(95,44,q),w=mix(218,688,q),h=mix(280,412,q),artW=mix(170,260,q),artH=mix(140,250,cue(q,.35,.65,smooth)),artX=w-24-artW;
  return <>{[1,2].map(i=>tile(i,66+i*230+q*115,95+(i===1?-1:1)*q*24,218,280,{background:colors[i],opacity:1-cue(q,.08,.7),transform:`rotate(${q*(i===1?-7:7)}deg)`},<div aria-hidden="true" style={{...absolute,left:24,right:24,top:120,height:38,borderRadius:6,background:'#262625',opacity:.10}}/>))}
   {tile(0,x,y,w,h,{background:surface.white,boxShadow:`${edge},0 ${3+q*9}px 28px #0000000e`},<>
    <div data-shared-graphic style={{...absolute,left:artX,top:mix(28,54,q),width:artW,height:artH,borderRadius:12,background:'#eeeee9',overflow:'hidden'}}>
     <div style={{...absolute,left:artW*.13,top:artH*.14,width:artW*.62,height:artW*.62,borderRadius:'50%',background:'#333332',transform:`translate(${lead*10}px,${-lead*7}px)`}}/>
     <div style={{...absolute,left:artW*.46,top:artH*.48,width:artW*.47,height:artH*.58,borderRadius:8,background:'#cdcdc7',transform:`rotate(${-18+lead*18}deg)`}}/>
    </div>
    {caption(p.title??'Details',mix(24,30,lead),mix(208,52,lead),mix(29,43,lead),{maxWidth:lead>0?Math.min(310,artX-48):w-48,lineHeight:1.12,fontWeight:550,letterSpacing:-1.3})}
    <div aria-hidden="true" style={{...absolute,left:30,top:mix(268,132,lead),width:Math.min(280,w-60)}}>{[.92,.76,.86,.55].map((width,i)=>{const reveal=cue(q,.6+i*.075,.175);return <div key={i} style={{width:width*100+'%',height:i===0?13:9,marginBottom:20,borderRadius:5,background:'#303945',opacity:reveal*(i===0?.15:.09),transformOrigin:'left',transform:`translateY(${(1-reveal)*16}px) scaleX(${.65+.35*reveal})`}}/>;})}</div>
   </>)}
  </>;
 }
 if(kind==='accordion'){
  const weights=[0,1,2].map(i=>Math.pow(Math.max(0,1-Math.abs(s.index-i)),1.3)),sum=weights.reduce((a,b)=>a+b,0);let x=44;
  return <>{weights.map((v,i)=>{
   const share=v/(sum||1),w=110+share*358,left=x;x+=w+10;
   return <button key={i} type="button" aria-label={['展开发现面板','展开制作面板','展开发表面板'][i]} aria-expanded={selected===i} tabIndex={n?0:-1} onClick={()=>n?.onSelect(i)} style={{...button,...absolute,left,top:58,width:w,height:372,borderRadius:18,textAlign:'left',overflow:'hidden',background:blendInk(surface.muted,surface.white,share),color:'#262625',boxShadow:edge,pointerEvents:n?'auto':'none'}}>
    {caption(['Discover','Create','Share'][i],mix(78,26,share),mix(75,80,share),mix(36,43,share),{fontWeight:550,letterSpacing:-1.4,whiteSpace:'nowrap',transformOrigin:'left top',transform:`rotate(${(1-share)*90}deg)`})}
    <div aria-hidden="true" style={{...absolute,left:26,top:183,width:360,height:130}}>{[0,1,2,3].map(j=>{const reveal=cue(share,.2+j*.09,.45);return <div key={j} style={{...absolute,left:j%2*166,top:Math.floor(j/2)*66,width:154,height:54,borderRadius:9,background:['#e9e9e5','#30302e','#f3f3f0','#deded8'][(j+i)%4],opacity:reveal,transform:`translateY(${(1-reveal)*30}px) scale(${.88+.12*reveal})`}}/>;})}</div>
    {caption(selected===i?'−':'+',w-46,316,29)}
   </button>;
  })}</>;
 }
 if(['tilt','magnet','follow'].includes(kind))return <PointerObjectScene p={p} s={s} kind={kind} auto={auto}/>;
 if(kind==='press')return <button type="button" aria-label="保存示例" tabIndex={n?0:-1} onClick={()=>n?.onToggle()} style={{...button,...absolute,left:235,top:192,width:330,height:105,borderRadius:18,overflow:'hidden',background:accent,color:onAccent,transform:`translateY(${Math.sin(q*Math.PI)*4}px) scale(${1-Math.sin(q*Math.PI)*.055})`,boxShadow:`0 ${4-Math.sin(q*Math.PI)*3}px 10px #00000015`,fontSize:30,fontWeight:500,pointerEvents:n?'auto':'none'}}><span style={{...absolute,inset:0,display:'grid',placeItems:'center',opacity:1-q,transform:`translateY(${-q*28}px)`}}>Save</span><span style={{...absolute,inset:0,display:'flex',alignItems:'center',justifyContent:'center',gap:15,opacity:q,transform:`translateY(${(1-q)*28}px)`}}><svg width="30" height="30" viewBox="0 0 30 30"><path d="M5 15l7 7L26 7" fill="none" stroke={onAccent} strokeWidth="2.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-cue(q,.3,.7,smooth)}/></svg>Saved</span></button>;
 if(kind==='input'){
  const typed=n?n.text:'hello@bela.studio'.slice(0,Math.floor(cue(t,1.4,2.2)*(1-cue(t,5.6,1.3))*17)),focused=n?n.focused:(t>.7&&t<6.9),float=n?(typed.length>0&&!focused?1:q):typed.length>0?1:q;
  return <><div style={{...absolute,left:151,top:185,width:498,height:107,borderRadius:17,background:surface.white,border:`1px solid ${focused?'#737370':'#d5d5d1'}`,boxShadow:`0 0 0 ${focused?4*s.gain:0}px #24242408,0 2px 5px #00000003`}}><label htmlFor={n?'bela-live-email':'bela-auto-email'} style={{...absolute,left:23,top:mix(34,13,float),fontSize:mix(26,13,float),color:'#62656b',pointerEvents:'none'}}>Email</label><input id={n?'bela-live-email':'bela-auto-email'} type="email" aria-label="输入邮箱示例" value={typed} readOnly={!n} tabIndex={n?0:-1} onChange={e=>n?.onText(e.target.value)} onFocus={()=>n?.onFocus(true)} onBlur={()=>n?.onFocus(false)} placeholder="" style={{...absolute,left:22,top:40,width:450,height:47,border:0,outline:'none',padding:0,background:'transparent',color:'#242528',fontFamily:'inherit',fontSize:27,caretColor:'#34363a',pointerEvents:n?'auto':'none'}}/>{!n&&focused&&<div style={{...absolute,left:24+typed.length*14.1,top:48,width:2,height:28,background:'#34363a',opacity:Math.floor(t*2)%2===0?1:0}}/>}</div></>;
 }
 if(kind==='switch')return <div style={{...absolute,left:150,top:155,width:500,height:182,padding:'42px 36px',borderRadius:24,background:surface.soft,boxShadow:`${edge},0 3px 12px #00000006`}}><div style={{...absolute,left:36,top:72,fontSize:31,fontWeight:550}}>Quiet mode</div><button type="button" role="switch" aria-label="安静模式示例" aria-checked={n?(p.input?.progress??0)>.5:q>.5} tabIndex={n?0:-1} onClick={()=>n?.onToggle()} style={{...button,...absolute,right:34,top:62,width:102,height:58,borderRadius:40,overflow:'hidden',background:surface.muted,boxShadow:`${edge},0 2px 4px #00000012`,pointerEvents:n?'auto':'none'}}><span style={{...absolute,inset:0,borderRadius:40,background:accent,opacity:q}}/><span style={{...absolute,left:6+q*44,top:6,width:46,height:46,borderRadius:'50%',background:surface.thumb,boxShadow:'0 1px 3px #00000024',transform:`scaleX(${1+Math.sin(q*Math.PI)*.14})`}}/></button></div>;
 if(kind==='tabs'){
  const tabs=['Overview','Activity','Settings'],target=selected;
  return <div style={{...absolute,left:100,top:68,width:600,height:365,borderRadius:23,background:surface.soft,padding:25,overflow:'hidden',boxShadow:`${edge},0 3px 14px #00000007`}}><div role="tablist" aria-label="示例面板" style={{position:'relative',display:'flex',padding:5,background:surface.muted,boxShadow:'none',borderRadius:15,height:62}}><div style={{...absolute,left:5+s.index*180,top:5,width:180,height:52,borderRadius:11,background:accent,boxShadow:'0 1px 3px #00000014'}}/>{tabs.map((text,i)=><button type="button" key={text} role="tab" id={'demo-tab-'+i} aria-selected={target===i} aria-controls={'demo-panel-'+i} tabIndex={n&&target===i?0:-1} onClick={()=>n?.onSelect(i)} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(target+(e.key==='ArrowRight'?1:2))%3;n?.onSelect(next);const list=e.currentTarget.parentElement; (list?.querySelectorAll('button')[next] as HTMLButtonElement)?.focus();}}} style={{...button,position:'relative',width:180,fontSize:19,borderRadius:11,background:'transparent',color:blendInk('#30343b',onAccent,1-Math.abs(s.index-i)),pointerEvents:n?'auto':'none'}}>{text}</button>)}</div>{tabs.map((text,i)=>{const distance=Math.abs(s.index-i),opacity=1-clamp(distance*1.6);return <div key={text} role="tabpanel" id={'demo-panel-'+i} aria-labelledby={'demo-tab-'+i} aria-hidden={target!==i} style={{...absolute,left:30+(i-s.index)*70,top:157,right:30,opacity,pointerEvents:target===i?'auto':'none'}}><div style={{marginTop:0,display:'flex',gap:10}}>{[0,1,2].map(j=><div key={j} style={{width:[150,100,170][j],height:92,borderRadius:10,background:[surface.white,surface.soft,surface.muted][j],boxShadow:edge,color:'#34363a',display:'grid',placeItems:'center',fontSize:16}}>{[['12 projects','4 active','On track'],['New idea','Updated','Shared'],['Theme','Language','Privacy']][i][j]}</div>)}</div></div>;})}</div>;
 }
 return null;
};
