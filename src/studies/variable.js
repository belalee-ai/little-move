// Preserved from the approved Type Motion Lab (2026-10-15); time is supplied by Remotion.
export function createVariableRenderer(root,options={}){
 const word=root.querySelector('[data-word]'),position=root.querySelector('[data-position]');
  const clamp=v=>Math.max(0,Math.min(1,v));
  const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
  const mix=(a,b,v)=>a+(b-a)*ease(v);
  const letters=[];let current='';
  function setWord(str){if(current===str)return;current=str;word.textContent='';letters.length=0;for(const ch of str){const span=document.createElementNS('http://www.w3.org/2000/svg','tspan');span.textContent=ch;word.append(span);letters.push(span)}}
  function settle(v){if(v<=0)return 0;if(v>=1)return 1;return 1-Math.exp(-8*v)*(Math.cos(12*v)+.3*Math.sin(12*v))}
  function draw(t){
    const index=Math.min(2,Math.floor(t/2.2)),local=t-index*2.2,str=(options.words??['Breathe','Lean','Play'])[index];setWord(str);
    const enter=settle(local/.62),leave=ease((local-1.91)/.29),travel=1-enter;
    letters.forEach((span,i)=>{
      const delay=i*.055,wave=.5-.5*Math.cos(Math.PI*2*clamp((local-.15-delay)/1.65));
      const arrival=settle((local-i*.027)/.55);
      const wght=index===0?180+340*wave:index===1?440:310+210*wave;
      const slnt=index===1?-10*wave:index===2?-7*wave:0;
      span.style.fontVariationSettings=`"wght" ${wght},"slnt" ${slnt},"opsz" ${36+100*wave},"wdth" ${92+10*wave},"XOPQ" ${78+(index===2?16:6)*wave},"YOPQ" ${79-(index===2?24:0)*wave},"XTRA" ${468+18*wave}`;
      span.setAttribute('dy',i===0?'0':String((Math.sin((i-1)*.7-local*5)-Math.sin(i*.7-local*5))*3*Math.sin(Math.PI*clamp(local/2.2))));
      span.style.opacity=clamp(arrival*3)*(1-leave);
    });
    const bb=word.getBBox(),scale=1-travel*.10+Math.sin(local*11)*Math.exp(-local*7)*.025;
    position.setAttribute('transform',`translate(${400-bb.x-bb.width/2} ${232-bb.y-bb.height/2+travel*48-leave*43}) translate(${bb.x+bb.width/2} ${bb.y+bb.height/2}) scale(${scale} ${1+travel*.13}) translate(${-bb.x-bb.width/2} ${-bb.y-bb.height/2})`);
  }

 return {draw,dispose(){word.replaceChildren();}};
}
