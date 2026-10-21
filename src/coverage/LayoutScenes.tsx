import React from 'react';
import type {DemoProps} from '../DemoMotion';
import {useUI} from '../voice-ui/shared';
import {useContinuousValue as useMotionValue} from './useContinuousValue';
import {cue,windowAt,mix,clamp,staged,lift} from './motion.js';
import {abs,control,Skeleton} from './shared';
export const LayoutScenes:React.FC<{p:DemoProps;t:number;mode:string;category:string}>=({p,t,mode,category})=>{
 const u=useUI(p),[value,setValue,target]=useMotionValue(0,u.clock,u.reduced),q=u.auto?staged(t,.5,5.6,1.25,.045):clamp(value),ink=p.accent??'#30383b',colors=['#fff','#e7e9e4','#fafaf8','#dce1df','#eef0eb','#30383b'];
 const tile=(i:number,x:number,y:number,w:number,h:number,angle=0,extra:React.CSSProperties={})=><div key={i} data-layout-tile={i} style={{...abs,left:0,top:0,width:w,height:h,transform:`translate(${x}px,${y}px) rotate(${angle}deg)`,borderRadius:14,overflow:'hidden',background:colors[i%6],color:i===5?'#fff':ink,boxShadow:'0 8px 22px #0000000a',...extra}}><div style={{...abs,left:22,top:h<90?16:22,fontSize:h<90?18:25,fontWeight:500}}>{['Explore','Make','Collect','Arrange','Focus','Share'][i%6]}</div><>{h>=125&&<Skeleton x={22} y={Math.max(92,h*.48)} width={Math.min(150,w-40)} rows={Math.max(1,Math.min(3,Math.floor((h-90)/25)))}/>}</></div>;
 let body:React.ReactNode;
 if(category==='布局重组'){
  const from=[{x:85,y:75,w:198,h:150},{x:297,y:75,w:198,h:150},{x:509,y:75,w:198,h:150},{x:85,y:245,w:198,h:150},{x:297,y:245,w:198,h:150},{x:509,y:245,w:198,h:150}];
  const to=from.map(v=>({...v}));
  if(mode==='masonry'){const heights=[100,145,160,105,130,120],ys=[40,40];to.forEach((v,i)=>{const col=i%2;Object.assign(v,{x:85+col*320,y:ys[col],w:300,h:heights[i]});ys[col]+=heights[i]+13;});}
  else if(mode==='hierarchy'){const rank=(i:number)=>i<3?i:i-1;to.forEach((v,i)=>Object.assign(v,{x:i===3?85:425+(rank(i)%2)*150,y:i===3?55:55+Math.floor(rank(i)/2)*130,w:i===3?320:140,h:i===3?370:112}));}
  else if(mode==='mergecols'){from.forEach((v,i)=>Object.assign(v,{x:90+(i%2)*330,y:70+Math.floor(i/2)*118,w:290,h:96}));to.forEach((v,i)=>Object.assign(v,{x:190,y:45+i*64,w:420,h:51}));}
  else if(mode==='cluster')to.forEach((v,i)=>Object.assign(v,{x:225+i*13,y:83+i*20,w:300,h:278}));
  else{const widths=[150,130,210,160,110,170];let wideX=0,wideY=0,narrowX=0,narrowY=0;from.forEach((v,i)=>{if(wideX+widths[i]>640){wideX=0;wideY+=80;}Object.assign(v,{x:80+wideX,y:150+wideY,w:widths[i],h:58});wideX+=widths[i]+14;if(narrowX+widths[i]>350){narrowX=0;narrowY+=80;}Object.assign(to[i],{x:225+narrowX,y:80+narrowY,w:widths[i],h:58});narrowX+=widths[i]+14;});}
  body=<>{mode==='flowwrap'&&<div style={{...abs,left:mix(65,210,q),top:mix(130,60,q),width:mix(670,380,q),height:mix(210,365,q),background:'#e7eae5',borderRadius:20}}/>}{from.map((a,i)=>{const k=u.auto?staged(t,.5+i*.065,5.5+(5-i)*.055,1.15,.045):q,b=to[i],curve=lift(k,mode==='mergecols'?(i%2?28:-28):mode==='cluster'?20:12),angle=mode==='cluster'?(i-2.5)*k*4:Math.sin(i*1.5)*lift(k,2);return tile(i,mix(a.x,b.x,k)+curve,mix(a.y,b.y,k)-lift(k,16),mix(a.w,b.w,k),mix(a.h,b.h,k),angle,{zIndex:mode==='hierarchy'&&i===3?8:6-i});})}</>;
 }
 else{
  const page=(x:number,y:number,w:number,h:number,title:string,color='#fff',extra:React.CSSProperties={})=><div style={{...abs,left:x,top:y,width:w,height:h,borderRadius:17,overflow:'hidden',background:color,boxShadow:'0 12px 30px #0000000a',...extra}}><div style={{...abs,left:30,top:32,fontSize:29,color:ink,fontWeight:500}}>{title}</div><Skeleton x={30} y={90} width={w-70}/><div style={{...abs,left:30,right:30,bottom:28,height:h*.25,borderRadius:10,background:'#e5e9e2'}}/></div>;
  if(mode==='portalpage')body=<>{page(90,55,620,390,'A place to begin')}<div style={{...abs,left:mix(280,90,q),top:mix(125,55,q),width:mix(240,620,q),height:mix(205,390,q),borderRadius:mix(30,17,q),background:'#dfe6df',overflow:'hidden'}}><div style={{fontSize:mix(31,45,q),position:'absolute',left:30,top:mix(75,45,q),color:ink}}>Open space.</div><div style={{...abs,left:40,right:40,bottom:30,height:90*q,background:'#f9faf7',borderRadius:8}}/></div></>;
  else if(mode==='morphmodal')body=<>{page(90,55,620,390,'Workspace')}<div style={{...abs,inset:0,background:'#1d2523',opacity:.15*q}}/>{page(mix(250,150,q),mix(185,90,q),mix(300,500,q),mix(100,320,q),'Details')}</>;
  else if(mode==='sidebarpush')body=<><div style={{...abs,left:70,top:60,width:190,height:380,borderRadius:17,background:'#e1e6df',transform:`translateX(${-210*(1-q)}px)`,opacity:q}}>{['Home','Notes','Archive'].map((name,i)=><div key={name} style={{margin:'35px 25px',fontSize:21,color:ink}}>{name}</div>)}</div>{page(70+205*q,60,660-205*q,380,'Your workspace')}</>;
  else if(mode==='bottomsheet')body=<>{page(90,55,620,390,'Quiet workspace')}<div style={{...abs,inset:'55px 90px',borderRadius:17,background:'#15201d',opacity:.13*q}}/><div style={{...abs,left:110,right:110,top:mix(470,150,q),height:300,borderRadius:'20px 20px 0 0',background:'#fff',boxShadow:'0 -10px 30px #0001',opacity:q}}><div style={{width:38,height:4,borderRadius:5,background:'#d9ddda',margin:'15px auto'}}/><div style={{margin:30,fontSize:28}}>A little more space.</div><Skeleton x={30} y={105} width={420}/></div></>;
  else if(mode==='pagecross')body=<>{page(90-80*q,65,620,370,'First idea','#fff',{opacity:1-q,clipPath:`inset(0 ${q*100}% 0 0)`})}{page(170-80*q,65,620,370,'Next possibility','#e8ece5',{opacity:clamp(q*1.6),clipPath:`inset(0 0 0 ${(1-q)*100}%)`})}</>;
  else if(mode==='scenestack')body=<>{page(90+35*q,55+25*q,620-70*q,390-50*q,'Overview','#e4e8e2')}{page(90+85*(1-q),55+400*(1-q),620,390,'Into the details','#fff',{opacity:q})}</>;
  else body=<>{page(90,55,620,390,'Stay curious.','#fff')}<div style={{...abs,inset:0,clipPath:`circle(${q*85}% at 25% 50%)`}}>{page(90,55,620,390,'Make something.','#dfe7df')}</div></>;
 }
 return <div data-coverage-layout={mode} data-layout-phase={q.toFixed(3)} style={{...abs,inset:0,overflow:'hidden'}}>{body}{!u.auto&&<button aria-label="切换布局状态" onClick={()=>{u.wake();setValue(target>.5?0:1);}} style={{...control,...abs,bottom:10,left:325,fontSize:14,padding:'7px 20px'}}>展开 / 复位</button>}</div>;
};
