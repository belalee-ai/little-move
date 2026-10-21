export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,t)=>a+(b-a)*t;
export const ease=x=>{const t=clamp(x);return t*t*t*(t*(t*6-15)+10);};
export const cue=(t,start=.5,duration=1)=>ease((t-start)/duration);
export const windowAt=(t,a=.65,b=5.75,d=.95)=>cue(t,a,d)*(1-cue(t,b,d));
export const round=(v,n=1)=>Number(v.toFixed(n));
export const dataValues=p=>{const v=String(p.dataValues??'24,56,38,82,67,45').split(/[,，\s]+/).map(Number).filter(Number.isFinite).map(v=>clamp(v,0,9999));return v.length?v.slice(0,12):[24,56,38,82,67,45];};
export const path=points=>points.map(([x,y],i)=>(i?'L':'M')+round(x,2)+' '+round(y,2)).join(' ');
export const wrap=(n,m)=>((n%m)+m)%m;
export const typeProgress=(t,n)=>Math.floor(n*cue(t,.55,2.4));
export const rangeTime=(x,duration=8)=>round(clamp(x)*duration,1);
export function stableRank(values){return values.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v||a.i-b.i).reduce((a,v,i)=>(a[v.i]=i,a),[]);}
export function coveragePhase(t){return windowAt(t);}

// Deterministic secondary motion: zero position and velocity at both ends.
export const arc=(p,height=1)=>Math.sin(Math.PI*clamp(p))*height;
export const lift=(p,height=1)=>16*p*p*(1-p)*(1-p)*height;
export const settleAt=(t,start=.5,duration=1,bounce=.1)=>{
 const x=clamp((t-start)/duration);
 return ease(x)+bounce*Math.sin(x*Math.PI*3)*Math.sin(x*Math.PI)**2;
};
export const staged=(t,start=.5,end=5.8,duration=1,bounce=.06)=>settleAt(t,start,duration,bounce)*(1-settleAt(t,end,duration*.85,bounce*.5));
export const smoothPulse=(t,start,duration=.6)=>{const x=clamp((t-start)/duration);return Math.sin(Math.PI*x)**2;};
export function polyMorph(a,b,k){return a.map(([x,y],i)=>(i?'L':'M')+round(mix(x,b[i][0],k),3)+' '+round(mix(y,b[i][1],k),3)).join(' ')+'Z';}
export function rankRoute(i,target,k){return{x:mix(170,620,k),y:mix(100+i*58,100+target*58,k)};}
export function criticalSample(state,clock,reduced=false){
 if(reduced)return {value:state.to,velocity:0};
 if(state.direct)return {value:state.to,velocity:clock-state.time<.09?state.velocity:0};
 const seconds=Math.max(0,clock-state.time),w=19,delta=state.from-state.to,b=state.velocity+w*delta,e=Math.exp(-w*seconds);
 return {value:state.to+(delta+b*seconds)*e,velocity:(state.velocity-w*b*seconds)*e};
}
export function gestureAt(mode,t){
 const a=cue(t,.6,2.15),b=cue(t,3.3,.65),reset=cue(t,6.2,.8);
 let x=.5,y=.5,held=t>.6&&t<3.3,complete=false;
 if(mode==='freedrag'){x=.5+.23*a;y=.5-.18*a-.04*Math.sin(Math.PI*a);if(t>=3.3){const s=criticalSample({from:.73,to:.5,velocity:.12,time:3.3,direct:false},t);x=s.value;y=criticalSample({from:.32,to:.5,velocity:0,time:3.3,direct:false},t).value;}}
 else if(mode==='dropbasket'){x=mix(.25,.7,a)+.07*b;y=.5-.12*Math.sin(Math.PI*a);complete=t>=3.3&&t<6.3;x=mix(x,.25,reset);}
 else if(mode==='scrubtrack'){x=.5+.31*a-.52*cue(t,3.8,1.5);held=t>.6&&t<5.4;if(t>=5.4)x=mix(x,.25,cue(t,5.4,.45));}
 else if(mode==='rotary'){x=.2+.65*a-.38*cue(t,4.1,1.4);y=1-x;}
 else if(mode==='stretch'){x=.5+.36*a*(1-b);held=t>.6&&t<3.3;}
 else if(mode==='brush'){x=.25+.5*a-.22*cue(t,4.5,1.1);}
 else{x=.5+Math.sin(t*.9)*.29;y=.5+Math.cos(t*.7)*.2;}
 return {x,y,held,complete};
}
// Open a cut ring by reducing curvature, preserving one continuous band.
export function unrollStrip(from,to,k){
 const q=clamp(k),angle=2*Math.PI*(1-q),length=mix(2*Math.PI*118,570,q),half=mix(24,36,q),points=[];
 for(const side of[0,1])for(let j=0;j<=24;j++){
  const u=mix(from,to,side?1-j/24:j/24),normal=side?-1:1;
  if(angle<.00001){points.push([115+u*570,245+normal*half]);continue;}
  const a=(u-.5)*angle,r=length/angle,center=(1+Math.cos(angle/2))/2;
  points.push([400+Math.sin(a)*(r+normal*half),245+r*(Math.cos(a)-center)+normal*half*Math.cos(a)]);
 }
 return points;
}
