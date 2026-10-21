import {isCoverage} from '../src/coverage/catalog.js';
import assert from 'node:assert/strict';import fs from 'node:fs';
import {DEMOS,demoDefaults,demoState,demoFrames,demoStillFrame} from '../src/demos/catalog.js';import {EFFECTS} from '../src/motion-core.js';import {STUDIES} from '../src/studies/catalog.js';
const all=[...EFFECTS,...STUDIES,...DEMOS];assert.equal(new Set(all.map(x=>x.id)).size,all.length);assert.equal(new Set(all.map(x=>x.code)).size,all.length);assert.deepEqual(DEMOS.map(x=>x.code),[...Array.from({length:12},(_,i)=>String(i+48).padStart(3,'0')),...Array.from({length:222},(_,i)=>String(i+69).padStart(3,'0'))]);assert.equal(new Set(DEMOS.map(x=>x.signature)).size,234);
for(const d of DEMOS)for(const fps of [25,30,60])for(const speed of [.5,1,2]){const p={...demoDefaults(d.id),speed};assert(demoStillFrame(p,fps)>0&&demoStillFrame(p,fps)<demoFrames(p,fps));}
assert.equal(demoStillFrame(demoDefaults('demo-reveal')),78,'reduced motion must keep reveal visibly open');
for(const d of DEMOS){const props=demoDefaults(d.id);assert(/^https:\/\//.test(d.source));for(const image of props.images)assert(fs.existsSync('public'+image));for(const fps of [25,30,60])for(const speed of [.5,1,2]){const p={...props,speed},frames=demoFrames(p,fps),first=demoState(p,0,fps),last=demoState(p,frames-1,fps);for(const key of ['p','x','y','index','gain']){assert(Math.abs(first[key]-last[key])<.085,d.id+' loop jump '+key);assert.equal(demoState(p,fps,fps)[key],demoState(p,fps*2,fps*2)[key]);}for(let f=0;f<frames;f+=13)for(const key of ['p','x','y','index','gain'])assert(Number.isFinite(demoState(p,f,fps)[key]));}}
const p={...demoDefaults('demo-drag'),input:{x:.5,y:.5,progress:.5,index:2,active:false,transition:{frame:475,from:{x:.2,y:.2,progress:.3,index:1.6,active:true}}}};assert(demoState(p,2,60).index>1.6,'pointer settling failed across loop');
const physics=await import('../src/demos/motion.js');
for(const key of ['grid','bento','expand','accordion','tilt','magnet','press','input','switch','tabs'])assert.equal(demoDefaults('demo-'+key).images.length,0,key+' must use its actual UI object');
assert.equal(demoDefaults('demo-parallax').images.length,1,'photo parallax uses one intact architectural photograph');
for(const d of DEMOS.filter(d=>demoDefaults(d.id).images.length))assert(demoDefaults(d.id).images.every(x=>x.startsWith('/demo-photos/')||x.startsWith('/coverage-art/')),'default image demos must use scenery photos');
const defaultPhotos=DEMOS.flatMap(d=>demoDefaults(d.id).images);assert.equal(new Set(defaultPhotos).size,defaultPhotos.length,'every default image slot must use a different photo, including the comparison pair');
assert(physics.itemProgress(.95,0)>physics.itemProgress(.95,5),'grid motion needs a visible stagger');
assert(physics.rubber(-1)>-1&&physics.rubber(-1)<0&&physics.rubber(3)<3&&physics.rubber(3)>2,'drag boundaries must resist continuously');
assert.equal(physics.releaseIndex(.25,4),1,'fast flick should reach next item');assert.equal(physics.releaseIndex(.25,0),0,'slow release should choose closest item');
assert.equal(physics.releaseIndex(1.75,-4),1,'negative flick must retain direction');
assert(Math.abs(physics.springValue(1.3,1,3,.68)-1)<.01,'release must settle cleanly');
let previous=0;for(let t=0;t<8;t+=.01){const turn=physics.carouselTurn(t);assert(turn>=previous-1e-6,'carousel must move forward');previous=turn;}assert(Math.abs(previous-3)<.001);
const pointer={...demoDefaults('demo-tilt'),input:{x:.8,y:.7,progress:0,index:0,active:true,transition:{frame:20,duration:.12,kind:'pointer',from:{x:.2,y:.3,progress:0,index:0,active:true}}}},state=demoState(pointer,23,60);
const retarget={...pointer,input:{...pointer.input,x:.1,transition:{...pointer.input.transition,frame:23,from:{x:state.x,y:state.y,progress:state.p,index:state.index,active:true}}}};assert.equal(demoState(retarget,23,60).x,state.x,'pointer retarget must not jump');
const source=fs.readFileSync('src/DemoMotion.tsx','utf8');assert(!/requestAnimationFrame|performance.now|setInterval|transition:|animation:/.test(source));for(const d of DEMOS)assert(isCoverage(d.id)?fs.readFileSync('src/DemoCompositions.tsx','utf8').includes("id={'Demo'+d.code}"):fs.readFileSync('src/DemoCompositions.tsx','utf8').includes('id="Demo'+d.code+'"'));
console.log('PASS: '+all.length+' stable IDs; 234 reusable demos, local assets, all six collections, 25/30/60fps at 0.5/1/2x, finite frame states, loop continuity, pointer settling across wrap, and shared frame-driven scenes.');
