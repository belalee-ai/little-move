import React from 'react';
import type {DemoProps} from './DemoMotion';
import {clamp,cue,mix} from './demos/motion.js';
import {dataValues,dataLabels,dataTime,dataOpacity,numberText} from './demos/data-motion.js';
import {extraDataProgress,bubbleRadius,gaugePoint,treeRects,areaBands} from './demos/extra-data-motion.js';
export const ExtraDataScene:React.FC<{p:DemoProps;frame:number;fps:number;kind:string}>=({p,frame,fps,kind})=>{
 const values=dataValues(p),labels=dataLabels(p,values.length),t=dataTime(frame,fps,p.speed),q=extraDataProgress(t),opacity=dataOpacity(t),accent=p.accent??'#292928',ink='#292928',muted='#858580',track='#deded9',palette=[accent,'#999992','#c8c8c0','#777770','#e0e0da','#b3b3ab','#53534e'];
 const txt=(v:React.ReactNode,x:number,y:number,size=18,rest:React.SVGProps<SVGTextElement>={})=><text x={x} y={y} fill={ink} fontSize={size} {...rest}>{v}</text>;
 const max=Math.max(1,...values),fmt=(v:number)=>numberText(v,true),item=(i:number)=>cue(t,.65+i*.12,2.4);
 let content:React.ReactNode;
 if(kind==='area'){
  const bands=areaBands(values),dx=640/Math.max(1,values.length-1),x=(i:number)=>80+i*dx,y=(v:number)=>386-v/max*230,at=q*(values.length-1),i=Math.min(values.length-2,Math.floor(at)),f=at-i,current=mix(values[i],values[i+1],f);
  content=<>{[156,271,386].map(y=><path key={y} d={`M80 ${y}H720`} stroke={track}/>)}<svg x={80} y={135} width={Math.max(.001,640*q)} height={255} overflow="hidden"><g transform="translate(-80 -135)">{[0,1,2].map(j=><path key={j} d={bands[j+1].map((v,i)=>(i?'L':'M')+x(i)+' '+y(v)).join(' ')+bands[j].map((_,i)=>{const k=values.length-1-i;return 'L'+x(k)+' '+y(bands[j][k]);}).join(' ')+'Z'} fill={palette[j]} opacity={j?.75:.95}/>)}</g></svg><path d={`M${80+q*640} 142V386`} stroke={ink} strokeDasharray="3 5" opacity=".25"/>{txt(fmt(current),clamp(80+q*640,110,690),122,25,{textAnchor:'middle'})}{labels.map((v,i)=><g key={i}>{txt(v,x(i),418,14,{textAnchor:'middle',fill:muted})}</g>)}</>;
 }else if(kind==='gauge'){
  const v=values[0]*q,tip=gaugePoint(v),arc='M230 334A170 170 0 0 1 570 334';
  content=<><path d={arc} fill="none" stroke={track} strokeWidth="26" strokeLinecap="round"/><path d={arc} fill="none" stroke={accent} strokeWidth="26" strokeLinecap="round" pathLength="1" strokeDasharray={`${v/100} 1`}/>{[0,25,50,75,100].map(v=>{const a=gaugePoint(v,205);return <g key={v}>{txt(v,a.x,a.y+5,15,{fill:muted,textAnchor:'middle'})}</g>;})}<path d={`M400 334L${tip.x} ${tip.y}`} stroke={ink} strokeWidth="4" strokeLinecap="round"/><circle cx="400" cy="334" r="12" fill={ink}/>{txt(Math.round(v)+'%',400,412,52,{textAnchor:'middle',fontWeight:500,letterSpacing:-2})}</>;
 }else if(kind==='radar'){
  const n=values.length,r=144,cx=400,cy=280,scale=Math.max(100,max),point=(i:number,k:number)=>{const a=-Math.PI/2+i/n*Math.PI*2;return [cx+Math.cos(a)*r*k,cy+Math.sin(a)*r*k];},polygon=(k:number)=>values.map((_,i)=>point(i,k).join(',')).join(' '),pts=values.map((v,i)=>point(i,v/scale*item(i)));
  content=<>{[.25,.5,.75,1].map(k=><polygon key={k} points={polygon(k)} fill="none" stroke={track}/>)}{values.map((_,i)=>{const a=point(i,1),label=point(i,1.23);return <g key={i}><path d={`M400 280L${a.join(' ')}`} stroke={track}/>{txt(labels[i],label[0],label[1]+5,15,{textAnchor:'middle',fill:muted})}</g>;})}<polygon points={pts.map(a=>a.join(',')).join(' ')} fill={accent} fillOpacity=".1" stroke={accent} strokeWidth="2.5" strokeLinejoin="round"/>{pts.map((a,i)=><g key={i}><circle cx={a[0]} cy={a[1]} r="4" fill={accent}/>{txt(Math.round(values[i]*item(i)),a[0],a[1]-13,16,{textAnchor:'middle'})}</g>)}</>;
 }else if(kind==='scatter'){
  const scale=Math.max(100,max),y=(v:number)=>386-v/scale*230;
  content=<>{[0,.5,1].map(k=><g key={k}><path d={`M90 ${386-k*230}H710`} stroke={track}/>{txt(Math.round(scale*k),70,391-k*230,13,{textAnchor:'end',fill:muted})}</g>)}{values.map((v,i)=>{const start=values[(i+2)%values.length]*.65,fromX=130+i*110,tx=130+i*110+(i%2?35:-25),k=item(i),cx=mix(fromX,tx,k),cy=mix(y(start),y(v),k)-Math.sin(k*Math.PI)*32;return <g key={i}><path d={`M${fromX} ${y(start)}Q${(fromX+cx)/2} ${Math.min(y(start),cy)-20*Math.sin(k*Math.PI)} ${cx} ${cy}`} stroke={palette[i]} fill="none" opacity=".3" strokeDasharray="3 4"/><circle cx={fromX} cy={y(start)} r="4" fill="none" stroke={muted}/><circle cx={cx} cy={cy} r={9+3*k} fill={palette[i]}/>{txt(labels[i]+' '+fmt(mix(start,v,k)),cx,cy-21,17,{textAnchor:'middle'})}</g>;})}{txt('Initial → target',90,423,14,{fill:muted})}</>;
 }else if(kind==='bubble'){
  const slots=[[184,237],[400,210],[614,248],[293,367],[516,371]];
  content=<>{values.map((v,i)=>{const k=item(i),[x,y]=slots[i],r=bubbleRadius(v,max,k),cy=y+(1-k)*38;return <g key={i}><circle cx={x} cy={cy} r={r} fill={i?'#ddddd6':accent} fillOpacity={1}/>{txt(labels[i],x,cy-6,16,{textAnchor:'middle',fill:i?ink:'#fff',opacity:k})}{txt(fmt(v*k),x,cy+20,26,{textAnchor:'middle',fill:i?ink:'#fff',opacity:k})}</g>;})}</>;
 }else if(kind==='lollipop'){
  const step=57,top=151;
  content=<>{[0,.5,1].map(k=><g key={k}><path d={`M${190+460*k} 132V416`} stroke={track}/>{txt(fmt(max*k),190+460*k,441,13,{textAnchor:'middle',fill:muted})}</g>)}{values.map((v,i)=>{const k=item(i),x=190+460*v/max*k,y=top+i*step;return <g key={i}>{txt(labels[i],165,y+6,17,{textAnchor:'end',fill:muted})}<path d={`M190 ${y}H${x}`} stroke={palette[i]} strokeWidth="3"/><circle cx={x} cy={y} r="8" fill={palette[i]}/>{txt(fmt(v*k),x+17,y+7,21)}</g>;})}</>;
 }else if(kind==='treemap'){
  content=<>{treeRects(values,q).map(({i,x,y,w,h,share})=>{const fill=i%3===0?accent:palette[i];return <g key={i}><rect x={x+3} y={y+3} width={Math.max(0,w-6)} height={Math.max(0,h-6)} rx="9" fill={fill}/>{w>70&&h>70&&<g fill={i%3===0?'#fff':ink}>{txt(labels[i],x+20,y+35,17,{fill:'inherit'})}{txt(Math.round(share*100)+'%',x+20,y+74,31,{fill:'inherit',letterSpacing:-1})}</g>}</g>;})}</>;
 }else if(kind==='diverging'){
  const span=Math.max(1,...values.map(Math.abs)),step=57;
  content=<><path d="M400 128V424" stroke="#aaa"/>{[-1,0,1].map(k=><g key={k}>{txt(fmt(k*span),400+k*240,448,14,{fill:muted,textAnchor:'middle'})}</g>)}{values.map((v,i)=>{const k=item(i),w=Math.abs(v)/span*235*k,y=145+i*step;return <g key={i}><rect x={v<0?400-w:400} y={y} width={w} height="33" rx="5" fill={v<0?'#adada5':accent}/>{txt(labels[i],90,y+23,17,{fill:muted})}{txt((v>0?'+':'')+fmt(v*k),v<0?388-w:412+w,y+23,20,{textAnchor:v<0?'end':'start'})}</g>;})}</>;
 }else if(kind==='flipcount'){
  const target=Math.round(values[0]),value=Math.floor(target*q),str=String(target),digitW=Math.min(106,650/str.length),left=(800-str.length*digitW)/2;
  content=<>{str.split('').map((ch,i)=>{const place=Math.pow(10,str.length-i-1),raw=(20+(i%2)*10+Number(ch))*cue(t,.55+i*.1,3.1+i*.12),fraction=clamp((raw-Math.floor(raw)-.28)/.72),digit=Math.floor(raw)%10,y=178,w=digitW-8,x=left+i*digitW,next=(digit+1)%10;
   const drawDigit=(v:React.ReactNode)=>txt(v,w/2,112,Math.min(96,digitW*.9),{fill:'#fff',textAnchor:'middle',fontWeight:500});
   const face=(v:React.ReactNode)=><><rect width={w} height="150" rx="12" fill={accent}/>{drawDigit(v)}</>;
   return <g key={i}><rect x={x} y={y} width={w} height="150" rx="12" fill={accent}/>
    <svg x={x} y={y} width={w} height="75" overflow="hidden">{face(fraction>0?next:digit)}</svg>
    <svg x={x} y={y+75} width={w} height="75" overflow="hidden"><g transform="translate(0 -75)">{face(digit)}</g></svg>
    {fraction>0&&fraction<.5&&<svg x={x} y={y} width={w} height="75" overflow="hidden"><g transform={`translate(0 ${75*(1-Math.cos(fraction*Math.PI))}) scale(1 ${Math.cos(fraction*Math.PI)})`}>{face(digit)}</g></svg>}
    {fraction>=.5&&<svg x={x} y={y+75} width={w} height="75" overflow="hidden"><g transform={`scale(1 ${Math.max(.001,-Math.cos(fraction*Math.PI))}) translate(0 -75)`}>{face(next)}</g></svg>}
    <path d={`M${x} ${y+75}H${x+w}`} stroke="#ffffff45" strokeWidth="2"/><rect x={x-2} y={y+70} width="4" height="11" rx="2" fill="#999"/><rect x={x+w-2} y={y+70} width="4" height="11" rx="2" fill="#999"/></g>;})}{txt(p.unit??'',400,383,16,{textAnchor:'middle',fill:muted})}</>;
 }else if(kind==='multiring'){
  content=<>{values.map((v,i)=>{const k=item(i),r=134-i*30,c=2*Math.PI*r,y=206+i*64;return <g key={i}><circle cx="278" cy="282" r={r} fill="none" stroke={track} strokeWidth="17"/><circle cx="278" cy="282" r={r} fill="none" stroke={palette[i]} strokeWidth="17" strokeLinecap="round" strokeDasharray={`${v/100*k*c} ${c}`} transform="rotate(-90 278 282)"/>{txt(labels[i],488,y,19,{fill:muted})}{txt(Math.round(v*k)+'%',708,y+1,28,{textAnchor:'end'})}</g>;})}</>;
 }
 return <svg data-extra-data-kind={kind} data-extra-data-progress={q} viewBox="0 0 800 500" style={{width:800,height:500,fontFamily:'Arial, PingFang SC, sans-serif',fontVariantNumeric:'tabular-nums'}}>{txt(p.title??'',55,65,25,{fontWeight:500,letterSpacing:-.5})}{txt('SAMPLE DATA',744,94,9,{fill:muted,textAnchor:'end',letterSpacing:1.5})}<g opacity={opacity}>{content}</g></svg>;
};
