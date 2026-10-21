// A small photo puppet, not a replacement for live-action footage. All poses and
// contact points use the same frame-derived time; no independent animation clock.
const W=1086,H=1448,PAD=96;
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
export const gestureWindow=(t,start,rise,hold,fall)=>smooth((t-start)/rise)*(1-smooth((t-start-rise-hold)/fall));
export const PORTRAIT_BEATS=[.48,1.38,2.32,3.23];
const pulse=(t,start,duration)=>{const u=(t-start)/duration;return u>0&&u<1?Math.sin(u*Math.PI)**2:0};
export function portraitPose(key,t,gain=1){
 const breathe=Math.sin(t*Math.PI*2/6),tug=gestureWindow(t,.8,.75,.7,.9),tap=gestureWindow(t,3.2,.36,.08,.65);
 let lean=0,upper=0,fore=0,left=0,leftFore=0,nod=0;
 if(key==='mask'){
  lean=-.045*tug+.018*tap;upper=.15*tug;fore=-.34*tug+.12*tap;
  left=-.07*tug;leftFore=.24*tug;nod=.028*tug;
 }else if(key==='stickers'){
  PORTRAIT_BEATS.forEach((beat,i)=>{
   const prep=pulse(t,beat-.23,.28),hit=pulse(t,beat,.52),settle=pulse(t,beat+.22,.65);
   if(i===1){upper+=-.11*prep+.16*hit;fore+=.18*prep-.38*hit+.08*settle;lean-=.024*hit}
   else{left+=.06*prep-.13*hit;leftFore+=-.17*prep+.36*hit-.09*settle;lean+=.020*hit}
   nod+=.025*hit;
  });
 }else if(key==='fold'){
  const pull=gestureWindow(t,.6,1.05,1.25,1.45);
  lean=-.045*pull;upper=-.095*pull;fore=.27*pull;leftFore=.08*pull;nod=.033*pull;
 }
 return {lean:(lean+.008*breathe)*gain,upper:upper*gain,fore:fore*gain,left:left*gain,leftFore:leftFore*gain,nod:nod*gain,lift:1.8*breathe*gain,tug,tap};
}
const rotate=(p,c,a)=>{const x=p[0]-c[0],y=p[1]-c[1],co=Math.cos(a),si=Math.sin(a);return [c[0]+x*co-y*si,c[1]+x*si+y*co]};
const blend=(a,b,w)=>[a[0]+(b[0]-a[0])*w,a[1]+(b[1]-a[1])*w];
// Weights blend only around joints. Forearms and hands retain their shapes.
export function portraitWeights(x,y){
 return {right:smooth((x-695)/125)*(1-smooth((y-565)/100)),fore:1-smooth((y-358)/150),
  left:(1-smooth((x-(338-160*smooth((y-850)/220)))/90))*smooth((y-688)/112)*(1-smooth((y-1110)/90)),leftFore:smooth((y-827)/100),
  head:(1-smooth((y-414)/118))*(1-smooth((x-685)/100)),torso:1-smooth((y-850)/340)};
}
export function deformPortraitPoint(x,y,pose,w=portraitWeights(x,y)){
 let p=[x,y];
 if(w.right){p=blend(p,rotate(rotate(p,[1000,477],pose.fore*w.fore),[770,508],pose.upper),w.right)}
 if(w.left){p=blend(p,rotate(rotate(p,[333,867],pose.leftFore*w.leftFore),[314,664],pose.left),w.left)}
 if(w.head)p=blend(p,rotate(p,[493,466],pose.nod),w.head);
 p=blend(p,rotate(p,[568,965],pose.lean),w.torso);p[1]+=pose.lift*w.torso;
 return p;
}
export const PORTRAIT_CONTACTS={raised:[936,42],open:[96,1060],face:[516,307]};
export function portraitContact(name,pose,placement,rigged=true){
 const source=PORTRAIT_CONTACTS[name],p=rigged?deformPortraitPoint(...source,pose):source;
 const scale=placement.height/H;
 return {x:placement.x-W*scale/2+p[0]*scale,y:placement.bottom-placement.height+p[1]*scale};
}

export function createPortraitRig(image){
 const surface=document.createElement('canvas');surface.width=916;surface.height=1181;
 const gl=surface.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,preserveDrawingBuffer:true});
 if(!gl)return null;
 const shader=(type,source)=>{const q=gl.createShader(type);gl.shaderSource(q,source);gl.compileShader(q);if(!gl.getShaderParameter(q,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(q));return q};
 const program=gl.createProgram();
 gl.attachShader(program,shader(gl.VERTEX_SHADER,`attribute vec2 position;attribute vec2 uv;varying vec2 texCoord;void main(){texCoord=uv;gl_Position=vec4(position,0.,1.);}`));
 gl.attachShader(program,shader(gl.FRAGMENT_SHADER,`precision mediump float;uniform sampler2D photo;varying vec2 texCoord;void main(){gl_FragColor=texture2D(photo,texCoord);}`));
 gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const cols=48,rows=64,vertices=[],uv=[],indices=[];
 for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const x=i/cols*W,y=j/rows*H;vertices.push({x,y,weights:portraitWeights(x,y)});uv.push(i/cols,j/rows)}
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const k=j*(cols+1)+i;indices.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1)}
 const positions=new Float32Array(vertices.length*2),positionBuffer=gl.createBuffer(),uvBuffer=gl.createBuffer(),indexBuffer=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferData(gl.ARRAY_BUFFER,positions,gl.DYNAMIC_DRAW);
 const positionLocation=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(positionLocation);gl.vertexAttribPointer(positionLocation,2,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ARRAY_BUFFER,uvBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(uv),gl.STATIC_DRAW);
 const uvLocation=gl.getAttribLocation(program,'uv');gl.enableVertexAttribArray(uvLocation);gl.vertexAttribPointer(uvLocation,2,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 gl.clearColor(0,0,0,0);
 return {
  draw(ctx,pose,{x,bottom,height}){
   vertices.forEach((v,i)=>{const p=deformPortraitPoint(v.x,v.y,pose,v.weights);positions[2*i]=(p[0]+PAD)/(W+PAD*2)*2-1;positions[2*i+1]=1-(p[1]+PAD)/(H+PAD*2)*2});
   gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,positions);
   gl.viewport(0,0,surface.width,surface.height);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0);
   const s=height/H;ctx.drawImage(surface,x-W*s/2-PAD*s,bottom-height-PAD*s,(W+PAD*2)*s,(H+PAD*2)*s);
  },
  dispose(){gl.deleteBuffer(positionBuffer);gl.deleteBuffer(uvBuffer);gl.deleteBuffer(indexBuffer);gl.deleteTexture(texture);gl.deleteProgram(program);gl.getExtension('WEBGL_lose_context')?.loseContext();}
 };
}
