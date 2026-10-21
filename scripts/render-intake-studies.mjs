import fs from 'node:fs';import path from 'node:path';
import {bundle} from '@remotion/bundler';import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import {demoDefaults} from '../src/demos/catalog.js';
const out=path.resolve('proof/intake-studies');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),publicDir:path.resolve('public')});
const browser=await openBrowser('chrome',{logLevel:'error'});
try{for(const [code,id] of[['292','demo-scroll-grain'],['293','demo-magnetic-grid']]){
 const inputProps=demoDefaults(id),composition=await selectComposition({serveUrl,id:'Demo'+code,inputProps,puppeteerInstance:browser,logLevel:'error'});
 for(const frame of[0,75,150,240,330,420,479])await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,output:path.join(out,code+'-'+frame+'.png'),logLevel:'error'});
 await renderStill({serveUrl,composition,inputProps:{...inputProps,reducedMotion:true},puppeteerInstance:browser,frame:150,output:path.join(out,code+'-reduced.png'),logLevel:'error'});
 await renderMedia({serveUrl,composition,inputProps,puppeteerInstance:browser,codec:'h264',crf:26,outputLocation:path.join(out,code+'-preview.mp4'),logLevel:'error',concurrency:2});
 console.log('Rendered '+code+': seven stages, reduced motion, and complete eight-second video.');
}}finally{await browser.close({silent:true});}
