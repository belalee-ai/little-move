import assert from 'node:assert/strict';
import fs from 'node:fs';
import {toFieldPoint,fieldSamples,fieldOffsets,liveFieldSamples,TRAIL_LIFETIME,FIELD_COLUMNS,FIELD_ROWS} from '../src/pixel-field/motion.js';
import {demoById,demoDefaults,demoUsesImages,demoFrames} from '../src/demos/catalog.js';
const mapped=toFieldPoint({x:40/800,y:40/500,vx:1,vy:1});assert.equal(mapped.x,0);assert.equal(mapped.y,0);assert.equal(toFieldPoint({x:.5,y:.5,vx:0,vy:0}).x,.5);
const meta=demoById('demo-pixel-field');
assert.equal(meta.code,'291');assert.equal(meta.signature,'image-pixel-displacement-pointer');assert.equal(meta.trigger,'指针');
const props=demoDefaults(meta.id);assert(demoUsesImages(meta.id));assert(fs.existsSync('public'+props.images[0]));
const maximum=tiles=>Math.max(...tiles.map(p=>Math.hypot(p.dx,p.dy)));
for(const fps of[25,30,60])for(const speed of[.5,1,2]){
 const duration=demoFrames({...props,speed},fps);
 let peak=0;
 for(let frame=0;frame<duration;frame++){
  const tiles=fieldOffsets(fieldSamples(frame/fps*speed),1.5);
  assert.equal(tiles.length,FIELD_COLUMNS*FIELD_ROWS);
  for(const tile of tiles){assert(Number.isFinite(tile.dx)&&Number.isFinite(tile.dy));assert(Math.abs(tile.dx)<=72&&Math.abs(tile.dy)<=72);}
  peak=Math.max(peak,maximum(tiles));
 }
 assert(peak>20,'the actual block displacement must be visible');
 assert.equal(maximum(fieldOffsets(fieldSamples(0))),0);
 assert.equal(maximum(fieldOffsets(fieldSamples((duration-1)/fps*speed))),0,'loop must end restored');
}
// The same instant is identical regardless of rendering fps, and reversal follows velocity.
assert.deepEqual(fieldOffsets(fieldSamples(3)),fieldOffsets(fieldSamples(180/60)));
const point={x:.5,y:.5,vx:1,vy:0,age:.1,weight:.05};
const forward=fieldOffsets([point]),backward=fieldOffsets([{...point,vx:-1}]);
assert(forward.some(p=>p.dx>10));forward.forEach((p,i)=>assert(Math.abs(p.dx+backward[i].dx)<1e-10));
assert.equal(maximum(fieldOffsets([point],1,true)),0);
assert.equal(maximum(fieldOffsets([point],0)),0);
assert.equal(maximum(fieldOffsets([{...point,age:TRAIL_LIFETIME}])),0);
const before=maximum(fieldOffsets([{...point,age:TRAIL_LIFETIME-1e-5}]));assert(before<1e-6,'release must settle continuously');
assert.equal(liveFieldSamples([{...point,frame:470}],10,60,480)[0].age,20/60);
assert.equal(liveFieldSamples([{...point,frame:0}],120,60,480).length,0);
console.log('PASS: 291 registration, unique original image, visible bounded offsets, 25/30/60fps and 0.5/1/2x, restored loop, reversal, reduced motion, trail expiry across loop.');
