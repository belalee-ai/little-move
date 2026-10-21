import assert from 'node:assert/strict';
import {demoDefaults,demoUsesImages,demoById,demoState} from '../src/demos/catalog.js';
import {dockItems,slideProgress,slideRelease,radialProgress,radialItem} from '../src/demos/pointer-motion.js';
for(const [id,name,trigger] of [['demo-tilt','弹性 Dock','指针'],['demo-magnet','滑动确认','拖动'],['demo-follow','径向菜单','点击']]){
 assert.equal(demoById(id).name,name);assert.equal(demoById(id).trigger,trigger);assert.equal(demoUsesImages(id),false);assert.deepEqual(demoDefaults(id).images,[]);
}
for(let i=0;i<5;i++){
 const items=dockItems((252+i*74)/800,1);
 assert.equal(items.reduce((best,it,j)=>it.focus>items[best].focus?j:best,0),i);
 assert(items[i].size>85&&items[i].y<253,'hover needs a visible lift');
}
for(let x=0;x<=1;x+=.01)for(const strength of [.5,1,1.5]){
 const items=dockItems(x,1,strength);
 for(let i=0;i<5;i++){assert(Object.values(items[i]).every(Number.isFinite));assert(items[i].x-items[i].size/2>=20&&items[i].x+items[i].size/2<=780);if(i)assert(items[i].x-items[i].size/2>items[i-1].x+items[i-1].size/2,'Dock icons overlap');}
}
assert(dockItems(.4,0).every(i=>i.size===58&&i.y===280));
assert.equal(slideProgress(0),0);assert.equal(slideProgress(8),0);assert.equal(slideProgress(3.5),1);
assert(slideProgress(1.5)>0&&slideProgress(1.5)<slideProgress(2.5));
assert.equal(slideRelease(.89999),0);assert.equal(slideRelease(.9),1);assert.equal(slideRelease(1),1);
for(let i=0;i<5;i++){
 const a=radialItem(0,i),b=radialItem(1,i);assert.equal(a.q,0);assert.equal(b.q,1);
 assert(Math.abs(Math.hypot(b.x-400,b.y-255)-133)<1e-8);
 assert(b.x-34>20&&b.x+34<780&&b.y-34>20&&b.y+115<480);
}
assert.equal(radialProgress(0),0);assert.equal(radialProgress(8),0);assert.equal(radialProgress(2),1);assert.equal(radialProgress(4),0);assert.equal(radialProgress(6),1);
for(const fps of [25,30,60])for(const speed of [.5,1,2])for(const key of ['tilt','magnet','follow']){
 const p={...demoDefaults('demo-'+key),speed},frames=Math.ceil(8*fps/speed);
 for(let f=0;f<frames;f+=7){const s=demoState(p,f,fps);assert(Number.isFinite(s.t));}
}
console.log('PASS: three genuinely replaced mechanisms, no image placeholders, five Dock targets with no overlap, visible lift, confirmation threshold, two radial cycles, safe radial bounds and 25/30/60fps sampling.');
