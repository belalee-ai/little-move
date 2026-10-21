import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DEFAULTS,EFFECTS,requiredFrames,resolveEffect,karaokePalette} from '../src/motion-core.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args=process.argv.slice(2);
const get=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1];};
const configFile=get('--config',null);
const config=configFile?JSON.parse(fs.readFileSync(path.resolve(configFile),'utf8')):{};
const identifier=get('--effect',get('--number',get('--name',config.effectId??config.effectCode??config.effectName??config.props?.effect??'gather')));
const effect=resolveEffect(identifier);
if(!effect)throw new Error('Unknown effect: '+identifier);
const id=effect.id;
const props={...DEFAULTS,...config.props,effect:id};
if(!configFile)props.transparentBackground=true;
props.text=get('--text',props.text);
if(!props.text.trim())throw new Error('Text is empty.');
if(Array.from(props.text).length>24)throw new Error('Use no more than 24 characters; split long copy into separate clips.');
const fps=Number(get('--fps',config.fps??30));
if(!Number.isFinite(fps)||fps<1)throw new Error('FPS must be positive.');
const minFrames=requiredFrames(props,fps);
const durationInFrames=Number(get('--frames',Math.max(config.durationInFrames??0,minFrames)));
if(!Number.isInteger(durationInFrames)||durationInFrames<minFrames)throw new Error('Duration is too short for this motion and reading hold; minimum '+minFrames+' frames.');
const core=fs.readFileSync(path.join(root,'src/motion-core.js'),'utf8');
const fontMetrics=fs.readFileSync(path.join(root,'src/latin-font-metrics.js'),'utf8').replace('export const ','const ');
const functions=fontMetrics+'\n'+core.slice(core.indexOf('export function clamp01')).replaceAll('export function ','function ');
const license=fs.readFileSync(path.join(root,'THIRD-PARTY-NOTICES.md'),'utf8').split('Remotion Scenes的MIT许可：')[1].trim();
const code=`/* ${license} */\n// Bela Text Motion Library. References: Remotion Bits / Remotion Scenes (MIT).\n${functions}\nconst Component=({item})=>{\n const frame=useCurrentFrame();\n const {fps}=useVideoConfig();\n const durationInFrames=Math.round(item.props.clipSeconds*fps);\n const props=item.props;\n const model=motionModel(props,frame,fps,durationInFrames,spring);\n const rootStyle={position:'absolute',inset:0,fontSynthesis:'none',...model.surfaceStyle};\n return <div style={rootStyle}>\n  {model.layers.map(layer=><span key={layer.index} style={layer.style}/>)}\n  {model.markers.map(marker=><svg key={marker.index} aria-hidden="true" style={marker.style} viewBox="0 0 1000 100" preserveAspectRatio="none"><path d={marker.path} fill={marker.color}/></svg>)}\n  {model.ghosts.map(g=><span key={g.index} style={g.clipStyle}><span style={g.style}>{g.char}</span></span>)}\n  {model.impactStyle?<div style={model.impactStyle}>{model.glyphs.map(g=><span key={g.index} style={g.clipStyle}><span style={g.style}>{g.char}</span></span>)}</div>:model.circleStyles.length?model.circleStyles.map(ring=><div key={ring.prefix} style={ring.style}>{model.glyphs.filter(g=>g.index.startsWith(ring.prefix)).map(g=><span key={g.index} style={g.clipStyle}><span style={g.style}>{g.char}</span></span>)}</div>):model.glyphs.map(g=><span key={g.index} style={g.clipStyle}><span style={g.style}>{g.char}</span></span>)}\n  <span style={model.cursorStyle}/>{model.cursorStyles.map((style,i)=><span key={'cursor-'+i} style={style}/>)}<span style={model.lineStyle}/>\n </div>;\n};`;
const properties=[
 {key:'text',label:'中文整句',type:'text',maxLength:24,defaultValue:props.text},
 {key:'englishText',label:'英文对比',type:'text',maxLength:48,defaultValue:props.englishText},
 {key:'alternateText',label:'换词中文',type:'text',maxLength:24,defaultValue:props.alternateText},
 {key:'englishAlternateText',label:'换词英文',type:'text',maxLength:48,defaultValue:props.englishAlternateText},
 {key:'bilingual',label:'中英对比',type:'boolean',defaultValue:props.bilingual},
 {key:'impact',label:'动感强度',type:'number',min:.6,max:1.8,step:.1,defaultValue:props.impact},
 {key:'effect',label:'动效',type:'select',options:EFFECTS.map(e=>({label:e.code+' '+e.name,value:e.id})),defaultValue:id},
 {key:'fontFamily',label:'字体',type:'font',defaultValue:props.fontFamily},
 {key:'fontSize',label:'字号',type:'number',min:56,max:150,step:2,defaultValue:props.fontSize},
 {key:'color',label:'文字颜色',type:'color',defaultValue:props.color},
 {key:'accent',label:'光标颜色',type:'color',defaultValue:props.accent},
 {key:'background',label:'底色',type:'color',defaultValue:props.background},
 {key:'lightOnDark',label:'光影深色底',type:'boolean',defaultValue:props.lightOnDark},
 {key:'lightColor',label:'霓虹颜色',type:'color',defaultValue:props.lightColor},
 {key:'markerColor',label:'荧光颜色',type:'color',defaultValue:props.markerColor},
 {key:'karaokeColor',label:'歌词高亮颜色',type:'color',defaultValue:props.karaokeColor??karaokePalette(props).active},
 {key:'transparentBackground',label:'透明背景',type:'boolean',defaultValue:props.transparentBackground},
 {key:'speed',label:'动作速度',type:'number',min:.5,max:2,step:.1,defaultValue:props.speed},
 {key:'startSeconds',label:'触发时间（秒）',type:'number',min:0,max:2,step:.05,defaultValue:props.startSeconds},
 {key:'scatter',label:'散字幅度',type:'number',min:.2,max:1.3,step:.1,defaultValue:props.scatter},
 {key:'clipSeconds',label:'片段时长（秒）',type:'number',min:.6,max:120,step:.1,defaultValue:durationInFrames/fps},
 {key:'seed',label:'散字排列',type:'number',min:0,max:999,step:1,defaultValue:props.seed},
];
const payload={effectCode:effect.code,effectName:effect.name,effectId:id,name:'文字动效｜'+effect.code+' '+effect.name,description:'文字叠层；'+effect.prompt,code,width:900,height:520,durationInFrames,properties};
const out=get('--out',null);
if(out){fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});fs.writeFileSync(path.resolve(out),JSON.stringify(payload,null,2)+'\n');console.log(path.resolve(out));}
else console.log(JSON.stringify(payload));
