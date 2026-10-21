import React,{useEffect,useState} from 'react';
import {delayRender,continueRender,cancelRender} from 'remotion';
import {loadPreviewFonts} from '../fonts';
import type {DemoProps} from '../DemoMotion';
import {cue,windowAt,mix,clamp,phaseAt} from './motion.js';
export const BatchTextScene:React.FC<{p:DemoProps;t:number;kind:string}>=({p,t,kind})=>{
 const [fontHandle]=useState(()=>delayRender('Loading dictionary text font'));
 useEffect(()=>{loadPreviewFonts().then(()=>continueRender(fontHandle)).catch(cancelRender);},[fontHandle]);
 const ink=p.accent??'#292928',q=windowAt(t),text=p.motionText??'Make room',font='Noto Sans SC, Arial, sans-serif',lines=text.split('\n'),words=text.split(/\s+/),phrase=text.replaceAll('\n',' '),size=Math.min(92,640/Math.max(1,Array.from(phrase).length)*1.7),label=(v:string,x:number,y:number,s=72,extra:React.SVGProps<SVGTextElement>={})=>{const {key,...attrs}=extra,units=Array.from(v).reduce((sum,c)=>sum+(c===' '?.32:/[A-Za-z0-9]/.test(c)?.58:1),0);return <text key={key??`${x}-${y}`} x={x} y={y} fill={ink} fontSize={Math.min(s,640/Math.max(1,units))} textAnchor="middle" fontWeight={450} {...attrs}>{v}</text>;};
 let body:React.ReactNode;
 if(kind==='subtitle'){
  const arr=lines.filter(v=>v.trim()).slice(0,3),step=(arr.length>1?cue(t,1.1,1.1):0)+(arr.length>2?cue(t,3.1,1.1):0);
  body=<svg x="70" y="90" width="660" height="320" overflow="hidden"><g transform="translate(-70 -90)">{arr.map((v,i)=>{const d=i-step;return label(v,400,250+d*112,62,{key:i,opacity:q*(.2+.8*Math.max(0,1-Math.abs(d))),transform:`translate(400 ${250+d*112}) scale(${.82+.18*Math.max(0,1-Math.abs(d))}) translate(-400 ${-250-d*112})`});})}</g></svg>;
 }else if(kind==='relay'){
  const arr=words.slice(0,4),widths=arr.map(v=>v.length*28+26),total=widths.reduce((a,b)=>a+b,0);let cursor=400-total/2;
  body=arr.map((v,i)=>{const home=cursor+widths[i]/2;cursor+=widths[i];const enter=cue(t,.35+i*1.25,.4),land=cue(t,.9+i*1.25,.7),y=mix(205,285,land)-30*Math.sin(Math.PI*land),x=mix(400,home,land);return label(v,x,y+18,82-34*land,{key:i,opacity:enter*(1-cue(t,6.4+i*.04,.6)),transform:`rotate(${(1-land)*Math.sin(enter*Math.PI)*-7} ${x} ${y})`});});
 }else if(kind==='brackets'){
  const arr=text.trim().split(/\s+/).slice(0,5),units=arr.map(v=>Array.from(v).reduce((sum,c)=>sum+(/[A-Za-z0-9]/.test(c)?.58:1),0)),fontSize=Math.min(62,(620-(arr.length-1)*30)/Math.max(1,units.reduce((a,b)=>a+b,0))),widths=units.map(v=>v*fontSize),total=widths.reduce((a,b)=>a+b,0)+(arr.length-1)*30,step=arr.slice(1).reduce((v,_,i)=>v+cue(t,1.1+i*1.22,.65),0);let cursor=400-total/2;
  const centers=widths.map(w=>{const c=cursor+w/2;cursor+=w+30;return c;}),i=Math.min(arr.length-1,Math.floor(step)),j=Math.min(arr.length-1,i+1),f=step-i,center=mix(centers[i],centers[j],f),half=mix(widths[i],widths[j],f)/2+13;
  body=<>{arr.map((v,i)=>label(v,centers[i],267,fontSize,{key:i,opacity:.24+.76*(1-clamp(Math.abs(step-i)))}))}<g fill="none" stroke={ink} strokeWidth="2.5" opacity={q}><path d={`M${center-half+10} 205h-10v83h10M${center+half-10} 205h10v83h-10`}/></g></>;
 }else if(kind==='punctuation'){
  const a=cue(t,.45,.85),b=cue(t,2.25,.85),c=cue(t,4.45,.85),reset=cue(t,6.45,.9),point=(u:number)=>{const angle=-Math.PI+u*Math.PI*1.65,question=[400+49*Math.cos(angle),193+48*Math.sin(angle)],tail=clamp((u-.72)/.28);if(u>.72){question[0]=mix(question[0],400,tail);question[1]=mix(question[1],266,tail);}return [mix(mix(400,question[0],b),400,c),mix(mix(mix(314,202,a),question[1],b),174+u*92,c)];};
  body=<g fill={ink}><circle cx="400" cy="314" r="13"/><path d={Array.from({length:49},(_,i)=>{const p=point(i/48);return (i?'L':'M')+mix(p[0],400,reset)+' '+mix(p[1],314,reset);}).join(' ')} fill="none" stroke={ink} strokeWidth={mix(26,17,b)*(1-.1*c)} strokeLinecap="round" strokeLinejoin="round"/></g>;
 }else if(kind==='slices'){
  body=Array.from({length:7},(_,i)=>{const k=cue(t,.5+i*.085,.95)*(1-cue(t,6.2+i*.05,.65)),offset=(i%2?1:-1)*(1-k)*240;return <svg key={i} x="45" y={175+i*20} width="710" height="20" overflow="hidden"><g transform={`translate(${-45+offset} ${-175-i*20})`}>{label(phrase,400,293,size,{fontWeight:550})}</g></svg>;});
 }else if(kind==='foldtitle'){
  const hinge=cue(t,.4,1.1)*(1-cue(t,3.25,.75))+.78*cue(t,4.3,.7)*(1-cue(t,5.6,.85)),angle=(1-hinge)*82;
  body=<foreignObject x="35" y="115" width="730" height="280"><div style={{position:'relative',height:280,perspective:650,color:ink,fontFamily:font,fontSize:Math.min(140,650/(phrase.length*.6)),fontWeight:500,textAlign:'center',lineHeight:'250px'}}>{[0,1].map(i=><div key={i} style={{position:'absolute',inset:0,clipPath:`inset(${i?50:0}% 0 ${i?0:50}% 0)`,transformOrigin:'50% 50%',transform:`rotateX(${(i?1:-1)*angle}deg)`,opacity:.35+.65*hinge,filter:`brightness(${i?.76+.24*hinge:1})`}}>{phrase}</div>)}</div></foreignObject>;
 }else if(kind==='crossword'){
  const chars=Array.from(phrase).slice(0,7),n=chars.length,pivot=Math.floor(n/2),spacing=Math.min(82,300/Math.max(1,n-1)),k=cue(t,.65,1.1)*(1-cue(t,5.35,1.15));
  body=<>{chars.map((v,i)=>label(v,400+(i-pivot)*spacing,268,70,{key:'a'+i,opacity:.3+.7*(i===pivot?1:1-k)}))}{chars.filter((_,i)=>i!==pivot).map((v,j)=>{const i=j>=pivot?j+1:j,a=k*Math.PI/2,x=400+(i-pivot)*spacing*Math.cos(a),y=268+(i-pivot)*spacing*Math.sin(a);return label(v,x,y,70,{key:'b'+i,opacity:k,transform:`rotate(${-8*Math.sin(k*Math.PI)} ${x} ${y})`});})}</>;
 }else if(kind==='weave'){
  const glyphs=lines.slice(0,2).flatMap((v,row)=>Array.from(v).slice(0,7).map((c,i)=>{const k=cue(t,.65+i*.19,1.5)*(1-cue(t,4.5+i*.19,1.4)),arc=Math.sin(k*Math.PI)*(row?-1:1),x=400+(i-(Math.min(Array.from(v).length,7)-1)/2)*105,y=205+row*110+arc*105;return{c,i,row,x,y,arc,depth:Math.cos(k*Math.PI)*(row?-1:1)};})).sort((a,b)=>a.depth-b.depth);
  body=glyphs.map(g=>label(g.c,g.x,g.y,89,{key:g.row+'-'+g.i,opacity:q*(g.depth<0?.38:1),transform:`rotate(${g.arc*(g.i%2?7:-7)} ${g.x} ${g.y})`}));
 }else if(kind==='drawtype'){
  const paths=['M165 296V177M165 248C166 208 218 207 215 248V292','M243 257H292C294 210 240 213 240 256C238 303 286 305 298 277','M326 174V275Q325 294 345 294','M372 174V275Q371 294 391 294','M449 225C400 224 407 295 449 295C493 295 494 223 449 225Z'];body=<g fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" transform="translate(70 0)">{paths.map((d,i)=><path key={i} d={d} pathLength={1} strokeDasharray="1" strokeDashoffset={1-cue(t,.5+i*.35,.8)} opacity={1-cue(t,6.3,.8)}/>)}</g>;
 }else if(kind==='longshadow'){
  const extrusion=4.5*cue(t,.5,1)*(1-cue(t,3.8,1.6));body=<>{Array.from({length:15},(_,i)=>label(phrase,400+(15-i)*extrusion,275+(15-i)*extrusion,Math.min(110,size),{key:i,opacity:.035+(i/15)*.04})).reverse()}{label(phrase,400,275,Math.min(110,size))}</>;
 }else if(kind==='infinity'){
  const chars=Array.from(phrase).slice(0,11),settle=cue(t,4.2,1.8),exit=1-cue(t,6.6,.7);body=chars.map((c,i)=>{const angle=t*.9+i*.62,x=400+245*Math.sin(angle),y=250+105*Math.sin(angle*2),home=400+(i-(chars.length-1)/2)*55;return label(c,mix(x,home,settle),mix(y,270,settle),58,{key:i,opacity:cue(t,.2+i*.045,.6)*exit});});
 }else if(kind==='countermask'){
  const maskId='bela-type-mask';body=<><defs><clipPath id={maskId}>{label(phrase,400,302,Math.min(160,size*1.5),{fontWeight:600})}</clipPath></defs>{label(phrase,400,302,Math.min(160,size*1.5),{fontWeight:600,opacity:.12})}<g clipPath={`url(#${maskId})`}>{Array.from({length:12},(_,i)=><circle key={i} cx={40+((i*105+t*80)%900)} cy={140+80*Math.sin(i+t*.8)} r={55+i%3*17} fill={ink} opacity={.3+i%3*.3}/>)}<rect x={-800+t*180} y="265" width="440" height="50" fill={ink}/></g></>;
 }else if(kind==='footnote'){
  const k=cue(t,.85,1.05)*(1-cue(t,5.35,1)),anchor=510,x=mix(anchor,215,k),y=mix(190,335,k);body=<>{label(phrase,330-36*k,260,82)}{label('1',x,y,22,{opacity:1-.6*k})}<path d={`M${anchor} 216Q${anchor} ${216+65*k} ${anchor-155*k} ${216+65*k}`} stroke={ink} fill="none" strokeWidth="1.5" opacity={k}/>{label('Give ideas room to grow.',440,335,27,{opacity:cue(k,.25,.75),transform:`translate(0 ${(1-k)*16})`})}</>;
 }else if(kind==='connector'){
  const arr=text.split(/[,，]/).map(v=>v.trim()).filter(Boolean).slice(0,3),centers=arr.map((_,i)=>arr.length<2?400:160+i*480/(arr.length-1));body=<>{arr.map((v,i)=>label(v,centers[i],260,Math.min(48,180/Math.max(1,v.length)*1.4),{key:i,opacity:cue(t,.3+i*.7,.65)}))}{arr.slice(0,-1).map((_,i)=><g key={i}><path d={`M${centers[i]+Math.min(86,arr[i].length*14+12)} 246H${centers[i+1]-Math.min(86,arr[i+1].length*14+12)}`} stroke={ink} strokeWidth="2" pathLength={1} strokeDasharray="1" strokeDashoffset={1-cue(t,.8+i*.8,.65)}/><circle cx={mix(centers[i]+Math.min(86,arr[i].length*14+12),centers[i+1]-Math.min(86,arr[i+1].length*14+12),cue(t,2+i*.7,1))} cy="246" r="5" fill={ink} opacity={windowAt(t,1.7+i*.7,3+i*.7,.45)}/></g>)}</>;
 }else{
  const old=text.slice(0,32),prefix=old.includes(' ')?old.slice(0,old.lastIndexOf(' ')+1):old.slice(0,Math.ceil(old.length/2)),typed=Math.floor(cue(t,.3,1.8)*old.length),deleted=Math.floor(cue(t,2.7,.85)*(old.length-prefix.length)),added=Math.floor(cue(t,3.9,1.2)*5),current=typed<old.length?old.slice(0,typed):deleted<old.length-prefix.length?old.slice(0,old.length-deleted):prefix+'clear'.slice(0,added),s=Math.min(58,650/(Math.max(old.length,prefix.length+5)*.6)),w=current.length*s*.55;body=<>{label(current,400-Math.max(old.length,prefix.length+5)*s*.3,268,s,{fontFamily:'monospace',textAnchor:'start'})}<path d={`M${400-Math.max(old.length,prefix.length+5)*s*.3+current.length*s*.6+6} 218v60`} stroke={ink} strokeWidth="2" opacity={t<6.7?(.3+.7*Math.cos(t*5)**2)*cue(t,.1,.2):0}/></>;
 }
 return <svg data-batch-kind={kind} viewBox="0 0 800 500" width="800" height="500" style={{fontFamily:font}}><g opacity={['connector','rewrite'].includes(kind)?1-cue(t,6.7,.8):['subtitle','relay','punctuation','drawtype'].includes(kind)?1:q}>{body}</g></svg>;
};
