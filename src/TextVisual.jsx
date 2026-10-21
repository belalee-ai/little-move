import React from 'react';
import {motionModel} from './motion-core.js';
export const TextVisual=({props,frame,fps,durationInFrames,spring})=>{
 const model=motionModel(props,frame,fps,durationInFrames,spring);
 const rootStyle={position:'absolute',inset:0,fontSynthesis:'none',...model.surfaceStyle};
 const glyph=g=><span key={g.index} style={g.clipStyle}><span style={g.style}>{g.char}</span></span>;
 return <div style={rootStyle}>
  {model.layers.map(layer=><span key={layer.index} style={layer.style}/>)}
  {model.markers.map(marker=><svg key={marker.index} aria-hidden="true" style={marker.style} viewBox="0 0 1000 100" preserveAspectRatio="none"><path d={marker.path} fill={marker.color}/></svg>)}
  {model.ghosts.map(g=><span key={g.index} style={g.clipStyle}><span style={g.style}>{g.char}</span></span>)}
  {model.impactStyle?<div style={model.impactStyle}>{model.glyphs.map(glyph)}</div>:model.circleStyles.length?model.circleStyles.map(ring=><div key={ring.prefix} style={ring.style}>{model.glyphs.filter(g=>g.index.startsWith(ring.prefix)).map(glyph)}</div>):model.glyphs.map(glyph)}
  <span style={model.cursorStyle}/>{model.cursorStyles.map((style,i)=><span key={'cursor-'+i} style={style}/>)}<span style={model.lineStyle}/>
 </div>;
};
