import fs from 'node:fs';import path from 'node:path';
import {bundle} from '@remotion/bundler';import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import {demoDefaults} from '../src/demos/catalog.js';
const out=path.resolve('proof/direction-overlay');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),publicDir:path.resolve('public')});
const browser=await openBrowser('chrome',{logLevel:'error'});
try{
 const inputProps=demoDefaults('demo-direction-overlay'),composition=await selectComposition({serveUrl,id:'Demo294',inputProps,puppeteerInstance:browser,logLevel:'error'});
 for(const frame of [0,20,48,80,145,265,385,479])await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,output:path.join(out,'294-'+frame+'.png'),logLevel:'error'});
 const reducedProps={...inputProps,reducedMotion:true,title:'A very long label that should stay inside the card',accent:'#eee8d8'},reducedComposition=await selectComposition({serveUrl,id:'Demo294',inputProps:reducedProps,puppeteerInstance:browser,logLevel:'error'});
 await renderStill({serveUrl,composition:reducedComposition,inputProps:reducedProps,puppeteerInstance:browser,frame:150,output:path.join(out,'294-reduced-light-long.png'),logLevel:'error'});
 await renderMedia({serveUrl,composition,inputProps,puppeteerInstance:browser,codec:'h264',crf:22,outputLocation:path.join(out,'294-preview.mp4'),logLevel:'error',concurrency:2});
 console.log('Rendered 294: eight stages, reduced motion/light contrast/long label, and complete eight-second video.');
}finally{await browser.close({silent:true});}
