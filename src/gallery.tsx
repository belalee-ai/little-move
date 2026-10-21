import {isCoverage} from './coverage/catalog.js';
import {SoundOptions,stopSoundAudition} from './SoundOptions';
import type {SoundProps} from './MotionSound';
import React,{useRef,useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Player,type PlayerRef} from '@remotion/player';
import {TextMotion,type MotionProps,loadPreviewFonts} from './TextMotion';
import {EFFECTS,DEFAULTS,previewFrames,previewFps,previewStillFrame,karaokePalette} from './motion-core.js';
import {FONT_OPTIONS} from './fonts';
import {StudyMotion,type StudyProps} from './StudyMotion';
import {StudySettings} from './StudySettings';
import {STUDIES,studyById,studyDefaults,studyFrames,studyStillFrame} from './studies/catalog.js';
import {DemoPreview} from './DemoPreview';
import {isVoiceUI} from './voice-ui/catalog.js';
import {isVerification} from './verification/catalog.js';
import {isBatch} from './batch/catalog.js';
import {DemoSettings} from './DemoSettings';
import type {DemoProps} from './DemoMotion';
import {DEMOS,demoById,demoDefaults,demoFrames,demoStillFrame} from './demos/catalog.js';
import './gallery.css';
type CatalogItem={id:string;code:string;name:string;english:string;prompt:string;category:string;collection:string;source:string|null;aliases:string[]};
const CATALOG:CatalogItem[]=[...EFFECTS.map(e=>({...e,collection:'基础文字'})),...STUDIES,...DEMOS].sort((a,b)=>Number(a.code)-Number(b.code)) as CatalogItem[];

const looks=[
 {name:'纸白墨黑',color:'#181717',accent:'#6B6965',background:'#FAF9F6'},
 {name:'青柠暖白',color:'#203222',accent:'#A9E83F',background:'#F8FBF2'},
 {name:'玫粉奶油',color:'#49343D',accent:'#E1668F',background:'#FFF8F4'},
 {name:'墨色纸白',color:'#232326',accent:'#D98543',background:'#F5F1E9'},
 {name:'夜色',color:'#F6F3E9',accent:'#B6F05C',background:'#202623'},
];
const App=()=>{
 const [soundConfigs,setSoundConfigs]=useState<Record<string,SoundProps>>({});
 const soundRef=useRef(soundConfigs);soundRef.current=soundConfigs;
 const soundFor=(id:string):SoundProps=>soundConfigs[id]??{soundPreset:'off',soundVolume:.35};
 const setSound=(id:string,value:SoundProps)=>{stopSoundAudition();setSoundConfigs(old=>Object.fromEntries([...Object.entries(old).map(([key,config])=>[key,key!==id&&value.soundPreset&&value.soundPreset!=='off'?{...config,soundPreset:'off'}:config] as const),[id,value]]));};
 useEffect(()=>{const quiet=()=>{if(document.hidden)stopSoundAudition();};document.addEventListener('visibilitychange',quiet);return()=>{document.removeEventListener('visibilitychange',quiet);stopSoundAudition();};},[]);
 const [props,setProps]=useState<MotionProps>({...DEFAULTS,...looks[0]});
 const [selected,setSelected]=useState('gather');
 const [query,setQuery]=useState('');const [category,setCategory]=useState('全部');
 const [collection,setCollection]=useState('全部');
 const [studyConfigs,setStudyConfigs]=useState<Record<string,StudyProps>>({});
 const studyRef=useRef(studyConfigs);studyRef.current=studyConfigs;
 const studyProps=(id:string):StudyProps=>studyRef.current[id]??studyDefaults(id) as StudyProps;
 const selectedStudy=studyById(selected),selectedDemo=demoById(selected);
 const [demoConfigs,setDemoConfigs]=useState<Record<string,DemoProps>>({});
 const demoRef=useRef(demoConfigs);demoRef.current=demoConfigs;
 const demoProps=(id:string):DemoProps=>demoRef.current[id]??demoDefaults(id);
 const switchCollection=(next:string)=>{setCollection(next);setCategory('全部');if(next==='创意字体'&&!selectedStudy)setSelected('study-variable');if(['图片与图形','布局','交互','数据'].includes(next))setSelected(DEMOS.find(d=>d.collection===next)!.id);if(next==='基础文字'&&(selectedStudy||selectedDemo))setSelected('gather');};
 const visible=useRef(new Set<string>());
 const resumeOnReturn=useRef<Record<string,boolean>>({});
 const propsRef=useRef(props);propsRef.current=props;
 const collectionItems=CATALOG.filter(e=>collection==='全部'||e.collection===collection);
 const categories=['全部',...new Set(collectionItems.map(e=>e.category))];
 const filtered=collectionItems.filter(e=>(category==='全部'||e.category===category)&&query.toLowerCase().trim().split(/\s+/).every(term=>[e.code,e.name,e.english,e.prompt,...e.aliases].join(' ').toLowerCase().includes(term)));
 const [look,setLook]=useState(0);
 const [fontChoice,setFontChoice]=useState(DEFAULTS.fontFamily);
 const [fontLoading,setFontLoading]=useState(false);
 const fontRequest=useRef(0);
 const [promptCopy,setPromptCopy]=useState({id:'',message:''});
 const [ready,setReady]=useState(false);const [fontError,setFontError]=useState('');
 const [reduceMotion,setReduceMotion]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const refs=useRef<Record<string,PlayerRef|null>>({});
 useEffect(()=>{const paused=new Set<string>();const visibility=()=>{if(document.hidden){for(const [id,config]of Object.entries(soundRef.current)){const p=refs.current[id];if(config.soundPreset!=='off'&&p?.isPlaying()){paused.add(id);p.pause();}}}else{for(const id of paused){if(visible.current.has(id)&&soundRef.current[id]?.soundPreset!=='off'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)refs.current[id]?.play();}paused.clear();}};document.addEventListener('visibilitychange',visibility);return()=>document.removeEventListener('visibilitychange',visibility);},[]);
 const settingsRef=useRef<HTMLDivElement>(null);
 const settingsButtonRef=useRef<HTMLButtonElement>(null);
 const galleryRef=useRef<HTMLElement>(null);
 const [settingsOpen,setSettingsOpen]=useState(false);
 const [settingsMotion,setSettingsMotion]=useState(true);
 const animateCategory=useRef(false);
 const copyRequest=useRef(0);
 useEffect(()=>{if(promptCopy.message!=='已复制')return;const timer=window.setTimeout(()=>setPromptCopy({id:'',message:''}),2600);return()=>window.clearTimeout(timer);},[promptCopy]);
 useEffect(()=>{if(!animateCategory.current)return;animateCategory.current=false;if(reduceMotion)return;const animation=galleryRef.current?.animate([{opacity:.65,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(0.23,1,0.32,1)'});return()=>animation?.cancel();},[category,reduceMotion]);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const changed=()=>setReduceMotion(media.matches);media.addEventListener('change',changed);return()=>media.removeEventListener('change',changed);},[]);
 useEffect(()=>{loadPreviewFonts().then(()=>setReady(true)).catch(()=>setFontError('字体加载失败，请刷新页面。'));},[]);
 const update=(values:Partial<MotionProps>)=>{setProps(p=>({...p,...values}));};
 useEffect(()=>{if(ready)Object.entries(refs.current).forEach(([id,p])=>{if(!p)return;const playing=p.isPlaying(),inView=visible.current.has(id),study=studyById(id),fps=study||demoById(id)?60:previewFps(id);p.seekTo(reduceMotion||inView&&!playing?(demoById(id)?demoStillFrame(demoProps(id),fps):study?studyStillFrame(studyProps(id),fps):previewStillFrame({...props,effect:id},fps)):0);if(!reduceMotion&&inView&&playing)p.play();else p.pause();});},[props,ready,reduceMotion]);
 useEffect(()=>{if(!ready)return;Object.entries(refs.current).forEach(([id,player])=>{if(!player||!studyById(id))return;const playing=player.isPlaying(),inView=visible.current.has(id);player.seekTo(reduceMotion||inView&&!playing?studyStillFrame(studyProps(id),60):0);if(playing&&inView&&!reduceMotion)player.play();else player.pause();});},[studyConfigs]);
 useEffect(()=>{
  if(!ready)return;visible.current.clear();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   const id=(entry.target as HTMLElement).dataset.effect!,player=refs.current[id];
   if(entry.isIntersecting){visible.current.add(id);if(reduceMotion){const study=studyById(id),demo=demoById(id),fps=study||demo?60:previewFps(id);player?.seekTo(demo?demoStillFrame(demoProps(id),fps):study?studyStillFrame(studyProps(id),fps):previewStillFrame({...propsRef.current,effect:id},fps));player?.pause();}else if(resumeOnReturn.current[id]!==false)player?.play();}
   else{if(visible.current.has(id)&&!reduceMotion&&player)resumeOnReturn.current[id]=player.isPlaying();visible.current.delete(id);player?.pause();}
  }),{rootMargin:'80px',threshold:.05});
  document.querySelectorAll('article[data-effect]').forEach(el=>observer.observe(el));return()=>observer.disconnect();
 },[ready,category,query,reduceMotion,collection]);
 useEffect(()=>{if(!ready)return;for(const [id,player] of Object.entries(refs.current)){if(!player||!demoById(id))continue;const playing=player.isPlaying();player.seekTo(reduceMotion?demoStillFrame(demoProps(id),60):0);if(playing&&!reduceMotion&&visible.current.has(id))player.play();}},[demoConfigs]);
 const chooseFont=async(family:string)=>{
  const request=++fontRequest.current;setFontChoice(family);setFontLoading(true);setFontError('');
  try{await loadPreviewFonts(family);if(request!==fontRequest.current)return;update({fontFamily:family});}
  catch{if(request!==fontRequest.current)return;setFontChoice(propsRef.current.fontFamily);setFontError('字体加载失败，请重新选择后重试。');}
  finally{if(request===fontRequest.current)setFontLoading(false);}
 };
 const copyPrompt=async(item:CatalogItem)=>{
  const request=++copyRequest.current;
  try{await navigator.clipboard.writeText(`${item.code} ${item.name}\n${item.prompt}`);if(request===copyRequest.current)setPromptCopy({id:item.id,message:'已复制'});}catch{if(request===copyRequest.current)setPromptCopy({id:item.id,message:'复制失败，可直接选中文字复制'});}
 };
 return <div className="app-shell">
  <aside className="sidebar">
   <a className="brand" href="#catalog" aria-label="Little Move">Little <br/>Move<span aria-hidden="true">↗</span></a>
   <nav className="collection-nav" aria-label="动效分区">{['全部','基础文字','创意字体','图片与图形','布局','交互','数据'].map(c=><button key={c} aria-pressed={collection===c} onClick={event=>{animateCategory.current=event.detail!==0;switchCollection(c);}}>{c}<span>{String(c==='全部'?CATALOG.length:CATALOG.filter(e=>e.collection===c).length).padStart(2,'0')}</span></button>)}</nav>
   <div className="library-type">按动作查找</div>
   <nav aria-label="动效分类">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={event=>{animateCategory.current=event.detail!==0;setCategory(c);}}>{c==='全部'?'全部分类':c}<span>{String(c==='全部'?collectionItems.length:collectionItems.filter(e=>e.category===c).length).padStart(2,'0')}</span></button>)}</nav>
  <details className="source-details"><summary>参考来源</summary><p>预览为本库实现，源站用于参考；搜索别名表示相近动作。</p><ul>{CATALOG.filter(item=>item.source).map(item=><li key={item.id}><a href={item.source!} target="_blank" rel="noreferrer">{item.code} {item.name} ↗</a></li>)}</ul></details>
  </aside>
  <main id="catalog">
   <header className="intro"><h1>{category==='全部'?(collection==='创意字体'?'创意字体编排':collection==='基础文字'?'基础文字动效':collection==='全部'?'Little Move':collection):category}</h1><span className="catalog-count">{String(filtered.length).padStart(2,'0')}</span></header>
   <section className="catalog-search" aria-label="查找动效">
    <label className="search-field"><span>搜索</span><input aria-label="搜索动效" placeholder="编号、名称或动作描述" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <div className={`preview-settings ${settingsMotion?'':'instant-settings'}`} data-open={settingsOpen} ref={settingsRef} onKeyDown={event=>{if(event.key==='Escape'&&settingsOpen){event.stopPropagation();setSettingsMotion(false);setSettingsOpen(false);settingsButtonRef.current?.focus({preventScroll:true});}}}><button className="settings-toggle" ref={settingsButtonRef} aria-expanded={settingsOpen} aria-controls="preview-settings-body" onClick={event=>{setSettingsMotion(event.detail!==0);setSettingsOpen(open=>!open);}}>预览设置<span className="disclosure-symbol" aria-hidden="true"/></button><div className="settings-reveal" id="preview-settings-body" inert={!settingsOpen} aria-hidden={!settingsOpen}><div className="settings-clip"><div className="settings-content">
  {selectedDemo?<DemoSettings key={selected} value={{...demoProps(selected),...soundFor(selected)}} onChange={value=>setDemoConfigs(old=>({...old,[selected]:value}))}/>:selectedStudy?<StudySettings key={selected} value={{...studyProps(selected),...soundFor(selected)}} onChange={value=>setStudyConfigs(old=>({...old,[selected]:value}))}/>:<>
  <section className="controls" aria-label="预览设置">
   <label className="text-control">中文<input aria-label="预览文字" maxLength={24} value={props.text} onChange={e=>update({text:e.target.value})}/></label>
   <label className="text-control">英文<input aria-label="英文对比" maxLength={48} value={props.englishText} onChange={e=>update({englishText:e.target.value})}/></label>
   <label>字体<select aria-label="字体" value={fontChoice} onChange={e=>chooseFont(e.target.value)}>{FONT_OPTIONS.map(font=><option key={font.family} value={font.family}>{font.label}</option>)}</select>{fontLoading&&<span role="status">正在载入字体…</span>}</label>
   <div className="look-control"><span>视觉风格</span><div className="looks">{looks.map((item,i)=><button key={item.name} aria-pressed={i===look} className={i===look?'active':''} onClick={()=>{setLook(i);update(item);}}><i style={{background:item.accent}}/>{item.name}</button>)}</div></div>
   <label>动作速度 <b>{props.speed.toFixed(1)}×</b><input aria-label="动作速度" type="range" min="0.5" max="2" step="0.1" value={props.speed} onChange={e=>update({speed:Number(e.target.value)})}/></label>
   <label>动感强度 <b>{props.impact.toFixed(1)}</b><input aria-label="动感强度" type="range" min="0.6" max="1.8" step="0.1" value={props.impact} onChange={e=>update({impact:Number(e.target.value)})}/></label>
   <label className="toggle"><input aria-label="中英对比" type="checkbox" checked={props.bilingual} onChange={e=>update({bilingual:e.target.checked})}/>中英对比</label>
  </section>
  {selected==='cycle'&&<section className="alternate-controls" aria-label="换词内容"><label>替换中文<input aria-label="替换中文" maxLength={24} value={props.alternateText} onChange={e=>update({alternateText:e.target.value})}/></label><label>替换英文<input aria-label="替换英文" maxLength={48} value={props.englishAlternateText} onChange={e=>update({englishAlternateText:e.target.value})}/></label></section>}
  <div className="advanced-settings"><section className="gather-control"><label>字号 <b>{props.fontSize}</b><input aria-label="字号" type="range" min="56" max="150" step="2" value={props.fontSize} onChange={e=>update({fontSize:Number(e.target.value)})}/></label><label className="color-control">文字颜色<input aria-label="文字颜色" type="color" value={props.color} onChange={e=>update({color:e.target.value})}/></label><label className="toggle"><input aria-label="透明背景" type="checkbox" checked={props.transparentBackground} onChange={e=>update({transparentBackground:e.target.checked})}/>透明背景</label>{['glitch','shine','gradient','outline','neon','echo'].includes(selected)&&<label className="toggle"><input aria-label="光影深色底" type="checkbox" checked={props.lightOnDark!==false} onChange={e=>update({lightOnDark:e.target.checked})}/>光影深色底</label>}{selected==='neon'&&<div className="look-control neon-colors"><label className="color-control">霓虹颜色<input aria-label="霓虹颜色" type="color" value={props.lightColor??DEFAULTS.lightColor} onChange={e=>update({lightColor:e.target.value})}/></label><div className="looks">{[{name:'冰蓝',color:'#26D9FF'},{name:'玫红',color:'#FF4FA0'},{name:'紫罗兰',color:'#A76BFF'}].map(item=><button key={item.color} aria-label={'霓虹'+item.name} aria-pressed={props.lightColor?.toUpperCase()===item.color} className={props.lightColor?.toUpperCase()===item.color?'active':''} onClick={()=>update({lightColor:item.color})}><i style={{background:item.color}}/>{item.name}</button>)}</div></div>}{selected==='highlight'&&<label className="color-control">荧光颜色<input aria-label="荧光颜色" type="color" value={props.markerColor??DEFAULTS.markerColor} onChange={e=>update({markerColor:e.target.value})}/></label>}{selected==='karaoke'&&<label className="color-control">高亮颜色<input aria-label="歌词高亮颜色" type="color" value={props.karaokeColor??karaokePalette(props).active} onChange={e=>update({karaokeColor:e.target.value})}/></label>}{selected==='gather'&&<><label>散字幅度 <b>{props.scatter.toFixed(1)}</b><input aria-label="散字幅度" type="range" min="0.2" max="1.3" step="0.1" value={props.scatter} onChange={e=>update({scatter:Number(e.target.value)})}/></label><button onClick={()=>update({seed:(props.seed+31)%999})}>换一种排列</button></>}</section></div>

  </>}
    </div></div></div></div>
   </section>
  <span className="sr-only" role="status" aria-live="polite">{promptCopy.message==='已复制'?'已复制动效编号、名称和提示词':''}</span>
  {fontError&&<p role="alert">{fontError}</p>}
  <section className="gallery" aria-label="动效预览" ref={galleryRef}>
   {filtered.map(item=>{const study=studyById(item.id),demo=demoById(item.id);return <article key={item.id} data-effect={item.id} className={`effect-card ${selected===item.id?'selected':''}`}>
    <header className="effect-title"><span className="effect-code">{item.code}</span><h3>{item.name}</h3><SoundOptions id={item.id} code={item.code} value={soundFor(item.id)} player={()=>refs.current[item.id]} onChange={value=>setSound(item.id,value)}/><button className="copy-prompt" data-copied={promptCopy.id===item.id&&promptCopy.message==='已复制'} aria-label={'复制'+item.code+' '+item.name+'提示词'} onClick={()=>copyPrompt(item)}>{promptCopy.id===item.id&&promptCopy.message==='已复制'?'已复制 ✓':'复制提示词'}</button></header>
    <div className={`stage ${!study&&!demo&&props.transparentBackground?'checker':''}`} style={demo?{aspectRatio:demo.collection==='数据'||isCoverage(item.id)||isBatch(item.id)||isVerification(item.id)||isVoiceUI(item.id)?'auto':'800/500'}:study?{aspectRatio:study.width+'/'+study.height}:undefined}>
     {ready?(demo?<DemoPreview value={{...demoProps(item.id),...soundFor(item.id)}} reduced={reduceMotion} playerRef={r=>{refs.current[item.id]=r;}}/>:study?<Player ref={r=>{refs.current[item.id]=r;}} component={StudyMotion} inputProps={{...studyProps(item.id),...soundFor(item.id)}} durationInFrames={studyFrames(studyProps(item.id),60)} compositionWidth={study.width} compositionHeight={study.height} fps={60} controls loop autoPlay={false} style={{width:'100%'}}/>:<Player ref={r=>{refs.current[item.id]=r;}} component={TextMotion} inputProps={{...props,effect:item.id,...soundFor(item.id)}} durationInFrames={previewFrames({...props,effect:item.id},previewFps(item.id))} compositionWidth={900} compositionHeight={520} fps={previewFps(item.id)} controls loop autoPlay={false} style={{width:'100%'}}/>):<div className="loading">正在载入字体…</div>}
    </div>
    <div className="card-copy"><p className="motion-prompt">{item.prompt}</p>{promptCopy.id===item.id&&promptCopy.message!=='已复制'&&<p role="status">{promptCopy.message}</p>}</div>
    <div className="card-actions"><button className="choose" aria-pressed={selected===item.id} onClick={event=>{const pointer=event.detail!==0;setSelected(item.id);setSettingsMotion(pointer);setSettingsOpen(true);settingsRef.current?.scrollIntoView({behavior:reduceMotion||!pointer?'auto':'smooth',block:'start'});if(!pointer)settingsButtonRef.current?.focus({preventScroll:true});}}>调整参数</button></div>
   </article>;})}
  </section>
  {filtered.length===0&&<div className="empty-results"><p>暂时没有匹配的效果，试试动作或相近叫法。</p><button onClick={()=>{setQuery('');setCategory('全部');}}>查看全部效果</button></div>}

  </main>
 </div>;
};
createRoot(document.getElementById('root')!).render(<App/>);
