import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {EFFECTS} from '../src/motion-core.js';import {STUDIES} from '../src/studies/catalog.js';import {DEMOS} from '../src/demos/catalog.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const input=JSON.parse(fs.readFileSync(path.join(root,'docs/intake/candidates.json'),'utf8'));
const args=process.argv.slice(2),at=args.indexOf('--file');
const extra=at>=0?JSON.parse(fs.readFileSync(path.resolve(args[at+1]),'utf8')):[];
const raw=[...input.candidates,...(Array.isArray(extra)?extra:extra.candidates??[])];
const known=new Set(DEMOS.map(x=>x.signature)),seen=new Set(),kept=[],duplicates=[];
for(const c of raw){if(!c.key||!c.name||!c.signature||!c.source||!c.collection||!c.license)throw Error('候选缺少名称、动作特征、分类、来源或许可状态');if(!/^https:\/\//.test(c.source))throw Error('来源须为HTTPS URL');if(!['discovered','verified','implemented','accepted','blocked'].includes(c.status))throw Error('未知候选状态 '+c.status);if(seen.has(c.key)||known.has(c.signature)){duplicates.push(c.key);continue;}seen.add(c.key);known.add(c.signature);kept.push(c);}
const catalog=[...EFFECTS,...STUDIES,...DEMOS];
const report={generatedAt:new Date().toISOString(),schedule:'manual',quantityLimit:null,implemented:catalog.length,nextCode:String(Math.max(...catalog.map(x=>+x.code))+1).padStart(3,'0'),candidates:kept,duplicates,counts:kept.reduce((r,c)=>(r[c.status]=(r[c.status]??0)+1,r),{}),note:'报告仅验证字段与去重；来源许可、真实预览及实现质量必须另行核验。未修改网站、未自动定时。'};
const dest=path.join(root,'docs/intake/report.json');fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({implemented:report.implemented,nextCode:report.nextCode,candidates:kept.length,duplicates,schedule:report.schedule,quantityLimit:null},null,2));
