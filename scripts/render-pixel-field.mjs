import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import {demoDefaults} from '../src/demos/catalog.js';
const out=path.resolve('proof/pixel-field');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),publicDir:path.resolve('public')});
const browser=await openBrowser('chrome',{logLevel:'error'});
try{
 const inputProps=demoDefaults('demo-pixel-field');
 const composition=await selectComposition({serveUrl,id:'Demo291',inputProps,puppeteerInstance:browser,logLevel:'error'});
 for(const frame of[0,60,150,240,330,420,479]){
  await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,output:path.join(out,'291-'+frame+'.png'),logLevel:'error'});
 }
 await renderStill({serveUrl,composition,inputProps:{...inputProps,reducedMotion:true},puppeteerInstance:browser,frame:240,output:path.join(out,'291-reduced.png'),logLevel:'error'});
 await renderMedia({serveUrl,composition,inputProps,puppeteerInstance:browser,codec:'h264',crf:26,outputLocation:path.join(out,'291-preview.mp4'),logLevel:'error',concurrency:2});
 console.log('Rendered Demo291: seven phase frames, reduced-motion frame, and full 8-second 60fps preview.');
}finally{await browser.close({silent:true});}
