import {paintContext} from './paint.js';
// Approved grid glyphs, custom curves, geometry and buffers retained verbatim.
export function createNineRenderer(canvas,assets,options={}){
 const c=paintContext(canvas.getContext('2d'),options.colors),key=options.key;
  const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)},out=v=>1-(1-clamp(v))**3;
  const lerp=(a,b,p)=>a+(b-a)*p;
  const ramp=v=>{v=clamp(v);return v*v*v*(v*(v*6-15)+10)};
  function settle(v){if(v<=0)return 0;if(v>=1)return 1;return 1-Math.exp(-8*v)*(Math.cos(11*v)+.26*Math.sin(11*v))}
  function bg(color){c.fillStyle=color;c.fillRect(0,0,800,560)}
  function font(size=60,family='NineFlex',weight=850){c.font=`${weight} ${size}px ${family}`;c.textAlign='center';c.textBaseline='middle'}
  function label(str,x,y,size=60,color='#202326',family='NineFlex',weight=850,max=0){
    c.save();font(size,family,weight);c.fillStyle=color;const w=c.measureText(str).width;
    c.translate(x,y);if(max&&w>max)c.scale(max/w,1);c.fillText(str,0,0);c.restore();
  }
  function clip(x,y,w,h){c.beginPath();c.rect(x,y,w,h);c.clip()}
  // Explicit grid glyphs: the staircase belongs to the outline, not a blur/pixel filter.
  const pixelLetters={
    A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],C:['01111','10000','10000','10000','10000','10000','01111'],D:['11110','10001','10001','10001','10001','10001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],F:['11111','10000','10000','11110','10000','10000','10000'],G:['01111','10000','10000','10111','10001','10001','01111'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['111','010','010','010','010','010','111'],J:['00111','00010','00010','00010','10010','10010','01100'],K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','11001','10101','10011','10001','10001','10001'],O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],Q:['01110','10001','10001','10001','10101','10010','01101'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],U:['10001','10001','10001','10001','10001','10001','01110'],V:['10001','10001','10001','10001','10001','01010','00100'],W:['10001','10001','10001','10101','10101','11011','10001'],X:['10001','10001','01010','00100','01010','10001','10001'],Y:['10001','10001','01010','00100','00100','00100','00100'],Z:['11111','00001','00010','00100','01000','10000','11111'],
    a:['00000','00000','01110','00001','01111','10001','01111'],b:['10000','10000','10110','11001','10001','10001','11110'],c:['00000','00000','01111','10000','10000','10000','01111'],d:['00001','00001','01101','10011','10001','10001','01111'],e:['00000','00000','01110','10001','11111','10000','01111'],f:['00110','01000','11100','01000','01000','01000','01000'],g:['00000','00000','01111','10001','10001','01111','00001','10001','01110'],h:['10000','10000','10110','11001','10001','10001','10001'],i:['1','0','1','1','1','1','1'],j:['001','000','001','001','001','001','001','101','010'],k:['10000','10000','10010','10100','11000','10100','10010'],l:['10','10','10','10','10','10','01'],m:['0000000','0000000','1110110','1001001','1001001','1001001','1001001'],n:['00000','00000','10110','11001','10001','10001','10001'],o:['00000','00000','01110','10001','10001','10001','01110'],p:['00000','00000','11110','10001','10001','11110','10000','10000','10000'],q:['00000','00000','01111','10001','10001','01111','00001','00001','00001'],r:['0000','0000','1011','1100','1000','1000','1000'],s:['00000','00000','01111','10000','01110','00001','11110'],t:['010','010','111','010','010','010','001'],u:['00000','00000','10001','10001','10001','10011','01101'],v:['00000','00000','10001','10001','10001','01010','00100'],w:['0000000','0000000','1001001','1001001','1001001','1001001','0110110'],x:['00000','00000','10001','01010','00100','01010','10001'],y:['00000','00000','10001','10001','10001','01111','00001','10001','01110'],z:['00000','00000','11111','00010','00100','01000','11111'],
    '0':['01110','10001','10011','10101','11001','10001','01110'],'1':['010','110','010','010','010','010','111'],'2':['01110','10001','00001','00010','00100','01000','11111'],'3':['11110','00001','00001','01110','00001','00001','11110'],'4':['00010','00110','01010','10010','11111','00010','00010'],'5':['11111','10000','10000','11110','00001','00001','11110'],'6':['01110','10000','10000','11110','10001','10001','01110'],'7':['11111','00001','00010','00100','01000','01000','01000'],'8':['01110','10001','10001','01110','10001','10001','01110'],'9':['01110','10001','10001','01111','00001','00001','01110'],'/':['00001','00010','00010','00100','01000','01000','10000'],'·':['0','0','0','1','0','0','0'],'.':['0','0','0','0','0','1','1'],'-':['000','000','000','111','000','000','000'],' ':['000','000','000','000','000','000','000']
  };
  function pixelMetrics(str){return Array.from(str,ch=>pixelLetters[ch]||pixelLetters[ch.toUpperCase()]||pixelLetters[' '])}
  function pixelLabel(str,x,y,height,color,max=0,outline=0,outlineColor=color){
    const glyphs=pixelMetrics(str),total=glyphs.reduce((v,g)=>v+g[0].length+1,0)-1,unit=height/7,w=total*unit,sx=max&&w>max?max/w:1;
    c.save();c.translate(x,y);c.scale(unit*sx,unit);c.translate(-total/2,-3.5);let xx=0;
    if(outline){c.fillStyle=outlineColor;glyphs.forEach(g=>{g.forEach((row,iy)=>Array.from(row).forEach((bit,ix)=>{if(bit==='1')c.fillRect(xx+ix-outline,iy-outline,1+outline*2,1+outline*2)}));xx+=g[0].length+1});xx=0}
    c.fillStyle=color;glyphs.forEach(g=>{g.forEach((row,iy)=>Array.from(row).forEach((bit,ix)=>{if(bit==='1')c.fillRect(xx+ix,iy,1.015,1.015)}));xx+=g[0].length+1});c.restore();
  }

  const stickers=[
    {word:(options.phrases??[])[0]??'ODDLY GOOD',face:'pixel',ink:'#fff387',edge:'#4135b4',ground:'#98df54',angle:-.025},
    {word:(options.phrases??[])[1]??'FRESH EYES',face:'NineFlex',ink:'#a8ed56',edge:'#156864',ground:'#7cb7db',angle:.018},
    {word:(options.phrases??[])[2]??'TINY GIANTS',face:'NineSwash',ink:'#202222',edge:'#eff566',ground:'#eff566',angle:-.025},
    {word:(options.phrases??[])[3]??'OFF SCRIPT',face:'NineFlex',ink:'#f6f5d6',edge:'#dd743c',ground:'#4f43a2',angle:.02},
    {word:(options.phrases??[])[4]??'MIDNIGHT INK',face:'NineSwash',ink:'#17171b',edge:'#d787da',ground:'#d787da',angle:.006}
  ];
  function sticker(i,x,y,width=580){
    const s=stickers[i],weight=i===1?520:i===3?550:400;c.save();c.translate(x,y);c.rotate(s.angle);
    const pixel=i===0,fontSize=i===1?58:i===3?64:55;font(fontSize,pixel?'NineFlex':s.face,weight);
    const w=pixel?pixelMetrics(s.word).reduce((v,g)=>v+g[0].length+1,0)*6.8:c.measureText(s.word).width,scale=Math.min(1,width/(w+42));c.scale(scale,scale);
    c.fillStyle=s.ground;c.beginPath();
    c.moveTo(-w/2-25,-41);c.lineTo(-w/3-10,-32);c.lineTo(-w/3,-52);c.lineTo(-w/4+20,-33);c.lineTo(w/2+25,-44);c.lineTo(w/2+12,-15);c.lineTo(w/2+36,26);c.lineTo(w/3,32);c.lineTo(w/3-5,51);c.lineTo(w/4-20,36);c.lineTo(-w/2-30,42);c.lineTo(-w/2-13,10);c.closePath();c.fill();
    if(pixel)pixelLabel(s.word,0,0,47,s.ink,w,.68,s.edge);
    else{
      c.lineJoin='round';c.strokeStyle=s.edge;c.lineWidth=i===1?8:7;c.strokeText(s.word,0,0);c.fillStyle=s.ink;c.fillText(s.word,0,0);
      if(i===4){c.strokeStyle=s.ink;c.lineWidth=3.1;c.beginPath();c.moveTo(-w/2+5,6);c.bezierCurveTo(-w/2-34,-21,-w/2-38,32,-w/2-3,23);c.bezierCurveTo(-w/2+18,20,-w/2-7,4,-w/2-12,15);c.stroke()}
    }c.restore();
  }
  function stack(t){
    bg('#eeece5');const rows=[140,211,281,352,423],delays=[0,.72,1.02,1.16,1.48];
    [0,2,1,3,4].forEach(i=>{
      const local=(t-delays[i])/.64;if(local<=0)return;
      const p=settle(local),layout=settle((t-.72)/.75),exit=ramp((t-5.45-i*.065)/.58),flight=Math.sin(Math.PI*clamp(local));
      const target=i===0?lerp(355,rows[0],layout):rows[i],side=i%2?-1:1;
      c.save();c.translate((1-p)*side*165+exit*side*210,(1-p)*-80-exit*520);c.translate(400,target);c.rotate((1-p)*side*.24+flight*side*.035);c.scale(.88+.12*p,1+.08*(1-p));c.translate(-400,-target);
      c.globalAlpha=clamp(local*5)*(1-exit);sticker(i,400+(i%2?5:-3),target);c.restore();
    });
  }
  const inks=['#d2ef38','#f087ac','#b1aedc','#9ed292','#a58bbd','#cfa038','#7b75d6','#ed4e9a','#c5d848','#8ad0bc','#a0cdd1','#e7e334','#dfaf6a','#d4eb35','#b6acd9'];
  const places=['ROTTERDAM','DUBLIN','BRISTOL','ANTWERP','HELSINKI','LEEDS','PORTO','BOLOGNA','BASEL','GENT','ZURICH','LYON','TURIN','LILLE','BREMEN'];
  function checks(x,y,w,h,color){const cell=11;for(let r=0;r<Math.ceil(h/cell);r++)for(let q=0;q<Math.ceil(w/cell);q++){c.fillStyle=(r+q)%2?color:'#ece9de';c.fillRect(x+q*cell,y+r*cell,Math.min(cell,w-q*cell),Math.min(cell,h-r*cell))}}
  function posterLines(x,y,w,h){c.fillStyle='#eeeee4';c.fillRect(x,y,w,h);c.fillStyle='#272d2a';for(let yy=y;yy<y+h;yy+=3.2)c.fillRect(x,yy,w,1.6)}
  function posters(t){
    bg('#202226');const i=Math.min(14,Math.floor(t/.2)),accent=inks[i],x=170,y=20,w=460,h=520;
    c.save();const local=t%.2,landing=1-out(local/.11);c.translate(400,280);c.rotate(landing*(i%2?-.004:.004));c.scale(1+landing*.012,1+landing*.012);c.translate(-400,-280+landing*9);clip(x,y,w,h);
    posterLines(x,y,w,h);
    c.fillStyle='#eeeee4';c.fillRect(x,y,294,104);
    const titleInk='#'+accent.slice(1).match(/../g).map(v=>Math.round(parseInt(v,16)*.63).toString(16).padStart(2,'0')).join('');pixelLabel('Print',x+143,y+26,44,titleInk,270);pixelLabel('Social',x+143,y+78,44,titleInk,270);
    c.fillStyle=accent;c.fillRect(x+294,y+59,110,45);c.fillStyle='#232725';c.fillRect(x+404,y+59,56,45);
    pixelLabel(`FRIDAY / ${places[i]}`,400,y+139,39,'#f4f0e8',438);
    checks(x,y+174,w,65,'#272d2a');c.fillStyle='#eeeee4';c.fillRect(x+55,y+174,w-110,65);
    pixelLabel(['Paper Parade','Colour Lab','Ink Garden'][i%3],400,y+204,39,'#232725',333);
    pixelLabel(['Curve / Cut / Compose','Fold / Draw / Trace','Spark / Shift / Shape'][i%3],400,y+281,32,'#f4f0e8',438);
    checks(x,y+323,w,52,accent);c.fillStyle='#eeeee4';c.fillRect(x+79,y+323,w-158,52);
    pixelLabel(['Thoughts in Print','Find a New Angle','An Evening in Colour'][i%3],400,y+348,27,'#232725',288);
    pixelLabel(['Paper / People / Place','Colour / Form / Play','Ink / Shape / Space'][i%3],400,y+423,28,'#f4f0e8',432);
    c.fillStyle=accent;c.fillRect(x+258,y+h-54,w-258,54);pixelLabel('PRINT SOCIAL',x+359,y+h-27,17,'#202826',180);
    c.fillStyle='#eeeee4';c.fillRect(x+33,y+h-50,170,40);pixelLabel('TYPE / MUSIC',x+118,y+h-30,17,'#252b27',154);c.restore();
  }
  const bits={k:['10000','10000','10010','10100','11000','10100','10010','00000'],l:['01100','00100','00100','00100','00100','00100','01110','00000'],m:['00000','00000','11010','10101','10101','10101','10101','00000'],n:['00000','00000','11110','10001','10001','10001','10001','00000'],o:['00000','00000','01110','10001','10001','10001','01110','00000'],p:['00000','11110','10001','10001','11110','10000','10000','00000'],q:['00000','01111','10001','10001','01111','00001','00001','00000']};
  // Sample connected letter skeletons once; animate coverage continuously on a fixed grid.
  const pixelSkeletons={
    A:[[[2,26],[2,13],[4,6],[7.5,1],[11,6],[13,13],[13,26]],[[2,17],[13,17]]],
    B:[[[2,1],[2,26]],[[2,1],[9,1],[13,4],[13,9],[10,13],[2,13]],[[8,13],[13,16],[13,22],[10,26],[2,26]]],
    C:[[[13,4],[10,1],[5,1],[2,5],[2,22],[5,26],[10,26],[13,23]]],
    D:[[[2,1],[2,26],[8,26],[13,21],[13,6],[8,1],[2,1]]],
    E:[[[13,1],[2,1],[2,26],[13,26]],[[2,13],[11,13]]],
    F:[[[13,1],[2,1],[2,26]],[[2,13],[11,13]]]
  };
  const pixelFields=Object.fromEntries(Object.entries(pixelSkeletons).map(([ch,paths])=>{
    const cells=[];
    for(let row=0;row<33;row++)for(let col=0;col<21;col++){
      const px=col+.5-3,py=row+.5-3;let distance=Infinity;
      for(const path of paths)for(let j=1;j<path.length;j++){
        const [ax,ay]=path[j-1],[bx,by]=path[j],dx=bx-ax,dy=by-ay;
        const u=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));
        distance=Math.min(distance,Math.hypot(px-ax-u*dx,py-ay-u*dy));
      }
      if(distance<3.5)cells.push({col,row,distance});
    }
    return [ch,cells];
  }));
  function pixels(t){
    bg('#16191e');const letters='ABCDEF',cell=5,cols=21,rows=33,gap=7;
    const width=letters.length*(cols*cell+gap)-gap,left=(800-width)/2,top=197,phase=t/4.4*Math.PI*2;
    letters.split('').forEach((ch,i)=>{
      const x=left+i*(cols*cell+gap),p=phase-i*.53;
      c.lineWidth=.45;c.strokeStyle='#282d32';c.beginPath();
      for(let col=0;col<=cols;col++){const gx=x+col*cell;c.moveTo(gx,top);c.lineTo(gx,top+rows*cell)}
      for(let row=0;row<=rows;row++){const gy=top+row*cell;c.moveTo(x,gy);c.lineTo(x+cols*cell,gy)}
      c.stroke();c.strokeStyle='#4b5358';c.strokeRect(x,top,cols*cell,rows*cell);
      c.fillStyle='#f1f0df';
      for(const {col,row,distance} of pixelFields[ch]){
        // A travelling weight wave changes both the outer contour and the counters.
        const weight=(1.12+.52*(1-Math.cos(p))+.32*Math.sin(p-row*.19))*(options.strokeGain??1);
        const edge=Math.max(0,Math.min(1,(weight-distance+.65)/1.3));
        const coverage=edge*edge*(3-2*edge);
        if(coverage<.002)continue;
        c.globalAlpha=coverage;c.fillRect(x+col*cell+.12,top+row*cell+.12,cell-.24,cell-.24);
      }
      c.globalAlpha=1;c.fillStyle='#a87246';c.fillRect(x-1.5,top+rows*cell+7,3,3);
    });
  }
  const canonical=[[210,320,-25],[237,278,-17],[274,246,-8],[314,228,5],[458,228,-8],[493,252,9],[525,285,16],[553,325,24],[338,361,0],[383,344,0],[427,365,0]];
  const split=[[205,360,-25],[244,332,-18],[282,305,-10],[318,281,0],[503,154,-14],[541,158,-3],[580,176,11],[615,202,21],[230,422,0],[391,301,0],[583,414,0]];
  const merged=split.map(p=>[...p]);[[425,303,-5],[461,310,5],[494,322,14],[524,343,24]].forEach((p,i)=>merged[i+4]=p);
  const escaped=[[-54,0,-35],[-15,-28,-25],[24,-44,-10],[65,-54,0],[760,-54,10],[810,-20,30],[854,22,45],[895,60,50],[244,112,-9],[404,89,0],[646,52,8]];
  function paths(t){
    bg('#2555df');c.save();clip(62,80,676,420);c.fillStyle='#2555df';c.fillRect(62,80,676,420);
    let from=canonical,to=canonical,start=0,duration=1,mode='hold';
    if(t>=.43&&t<1.6){from=canonical;to=split;start=.43;duration=.90;mode='move'}
    else if(t>=1.6&&t<3.55)from=to=split;
    else if(t>=3.55&&t<4.22){from=split;to=merged;start=3.55;duration=.59;mode='merge'}
    else if(t>=4.22&&t<4.9){from=merged;to=escaped;start=4.22;duration=.54;mode='escape'}
    else if(t>=4.9){from=escaped;to=canonical;start=4.9;duration=.90;mode='return'}
    const chars=(options.text??'TypeFlowLab').padEnd(11,' ').slice(0,11);
    Array.from(chars).forEach((ch,i)=>{
      const delay=mode==='return'?i*.024:mode==='move'?i*.016:mode==='merge'?(i%4)*.017:mode==='escape'?i*.009:0;
      const local=(t-start-delay)/duration,q=mode==='hold'?0:mode==='escape'?ramp(local):settle(local),arc=mode==='hold'?0:Math.sin(Math.PI*clamp(local));
      const dx=to[i][0]-from[i][0],dy=to[i][1]-from[i][1],dist=Math.max(1,Math.hypot(dx,dy)),bend=(i%2?1:-1)*Math.min(38,dist*.15)*arc;
      const x=lerp(from[i][0],to[i][0],q)-dy/dist*bend,y=lerp(from[i][1],to[i][1],q)+dx/dist*bend,a=lerp(from[i][2],to[i][2],q)+arc*(i%2?9:-9);
      c.save();c.translate(x,y);c.rotate(a*Math.PI/180);c.scale(1+arc*.045,1-arc*.045);c.fillStyle='#f7f8f2';c.beginPath();c.arc(0,0,18,0,Math.PI*2);c.fill();label(ch,0,1,25,'#222527','NineFlex',650);c.restore();
    });c.restore();
  }
  function geometryWord(x,y,scale,back,t,row){
    c.save();c.translate(x,y);c.scale(scale,scale);c.fillStyle=back;c.fillRect(-280,-60,560,120);
    const colors=back==='#6968c6'?['#f3e6ac','#dce95b','#ffaaa0','#f3e6ac','#e6f477','#fcbe70']:['#354ca2','#267767','#c24740','#80509a','#234d5f','#354ca2'];
    for(let i=0;i<6;i++){
      const xx=-231+i*93,local=(t-.12-row*.38-i*.085)/.85,p=settle(local),exit=ramp((t-4.65-(5-i)*.065-row*.13)/.60),side=(i+row)%2?1:-1;
      c.save();c.globalAlpha=clamp(local*5)*(1-exit);c.translate(xx+(1-p)*side*165+exit*side*180,(1-p)*-88+exit*115);c.rotate((1-p)*side*.65);c.scale(1+.09*(1-p),1-.09*(1-p));c.fillStyle=colors[i];
      const pal=row?['#4052a0','#d54e40','#245f45','#2a285b','#e5e956']:['#f0e1b2','#deed68','#e2a29f','#2b6658','#5a3f83'];
      const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h)},tri=(pts,color)=>{c.fillStyle=color;c.beginPath();c.moveTo(...pts[0]);pts.slice(1).forEach(pt=>c.lineTo(...pt));c.closePath();c.fill()};
      if(i===0){rect(-33,-34,15,68,pal[0]);rect(18,-34,15,68,pal[2]);tri([[-24,-34],[0,-4],[24,-34],[22,-10],[0,17],[-22,-10]],pal[1]);tri([[-33,34],[-18,0],[-18,34]],pal[3])}
      else if(i===1){for(let part=0;part<4;part++){c.fillStyle=pal[part];c.beginPath();c.moveTo(0,0);c.arc(0,0,34,part*Math.PI/2,(part+1)*Math.PI/2);c.closePath();c.fill()}c.fillStyle=back;c.beginPath();c.arc(0,0,16,0,Math.PI*2);c.fill();c.fillStyle=pal[4];for(let yy=-8;yy<=8;yy+=5)for(let xx=-8;xx<=8;xx+=5){c.beginPath();c.arc(xx,yy,1.25,0,Math.PI*2);c.fill()}}
      else if(i===2){rect(-33,-34,66,15,pal[0]);rect(-8,-19,16,53,pal[2]);tri([[-8,34],[8,-19],[8,34]],pal[1])}
      else if(i===3){rect(-12,-7,24,41,pal[3]);c.fillStyle=pal[1];c.beginPath();c.arc(0,-24,14,0,Math.PI*2);c.fill();c.fillStyle=pal[0];for(let yy=-30;yy<=-18;yy+=5)for(let xx=-7;xx<=7;xx+=5){c.beginPath();c.arc(xx,yy,1.1,0,Math.PI*2);c.fill()}rect(-12,17,24,17,pal[2])}
      else if(i===4){rect(-29,-34,16,68,pal[1]);rect(-13,-34,43,15,pal[0]);rect(-13,-7,32,14,pal[2]);tri([[-29,34],[-13,7],[-13,34]],pal[3])}
      else{rect(-30,-34,60,14,pal[0]);rect(-30,-34,14,34,pal[0]);rect(-30,-7,60,14,pal[1]);rect(16,0,14,34,pal[2]);rect(-30,20,60,14,pal[2]);tri([[-30,-7],[-16,-7],[-16,7]],pal[3])}
      c.restore();
    }c.restore();
  }
  function geometry(t){bg('#e7e0c8');geometryWord(400,205,1.12,'#6968c6',t,0);geometryWord(400,375,1.12,'#ebed58',t,1)}
  const sculptureClock=assets.clock;
  let sculptureWall=null;
  function prepareSculptureWall(){
    if(sculptureWall)return;
    sculptureWall=document.createElement('canvas');sculptureWall.width=800;sculptureWall.height=560;
    const wc=paintContext(sculptureWall.getContext('2d'),options.colors),wash=wc.createLinearGradient(0,0,800,540);
    wash.addColorStop(0,'#eee9df');wash.addColorStop(.52,'#dcd3c4');wash.addColorStop(1,'#bfb19b');
    wc.fillStyle=wash;wc.fillRect(0,0,800,560);
    const glow=wc.createRadialGradient(170,90,10,170,90,570);glow.addColorStop(0,'#ffffff38');glow.addColorStop(1,'#ffffff00');wc.fillStyle=glow;wc.fillRect(0,0,800,560);
    const grain=wc.getImageData(0,0,800,560);let seed=7219;
    for(let k=0;k<grain.data.length;k+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=((seed>>>24)/255-.5)*6;grain.data[k]+=v;grain.data[k+1]+=v;grain.data[k+2]+=v}
    wc.putImageData(grain,0,0);
  }
  function swing(t){
    prepareSculptureWall();c.drawImage(sculptureWall,0,0);
    const cycle=t/2.2*Math.PI*2,phase=Math.sin(cycle),angle=phase*.135;
    // Photographic walnut / bronze cutout. The lower crop rotates about its real pivot.
    const scale=.34,originX=400,originY=35,pivotX=originX+511*scale,pivotY=originY+430*scale;
    if(sculptureClock.complete&&sculptureClock.naturalWidth){
      c.save();c.shadowColor='#41332445';c.shadowBlur=16;c.shadowOffsetX=13;c.shadowOffsetY=15;
      c.translate(pivotX,pivotY);c.rotate(angle);
      c.drawImage(sculptureClock,0,430,1024,1106,-511*scale,0,1024*scale,1106*scale);c.restore();
      c.save();c.shadowColor='#41332445';c.shadowBlur=13;c.shadowOffsetX=12;c.shadowOffsetY=12;
      c.drawImage(sculptureClock,0,0,1024,433,originX,originY,1024*scale,433*scale);c.restore();
    }
    const glyphs=[
      [[.77,.12,.22,-.05,-.04,.18,.22,.38],[.22,.38,.4,.52,.94,.52,.72,.82],[.72,.82,.51,1.07,.05,.96,.12,.76]],
      [[.05,.30,.04,.57,.08,1.05,.30,.91],[.30,.91,.43,.84,.43,.5,.45,.34],[.45,.34,.44,.64,.46,1.06,.68,.92],[.68,.92,.91,.82,.92,.48,.95,.28]],
      [[.73,.38,.2,.06,-.02,.57,.20,.85],[.20,.85,.45,1.14,.75,.84,.74,.49],[.74,.49,.74,.34,.77,.25,.78,.27],[.78,.27,.78,.5,.73,.81,.91,.95]],
      [[.05,.28,.05,.64,.12,1.01,.42,.80],[.42,.80,.67,.62,.70,.39,.72,.26],[.72,.26,.70,.64,.75,1.2,.22,1.22]]
    ],widths=[80,103,80,80],total=widths.reduce((a,b)=>a+b,0)+24;let xx=66;
    glyphs.forEach((segments,i)=>{const lag=Math.sin(cycle-i*.13);c.save();c.translate(xx,177);c.scale(1.12,1.12);c.transform(1,0,-lag*.15,1,lag*16,0);c.lineCap='round';c.lineJoin='round';c.strokeStyle='#33271f';
      for(const seg of segments){let prev=null;for(let k=0;k<=36;k++){const u=k/36,v=1-u,px=v*v*v*seg[0]+3*v*v*u*seg[2]+3*v*u*u*seg[4]+u*u*u*seg[6],py=v*v*v*seg[1]+3*v*v*u*seg[3]+3*v*u*u*seg[5]+u*u*u*seg[7];if(prev){const swelling=clamp((py-.32)/.65);c.lineWidth=2.6+17*swelling*swelling;c.beginPath();c.moveTo(prev[0]*widths[i],prev[1]*180);c.lineTo(px*widths[i],py*180);c.stroke()}prev=[px,py]}}
      c.restore();xx+=(widths[i]+8)*1.12;
    });
  }
  function tLetter(x,y,angle,opacity=1){
    c.save();c.globalAlpha=opacity;c.strokeStyle='#1e2227';c.lineWidth=5;c.lineCap='butt';c.beginPath();c.moveTo(x-24,y);c.lineTo(x+24,y);c.stroke();
    c.translate(x,y);c.rotate(angle);c.beginPath();c.moveTo(0,0);c.lineTo(0,61);c.stroke();c.restore();
  }
  function fLetter(x,y,angle,opacity=1){
    c.save();c.globalAlpha=opacity;c.translate(x,y);c.rotate(angle);c.strokeStyle='#202226';c.lineWidth=4;c.beginPath();c.moveTo(0,51);c.lineTo(0,-15);c.quadraticCurveTo(0,-37,26,-31);c.stroke();c.restore();
    c.save();c.globalAlpha=opacity;c.strokeStyle='#202226';c.lineWidth=4;c.beginPath();c.moveTo(x-14,y+2);c.lineTo(x+29,y+2);c.stroke();c.restore();
  }
  function baton(t){
    bg('#eae7df');const x=181,y=30,w=438,h=500;
    c.save();clip(x,y,w,h);
    if(t<2.44){
      c.fillStyle='#6973df';c.fillRect(x,y,w,h);
      const enter=out((t-.27)/.16),secondary=out((t-.67)/.15),leave=1-out((t-2.03)/.31),subLeave=1-out((t-2.0)/.15);
      const a=lerp(-.57,.17,settle((t-.23)/.65)*leave);tLetter(300,242,a);
      c.save();c.globalAlpha=enter*leave;c.translate((1-settle((t-.28)/.60))*42,-(1-leave)*24);font(66,'NineFlex',380);const empoWidth=c.measureText('angent').width;label('angent',328+empoWidth/2,269,66,'#202226','NineFlex',380,300);label('7',522,340,97,'#202226','NineFlex',350);c.restore();
      c.save();c.globalAlpha=secondary*subLeave;c.translate(0,(1-settle((t-.67)/.54))*24);label('no.',452,323,44,'#202226','NineFlex',450);c.restore();
    }else{
      c.fillStyle='#cc77cf';c.fillRect(x,y,w,h);
      const e=out((t-2.63)/.17),l=1-out((t-5.68)/.14),fEnter=out((t-2.8)/.12),word=out((t-3.03)/.17),wordExit=1-out((t-5.21)/.12),fExit=1-out((t-5.56)/.13);
      c.save();c.translate(324,108);c.rotate((1-settle((t-2.44)/.55))*.18);c.strokeStyle='#202226';c.lineWidth=3.6;c.lineCap='round';c.beginPath();c.moveTo(23,-28);c.bezierCurveTo(-11,-57,-49,-12,-11,5);c.bezierCurveTo(41,29,10,57,-25,32);c.stroke();c.restore();
      c.save();c.globalAlpha=e*l;c.translate((1-settle((t-2.63)/.56))*38,0);font(56,'NineFlex',400);const restWidth=Math.min(245,c.measureText('pectrum').width);label('pectrum',356+restWidth/2,119,56,'#202226','NineFlex',400,245);c.restore();
      const fa=lerp(.22,-.3,settle((t-2.98)/.72)*wordExit);fLetter(248,415,fa,fEnter*fExit);
      c.save();c.globalAlpha=word*wordExit;c.translate((1-settle((t-3.03)/.62))*35,0);font(59,'NineFlex',400);const antasWidth=c.measureText('ilam').width;label('ilam',270+antasWidth/2,423,59,'#202226','NineFlex',400,250);label('ent',468,471,61,'#202226','NineFlex',400);c.restore();
    }c.restore();
  }
  const small=[[246,280,28,0],[350,280,28,0],[453,280,28,0],[557,280,28,0]];
  const big=[[294,180,167,-6],[493,190,160,3],[294,373,170,-16],[497,383,163,5]];
  function monogram(t){
    bg('#ece9e0');c.fillStyle='#f0f0cb';c.fillRect(180,30,440,500);const letters=(options.text??'ForM').padEnd(4,' ').slice(0,4);
    for(let i=0;i<4;i++){
      let p=0,r=0,arc=0,anticipation=0;
      if(t>=1.43&&t<3.75){const local=(t-1.58-i*.065)/.78;p=settle(local);r=settle(local-.07);arc=Math.sin(Math.PI*clamp(local));anticipation=Math.sin(Math.PI*clamp((t-1.43-i*.065)/.15))}
      else if(t>=3.75&&t<4.63){const local=(t-3.75-i*.13)/.48;p=1-ramp(local);r=1-ramp(local-.04);arc=-Math.sin(Math.PI*clamp(local))}
      const b=big[i],s=small[i];c.save();c.translate(lerp(s[0],b[0],p)+arc*(i%2?17:-17),lerp(s[1],b[1],p)-arc*26+anticipation*5);c.rotate((lerp(s[3],b[3],r)+arc*(i%2?7:-7))*Math.PI/180);
      c.scale(1+arc*.045,1-arc*.045);label(letters[i],0,0,lerp(s[2],b[2],p),'#181e1c','NineFlex',590);c.restore();
    }
    if(t<1.4){c.save();c.globalAlpha=.13*(1-smooth((t-1.15)/.25));label('Fold. Observe. Rotate. Mix.',400,280,25,'#2d3329','NineFlex',400,360);c.restore()}
    if(t>=4.72){
      const words=options.words??['Fold.','Observe.','Rotate.','Mix.'],str=words.join(' '),q=clamp((t-4.72)/2.45),count=Math.floor((q+.025*Math.sin(q*Math.PI*6))*str.length);
      c.save();c.globalAlpha=1-smooth((t-8.65)/.3);font(24,'NineFlex',450);c.textAlign='left';c.fillStyle='#293126';let offset=0;
      words.forEach((word,i)=>{
        const visible=Math.max(0,Math.min(word.length,count-offset)),left=small[i][0]-c.measureText(word).width/2;
        c.fillText(word.slice(0,visible),left,319);offset+=word.length+1;
      });c.restore();
    }
  }
  const bandStyles=[{top:['NineFlex',850],bottom:['dot',500],bg:'#dfe6b2'},{top:['NineSwash',400],bottom:['NineFlex',700],bg:'#e9ef45'},{top:['Courier New',900],bottom:['Georgia',400],bg:'#e3e3c3'},{top:['rail',400],bottom:['soft-cut',400],bg:'#bedc8e'},{top:['stencil',680],bottom:['NineFlex',600],bg:'#d9e1de'}];
  function dotText(str,x,y,width,context=c){
    const buf=document.createElement('canvas');buf.width=200;buf.height=34;const b=buf.getContext('2d');b.fillStyle='#fff';b.font='500 31px monospace';b.textBaseline='middle';b.textAlign='center';b.fillText(str,100,17,190);
    const data=b.getImageData(0,0,200,34).data;context.fillStyle='#1b211e';const sx=width/200;
    for(let yy=0;yy<34;yy+=3)for(let xx=0;xx<200;xx+=3)if(data[(yy*200+xx)*4+3]>70){context.beginPath();context.arc(x-width/2+xx*sx,y-51+yy*3,.95,0,Math.PI*2);context.fill()}
  }
  function bandText(str,x,y,style,context=c){
    const bandFont=(size,family,weight)=>{context.font=`${weight} ${size}px ${family}`;context.textAlign='center';context.textBaseline='middle'};
    const bandLabel=(text,x,y,size,color,family,weight,max)=>{context.save();bandFont(size,family,weight);context.fillStyle=color;const w=context.measureText(text).width;context.translate(x,y);if(max&&w>max)context.scale(max/w,1);context.fillText(text,0,0);context.restore()};
    if(style[0]==='dot'){dotText(str,x,y,590,context);return}
    if(style[0]==='rail'){
      bandLabel(str,x,y,96,'#1a201f','NineFlex',240,610);context.save();context.globalCompositeOperation='destination-out';context.fillRect(x-320,y-2,640,4);for(let i=-3;i<=3;i++)context.fillRect(x+i*79,y-53,2.6,106);context.restore();return;
    }
    if(style[0]==='soft-cut'){
      bandFont(93,'NineFlex',540);context.lineJoin='round';context.lineWidth=2;context.strokeStyle='#1a201f';context.strokeText(str,x,y,610);bandLabel(str,x,y,93,'#1a201f','NineFlex',540,610);context.save();context.globalCompositeOperation='destination-out';context.strokeStyle='#000';context.lineWidth=2.8;for(let i=-3;i<=3;i++){context.beginPath();context.moveTo(x+i*87-5,y-47);context.bezierCurveTo(x+i*87-32,y-17,x+i*87+31,y+8,x+i*87+5,y+47);context.stroke()}context.restore();return;
    }
    if(style[0]==='stencil'){
      bandLabel(str,x,y,96,'#1a201f','NineFlex',520,610);
      context.save();context.globalCompositeOperation='destination-out';for(let i=-3;i<4;i++){context.beginPath();context.moveTo(x+i*72-19,y-58);context.lineTo(x+i*72+22,y+58);context.lineWidth=3;context.strokeStyle='#000';context.stroke()}context.restore();return;
    }
    bandLabel(str,x,y,96,'#1a201f',style[0],style[1],610);
  }
  const bandTextures=[];
  function prepareBands(){
    // Each strip owns a full-width buffer, independent of the visible preview's aspect ratio.
    bandTextures.length=0;
    for(const st of bandStyles){
      const pair=[];for(let row=0;row<2;row++){
        const buf=document.createElement('canvas');buf.width=1360;buf.height=224;const bc=paintContext(buf.getContext('2d'),options.colors);
        bc.setTransform(2,0,0,2,0,0);bc.fillStyle=st.bg;bc.fillRect(0,0,680,112);
        bandText(row?(options.bottomText??'RHYTHM'):(options.topText??'VECTOR'),340,56,row?st.bottom:st.top,bc);pair.push(buf);
      }bandTextures.push(pair);
    }
  }
  function bands(t){
    bg('#eeeae2');const idx=Math.floor(t/1.2)%5,phase=t%1.2,next=(idx+1)%5;
    const blend=ramp((phase-.30)/.70),rgb=hex=>hex.match(/[0-9a-f]{2}/gi).map(v=>parseInt(v,16)),a=rgb(bandStyles[idx].bg),b=rgb(bandStyles[next].bg);c.fillStyle=`rgb(${a.map((v,i)=>Math.round(lerp(v,b[i],blend))).join(',')})`;c.fillRect(60,116,680,328);
    for(let row=0;row<2;row++){
      const local=(phase-.30-row*.055)/.64,p=settle(local),y=158+row*127,direction=row?1:-1;
      c.save();clip(60,y,680,112);if(p>=1){c.fillStyle=bandStyles[next].bg;c.fillRect(60,y,680,112)}
      if(local>0&&local<1){c.save();c.transform(1,0,Math.sin(Math.PI*clamp(local))*direction*.025,1,0,0);c.drawImage(bandTextures[idx][row],60+direction*p*680,y,680,112);c.drawImage(bandTextures[next][row],60+direction*(p-1)*680,y,680,112);c.restore()}
      else c.drawImage(bandTextures[local>=1?next:idx][row],60,y,680,112);
      c.restore();
    }
  }

 const draws={stack,posters,pixels,paths,geometry,swing,baton,monogram,bands};
 if(key==='bands')prepareBands();
 return {draw(time){c.setTransform(2,0,0,2,key==='posters'?-300:0,0);c.clearRect(key==='posters'?150:0,0,key==='posters'?500:800,560);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.lineWidth=1;c.filter='none';c.setLineDash([]);draws[key](time);},dispose(){}};
}
