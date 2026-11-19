import React from 'react';

// Tiny, accessible-to-ignore vector artwork: no image requests or heavy canvas runtime.
// Drawn to complement the retro flower / notebook visual system.
export function RetroFlower({color='#E36888',center='#F2D88F',size=44,className=''}) {
 const petals=Array.from({length:8},(_,i)=><ellipse key={i} cx="0" cy="-20" rx="10" ry="16" transform={`rotate(${i*45})`} fill={color}/>);
 return <svg className={className} width={size} height={size} viewBox="-42 -42 84 84" aria-hidden="true" focusable="false"><g>{petals}</g><circle r="12" fill={center}/><circle r="3" fill="#fff7e8" opacity=".8"/></svg>;
}
export function RetroSparkle({color='#F08C21',size=30,className=''}) {
 return <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M20 0c2.5 12 6.5 16 20 20-13.5 4-17.5 8-20 20C17.5 28 13.5 24 0 20 13.5 16 17.5 12 20 0Z" fill={color}/></svg>;
}
export function RetroGoogleWordmark() {
 return <div className="retro-google-lockup" aria-label="Google SWE studio">
  <span className="retro-google-letters" aria-hidden="true"><b>G</b><b>o</b><b>o</b><b>g</b><b>l</b><b>e</b></span>
  <span className="retro-google-swe">SWE <i>studio!</i></span>
 </div>;
}
export function RetroDecor({variant='bloom',className=''}) {
 return <div className={'retro-decor retro-decor--'+variant+' '+className} aria-hidden="true">
   <RetroFlower color={variant==='google'?'#EA4335':'#E36888'} center="#F2D88F" size={48} className="retro-decor-flower retro-decor-flower--a"/>
   <RetroFlower color={variant==='google'?'#4285F4':'#F08C21'} center="#FFF6E3" size={34} className="retro-decor-flower retro-decor-flower--b"/>
   <RetroSparkle color={variant==='google'?'#FBBC05':'#B4B534'} size={27} className="retro-decor-sparkle"/>
   <span className="retro-decor-squiggle">〰</span>
 </div>;
}
