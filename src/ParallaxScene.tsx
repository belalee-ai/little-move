import React,{useId} from 'react';
import {Img,staticFile} from 'remotion';
import type {DemoProps} from './DemoMotion';

const absolute:React.CSSProperties={position:'absolute'};
const asset=(src:string)=>src.startsWith('/')?staticFile(src.slice(1)):src;

/** The supplied sky/architecture photograph supports a real foreground matte.
 * The matte is specific to this photograph; uploaded photos use frame/photo depth.
 * Existing aligned transparent three-layer configurations remain supported.
 */
export const ParallaxScene:React.FC<{p:DemoProps;s:{x:number;y:number;gain:number}}>=({p,s})=>{
 const filterId='sky-'+useId().replace(/[^a-z0-9-]/gi,''),images=p.images??[],strength=p.strength??1;
 const x=(s.x-.5)*strength*s.gain,y=(s.y-.5)*strength*s.gain;
 const builtIn=images.length===1&&images[0]==='/demo-photos/architecture-golden-arch.jpg';
 const picture=(i:number,style:React.CSSProperties={})=><Img src={asset(images[i])} draggable={false} style={{width:'100%',height:'100%',objectFit:p.fit??'cover',display:'block',...style}}/>;
 return <div style={{...absolute,inset:0,perspective:1100}}>
  {builtIn&&<svg aria-hidden="true" width="0" height="0" style={{...absolute}}><defs>
   <filter id={filterId} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  8 0 -8 0 1.4"/>
   </filter>
  </defs></svg>}
  <div data-parallax-plane="frame" style={{...absolute,left:55,top:44,width:690,height:412,borderRadius:18,background:'#287eae',overflow:'hidden',transform:`translate3d(${x*22}px,${y*14}px,0) rotateX(${-y*9}deg) rotateY(${x*13}deg)`,boxShadow:'0 12px 28px #20202018',willChange:'transform'}}>
   {builtIn?<>
    {/* Sample only unobstructed sky from the same source, avoiding a duplicate arch. */}
    <svg data-parallax-plane="sky" aria-hidden="true" viewBox="40 30 600 360" preserveAspectRatio="xMidYMid slice" style={{...absolute,inset:-20,width:'calc(100% + 40px)',height:'calc(100% + 40px)',transform:`translate3d(${-x*18}px,${-y*12}px,0)`,willChange:'transform'}}><image href={asset(images[0])} width="1600" height="2133"/></svg>
    <div data-parallax-plane="architecture" style={{...absolute,inset:-125,transform:`translate3d(${x*135}px,${y*84}px,0)`,willChange:'transform'}}>{picture(0,{filter:`url(#${filterId})`})}</div>
   </>:images.length===1?<div data-parallax-plane="photo" style={{...absolute,inset:-125,transform:`translate3d(${-x*135}px,${-y*84}px,0)`,willChange:'transform'}}>{picture(0)}</div>:
    images.slice(0,3).map((_,i)=><div key={i} data-parallax-plane={['far','middle','near'][i]} style={{...absolute,inset:-125,transform:`translate3d(${x*[-24,58,135][i]}px,${y*[-16,38,84][i]}px,0)`,willChange:'transform'}}>{picture(i,{objectFit:'contain'})}</div>)}
  </div>
 </div>;
};
