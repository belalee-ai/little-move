// Original glyph metrics, positions, angles, delays and spring curves retained.
export function createLayoutRenderer(root,options={}){
 const layer=root.querySelector('[data-letter-layer]');
  const ns='http://www.w3.org/2000/svg',chars=Array.from((options.text??'STAYWILD').padEnd(8,' ').slice(0,8));
  const glyphs=chars.map(c=>{
    const group=document.createElementNS(ns,'g'),text=document.createElementNS(ns,'text');
    text.textContent=c;text.setAttribute('class','glyph');group.append(text);layer.append(group);return {group,text,width:0};
  });
  const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
  const clamp=v=>Math.max(0,Math.min(1,v));
  function settle(v){if(v<=0)return 0;if(v>=1)return 1;return 1-Math.exp(-8*v)*(Math.cos(11*v)+.25*Math.sin(11*v))}
  let layouts=[];
  function makeRow(sizes,ys,angles,gap,wordGap){
    const widths=glyphs.map((g,i)=>g.width*sizes[i]/100);
    const total=widths.reduce((a,b)=>a+b,0)+gap*6+wordGap;
    let left=(800-total)/2;
    return sizes.map((size,i)=>{const o={x:left+widths[i]/2,y:ys[i],size,angle:angles[i]};left+=widths[i]+(i===3?wordGap:gap);return o});
  }
  function draw(t){
    let a=0,b=0,start=0,duration=1,label='横排';
    if(t>=.85&&t<2.4){a=0;b=1;start=.85;duration=.98;label=t<2?'弧线错拍 → 竖排':'竖排'}
    else if(t>=2.4&&t<4){a=1;b=2;start=2.4;duration=.95;label=t<3.5?'逐字展开 → 两行':'两行'}
    else if(t>=4&&t<6.5){a=2;b=3;start=4;duration=1.12;label=t<5.35?'大小与角度错拍':'大小 · 高低 · 角度'}
    else if(t>=6.5){a=3;b=0;start=6.5;duration=1.12;label='依次收回 → 横排'}
    glyphs.forEach((g,i)=>{
      const from=layouts[a][i],to=layouts[b][i],order=b===0?7-i:i;
      const local=(t-start-order*.032)/duration,p=a===b?0:settle(local),r=a===b?0:settle(local-.045);
      const arc=a===b?0:Math.sin(Math.PI*clamp(local))*Math.min(54,Math.hypot(to.x-from.x,to.y-from.y)*.15)*(i%2?1:-1);
      const x=from.x+(to.x-from.x)*p+arc*.48,y=from.y+(to.y-from.y)*p-arc;
      const angle=from.angle+(to.angle-from.angle)*r+Math.sin(Math.PI*clamp(local))*((i%2?1:-1)*13);
      const size=from.size+(to.size-from.size)*p,stretch=1+.07*Math.sin(Math.PI*clamp(local));
      g.group.setAttribute('transform',`translate(${x} ${y}) rotate(${angle}) scale(${size/100*stretch} ${size/100/stretch})`);
    });
  }

    glyphs.forEach(g=>{const b=g.text.getBBox();g.width=b.width;g.text.setAttribute('transform',`translate(${-b.x-b.width/2} ${-b.y-b.height/2})`)});
    const horizontal=makeRow(Array(8).fill(89),Array(8).fill(260),Array(8).fill(0),8,29);
    const vertical=glyphs.map((_,i)=>({x:400,y:65+i*56,size:47,angle:0}));
    const grid=glyphs.map((_,i)=>({x:205+(i%4)*130,y:i<4?180:340,size:130,angle:0}));
    const expressive=makeRow([91,117,82,103,132,84,101,119],[270,251,278,263,249,280,270,264],[-7,4,-5,5,-4,6,-3,5],7,26);
    layouts=[horizontal,vertical,grid,expressive];
 return {draw,dispose(){layer.replaceChildren();}};
}
