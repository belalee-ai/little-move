import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import {studyDefaults} from '../src/studies/catalog.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),out=path.join(root,'proof/studies');
fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')}),browser=await openBrowser('chrome',{logLevel:'error'});
try{
 for(const [code,key] of [['036','mask'],['037','stickers'],['038','fold']]){
  const inputProps=studyDefaults('study-'+key),composition=await selectComposition({serveUrl,id:'Study'+code,inputProps,puppeteerInstance:browser,logLevel:'error'});
  for(const [name,frame] of [['start',0],['action',60],['pull',114],['middle',195],['settle',246],['late',300],['end',359]]){
   await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,output:path.join(out,code+'-interaction-'+name+'.png'),imageFormat:'png',logLevel:'error'});
  }
  await renderStill({serveUrl,composition,inputProps:{...inputProps,objectMotion:1.2},puppeteerInstance:browser,frame:key==='stickers'?99:114,output:path.join(out,code+'-interaction-strong.png'),imageFormat:'png',logLevel:'error'});
  // Old saved props must never re-enable a person or request a portrait asset.
  const replacement={...inputProps,portraitSrc:'/type-studies/intentionally-unused-portrait.png',portraitMotion:1.2};
  await renderStill({serveUrl,composition,inputProps:replacement,puppeteerInstance:browser,frame:114,output:path.join(out,code+'-interaction-replacement.png'),imageFormat:'png',logLevel:'error'});
  console.log(code+' '+key+': seven stages, stronger geometry and ignored legacy portrait props rendered.');
 }
}finally{await browser.close({silent:true})}
