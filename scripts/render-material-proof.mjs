import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
import {DEFAULTS} from '../src/motion-core.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out=path.join(root,'proof/materials');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
const browser=await openBrowser('chrome',{logLevel:'error'});
const samples=[['glitch','GlitchText','glitch',13],['shine','ShinyText','shine',45],['gradient','GradientText','gradient',44],['outline','OutlineFill','outline',36],['outline','OutlineFill','outline-settled',156],['neon','NeonText','neon-bright',38],['neon','NeonText','neon-dim',66],['echo','EchoText','echo-trail',29],['echo','EchoText','echo-settled',156]];
try{
 for(const [effect,id,name,frame] of samples){
  const inputProps={...DEFAULTS,effect,lightOnDark:true,transparentBackground:false};
  const composition=await selectComposition({serveUrl,id,inputProps,puppeteerInstance:browser,logLevel:'error'});
  await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame,output:path.join(out,name+'.png'),imageFormat:'png',logLevel:'error'});
  console.log(name+' frame '+frame);
 }
}finally{await browser.close({silent:true});}
