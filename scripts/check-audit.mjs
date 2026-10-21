import assert from 'node:assert/strict';
import {spring} from 'remotion';
import {DEFAULTS,EFFECTS,motionModel,previewFrames,layoutText,contrastRatio,readableAccent,requiredFrames} from '../src/motion-core.js';
const fps=30;
const at=(props,t,frames=previewFrames(props))=>motionModel(props,Math.round((props.startSeconds+t/props.speed)*fps),fps,frames,spring);
const palettes=[['#203222','#A9E83F','#F8FBF2'],['#49343D','#E1668F','#FFF8F4'],['#232326','#D98543','#F5F1E9'],['#F6F3E9','#B6F05C','#202623']];
const samples=[['把重点讲清楚','Make the point clear'],['这是一段用来检查换行和布局是否溢出的完整测试文字','Make every single point beautifully clear'],['用更清楚的表达让每一个复杂想法都被理解','W'.repeat(48)]];
let cases=0;
for(const effect of EFFECTS)for(const [text,englishText] of samples)for(const speed of [.5,1,2])for(const [color,accent,background] of palettes)for(const bilingual of [true,false]){
 const props={...DEFAULTS,effect:effect.id,text,englishText,speed,color,accent,background,bilingual,fontSize:150};
 const frames=previewFrames(props),settled=motionModel(props,frames-24,fps,frames,spring);
 const cn=settled.glyphs.filter(g=>g.index.startsWith('cn-')),en=settled.glyphs.filter(g=>g.index.startsWith('en-'));
 assert(cn.length>0);assert(cn.every(g=>g.x>=54&&g.x+g.width<=846&&g.y>=0&&g.y+g.fontSize*1.28<520),effect.id+' layout outside canvas');
 if(en.length){const gap=effect.id==='circle'?Math.min(...en.map(g=>g.x))-Math.max(...cn.map(g=>g.x+g.width)):Math.min(...en.map(g=>g.y))-Math.max(...cn.map(g=>g.y+g.fontSize*1.28));assert(gap>=12,effect.id+' bilingual overlap: '+gap);}
 assert(settled.glyphs.every(g=>g.style.opacity>.995),effect.id+' incomplete settled state');
 for(const g of settled.glyphs)assert(!JSON.stringify(g).includes('NaN'),effect.id+' has invalid geometry');
 cases++;
}
const english=layoutText(DEFAULTS.englishText,55),groups=new Set(english.filter(g=>!/^\s*$/.test(g.char)).map(g=>g.group));
assert.equal(groups.size,4);assert.equal(Math.max(...groups)+1,groups.size,'spaces create empty focus stops');
const wrapped=layoutText('Make every single point beautifully clear',65,100),wordStart=wrapped.findIndex(g=>g.char==='b');
assert.equal(new Set(wrapped.slice(wordStart,wordStart+'beautifully'.length).map(g=>g.y)).size,1,'English word splits across lines even though it fits');
for(let f=9;f<100;f++){
 const m=motionModel({...DEFAULTS,effect:'focus'},f,30,180,spring);
 const words=m.glyphs.filter(g=>g.index.startsWith('en-')&&!/^\s*$/.test(g.char));
 assert(words.some(g=>g.style.filter==='none'||parseFloat(g.style.filter.slice(5))<=2.01),'focus lands only on whitespace');
}
for(const speed of [.5,1,1.5,2])for(const frames of [previewFrames({...DEFAULTS,effect:'cycle',speed}),360]){
 const props={...DEFAULTS,effect:'cycle',speed};let previous;
 for(let f=0;f<frames-9;f++){
  const m=motionModel(props,f,30,frames,spring),cn=m.glyphs.filter(g=>g.index.startsWith('cn-')),text=cn.map(g=>g.char).join(''),alpha=Math.max(...cn.map(g=>g.style.opacity));
  if(previous&&text!==previous.text)assert(Math.min(previous.alpha,alpha)<.12,'cycle visibly replaces a sentence at speed '+speed);
  previous={text,alpha};
 }
 const settled=motionModel(props,frames-24,30,frames,spring);assert.equal(settled.glyphs.filter(g=>g.index.startsWith('cn-')).map(g=>g.char).join(''),DEFAULTS.text);
}
for(const [color,accent,background] of palettes){
 assert(contrastRatio(readableAccent(accent,background),background)>=4.5,'karaoke color too faint');
 const props={...DEFAULTS,effect:'karaoke',color,accent,background,speed:.5,englishText:'W'.repeat(48)},frames=requiredFrames(props),m=motionModel(props,frames-24,30,frames,spring);
 assert(m.glyphs.every(g=>g.style.backgroundImage.includes(' 100%,')),'long karaoke highlight is cut short');
}
const pop=at({...DEFAULTS,effect:'typewriter'},.6);assert.equal(pop.cursorStyles.length,2,'pop typewriter missing bilingual cursor');
const shortMarquee={...DEFAULTS,effect:'marquee',text:'你好',englishText:'Hi'};
let previousPositions=[];
for(let f=20;f<100;f++){
 const m=motionModel(shortMarquee,f,30,180,spring),positions=m.ghosts.filter(g=>g.char==='你').map(g=>g.clipStyle.left+Number(g.style.transform.match(/translate\(([^p]+)/)[1]));
 assert(positions.length>=2,'short marquee does not fill the moving belt');
 for(const x of previousPositions){const expected=x-155/30;if(expected>20&&expected<850)assert(positions.some(p=>Math.abs(p-expected)<.01),'marquee jumps at wrap');}
 previousPositions=positions;
}
for(const effect of ['zoom','impact']){
 const m=at({...DEFAULTS,effect,bilingual:false},.05),g=m.glyphs[0],dy=Number(g.style.transform.match(/translate3d\([^,]+,([^p]+)/)[1]);
 assert(Math.abs(dy)<.001,'single-line scale uses bilingual vertical origin');
}
for(const fps of [25,60])for(const effect of EFFECTS){
 const props={...DEFAULTS,effect:effect.id},frames=previewFrames(props,fps);
 assert(motionModel(props,0,fps,frames,spring).glyphs.every(g=>g.style.opacity===0));
 assert(motionModel(props,frames-Math.ceil(fps*.8),fps,frames,spring).glyphs.every(g=>g.style.opacity>.995),effect.id+' does not settle at '+fps+'fps');
 assert(motionModel(props,frames-1,fps,frames,spring).glyphs.every(g=>g.style.opacity<.03));
}
console.log('PASS: '+cases+' layout / language / palette / speed cases; whitespace-free focus, cycle return continuity, readable complete karaoke, dual cursors, seamless short marquee, single-language scale origin; 25/60fps boundaries.');
