import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const args=process.argv.slice(2),base=args[args.indexOf('--base')+1]||'/';
assert(base.startsWith('/')&&base.endsWith('/'),'Use an absolute base ending in /');
const html=fs.readFileSync('dist/index.html','utf8');
assert(html.includes('<title>Little Move</title>'));
const scripts=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]);
assert(scripts.length>0,'Missing built entry script');
for(const url of scripts){assert(url.startsWith(base+'assets/'),url+' has the wrong deployment base');assert(fs.existsSync(path.join('dist',url.slice(base.length))));}
const files=fs.readdirSync('dist/assets'),css=files.filter(f=>f.endsWith('.css')).map(f=>fs.readFileSync('dist/assets/'+f,'utf8')).join('\n');
for(const match of css.matchAll(/url\((?:["']?)([^)"']+)/g)){
 const url=match[1];if(url.startsWith('data:'))continue;
 assert(url.startsWith(base),url+' escapes the deployment subdirectory');
 assert(fs.existsSync(path.join('dist',decodeURIComponent(url.slice(base.length)))),'Missing '+url);
}
for(const file of ['type-studies/portrait-cutout.webp','type-studies/portrait-demo.png','demo-photos/mountains.jpg','demo-photos/forest.jpg','demo-photos/coast.jpg'])assert(!fs.existsSync('dist/'+file),'Historical asset leaked into deployment: '+file);
for(const file of ['fonts/NotoSansSC.ttf','type-studies/fonts/SixType.ttf','type-studies/sculptural-clock.webp','demo-photos/architecture-curve.jpg','sounds/tap.wav'])assert(fs.existsSync('dist/'+file),'Missing runtime asset: '+file);
console.log('PASS: built HTML and CSS respect '+base+'; runtime assets exist; historical portraits and photos are excluded.');
