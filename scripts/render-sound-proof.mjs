import fs from 'node:fs';import path from 'node:path';
import {bundle} from '@remotion/bundler';import {openBrowser,selectComposition,renderMedia} from '@remotion/renderer';
import {DEFAULTS} from '../src/motion-core.js';import {studyDefaults} from '../src/studies/catalog.js';import {demoDefaults} from '../src/demos/catalog.js';
const root=process.cwd(),out=path.join(root,'proof/sounds');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')}),browser=await openBrowser('chrome',{logLevel:'error'});
try{for(const [id,props] of [['NaturalTyping',{...DEFAULTS,effect:'typing'}],['Study035',studyDefaults('study-logo')],['Demo069',demoDefaults('demo-press')],['Demo069-silent',demoDefaults('demo-press')]]){
 const inputProps={...props,soundPreset:id.endsWith('-silent')?'off':'auto',soundVolume:.35};
 const composition=await selectComposition({serveUrl,id:id.replace('-silent',''),inputProps,puppeteerInstance:browser,logLevel:'error'});
 await renderMedia({serveUrl,composition,inputProps,puppeteerInstance:browser,codec:'wav',enforceAudioTrack:true,outputLocation:path.join(out,id+'.wav'),logLevel:'error'});
 console.log('Rendered audio proof '+id);
}}finally{await browser.close({silent:true});}
