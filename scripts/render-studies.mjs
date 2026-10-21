import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import {STUDIES,studyDefaults,studyFrames,studyStillFrame} from '../src/studies/catalog.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),out=path.join(root,'proof/studies'),only=process.argv[2]?.split(',');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')}),browser=await openBrowser('chrome',{logLevel:'error'});
try{
 for(const study of STUDIES){
  if(only&&!only.includes(study.code))continue;
  const variants=study.key==='logo'?['gather','flip','wave']:[null];
  for(const mode of variants){
   const inputProps={...studyDefaults(study.id),...(mode?{logoMode:mode}:{})},composition=await selectComposition({serveUrl,id:'Study'+study.code,inputProps,puppeteerInstance:browser,logLevel:'error'});
   const frames=studyFrames(inputProps,60),stages=[['start',0],['middle',studyStillFrame(inputProps,60)],['end',frames-1]];
   for(const [stage,frame] of stages){await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,output:path.join(out,study.code+(mode?'-'+mode:'')+'-'+stage+'.png'),imageFormat:'png',logLevel:'error'});}
   console.log(study.code+' '+study.key+(mode?' '+mode:'')+' start / middle / end rendered');
  }
 }
}finally{await browser.close({silent:true});}
