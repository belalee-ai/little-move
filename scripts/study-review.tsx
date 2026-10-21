// Development-only fidelity review. Not linked from the product and not included in its build.
import React,{useState,useRef,useEffect} from 'react';import {createRoot} from 'react-dom/client';
import {Player,type PlayerRef} from '@remotion/player';import {StudyMotion} from '../src/StudyMotion';import {STUDIES,studyDefaults,studyFrames,studyStillFrame} from '../src/studies/catalog.js';
const raf=()=>new Promise<void>(r=>requestAnimationFrame(()=>r()));
function Review(){
 const [id,setId]=useState('study-variable'),[source,setSource]=useState(''),[ready,setReady]=useState(false),[time,setTime]=useState(1.1),[mode,setMode]=useState('flip'),[status,setStatus]=useState('加载原预览…');
 const iframe=useRef<HTMLIFrameElement>(null),player=useRef<PlayerRef>(null),updated=useRef<HTMLDivElement>(null),request=useRef(0);
 const meta=STUDIES.find(s=>s.id===id)!,props={...studyDefaults(id),logoMode:mode},duration=studyFrames(props,60);
 useEffect(()=>{fetch('http://127.0.0.1:3110/reference').then(r=>r.text()).then(html=>setSource('<!doctype html><html><head><meta charset="UTF-8"></head><body>'+html+`<style>html,body{margin:0;padding:0;overflow:hidden}#type-motion-lab>label,#type-motion-lab>select,.transport,.selector,.source,.note,.study-detail,[data-logo-controls]{display:none!important}#type-motion-lab #six-type-studies canvas,#type-motion-lab #nine-type-studies canvas{margin:0}#type-motion-lab>div{width:100%}</style></body></html>`)).catch(e=>setStatus(String(e)));},[]);
 async function compare(t:number){
  const token=++request.current;setTime(t);setStatus('比较中…');
  try{
   const doc=iframe.current!.contentDocument!,picker=doc.querySelector<HTMLSelectElement>('#type-motion-study')!;
   picker.value=meta.key;picker.dispatchEvent(new Event('change',{bubbles:true}));
   if(meta.key==='logo')doc.querySelector<HTMLElement>('[data-logo-mode="'+mode+'"]')!.click();
   await doc.fonts.ready;await raf();await raf();
   const group=meta.key==='variable'?'english-type-motion':meta.key==='layout'?'expressive-type-motion':['mix','ring','logo','mask','stickers','fold'].includes(meta.key)?'six-type-studies':'nine-type-studies';
   const root=doc.getElementById(group)!,range=root.querySelector<HTMLInputElement>('input[type="range"]')!;
   range.value=String(Math.round(t*1000));range.dispatchEvent(new Event('input',{bubbles:true}));
   player.current!.pause();player.current!.seekTo(Math.round(t*60));
   for(let i=0;i<300&&!updated.current?.querySelector('[data-study-ready="true"]');i++)await raf();
   await raf();await raf();if(token!==request.current)return;
   const old=root.querySelector('canvas'),current=updated.current!.querySelector('canvas');
   if(old&&current){
    const a=old.getContext('2d')!.getImageData(0,0,old.width,old.height).data,b=current.getContext('2d')!.getImageData(0,0,current.width,current.height).data;
    let sum=0,pixels=0,max=0;for(let i=0;i<a.length;i+=4){let delta=0;for(let k=0;k<4;k++){const d=Math.abs(a[i+k]-b[i+k]);sum+=d;max=Math.max(max,d);delta+=d;}if(delta>8)pixels++;}
    setStatus(JSON.stringify({code:meta.code,key:meta.key,mode:meta.key==='logo'?mode:undefined,time:t,dimensions:[old.width,old.height,current.width,current.height],meanChannelDelta:Number((sum/a.length).toFixed(6)),changedPixels:pixels,maxChannelDelta:max}));
   }else{
    const a=root.querySelector('svg')!,b=updated.current!.querySelector('svg')!;
    const attrs=(svg:SVGSVGElement)=>Array.from(svg.querySelectorAll('g,text,tspan')).map(node=>({tag:node.tagName,text:node.tagName==='g'?null:node.textContent,transform:node.getAttribute('transform'),variation:(node as SVGElement).style.fontVariationSettings,dy:node.getAttribute('dy'),opacity:(node as SVGElement).style.opacity}));
    const x=attrs(a),y=attrs(b);let maxTransformDelta=0;const same=x.length===y.length&&x.every((node,i)=>{const other=y[i],aa=(node.transform??'').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)?.map(Number)??[],bb=(other.transform??'').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)?.map(Number)??[];if(aa.length!==bb.length)return false;aa.forEach((v,j)=>maxTransformDelta=Math.max(maxTransformDelta,Math.abs(v-bb[j])));return JSON.stringify({...node,transform:null})===JSON.stringify({...other,transform:null});});
    setStatus(JSON.stringify({code:meta.code,key:meta.key,time:t,glyphAttributesEqual:same,maxTransformDelta,withinSubpixelTolerance:same&&maxTransformDelta<.25}));
   }
  }catch(e){setStatus(String(e));}
 }
 useEffect(()=>{if(ready)compare(studyStillFrame(props,60)/60);},[id,ready,mode]);
 return <main style={{fontFamily:'system-ui',padding:16,color:'#222',background:'#f3f1eb',minHeight:'100vh'}}>
  <h1 style={{fontSize:20,margin:'0 0 12px'}}>已确认预览 / 网站组件</h1>
  <div style={{display:'flex',gap:10,flexWrap:'wrap'}}><select aria-label="检查动效" value={id} onChange={e=>setId(e.target.value)}>{STUDIES.map(s=><option key={s.id} value={s.id}>{s.code} {s.name}</option>)}</select>{meta.key==='logo'&&<select aria-label="检查字标版本" value={mode} onChange={e=>setMode(e.target.value)}><option value="gather">弹性聚拢</option><option value="flip">翻转落位</option><option value="wave">波浪展开</option></select>}<input aria-label="检查秒数" type="number" min="0" max={meta.seconds-.02} step="0.1" value={time} onChange={e=>setTime(Number(e.target.value))}/><button onClick={()=>compare(time)}>比较本帧</button><button onClick={()=>compare(0)}>开头</button><button onClick={()=>compare(Math.round((meta.seconds-.1)*10)/10)}>结尾</button></div>
  <pre role="status" style={{whiteSpace:'pre-wrap',fontSize:12,lineHeight:1.5,minHeight:50}}>{status}</pre>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,alignItems:'start'}}><section><h2 style={{fontSize:14}}>已确认原预览</h2><iframe ref={iframe} title="已确认原预览" srcDoc={source} onLoad={()=>{if(source)setReady(true);}} style={{display:'block',width:'100%',aspectRatio:meta.width+'/'+meta.height,border:0}}/></section><section ref={updated}><h2 style={{fontSize:14}}>迁移后网站组件</h2><Player key={id} ref={player} component={StudyMotion} inputProps={props} compositionWidth={meta.width} compositionHeight={meta.height} fps={60} durationInFrames={duration} controls={false} autoPlay={false} style={{width:'100%'}}/></section></div>
 </main>;
}
createRoot(document.getElementById('review')!).render(<Review/>);
