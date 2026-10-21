import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const serveUrl=await bundle({entryPoint:path.join(root,'scripts/font-proof-entry.tsx'),publicDir:path.join(root,'public')});
const browser=await openBrowser('chrome',{logLevel:'error'});
try{
 const composition=await selectComposition({serveUrl,id:'FontProof',puppeteerInstance:browser,logLevel:'error'});
 await renderStill({serveUrl,composition,puppeteerInstance:browser,frame:156,output:path.join(root,'proof/fonts.png'),imageFormat:'png',logLevel:'error'});
 console.log('Rendered proof/fonts.png: all six local fonts, Chinese and English.');
}finally{await browser.close({silent:true});}
