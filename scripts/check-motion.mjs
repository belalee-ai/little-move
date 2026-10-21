import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {spring} from 'remotion';
import {DEFAULTS,EFFECTS,motionModel,requiredFrames,previewFrames,previewFps,typingSchedule,layoutText,resolveEffect,impactPose,colorLuminance,karaokePalette} from '../src/motion-core.js';
const fps=30;
// A narrow t must not consume a normal h-sized cell and split “the” visually.
const the=layoutText('the',100,420,260,'Noto Sans SC',550);
assert(the[1].x-the[0].x<45,'t leaves an artificial gap before h');
assert(the[2].x+the[2].width-the[0].x<165,'the is artificially tracked apart');
assert(layoutText('i',100,420,260,'Noto Sans SC')[0].width<layoutText('m',100,420,260,'Noto Sans SC')[0].width*.5,'Latin narrow and wide letters lost proportional advances');
assert.equal(resolveEffect('001').id,'word');assert.equal(resolveEffect('018').id,'glitch');assert.equal(resolveEffect('030').id,'karaoke');
assert.equal(resolveEffect('018 故障闪动').id,'glitch');assert.equal(resolveEffect('故障闪动').code,'018');
assert.equal(new Set(EFFECTS.map(e=>e.code)).size,30);assert(EFFECTS.every(e=>/^\d{3}$/.test(e.code)));
for(const arg of ['018','故障闪动']){const r=spawnSync(process.execPath,['scripts/chatcut-payload.mjs','--effect',arg],{encoding:'utf8'});assert.equal(r.status,0);const p=JSON.parse(r.stdout);assert.equal(p.effectId,'glitch');assert.equal(p.effectCode,'018');assert(p.properties.find(v=>v.key==='effect').options.some(o=>o.label==='018 故障闪动'));}
assert.equal(EFFECTS.length,30);assert.equal(new Set(EFFECTS.map(e=>e.id)).size,30);
for(const effect of EFFECTS){
 const props={...DEFAULTS,effect:effect.id},frames=previewFrames(props,fps);
 const first=motionModel(props,0,fps,frames,spring);
 assert(first.glyphs.every(g=>g.style.opacity===0),effect.id+' shows content before trigger');
 const settled=motionModel(props,frames-24,fps,frames,spring);
 assert(settled.glyphs.every(g=>g.style.opacity>.995),effect.id+' never finishes its entrance');
 assert(settled.glyphs.some(g=>String(g.index).startsWith('en-')),effect.id+' missing English');
 assert(settled.glyphs.every(g=>g.x>=54&&g.x+g.width<=846&&g.y>=0&&g.y+g.fontSize*1.28<520),effect.id+' layout overflow');
 assert(settled.ghosts.length===0,effect.id+' leaves motion trails on settled text');
 const hasMotion=[.08,.28,.6,1,1.8,2.5].some(seconds=>{
  const f=Math.round((props.startSeconds+seconds)*fps);
  return JSON.stringify(motionModel(props,f,fps,frames,spring))!==JSON.stringify(motionModel({...props,effect:'none'},f,fps,frames,spring));
 });assert(hasMotion,effect.id+' has no implemented visual behavior');
 const final=motionModel(props,frames-1,fps,frames,spring);
 assert(final.glyphs.every(g=>g.style.opacity<.03),effect.id+' does not exit at clip end');
 const slow={...props,speed:.5,text:'这是一段用来检查换行和布局是否溢出的完整测试文字',englishText:'Make every single point beautifully clear'};
 const longFrames=previewFrames(slow,fps);
 const long=motionModel(slow,longFrames-24,fps,longFrames,spring);
 assert(long.glyphs.every(g=>g.style.opacity>.995),effect.id+' clips a slow entrance');
 assert(long.glyphs.every(g=>g.x>=54&&g.x+g.width<=846&&g.y>=0&&g.y+g.fontSize*1.28<520),effect.id+' long text overflow');
}
const scatter={...DEFAULTS,effect:'gather'};
const a=motionModel(scatter,45,fps,180,spring),b=motionModel(scatter,45,fps,180,spring);
assert.deepEqual(a,b,'scatter is not seek-safe');
assert.notDeepEqual(a,motionModel({...scatter,seed:92},45,fps,180,spring),'seed does not change scatter');
assert(requiredFrames({...DEFAULTS,effect:'word'},30)<180,'real overlays are forced to six seconds');
const bad=spawnSync(process.execPath,['scripts/chatcut-payload.mjs','--frames','5'],{encoding:'utf8'});
assert(bad.status!==0&&bad.stderr.includes('too short'),'payload accepts clipped motion');
const typing={...DEFAULTS,effect:'typing',text:'慢慢打字，保持字号。'},typingFrames=previewFrames(typing,fps);
const times=typingSchedule(layoutText(typing.text,128));
assert(new Set(times.slice(1).map((v,i)=>(v-times[i]).toFixed(2))).size>3,'typing cadence is uniform');
assert(times[5]-times[4]>.6,'typing does not pause after punctuation');
let lastCount=0;
for(let f=0;f<typingFrames-10;f++){
 const model=motionModel(typing,f,fps,typingFrames,spring),visible=model.glyphs.filter(g=>g.style.opacity>0);
 assert(visible.length>=lastCount,'typing deletes already entered text');lastCount=visible.length;
 assert(model.glyphs.every(g=>g.style.transform==='perspective(480px) translate3d(0px,0px,0px) rotate(0deg) rotateY(0deg) scale(1,1)'), 'typing moves or scales a glyph');
 assert(model.glyphs.every(g=>g.style.fontSize===g.fontSize),'typing changes font size');
 if(f>=typing.startSeconds*fps)assert(model.cursorStyles.length===2,'typing needs cursors for both languages');
}
const decode={...DEFAULTS,effect:'scramble'};assert(motionModel(decode,25,30,180,spring).glyphs.some(g=>g.char!==layoutText(DEFAULTS.text,DEFAULTS.fontSize)[g.index]?.char));
assert.deepEqual(motionModel(decode,25,30,180,spring),motionModel(decode,25,30,180,spring),'decode is not seek-safe');
const cycle={...DEFAULTS,effect:'cycle'},cycleFrames=previewFrames(cycle);assert(motionModel(cycle,80,30,cycleFrames,spring).glyphs.filter(g=>g.index.startsWith('cn-')).map(g=>g.char).join('').includes('让表达'));
assert.equal(lastCount,motionModel(typing,typingFrames-24,fps,typingFrames,spring).glyphs.length,'typing does not complete');
const materialAt=(effect,time,changes={})=>motionModel({...DEFAULTS,effect,...changes},Math.round((DEFAULTS.startSeconds+time)*fps),fps,180,spring);
const bright=materialAt('neon',1.2),dim=materialAt('neon',2.4);
assert(bright.glyphs.every((g,i)=>colorLuminance(g.style.color)>colorLuminance(dim.glyphs[i].style.color)*8),'neon has no visible light-output contrast');
assert(bright.glyphs.every(g=>g.style.fontWeight===200),'neon keeps a heavy solid face instead of a slim light tube');
assert(bright.glyphs.every(g=>g.style.color!=='transparent'&&!g.style.WebkitTextStroke&&g.style.textShadow!=='none'),'neon needs solid illuminated faces without outline strokes');
assert.deepEqual(bright,materialAt('neon',1.2,{accent:'#FF8800'}),'neon incorrectly inherits the interface accent color');
assert(!bright.layers.some(l=>l.index==='neon-bloom'),'neon leaves a colored fog behind the words');
assert.notEqual(bright.glyphs[0].style.textShadow,materialAt('neon',1.2,{lightColor:'#C6B4E2'}).glyphs[0].style.textShadow,'independent light color has no effect');
const pinkNeon=materialAt('neon',1.2,{lightColor:'#FF4FA0'}),violetNeon=materialAt('neon',1.2,{lightColor:'#A76BFF'});
assert.notEqual(bright.glyphs[0].style.color,pinkNeon.glyphs[0].style.color,'neon color changes only the halo, leaving a white face');
assert.notEqual(pinkNeon.glyphs[0].style.color,violetNeon.glyphs[0].style.color,'neon presets do not change the face');
assert(bright.glyphs.every((g,i)=>g.style.color!==dim.glyphs[i].style.color),'neon core does not brighten with the pulse');
assert(bright.glyphs.every(g=>g.style.textShadow.split('px ').length===5),'neon needs tight and diffuse colored light layers');
for(const effect of ['shine','outline'])assert(materialAt(effect,1).glyphs.every(g=>g.style.textShadow==='none'),effect+' has unwanted outer glow');
const developing=materialAt('outline',.9),developed=materialAt('outline',3);
assert(developing.glyphs.every((g,i)=>g.style.color!=='transparent'&&!g.style.WebkitTextStroke&&g.style.maskImage!==developed.glyphs[i].style.maskImage),'soft reveal needs a moving feathered mask without outlines');
assert.equal(resolveEffect('描边填充').code,'021','renaming the visual breaks its existing name');
assert.equal(resolveEffect('021 描边填充').id,'outline','renaming the visual breaks its existing public label');
const trails=materialAt('echo',.95);
assert.equal(trails.ghosts.length,trails.glyphs.length*5,'echo needs five delayed copies');
assert(new Set(trails.ghosts.slice(0,5).map(g=>g.style.transform)).size>=4,'echo copies do not lag independently');
assert(trails.ghosts.some(g=>g.style.opacity>.3),'echo trails are imperceptible');
const torn=materialAt('glitch',.12);
assert.equal(torn.ghosts.length,torn.glyphs.length*5,'glitch needs separate torn slices');
assert(new Set(torn.ghosts.slice(0,5).map(g=>g.style.transform)).size>=4,'glitch slices have no independent offsets');
for(const effect of ['glitch','shine','gradient','outline','neon','echo']){
 assert.deepEqual(materialAt(effect,.95),materialAt(effect,.95),'material effect is not seek-safe');
 assert.equal(materialAt(effect,1,{lightOnDark:false}).surfaceStyle.backgroundColor,DEFAULTS.background,'material ignores chosen light background');
 const transparent=materialAt(effect,1,{transparentBackground:true});
 assert.equal(transparent.surfaceStyle.backgroundColor,'transparent');
 assert(!transparent.layers.some(l=>l.index==='material-depth'),'material adds an opaque layer to transparent exports');
}
assert.equal(materialAt('word',1).surfaceStyle.backgroundColor,DEFAULTS.background,'material changes ordinary effects');
console.log('PASS: 30 effects; trigger / settled state / bilingual layout / slow long copy / exit / deterministic scatter / payload duration guard / fixed-size typing and punctuation pauses / material pulse, slices, delayed trails and transparent background.');

const highlighter=(overrides={})=>{const props={...DEFAULTS,effect:'highlight',color:'#181717',accent:'#6B6965',background:'#FAF9F6',...overrides};return motionModel(props,156,30,180,spring).markers[0].color;};
assert(highlighter().includes('#E7FF3F'),'paper theme must retain fluorescent yellow');
assert.equal(highlighter(),highlighter({accent:'#111111'}),'marker inherits interface accent');
assert(highlighter({markerColor:'#FF6BCE'}).includes('#FF6BCE'),'custom marker color ignored');
console.log('PASS: fluorescent marker is independent of the interface accent.');
for(const fontFamily of ['Noto Sans SC','Noto Serif SC','Chill Round F','Xiaolai','LXGW WenKai Lite','Smiley Sans Oblique'])for(const bilingual of [true,false]){
 const props={...DEFAULTS,effect:'highlight',fontFamily,bilingual},frames=previewFrames(props),model=motionModel(props,frames-24,30,frames,spring);
 assert.equal(model.markers.length,bilingual?2:1,'highlight must be one continuous stroke per text row');
 assert(model.glyphs.every(g=>!g.clipStyle.backgroundImage),'highlight still paints separate rectangular blocks');
 assert(model.markers.every(m=>m.style.left>=54&&m.style.left+m.style.width<=846&&m.style.top+m.style.height<520),'highlight stroke overflows');
 assert(model.markers.every(m=>m.style.height<24&&m.style.clipPath==='inset(0 0% 0 0)'),'highlight is too thick or incompletely revealed');
 assert(motionModel(props,0,30,frames,spring).markers.every(m=>m.style.opacity===0),'highlight appears before the trigger');
 assert(motionModel(props,frames-1,30,frames,spring).markers.every(m=>m.style.opacity<.03),'highlight outlives its text');
}
assert.equal(materialAt('mask',1).lineStyle.display,'none','mask reveal keeps an unrelated decorative underline');
console.log('PASS: continuous slim marker strokes across six fonts, language modes and clip boundaries; mask has no decorative underline.');

// Rotation must not relayout glyphs, jump at the stop, or drift across frame rates.
assert.equal(previewFps('circle'),60);
assert(EFFECTS.filter(e=>!['circle','impact'].includes(e.id)).every(e=>previewFps(e.id)===30));
for(const rate of [25,30,60])for(const speed of [.5,1,2]){
 const props={...DEFAULTS,effect:'circle',speed},frames=previewFrames(props,rate);
 const at=f=>motionModel(props,f,rate,frames,spring);
 const angle=f=>Number(at(f).circleStyle.transform.match(/rotate\(([^d]+)/)[1]);
 const before=at(Math.round(rate*1.5)),after=at(Math.round(rate*2));
 assert.deepEqual(before.glyphs.map(g=>g.clipStyle),after.glyphs.map(g=>g.clipStyle),'circle relayouts characters while rotating');
 assert.equal(before.circleStyles.length,2,'circle needs separate Chinese and English rings');
 assert.deepEqual(before.circleStyles.map(r=>r.style.transformOrigin),['225px 260px','675px 260px'],'circle comparison is not side by side');
 for(const prefix of ['cn-','en-']){
  const first=before.circleStyles.find(r=>r.prefix===prefix),second=after.circleStyles.find(r=>r.prefix===prefix);
  assert.notEqual(first.style.transform,second.style.transform,prefix+' ring is stationary');
  const glyphs=before.glyphs.filter(g=>g.index.startsWith(prefix));
  assert(glyphs.some(g=>g.orbitAngle!==0),prefix+' glyphs do not follow the ring tangent');
 }
 assert.equal(before.circleStyles[0].style.transform,before.circleStyles[1].style.transform,'comparison rings rotate at different speeds');
 const stop=frames/rate-1.8,last=Math.ceil(stop*rate)-1,nominal=.55*speed*180/Math.PI/rate;
 assert(angle(last+1)-angle(last)<nominal*.04,'circle stops abruptly');
 assert(Math.abs(angle(last+2)-angle(last+1))<1e-8,'circle drifts after settling');
 for(let f=1;f<=last;f++)assert(angle(f)>=angle(f-1)-1e-8,'circle snaps backwards');
 const pose30=motionModel(props,60,30,previewFrames(props,30),spring).circleStyle;
 const pose60=motionModel(props,120,60,previewFrames(props,60),spring).circleStyle;
 assert.deepEqual(pose30,pose60,'circle rotation changes with composition fps');
}
for(const fontFamily of ['Noto Sans SC','Noto Serif SC','Chill Round F','Xiaolai','LXGW WenKai Lite','Smiley Sans Oblique'])for(const bilingual of [false,true])for(const [text,englishText] of [['把重点讲清楚','Make the point clear'],['字','I'],['让每一个复杂的想法都能通过清楚的表达被理解','Make every single point beautifully clear'],['字'.repeat(24),'W'.repeat(48)]]){
 const props={...DEFAULTS,effect:'circle',fontFamily,bilingual,text,englishText};
 const frames=previewFrames(props,60),model=motionModel(props,120,60,frames,spring);
 assert.equal(model.circleStyles.length,bilingual?2:1,'single-language circle is not centered');
 if(!bilingual)assert.equal(model.circleStyle.transformOrigin,'450px 260px');
 for(const ring of model.circleStyles){
  const [cx,cy]=ring.style.transformOrigin.match(/[\d.]+/g).map(Number);
  for(const g of model.glyphs.filter(g=>g.index.startsWith(ring.prefix))){
   const tangent=g.orbitAngle*Math.PI/180,ox=g.x+g.width/2,oy=g.y+g.fontSize*1.28*.55;
   for(const [x,y] of [[g.x,g.y],[g.x+g.width,g.y],[g.x,g.y+g.fontSize*1.28],[g.x+g.width,g.y+g.fontSize*1.28]]){
    const X=ox+(x-ox)*Math.cos(tangent)-(y-oy)*Math.sin(tangent),Y=oy+(x-ox)*Math.sin(tangent)+(y-oy)*Math.cos(tangent);
    const reach=Math.hypot(X-cx,Y-cy);
    assert(cx-reach>8&&cx+reach<892&&cy-reach>8&&cy+reach<512,'rotating circle can clip a glyph');
    if(bilingual)assert(ring.prefix==='cn-'?cx+reach<450:cx-reach>450,'language rings overlap while rotating');
   }
  }
 }
}
console.log('PASS: circle uses a fixed glyph layout, smooth stopping, two rotating language rings and matching 25/30/60fps timing; browser preview is 60fps.');

assert(impactPose(0).scale<.5&&impactPose(.2).scale>1.15,'impact must enlarge into its hit');
assert(impactPose(.29).x<-75,'impact kick is too small');
assert(impactPose(.42).x>0&&Math.abs(impactPose(.42).x)<Math.abs(impactPose(.29).x),'impact recoil does not reverse and decay');
assert(Math.abs(impactPose(.57).x)<Math.abs(impactPose(.42).x),'impact keeps its full shake amplitude');
assert.deepEqual(impactPose(1.42),{scale:1,x:0,y:0,rotate:0},'impact does not settle quickly');
for(const bilingual of [false,true])for(const strength of [.6,1.4,1.8]){
 const props={...DEFAULTS,effect:'impact',impact:strength,bilingual},n=previewFrames(props);
 const at=(seconds,rate=30)=>motionModel(props,Math.round((props.startSeconds+seconds)*rate),rate,previewFrames(props,rate),spring);
 assert.deepEqual(at(.4).glyphs.map(g=>g.style.transform),at(1).glyphs.map(g=>g.style.transform),'impact jitters individual glyphs');
 assert.notEqual(at(.3).impactStyle.transform,at(.4).impactStyle.transform,'impact group has no recoil');
 assert.deepEqual(at(1.5).impactStyle,at(2).impactStyle,'impact leaves a long jitter tail');
 assert.deepEqual(at(.4,30).impactStyle,at(.4,60).impactStyle,'impact timing changes at 60fps');
 const settled=motionModel(props,n-24,30,n,spring);assert.equal(settled.impactStyle.transform,'translate3d(0px,0px,0) rotate(0deg) scale(1)');
}
console.log('PASS: impact enlarges into one strong group kick, short decaying recoil and a stable finish in both language modes and 30/60fps.');

const ktvProps={...DEFAULTS,effect:'karaoke',color:'#181717',background:'#FAF9F6',accent:'#6B6965'},ktvFrames=previewFrames(ktvProps);
const ktvAt=time=>motionModel(ktvProps,(ktvProps.startSeconds+time)*30,30,ktvFrames,spring).glyphs.filter(g=>g.index.startsWith('cn-'));
assert(ktvAt(.4).every(g=>g.style.backgroundImage.includes(' 0%,')),'karaoke starts before the full line is readable');
const half=ktvAt(1.95);assert(half.some(g=>g.style.backgroundImage.includes(' 100%,'))&&half.some(g=>g.style.backgroundImage.includes(' 0%,')),'karaoke does not show a clear highlighted and unhighlighted split');
assert(ktvAt(3.4).every(g=>g.style.backgroundImage.includes(' 100%,')),'karaoke does not retain already highlighted lyrics');
assert.notEqual(karaokePalette(ktvProps).active,ktvProps.accent,'karaoke inherits the gray interface color');
assert.equal(karaokePalette({...ktvProps,karaokeColor:'#D52E68'}).active.toLowerCase(),'#d52e68','karaoke ignores its dedicated color');
assert.equal(previewFps('impact'),60);assert.equal(previewFrames({...DEFAULTS,effect:'impact'},60),240,'impact preview hides its action behind a long hold');
console.log('PASS: visibly thin neon light tubes, independent high-contrast karaoke with a long sweep, and a four-second 60fps impact preview.');
