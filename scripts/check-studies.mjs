import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {STUDIES,studyById,studyDefaults,studyFrames,studyTime,studyStillFrame} from '../src/studies/catalog.js';
import {EFFECTS} from '../src/motion-core.js';
assert.equal(EFFECTS.length,30);assert.equal(STUDIES.length,26);assert.equal(new Set([...EFFECTS,...STUDIES].map(e=>e.id)).size,56);assert.equal(new Set([...EFFECTS,...STUDIES].map(e=>e.code)).size,56);
assert.deepEqual(STUDIES.map(s=>s.code),[...Array.from({length:17},(_,i)=>String(i+31).padStart(3,'0')),...Array.from({length:9},(_,i)=>String(i+60).padStart(3,'0'))]);
assert.deepEqual(STUDIES.map(s=>s.key),['variable','layout','mix','ring','logo','mask','stickers','fold','stack','posters','pixels','paths','geometry','swing','baton','monogram','bands','inflate','counter','distort','cells','segments','network','spatial','sculpture','procedural']);
assert.equal(new Set(STUDIES.map(s=>s.category)).size,5);
for(const s of STUDIES){
 assert.equal(studyById(s.id),s);assert(s.width>0&&s.height>0);
 for(const speed of [.5,1,2])for(const fps of [25,30,60]){
  const props={...studyDefaults(s.id),speed},frames=studyFrames(props,fps),end=studyTime(props,frames-1,fps);
  assert.equal(studyTime(props,0,fps),0);assert(end<s.seconds&&s.seconds-end<=speed/fps*1.02);assert(studyStillFrame(props,fps)<frames);
  assert.equal(studyTime(props,fps, fps),studyTime(props,2*fps,2*fps),'motion changes at matching times across fps');
 }
}
const variable=studyDefaults('study-variable');variable.words[0]='Changed';assert.equal(studyDefaults('study-variable').words[0],'Breathe','preset arrays were mutated by a reused config');
const variants=['gather','flip','wave'];const six=fs.readFileSync('src/studies/six.js','utf8');for(const variant of variants)assert(six.includes("logoMode==='"+variant+"'"));
for(const file of ['variable.js','layout.js','six.js','nine.js','experimental.js']){const code=fs.readFileSync('src/studies/'+file,'utf8');assert(!/requestAnimationFrame\s*\(|performance\.now\s*\(|setInterval\s*\(|window\.openai|<iframe/.test(code),'independent clock or widget remains in '+file);}
const nine=fs.readFileSync('src/studies/nine.js','utf8');assert(nine.includes('pixelSkeletons')&&nine.includes('pixelLetters')&&nine.includes('bandTextures')&&six.includes('new Path2D')&&six.includes("getContext('webgl'"),'a custom glyph implementation was flattened');
for(const font of JSON.parse(fs.readFileSync('public/type-studies/fonts/manifest.json','utf8'))){const bytes=fs.readFileSync('public/type-studies/fonts/'+font.file);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),font.sha256);}
for(const name of ['sculptural-clock.webp'])assert(fs.statSync('public/type-studies/'+name).size>10000);
const compositions=fs.readFileSync('src/StudyCompositions.tsx','utf8');for(const s of STUDIES)assert(compositions.includes('id="Study'+s.code+'"'));
console.log('PASS: 26 studies, 56 unique text and study IDs, five mechanism categories, original custom glyph engines and assets, three logo modes, isolated presets, and consistent 25/30/60fps timing at 0.5/1/2×.');
