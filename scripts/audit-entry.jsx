import React,{useEffect,useState} from 'react';
import {Composition,registerRoot,useCurrentFrame,delayRender,continueRender,spring} from 'remotion';
import {DEFAULTS,EFFECTS,previewFrames} from '../src/motion-core.js';
import {TextVisual} from '../src/TextVisual.jsx';
import {loadPreviewFonts} from '../src/TextMotion';

const AuditGrid=({page=0,phase='action',variant={},overview=false})=>{
 const liveFrame=useCurrentFrame();
 const [handle]=useState(()=>delayRender('Audit fonts'));
 useEffect(()=>{loadPreviewFonts(variant.fontFamily).then(()=>continueRender(handle));},[handle,variant.fontFamily]);
 return <div style={{position:'absolute',inset:0,background:'#e8ebef',fontFamily:'sans-serif'}}>
  {(overview?EFFECTS:EFFECTS.slice(page*6,page*6+6)).map((effect,i)=>{
   const props={...DEFAULTS,...variant,effect:effect.id},frames=previewFrames(props);
   const seconds={early:.18,action:.7,late:1.65}[phase];
   const frame=phase==='settled'?frames-24:phase==='live'?Math.min(liveFrame,frames-24):Math.round((props.startSeconds+seconds/props.speed)*30);
   const columns=overview?6:3;
   return <div key={effect.id} style={{position:'absolute',left:(i%columns)*(overview?500:600)+12,top:Math.floor(i/columns)*(overview?340:390)+10,width:overview?468:576,height:overview?320:370}}>
    <div style={{fontSize:overview?20:22,fontWeight:650,color:'#20242b',height:38}}>{effect.code} {effect.name}<span style={{float:'right',fontSize:16,fontWeight:400}}>{(frame/30).toFixed(2)} s</span></div>
    <div style={{position:'absolute',width:900,height:520,transform:overview?'scale(.52)':'scale(.64)',transformOrigin:'top left',overflow:'hidden'}}><TextVisual props={props} frame={frame} fps={30} durationInFrames={frames} spring={spring}/></div>
   </div>;
  })}
 </div>;
};
registerRoot(()=> <><Composition id="AuditGrid" component={AuditGrid} width={1800} height={780} fps={30} durationInFrames={360} defaultProps={{page:0,phase:'action',variant:{}}}/><Composition id="AuditOverview" component={AuditGrid} width={3000} height={1700} fps={30} durationInFrames={360} defaultProps={{page:0,phase:'action',variant:{},overview:true}}/></>);
