// Pure amplitude envelopes: shared by preview, timeline seeking and Remotion rendering.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const VOICE_SAMPLE_RATE=50;
export function voiceDuration(p){return Number.isFinite(p.audioDuration)?clamp(p.audioDuration,.5,120):8;}
export function exampleAmplitude(t){
 if(t<0||t>8)return 0;
 const syllables=[[.52,.44],[.83,.8],[1.08,.6],[1.43,.95],[1.77,.52],[2.12,.8],[2.46,.63],[3.48,.48],[3.8,.9],[4.16,.67],[4.48,.98],[4.82,.56],[5.18,.78],[6.24,.65],[6.55,.95],[6.88,.55],[7.16,.79]];
 return clamp(syllables.reduce((a,[center,gain])=>a+gain*Math.exp(-Math.pow((t-center)/.095,2)/2),0));
}
export function voiceAmplitude(p,t){
 const duration=voiceDuration(p),samples=p.audioEnvelope;
 if(t<0||t>duration)return 0;
 if(!Array.isArray(samples)||!samples.length)return exampleAmplitude(t);
 const pos=t/duration*(samples.length-1),i=Math.floor(pos),f=pos-i;
 const a=Number.isFinite(samples[i])?clamp(samples[i]):0,b=Number.isFinite(samples[Math.min(i+1,samples.length-1)])?clamp(samples[Math.min(i+1,samples.length-1)]):0;
 return a+(b-a)*f;
}
export function voiceAt(p,frame,fps=60){
 const duration=voiceDuration(p),time=clamp(frame/fps*clamp(p.speed??1,.5,2),0,duration),strength=clamp(p.strength??1,.5,1.5),level=voiceAmplitude(p,time);
 const bars=Array.from({length:65},(_,i)=>{
  const position=i/64,distance=Math.abs(position-.5)*2;
  // Small offsets preserve consonant / syllable pulses and a gently travelling contour.
  const amplitude=voiceAmplitude(p,time-.18+position*.18);
  const detail=.72+.28*Math.sin(i*1.91-time*8)**2;
  const height=6+Math.min(170,amplitude*(64+102*Math.exp(-distance*distance*2.4))*detail*strength);
  return {x:112+i*9,height};
 });
 const timeline=Array.from({length:65},(_,i)=>{
  const start=i/65*duration,end=(i+1)/65*duration;
  let peak=0;for(let n=0;n<6;n++)peak=Math.max(peak,voiceAmplitude(p,start+(end-start)*n/5));
  return {x:112+i*9,height:6+Math.min(170,peak*145*strength)};
 });
 return {time,duration,progress:time/duration,level,bars,timeline};
}
// Decode analysis is performed once on selection; animation never reads a live clock.
export function analyzeVoiceChannels(channels,sampleRate){
 if(!channels.length||!channels[0].length||!Number.isFinite(sampleRate)||sampleRate<=0)throw Error('音频没有可分析的采样。');
 const length=channels[0].length,duration=length/sampleRate;
 if(duration<.5||duration>120)throw Error('请选择0.5秒至2分钟的音频。');
 const bins=Math.ceil(duration*VOICE_SAMPLE_RATE),hop=Math.ceil(length/bins),rms=[];
 for(let bin=0;bin<bins;bin++){
  let energy=0,count=0;
  for(let c=0;c<channels.length;c++)for(let n=bin*hop;n<Math.min((bin+1)*hop,length);n++){const v=channels[c][n]??0;energy+=v*v;count++;}
  rms.push(Math.sqrt(energy/Math.max(1,count)));
 }
 const sorted=rms.toSorted((a,b)=>a-b),reference=Math.max(.015,sorted[Math.floor((sorted.length-1)*.95)]);
 const envelope=rms.map(v=>v<.002?0:Math.round(clamp(v/reference)*10000)/10000);
 return {duration,envelope};
}
export const voiceTimeLabel=seconds=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
