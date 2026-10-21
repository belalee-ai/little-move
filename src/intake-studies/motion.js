export const clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
export const mod = (n, d) => ((n % d) + d) % d;
const smooth = x => {const u=clamp(x);return clamp(u*u*u*(10+u*(-15+6*u)));};
const derivative = x => {const u=clamp(x);return 30*u*u*(1-u)*(1-u);};
export function autoScrollAt(t) {
  const segments=[[.6,2.2,0,.52],[2.8,4.1,.52,1],[4.7,6.9,1,0]];
  let position=0;
  for(const [start,end,from,to] of segments){
    if(t<start)break;
    if(t<=end){const u=(t-start)/(end-start);return {position:from+(to-from)*smooth(u),velocity:(to-from)*derivative(u)/(end-start)};}
    position=to;
  }
  return {position,velocity:0};
}
// Position and velocity are retained when a moving spring is retargeted.
export function springAt(command, frame, fps, period, reduced=false) {
  if(reduced)return {position:command.target,velocity:0};
  const t=mod(frame-command.frame,period)/fps;
  const a=command.from-command.target,b=command.velocity+9*a,e=Math.exp(-9*t);
  return {position:command.target+(a+b*t)*e,velocity:(b-9*(a+b*t))*e};
}
export function retarget(command, target, frame, fps, period, reduced=false) {
  const current=springAt(command,frame,fps,period,reduced);
  return {from:current.position,target,velocity:current.velocity,frame};
}
export function rest(value=0) {return {from:value,target:value,velocity:0,frame:0};}
export function scrollVisual(state, strength=1, reduced=false) {
  const v=reduced?0:state.velocity*clamp(strength,0,1.5);
  return {offset:clamp(state.position)*640,bow:clamp(v*58,-76,76),grain:Math.min(.16,Math.abs(v)*.14)};
}
export function autoMagnetAt(t) {
  const open=smooth((t-2.4)/1.15)*(1-smooth((t-5)/1.2));
  const hover=smooth((t-.4)/.65)*(1-smooth((t-1.9)/.5));
  return {open,selected:2,x:.5+Math.sin(t*1.4)*.31*hover,y:.5+Math.cos(t*1.8)*.25*hover,gain:hover};
}
export const gridHomes=[
  {x:68,y:62,w:186,h:148,angle:-4}, {x:307,y:87,w:186,h:148,angle:3}, {x:546,y:54,w:186,h:148,angle:-3},
  {x:74,y:284,w:186,h:148,angle:3}, {x:301,y:267,w:186,h:148,angle:-4}, {x:540,y:291,w:186,h:148,angle:4}
];
export function magnetPose(i,state,strength=1,reduced=false) {
  const home=gridHomes[i],q=clamp(state.open),selected=i===state.selected;
  const px=(state.x-.5)*800,py=(state.y-.5)*500;
  const distance=Math.hypot((home.x+home.w/2)-state.x*800,(home.y+home.h/2)-state.y*500);
  const pull=reduced?0:Math.exp(-distance*distance/100000)*state.gain*clamp(strength,0,1.5);
  const x=home.x+px*.08*pull,y=home.y+py*.08*pull-pull*18;
  if(selected)return {x:x+(116-x)*q,y:y+(64-y)*q,w:home.w+(568-home.w)*q,h:home.h+(356-home.h)*q,angle:(home.angle+px*.018*pull)*(1-q),rotateX:-py*.025*pull*(1-q),rotateY:px*.03*pull*(1-q),depth:pull*60*(1-q),opacity:1};
  const delay=Math.abs(i-state.selected)*.025,leave=smooth((q-delay)/(1-delay));
  const directionX=home.x+home.w/2<400?-1:1,directionY=home.y+home.h/2<250?-1:1;
  return {x:x+directionX*520*leave,y:y+directionY*280*leave,w:home.w,h:home.h,angle:home.angle+directionX*18*leave+px*.018*pull*(1-leave),rotateX:-py*.025*pull*(1-leave),rotateY:px*.03*pull*(1-leave),depth:pull*60*(1-leave)-220*leave,opacity:1-leave};
}
