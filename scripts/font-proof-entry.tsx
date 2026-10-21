import React,{useEffect,useState} from 'react';
import {Composition,registerRoot,delayRender,continueRender,cancelRender,spring} from 'remotion';
import {TextVisual} from '../src/TextVisual.jsx';
import {FONT_OPTIONS,loadPreviewFonts} from '../src/fonts';
import {DEFAULTS} from '../src/motion-core.js';
const FontProof=()=>{
 const [handle]=useState(()=>delayRender('Six bundled font families'));
 useEffect(()=>{Promise.all(FONT_OPTIONS.map(font=>loadPreviewFonts(font.family))).then(()=>continueRender(handle)).catch(cancelRender);},[handle]);
 return <div style={{position:'absolute',inset:0,background:'#FAF9F6'}}>{FONT_OPTIONS.map((font,i)=><div key={font.family} style={{position:'absolute',left:(i%2)*900,top:Math.floor(i/2)*580,width:900,height:580}}><div style={{position:'absolute',left:55,top:25,fontFamily:'Noto Sans SC',fontSize:26,color:'#66635e'}}>{font.label}</div><div style={{position:'absolute',inset:'60px 0 0'}}><TextVisual props={{...DEFAULTS,fontFamily:font.family,effect:'word',color:'#181717',background:'#FAF9F6'}} frame={156} fps={30} durationInFrames={180} spring={spring}/></div></div>)}</div>;
};
registerRoot(()=> <Composition id="FontProof" component={FontProof} width={1800} height={1740} fps={30} durationInFrames={180}/>);
