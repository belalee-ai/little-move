import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import {DEFAULTS} from '../src/motion-core.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out=path.join(root,'proof/highlight');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
const browser=await openBrowser('chrome',{logLevel:'error'});
try{
 for(const [name,color,background] of [['paper','#181717','#FAF9F6'],['night','#F6F3E9','#202623']]){
  const inputProps={...DEFAULTS,effect:'highlight',accent:'#6B6965',color,background};
  const composition=await selectComposition({serveUrl,id:'HighlightText',inputProps,puppeteerInstance:browser,logLevel:'error'});
  await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame:156,output:path.join(out,name+'.png'),imageFormat:'png',logLevel:'error'});
  console.log('Rendered fluorescent marker: '+name);
 }
}finally{await browser.close({silent:true});}
