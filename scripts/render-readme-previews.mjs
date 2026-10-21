import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderMedia} from '@remotion/renderer';
import {DEMOS,demoDefaults,demoUsesImages} from '../src/demos/catalog.js';
import {STUDIES,studyDefaults} from '../src/studies/catalog.js';
import {EFFECTS,DEFAULTS} from '../src/motion-core.js';

// Only renders the existing components. No alternative motion implementation.
const selection=[
 ['017','decode','ScrambleText','text'],['060','inflate','Study060','study'],
 ['119','bounce','Demo119','demo'],['044','sway','Study044','study'],
 ['077','race','Demo077','demo'],['101','waveform','Demo101','demo'],
 ['007','gather','ScatterGather','text'],['032','letters','Study032','study'],
 ['063','cells','Study063','study'],['105','punctuation','Demo105','demo'],
 ['110','handwriting','Demo110','demo'],['113','countermask','Demo113','demo'],
 ['117','morph','Demo117','demo'],['123','petals','Demo123','demo'],
 ['052','reorder','Demo052','demo'],['046','monogram','Study046','study'],['047','bands','Study047','study'],
 ['140','otp','Demo140','demo'],['146','sort','Demo146','demo'],
 ['076','donut','Demo076','demo'],['151','histogram','Demo151','demo'],
 ['155','sankey','Demo155','demo'],['157','waffle','Demo157','demo'],
 ['166','microphone','Demo166','demo'],['170','audio-message','Demo170','demo'],
];
const variants={
 '017':{color:'#75415b',background:'#f6eff2',accent:'#ae4d6f'},
 '119':{accent:'#c77435',background:'#fcf3e8'},
 '101':{accent:'#268684',background:'#edf7f5'},'007':{color:'#3f5e86',background:'#edf3fa',accent:'#739bc6'},
 '105':{accent:'#b95445',background:'#f8efea'},'110':{accent:'#4b7b63',background:'#f0f5ef'},
 '113':{accent:'#4567b4',background:'#edf2fa'},'117':{accent:'#7967b3',background:'#f1eef8'},
 '123':{accent:'#bd6744',background:'#fbf2e9'},
 '140':{accent:'#496ab4',background:'#eff3fc'},'146':{accent:'#a7763d',background:'#fbf5eb'},
 '151':{accent:'#7961ad',background:'#f5eff9'},'155':{accent:'#466d96',background:'#edf3f8'},
 '157':{accent:'#4f8368',background:'#eef6ee'},'166':{accent:'#3f7890',background:'#eff7f8'},
 '170':{accent:'#ad657d',background:'#fbf1f4'}
};
const propsFor=(meta,kind)=>({...(
 kind==='text'?{...DEFAULTS,effect:meta.id,color:'#181717',accent:'#6B6965',background:'#FAF9F6',soundPreset:'off'}:
 kind==='study'?studyDefaults(meta.id):demoDefaults(meta.id)),...variants[meta.code]});
if(new Set(selection.map(row=>row[0])).size!==selection.length)throw new Error('Repeated showcase ID');
const root=process.cwd(),out=path.join(root,'docs/previews'),proof=path.join(root,'proof/readme');
fs.mkdirSync(out,{recursive:true});fs.mkdirSync(proof,{recursive:true});
const run=args=>execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit'});
const only=process.argv.find(x=>x.startsWith('--codes='))?.slice(8).split(',');
if(!process.argv.includes('--encode-only')){
 const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
 const browser=await openBrowser('chrome',{logLevel:'error'});
 try{for(const [code,file,id,kind] of selection){
  if(only&&!only.includes(code))continue;
  const meta=(kind==='text'?EFFECTS:kind==='study'?STUDIES:DEMOS).find(d=>d.code===code);
  if(!meta)throw new Error('Missing '+code);
  if(kind==='demo'&&demoUsesImages(meta.id))throw new Error('Image demo excluded from this showcase: '+code);
  const inputProps=propsFor(meta,kind);
  const composition=await selectComposition({serveUrl,id,inputProps,puppeteerInstance:browser,logLevel:'error'});
  await renderMedia({serveUrl,composition,inputProps,puppeteerInstance:browser,codec:'h264',crf:20,scale:.6,concurrency:3,outputLocation:path.join(proof,file+'.mp4'),logLevel:'error'});
  console.log('Rendered '+code+' '+meta.name);
 }}finally{await browser.close({silent:true});}
}
const manifest=[];
for(const [code,file,,kind] of selection){
 const input=path.join(proof,file+'.mp4');if(!fs.existsSync(input))throw new Error('Missing video '+file);
 const palette=path.join(proof,file+'-palette.png');
 const filter='fps=20,scale=480:300:force_original_aspect_ratio=decrease:flags=lanczos,pad=480:300:(ow-iw)/2:(oh-ih)/2:color=0xfaf9f6';
 run(['-i',input,'-vf',filter+',palettegen=max_colors=160:stats_mode=diff','-frames:v','1',palette]);
 run(['-i',input,'-i',palette,'-lavfi',filter+'[v];[v][1:v]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle','-loop','0',path.join(out,file+'.gif')]);
 const meta=(kind==='text'?EFFECTS:kind==='study'?STUDIES:DEMOS).find(d=>d.code===code);
 const video=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','json',input]));
 manifest.push({code,name:meta.name,file:file+'.gif',composition:selection.find(row=>row[0]===code)[2],inputProps:propsFor(meta,kind),durationSeconds:Number(video.format.duration),width:480,height:300,fps:20,bytes:fs.statSync(path.join(out,file+'.gif')).size});
 console.log('Encoded '+file+'.gif');
}
const featured=[['decode','017  /  DECODE'],['inflate','060  /  LETTERING'],['bounce','119  /  PHYSICS'],['sway','044  /  SCULPTURAL TYPE'],['race','077  /  RANKING'],['waveform','101  /  SOUND']];
const args=featured.flatMap(([file])=>['-stream_loop','-1','-i',path.join(proof,file+'.mp4')]);
const font=path.join(root,'public/fonts/ChillRoundF.ttf');
if(!fs.existsSync(font))throw new Error('Missing bundled header font.');
const text=(s,x,y,size,color='#242521')=>`drawtext=fontfile='${font}':text='${s}':x=${x}:y=${y}:fontsize=${size}:fontcolor=${color}`;
const filters=featured.map(([,label],i)=>`[${i}:v]fps=20,scale=368:230:force_original_aspect_ratio=decrease:flags=lanczos,pad=368:274:(ow-iw)/2:0:color=0xfaf9f6,${text(label,16,245,17,'#62645e')},setsar=1[v${i}]`);
filters.push(featured.map((_,i)=>`[v${i}]`).join('')+`xstack=inputs=6:layout=0_0|384_0|768_0|0_290|384_290|768_290:fill=0xe6e7e1,pad=1200:748:24:144:color=0xeeefe9,${text('Little Move',30,30,54)},${text('See it. Shape it. Make it move.',32,98,22,'#63675f')},${text('A LIBRARY OF SMALL MOTIONS',845,65,18,'#63675f')},${text('PREVIEW  /  CUSTOMIZE  /  COPY THE PROMPT',32,718,14,'#63675f')}[hero]`);
run([...args,'-filter_complex',filters.join(';'),'-map','[hero]','-t','8','-an','-c:v','libx264','-crf','20',path.join(proof,'overview.mp4')]);
run(['-i',path.join(proof,'overview.mp4'),'-vf','palettegen=max_colors=192:stats_mode=diff','-frames:v','1',path.join(proof,'overview-palette.png')]);
run(['-i',path.join(proof,'overview.mp4'),'-i',path.join(proof,'overview-palette.png'),'-lavfi','paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle','-loop','0',path.join(out,'showcase.gif')]);
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({generatedAt:new Date().toISOString(),source:'Existing Little Move components with recorded supported color parameters; no image demos; silent full-motion renders. GIFs are display copies at 20fps, not interactive widgets.',previews:manifest,overview:{file:'showcase.gif',durationSeconds:8,fps:20,width:1200,height:748,bytes:fs.statSync(path.join(out,'showcase.gif')).size,codes:featured.map(([,label])=>label.slice(0,3))}},null,2)+'\n');
console.log('Published preview files in docs/previews/');
