import {EXPERIMENTAL_MODES} from './studies/experimental-catalog.js';
import React,{useState} from 'react';
import type {StudyProps} from './StudyMotion';
import {studyById,studyDefaults,studyFrames} from './studies/catalog.js';
export const StudySettings:React.FC<{value:StudyProps;onChange:(value:StudyProps)=>void}>=({value,onChange})=>{
 const meta=studyById(value.study)!,key=meta.key,[assetError,setAssetError]=useState('');
 const modeOptions=EXPERIMENTAL_MODES[key as keyof typeof EXPERIMENTAL_MODES];
 const update=(patch:Partial<StudyProps>)=>onChange({...value,...patch});
 const textField=(label:string,field:keyof StudyProps,max:number)=> <label className="text-control" key={field}>{label}<input aria-label={label} maxLength={max} value={String(value[field]??'')} onChange={e=>update({[field]:e.target.value})}/></label>;
 const listFields=(field:'words'|'phrases',labels:string[],max=16)=>labels.map((label,i)=><label className="text-control" key={field+i}>{label}<input aria-label={label} maxLength={max} value={value[field]?.[i]??''} onChange={e=>{const items=[...(value[field]??[])];items[i]=e.target.value;update({[field]:items});}}/></label>);
 const asset=()=> <label className="study-asset">钟表素材<input aria-label="替换钟表素材" type="file" accept="image/png,image/webp,image/jpeg" onChange={event=>{const file=event.target.files?.[0];if(!file)return;if(file.size>12*1024*1024){setAssetError('请选择12MB以内的图片。');return;}const reader=new FileReader();reader.onload=()=>{setAssetError('');update({clockSrc:String(reader.result)});};reader.readAsDataURL(file);}}/><span>{value.clockSrc?.startsWith('data:')?'已替换，可随配置复用':'使用已确认的原素材'}</span></label>;
 const download=()=>{const payload={...value,_bela:{effectCode:meta.code,effectName:meta.name,effectId:meta.id,reference:meta.reference,compositionId:'Study'+meta.code,width:meta.width,height:meta.height,fps:60,durationInFrames:studyFrames(value,60)}};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='Bela-'+meta.code+'-'+meta.key+'.json';link.click();URL.revokeObjectURL(url);};
 return <section className="study-settings" aria-label="创意字体参数">
  <div className="study-settings-heading"><span>{meta.code} {meta.name}{meta.reference!=='文章'?' · '+meta.reference:''}</span><div><button onClick={download}>下载配置</button><button onClick={()=>{setAssetError('');onChange(studyDefaults(value.study) as StudyProps);}}>还原此项</button></div></div>
  <div className="controls">
   {key==='variable'&&listFields('words',['词组一','词组二','词组三'],10)}
   {key==='layout'&&textField('重组字母（8位）','text',8)}
   {key==='mix'&&<>{textField('第一行','headline',12)}{textField('第二行','subline',16)}{textField('混排字母（4位）','featureWord',4)}</>}
   {key==='ring'&&textField('环绕文字','text',42)}
   {key==='logo'&&<label>重组方式<select aria-label="字标重组方式" value={value.logoMode??'wave'} onChange={e=>update({logoMode:e.target.value as StudyProps['logoMode']})}><option value="gather">弹性聚拢</option><option value="flip">翻转落位</option><option value="wave">波浪展开</option></select></label>}
   {modeOptions&&<label>变化方式<select aria-label="实验字体变化方式" value={value.experimentalMode??modeOptions[0][0]} onChange={e=>update({experimentalMode:e.target.value})}>{modeOptions.map(([id,label]:string[])=><option key={id} value={id}>{label}</option>)}</select></label>}
   {key==='mask'&&textField('穿字标题','text',6)}
   {key==='stickers'&&listFields('phrases',['贴字一','贴字二','贴字三','贴字四'],8)}
   {key==='fold'&&textField('折叠文字','text',8)}
   {key==='stack'&&listFields('phrases',['贴纸一','贴纸二','贴纸三','贴纸四','贴纸五'],14)}
   {key==='paths'&&textField('弧线字组（11位）','text',11)}
   {key==='monogram'&&<>{textField('缩写字母（4位）','text',4)}{listFields('words',['第一字母释义','第二字母释义','第三字母释义','第四字母释义'],12)}</>}
   {key==='bands'&&<>{textField('上行字带','topText',9)}{textField('下行字带','bottomText',9)}</>}
   <label>动作速度 <b>{(value.speed??1).toFixed(1)}×</b><input aria-label="创意动作速度" type="range" min="0.5" max="2" step="0.1" value={value.speed??1} onChange={e=>update({speed:Number(e.target.value)})}/></label>
   <label>画面比例 <b>{Math.round((value.scale??1)*100)}%</b><input aria-label="创意画面比例" type="range" min="0.75" max="1.2" step="0.01" value={value.scale??1} onChange={e=>update({scale:Number(e.target.value)})}/></label>
   {['mask','stickers','fold'].includes(key)&&<label>图形动感 <b>{Math.round((value.objectMotion??1)*100)}%</b><input aria-label="图形动感" type="range" min="0" max="1.2" step="0.05" value={value.objectMotion??1} onChange={e=>update({objectMotion:Number(e.target.value)})}/></label>}
   {key==='pixels'&&<label>笔画粗细 <b>{(value.strokeGain??1).toFixed(2)}</b><input aria-label="像素笔画粗细" type="range" min="0.6" max="1.5" step="0.05" value={value.strokeGain??1} onChange={e=>update({strokeGain:Number(e.target.value)})}/></label>}
  </div>
  <div className="study-swatches">{meta.palette.map((color:string,i:number)=><label key={color}>{i===0?'底色':'颜色 '+i}<input type="color" aria-label={meta.name+(i===0?'底色':'颜色'+i)} value={value.colors?.[color]??color} onChange={e=>update({colors:{...value.colors,[color]:e.target.value}})}/></label>)}</div>
  {key==='swing'&&asset()}
  {['logo','pixels','geometry','swing','baton'].includes(key)&&<p className="study-form-note">保留原有定制字形与笔画；可调整节奏、配色和画面比例。</p>}
  {assetError&&<p role="alert">{assetError}</p>}
 </section>;
};
