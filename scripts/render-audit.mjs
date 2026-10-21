import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out=path.join(root,'proof/audit');fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'scripts/audit-entry.jsx'),publicDir:path.join(root,'public')});
const browser=await openBrowser('chrome',{logLevel:'error'});
const phases=process.argv.includes('--quick')?['action']:['early','action','late','settled'];
try{
 if(!process.argv.includes('--overview'))for(let page=0;page<5;page++)for(const phase of phases){
  const inputProps={page,phase,variant:{}};
  const composition=await selectComposition({serveUrl,id:'AuditGrid',inputProps,puppeteerInstance:browser,logLevel:'error'});
  await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame:0,output:path.join(out,`page-${page+1}-${phase}.png`),imageFormat:'png',logLevel:'error'});
  console.log(`page ${page+1} ${phase}`);
 }
 const variants=[
  ['long','settled',{text:'这是一段用来检查换行和布局是否溢出的完整测试文字',englishText:'Make every single point beautifully clear',fontSize:150,speed:.5}],
  ['night','action',{color:'#F6F3E9',accent:'#B6F05C',background:'#202623'}],
  ['serif','settled',{fontFamily:'Noto Serif SC'}]
 ];
 if(!process.argv.includes('--quick')&&!process.argv.includes('--overview'))for(const [name,phase,variant] of variants)for(let page=0;page<5;page++){
  const inputProps={page,phase,variant},composition=await selectComposition({serveUrl,id:'AuditGrid',inputProps,puppeteerInstance:browser,logLevel:'error'});
  await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame:0,output:path.join(out,`page-${page+1}-${name}.png`),imageFormat:'png',logLevel:'error'});
  console.log(`page ${page+1} ${name}`);
 }
 if(!process.argv.includes('--quick'))for(const [name,phase,variant] of [...phases.map(phase=>[phase,phase,{}]),...variants]){
  const inputProps={page:0,phase,variant,overview:true},composition=await selectComposition({serveUrl,id:'AuditOverview',inputProps,puppeteerInstance:browser,logLevel:'error'});
  await renderStill({serveUrl,composition,inputProps,puppeteerInstance:browser,frame:0,output:path.join(out,`overview-${name}.png`),imageFormat:'png',logLevel:'error'});
  console.log(`overview ${name}`);
 }
}finally{await browser.close({silent:true});}
