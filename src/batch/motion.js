export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const mix=(a,b,q)=>a+(b-a)*q;
export const ease=v=>{const x=clamp(v);return x*x*x*(x*(x*6-15)+10);};
export const cue=(t,start,duration=.8)=>ease((t-start)/duration);
export const windowAt=(t,start=.55,end=6.4,duration=.8)=>cue(t,start,duration)*(1-cue(t,end,duration));
export const phaseAt=t=>Math.sin(Math.PI*2*t/8);
export const moveAt=t=>cue(t,.6,1.8)-cue(t,5.6,1.8);
export const controlAt=(t,key)=>({q:windowAt(t,.75,6.1,.7),index:cue(t,1.2,.8)+cue(t,3.4,.8)-2*cue(t,6.1,.8),held:clamp((t-1)/2)*(1-cue(t,5.8,.8)),pulse:cue(t,.85,.7)*(1-cue(t,2.1,.7))});
/** @returns {number[]|null} */
export function batchNumbers(raw){const v=String(raw??'').split(/[,，\n]/).map(s=>s.trim());return v.length&&v.every(x=>x!==''&&Number.isFinite(Number(x)))?v.map(Number):null;}
export function batchDataError(key,v){
 if(!v||!v.length||v.length>120||v.some(n=>!Number.isFinite(n)||n<0||n>1000000))return '请输入0至1000000的数值，最多120项。';
 if(['histogram','funnel'].includes(key)&&v.some(n=>!Number.isInteger(n)))return '频数和人数请填写非负整数。';
 const tuples={dumbbell:2,slope:2,interval:3,boxplot:5,ridgeline:6,sankey:9,bullet:2,candles:4,parallel:4};
 if(tuples[key]&&(v.length%tuples[key]!==0||v.length<tuples[key]))return `每组需要${tuples[key]}个数值。`;
 const maxima={dumbbell:8,slope:10,interval:12,boxplot:15,histogram:12,ridgeline:24,beeswarm:50,funnel:5,sankey:9,arcnetwork:6,waffle:6,pictogram:4,bullet:8,candles:28,parallel:24};
 if(v.length>(maxima[key]??120))return `此项最多支持${maxima[key]}个数值。`;
 if(['sankey','arcnetwork'].includes(key)&&v.length!==(key==='sankey'?9:6))return '请保留示例的关系数，以便保持节点对应。';
 if(['waffle','sankey','histogram','ridgeline'].includes(key)&&v.reduce((s,n)=>s+n,0)<=0)return '数值总和需要大于零。';
 if(key==='pictogram'&&v.some(n=>n>12))return '每行最多展示12个单位。';
 if(['dumbbell','slope','interval','boxplot','bullet','parallel'].includes(key)&&v.some(n=>n>100))return '本图统一使用0至100的刻度。';
 if(key==='interval')for(let i=0;i<v.length;i+=3)if(v[i]>v[i+1]||v[i+1]>v[i+2])return '每组依次填写最低、中值、最高，需从小到大。';
 if(key==='boxplot')for(let i=0;i<v.length;i+=5)for(let j=0;j<4;j++)if(v[i+j]>v[i+j+1])return '每组五数需按最小值、下四分位、中位数、上四分位、最大值排序。';
 if(key==='funnel'&&(v.length<2||v.some((n,i)=>i>0&&n>v[i-1])))return '漏斗需至少两个阶段，人数应逐级不增。';
 if(key==='candles')for(let i=0;i<v.length;i+=4)if(v[i+2]>Math.min(v[i],v[i+1])||v[i+3]<Math.max(v[i],v[i+1]))return '每期按开盘、收盘、最低、最高填写；须线需包含实体。';
 return '';
}
/** @param {number[]} v @param {number} n @returns {number[][]} */
export const chunks=(v,n)=>Array.from({length:Math.ceil(v.length/n)},(_,i)=>v.slice(i*n,(i+1)*n));
/** @param {number[]} values @returns {number[]} */
export function waffleUnits(values){const total=values.reduce((s,v)=>s+v,0)||1,raw=values.map(v=>v/total*100),counts=raw.map(Math.floor);let spare=100-counts.reduce((s,v)=>s+v,0);const order=raw.map((v,i)=>({i,remainder:v-counts[i]})).sort((a,b)=>b.remainder-a.remainder);for(let i=0;i<spare;i++)counts[order[i].i]++;return counts;}
/** @param {number[]} values */
export function swarm(values){const points=[],r=Math.min(6,130/values.length),gap=r*2+1;for(let i=0;i<values.length;i++){const x=100+values[i]/Math.max(100,...values)*600;let y=0;for(let step=0;step<100;step++){y=step===0?0:(step%2?1:-1)*Math.ceil(step/2)*gap;if(!points.some(p=>(p.x-x)**2+(p.y-y)**2<gap**2-.001))break;}points.push({x,y,i,r});}return points;}
/** @param {number[]} values */
export function sankeyBands(values){const rows=[0,1,2].map(i=>values.slice(i*3,i*3+3).reduce((a,b)=>a+b,0)),cols=[0,1,2].map(i=>values[i]+values[3+i]+values[6+i]),unit=225/(values.reduce((a,b)=>a+b,0)||1),left=[],right=[];let y=130;for(const v of rows){left.push(y);y+=v*unit+22;}y=130;for(const v of cols){right.push(y);y+=v*unit+22;}const offsetsL=[0,0,0],offsetsR=[0,0,0];return values.map((v,i)=>{const a=Math.floor(i/3),b=i%3,w=v*unit,y1=left[a]+offsetsL[a]+w/2,y2=right[b]+offsetsR[b]+w/2;offsetsL[a]+=w;offsetsR[b]+=w;return {a,b,v,w,y1,y2,left:left[a],right:right[b],row:rows[a]*unit,col:cols[b]*unit};});}
