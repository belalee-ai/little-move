import {paintContext} from './paint.js';
import {ribbonGeometry,ribbonRuns,ballState,stickerFlight,foldProgress,foldShade} from './object-motion.js';
// Approved drawing functions retained; no wall clock, RAF loop, iframe or widget state.
export function createSixRenderer(canvas,assets,options={}){
 const ctx=paintContext(canvas.getContext('2d'),options.colors);
 const selected=options.key,logoMode=options.logoMode??'wave';
  const logoData={"glyphs":[{"d":"M120 1450Q0 1450 0 1330V120Q0 0 120 0H500C760 0 920 180 920 470C920 780 760 960 520 960Q340 960 240 820V1330Q240 1450 120 1450ZM250 470C250 200 670 200 670 470C670 760 250 760 250 470Z","parts":["M120 1450Q0 1450 0 1330V120Q0 0 120 0H500C760 0 920 180 920 470C920 780 760 960 520 960Q340 960 240 820V1330Q240 1450 120 1450Z","M250 470C250 200 670 200 670 470C670 760 250 760 250 470Z"],"x":0,"width":920},{"d":"M120 1450Q0 1450 0 1330V120Q0 0 120 0Q240 0 240 120V1330Q240 1450 120 1450Z","parts":["M120 1450Q0 1450 0 1330V120Q0 0 120 0Q240 0 240 120V1330Q240 1450 120 1450Z"],"x":1040,"width":240},{"d":"M460 980C170 980 0 790 0 490C0 190 170 0 460 0C750 0 920 190 920 490C920 790 750 980 460 980ZM460 750C600 750 680 650 680 490C680 330 600 230 460 230C320 230 240 330 240 490C240 650 320 750 460 750Z","parts":["M460 980C170 980 0 790 0 490C0 190 170 0 460 0C750 0 920 190 920 490C920 790 750 980 460 980Z","M460 750C600 750 680 650 680 490C680 330 600 230 460 230C320 230 240 330 240 490C240 650 320 750 460 750Z"],"x":1400,"width":920},{"d":"M460 980C170 980 0 790 0 490C0 190 170 0 460 0C750 0 920 190 920 490C920 790 750 980 460 980ZM460 750C600 750 680 650 680 490C680 330 600 230 460 230C320 230 240 330 240 490C240 650 320 750 460 750Z","parts":["M460 980C170 980 0 790 0 490C0 190 170 0 460 0C750 0 920 190 920 490C920 790 750 980 460 980Z","M460 750C600 750 680 650 680 490C680 330 600 230 460 230C320 230 240 330 240 490C240 650 320 750 460 750Z"],"x":2440,"width":920},{"d":"M0 0V680C0 1050 430 1040 500 830C690 1060 1000 1020 1000 670V0H760V650C760 820 600 820 600 650V0H380V650C380 820 230 820 230 650V0Z","parts":["M0 0V680C0 1050 430 1040 500 830C690 1060 1000 1020 1000 670V0H760V650C760 820 600 820 600 650V0H380V650C380 820 230 820 230 650V0Z"],"x":3480,"width":1000}],"units":2048,"width":4480};
  logoData.glyphs.forEach(g=>{g.path=new Path2D(g.d);g.paths=g.parts.map(d=>new Path2D(d))});

  const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)},out=v=>1-(1-clamp(v))**3;
  function spring(v){if(v<=0)return 0;if(v>=1)return 1;return 1-Math.exp(-v*8)*(Math.cos(v*12)+.22*Math.sin(v*12))}
  function ramp(v){v=clamp(v);return v*v*v*(v*(v*6-15)+10)}
  function background(color){ctx.fillStyle=color;ctx.fillRect(0,0,800,480)}
  function text(str,x,y,size,color,font='SixType',weight=900,align='center'){
    ctx.font=`${weight} ${size}px ${font}`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(str,x,y);
  }

  const mixFaces=[
    [{face:'Georgia',weight:400,w:61},{face:'Georgia',weight:400,italic:true,w:174},{face:'SixType',weight:580,w:136},{face:'SixType',weight:500,outline:true,w:173}],
    [{face:'Georgia',weight:400,italic:true,w:72},{face:'SixType',weight:520,w:171},{face:'Georgia',weight:400,w:141},{face:'SixType',weight:620,w:170}],
    [{face:'Georgia',weight:700,w:61},{face:'Georgia',weight:400,w:178},{face:'SixType',weight:650,w:133},{face:'Georgia',weight:400,italic:true,w:173}]
  ];
  const mixMetrics=new Map();
  function mixGlyph(ch,style,x,baseline,width,capHeight,offset=0){
    const face=`${style.italic?'italic ':''}${style.weight} 200px ${style.face}`,key=face+ch;
    ctx.font=face;ctx.textBaseline='alphabetic';let m=mixMetrics.get(key);if(!m){m=ctx.measureText(ch);mixMetrics.set(key,m)}
    const realWidth=m.actualBoundingBoxLeft+m.actualBoundingBoxRight,realHeight=m.actualBoundingBoxAscent;
    ctx.save();ctx.translate(x,baseline+offset);ctx.scale(width/realWidth,capHeight/realHeight);
    ctx.textAlign='left';ctx.textBaseline='alphabetic';const origin=(m.actualBoundingBoxLeft-m.actualBoundingBoxRight)/2;
    ctx.fillStyle='#eeeade';ctx.strokeStyle='#eeeade';
    if(style.outline){ctx.lineWidth=1.9*realHeight/capHeight;ctx.strokeText(ch,origin,0)}else ctx.fillText(ch,origin,0);
    ctx.restore();
  }
  function mix(t){
    background('#191c1e');
    const headings=[{word:options.headline??'Just',x:164,y:151,size:78,face:'Georgia',weight:400,angle:-.10,delay:.02,from:-88},
      {word:options.subline??'one more',x:452,y:165,size:62,face:'SixType',weight:430,angle:0,delay:.18,from:74}];
    headings.forEach((w,i)=>{
      const local=(t-w.delay)/.73,p=spring(local),a=out((t-w.delay)/.16),exit=ramp((t-5.12-i*.1)/.44);
      ctx.save();ctx.globalAlpha=a*(1-exit);ctx.translate(w.x+(1-p)*w.from,w.y+(1-p)*27-exit*34);ctx.rotate(w.angle+(1-p)*(i?-.14:.18));
      text(w.word,0,0,w.size,'#eeeade',w.face,w.weight);ctx.restore();
    });
    const letters=Array.from((options.featureWord??'IDEA').padEnd(4,' ').slice(0,4)),states=letters.map((ch,i)=>{
      const beats=[1.95,3.53];let from=0,to=0,u=0;
      beats.forEach((beat,j)=>{if(t>=beat+i*.055){from=j;to=j+1;u=ramp((t-beat-i*.055)/.43)}});
      return {from:mixFaces[from][i],to:mixFaces[to][i],u};
    });
    const widths=states.map(st=>st.from.w+(st.to.w-st.from.w)*st.u),scale=602/widths.reduce((a,b)=>a+b,0);let x=87;
    letters.forEach((ch,i)=>{
      const st=states[i],width=widths[i]*scale,local=(t-.33-i*.085)/.70,p=spring(local),exit=ramp((t-5.23-i*.06)/.43),cap=160;
      const baseline=387+(1-p)*102-exit*102,center=x+width/2+(1-p)*(i-1.5)*15;
      ctx.save();ctx.beginPath();ctx.rect(x-12,214,width+24,180);ctx.clip();ctx.globalAlpha=out((t-.33-i*.085)/.14)*(1-exit);
      ctx.translate(center,baseline);ctx.rotate((1-p)*(.075-i*.035));ctx.translate(-center,-baseline);
      if(st.u<=0||st.u>=1){mixGlyph(ch,st.u>=1?st.to:st.from,center,baseline,width,cap)}else{
        const cut=baseline-cap+cap*st.u;
        ctx.save();ctx.beginPath();ctx.rect(x-12,cut,width+24,cap+40);ctx.clip();mixGlyph(ch,st.from,center,baseline,width,cap,-st.u*15);ctx.restore();
        ctx.save();ctx.beginPath();ctx.rect(x-12,baseline-cap-28,width+24,cut-(baseline-cap)+28);ctx.clip();mixGlyph(ch,st.to,center,baseline,width,cap,(1-st.u)*15);ctx.restore();
      }
      ctx.restore();x+=width+8;
    });
  }
  let ringSculpture=null;
  function prepareRingSculpture(){
    if(ringSculpture)return ringSculpture;
    const surface=document.createElement('canvas');surface.width=384;surface.height=384;
    const gl=surface.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true,premultipliedAlpha:false});
    if(!gl)return null;
    const shader=(type,source)=>{const q=gl.createShader(type);gl.shaderSource(q,source);gl.compileShader(q);if(!gl.getShaderParameter(q,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(q));return q};
    const program=gl.createProgram();
    gl.attachShader(program,shader(gl.VERTEX_SHADER,`
      attribute vec3 position;attribute vec3 normal;uniform vec3 turn;varying vec3 worldNormal;varying vec3 worldPosition;
      vec3 rx(vec3 p,float a){return vec3(p.x,cos(a)*p.y-sin(a)*p.z,sin(a)*p.y+cos(a)*p.z);}
      vec3 ry(vec3 p,float a){return vec3(cos(a)*p.x+sin(a)*p.z,p.y,-sin(a)*p.x+cos(a)*p.z);}
      vec3 rz(vec3 p,float a){return vec3(cos(a)*p.x-sin(a)*p.y,sin(a)*p.x+cos(a)*p.y,p.z);}
      vec3 rotation(vec3 p){return rz(ry(rx(p,turn.x),turn.y),turn.z);}
      void main(){vec3 p=rotation(position);worldPosition=p;worldNormal=rotation(normal);gl_Position=vec4(p.x/96.0,p.y/96.0,p.z/180.0,1.0);}
    `));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`
      precision highp float;varying vec3 worldNormal;varying vec3 worldPosition;
      void main(){
        vec3 n=normalize(worldNormal),view=normalize(vec3(0.0,0.0,-320.0)-worldPosition),r=reflect(-view,n);
        float diffuse=max(0.0,dot(n,normalize(vec3(-0.6,0.9,-1.0))));
        float key=pow(max(0.0,dot(r,normalize(vec3(-0.65,0.75,-0.85)))),17.0);
        float strip=exp(-pow((r.x+0.34)/0.13,2.0))*(0.3+0.7*smoothstep(-0.65,0.7,r.y));
        float fill=pow(max(0.0,dot(r,normalize(vec3(0.8,0.1,-0.5)))),7.0);
        float rim=pow(1.0-max(0.0,dot(n,view)),3.0);
        vec3 metal=vec3(0.21,0.24,0.26)*(0.47+0.75*diffuse)+vec3(0.93,0.89,0.80)*(key*0.88+strip*0.60)+vec3(0.50,0.62,0.69)*fill*0.31+vec3(0.48)*rim*0.17;
        float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-0.5;
        gl_FragColor=vec4(pow(metal,vec3(0.78))+grain*0.007,1.0);
      }
    `));
    gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);
    const norm=v=>{const d=Math.hypot(...v);return v.map(x=>x/d)},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    const curve=u=>[(2+Math.cos(3*u))*Math.cos(2*u)*21,(2+Math.cos(3*u))*Math.sin(2*u)*21,Math.sin(3*u)*21];
    const vertices=[],normals=[],indices=[],steps=192,sides=32;
    for(let i=0;i<=steps;i++){
      const u=i/steps*Math.PI*2,p=curve(u),a=curve(u-.001),b=curve(u+.001),tangent=norm(b.map((v,k)=>v-a[k]));
      const side=norm(cross(tangent,[0,0,1])),up=cross(tangent,side);
      for(let j=0;j<=sides;j++){
        const v=j/sides*Math.PI*2,n=side.map((q,k)=>q*Math.cos(v)+up[k]*Math.sin(v));
        vertices.push(...p.map((q,k)=>q+10.5*n[k]));normals.push(...n);
        if(i<steps&&j<sides){const k=i*(sides+1)+j;indices.push(k,k+sides+1,k+1,k+1,k+sides+1,k+sides+2)}
      }
    }
    for(const [name,data] of [['position',vertices],['normal',normals]]){
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);
    }
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
    ringSculpture={surface,gl,program,turn:gl.getUniformLocation(program,'turn'),count:indices.length};return ringSculpture;
  }
  function ringCenter(t){
    const object=prepareRingSculpture();
    if(object){
      const {gl,program,turn,count,surface}=object,phase=t/6*Math.PI*2;
      gl.useProgram(program);gl.viewport(0,0,384,384);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.uniform3f(turn,.55+.13*Math.sin(phase),phase,-.18+.12*Math.cos(phase));gl.drawElements(gl.TRIANGLES,count,gl.UNSIGNED_SHORT,0);
      ctx.drawImage(surface,308,148,184,184);
    }else{
      ctx.save();ctx.translate(400,240);ctx.rotate(.14*Math.sin(t*Math.PI/3));
      const shine=ctx.createLinearGradient(-60,-60,65,60);shine.addColorStop(0,'#d8dce0');shine.addColorStop(.45,'#626d74');shine.addColorStop(.65,'#e7e4da');shine.addColorStop(1,'#414b53');
      ctx.strokeStyle=shine;ctx.lineWidth=17;ctx.lineCap='round';ctx.beginPath();
      for(let i=0;i<=192;i++){const u=i/192*Math.PI*2,x=(2+Math.cos(3*u))*Math.cos(2*u)*19,y=(2+Math.cos(3*u))*Math.sin(2*u)*19;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
      ctx.stroke();ctx.restore();
    }
  }
  function ring(t){
    background('#17191e');
    const chars=Array.from(options.text??'KEEP MOVING · KEEP MAKING · '),size=Math.min(64,Math.max(24,700/Math.max(1,chars.length)));
    const angle=((t+.12*Math.sin(t*Math.PI/3))/6)*Math.PI*2;
    const model={glyphs:chars.map((char,i)=>{const theta=i/Math.max(1,chars.length)*Math.PI*2-Math.PI/2+angle;return {char,fontSize:size,x:450+Math.cos(theta)*126-size/2,y:210+Math.sin(theta)*126-size/2};})};
    const tilt=.64+.23*Math.sin(t*Math.PI/3)+.045*Math.sin(t*Math.PI*2/3),c=Math.cos(tilt),s=Math.sin(tilt);
    const letters=model.glyphs.map(g=>{
      const u=(g.x+g.fontSize/2-450)*1.36,v=(g.y+g.fontSize/2-210)*1.36,z=v*s;
      return {g,u,v,z};
    }).sort((a,b)=>b.z-a.z);
    const drawLetter=({g,u,v,z})=>{
      const p=660/(660+z),theta=Math.atan2(v,u),angle=Math.atan2(Math.cos(theta)*c,-Math.sin(theta));
      ctx.save();ctx.globalAlpha=z>0?.82:1;ctx.translate(400+u*p,240+v*c*p+5*Math.sin(t*Math.PI/3));ctx.rotate(angle);ctx.scale(p,p*c*.9+.1);
      text(g.char,0,0,g.fontSize*1.23,'#f4f0e7','SixType',460);ctx.restore();
    };
    letters.filter(g=>g.z>0).forEach(drawLetter);ringCenter(t);letters.filter(g=>g.z<=0).forEach(drawLetter);
  }
  function logo(t){
    background('#969fe0');const scale=530/logoData.width;
    ctx.save();ctx.translate(400-logoData.width*scale/2,285);ctx.scale(scale,-scale);ctx.fillStyle='#fff9ea';
    logoData.glyphs.forEach((g,i)=>{
      const delay=i*(logoMode==='wave'?.07:logoMode==='flip'?.055:.035),duration=logoMode==='flip'?.80:.78;
      const local=clamp((t-delay)/duration),release=ramp((t-4.8-i*.025)/.95);
      const enter=logoMode==='gather'?spring((t-delay)/duration):out(local),p=enter*(1-release),spread=1-p;
      let dx=0,dy=0,sx=1,sy=1,angle=0,shear=0;
      if(logoMode==='gather'){
        dx=(g.x+g.width/2-logoData.width/2)*.28*spread;dy=(i%2?-70:70)*spread;
        sx=.74+.26*p;sy=1.12-.12*p;
      }else if(logoMode==='flip'){
        dy=-300*spread;sx=.12+.88*Math.sin(p*Math.PI/2);sy=.86+.14*p;angle=(i%2?.22:-.22)*spread;shear=.12*spread;
      }else{
        sx=1.07-.07*p;sy=.16+.84*p;dy=Math.sin(Math.PI*clamp(p))*165;
      }
      ctx.save();ctx.translate(g.x+g.width/2+dx,dy);ctx.rotate(angle);ctx.transform(sx,0,shear,sy,0,0);ctx.translate(-g.width/2,0);ctx.fill(g.path,'evenodd');ctx.restore();
    });ctx.restore();
  }
  const objectGain=Math.max(0,Math.min(1.2,Number.isFinite(options.objectMotion)?options.objectMotion:1));
  // Draw an open, twisted strip in depth order around solid typography.
  // Geometry and lighting share the composition's frame-derived time.
  let ribbonShade=null;
  function ribbonPath(points,front){
    const path=new Path2D();
    ribbonRuns(points,front).forEach(run=>{
      run.forEach((p,i)=>i?path.lineTo(p.x,p.y-p.half):path.moveTo(p.x,p.y-p.half));
      for(let i=run.length-1;i>=0;i--)path.lineTo(run[i].x,run[i].y+run[i].half);path.closePath();
    });
    return path;
  }
  function ribbonPart(path){
    if(!ribbonShade){ribbonShade=ctx.createLinearGradient(0,140,0,350);ribbonShade.addColorStop(0,'#ddd6c8');ribbonShade.addColorStop(.32,'#fffdf5');ribbonShade.addColorStop(.61,'#faf6ed');ribbonShade.addColorStop(1,'#bfb6a4')}
    ctx.fillStyle=ribbonShade;ctx.fill(path);
  }
  function mask(t){
    background('#eee9de');const parts=ribbonGeometry(t,objectGain),word=options.text??'SUMMER',chars=Array.from(word);
    const behind=ribbonPath(parts,false),inFront=ribbonPath(parts,true);
    ribbonPart(behind);
    const size=Math.min(148,660/Math.max(1,chars.length)*1.25);ctx.font=`550 ${size}px SixType`;
    const widths=chars.map(ch=>ctx.measureText(ch).width),total=widths.reduce((a,b)=>a+b,0),fit=Math.min(1,680/Math.max(1,total));let xx=(800-total*fit)/2;
    const letters=chars.map((ch,i)=>{
      const enter=ramp((t-.12-i*.065)/.85),exit=ramp((t-5.25-i*.04)/.48),wave=6*Math.sin(t*Math.PI/3-i*.48)*objectGain;
      const letter={ch,x:xx+widths[i]*fit/2,y:250+(1-enter)*55+wave-exit*40,alpha:out((t-.12-i*.065)/.2)*(1-exit)};
      xx+=widths[i]*fit;return letter;
    });
    const drawLetters=(opacity=1)=>letters.forEach(letter=>{
      ctx.save();ctx.globalAlpha=letter.alpha*opacity;ctx.translate(letter.x,letter.y);ctx.scale(fit,1);text(letter.ch,0,0,size,'#315ac8','SixType',550);ctx.restore();
    });
    drawLetters();ribbonPart(inFront);
    // The same letter poses show through only where the foreground silk overlaps.
    ctx.save();ctx.clip(inFront);drawLetters(.32);ctx.restore();
  }
  const stickerSprites=new Map();
  function sticker(str,x,y,size,angle,p,color,weight=640){
    if(p<=0)return;
    const key=[str,size,color,weight].join('|');let sprite=stickerSprites.get(key);
    if(!sprite){
      ctx.font=`${weight} ${size}px SixType`;const width=Math.ceil(ctx.measureText(str).width+34),height=Math.ceil(size*1.7+20),canvas=document.createElement('canvas');canvas.width=width*2;canvas.height=height*2;
      const ink=paintContext(canvas.getContext('2d'),options.colors);ink.setTransform(2,0,0,2,0,0);ink.font=`${weight} ${size}px SixType`;ink.textAlign='center';ink.textBaseline='middle';ink.lineJoin='round';
      ink.shadowColor='#17223530';ink.shadowOffsetX=1;ink.shadowOffsetY=3;ink.strokeStyle='#fffdf7';ink.lineWidth=10;ink.strokeText(str,width/2,height/2);ink.shadowColor='transparent';ink.strokeStyle='#202d46';ink.lineWidth=2.4;ink.strokeText(str,width/2,height/2);ink.fillStyle=color;ink.fillText(str,width/2,height/2);
      sprite={canvas,width,height};stickerSprites.set(key,sprite);
    }
    ctx.save();ctx.globalAlpha*=clamp(p*5);ctx.translate(x,y);ctx.rotate(angle);ctx.drawImage(sprite.canvas,-sprite.width/2,-sprite.height/2,sprite.width,sprite.height);ctx.restore();
  }
  let ballSprite=null;
  function drawBall(t){
    if(!ballSprite){
      ballSprite=document.createElement('canvas');ballSprite.width=236;ballSprite.height=260;const ink=paintContext(ballSprite.getContext('2d'),options.colors);ink.setTransform(2,0,0,2,118,112);
      const shade=ink.createRadialGradient(-15,-19,2,3,8,45);shade.addColorStop(0,'#ffb198');shade.addColorStop(.5,'#ef7256');shade.addColorStop(1,'#c84e3c');
      ink.shadowColor='#24365320';ink.shadowBlur=17;ink.shadowOffsetY=10;ink.fillStyle=shade;ink.beginPath();ink.arc(0,0,37,0,Math.PI*2);ink.fill();
    }
    const ball=ballState(t,objectGain);ctx.save();ctx.translate(ball.x,ball.y);ctx.scale(1+ball.squash*.2,1-ball.squash*.17);ctx.drawImage(ballSprite,-59,-56,118,130);ctx.restore();
  }
  function stickers(t){
    background('#f0e9dd');
    const phrases=[[(options.phrases??[])[0]??'HEY!',155,120,76,-.13,'#ef7256',640],[(options.phrases??[])[1]??'WAIT',648,140,68,.10,'#243653',610],[(options.phrases??[])[2]??'YES',150,322,77,-.10,'#243653',640],[(options.phrases??[])[3]??"LET'S GO",516,370,86,.035,'#ef7256',660]];
    phrases.forEach((p,i)=>{
      const flight=stickerFlight(t,i,p);if(flight.alpha<.00001)return;
      ctx.save();ctx.translate(flight.x,flight.y);ctx.scale(flight.scale,flight.scale);ctx.globalAlpha=flight.alpha;sticker(p[0],0,0,p[3],flight.angle,1,p[5],p[6]);ctx.restore();
    });
    drawBall(t);
  }
  const wall=document.createElement('canvas');wall.width=1200;wall.height=760;
  const wc=wall.getContext('2d');
  function prepareWall(){
    wc.fillStyle='#c03f32';wc.font='550 370px SixType';wc.textAlign='center';wc.textBaseline='alphabetic';
    const width=wc.measureText(options.text??'WANDER').width;wc.save();wc.translate(600,0);wc.scale(1100/width,1.62);wc.fillText(options.text??'WANDER',0,385);wc.restore();
  }
  function fold(t){
    background('#eee9de');const p=foldProgress(t)*objectGain,hinge=257,half=166,angle=p*1.04,width=540,left=130;
    const project=v=>{const depth=v*Math.sin(angle),scale=1200/(1200-depth);return {x:400-width*scale/2,y:hinge+v*Math.cos(angle)*scale,width:width*scale}};
    const bottom=project(half);
    // Both halves share the same hinge and the same text texture. No photo layer.
    ctx.save();ctx.shadowColor='#59493824';ctx.shadowBlur=24;ctx.shadowOffsetY=12;ctx.fillStyle='#faf6ed';ctx.beginPath();ctx.moveTo(left,hinge-half);ctx.lineTo(left+width,hinge-half);ctx.lineTo(left+width,hinge);ctx.lineTo(bottom.x+bottom.width,bottom.y);ctx.lineTo(bottom.x,bottom.y);ctx.lineTo(left,hinge);ctx.closePath();ctx.fill();ctx.restore();
    ctx.fillStyle='#faf6ed';ctx.fillRect(left,hinge-half,width,half);
    ctx.drawImage(wall,0,165,1200,235,left,hinge-half,width,half);
    const paperShade=ctx.createLinearGradient(0,hinge,0,bottom.y);paperShade.addColorStop(0,foldShade(p));paperShade.addColorStop(1,'#faf6ed');
    ctx.fillStyle=paperShade;ctx.beginPath();ctx.moveTo(left,hinge);ctx.lineTo(left+width,hinge);ctx.lineTo(bottom.x+bottom.width,bottom.y);ctx.lineTo(bottom.x,bottom.y);ctx.closePath();ctx.fill();
    for(let sy=400;sy<660;sy+=6){
      const q=(sy-400)/260,q2=(Math.min(660,sy+6)-400)/260,a=project(q*half),b=project(q2*half);
      ctx.drawImage(wall,0,sy,1200,Math.min(6,660-sy),a.x,a.y,a.width,Math.max(.2,b.y-a.y+.5));
    }
    const crease=ctx.createLinearGradient(0,hinge-2,0,hinge+16);crease.addColorStop(0,'rgba(64,46,29,0)');crease.addColorStop(.18,`rgba(64,46,29,${.11*p})`);crease.addColorStop(1,'rgba(64,46,29,0)');ctx.fillStyle=crease;ctx.fillRect(left,hinge-2,width,18);
  }

 const renderers={mix,ring,logo,mask,stickers,fold};
 if(selected==='fold')prepareWall();
 return {draw(time){ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,800,480);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.filter='none';ctx.lineWidth=1;ctx.setLineDash([]);renderers[selected](time);},dispose(){if(ringSculpture)ringSculpture.gl.getExtension('WEBGL_lose_context')?.loseContext();}};
}
