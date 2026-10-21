import fs from 'node:fs';
import path from 'node:path';

const manifest=JSON.parse(fs.readFileSync('docs/previews/manifest.json','utf8'));
const byFile=new Map(manifest.previews.map(p=>[p.file,p]));
if(byFile.size!==manifest.previews.length||new Set(manifest.previews.map(p=>p.code)).size!==manifest.previews.length)throw Error('Repeated preview file or ID in manifest');
const appearances=new Map();
const add=(code,where)=>{const previous=appearances.get(code);if(previous)throw Error(`Repeated motion ${code}: ${previous} and ${where}`);appearances.set(code,where);};
const counts={hero:0,readme:0,gallery:0};
for(const [file,key] of [['README.md','readme'],['docs/GALLERY.md','gallery']]){
 const markdown=fs.readFileSync(file,'utf8');
 for(const match of markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)){
  const url=match[1].split(/[?#]/)[0];
  if(!url.includes('previews/'))continue;
  const media=path.basename(url);
  if(!fs.existsSync(path.resolve(path.dirname(file),url)))throw Error(`Missing media ${file}: ${url}`);
  if(media===manifest.overview.file){for(const code of manifest.overview.codes){if(!manifest.previews.some(p=>p.code===code))throw Error('Unknown hero ID '+code);add(code,file+' overview');counts.hero++;}continue;}
  const preview=byFile.get(media);if(!preview)throw Error(`Unlisted media ${media}`);
  add(preview.code,file+' '+media);counts[key]++;
 }
}
for(const p of manifest.previews)if(!appearances.has(p.code))throw Error('Unused showcase motion '+p.code);
if(appearances.size!==manifest.previews.length)throw Error('Showcase count mismatch');
console.log(`Showcase passed: ${appearances.size} unique motions; hero ${counts.hero}, README ${counts.readme}, gallery ${counts.gallery}; no repeated motion across pages.`);
