import React,{useEffect,useState} from 'react';
import type {DemoProps} from './DemoMotion';
import {dataKind,parseValues,validateValues} from './demos/data-motion.js';
export const DataSettings:React.FC<{value:DemoProps;onChange:(p:DemoProps)=>void}>=({value,onChange})=>{
 const [numbers,setNumbers]=useState(value.dataValues??''),[labels,setLabels]=useState(value.dataLabels??''),[error,setError]=useState(''),[starts,setStarts]=useState(value.dataStartValues??'');
 useEffect(()=>{setNumbers(value.dataValues??'');setLabels(value.dataLabels??'');setStarts(value.dataStartValues??'');setError('');},[value.demo,value.dataValues,value.dataLabels,value.dataStartValues]);
 return <form className="data-settings" onSubmit={e=>{e.preventDefault();const message=validateValues(dataKind(value.demo),parseValues(numbers));if(message){setError(message);return;}if(value.demo==='demo-ranking'){const initial=parseValues(starts),target=parseValues(numbers);if(!initial||initial.length!==target?.length||validateValues('ranking',initial)){setError('起始数值和目标数值需要数量一致，且都为非负数。');return;}}onChange({...value,dataValues:numbers,dataLabels:labels,dataStartValues:starts,input:undefined,native:undefined});setError('');}}>
 {value.demo==='demo-ranking'&&<label>起始数值<input aria-label="起始数值" value={starts} onChange={e=>setStarts(e.target.value)}/></label>}
 <label>数据数值<input aria-label="数据数值" value={numbers} onChange={e=>setNumbers(e.target.value)}/></label>
 {!['count','milestone'].includes(dataKind(value.demo))&&<label>数据标签<input aria-label="数据标签" value={labels} onChange={e=>setLabels(e.target.value)} maxLength={150}/></label>}
 {dataKind(value.demo)==='milestone'&&<label>阶段名称<input aria-label="阶段名称" value={labels} onChange={e=>setLabels(e.target.value)} maxLength={80}/></label>}
 <button type="submit">应用数据</button><span>{value.demo==='demo-waterfall'?'首项是起始值，后续是增减量；最后的总计自动计算。':value.demo==='demo-milestone'?'填写0至100的进度。':'多个数值或标签用逗号分隔。'}</span>{error&&<p role="alert">{error}</p>}
 </form>;
};
