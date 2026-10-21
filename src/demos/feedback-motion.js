import {cue,clamp} from './motion.js';
// All cues are seconds, sampled only from the shared Remotion frame clock.
export function feedbackAt(t,key){
 const open=cue(t,.8,.65)*(1-cue(t,6.45,.65));
 const index=cue(t,1.4,.65)+cue(t,3.65,.65)-2*cue(t,6.45,.65);
 const progress=key==='check'?cue(t,.8,.55)-cue(t,2.9,.5)+cue(t,4.25,.55)-cue(t,6.45,.55):key==='range'?.15+.7*cue(t,.85,1.65)-.45*cue(t,3.65,1.2)-.25*cue(t,6.3,.85):key==='upload'?cue(t,1.15,3.7)*(1-cue(t,6.65,.6)):open;
 return {progress:clamp(progress),index:clamp(index,0,2),open};
}
export const feedbackBump=q=>1+.045*Math.sin(Math.PI*q);
