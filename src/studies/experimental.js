import {SKEW_OUTLINES} from './skew-outlines.js';
import {PLUSH_OUTLINES} from './plush-outlines.js';
import {paintContext} from './paint.js';
export function createExperimentalRenderer(canvas,assets,props={}){
const c=paintContext(canvas.getContext('2d'),props.colors);
 function rgb(base){const v=props.colors?.[base]??base;return [1,3,5].map(i=>parseInt(v.slice(i,i+2),16))}
 const TAU=Math.PI*2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,p)=>a+(b-a)*p;
 const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
 const wrap=(v,n)=>((v%n)+n)%n;
 const travelPhase=time=>{const u=time/6;return TAU*(u-.065*Math.sin(TAU*u));};
 const recoil=v=>v<=0||v>=1?0:Math.sin(v*Math.PI*3)*Math.exp(-v*5)*Math.sin(Math.PI*v);

 // Cyclic, accented poses: rapid action, overshoot, then a readable pause.
 function track(time,poses){const t=wrap(time,6);for(let i=1;i<poses.length;i++){if(t<=poses[i][0]){const [a,v]=poses[i-1],[b,w]=poses[i];return mix(v,w,smooth((t-a)/(b-a)))}}return poses[poses.length-1][1]}

const submodes={spatial:props.experimentalMode||'tangle',sculpture:props.experimentalMode||'ribbon',procedural:props.experimentalMode||'contour'};
 function surface(color){c.setTransform(2,0,0,2,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.fillStyle=color;c.fillRect(0,0,800,480)}
 function make(w,h){const el=document.createElement('canvas');el.width=w;el.height=h;const get=el.getContext.bind(el);el.getContext=(kind,...args)=>kind==='2d'?paintContext(get(kind,...args),props.colors):get(kind,...args);return el}
 function text(ctx,word,size,weight=800){ctx.font=`${weight} ${size}px SixType, sans-serif`;ctx.textBaseline='alphabetic';ctx.textAlign='left'}
 const cache=new Map();
 function plate(word,w=680,h=220,weight=850,tracking=0){
  const id=word+':'+w+':'+h+':'+weight+':'+tracking;if(cache.has(id))return cache.get(id);
  const el=make(w,h),q=el.getContext('2d');text(q,word,h*.83,weight);const m=q.measureText(word),scale=Math.min((w-24)/m.width,(h-24)/((m.actualBoundingBoxAscent||h*.65)+(m.actualBoundingBoxDescent||0)));
  q.translate(w/2,h/2);q.fillStyle='#ffffff';
  if(tracking){const chars=Array.from(word),widths=chars.map(ch=>q.measureText(ch).width),width=widths.reduce((a,b)=>a+b,0)+tracking*(chars.length-1),fit=Math.min((w-32)/width,scale);q.scale(fit,fit);let x=-width/2;chars.forEach((ch,i)=>{q.fillText(ch,x,(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2);x+=widths[i]+tracking;});}
  else{q.scale(scale,scale);q.fillText(word,-m.width/2,(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2);}
  cache.set(id,el);return el;
 }
 function tinted(src,color){const el=make(src.width,src.height),q=el.getContext('2d');q.drawImage(src,0,0);q.globalCompositeOperation='source-in';q.fillStyle=color;q.fillRect(0,0,el.width,el.height);return el}
 function header(word,color){c.save();c.font='500 12px monospace';c.fillStyle=color;c.fillText(word,42,42);c.restore()}
 // Expressive display contours retain real counters and contrasting terminals.
 // The same frame-derived swell moves the outline, spacing and elastic landing.
 function inflate(time){surface('#e6c9d4');header('PLUSH / SOFT VOLUME','#543746');
  const poses=[[0,.06],[.42,1.12],[.78,.91],[1.14,1],[1.72,1],[2.42,.04],[2.86,.12],[3.58,.86],[4.02,1.1],[4.4,.95],[4.76,1],[5.45,.06],[6,.06]];
  const glyphs=Array.from('PLUSH',(ch,i)=>{const q=track(time-i*.085,poses),shape=PLUSH_OUTLINES[ch],sx=.50+.20*q,sy=.48+.48*q,gap=15;return {q,shape,sx,sy,gap,advance:shape.width*sx+gap}});
  const total=glyphs.reduce((s,g)=>s+g.advance,0)-glyphs[0].gap,fit=Math.min(1,676/total);let cursor=0;
  c.save();c.translate(400-total*fit/2,0);c.scale(fit,1);c.fillStyle='#833c4e';
  for(const {q,shape,sx,sy,advance} of glyphs){
   c.save();c.translate(cursor,325+5*Math.sin(q*Math.PI));c.scale(sx,sy);
   c.beginPath();
   for(const contour of shape.contours){
    contour.forEach(([x,y],j)=>{
     const v=y/shape.height,center=shape.width/2;
     // A rounded belly, rather than an added perimeter stroke: counters stay open.
     const px=center+(x-center)*(1+.055*q*Math.sin(Math.PI*v));
     const py=y-shape.height+2.5*Math.sin(x/shape.width*Math.PI)*Math.sin(q*Math.PI);
     j?c.lineTo(px,py):c.moveTo(px,py);
    });c.closePath();
   }
   c.fill('evenodd');c.restore();cursor+=advance;
  }
  c.restore();
 }
 // Signed distance field of an original sample word, with continuously travelling inversion.
 function distanceField(word,w=960,h=360){
  const src=plate(word,w,h,500,16),q=src.getContext('2d'),a=q.getImageData(0,0,w,h).data;
  function distance(inside){const d=new Float32Array(w*h);for(let i=0;i<d.length;i++)d[i]=(a[i*4+3]>127)===inside?0:1e4;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=y*w+x;let v=d[k];if(x)v=Math.min(v,d[k-1]+1);if(y)v=Math.min(v,d[k-w]+1);if(x&&y)v=Math.min(v,d[k-w-1]+1.414);if(x<w-1&&y)v=Math.min(v,d[k-w+1]+1.414);d[k]=v}
   for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){const k=y*w+x;let v=d[k];if(x<w-1)v=Math.min(v,d[k+1]+1);if(y<h-1)v=Math.min(v,d[k+w]+1);if(x<w-1&&y<h-1)v=Math.min(v,d[k+w+1]+1.414);if(x&&y<h-1)v=Math.min(v,d[k+w-1]+1.414);d[k]=v}return d;
  }
  const inner=distance(false),outer=distance(true);return {distances:inner.map((v,i)=>v-outer[i]),coverage:Float32Array.from(inner,(_,i)=>a[i*4+3]/255)};
 }
 // One font, weight and cap height keep every glyph optically related.
 const inversePlates=new Map(),counterMetrics=new Map();
 function counterGlyph(ch){
  if(counterMetrics.has(ch))return counterMetrics.get(ch);
  const q=make(1,1).getContext('2d');text(q,ch,200,600);const m=q.measureText(ch),cap=q.measureText('H').actualBoundingBoxAscent,scale=144/cap,inkWidth=(m.actualBoundingBoxLeft+m.actualBoundingBoxRight)*scale;
  const glyph={width:Math.ceil(inkWidth+44),height:208,scale,left:m.actualBoundingBoxLeft,ascent:m.actualBoundingBoxAscent,descent:m.actualBoundingBoxDescent,inkWidth};counterMetrics.set(ch,glyph);return glyph;
 }
 function inversePlate(ch,negative){
  const key=ch+negative;if(inversePlates.has(key))return inversePlates.get(key);
  const g=counterGlyph(ch),el=make(g.width,g.height),q=el.getContext('2d');q.fillStyle=negative?'#232724':'#eeede5';q.fillRect(0,0,g.width,g.height);
  q.translate((g.width-g.inkWidth)/2+g.left*g.scale,g.height/2+(g.ascent-g.descent)*g.scale/2);q.scale(g.scale,g.scale);text(q,ch,200,600);q.fillStyle=negative?'#eeede5':'#232724';q.fillText(ch,0,0);inversePlates.set(key,el);return el;
 }
 function counter(time){surface('#eeede5');header('VOID / SHAPE ↔ COUNTERSHAPE','#282a27');
  const poses=[[0,0],[.18,0],[.92,1],[1.9,1],[2.65,0],[3.18,0],[3.96,1],[4.65,1],[5.45,0],[6,0]];
  const widths=[...'VOID'].map(ch=>counterGlyph(ch).width),gap=26;let cursor=(800-widths.reduce((sum,w)=>sum+w,0)-gap*3)/2;
  [...'VOID'].forEach((ch,i)=>{const p=track(time-i*.10,poses),flight=Math.sin(Math.PI*p),sx=Math.cos(Math.PI*p),src=inversePlate(ch,p>.5),center=cursor+widths[i]/2;cursor+=widths[i]+gap;c.save();c.translate(center,252-30*flight+5*recoil(wrap(time-i*.10,6)/.92));c.rotate((i%2?1:-1)*flight*.075);c.scale(Math.max(.018,Math.abs(sx)),1-.12*flight);c.drawImage(src,-src.width/2,-src.height/2);c.restore()});
 }
 const outlineData=SKEW_OUTLINES;
 function distort(time){surface('#f3d64e');header('SKEW / FLEXIBLE BONES','#24273c');const word='SKEW';
  const poses=[[0,-1],[.7,1],[1.25,1],[2.05,0],[2.55,0],[3.3,-1],[3.9,-1],[4.72,0],[5.12,0],[6,-1]];
  const shapes=[...word].map((ch,i)=>{const g=outlineData[ch],a=track(time-i*.085,poses),contours=g.contours.map(points=>points.map(([xx,yy])=>{const u=yy/750;return [xx+Math.sin(u*Math.PI)*a*140+(u-.5)*a*65,(yy-364)*(1+.30*a)+Math.sin(xx/g.advance*Math.PI)*a*90]}));let min=Infinity,max=-Infinity;contours.forEach(points=>points.forEach(([x])=>{min=Math.min(min,x);max=Math.max(max,x)}));return {contours,min,width:max-min}});
  const total=shapes.reduce((s,g)=>s+g.width,0)+3*100,sc=625/total;c.save();c.translate(87.5,256);c.scale(sc,-sc);c.fillStyle='#282d48';let cursor=0;
  for(const g of shapes){c.beginPath();g.contours.forEach(points=>{points.forEach(([x,y],i)=>i?c.lineTo(x-g.min+cursor,y):c.moveTo(x-g.min+cursor,y));c.closePath()});c.fill();cursor+=g.width+100}c.restore();
 }
 const work=make(680,220),wc=work.getContext('2d');
 function voronoi(points){return points.map((a,i)=>{let poly=[[0,0],[680,0],[680,220],[0,220]];points.forEach((b,j)=>{if(i===j||!poly.length)return;const nx=b[0]-a[0],ny=b[1]-a[1],d=(b[0]**2+b[1]**2-a[0]**2-a[1]**2)/2,out=[];for(let k=0;k<poly.length;k++){const u=poly[k],v=poly[(k+1)%poly.length],du=u[0]*nx+u[1]*ny-d,dv=v[0]*nx+v[1]*ny-d;if(du<=0)out.push(u);if((du<=0)!==(dv<=0)){const p=du/(du-dv);out.push([mix(u[0],v[0],p),mix(u[1],v[1],p)])}}poly=out});return poly})}
 function cells(time){surface('#d8e7d5');header('GROW / LIVING CUTS','#263f31');const p=travelPhase(time),src=tintedCached('GROW','#263f31',680,220,550,12);
  const expand=track(time,[[0,.94],[.66,0],[1.35,0],[2.24,.95],[2.9,.17],[3.5,0],[4.05,0],[5.14,1],[6,.94]]);
  const pts=Array.from({length:18},(_,i)=>[37+(i%6)*121+24*Math.sin(p+i*1.8),16+Math.floor(i/6)*91+22*Math.cos(p+i*.83)]);
  voronoi(pts).forEach((poly,i)=>{if(!poly.length)return;const x=poly.reduce((s,a)=>s+a[0],0)/poly.length,y=poly.reduce((s,a)=>s+a[1],0)/poly.length;const lag=track(time-(i%6)*.025,[[0,.94],[.66,0],[1.35,0],[2.24,.95],[2.9,.17],[3.5,0],[4.05,0],[5.14,1],[6,.94]]),dx=(x-340)*lag*.09,dy=(y-110)*lag*.25;
   c.save();c.translate(60+x+dx,142+y+dy);c.rotate(Math.sin(i*2.1)*lag*.06);c.scale(.992-.05*lag,.992-.05*lag);c.translate(-x,-y);c.beginPath();poly.forEach((a,j)=>j?c.lineTo(...a):c.moveTo(...a));c.closePath();c.clip();c.drawImage(src,0,0);c.restore()});
 }
 const tintCache=new Map();
 function tintedCached(word,color,w=680,h=220,weight=850,tracking=0){const k=[word,color,w,h,weight,tracking].join(':');if(!tintCache.has(k))tintCache.set(k,tinted(plate(word,w,h,weight,tracking),color));return tintCache.get(k)}
 const segLines=[[-27,-72,27,-72],[-33,-63,-33,-9],[33,-63,33,-9],[-27,0,27,0],[-33,9,-33,63],[33,9,33,63],[-27,72,27,72],[0,-63,0,-9],[0,9,0,63],[-25,-61,-5,-9],[25,-61,5,-9],[-25,61,-5,9],[25,61,5,9]];
 const letters={T:[0,7,8],U:[1,2,4,5,6],N:[1,2,4,5,9,12],E:[0,1,3,4,6],Z:[0,10,11,6],O:[0,1,2,4,5,6],D:[0,1,2,4,5,6],A:[0,1,2,3,4,5],W:[1,2,4,5,11,12]};
 function segments(time){surface('#222e2b');header('TUNE / SEGMENT DISPLAY','#9bb5a6');const words=['TUNE','ZONE','DAWN'],stage=wrap(time,6)/2,j=Math.floor(stage)%3,a=words[j],b=words[(j+1)%3];
  for(let i=0;i<4;i++)for(let n=0;n<segLines.length;n++){const local=(stage%1-.12-i*.045-(n%3)*.009)/.54,f=smooth(local),flight=Math.sin(Math.PI*f),onA=letters[a[i]].includes(n)?1:0,onB=letters[b[i]].includes(n)?1:0,v=mix(onA,onB,f),[x1,y1,x2,y2]=segLines[n],mx=(x1+x2)/2,my=(y1+y2)/2;
   c.save();c.translate(166+i*155,247);c.lineCap='round';c.strokeStyle='#34473e';c.lineWidth=1.5;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();if(v>.001){c.translate(mx+Math.sin(n*2.4+i)*flight*27,my+Math.cos(n*.8+i)*flight*25);c.rotate((n%2?-1:1)*(flight*.85+recoil(local)*.18));c.globalAlpha=v;c.strokeStyle='#d0e887';c.lineWidth=9;const m=(1-v)*.5;c.beginPath();c.moveTo(mix(x1,x2,m)-mx,mix(y1,y2,m)-my);c.lineTo(mix(x1,x2,1-m)-mx,mix(y1,y2,1-m)-my);c.stroke()}c.restore()}
 }
 function network(time){surface('#ead6cf');header('NEXUS / GENERATIVE NETWORK','#43333f');wc.clearRect(0,0,680,220);wc.globalCompositeOperation='source-over';const p=time/6*TAU,pts=[],cols=31,rows=13;
  const growth=track(time,[[0,.08],[.88,1],[1.65,1],[2.65,.22],[3.48,1],[4.15,1],[5.4,.08],[6,.08]]),front=-60+820*growth;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const x=(col-1)*25+(row%2)*12.5+18*Math.sin(p*2+row*.55+col*.31),y=(row-2)*25+17*Math.cos(p*2+col*.47-row*.29);pts.push({row,col,x,y,alpha:smooth((front-x)/55)})}
  wc.strokeStyle='#483947';wc.fillStyle='#483947';wc.lineWidth=.9+.65*(.5+.5*Math.sin(p*2));
  for(let i=0;i<pts.length;i++){const a=pts[i];if(a.alpha<.002)continue;for(const offset of [1,cols,cols+(a.row%2?-1:1)]){const b=pts[i+offset];if(!b||Math.abs(b.col-a.col)>1)continue;wc.globalAlpha=Math.min(a.alpha,b.alpha);wc.beginPath();wc.moveTo(a.x,a.y);wc.lineTo(b.x,b.y);wc.stroke()}wc.globalAlpha=a.alpha;wc.beginPath();wc.arc(a.x,a.y,1.2+1.5*(.5+.5*Math.sin(p*2+a.col*.28+a.row*.5)),0,TAU);wc.fill()}
  wc.globalAlpha=1;wc.globalCompositeOperation='destination-in';wc.drawImage(plate('NEXUS',680,220,500,12),0,0);wc.globalCompositeOperation='source-over';c.save();c.globalAlpha=.12;c.drawImage(tintedCached('NEXUS','#483947',680,220,500,12),60,142);c.restore();c.drawImage(work,60,142);
 }
 function project(x,y,z){const scale=770/(770-z);return [400+x*scale,248+y*scale,scale,z]}
 function knot(u,p){let x=(2+Math.cos(3*u))*77*Math.cos(2*u),y=(2+Math.cos(3*u))*56*Math.sin(2*u),z=65*Math.sin(3*u);const a=.45+.52*Math.sin(p),b=p;
  [y,z]=[y*Math.cos(a)-z*Math.sin(a),y*Math.sin(a)+z*Math.cos(a)];[x,z]=[x*Math.cos(b)+z*Math.sin(b),-x*Math.sin(b)+z*Math.cos(b)];const roll=.16*Math.sin(p*2);[x,y]=[x*Math.cos(roll)-y*Math.sin(roll),x*Math.sin(roll)+y*Math.cos(roll)];return project(x,y,z)}
 function tangle(time){surface('#29362e');header('ORBITAL / TYPE IN SPACE','#23362a');const p=travelPhase(time),items=[],word='ORBITAL · ',count=100;
  function edge(u){const a=knot(u,p),b=knot(u+.001,p),theta=Math.atan2(b[1]-a[1],b[0]-a[0]),nx=-Math.sin(theta)*21*a[2],ny=Math.cos(theta)*21*a[2];return {a,theta,l:[a[0]+nx,a[1]+ny],r:[a[0]-nx,a[1]-ny]}}
  for(let i=0;i<count;i++){const u=i/count*TAU+p*.3,mid=edge(u),a=edge(u-Math.PI/count),b=edge(u+Math.PI/count);items.push({mid,a,b,ch:word[i%word.length]})}items.sort((a,b)=>a.mid.a[3]-b.mid.a[3]);
  for(const item of items){const {mid,a,b}=item,[x,y,s,z]=mid.a,light=clamp((z+180)/360),length=Math.hypot(b.a[0]-a.a[0],b.a[1]-a.a[1]);c.fillStyle='rgb('+rgb('#b6c3a5').map(v=>Math.round(v*(.55+.45*light))).join(',')+')';c.beginPath();c.moveTo(...a.l);c.lineTo(...b.l);c.lineTo(...b.r);c.lineTo(...a.r);c.closePath();c.fill();c.save();c.translate(x,y);c.rotate(mid.theta);c.fillStyle='#23362a';c.font=`500 ${23*s}px SixType, sans-serif`;c.textAlign='center';c.textBaseline='middle';const width=c.measureText(item.ch).width;c.scale(Math.min(1,length*.88/Math.max(1,width)),1);c.fillText(item.ch,0,0);c.restore()}
 }
 function mappedStrip(src,sx,sw,a,b,d,shade=0){const sh=src.height;c.save();c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(b[0]+d[0]-a[0],b[1]+d[1]-a[1]);c.lineTo(d[0],d[1]);c.closePath();c.clip();c.transform((b[0]-a[0])/sw,(b[1]-a[1])/sw,(d[0]-a[0])/sh,(d[1]-a[1])/sh,a[0],a[1]);c.drawImage(src,sx,0,sw,sh,0,0,sw,sh);if(shade){c.fillStyle=`rgba(19,26,35,${shade})`;c.fillRect(0,0,sw,sh)}c.restore()}
 // Two affine triangles preserve both top and bottom edges of a deforming panel.
 function mappedPanel(src,sx,sw,a,b,e,d,shade=0){const sh=src.height;
  function triangle(points,matrix){c.save();c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.clip();c.transform(...matrix);c.drawImage(src,sx,0,sw,sh,0,0,sw,sh);if(shade){c.fillStyle=`rgba(19,26,35,${shade})`;c.fillRect(0,0,sw,sh)}c.restore()}
  triangle([a,b,e],[(b[0]-a[0])/sw,(b[1]-a[1])/sw,(e[0]-b[0])/sh,(e[1]-b[1])/sh,a[0],a[1]]);
  triangle([a,e,d],[(e[0]-d[0])/sw,(e[1]-d[1])/sw,(d[0]-a[0])/sh,(d[1]-a[1])/sh,a[0],a[1]]);
 }
 const sheets=new Map();
 function sheet(word,bg,fg,rows=1){const id=[word,bg,fg,rows].join();if(sheets.has(id))return sheets.get(id);const el=make(720,280),q=el.getContext('2d');q.fillStyle=bg;q.fillRect(0,0,720,280);if(rows===1)q.drawImage(tintedCached(word,fg,680,220,520,12),20,30);else{for(let r=0;r<rows;r++)q.drawImage(tintedCached(word,fg,680,75,500,6),20,r*86+12,680,75)}sheets.set(id,el);return el}
 function accordion(time){surface('#d9e3e8');header('PLEAT / FOLDED SURFACE','#30465c');const src=sheet('PLEAT','#e1f06a','#263951'),fold=track(time,[[0,.96],[.7,0],[1.6,0],[2.3,.97],[3.1,.97],[3.85,.08],[4.8,.08],[5.6,.96],[6,.96]]),cols=12,sw=720/cols,step=680/cols*(1-.72*fold),left=400-step*cols/2;
  for(let i=0;i<cols;i++){const edge=j=>track(time-j*.018,[[0,.96],[.7,0],[1.6,0],[2.3,.97],[3.1,.97],[3.85,.08],[4.8,.08],[5.6,.96],[6,.96]]),x=left+i*step,z0=(i%2?1:-1)*edge(i)*38,z1=(i%2?-1:1)*edge(i+1)*38;const a=[x,129+z0],b=[x+step+.3,129+z1],d=[x,371-z0],e=[x+step+.3,371-z1];mappedPanel(src,i*sw,sw,a,b,e,d,i%2?.34*fold:.015)}
 }
 function scan(time){surface('#ded8e9');header('RIPPLE / CONTINUOUS SCAN','#423957');const src=tintedCached('RIPPLE','#473e69',600,220,500,12),p=time/6*TAU,gain=track(time,[[0,.15],[.55,1],[1.3,.4],[2.2,1],[2.85,.12],[3.6,.9],[4.5,1],[5.45,.15],[6,.15]]);
  c.save();c.globalAlpha=.10;c.drawImage(src,100,142);c.restore();
  for(let y=0;y<220;y++){const wave=gain*(Math.sin(y/220*TAU*1.1-p*2)*18+Math.sin(y/220*TAU*2+p*2)*6);c.drawImage(src,0,y,600,1,100+wave,142+y,600,1)}}
 function spatial(time){({tangle,accordion,scan}[submodes.spatial]||tangle)(time)}
 function ribbon(time){surface('#d6e0e9');header('UNFURL / TYPE RIBBONS','#31485a');const p=time/6*TAU,word='UNFURL · ',amplitude=32+15*Math.sin(p);
  for(let row=0;row<3;row++){const angleAt=x=>(x-60)/680*TAU*1.12-p*2+row*.42,wave=x=>140+row*102+amplitude*Math.sin(angleAt(x)),height=x=>25*(.92+.14*Math.sin(angleAt(x)));c.fillStyle=row%2?'#344d68':'#eef3e6';c.beginPath();for(let x=48;x<=752;x+=2)x===48?c.moveTo(x,wave(x)-height(x)):c.lineTo(x,wave(x)-height(x));for(let x=752;x>=48;x-=2)c.lineTo(x,wave(x)+height(x));c.closePath();c.fill();
   c.save();c.clip();for(let i=-12;i<52;i++){const x=60+i*27-time/6*486+row*13;if(x<28||x>760)continue;const y=wave(x),angle=Math.atan(amplitude*TAU*1.12/680*Math.cos(angleAt(x))),s=.92+.14*Math.sin(angleAt(x));c.save();c.translate(x,y);c.rotate(angle);c.scale(1,s);c.font='500 29px SixType, sans-serif';c.fillStyle=row%2?'#eef3e6':'#344d68';c.textAlign='left';c.textBaseline='middle';c.fillText(word[wrap(i,word.length)],0,0);c.restore()}c.restore()}
 }
 function cylinder(time){surface('#e6dccb');header('ROAM / CYLINDRICAL TYPE','#574a38');const p=travelPhase(time),word='ROAM · ROAM · ROAM · ',items=[];
  for(let row=0;row<7;row++)for(let i=0;i<word.length;i++){const u=i/word.length*TAU+p+.38*Math.sin(p+row*.62),radius=153+38*Math.sin(p*2+row*.6),x=Math.sin(u)*radius,z=Math.cos(u)*radius*.67;let y=-145+row*46,zz=z;const tilt=.22*Math.sin(p);[y,zz]=[y*Math.cos(tilt)-zz*Math.sin(tilt),y*Math.sin(tilt)+zz*Math.cos(tilt)];items.push({u,x,z:zz,y,ch:word[i]})}items.sort((a,b)=>a.z-b.z);
  for(const o of items){const a=project(o.x,o.y,o.z),k=Math.cos(o.u);c.save();c.translate(a[0],a[1]);c.transform(k*a[2],.10*Math.sin(o.u),0,a[2],0,0);c.font='500 40px SixType, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle=o.z>0?'#69432b':'#c5b29a';c.fillText(o.ch,0,0);c.restore()}
 }
 function flag(time){surface('#cecfc8');header('UNTAMED / CLOTH TYPOGRAPHY','#3e4845');const src=sheet('UNTAMED','#f0ebe0','#2d4640',3),p=time/6*TAU,cols=96,sw=720/cols,width=.82+.07*Math.sin(p);
  function at(x){const u=x/720,phase=u*TAU*1.2-p*2,xx=400+(x-360)*width,yy=119+52*(.3+.7*u)*Math.sin(phase)+12*Math.sin(phase*2);return {top:[xx,yy],bottom:[xx,yy+218*(.94+.2*Math.cos(phase))]}}
  for(let i=0;i<cols;i++){const x=i*sw,a=at(x),b=at(x+sw);mappedPanel(src,x,sw,a.top,b.top,b.bottom,a.bottom,.08+.075*Math.cos(x/720*TAU*1.2-p*2))}
 }
 function sculpture(time){({ribbon,cylinder,flag}[submodes.sculpture]||ribbon)(time)}
 let grooveSdf=null,grooveImage=null,grooveCanvas=null;const grooveFill=new Float32Array(960);
 function contour(time){surface('#f1f0eb');header('GROOVE / GROWING CONTOURS','#646d67');
  if(!grooveSdf){grooveSdf=distanceField('GROOVE');grooveCanvas=make(960,360);grooveImage=grooveCanvas.getContext('2d').createImageData(960,360)}
  const data=grooveImage.data,p=time/6*TAU,bg=rgb('#f1f0eb'),fg=rgb('#343b37'),fill=track(time,[[0,0],[.55,.04],[1.45,1],[1.95,1],[2.72,0],[3.4,0],[4.22,1],[4.8,1],[5.6,0],[6,0]]),spacing=13+3*Math.sin(p);
  for(let x=0;x<960;x++)grooveFill[x]=track(time-x/960*.30,[[0,0],[.55,.04],[1.45,1],[1.95,1],[2.72,0],[3.4,0],[4.22,1],[4.8,1],[5.6,0],[6,0]]);
  for(let i=0;i<grooveSdf.distances.length;i++){const dist=grooveSdf.distances[i],a=grooveSdf.coverage[i],x=i%960,flow=p*2-x/960*.8,lines=1-smooth((Math.abs(Math.sin(dist/spacing*Math.PI-flow))-.12)/.2),v=a*mix(.14+.86*lines,1,grooveFill[x]);data[i*4]=Math.round(mix(bg[0],fg[0],v));data[i*4+1]=Math.round(mix(bg[1],fg[1],v));data[i*4+2]=Math.round(mix(bg[2],fg[2],v));data[i*4+3]=255}
  grooveCanvas.getContext('2d').putImageData(grooveImage,0,0);c.save();c.translate(400,260);const scale=.98+.02*fill;c.scale(scale,scale);c.drawImage(grooveCanvas,-308,-115.5,616,231);c.restore();
 }
 const seeds=Array.from({length:120},(_,i)=>[Math.sin(i*127.1+4)*43758.5453,Math.sin(i*311.7+9)*12783.413]);
 function grain(time){surface('#ebe4d1');header('GRAIN / ERODING INK','#5a4434');const p=time/6*TAU;wc.clearRect(0,0,680,220);wc.globalCompositeOperation='source-over';wc.drawImage(tintedCached('GRAIN','#654d3c',680,220,550,11),0,0);wc.globalCompositeOperation='destination-out';wc.fillStyle='#000';
  const erosion=track(time,[[0,.88],[.85,0],[1.45,0],[2.35,1],[2.9,.8],[3.75,0],[4.3,0],[5.25,.95],[6,.88]]);
  seeds.forEach(([a,b],i)=>{const x=(a-Math.floor(a))*680,y=(b-Math.floor(b))*220,localErosion=track(time-x/680*.24,[[0,.88],[.85,0],[1.45,0],[2.35,1],[2.9,.8],[3.75,0],[4.3,0],[5.25,.95],[6,.88]]),r=.2+localErosion*(2+5*(.5+.5*Math.sin(p*2+x*.012+y*.009)));wc.beginPath();wc.ellipse(x+7*Math.sin(p*2+i),y+7*Math.cos(p*2+i),r*.8,r*1.2,.5*Math.sin(i+p),0,TAU);wc.fill()});wc.globalCompositeOperation='source-over';c.drawImage(work,60,142);
 }
 function slice(time){surface('#e7d6c7');header('SHIFT / OFFSET LETTERFORMS','#542e31');const src=tintedCached('SHIFT','#773e3e',600,220,500,12),directions=[-1,.78,-.55,1,-.9,.7,-1],height=220/7;
  c.save();c.globalAlpha=.14;c.drawImage(src,100,142);c.restore();
  for(let i=0;i<7;i++){const spread=track(time-i*.045,[[0,1],[.7,0],[1.55,0],[2.2,-.9],[2.85,-.9],[3.6,0],[4.3,0],[5.2,1],[6,1]]),off=directions[i]*48*spread,y=i*height;c.drawImage(src,0,y,600,height,100+off,142+y+(i-3)*spread*1.8,600,height+.2)}
 }
 function procedural(time){({contour,grain,slice}[submodes.procedural]||contour)(time)}

const renderers={inflate,counter,distort,cells,segments,network,spatial,sculpture,procedural};
return {draw:time=>renderers[props.key](time),dispose:()=>{cache.clear();tintCache.clear();sheets.clear();inversePlates.clear()}};
}
