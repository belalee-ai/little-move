import assert from 'node:assert/strict';
import fs from 'node:fs';
import {EFFECTS,DEFAULTS,previewFrames,previewFps,typingSchedule,layoutText} from '../src/motion-core.js';
import {STUDIES,studyDefaults,studyFrames} from '../src/studies/catalog.js';
import {DEMOS,demoDefaults,demoFrames} from '../src/demos/catalog.js';
import {soundCues,recommendedSound,SOUND_OPTIONS,SOUND_SECONDS} from '../src/sound-cues.js';
const all=[...EFFECTS,...STUDIES,...DEMOS];assert.equal(all.length,293);
for(const m of all){
 const defaults=m.id.startsWith('demo-')?demoDefaults(m.id):m.id.startsWith('study-')?studyDefaults(m.id):{...DEFAULTS,effect:m.id};
 const fps=m.id.startsWith('demo-')||m.id.startsWith('study-')?60:previewFps(m.id);
 for(const speed of [.5,1,2]){
  const p={...defaults,speed};const duration=m.id.startsWith('demo-')?demoFrames(p):m.id.startsWith('study-')?studyFrames(p,fps):previewFrames(p,fps);
  assert.deepEqual(soundCues(m.id,p,fps,duration),[],'Default must stay silent '+m.id);
  for(const [preset] of SOUND_OPTIONS){
   const cues=soundCues(m.id,{...p,soundPreset:preset},fps,duration);
   assert(cues.every(c=>Number.isInteger(c.frame)&&c.frame>=0&&c.frame<duration&&SOUND_SECONDS[c.kind]));
   assert.deepEqual(soundCues(m.id,{...p,soundPreset:preset,input:{}},fps,duration),[],'No preset cues in live mode');
  }
 }
}
const typing={...DEFAULTS,effect:'typing',soundPreset:'auto',bilingual:false};
const glyphs=layoutText(typing.text,typing.fontSize,160,205,typing.fontFamily,500);
assert.deepEqual(soundCues('typing',typing,60,2000).map(c=>c.frame),typingSchedule(glyphs).map(t=>Math.round((typing.startSeconds+t)*60)));
const slow=soundCues('demo-press',{soundPreset:'auto',speed:.5},60,960),fast=soundCues('demo-press',{soundPreset:'auto',speed:2},60,240);
assert(Math.abs(slow[0].frame/4-fast[0].frame)<=1);
assert.equal(recommendedSound('demo-voice'),'off');assert.equal(recommendedSound('neon'),'off');
const verify=soundCues('demo-captcha-slide',{soundPreset:'auto'},60,480);assert.deepEqual(verify.map(c=>c.kind),['error','chime']);
const manifest=JSON.parse(fs.readFileSync('public/sounds/manifest.json'));assert.equal(manifest.files.length,8);
for(const f of manifest.files){const bytes=fs.readFileSync('public/sounds/'+f.file);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WAVE');assert(f.peak<.8&&f.peak>.05);assert.equal(bytes.readUInt32LE(24),48000);}
console.log('Sound checks passed: 293 cards, all presets at 0.5/1/2x, silent defaults, live isolation, bilingual typing clock, WAV format and headroom.');
