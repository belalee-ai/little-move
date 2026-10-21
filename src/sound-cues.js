import {EFFECTS,layoutText,typingSchedule} from './motion-core.js';
import {STUDIES} from './studies/catalog.js';
import {DEMOS} from './demos/catalog.js';
export const SOUND_OPTIONS=[['off','关闭'],['auto','推荐音效'],['tap','轻触'],['tick','键入'],['sweep','轻扫'],['land','柔和落位'],['chime','清亮提示'],['paper','纸张摩擦'],['glitch','电子颗粒']];
export const SOUND_SECONDS={tap:.075,tick:.045,sweep:.44,land:.23,chime:.42,paper:.24,glitch:.16,error:.22};
const catalog=[...EFFECTS,...STUDIES,...DEMOS];
export const soundMeta=id=>catalog.find(item=>item.id===id);
const quiet=new Set(['fade','gradient','neon','focus','marquee','circle','demo-voice','demo-voice-orb','demo-voice-message','demo-ios-volume','demo-parallax','demo-compare']);
export function recommendedSound(id){
 const m=soundMeta(id);if(!m||quiet.has(id)||m.category==='声音与进度')return 'off';
 if(/typing|typewriter|rewrite|scramble|ios-wheel/.test(id))return 'tick';
 if(id==='word')return 'tap';
 if(/glitch/.test(id))return 'glitch';
 if(m.collection==='交互')return 'tap';
 if(m.collection==='数据')return 'chime';
 if(/impact|bounce|gather|logo|stickers/.test(id))return 'land';
 if(/fold|slices|weave/.test(id))return 'paper';
 return 'sweep';
}
export const resolvedSound=(id,preset='off')=>preset==='auto'?recommendedSound(id):SOUND_SECONDS[preset]?preset:'off';
/** Time is always in composition seconds; speed changes move events, not just visuals. */
export function soundCues(id,p={},fps=60,duration=480){
 const kind=resolvedSound(id,p.soundPreset),speed=Math.max(.5,Math.min(2,p.speed??1));
 if(kind==='off'||p.input||p.native)return [];
 const meta=soundMeta(id);if(!meta)return [];
 let times=[],clips=[];
 if(!id.startsWith('study-')&&!id.startsWith('demo-')){
  const offset=p.startSeconds??.3;
  if(id==='typing'||id==='typewriter'){
   const groups=[layoutText(p.text??'',p.fontSize??128,160,205,p.fontFamily??'Noto Sans SC',500),...(p.bilingual?[layoutText(p.englishText??'',Math.max(42,(p.fontSize??128)*.43),100,365,p.fontFamily??'Noto Sans SC',450)]:[])];
   times=groups.flatMap(glyphs=>{const starts=id==='typing'?typingSchedule(glyphs):glyphs.map((g,i)=>i*Math.max(.045,1.25/Math.max(1,glyphs.length)));return starts.filter((_,i)=>!/^\s$/.test(glyphs[i].char));}).map(t=>offset+t/speed);
  }else if(id==='word'){
   const glyphs=layoutText(p.text??'',p.fontSize??128,160,205,p.fontFamily??'Noto Sans SC',550);
   times=[...new Set(glyphs.map(g=>g.group))].map(group=>offset+group*.14/speed);
  }else times=[offset+(id==='impact'?.2:id==='gather'?.35:0)/speed];
 }else if(id.startsWith('study-')){
  times=[.35/speed];
  if(/logo|stickers/.test(id))times=[.35,.65,1].map(t=>t/speed);
 }else{
  // Explicit UI state boundaries, shared with each demo's automatic timeline.
  const ui={
   'mic-capsule':[1.1,6.3],'push-talk':[1,4.8],'memo-panel':[.7,2.8,3.8,5.4],
   'call-mute':[2,4,6.3],'ios-context':[1.3,6],'ios-swipe':[1.3,4.5],
   'ios-wheel':[1.5,1.85,2.2,2.5,4.7,5.1,5.5],'ios-refresh':[2.4,4],
   'ios-search':[1.15,1.8,2.15,2.5,2.85,3.1],
   press:[.65,5.05],input:[.7],switch:[.65,5.05],tabs:[1.3,3.5,6],
   drag:[1.65,3.75,5.75,7.15],accordion:[1.3,3.5,6],
   carousel:[.95,3.62,6.28],bento:[1.3,3.8],
  };
  const key=meta.key;
  if(key.startsWith('captcha-')){times=key==='captcha-order'?[1.05,2.35,3.15,4.05,4.35]:[1.6,4.55];clips=key==='captcha-order'?['error','tap','tap','tap','chime']:['error','chime'];}
  else if(ui[key])times=ui[key];
  else if(meta.collection==='数据')times=[3.7];
  else times=[.65];
  times=times.map(t=>t/speed);
 }
 // Merge coincident bilingual keystrokes; cap density without detaching from the glyph times.
 return times.map((t,i)=>({frame:Math.round(t*fps),kind:p.soundPreset==='auto'?(clips[i]??kind):kind})).sort((a,b)=>a.frame-b.frame).filter((e,i,a)=>e.frame>=0&&e.frame<duration&&(!i||e.frame-a[i-1].frame>=Math.max(1,Math.round(fps*.025))));
}
