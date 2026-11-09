import React, {useEffect, useRef, useState} from 'react';
import type {DemoProps} from '../DemoMotion';
import {demoFrames} from '../demos/catalog.js';
import {clamp, rest, retarget} from './motion.js';
import {
  autoHeaderAt, headerVisibility, initialHeader, scrollLimit, settleHeader, trackHeader,
} from './scroll-header.js';

const viewportHeight = 400;
const barHeight = 66;
const sections = [
  {number: '01', title: 'Field Notes', paper: '#f8f8f2', ink: '#d9e5d6'},
  {number: '02', title: 'Design Index', paper: '#edf2eb', ink: '#c2d7c8'},
  {number: '03', title: 'Reading List', paper: '#f4eee3', ink: '#e6cead'},
];

export const ScrollHeader: React.FC<{p: DemoProps; frame: number; fps: number}> = ({p, frame, fps}) => {
  const live = Boolean(p.native);
  const reduced = Boolean(p.reducedMotion || p.native?.reducedMotion);
  const speed = clamp(p.speed ?? 1, .5, 2);
  const period = demoFrames(p, fps);
  const [position, setPosition] = useState(0);
  const [command, setCommand] = useState(() => rest(1));
  const tracking = useRef(initialHeader);

  useEffect(() => {
    tracking.current = initialHeader;
    setPosition(0);
    setCommand(rest(1));
  }, [live]);

  useEffect(() => {
    if (!live) return;
    setCommand(previous => settleHeader(previous, frame, fps, period, speed));
  }, [frame, fps, live, period, speed]);

  const automatic = autoHeaderAt(frame / fps * speed, reduced);
  const scrollPosition = live ? position : automatic.position;
  const visibility = live ? headerVisibility(command, frame, fps, period, speed, reduced) : automatic.visibility;
  const headerY = -(1 - visibility) * (barHeight + 10);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const nextPosition = clamp(event.currentTarget.scrollTop, 0, scrollLimit);
    const next = trackHeader(tracking.current, nextPosition);
    if (next.hidden !== tracking.current.hidden) {
      setCommand(previous => retarget(previous, next.hidden ? 0 : 1, frame, fps / speed, period, reduced));
    }
    tracking.current = next;
    setPosition(nextPosition);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const pane = event.currentTarget;
    switch (event.key) {
      case 'Home': pane.scrollTop = 0; break;
      case 'End': pane.scrollTop = scrollLimit; break;
      case 'ArrowDown': pane.scrollTop += 58; break;
      case 'ArrowUp': pane.scrollTop -= 58; break;
      case 'PageDown': pane.scrollTop += viewportHeight - 72; break;
      case 'PageUp': pane.scrollTop -= viewportHeight - 72; break;
      default: return;
    }
    event.preventDefault();
  };

  const accent = p.accent ?? '#203c37';
  const rgb = [1, 3, 5].map(start => Number.parseInt(accent.slice(start, start + 2), 16) / 255);
  const linear = rgb.map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
  const luminance = .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
  const ink = luminance > .179 ? '#151a19' : '#fff';

  return <div data-scroll-header="" data-scroll-position={scrollPosition.toFixed(2)}
    data-header-visibility={visibility.toFixed(4)}
    style={{position:'absolute', left:55, top:50, width:690, height:viewportHeight, overflow:'hidden',
      borderRadius:18, background:'#f8f8f2', boxShadow:'0 12px 32px #172c2920', pointerEvents:live?'auto':'none'}}>
    <div key={live?'live':'auto'} data-header-scroll-pane="" tabIndex={live?0:-1}
      role={live?'region':undefined} aria-label={live?'滚动导航操作区，支持滚轮、触屏滑动和上下方向键':undefined}
      onScroll={live?onScroll:undefined} onKeyDown={live?onKeyDown:undefined}
      style={{position:'absolute', inset:0, overflowX:'hidden', overflowY:live?'auto':'hidden',
        overscrollBehavior:'contain', scrollbarWidth:'none', outlineOffset:-4, touchAction:live?'pan-y':'auto'}}>
      <div style={{height:viewportHeight+scrollLimit, transform:live?undefined:`translateY(${-scrollPosition}px)`}}>
        <div style={{height:barHeight}}/>
        {sections.map(({number,title,paper,ink}, i) => <div key={number}
          style={{height:326, position:'relative', padding:'56px 42px 0', boxSizing:'border-box',
            background:paper, color:'#203c37', borderTop:i?'1px solid #173f3320':undefined}}>
          <span style={{fontSize:22, fontWeight:700, fontVariantNumeric:'tabular-nums', color:'#526b61'}}>{number}</span>
          <div style={{fontSize:46, fontWeight:700, letterSpacing:-1.4, margin:'12px 0 23px'}}>{title}</div>
          {[232,202,152].map(width => <div key={width} aria-hidden="true"
            style={{width,height:6,borderRadius:3,background:'#55716844',marginBottom:12}}/>)}
          <svg aria-hidden="true" width="218" height="205" viewBox="0 0 218 205"
            style={{position:'absolute',right:52,top:44,borderRadius:10,background:ink}}>
            <circle cx={79+i*19} cy={91-i*9} r="50" fill="none" stroke="#28463d" strokeWidth="2"/>
            <path d={['M25 164 192 47','M22 102 193 151','M31 49 185 161'][i]} stroke="#28463d" strokeWidth="2"/>
            <circle cx={154-i*22} cy={100+i*10} r="22" fill="#28463d"/>
          </svg>
        </div>)}
      </div>
    </div>
    <div data-header-bar="" aria-hidden="true"
      style={{position:'absolute',left:0,right:0,top:0,height:barHeight,display:'flex',
        alignItems:'center',justifyContent:'space-between',padding:'0 70px 0 42px',gap:20,boxSizing:'border-box',
        background:accent,color:ink,transform:`translateY(${headerY}px)`,pointerEvents:'none',
        boxShadow:'0 4px 6px #172c2926'}}>
      <span style={{fontSize:26,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
        {p.title || 'Field Journal'}
      </span>
      <svg width="28" height="20" viewBox="0 0 28 20" style={{flexShrink:0}}>
        <path d="M2 5h24M2 15h17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
    <div aria-hidden="true" style={{position:'absolute',right:12,top:84,bottom:22,width:4,
      background:'#2f514126',borderRadius:4,pointerEvents:'none'}}>
      <div style={{position:'absolute',top:246*scrollPosition/scrollLimit,width:4,height:48,borderRadius:4,background:'#476857'}}/>
    </div>
  </div>;
};
