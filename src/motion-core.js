import {LATIN_FONT_METRICS} from './latin-font-metrics.js';
// Frame-driven adaptations of Remotion Bits and Remotion Scenes; see notices.
export const EFFECTS = [
 {code:'001',id:'word',category:'入场与出现',english:'Word by Word',aliases:["逐字出现","逐词弹入"],prompt:'文字按词组依次弹入，轻微回弹后落稳，不加描边或阴影。',name:'逐词出现',tag:'跟随讲述',note:'完整句子按词组弹性落位，保持干净字形。',source:'https://remotion-bits.dev/docs/bits/word-by-word/'},
 {code:'002',id:'blur',category:'入场与出现',english:'Blur In',aliases:["字影渐显","模糊缩小","向上模糊"],prompt:'文字从下方带模糊和放大进入，逐渐清晰并回到原位与正常大小。',name:'模糊上推',tag:'柔和入场',note:'带缩放与位移的聚焦入场，从模糊冲入清晰。',source:'https://remotion-bits.dev/docs/bits/blur-slide-word/'},
 {code:'003',id:'mask',category:'入场与出现',english:'Mask Reveal',aliases:["向右露出","向右擦入","幕帘擦入"],prompt:'用从左向右的遮罩依次擦出文字，边缘轻微平移后落稳，最后停留。',name:'遮罩揭示',tag:'干净标题',note:'从左向右逐字擦开，留完整阅读时间。',source:'https://lifeprompt-team.github.io/remotion-scenes/'},
 {code:'004',id:'typewriter',category:'打字与解码',english:'Pop Typewriter',aliases:["弹跳打字","打字机"],prompt:'光标逐字输入，每个新字由稍大缩回正常大小，带轻微弹入感。',name:'光标打字',tag:'输入过程',note:'文字逐字键入，光标跟在当前输入处。',source:'https://remotion-bits.dev/docs/bits/basic-typewriter/'},
 {code:'005',id:'wave',category:'循环与强调',english:'Wave Text',aliases:["波浪弹跳","波纹跳动"],prompt:'文字依次弹入后上下波动，伴随轻微挤压和旋转，再逐渐停稳。',name:'波浪文字',tag:'情绪强调',note:'轻弹进入后波动一小段，再落稳。',source:'https://lifeprompt-team.github.io/remotion-scenes/'},
 {code:'006',id:'flip',category:'入场与出现',english:'3D Flip',aliases:["三维翻转","逐字翻转"],prompt:'文字逐字从侧面立体翻正，轻微回弹后排齐，不加描边或阴影。',name:'三维翻字',tag:'章节亮相',note:'逐字从侧面翻正，停在清楚的完成态。',source:'https://lifeprompt-team.github.io/remotion-scenes/'},
 {code:'007',id:'gather',category:'入场与出现',english:'Scatter Gather',aliases:["随机集合","汇聚","散字聚拢","字乱飞最后拼起来"],prompt:'文字先分散在不同位置和角度，再带短拖影旋转聚拢，拼成完整句子。',name:'散字归位',tag:'从乱到整',note:'散字带旋转和短拖影，最后吸附成完整句子。',source:null},
 {code:'008',id:'typing',category:'打字与解码',english:'Natural Typewriter',aliases:["复古打字机","停顿打字","光标打字"],prompt:'光标逐字键入，字间有轻重停顿、标点处停得更久；字号和已输入文字位置始终固定。',name:'停顿打字',tag:'真实键入',note:'字号固定，光标逐字前进；输入有轻重停顿，标点处稍作停留。',source:null},
 {code:'009',"id":"fade","name":"逐字渐显","english":"Fade In","category":"入场与出现","prompt":"文字按阅读顺序逐字由透明变清晰，位置与字号保持固定。","note":"文字按阅读顺序逐字由透明变清晰，位置与字号保持固定。","source":"https://motion-primitives.com/docs/text-effect","aliases":["文字渐显","逐字显现","淡入文字"]},
 {code:'010',"id":"slide","name":"侧滑入场","english":"Slide In","category":"入场与出现","prompt":"整句文字从右侧滑入，先快后慢，最后停在原位。","note":"整句文字从右侧滑入，先快后慢，最后停在原位。","source":"https://motion-primitives.com/docs/text-effect",aliases:["右侧滑入","向左滑入","弹幕入场"]},
 {code:'011',"id":"bounce","name":"逐字弹跳","english":"Character Bounce","category":"入场与出现","prompt":"每个字依次从下方弹起，越过目标位置后轻微回弹并落稳。","note":"每个字依次从下方弹起，越过目标位置后轻微回弹并落稳。","source":"https://motion.dev/docs/text-animation",aliases:["逐字跳入","波浪弹入","逐个弹入"]},
 {code:'012',"id":"zoom","name":"中心缩放","english":"Scale In","category":"入场与出现","prompt":"整句文字从中心由小放大，轻微超过正常大小后回弹落稳。","note":"整句文字从中心由小放大，轻微超过正常大小后回弹落稳。","source":"https://motion-primitives.com/docs/text-effect",aliases:["放大","缩放","缩放弹入"]},
 {code:'013',"id":"tracking","name":"字距生长","english":"Letter Spacing","category":"入场与出现","prompt":"文字从紧密排列向两侧展开，字距逐渐恢复正常，字号不变。","note":"文字从紧密排列向两侧展开，字距逐渐恢复正常，字号不变。","source":"https://magicui.design/docs/components/text-animate",aliases:["生长","字距展开","拉近展开"]},
 {code:'014',"id":"spin","name":"旋转入场","english":"Rotate In","category":"入场与出现","prompt":"每个字依次旋转半圈并由小变大，最终摆正排齐。","note":"每个字依次旋转半圈并由小变大，最终摆正排齐。","source":"https://magicui.design/docs/components/text-animate",aliases:["逐字旋入","旋转入场","旋转缩放"]},
 {code:'015',"id":"roll","name":"上翻滚入","english":"Rolling Text","category":"入场与出现","prompt":"文字从下方逐字向上滚入裁切窗口，停住后组成完整句子。","note":"文字从下方逐字向上滚入裁切窗口，停住后组成完整句子。","source":"https://motion.dev/docs/text-animation",aliases:["滚入","向上滑入","向上滚入"]},
 {code:'016',"id":"flipUp","name":"向上翻转","english":"Flip Up","category":"入场与出现","prompt":"每个字绕水平轴从下方向上翻正，逐字展开并落稳。","note":"每个字绕水平轴从下方向上翻正，逐字展开并落稳。","source":"https://magicui.design/docs/components/text-3d-flip","aliases":["水平翻转","逐字翻转","站起"]},
 {code:'017',"id":"scramble","name":"乱码解码","english":"Scramble / Decode","category":"打字与解码","prompt":"文字先快速跳动为随机字符，再从左到右逐字锁定为正确内容。","note":"文字先快速跳动为随机字符，再从左到右逐字锁定为正确内容。","source":"https://magicui.design/docs/components/hyper-text",aliases:["科技重组","乱码打字","随机字符","解码"]},
 {code:'018',"id":"glitch",previewAt:0.12,"name":"故障闪动","english":"Glitch Text","category":"光影与质感","prompt":"文字分段撕裂、错帧跳位，带红青分色和扫描线；数次故障后恢复清晰。","note":"文字分段撕裂、错帧跳位，带红青分色和扫描线；数次故障后恢复清晰。","source":"https://reactbits.dev/text-animations/glitch-text",aliases:["故障","故障抖动","色差错位"]},
 {code:'019',"id":"shine",previewAt:1.2,"name":"扫光文字","english":"Text Shimmer","category":"光影与质感","prompt":"窄幅白色亮带斜向扫过银灰字面，以明暗变化呈现反光，不加外围光晕。","note":"窄幅白色亮带斜向扫过银灰字面，以明暗变化呈现反光，不加外围光晕。","source":"https://magicui.design/docs/components/animated-shiny-text",aliases:["光线划过","字面扫光","高光文字"]},
 {code:'020',"id":"gradient",previewAt:1.15,"name":"流动渐变","english":"Gradient Text","category":"光影与质感","prompt":"多色光斑在字面内部交错流动，形成不断变化的极光渐变。","note":"多色光斑在字面内部交错流动，形成不断变化的极光渐变。","source":"https://magicui.design/docs/components/aurora-text",aliases:["彩色映射","极光文字","渐变文字"]},
 {code:'021',"id":"outline",previewAt:1.0,"name":"柔光显影","english":"Soft Light Reveal","category":"光影与质感","prompt":"柔和光带从下向上唤亮实心文字，边缘由虚到实，最后留下清晰字面，不加描边。","note":"柔和光带从下向上唤亮实心文字，边缘由虚到实，最后留下清晰字面，不加描边。","source":null,"aliases":["描边填充","空心字","轮廓填充","柔光揭示","显影"]},
 {code:'022',"id":"neon",previewAt:0.95,"name":"霓虹呼吸","english":"Neon Glow","category":"光影与质感","prompt":"细灯管字以明亮灯芯和饱和彩光持续呼吸，暗下时保留灯管轮廓，亮起时光晕向外扩散，不加硬描边。","note":"细灯管字以明亮灯芯和饱和彩光持续呼吸，暗下时保留灯管轮廓，亮起时光晕向外扩散，不加硬描边。","source":null,aliases:["模糊发光","呼吸发光","霓虹字"]},
 {code:'023',"id":"echo",previewAt:0.95,"name":"多重残影","english":"Echo Text","category":"光影与质感","prompt":"文字快速摆动，五层彩色残影延迟跟随，再逐层追上并收拢为清晰文字。","note":"文字快速摆动，五层彩色残影延迟跟随，再逐层追上并收拢为清晰文字。","source":"https://reactbits.dev/text-animations/echo-text","aliases":["叠影","拖尾","多重残影","叠影并入"]},
 {code:'024',"id":"focus","name":"逐词聚焦","english":"True Focus","category":"循环与强调","prompt":"清晰焦点按词组依次移动，其余文字轻微模糊，最后全部恢复清晰。","note":"清晰焦点按词组依次移动，其余文字轻微模糊，最后全部恢复清晰。","source":"https://reactbits.dev/text-animations/true-focus",aliases:["逐词模糊","聚焦","清晰焦点"]},
 {code:'025',"id":"marquee","name":"横向跑马灯","english":"Marquee","category":"循环与强调","prompt":"整句文字匀速向左滚动，后方接续同一句形成循环，最后归位停留。","note":"整句文字匀速向左滚动，后方接续同一句形成循环，最后归位停留。","source":"https://magicui.design/docs/components/marquee","aliases":["弹幕","向左滑动","滚动文字"]},
 {code:'026',"id":"circle","name":"环形旋转","english":"Spinning Text","category":"循环与强调","prompt":"文字沿圆环排布，整环平滑旋转；中英对比时左中文、右英文分别成环。","note":"文字沿圆环排布，整环平滑旋转；中英对比时左中文、右英文分别成环。","source":"https://magicui.design/docs/components/spinning-text",aliases:["环形排字","环绕文字","圆圈文字"]},
 {code:'027',"id":"cycle","name":"循环换词","english":"Word Rotate","category":"循环与强调","prompt":"两句文字在同一位置轮流向上切换，旧句退出后新句滑入，最后回到首句。","note":"两句文字在同一位置轮流向上切换，旧句退出后新句滑入，最后回到首句。","source":"https://magicui.design/docs/components/word-rotate",aliases:["换词","循环切换","文字轮播"]},
 {code:'028',"id":"highlight","name":"荧光标记","english":"Text Highlighter","category":"循环与强调","prompt":"文字保持固定，纤细荧光笔触沿文字下缘连续划过，带轻微弧度与自然收笔，最后保留标记。","note":"文字保持固定，纤细荧光笔触沿文字下缘连续划过，带轻微弧度与自然收笔，最后保留标记。","source":"https://magicui.design/docs/components/highlighter","aliases":["划重点","荧光笔","下划线"]},
 {code:'029',"id":"impact","name":"放大震动","english":"Impact / Shake","category":"入场与出现","prompt":"文字从小快速放大，整组大幅左右震动并上下反冲，连续回弹后逐渐衰减落稳。","note":"文字从小快速放大，整组大幅左右震动并上下反冲，连续回弹后逐渐衰减落稳。","source":null,aliases:["重磅来袭","放大震动","撞击入场"]},
 {code:'030',"id":"karaoke","name":"卡拉 OK","english":"Karaoke Highlight","category":"循环与强调","prompt":"整句歌词先以灰色显示，鲜明高亮沿阅读顺序缓慢逐字推进，已唱文字保留高亮，像卡拉OK跟唱。","note":"整句歌词先以灰色显示，鲜明高亮沿阅读顺序缓慢逐字推进，已唱文字保留高亮，像卡拉OK跟唱。","source":"https://motion.dev/docs/text-animation","aliases":["卡拉OK","逐字变色","歌词高亮"]}
];
// Public codes are permanent; append new codes rather than renumbering existing effects.
export function resolveEffect(identifier){
 const input=String(identifier??'').trim();
 return EFFECTS.find(e=>e.id===input||e.code===input.padStart(3,'0')||e.name===input||e.code+' '+e.name===input||e.code+e.name===input)??EFFECTS.find(e=>e.aliases.includes(input)||e.aliases.some(name=>e.code+' '+name===input||e.code+name===input));
}
export const DEFAULTS={text:'把重点讲清楚',englishText:'Make the point clear',bilingual:true,impact:1.4,effect:'gather',color:'#203222',accent:'#A9E83F',background:'#F8FBF2',transparentBackground:false,fontFamily:'Noto Sans SC',fontSize:128,speed:1,startSeconds:0.3,scatter:1,seed:17,alternateText:'让表达更有力量',englishAlternateText:'Give ideas a voice',lightOnDark:true,lightColor:'#26D9FF',markerColor:'#E7FF3F'};
export function clamp01(n){return Math.max(0,Math.min(1,n));}
export function easeOut(n){const t=clamp01(n);return 1-(1-t)**3;}
function hash(i,seed){const x=Math.sin((i+1)*127.1+seed*31.7)*43758.5453;return x-Math.floor(x);}
function advance(c,fontFamily='',weight=550){
 const variants=LATIN_FONT_METRICS[fontFamily],code=c.codePointAt(0);
 if(variants&&code>=32&&code<=126){const key=Object.keys(variants).reduce((best,key)=>Math.abs(Number(key)-weight)<Math.abs(Number(best)-weight)?key:best);return variants[key][code-32];}
 const scale=fontFamily==='Smiley Sans Oblique'?.8:1;
 return (/\s/.test(c)?.36:/[ilI1.,:;'!|]/.test(c)?.32:/[tfr]/.test(c)?.4:/[mwMW@]/.test(c)?.88:/^[\x00-\x7F]$/.test(c)?.62:1)*scale;
}
function textWeight(effect,secondary=false){
 const material={glitch:[550,450],shine:[500,450],gradient:[500,450],outline:[450,400],neon:[200,200],echo:[500,450]};
 return material[effect]?.[secondary?1:0]??(secondary?450:({word:550,wave:550,gather:550,impact:650}[effect]??500));
}
export function layoutText(text,desiredSize,heightLimit=420,centerY=260,fontFamily='',weight=550){
 const raw=String(text).slice(0,80),units=[];
 let parts;
 if(/[\/|\n]/.test(raw))parts=raw.split(/[\/|\n]+/).map(s=>s.trim()).filter(Boolean).map((text,i)=>({text,space:i>0}));
 else if(typeof Intl!=='undefined'&&Intl.Segmenter)parts=Array.from(new Intl.Segmenter('zh',{granularity:'word'}).segment(raw)).map(s=>({text:s.segment,space:false}));
 else parts=Array.from(raw).map((text,i)=>({text,space:false}));
 let wordGroup=-1;
 parts.forEach(part=>{if(!/^\s*$/.test(part.text))wordGroup++;const group=Math.max(0,wordGroup);if(part.space)units.push({char:' ',group});Array.from(part.text).forEach(char=>units.push({char,group}));});
 // Latin glyphs use the bundled face's actual advance; extra tracking is only for CJK.
 units.forEach(unit=>{unit.advance=advance(unit.char,fontFamily,weight)+(/^[\x20-\x7E]$/.test(unit.char)?0:.025);});
 let fontSize=Math.min(150,Math.max(36,desiredSize));
 const totalUnits=units.reduce((n,u)=>n+u.advance,0);
 if(units.length<=12&&totalUnits)fontSize=Math.min(fontSize,790/totalUnits);
 const arrange=size=>{
  const rows=[[]];let used=0;
  const wordChar=c=>/^[A-Za-z0-9'-]$/.test(c),newLine=()=>{while(rows.at(-1).length&&/^\s$/.test(rows.at(-1).at(-1).char))rows.at(-1).pop();rows.push([]);used=0;};
  units.forEach((unit,i)=>{
   if(wordChar(unit.char)&&(i===0||!wordChar(units[i-1].char))){let end=i;while(end<units.length&&wordChar(units[end].char))end++;const wordWidth=units.slice(i,end).reduce((sum,v)=>sum+size*v.advance,0);if(used>0&&wordWidth<=790.1&&used+wordWidth>790.1)newLine();}
   const width=size*unit.advance;if(used+width>790.1&&rows.at(-1).length)newLine();if(!used&&/\s/.test(unit.char))return;rows.at(-1).push({...unit,width});used+=width;
  });return rows;
 };
 let rows=arrange(fontSize);
 while((rows.length>3||(rows.length-1)*fontSize*1.4+fontSize>heightLimit)&&fontSize>36){fontSize-=2;rows=arrange(fontSize);}
 const lineHeight=fontSize*1.4,totalHeight=(rows.length-1)*lineHeight+fontSize,glyphs=[];
 rows.forEach((row,r)=>{let x=(900-row.reduce((sum,u)=>sum+u.width,0))/2;row.forEach(u=>{glyphs.push({...u,x,y:centerY-totalHeight/2+r*lineHeight,index:glyphs.length,fontSize});x+=u.width;});});return glyphs;
}
export function typingSchedule(glyphs){
 let time=.18;
 return glyphs.map((g,i)=>{
  const start=time,variation=hash(i,43);
  let delay=/^[\x00-\x7F]$/.test(g.char)?.09+variation*.09:.19+variation*.16;
  if(/[，。！？；：、,.!?;:]/.test(g.char))delay+=.45+variation*.22;
  else if(/\s/.test(g.char))delay+=.12;
  else if(i%4===2)delay+=.18;
  time+=delay;
  return start;
 });
}
export function layoutCircle(text,desiredSize,centerX,centerY,radius,fontFamily,weight=550){
 const chars=Array.from(String(text).slice(0,80).replace(/[\/|\n]+/g,' ').trim());
 const units=chars.map(char=>advance(char,fontFamily,weight)+.28),total=units.reduce((a,b)=>a+b,0);
 const size=Math.min(desiredSize,Math.PI*2*radius/Math.max(1,total));
 let used=0;
 return chars.map((char,index)=>{
  const theta=(used+units[index]/2-units[0]/2)/Math.max(1,total)*Math.PI*2-Math.PI/2;
  used+=units[index];
  const width=size*advance(char,fontFamily,weight);
  return {char,index,group:index,x:centerX+Math.cos(theta)*radius-width/2,y:centerY+Math.sin(theta)*radius-size*.704,width,fontSize:size,orbitAngle:theta*180/Math.PI+90};
 });
}
export function colorAlpha(color,alpha){
 const hex=String(color).replace('#','');
 const c=hex.length===3?hex.split('').map(v=>v+v).join(''):hex;
 const n=/^[0-9a-f]{6}$/i.test(c)?parseInt(c,16):0xa9e83f;
 return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+clamp01(alpha)+')';
}
export function colorLuminance(color){
 const rgb=colorAlpha(color,1).match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{const s=v/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;});
 return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
}
export function mixColor(a,b,amount){
 const from=colorAlpha(a,1).match(/[\d.]+/g).slice(0,3).map(Number),to=colorAlpha(b,1).match(/[\d.]+/g).slice(0,3).map(Number);
 return '#'+from.map((v,i)=>Math.round(v+(to[i]-v)*clamp01(amount)).toString(16).padStart(2,'0')).join('');
}
export function contrastRatio(a,b){const x=colorLuminance(a),y=colorLuminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export function readableAccent(color,background){
 if(contrastRatio(color,background)>=4.5)return color;
 const rgb=colorAlpha(color,1).match(/[\d.]+/g).slice(0,3).map(Number),target=colorLuminance(background)>.35?0:255;
 for(let step=1;step<=20;step++){
  const mix=step/20,candidate='#'+rgb.map(v=>Math.round(v+(target-v)*mix).toString(16).padStart(2,'0')).join('');
  if(contrastRatio(candidate,background)>=4.5)return candidate;
 }
 return target?'#ffffff':'#000000';
}
export function karaokePalette(props){
 const dark=colorLuminance(props.background)<.35;
 return {active:readableAccent(props.karaokeColor??(dark?'#FFE45B':'#6936F5'),props.background),base:dark?'#737C8B':'#99938C'};
}
export function echoPosition(time,impact){
 const x=136*Math.exp(-time*.66)*Math.sin(time*5.6-1.2)*impact;
 const y=20*Math.exp(-time*.7)*Math.sin(time*3.8)*impact;
 return {x,y};
}
export function impactPose(time,strength=1.4){
 // One impact and a short, diminishing recoil, rather than a repeating jitter.
 const gain=Math.max(.6,Math.min(1.8,strength));
 const keys=[[0,.3,0,0,0],[.2,1.18,0,0,0],[.29,1.04,-84,28,-1.25],[.42,.98,66,-22,1],[.57,1.035,-44,14,-.7],[.75,1.005,27,-9,.4],[.96,1,-14,5,-.2],[1.18,1,5,-2,.08],[1.42,1,0,0,0]].map(([at,size,x,y,rotate],i)=>[at,i===0?size:1+(size-1)*gain/1.4,x*gain/1.4,y*gain/1.4,rotate*gain/1.4]);
 let segment=keys.findIndex((key,i)=>i<keys.length-1&&time<keys[i+1][0]);
 if(segment<0)segment=keys.length-2;
 const a=keys[segment],b=keys[segment+1],fraction=clamp01((time-a[0])/(b[0]-a[0]));
 const blend=segment===0?easeOut(fraction):fraction*fraction*(3-2*fraction);
 const values=a.slice(1).map((v,i)=>v+(b[i+1]-v)*blend);
 return {scale:values[0],x:values[1],y:values[2],rotate:values[3]};
}
export function motionModel(props,frame,fps,durationInFrames,spring){
 const bilingual=props.bilingual===true,impact=Math.max(.6,Math.min(1.8,props.impact)),speed=Math.max(.5,Math.min(2,props.speed));
 const holdAt=Math.max(0,(durationInFrames/fps-props.startSeconds-1.8)*speed);
 const localTime=Math.max(0,(frame/fps-props.startSeconds)*speed),loopStrength=1-easeOut((localTime-holdAt)/(.7*speed));
 const cycleReturn=props.effect==='cycle'&&localTime>=holdAt&&Math.floor(holdAt/1.6)%2===1;
 const returnProgress=clamp01((localTime-holdAt)/(.7*speed));
 const cycleSwap=props.effect==='cycle'&&(cycleReturn?returnProgress<.5:loopStrength>0&&Math.floor(Math.min(localTime,holdAt)/1.6)%2===1);
 const impactSize=props.effect==='impact'?.82:1;
 let main=layoutText(cycleSwap?(props.alternateText||props.text):props.text,['echo','impact'].includes(props.effect)?props.fontSize*.82:props.fontSize,bilingual?160:420,bilingual?205:260,props.fontFamily,textWeight(props.effect));
 let english=bilingual?layoutText(cycleSwap?(props.englishAlternateText||props.englishText):props.englishText,Math.max(42,props.fontSize*.43)*impactSize,100,365,props.fontFamily,textWeight(props.effect,true)):[];
 let circleStyle=null,circleStyles=[];
 if(props.effect==='circle'){
  // Rotate one layer instead of laying out every glyph on every frame.
  // Integrate smoothstep velocity so seeking and different fps give the same pose.
  const ramp=Math.min(.6*speed,holdAt/2),clock=Math.min(localTime,holdAt);
  const rampIn=ramp>0?clamp01(clock/ramp):1,rampOut=ramp>0?clamp01((clock-holdAt+ramp)/ramp):0;
  const travel=ramp>0?clock-ramp*(rampIn-rampIn**3+rampIn**4/2)-ramp*(rampOut**3-rampOut**4/2):clock;
  const left=bilingual?225:450,radius=bilingual?138:166;
  circleStyle={position:'absolute',inset:0,transform:'rotate('+(travel*.55*180/Math.PI)+'deg)',transformOrigin:left+'px 260px',willChange:'transform'};
  circleStyles=[{prefix:'cn-',style:circleStyle},...(bilingual?[{prefix:'en-',style:{...circleStyle,transformOrigin:'675px 260px'}}]:[])];
  main=layoutCircle(props.text,Math.min(bilingual?64:72,props.fontSize*.5),left,260,radius,props.fontFamily,textWeight(props.effect));
  english=bilingual?layoutCircle(props.englishText,Math.min(52,props.fontSize*.43),675,260,radius,props.fontFamily,textWeight(props.effect,true)):[];
 }
 const t=Math.max(0,(frame/fps-props.startSeconds)*speed),started=frame>=props.startSeconds*fps,exit=1-easeOut((frame-durationInFrames+fps*.28)/(fps*.28));
 let impactStyle=null;
 if(props.effect==='impact'){
  const pose=impactPose(t,impact),glyphs=main.concat(english);
  let x=pose.x,y=pose.y,size=pose.scale;
  if(glyphs.length){
   const left=Math.min(...glyphs.map(g=>g.x)),right=Math.max(...glyphs.map(g=>g.x+g.width)),top=Math.min(...glyphs.map(g=>g.y)),bottom=Math.max(...glyphs.map(g=>g.y+g.fontSize*1.28));
   const angle=pose.rotate*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle),width=right-left,height=bottom-top;
   size=Math.min(size,884/(width*Math.abs(c)+height*Math.abs(s)),504/(width*Math.abs(s)+height*Math.abs(c)));
   const corners=[[left,top],[right,top],[left,bottom],[right,bottom]].map(([X,Y])=>[450+((X-450)*c-(Y-260)*s)*size,260+((X-450)*s+(Y-260)*c)*size]);
   x=Math.max(8-Math.min(...corners.map(p=>p[0])),Math.min(892-Math.max(...corners.map(p=>p[0])),x));
   y=Math.max(8-Math.min(...corners.map(p=>p[1])),Math.min(512-Math.max(...corners.map(p=>p[1])),y));
  }
  impactStyle={position:'absolute',inset:0,transform:'translate3d('+x+'px,'+y+'px,0) rotate('+pose.rotate+'deg) scale('+size+')',transformOrigin:'450px 260px',willChange:'transform'};
 }
 const material=['glitch','shine','gradient','outline','neon','echo'].includes(props.effect),dark=material&&props.lightOnDark!==false;
 const ink=dark?'#F1F2F4':props.color,accent=props.accent,lightColor=props.lightColor??'#26D9FF';
 const karaokeColors=props.effect==='karaoke'?karaokePalette(props):null;
 const markerInk=props.markerColor??'#E7FF3F';
 const markerColor=props.effect==='highlight'&&colorLuminance(props.background)<.35?colorAlpha(markerInk,.72):markerInk;
 const surfaceStyle={backgroundColor:props.transparentBackground?'transparent':dark?'#090A0D':props.background,overflow:'hidden'};
 const layers=[];
 if(material&&dark&&!props.transparentBackground)layers.push({index:'material-depth',style:{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 45%,#14161C 0%,#090A0D 74%)'}});
 if(props.effect==='glitch'){
  const burst=(t%1.65<.3||(t%1.65>.88&&t%1.65<1.12))?loopStrength:0;
  layers.push({index:'scan-lines',style:{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'repeating-linear-gradient(0deg,transparent 0px,transparent 3px,'+colorAlpha(accent,.26)+' 4px,transparent 5px)',opacity:started?exit*(.1+.22*burst):0,transform:'translateY('+(Math.floor(t*12)%5)+'px)'}});
 }
 const ghosts=[],cursorStyles=[],markers=[];
 const renderSet=(glyphs,secondary)=>{
 const centerY=secondary?365:bilingual?205:260;
 const scatterOrder=props.effect==='gather'?glyphs.map((g,i)=>({i,key:hash(i,props.seed)})).sort((a,b)=>a.key-b.key).map(v=>v.i):[];
 const schedule=props.effect==='typing'?typingSchedule(glyphs):[];
 if(props.effect==='highlight'){
  const rows=[...new Set(glyphs.map(g=>g.y))];
  rows.forEach((y,row)=>{
   const letters=glyphs.filter(g=>g.y===y&&!/^\s*$/.test(g.char));
   if(!letters.length)return;
   const size=letters[0].fontSize,left=Math.min(...letters.map(g=>g.x))+size*.04,right=Math.max(...letters.map(g=>g.x+g.width))-size*.07;
   const reveal=easeOut((t-.22-row*.18)/.85);
   markers.push({index:'marker-'+secondary+'-'+row,color:markerColor,path:'M 7 39 C 195 22 385 35 565 28 S 865 20 993 34 L 985 67 C 830 55 680 70 490 65 S 170 64 11 82 Q 1 64 7 39 Z',style:{position:'absolute',left,top:y+size*1.015,width:Math.max(1,right-left),height:Math.max(3,size*(secondary?.13:.18)),overflow:'visible',pointerEvents:'none',opacity:started?exit*.86:0,clipPath:'inset(0 '+(100-reveal*100)+'% 0 0)'}});
  });
 }
 if(props.effect==='typing'&&glyphs.length&&started){
  let i=-1;while(i+1<schedule.length&&t>=schedule[i+1])i++;
  const last=glyphs[Math.max(0,i)],elapsed=t-(i<0?0:schedule[i]);
  cursorStyles.push({position:'absolute',display:'block',left:last.x+(i<0?0:last.width),top:last.y+last.fontSize*.03,width:Math.max(3,last.fontSize*.035),height:last.fontSize*1.02,background:props.accent,opacity:exit*(elapsed<.12||Math.floor(t/.32)%2===0?1:0)});
 }
 if(props.effect==='typewriter'&&glyphs.length&&started){
  const step=Math.max(.045,1.25/glyphs.length),i=Math.min(glyphs.length-1,Math.max(-1,Math.floor(t/step))),last=glyphs[Math.max(0,i)],done=i===glyphs.length-1;
  cursorStyles.push({position:'absolute',display:'block',left:last.x+(i<0?0:last.width),top:last.y+last.fontSize*.03,width:Math.max(3,last.fontSize*.045),height:last.fontSize*1.02,borderRadius:1,background:accent,opacity:exit*(done&&t>glyphs.length*step+.6?0:Math.floor(frame/(fps*.23))%2?.15:1)});
 }
 return glyphs.map(g=>{
  const stagger=g.index*Math.min(.058,.72/Math.max(1,glyphs.length)),startGroup=g.group*.14;
  let opacity=started?1:0,dx=0,dy=0,rotate=0,scale=1,stretchX=1,stretchY=1,blur=0,flip=0,reveal=100,p=1,depth=0,shadow='none',extra={},displayChar=g.char,flipX=0;
  if(props.effect==='word'){
   const local=t-startGroup;p=local<0?0:spring({frame:local*fps,fps,config:{damping:12,stiffness:245,mass:.75}});
   opacity*=clamp01(local/.09);dy=(1-p)*115*impact;rotate=(g.group%2?1:-1)*(1-p)*9*impact;scale=.55+.45*p;
  }else if(props.effect==='blur'){
   p=easeOut((t-startGroup)/.7);opacity*=p;dy=(1-p)*95*impact;dx=(1-p)*(g.index-glyphs.length/2)*12*impact;scale=1+(1-p)*.48*impact;blur=(1-p)*14*impact;
  }else if(props.effect==='mask'){
   p=easeOut((t-stagger)/.48);reveal=p*100;dx=(1-p)*23*impact;
  }else if(props.effect==='typewriter'){
   const step=Math.max(.045,1.25/Math.max(1,glyphs.length)),local=t-g.index*step;p=easeOut(local/.19);opacity*=local>=0?1:0;
   scale=1+(1-p)*.3*impact;dy=(1-p)*-12*impact;
  }else if(props.effect==='typing'){
   opacity*=t>=schedule[g.index]?1:0;
  }else if(props.effect==='wave'){
   const local=Math.max(0,t-stagger);p=started&&t>=stagger?spring({frame:local*fps,fps,config:{damping:12,stiffness:190}}):0;
   const settle=1-easeOut((t-1.8)/.8),w=Math.sin(t*6.2+g.index*.65);
   opacity*=clamp01(p);dy=(1-p)*95*impact+w*21*p*settle*impact;rotate=Math.sin(t*4.6+g.index*.34)*4.5*p*settle*impact;
   stretchX=1+w*.065*settle*impact;stretchY=1-w*.06*settle*impact;
  }else if(props.effect==='flip'){
   const local=t-stagger;p=local<0?0:spring({frame:local*fps,fps,config:{damping:13,stiffness:155,mass:.9}});
   opacity*=clamp01(local/.14);flip=(1-p)*-125;rotate=(1-p)*(g.index%2?9:-9);depth=(1-p)*-155;scale=.6+.4*p;
  }else if(props.effect==='fade'){
   opacity*=easeOut((t-stagger)/.55);
  }else if(props.effect==='slide'){
   p=easeOut(t/.85);opacity*=p;dx=(1-p)*430*impact;
  }else if(props.effect==='bounce'){
   const local=t-stagger;p=local<0?0:spring({frame:local*fps,fps,config:{damping:9,stiffness:210,mass:.8}});opacity*=clamp01(local/.12);dy=(1-p)*125*impact;
  }else if(props.effect==='zoom'){
   p=spring({frame:t*fps,fps,config:{damping:13,stiffness:175}});opacity*=easeOut(t/.2);scale=.3+.7*p;dx=(g.x+g.width/2-450)*(scale-1);dy=(g.y+g.fontSize/2-centerY)*(scale-1);
  }else if(props.effect==='tracking'){
   p=easeOut(t/1.2);opacity*=easeOut(t/.25);dx=(g.x+g.width/2-450)*(p-1)*.85;
  }else if(props.effect==='spin'){
   p=easeOut((t-stagger)/.9);opacity*=p;rotate=(1-p)*-180;scale=.2+.8*p;
  }else if(props.effect==='roll'){
   p=easeOut((t-stagger)/.65);opacity*=p;dy=(1-p)*g.fontSize*1.4;
  }else if(props.effect==='flipUp'){
   p=easeOut((t-stagger)/.8);opacity*=p;flipX=(1-p)*-100;dy=(1-p)*25;
  }else if(props.effect==='scramble'){
   const stop=.4+g.index*Math.min(.08,1.3/Math.max(1,glyphs.length));opacity*=easeOut(t/.15);
   if(t<stop&&!/\s/.test(g.char)){const bank='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%';displayChar=bank[Math.floor(hash(g.index+Math.floor(t*18)*37,props.seed)*bank.length)];}
  }else if(props.effect==='glitch'){
   const phase=t%1.65,burst=(phase<.3||phase>.88&&phase<1.12)&&loopStrength>.005;
   opacity*=easeOut(t/.08);extra.color=ink;
   if(burst){const tick=Math.floor(t*18),jitter=(hash(tick,props.seed)-.5)*2;dx=jitter*12*impact*loopStrength;dy=(hash(tick+9,props.seed)-.5)*5*loopStrength;extra.glitch=tick;extra.filter='contrast(1.25)';}
  }else if(props.effect==='shine'){
   opacity*=easeOut(t/.2);const sweep=-180+(Math.min(t,holdAt)%2.25)/2.25*1260;
   const base=dark?'#9EA5B0':props.color,highlight=dark?'#FFFFFF':'#05060A',shoulder=dark?'#D5DCE6':'#6C727D';
   extra={color:'transparent',backgroundClip:'text',WebkitBackgroundClip:'text',backgroundSize:'900px 100%',backgroundPosition:-g.x+'px 0',backgroundRepeat:'no-repeat',backgroundImage:'linear-gradient(112deg,'+base+' '+(sweep-95)+'px,'+shoulder+' '+(sweep-35)+'px,'+highlight+' '+(sweep-12)+'px,'+highlight+' '+(sweep+12)+'px,'+shoulder+' '+(sweep+35)+'px,'+base+' '+(sweep+95)+'px)'};
  }else if(props.effect==='gradient'){
   opacity*=easeOut(t/.2);const clock=Math.min(t,holdAt),x=50+Math.sin(clock*1.6)*45,y=50+Math.cos(clock*1.3)*42;
   extra={color:'transparent',backgroundClip:'text',WebkitBackgroundClip:'text',backgroundSize:'900px 520px',backgroundPosition:-g.x+'px '+(-g.y)+'px',backgroundImage:'radial-gradient(ellipse at '+x+'% '+y+'%,#ff49d8 0%,transparent 54%),radial-gradient(ellipse at '+(100-x)+'% '+(100-y)+'%,#19e8ff 0%,transparent 56%),linear-gradient('+(100+clock*48)+'deg,#6b39ff 10%,#ff377e 48%,#ffc46a 80%)',filter:'saturate(1.3)'};
  }else if(props.effect==='outline'){
   const develop=clamp01((t-.05-stagger*.6)/1.6),front=develop*145-22;opacity*=easeOut(t/.15);
   const feather='linear-gradient(to top,#000 '+(front-16)+'%,transparent '+(front+16)+'%)';
   extra={color:ink,maskImage:feather,WebkitMaskImage:feather,filter:'blur('+((1-develop)*2.5)+'px)'};
  }else if(props.effect==='neon'){
   const power=Math.pow(.5-.5*Math.cos(t*Math.PI*2/2.4),1.5),gain=.75+impact*.55;
   const hot=mixColor(lightColor,'#FFFFFF',.62),off=mixColor(lightColor,dark?'#090A0D':props.background,dark?.84:.6);
   const core=dark?mixColor(off,hot,power):mixColor(off,readableAccent(lightColor,props.background),power),glow=dark?1:.35;
   opacity*=easeOut(t/.12);
   extra={color:core};
   shadow='0 0 '+(.5+power*.7)+'px '+colorAlpha('#FFFFFF',power*.95*glow)+',0 0 '+(2+power*4)+'px '+colorAlpha(lightColor,power*.98*glow)+',0 0 '+(7+power*14*gain)+'px '+colorAlpha(lightColor,power*.7*glow)+',0 0 '+(14+power*22*gain)+'px '+colorAlpha(lightColor,power*.34*glow);
  }else if(props.effect==='echo'){
   const gate=1-easeOut((t-1.4)/1.75),pos=echoPosition(t,impact);opacity*=easeOut(t/.12);dx=pos.x*gate;dy=pos.y*gate;extra.echo=gate;extra.color=ink;
  }else if(props.effect==='focus'){
   opacity*=easeOut(t/.2);const groupCount=Math.max(...glyphs.map(item=>item.group),0)+1,phase=t/.8,active=Math.floor(phase)%groupCount,next=(active+1)%groupCount,blend=easeOut((phase%1-.55)/.45);
   const clarity=groupCount===1?1:g.group===active?1-blend:g.group===next?blend:0;blur=(1-clarity)*4*loopStrength;
  }else if(props.effect==='marquee'){
   opacity*=easeOut(t/.2);const left=Math.min(...glyphs.map(item=>item.x)),right=Math.max(...glyphs.map(item=>item.x+item.width)),period=right-left+100;
   if(loopStrength>0)extra.marquee={period,phase:(Math.min(t,holdAt)*155%period)*loopStrength,strength:loopStrength};
  }else if(props.effect==='circle'){
   opacity*=easeOut(t/.4);rotate=g.orbitAngle;
  }else if(props.effect==='cycle'){
   const phase=Math.min(t,holdAt)%1.6;opacity*=easeOut(t/.2);
   if(cycleReturn){
    if(returnProgress<.5){const initial=holdAt%1.6,enter=easeOut(initial/.28),leave=easeOut((initial-1.3)/.3),out=easeOut(returnProgress*2);dy=((1-enter)*65-leave*65)*(1-out)-out*65;opacity*=enter*(1-leave)*(1-out);}
    else{const enter=easeOut((returnProgress-.5)*2);dy=(1-enter)*65;opacity*=enter;}
   }else if(loopStrength>0){const enter=easeOut(phase/.28),leave=easeOut((phase-1.3)/.3);dy=((1-enter)*65-leave*65)*loopStrength;opacity*=(enter*(1-leave))*loopStrength+1-loopStrength;}
  }else if(props.effect==='highlight'){
   opacity*=easeOut(t/.2);
  }else if(props.effect==='impact'){
   opacity*=easeOut(t/.08);
  }else if(props.effect==='karaoke'){
   opacity*=easeOut(t/.2);const duration=Math.max(2.6,glyphs.length*.14),read=clamp01((t-.65)/duration)*glyphs.length,fill=clamp01(read-g.index)*100;
   extra={color:'transparent',backgroundClip:'text',WebkitBackgroundClip:'text',backgroundImage:'linear-gradient(to right,'+karaokeColors.active+' '+fill+'%,'+karaokeColors.base+' '+fill+'%)'};
  }else if(props.effect==='gather'){
   const local=t-.75-g.index*Math.min(.027,.48/Math.max(1,glyphs.length));p=local<=0?0:spring({frame:local*fps,fps,config:{damping:16,stiffness:200,mass:.85}});
   const strength=Math.max(.2,Math.min(1.3,props.scatter));
   const cols=secondary?Math.ceil(glyphs.length/2):Math.ceil(Math.sqrt(glyphs.length*1.5)),rows=Math.ceil(glyphs.length/cols),slot=scatterOrder.indexOf(g.index),cellWidth=680/cols,cellHeight=(secondary?100:250)/rows;
   const targetX=450+((slot%cols-(cols-1)/2)*cellWidth+(hash(g.index+37,props.seed)-.5)*cellWidth*.25)*strength;
   const targetY=centerY+((Math.floor(slot/cols)-(rows-1)/2)*cellHeight+(hash(g.index+71,props.seed)-.5)*cellHeight*.2)*strength;
   dx=(targetX-g.width/2-g.x)*(1-p);dy=(targetY-g.fontSize/2-g.y)*(1-p);rotate=(hash(g.index+149,props.seed)-.5)*220*strength*(1-p);scale=.66+.34*p;
   opacity*=easeOut((t-g.index*.01)/.16);
  }
  const clipStyle={position:'absolute',left:g.x,top:g.y,width:g.width,height:g.fontSize*1.28,overflow:props.effect==='mask'||props.effect==='roll'?'hidden':'visible'};
  const style={display:'block',width:'100%',height:'100%',color:props.color,fontFamily:props.fontFamily,fontSize:g.fontSize,fontWeight:textWeight(props.effect,secondary),lineHeight:1.1,whiteSpace:'pre',opacity:opacity*exit*(props.effect==='marquee'&&loopStrength>0?0:1),filter:blur>.02?`blur(${blur}px)`:'none',textShadow:secondary&&!material?'none':shadow,
   transform:`perspective(480px) translate3d(${dx}px,${dy}px,${depth}px) rotate(${rotate}deg) rotateY(${flip}deg)${flipX?' rotateX('+flipX+'deg)':''} scale(${scale*stretchX},${scale*stretchY})`,transformOrigin:'50% 55%',backfaceVisibility:'hidden',clipPath:props.effect==='mask'?`inset(0 ${100-reveal}% 0 0)`:'none',...Object.fromEntries(Object.entries(extra).filter(([key])=>!['echo','glitch','marquee','marker'].includes(key)))};
  if(extra.echo>0.005){
   for(let k=1;k<=5;k++){
    const delay=k*.14,history=Math.max(0,t-delay),pos=echoPosition(history,impact),color=['#20eaff','#5583ff','#ac68ff','#93B4E0','#F29CC5'][k-1];
    ghosts.push({index:'echo-'+secondary+'-'+g.index+'-'+k,char:g.char,clipStyle,style:{...style,color,opacity:opacity*exit*(.40-k*.045)*extra.echo*easeOut((t-delay)/.16),filter:'blur('+(k*.14)+'px)',textShadow:'0 0 7px '+colorAlpha(color,.45),transform:'translate('+(pos.x*extra.echo)+'px,'+(pos.y*extra.echo)+'px)',mixBlendMode:dark?'screen':'multiply'}});
   }
  }
  if(extra.glitch!==undefined){
   for(let k=0;k<5;k++){
    const tick=extra.glitch,cut=8+k*18,shift=(hash(tick+k*19,props.seed)-.5)*(k<3?100:46)*impact*loopStrength,color=k%3===0?'#ff365c':k%3===1?'#20eaff':ink;
    ghosts.push({index:'glitch-'+secondary+'-'+g.index+'-'+k,char:g.char,clipStyle,style:{...style,color,opacity:opacity*exit*(k<3?.95:.7),filter:'none',textShadow:'none',clipPath:'inset('+cut+'% 0 '+(100-cut-10-k%2*5)+'% 0)',transform:'translate('+(dx+shift)+'px,'+(dy+(k%2?2:-2))+'px)'}});
   }
  }
  if(extra.marquee){
   const {period,phase,strength}=extra.marquee,copies=Math.ceil(900/period)+1;
   for(let k=-copies;k<=copies;k++){
    const shift=k*period-phase;if(g.x+shift+g.width<0||g.x+shift>900)continue;
    ghosts.push({index:'marquee-'+secondary+'-'+g.index+'-'+k,char:g.char,clipStyle,style:{...style,opacity:opacity*exit*(k===0?1:strength),transform:'translate('+shift+'px,0)'}});
   }
  }
  if(props.effect==='gather'&&!secondary&&p>0&&p<.98){
   const trace=Math.sin(Math.PI*clamp01(p));
   ghosts.push({index:'ghost-'+g.index,char:g.char,clipStyle,style:{...style,color:props.accent,opacity:opacity*exit*.15*trace,transform:`translate(${dx+(1-p)*32}px,${dy+(1-p)*18}px) rotate(${rotate+8*(1-p)}deg) scale(${scale})`}});
  }
  return {...g,char:displayChar,index:(secondary?'en-':'cn-')+g.index,clipStyle,style};
 });};
 const rendered=[...renderSet(main,false),...renderSet(english,true)];
 let cursorStyle={display:'none'};
 const lineStyle={display:'none'};
 return {glyphs:rendered,ghosts,cursorStyle,cursorStyles,lineStyle,surfaceStyle,layers,circleStyle,circleStyles,impactStyle,markers};
}

export function requiredFrames(props,fps=30){
 const a=layoutText(props.text,props.effect==='echo'?props.fontSize*.82:props.fontSize,props.bilingual?160:420,260,props.fontFamily,textWeight(props.effect)),b=props.bilingual?layoutText(props.englishText,Math.max(42,props.fontSize*.43),100,260,props.fontFamily,textWeight(props.effect,true)):[],glyphs=a.length>b.length?a:b,n=glyphs.length,group=Math.max(...a.concat(b).map(g=>g.group),0);
 const stagger=Math.max(0,n-1)*Math.min(.075,.65/Math.max(1,n));
 let seconds=3.1;
 if(props.effect==='cycle')seconds=4.8;
 if(props.effect==='word'||props.effect==='blur')seconds=group*.14+1.25;
 if(props.effect==='mask')seconds=stagger+.65;
 if(props.effect==='typewriter')seconds=n*Math.max(.045,1.2/Math.max(1,n))+.8;
 if(props.effect==='typing')seconds=Math.max(typingSchedule(a).at(-1)??0,typingSchedule(b).at(-1)??0)+.65;
 if(props.effect==='flip')seconds=stagger+1;
 if(props.effect==='gather')seconds=.75+Math.max(0,n-1)*Math.min(.032,.5/Math.max(1,n))+1.35;
 if(props.effect==='impact')seconds=1.42;
 if(props.effect==='karaoke')seconds=.65+Math.max(2.6,n*.14)+.16;
 return Math.ceil(Math.max(.6,props.startSeconds+seconds/Math.max(.5,props.speed)+1.3)*fps);
}

export function previewFrames(props,fps=30){return Math.max((props.effect==='impact'?4:6)*fps,requiredFrames(props,fps));}
export function previewFps(effect){return ['circle','impact'].includes(effect)?60:30;}
export function previewStillFrame(props,fps=30){
 const end=previewFrames(props,fps)-Math.round(fps*.8);
 if(props.effect==='neon')return Math.min(end,Math.round((props.startSeconds+1.2/props.speed)*fps));
 if(props.effect==='karaoke')return Math.min(end,Math.round((props.startSeconds+1.95/props.speed)*fps));
 return end;
}
