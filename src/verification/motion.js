// Independent UI demonstration; no challenge service, token or security decision.
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const mix=(a,b,p)=>a+(b-a)*p;
export const ease=n=>{const p=clamp(n);return p*p*p*(p*(p*6-15)+10);};
const cue=(t,a,d)=>ease((t-a)/d);
/** @type {Record<string,{x:number,y:number}>} */
export const VERIFY_TARGETS={'captcha-slide':{x:.72,y:.5},'captcha-rotate':{x:2/3,y:.5},'captcha-drag':{x:.74,y:.33}};
export const VERIFY_SPOTS=[{x:.24,y:.29,shape:0},{x:.77,y:.38,shape:1},{x:.48,y:.73,shape:2},{x:.57,y:.22,shape:3},{x:.19,y:.76,shape:4},{x:.81,y:.79,shape:5}];
export function verifyPosition(kind,pos,tolerance=1){const k=clamp(tolerance,.6,1.8);return kind==='captcha-rotate'?Math.abs(pos.x-2/3)<=.028*k:kind==='captcha-slide'?Math.abs(pos.x-.72)<=.025*k:kind==='captcha-drag'?Math.hypot((pos.x-.74)*450,(pos.y-.33)*240)<=16*k:false;}
export function nextSelection(marks,spot){if(marks.includes(spot))return{marks,status:'idle',wrong:-1};if(spot!==marks.length)return{marks,status:'error',wrong:spot};const next=[...marks,spot];return{marks:next,status:next.length===3?'success':'idle',wrong:-1};}
export function verificationAuto(kind,t){
 const fade=cue(t,.08,.42)*(1-cue(t,7.15,.7));
 if(kind==='captcha-order'){const marks=t<2.35?[]:t<3.15?[0]:t<4.05?[0,1]:[0,1,2],status=t>=1.05&&t<1.9?'error':t>=4.35?'success':'idle';return{pos:{x:0,y:0},marks,status,wrong:status==='error'?2:-1,flash:status==='error'?Math.sin((t-1.05)*28)*Math.exp(-(t-1.05)*7):0,fade};}
 const target=VERIFY_TARGETS[kind],start=kind==='captcha-drag'?{x:.16,y:.75}:{x:0,y:.5},wrong=kind==='captcha-drag'?{x:.57,y:.58}:{x:.39,y:.5};
 const a=cue(t,.65,.85)*(1-cue(t,1.9,.7)),b=cue(t,2.7,1.65),status=t>=1.6&&t<2.45?'error':t>=4.55?'success':'idle';
 return{pos:{x:mix(mix(start.x,wrong.x,a),target.x,b),y:mix(mix(start.y,wrong.y,a),target.y,b)},marks:[],status,wrong:-1,flash:status==='error'?Math.sin((t-1.6)*28)*Math.exp(-(t-1.6)*7):0,fade};
}
