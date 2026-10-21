import assert from 'node:assert/strict';
import {VOICE_UI_KEYS,VOICE_UI_ROWS} from '../src/voice-ui/catalog.js';import {uiAuto,barsAt,projectWheel,settle,refreshRelease,swipeTarget} from '../src/voice-ui/motion.js';import {demoDefaults,demoById,demoFrames,demoStillFrame} from '../src/demos/catalog.js';
assert.equal(VOICE_UI_KEYS.length,12);assert.equal(VOICE_UI_ROWS.filter(r=>r[4]==='语音控件').length,6);
for(const [i,key] of VOICE_UI_KEYS.entries()){const p=demoDefaults('demo-'+key);assert.equal(demoById(p.demo).code,String(166+i));assert.equal(p.images.length,0);for(const fps of [25,30,60])for(const speed of [.5,1,2]){const frames=demoFrames({...p,speed},fps);assert(demoStillFrame({...p,speed},fps)<frames);for(let f=0;f<frames;f+=5){let a=uiAuto(key,f/fps*speed);for(const k of ['q','presence','level','progress','index','volume','pull'])assert(Number.isFinite(a[k]),key+' '+k);}assert(uiAuto(key,(frames-1)/fps*speed).presence<.01);}}
assert.equal(uiAuto('voice-orb',1).state,1);assert.equal(uiAuto('voice-orb',3).state,2);assert.equal(uiAuto('voice-orb',5).state,3);assert.equal(uiAuto('memo-panel',3.2).state,2);assert.equal(uiAuto('memo-panel',4.2).state,1);assert.equal(uiAuto('memo-panel',6).state,3);
assert.equal(uiAuto('call-mute',3).state,1);assert.equal(uiAuto('call-mute',5).state,0);assert.equal(uiAuto('call-mute',7).state,2);
assert.equal(uiAuto('voice-message',3.1).progress,uiAuto('voice-message',3.7).progress,'pause must freeze timeline');
assert.equal(projectWheel(-2,-20),0);assert.equal(projectWheel(11,20),10);assert(projectWheel(4,8)>projectWheel(4,-8));assert.equal(swipeTarget(-.5),1);assert.equal(swipeTarget(-.1),0);assert(refreshRelease(1.1));assert(!refreshRelease(.8));
assert(Math.abs(settle(0,1,0,.8)-1)<.001);assert.equal(settle(.6,0,0,0),.6,'retarget must start from current presentation');
assert(barsAt(1.43,35,1,1).some(h=>h>40));assert(barsAt(1.43,35,1,0).every(h=>h===5));
console.log('PASS: 12 distinct frame-driven UI demos, voice phases, pause time, wheel inertia/bounds, swipe/refresh thresholds, interrupt start, muted bars and frame-rate/speed parity.');
