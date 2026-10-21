import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import{EFFECTS}from'../src/motion-core.js';import{STUDIES}from'../src/studies/catalog.js';import{DEMOS,demoDefaults,demoFrames,demoStillFrame}from'../src/demos/catalog.js';import{COVERAGE_ITEMS,COVERAGE_NATIVE_KEYS,isCoverageAudio}from'../src/coverage/catalog.js';import{dataValues,stableRank,windowAt}from'../src/coverage/motion.js';
const all=[...EFFECTS,...STUDIES,...DEMOS],counts=Object.fromEntries(Array.from(Map.groupBy(all,d=>d.category),([category,items])=>[category,items.length]));
assert.equal(COVERAGE_ITEMS.length,113);assert.equal(all.length,293);assert.equal(Object.keys(counts).length,30);assert(Object.values(counts).every(n=>n>=8));assert.deepEqual(all.map(x=>+x.code).sort((a,b)=>a-b),Array.from({length:293},(_,i)=>i+1));
const images=[];for(const d of COVERAGE_ITEMS){const p=demoDefaults('demo-'+d.key);assert.equal(p.demo,'demo-'+d.key);assert(d.prompt.length>=16);assert(d.source.startsWith('https://'));assert(d.trigger==='自动'||COVERAGE_NATIVE_KEYS.includes(d.key));for(const fps of[25,30,60])for(const speed of[.5,1,2]){const props={...p,speed};assert(demoStillFrame(props,fps)<demoFrames(props,fps));}
 for(const url of p.images){assert(fs.existsSync('public'+url));images.push({url,hash:crypto.createHash('sha256').update(fs.readFileSync('public'+url)).digest('hex')});}
 if(isCoverageAudio(p.demo))assert.equal(demoFrames({...p,audioDuration:12},60),720);
}
assert.equal(images.length,84);assert.equal(new Set(images.map(x=>x.url)).size,84);assert.equal(new Set(images.map(x=>x.hash)).size,84,'Every image asset must be independently drawn');
assert.deepEqual(stableRank([3,9,9,2]),[2,0,1,3]);assert(dataValues({dataValues:'0,NaN,99999,-1'}).every(x=>Number.isFinite(x)&&x>=0&&x<=9999));assert(windowAt(0)===0&&windowAt(7.9)===0);assert(windowAt(3)===1);
fs.mkdirSync('proof/coverage',{recursive:true});fs.writeFileSync('proof/coverage/counts.json',JSON.stringify({total:all.length,added:113,minimum:Math.min(...Object.values(counts)),counts},null,2)+'\n');
console.log('PASS: 30 categories >= 8; 293 unique IDs; 113 registered mechanisms; 84 unique image assets; frame/speed/audio duration invariants.');
