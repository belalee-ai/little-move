import {exampleAmplitude} from '../demos/voice-motion.js';
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,q)=>a+(b-a)*q;
export const ease=x=>{const t=clamp(x);return t*t*t*(t*(t*6-15)+10);};
export const cue=(t,start,d=.6)=>ease((t-start)/d);
export const windowAt=(t,a=.8,b=6,d=.6)=>cue(t,a,d)*(1-cue(t,b,d));
export const levelAt=(t,strength=1)=>clamp(exampleAmplitude(((t%8)+8)%8)*clamp(strength,.5,1.5));
export const barsAt=(t,n=35,strength=1,active=1)=>Array.from({length:n},(_,i)=>5+active*levelAt(t-.18+i/n*.18,strength)*(22+62*Math.exp(-Math.pow((i/(n-1)-.5)*2,2)*1.8))*(.65+.35*Math.sin(i*1.9-t*4)**2));
export function settle(from,to,velocity,seconds){const w=15,delta=from-to;return to+(delta+(velocity+w*delta)*seconds)*Math.exp(-w*seconds);}
export const projectWheel=(index,velocity)=>clamp(Math.round(index+clamp(velocity,-20,20)*.14),0,10);
export const swipeTarget=x=>x<-.23?1:0;
export const refreshRelease=pull=>pull>=1;
export function uiAuto(kind,t){
 const q=windowAt(t),presence=cue(t,.05,.35)*(1-cue(t,7.3,.6));
 const state=kind==='voice-orb'?(t<2.5?1:t<3.5?2:t<6.5?3:0):kind==='memo-panel'?(t<.7?0:t<2.8?1:t<3.8?2:t<5.4?1:3):kind==='push-talk'?(t<1?0:t<4.8?1:t<6.5?2:0):kind==='call-mute'?(t<2?0:t<4?1:t<6.3?0:2):kind==='voice-message'?(t<1?0:t<3?1:t<3.8?0:t<6.5?1:0):q>.5?1:0;
 const playTime=Math.max(0,Math.min(t,3)-1)+Math.max(0,Math.min(t,6.5)-3.8);
 return{q,presence,state,level:levelAt(t),progress:clamp(playTime/6),index:2+4*cue(t,1,1.6)-3*cue(t,4.2,1.5),volume:.2+.64*cue(t,.9,1.8)-.45*cue(t,4.3,1.7),pull:1.35*cue(t,.8,1.3)*(1-cue(t,2.4,.5)),refreshing:t>=2.4&&t<4,updated:t>=4,query:t>1.4&&t<6?'voice'.slice(0,Math.floor(cue(t,1.4,1.7)*5)):''};
}

export function settleSample(state,clock,reduced=false){
 if(reduced)return{value:state.to,velocity:0};
 if(state.direct)return{value:state.to,velocity:clock-state.time<.09?state.velocity:0};
 const t=Math.max(0,clock-state.time),w=15,d=state.from-state.to,b=state.velocity+w*d,e=Math.exp(-w*t);
 return{value:state.to+(d+b*t)*e,velocity:(state.velocity-w*b*t)*e};
}
