import {isCoverage,isCoverageAudio} from './coverage/catalog.js';
import {CoverageSettings} from './coverage/Settings';
import {isVoiceUI,VOICE_CONTROL_KEYS} from './voice-ui/catalog.js';
import {isVerification} from './verification/catalog.js';
import {BatchSettings} from './batch/Settings';
import {BATCH_KEYS,BATCH_DATA_KEYS} from './batch/catalog.js';
import {VoiceSettings} from './VoiceSettings';
import React,{useState} from 'react';
import {FEEDBACK_KEYS} from './demos/expansion-catalog.js';
import {DataSettings} from './DataSettings';
import {isDataDemo} from './demos/data-motion.js';
import type {DemoProps} from './DemoMotion';
import {demoById,demoDefaults,demoFrames,demoUsesImages} from './demos/catalog.js';
export const DemoSettings:React.FC<{value:DemoProps;onChange:(p:DemoProps)=>void}>=({value,onChange})=>{
 const meta=demoById(value.demo)!,[error,setError]=useState('');
 const patch=(p:Partial<DemoProps>)=>onChange({...value,...p,input:undefined,native:undefined});
 const download=()=>{const payload={...value,input:undefined,_bela:{effectCode:meta.code,effectName:meta.name,compositionId:'Demo'+meta.code,width:800,height:500,fps:60,durationInFrames:demoFrames(value),source:meta.source,web:true,remotion:true,chatcut:false}};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'})),el=document.createElement('a');el.href=url;el.download='Bela-'+meta.code+'.json';el.click();URL.revokeObjectURL(url);};
 return <section aria-label="图片布局交互参数"><div className="study-settings-heading"><span>{meta.code} {meta.name}</span><div><button onClick={download}>下载配置</button><button onClick={()=>onChange(demoDefaults(value.demo))}>还原此项</button></div></div><div className="controls">
  {(meta.key==='expand'||isDataDemo(value.demo)&&!BATCH_DATA_KEYS.includes(meta.key))&&<label>标题<input value={value.title??''} maxLength={30} onChange={e=>patch({title:e.target.value})}/></label>}
  <label>动作速度 <b>{(value.speed??1).toFixed(1)}×</b><input type="range" aria-label="Demo动作速度" min=".5" max="2" step=".1" value={value.speed??1} onChange={e=>patch({speed:+e.target.value})}/></label>
  {(['reveal','parallax','grid','tilt','voice','pixel-field'].includes(meta.key)||meta.key==='lensgrid'||VOICE_CONTROL_KEYS.includes(meta.key))&&<label>动感幅度 <b>{(value.strength??1).toFixed(1)}</b><input type="range" min=".5" max="1.5" step=".1" value={value.strength??1} onChange={e=>patch({strength:+e.target.value})}/></label>}
  {demoUsesImages(value.demo)&&<label>图片呈现<select aria-label="图片呈现" value={value.fit??'contain'} onChange={e=>patch({fit:e.target.value as DemoProps['fit']})}><option value="contain">完整展示</option><option value="cover">填满并裁切</option></select></label>}
  <label>底色<input type="color" value={value.background??'#eeeae2'} onChange={e=>patch({background:e.target.value})}/></label>{(['tilt','magnet','follow','press','switch','tabs','voice'].includes(meta.key)||isVoiceUI(value.demo)||isVerification(value.demo)||isCoverage(value.demo)||BATCH_KEYS.includes(meta.key)||FEEDBACK_KEYS.includes(meta.key)||isDataDemo(value.demo))&&<label>强调色<input type="color" value={value.accent??'#d1f05b'} onChange={e=>patch({accent:e.target.value})}/></label>}
  {isDataDemo(value.demo)&&['count','ranking','heatmap'].includes(meta.key)&&<label>单位<input aria-label="数据单位" value={value.unit??''} maxLength={12} onChange={e=>patch({unit:e.target.value})}/></label>}
 </div>
 {isVoiceUI(value.demo)&&<p className="study-form-note">{VOICE_CONTROL_KEYS.includes(meta.key)?'使用无声示例语音展示控件状态，不调用麦克风、上传录音或发送消息；原101语音波形的音频替换功能保留。':'参考苹果常见交互方式独立实现；可用键盘替代拖动，网页不模拟设备震动。'}</p>}
 {isVerification(value.demo)&&<><div className="controls" style={{marginTop:20}}>{meta.key!=='captcha-order'&&<label>落位容差 <b>{(value.verifyTolerance??1).toFixed(1)}×</b><input aria-label="验证演示容差" type="range" min=".6" max="1.8" step=".1" value={value.verifyTolerance??1} onChange={e=>patch({verifyTolerance:+e.target.value})}/></label>}</div><p className="study-form-note">展示拖动、选择及成功/失败反馈；全部在本地运行，不接入身份认证或反机器人服务。已完成后可重置体验。</p></>}
 {(meta.key==='voice'||isCoverageAudio(value.demo))&&<VoiceSettings value={value} onChange={onChange}/>}
 {isCoverage(value.demo)&&<CoverageSettings value={value} onChange={onChange}/>}
 {BATCH_KEYS.includes(meta.key)&&<BatchSettings value={value} onChange={onChange} kind={meta.key}/>}
 {isDataDemo(value.demo)&&!BATCH_DATA_KEYS.includes(meta.key)&&<DataSettings value={value} onChange={onChange}/>}
 {(!demoUsesImages(value.demo)?[]:meta.key==='compare'?[0,1]:Array.from({length:value.images?.length??3},(_,i)=>i)).map(i=><label className="study-asset" key={i}>{meta.key==='parallax'?(value.images?.length===1?'建筑照片':['远景（底层）','中景（透明层）','前景（透明层）'][i]):'图片 '+(i+1)}<input type="file" accept="image/png,image/jpeg,image/webp" aria-label={'替换Demo图片'+(i+1)} onChange={event=>{const file=event.target.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>12*1024*1024){setError('请选择12MB以内的PNG、JPEG或WebP图片。');return;}const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const images=[...(value.images??demoDefaults(value.demo).images)];images[i]=String(reader.result);patch({images});setError('');};img.onerror=()=>setError('图片无法读取，请换一张。');img.src=String(reader.result);};reader.readAsDataURL(file);}}/><span>{value.images?.[i]?.startsWith('data:')?'已替换':value.images?.[i]?.startsWith('/demo-photos/')?'建筑照片':'示例素材'}</span></label>)}
 {error&&<p role="alert">{error}</p>}<p className="study-form-note">{meta.key==='parallax'&&(value.images?.length===1?'默认将天空与建筑分层运动；替换单张照片后使用照片与画框的错速视差。':'视差请使用同一场景、尺寸对齐的分层图，中景和前景推荐透明PNG或WebP。')}{demoUsesImages(value.demo)?'图片只在本地预览；下载配置会包含替换图片。':meta.key==='voice'?'默认展示无声节奏，替换语音后由真实音量驱动。':isDataDemo(value.demo)?'示例数据可替换；网站与视频共用按帧绘制的图表。':'网页可直接操作；视频导出使用同一组件的自动演示。'}<a href={meta.source} target="_blank" rel="noreferrer">参考机制 ↗</a></p>
 </section>;
};
