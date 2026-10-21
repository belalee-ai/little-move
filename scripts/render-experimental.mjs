import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import {EXPERIMENTAL_STUDIES,EXPERIMENTAL_MODES} from '../src/studies/experimental-catalog.js';
import {studyDefaults} from '../src/studies/catalog.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),out=path.join(root,'proof/experimental');
fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
const browser=await openBrowser('chrome',{logLevel:'error'}),manifest=[],only=process.argv[2]?.split(',');
try{
 for(const study of EXPERIMENTAL_STUDIES){
  if(only&&!only.includes(study.code))continue;
  const modes=EXPERIMENTAL_MODES[study.key]?.map(([mode])=>mode)??[null];
  for(const mode of modes){
   const inputProps={...studyDefaults(study.id),...(mode?{experimentalMode:mode}:{})};
   const composition=await selectComposition({serveUrl,id:'Study'+study.code,inputProps,puppeteerInstance:browser,logLevel:'error'});
   const images={};
   for(const [stage,frame] of [['start',0],['impact',42],['settled',78],['middle',108],['transform',156],['end',359]]){
    const file=study.code+(mode?'-'+mode:'')+'-'+stage+'.png';
    await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,output:path.join(out,file),imageFormat:'png',logLevel:'error'});
    images[stage]=file;
   }
   manifest.push({code:study.code,key:study.key,mode,images});
   console.log(study.code+' '+(mode??study.key)+' rendered');
  }
 }
 const old=only&&fs.existsSync(path.join(out,'manifest.json'))?JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8')).filter(row=>!only.includes(row.code)):[];
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify([...old,...manifest].sort((a,b)=>a.code.localeCompare(b.code)),null,2)+'\n');
}finally{await browser.close({silent:true});}
