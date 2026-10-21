import assert from 'node:assert/strict';
import {voiceAt,voiceDuration,voiceAmplitude,analyzeVoiceChannels} from '../src/demos/voice-motion.js';
import {demoDefaults,demoFrames,DEMOS} from '../src/demos/catalog.js';
const p=demoDefaults('demo-voice');
assert.equal(DEMOS.find(d=>d.code==='101').id,'demo-voice');
assert.deepEqual(p.images,[]);assert.equal(voiceDuration(p),8);
assert(Math.max(...voiceAt(p,86,60).bars.map(b=>b.height))>100);
assert(Math.max(...voiceAt(p,186,60).bars.map(b=>b.height))<8,'speech pause must return to a quiet baseline');
let progress=-1;for(let f=0;f<=480;f++){
 const s=voiceAt(p,f,60);assert(s.progress>=progress);progress=s.progress;
 for(const b of s.bars){assert(Number.isFinite(b.height));assert(b.x>=108&&b.x+5<=700);assert(b.height>=6&&b.height<=176);}
}
assert.equal(progress,1);
for(const fps of [25,30,60])for(const speed of [.5,1,2]){
 const props={...p,speed};assert.deepEqual(voiceAt(props,Math.round(fps*2/speed),fps),voiceAt(p,120,60));
 assert.equal(demoFrames(props,fps),Math.ceil(8*fps/speed));
}
// A real PCM fixture with silence, quiet tone, silence, loud tone; use inverse stereo
// to ensure channels contribute energy instead of cancelling each other out.
const rate=16000,a=Float32Array.from({length:rate*4},(_,i)=>{const t=i/rate;return (t>=.5&&t<1.5?.1:t>=2&&t<3?.7:0)*Math.sin(2*Math.PI*220*t);}),b=a.map(v=>-v);
const analyzed=analyzeVoiceChannels([a,b],rate),actual={...p,audioDuration:analyzed.duration,audioEnvelope:analyzed.envelope};
assert.equal(analyzed.duration,4);assert.equal(analyzed.envelope.length,200);
assert(voiceAmplitude(actual,2.5)>voiceAmplitude(actual,1)*4);
assert.equal(voiceAmplitude(actual,.1),0);assert.equal(voiceAmplitude(actual,3.5),0);
assert.equal(demoFrames(actual,60),240);assert.equal(voiceAt(actual,240,60).progress,1);
assert(analyzeVoiceChannels([new Float32Array(rate)],rate).envelope.every(v=>v===0));
assert.throws(()=>analyzeVoiceChannels([],rate));
assert.throws(()=>analyzeVoiceChannels([new Float32Array(100)],rate));
assert.throws(()=>analyzeVoiceChannels([a],0));
console.log('PASS: speech pulses and silence, actual PCM amplitude and stereo energy, silent input, duration/progress, safe geometry and frame-rate/speed parity.');
