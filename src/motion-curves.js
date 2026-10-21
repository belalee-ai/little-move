// Deterministic curves shared by preview and rendering. Tangents belong to
// knots, so adjoining path segments always meet with the same velocity.
export const unit=v=>Math.max(0,Math.min(1,v));
export const softStep=v=>{const p=unit(v);return p*p*p*(p*(p*6-15)+10)};
export function hermite(a,b,va,vb,p,duration=1){
 const q=unit(p),q2=q*q,q3=q2*q;
 return (2*q3-3*q2+1)*a+(q3-2*q2+q)*va*duration+(-2*q3+3*q2)*b+(q3-q2)*vb*duration;
}
export function pathAt(knots,time,loop=false){
 const last=knots.length-1,duration=knots[last][0]-knots[0][0];
 const t=loop?((time-knots[0][0])%duration+duration)%duration+knots[0][0]:Math.max(knots[0][0],Math.min(knots[last][0],time));
 let i=0;while(i<last-1&&t>knots[i+1][0])i++;
 const tangent=(k,axis)=>{
  if(k===0||k===last){if(!loop)return 0;return (knots[1][axis]-knots[last-1][axis])/(knots[1][0]-(knots[last-1][0]-duration))}
  return (knots[k+1][axis]-knots[k-1][axis])/(knots[k+1][0]-knots[k-1][0]);
 };
 const a=knots[i],b=knots[i+1],span=b[0]-a[0],u=(t-a[0])/span;
 return a.slice(1).map((value,j)=>hermite(value,b[j+1],tangent(i,j+1),tangent(i+1,j+1),u,span));
}
