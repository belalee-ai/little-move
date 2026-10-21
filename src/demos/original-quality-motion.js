// Deterministic geometry for original dictionary samples. Seconds come from Remotion.
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,q)=>a+(b-a)*q;
export const soft=x=>{const q=clamp(x);return q*q*q*(q*(q*6-15)+10);};
export const cue=(t,a,d)=>soft((t-a)/d);
const bezier=(c,u)=>{const v=1-u;return{x:v*v*v*c[0]+3*v*v*u*c[2]+3*v*u*u*c[4]+u*u*u*c[6],y:v*v*v*c[1]+3*v*v*u*c[3]+3*v*u*u*c[5]+u*u*u*c[7]};};
const curves=[[100,310,190,85,260,400,390,230],[390,230,520,60,610,110,700,280]];
const samples=curves.flatMap((c,i)=>Array.from({length:241},(_,j)=>({...bezier(c,j/240),segment:i,u:j/240})).slice(i?1:0));let total=0;
export const penSamples=samples.map((p,i)=>{if(i)total+=Math.hypot(p.x-samples[i-1].x,p.y-samples[i-1].y);return {...p,length:total};});
export const penLength=total;
export function penAt(q){const length=clamp(q)*total,i=penSamples.findIndex(p=>p.length>=length);if(i<=0)return penSamples[0];const a=penSamples[i-1],b=penSamples[i],f=(length-a.length)/(b.length-a.length||1);return{x:mix(a.x,b.x,f),y:mix(a.y,b.y,f)};}
export function sandAt(t,i,count=72){const cycle=Math.floor(t/4),local=t%4,odd=cycle%2===1,start=.16+i/count*2.35,u=clamp((local-start)/.55),row=Math.floor(i/9),col=i%9,spread=(col-4)*12*(1-row*.085),upper={x:400+spread,y:117+row*11},lower={x:400+spread,y:391-row*10},a=odd?lower:upper,b=odd?upper:lower,k=cue(u,0,.5),j=cue(u,.5,.5);return{x:u<.5?mix(a.x,400,k):mix(400,b.x,j),y:u<.5?mix(a.y,250,k):mix(250,b.y,j),moving:u>0&&u<1,rotation:180*cue(t,3.2,.8)+180*cue(t,7.2,.8)};}
/** @param {number[]} values @param {number} t */
export function histogramAt(values,t){const unit=Math.max(1,Math.max(...values)/20);return values.map((n,bin)=>{const dots=Array.from({length:Math.ceil(n/unit)},(_,j)=>{const weight=Math.min(unit,n-j*unit),start=.35+bin*.12+j*.033,fall=cue(t,start,.95),arrive=cue(t,start+.68,.27);return{weight,fall,arrive,j};});return{dots,count:dots.reduce((s,d)=>s+d.weight*d.arrive,0)};});}
export function clipFold(points,cut,front=true){const out=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],va=a[0]+a[1]-cut,vb=b[0]+b[1]-cut,ia=front?va<=0:va>=0,ib=front?vb<=0:vb>=0;if(ia)out.push(a);if(ia!==ib){const k=va/(va-vb);out.push([mix(a[0],b[0],k),mix(a[1],b[1],k)]);}}return out;}
