import assert from 'node:assert/strict';
import {VERIFICATION_KEYS} from '../src/verification/catalog.js';
import {verificationAuto,verifyPosition,nextSelection,VERIFY_TARGETS} from '../src/verification/motion.js';
import {demoById,demoDefaults,demoFrames,demoStillFrame} from '../src/demos/catalog.js';
for(const [i,key] of VERIFICATION_KEYS.entries()){
 const p=demoDefaults('demo-'+key);assert.equal(demoById(p.demo).code,String(162+i));assert.equal(p.images.length,0);
 for(const fps of [25,30,60])for(const speed of [.5,1,2]){const frames=demoFrames({...p,speed},fps);assert(demoStillFrame({...p,speed},fps)<frames);for(let f=0;f<frames;f+=3){const s=verificationAuto(key,f/fps*speed);assert(Number.isFinite(s.pos.x)&&Number.isFinite(s.pos.y));assert(s.fade>=0&&s.fade<=1);}assert(verificationAuto(key,(frames-1)/fps*speed).fade<.01);}
 assert.equal(verificationAuto(key,1.7).status,'error');assert.equal(verificationAuto(key,5.2).status,'success');
 if(key!=='captcha-order'){assert(verifyPosition(key,VERIFY_TARGETS[key]));assert(!verifyPosition(key,{x:0,y:0}));assert(verifyPosition(key,verificationAuto(key,5.2).pos));}
}
assert.equal(nextSelection([],2).status,'error');assert.deepEqual(nextSelection([],0).marks,[0]);assert.deepEqual(nextSelection([0],0).marks,[0]);assert.equal(nextSelection([0],2).status,'error');assert.equal(nextSelection([0,1],2).status,'success');
assert(!verifyPosition('captcha-drag',{x:.74,y:.6}),'matching x cannot hide wrong y');
assert(!verifyPosition('captcha-rotate',{x:.8,y:.5}));assert(verifyPosition('captcha-rotate',{x:2/3+.04,y:.5},1.8));assert(!verifyPosition('captcha-rotate',{x:2/3+.04,y:.5},.6));
assert(!verifyPosition('captcha-slide',{x:NaN,y:.5}));
console.log('PASS: four unique verification demos, failure/success cycles, selection order, two-axis drop, angle/tolerance boundaries, loop fade and 25/30/60fps at .5/1/2x.');
