import {softStep,pathAt} from '../motion-curves.js';
export const stickerBeats=[.68,1.58,2.48,3.38];
export const ballStops=[[400,240],[276,137],[512,155],[267,309],[456,292],[400,240]];
const ballKnots=[[0,...ballStops[0]],...stickerBeats.map((t,i)=>[t,...ballStops[i+1]]),[6,...ballStops[5]]];
export function ballState(t,gain=1){
 const [x,y]=pathAt(ballKnots,t),hit=stickerBeats.reduce((sum,beat)=>sum+Math.exp(-Math.pow((t-beat-.035)/.115,2)),0);
 return {x,y,squash:Math.min(1,hit)*gain};
}
export function stickerFlight(t,i,target){
 const local=t-stickerBeats[i],contact=ballStops[i+1];
 if(local<=0)return {x:contact[0],y:contact[1],scale:.62,alpha:0,angle:target[4]+(i%2?.3:-.3)};
 const progress=1-Math.exp(-7.4*local)*(Math.cos(8.5*local)+(7.4/8.5)*Math.sin(8.5*local));
 const arc=44*Math.pow(local/.22,2)*Math.exp(2-2*local/.22),exit=softStep((t-4.65-i*.07)/.85);
 const x=contact[0]+(target[1]-contact[0])*progress,y=contact[1]+(target[2]-contact[1])*progress-arc;
 return {x:x+(400-x)*exit,y:y+(240-y)*exit,scale:(.62+.38*progress)*(1-.2*exit),alpha:softStep(local/.18)*(1-exit),angle:target[4]+(1-progress)*(i%2?.3:-.3)};
}
export const foldProgress=t=>softStep((t-.55)/1.2)*(1-softStep((t-2.85)/1.5));
export function foldShade(p){const u=Math.max(0,Math.min(1,p));return `rgb(${[244,239,229].map((v,i)=>Math.round(v+([216,208,194][i]-v)*u)).join(',')})`}
export function ribbonGeometry(t,gain=1){
 const phase=t*Math.PI/3,tilt=.10*Math.sin(phase),points=[];
 for(let i=0;i<=180;i++){
  const q=i/180,x=-65+930*q,a=q*Math.PI*2-phase,twist=Math.cos(a*1.5+phase*.5);
  points.push({x,y:244+68*Math.sin(a)*gain+(x-400)*tilt,half:8+17*Math.sqrt(.018+twist*twist),z:Math.cos(a)});
 }
 return points;
}
export function ribbonRuns(points,front){
 const runs=[];let run=[];
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],aFront=a.z>=0,bFront=b.z>=0;
  if(aFront===front&&!run.length)run.push(a);
  if(aFront===bFront){if(aFront===front)run.push(b);continue}
  const q=a.z/(a.z-b.z),cross={x:a.x+(b.x-a.x)*q,y:a.y+(b.y-a.y)*q,half:a.half+(b.half-a.half)*q,z:0};
  if(aFront===front){run.push(cross);runs.push(run);run=[]}else run=[cross,b];
 }
 if(run.length>1)runs.push(run);return runs;
}
