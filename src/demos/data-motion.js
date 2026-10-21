import {BATCH_DATA_KEYS} from '../batch/catalog.js';
import {EXTRA_DATA_DEFAULTS} from './expansion-catalog.js';
import {clamp,cue,easeMove,mod} from './motion.js';
export const DATA_DEFAULTS={...EXTRA_DATA_DEFAULTS,
 count:{title:'Every visit counts.',dataValues:'38640',dataLabels:'Visits',unit:'visits',accent:'#6958c5',background:'#f1edf8'},
 bars:{title:'Small steps. Real growth.',dataValues:'32,48,41,67,59,86',dataLabels:'Mon,Tue,Wed,Thu,Fri,Sat',unit:'',accent:'#467966',background:'#eef2ea'},
 line:{title:'Follow the momentum.',dataValues:'18,29,24,51,45,72,88',dataLabels:'Mon,Tue,Wed,Thu,Fri,Sat,Sun',unit:'',accent:'#5968c5',background:'#edf0f8'},
 donut:{title:'A whole, in parts.',dataValues:'42,28,18,12',dataLabels:'Direct,Search,Social,Other',unit:'%',accent:'#d67d55',background:'#f6efe7'},
 ranking:{title:'A changing leaderboard.',dataValues:'68,93,57,81',dataStartValues:'67,41,58,49',dataLabels:'Studio A,Studio B,Studio C,Studio D',unit:'pts',accent:'#6861c5',background:'#efedf7'},
 milestone:{title:'One step closer.',dataValues:'86',dataLabels:'Start,Build,Review,Deliver',unit:'%',accent:'#bde68a',background:'#173a35'},
 waterfall:{title:'See what changed.',dataValues:'120,32,-18,45,-12',dataLabels:'Start,New,Churn,Expand,Cost',unit:'',accent:'#497d6c',background:'#eef2eb'},
 heatmap:{title:'Consistency leaves a trace.',dataValues:'2,5,1,0,4,7,3,0,2,6,4,9,5,1,3,0,7,6,4,8,2,5,3,0,9,6,4,7',dataLabels:'Mon,Tue,Wed,Thu,Fri,Sat,Sun',unit:'actions',accent:'#638b50',background:'#f0f3e9'},
};
export const dataKeys=Object.keys(DATA_DEFAULTS);
export const dataKind=id=>id.replace('demo-','');
export const isDataDemo=id=>dataKeys.includes(dataKind(id))||BATCH_DATA_KEYS.includes(dataKind(id));
export function parseValues(raw){const tokens=String(raw??'').trim().split(/[,，\n]/).map(x=>x.trim());return tokens.length&&tokens.every(x=>x!==''&&Number.isFinite(Number(x)))?tokens.map(Number):null;}
export function validateValues(kind,values){
 if(!values||values.length<1)return '请输入用逗号分隔的有限数字。';
 if(values.some(v=>Math.abs(v)>999999999))return '单项数值请保持在正负999999999以内。';
 const limits={gauge:1,flipcount:1,bubble:5,scatter:5,lollipop:5,diverging:5,multiring:3,radar:6};
 const max=limits[kind]??(kind==='heatmap'?28:['count','milestone'].includes(kind)?1:kind==='ranking'?5:kind==='donut'?5:7);
 if(values.length>max)return '此项最多支持'+max+'个数值。';
 if(!['count','waterfall','diverging'].includes(kind)&&values.some(v=>v<0))return '此图使用非负数值。';
 if(['count','flipcount'].includes(kind)&&!Number.isInteger(values[0]))return '数字计数器请填写整数。';
 if(['milestone','gauge','multiring'].includes(kind)&&values.some(v=>v>100))return '进度请填写0至100。';
 if(['donut','treemap'].includes(kind)&&values.reduce((a,b)=>a+b,0)<=0)return '环图的数值总和需要大于0。';
 if(kind==='radar'&&values.length<3)return '雷达图至少需要三个维度。';
 if(['area','line'].includes(kind)&&values.length<2)return '折线图至少需要两个数据点。';
 if(kind==='waterfall'&&values.length<2)return '瀑布图需要起始值及至少一个增减值。';
 return '';
}
export function dataValues(p){const kind=dataKind(p.demo),defaults=DATA_DEFAULTS[kind],parsed=parseValues(p.dataValues);return parsed&&!validateValues(kind,parsed)?parsed:parseValues(defaults.dataValues)??[0];}
export function dataLabels(p,n){const raw=String(p.dataLabels??'').split(/[,，\n]/).map(x=>x.trim());return Array.from({length:n},(_,i)=>(raw[i]||String(i+1)).slice(0,14));}
export const dataTime=(frame,fps,speed=1)=>mod(frame/fps*clamp(speed,.5,2),8);
export const dataEnter=(t,delay=0,duration=1.8)=>cue(t,.45+delay,duration,easeMove);
export const dataOpacity=t=>cue(t,.03,.35)*(1-cue(t,6.85,.8,easeMove));
export const numberText=(n,compact=true)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:compact?1:0,...(compact&&Math.abs(n)>=10000?{notation:'compact'}:{})}).format(n);
export function chartScale(values,top=145,bottom=390){const lo=Math.min(0,...values),hi=Math.max(0,...values),span=hi-lo||1;return v=>bottom-(v-lo)/span*(bottom-top);}
export function waterfallSteps(values){let total=values[0];const rows=[{start:0,end:total,delta:total,total:true}];for(const delta of values.slice(1)){const start=total;total+=delta;rows.push({start,end:total,delta,total:false});}rows.push({start:0,end:total,delta:total,total:true});return rows;}
/** @param {number[]} values @param {number} progress @param {number[]=} starts */
export function rankingAt(values,progress,starts){const initial=starts?.length===values.length&&starts.every(v=>Number.isFinite(v)&&v>=0)?starts:values.map(()=>0),current=values.map((v,i)=>initial[i]*(1-progress)+v*progress),range=Math.max(1,...values)*.028;return current.map((value,i)=>({value,rank:current.reduce((rank,other,j)=>j===i?rank:rank+(Math.abs(other-value)<1e-8?(j<i?1:0):clamp(.5+(other-value)/(2*range))),0)}));}
