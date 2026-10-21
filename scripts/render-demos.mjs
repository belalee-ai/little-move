import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import {DEMOS,demoDefaults} from '../src/demos/catalog.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),out=path.join(root,'proof/demos');fs.mkdirSync(out,{recursive:true});
const codes=process.argv.find(arg=>arg.startsWith('--codes='))?.slice(8).split(',');
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')}),browser=await openBrowser('chrome',{logLevel:'error'});
try{for(const d of DEMOS.filter(d=>(!codes||codes.includes(d.code))&&(!process.argv.includes('--data-only')||d.collection==='数据'))){const inputProps=demoDefaults(d.id),composition=await selectComposition({serveUrl,id:'Demo'+d.code,inputProps,puppeteerInstance:browser,logLevel:'error'});for(const [stage,frame] of [['start',0],['action',65],['settle',110],['middle',165],['late',330],['end',479]])await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,output:path.join(out,d.code+'-'+stage+'.png'),imageFormat:'png',logLevel:'error'});console.log(d.code+' '+d.name+' 6 frames');}}finally{await browser.close({silent:true});}
