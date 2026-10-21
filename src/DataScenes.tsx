import {rollingCounterAt} from './demos/counter-motion.js';
import React from 'react';
import type {DemoProps} from './DemoMotion';
import {clamp,mix} from './demos/motion.js';
import {dataKind,dataValues,dataLabels,dataTime,dataEnter,dataOpacity,chartScale,waterfallSteps,rankingAt,numberText,parseValues} from './demos/data-motion.js';
export const DataScene:React.FC<{p:DemoProps;frame:number;fps:number}>=({p,frame,fps})=>{
 const kind=dataKind(p.demo),values=dataValues(p),labels=dataLabels(p,kind==='milestone'?4:kind==='heatmap'?7:values.length),t=dataTime(frame,fps,p.speed),q=kind==='count'?rollingCounterAt(values[0],t).progress:dataEnter(t),opacity=dataOpacity(t),accent=p.accent??'#497d6c';
 const rgb=(p.background??'#ffffff').slice(1),dark=(parseInt(rgb.slice(0,2),16)*.2126+parseInt(rgb.slice(2,4),16)*.7152+parseInt(rgb.slice(4,6),16)*.0722)<120,ink=dark?'#edf5e5':'#243a34',muted=dark?'#afc8b8':'#758078',track=dark?'#ffffff18':'#29473613',palette=[accent,'#a3b6d8','#d4c5a2','#a9b99b','#b8a6cc'];
 const text=(s:React.ReactNode,x:number,y:number,size=18,extra:React.SVGProps<SVGTextElement>={})=>{const {key,...attrs}=extra;return <text key={key} x={x} y={y} fill={ink} fontSize={size} {...attrs}>{s}</text>;};
 const header=<>{text(p.title??'',54,64,27,{fontWeight:500,letterSpacing:-.7})}{text('SAMPLE DATA',746,99,10,{fill:muted,textAnchor:'end',letterSpacing:2})}</>;
 let content:React.ReactNode;
 if(kind==='count'){
  const target=values[0],counter=rollingCounterAt(target,t),scale=Math.min(1,650/counter.width),start=(800-counter.width*scale)/2;
  content=<><g data-counter-progress={counter.progress} transform={`translate(${start} 190) scale(${scale})`}>
   {counter.negative&&text('−',0,100,85,{fill:accent})}
   {counter.slots.map((slot,i)=>{
    if(slot.char===',')return text(',',slot.x,100,111,{fontWeight:500,fill:accent,key:'comma'+i});
    const whole=Math.floor(slot.position),fraction=slot.position-whole,digit=whole%10;
    return <svg key={i} data-counter-wheel={i} data-wheel-position={slot.position} x={slot.x} y={0} width={74} height={124} overflow="hidden"><g transform={`translate(0 ${-fraction*124})`}>
     {text(digit,0,100,111,{fontWeight:500,letterSpacing:-5,fill:accent})}
     {text((digit+1)%10,0,224,111,{fontWeight:500,letterSpacing:-5,fill:accent})}
    </g></svg>;
   })}
  </g>{text(p.unit??'',400,345,19,{textAnchor:'middle',fill:muted,letterSpacing:2})}<path d="M180 380H620" stroke={track} strokeWidth="3"/><path d={`M180 380H${180+q*440}`} stroke={accent} strokeWidth="3" strokeLinecap="round"/>{text('0',180,405,13,{fill:muted})}{text(numberText(target,false),620,405,13,{fill:muted,textAnchor:'end'})}</>;
 }else if(kind==='bars'){
  const n=values.length,step=652/n,w=Math.min(74,step*.65),max=Math.max(1,...values),base=365;
  content=<>{[0,.5,1].map(v=><g key={v}><path d={`M74 ${base-v*208}H739`} stroke={track} strokeWidth="1"/>{text(numberText(v*max),58,base-v*208+5,12,{fill:muted,textAnchor:'end'})}</g>)}{values.map((v,i)=>{const k=dataEnter(t,i*.12,1.3),h=v/max*208*k,x=90+i*step+(step-w)/2;return <g key={i} data-data-value={v}><rect x={x} y={base-h} width={w} height={h} rx={Math.min(10,h/2)} fill={i===n-1?accent:palette[i%palette.length]} opacity={i===n-1?1:.8}/>{text(numberText(v*k),x+w/2,base-h-15,20,{textAnchor:'middle',opacity:k})}{text(labels[i],x+w/2,400,15,{fill:muted,textAnchor:'middle'})}</g>;})}</>;
 }else if(kind==='line'){
  const scale=chartScale(values,145,360),points=values.map((v,i)=>({x:84+i*632/Math.max(1,values.length-1),y:scale(v)})),d=points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' '),reveal=q*632;
  let active=Math.min(points.length-2,Math.floor(q*(points.length-1)));active=Math.max(0,active);const a=points[active],b=points[Math.min(points.length-1,active+1)],fraction=q*(points.length-1)-active,cursorX=mix(a.x,b.x,fraction),cursorY=mix(a.y,b.y,fraction),current=mix(values[active],values[Math.min(values.length-1,active+1)],fraction);
  content=<>{[145,252,360].map(y=><path key={y} d={`M84 ${y}H716`} stroke={track} strokeWidth="1"/>)}<svg x={84} y={120} width={Math.max(.01,reveal)} height={282} overflow="hidden"><g transform="translate(-84 -120)"><path d={d+` L${points[points.length-1].x} 360 L84 360 Z`} fill={accent} opacity=".07"/><path d={d} fill="none" stroke={accent} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/></g></svg><path d={`M${cursorX} ${cursorY}V360`} stroke={accent} opacity=".25" strokeDasharray="4 6"/><circle cx={cursorX} cy={cursorY} r="10" fill={p.background}/><circle cx={cursorX} cy={cursorY} r="5" fill={accent}/>{text(numberText(current),clamp(cursorX,110,690),Math.max(127,cursorY-25),25,{textAnchor:'middle',fill:accent,fontWeight:550})}{points.map((pt,i)=><g key={i}>{text(labels[i],pt.x,400,14,{fill:muted,textAnchor:'middle'})}</g>)}</>;
 }else if(kind==='donut'){
  const total=values.reduce((a,b)=>a+b,0),r=116,c=2*Math.PI*r;let offset=0;
  content=<><circle cx="248" cy="275" r={r} fill="none" stroke={track} strokeWidth="37"/>{values.map((v,i)=>{const share=v/total,start=offset;offset+=share;const visible=clamp((q-start)/Math.max(.0001,share))*share;return <g key={i}><circle cx="248" cy="275" r={r} fill="none" stroke={palette[i]} strokeWidth="37" strokeDasharray={`${visible*c} ${c}`} strokeDashoffset={-start*c} transform="rotate(-90 248 275)"/>{text(labels[i],462,186+i*50,18,{fill:muted})}<circle cx="437" cy={180+i*50} r="5" fill={palette[i]}/>{text((visible*100).toFixed(0)+'%',734,186+i*50,22,{textAnchor:'end'})}</g>;})}{text(Math.round(100*q)+'%',248,282,49,{textAnchor:'middle',fontWeight:550,letterSpacing:-2})}{text('TOTAL SHARE',248,312,12,{textAnchor:'middle',fill:muted,letterSpacing:1})}</>;
 }else if(kind==='ranking'){
  const rows=rankingAt(values,dataEnter(t,.2,3.6),parseValues(p.dataStartValues)??undefined),max=Math.max(1,...values,...rows.map(row=>row.value)),step=56,n=values.length,top=153+(4-n)*18;
  content=<>{rows.map((row,i)=>{const y=top+row.rank*step;return <g key={i} data-data-rank={row.rank} transform={`translate(0 ${y})`}>{text(labels[i],178,24,17,{textAnchor:'end',fill:muted})}<rect x="199" y="0" width={row.value/max*420} height="38" rx="7" fill={palette[i]} opacity=".88"/>{text(numberText(row.value),220+row.value/max*420,25,22,{fontWeight:550})}</g>;})}{text(p.unit??'',738,398,13,{fill:muted,textAnchor:'end'})}</>;
 }else if(kind==='milestone'){
  const target=values[0],progress=q*target/100,x=80+progress*640;
  content=<>{text(Math.round(progress*100)+'%',80,222,88,{fill:accent,fontWeight:500,letterSpacing:-4})}{text('IN PROGRESS',738,216,14,{fill:muted,textAnchor:'end',letterSpacing:2})}<rect x="80" y="279" width="640" height="12" rx="6" fill={track}/><rect x="80" y="279" width={640*progress} height="12" rx="6" fill={accent}/>{[0,.33,.66,1].map((v,i)=>{const done=progress>=v;return <g key={i}><circle cx={80+v*640} cy="285" r="12" fill={done?accent:p.background} stroke={done?accent:muted} strokeWidth="2"/>{done&&text('✓',80+v*640,290,14,{textAnchor:'middle',fill:dark?'#173a35':'#fff'})}{text(labels[i],80+v*640,339,17,{fill:done?ink:muted,textAnchor:'middle'})}</g>;})}<circle cx={x} cy="285" r="21" fill={accent} opacity={Math.sin(Math.PI*q)*.2}/>{text(target===100?'Ready to deliver.':'Build → review → deliver.',80,398,19,{fill:muted})}</>;
 }else if(kind==='waterfall'){
  const steps=waterfallSteps(values),scale=chartScale(steps.flatMap(s=>[s.start,s.end]),150,354),n=steps.length,step=642/n,w=Math.min(68,step*.67),allLabels=[...labels,'Total'];
  content=<><path d={`M80 ${scale(0)}H735`} stroke={track}/>{steps.map((row,i)=>{const k=dataEnter(t,i*.48,.62),end=mix(row.start,row.end,k),x=88+i*step+(step-w)/2,y=Math.min(scale(row.start),scale(end)),h=Math.abs(scale(end)-scale(row.start));return <g key={i}>{i<n-1&&<path d={`M${x+w} ${scale(row.end)}H${x+step}`} stroke={muted} strokeDasharray="3 4" opacity={k*.4}/>}<rect x={x} y={y} width={w} height={h} rx="5" fill={row.total?accent:row.delta>=0?'#97b77d':'#d68d79'}/>{text((!row.total&&row.delta>0?'+':'')+numberText(row.delta*k),x+w/2,y-13,18,{textAnchor:'middle',opacity:k})}{text(allLabels[i],x+w/2,400,14,{textAnchor:'middle',fill:muted})}</g>;})}</>;
 }else if(kind==='heatmap'){
  const max=Math.max(1,...values),total=values.reduce((a,b)=>a+b,0),cols=7,rows=Math.ceil(values.length/cols),size=Math.min(53,235/rows),gap=8,left=80,top=155;
  content=<>{values.map((v,i)=>{const k=dataEnter(t,i*.035,.55),x=left+(i%cols)*(size+gap),y=top+Math.floor(i/cols)*(size+gap);return <g key={i} opacity={k} transform={`translate(0 ${(1-k)*8})`}><rect x={x} y={y} width={size} height={size} rx="8" fill={track}/><rect x={x} y={y} width={size} height={size} rx="8" fill={accent} opacity={v/max*.95}/>{v>0&&text(v,x+size/2,y+size/2+5,14,{textAnchor:'middle',fill:v/max>.6?'#fff':ink,opacity:.75})}</g>;})}{labels.map((v,i)=>text(v,left+i*(size+gap)+size/2,136,12,{fill:muted,textAnchor:'middle',key:i}))}{text(numberText(values.reduce((sum,v,i)=>sum+v*dataEnter(t,i*.035,.55),0)),614,243,64,{fill:accent,textAnchor:'middle',letterSpacing:-3})}{text(p.unit??'',614,280,16,{fill:muted,textAnchor:'middle'})}{[0,.25,.5,.75,1].map((v,i)=><rect key={i} x={536+i*29} y={326} width="22" height="22" rx="4" fill={accent} opacity={.12+v*.88}/>)}{text('Less',536,372,12,{fill:muted})}{text('More',674,372,12,{fill:muted,textAnchor:'end'})}</>;
 }
 return <svg data-data-kind={kind} data-data-progress={q} viewBox="0 0 800 500" style={{width:800,height:500,fontFamily:'Arial, PingFang SC, sans-serif',fontVariantNumeric:'tabular-nums'}}>{header}<g opacity={opacity}>{content}</g></svg>;
};
