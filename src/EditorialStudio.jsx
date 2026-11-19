import React from 'react';

/* Small original vector compositions. These are purposeful editorial artwork,
   not stock images, and don't need downloads or a JS animation library. */
function Flower({x,y,r=20,color='#E36888',middle='#F2D88F'}) {
 return <g transform={`translate(${x} ${y})`}>{Array.from({length:8},(_,i)=><ellipse key={i} cy={-r*.75} ry={r*.72} rx={r*.36} transform={`rotate(${i*45})`} fill={color} stroke="#7F5750" strokeWidth="1.2"/>)}<circle r={r*.38} fill={middle} stroke="#7F5750" strokeWidth="1.3"/><circle r={r*.12} fill="#FFF6E3"/></g>;
}
function Leaf({x,y,flip=false}){return <path d={`M${x} ${y}q${flip?-37:37} -47 ${flip?-55:55} -21q${flip?19:-19} 37 ${flip?55:-55} 21`} fill="#B4B534" stroke="#66853B" strokeWidth="2"/>}
export function FloralCeramicArt({className=''}) {
 return <svg className={className} viewBox="0 0 360 245" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated colorful ceramic flower vase, flowers and hand-drawn leaves">
 <ellipse cx="180" cy="224" rx="140" ry="11" fill="#CF8B79" opacity=".22"/>
 <path d="M174 164Q153 107 112 60M184 165Q198 88 250 42M179 166Q176 80 170 30" stroke="#568744" strokeWidth="8" fill="none" strokeLinecap="round"/>
 <Leaf x={150} y={111}/><Leaf x={208} y={123} flip/>
 <Flower x={110} y={57} r={29} color="#F08C21"/><Flower x={250} y={42} r={28} color="#E36888" middle="#FFF6E3"/><Flower x={170} y={31} r={27} color="#6698CC"/>
 <path d="M133 153Q144 172 140 196Q139 211 153 217Q178 227 217 217Q232 212 221 192Q212 167 224 152Z" fill="#6698CC" stroke="#854D51" strokeWidth="3"/>
 <ellipse cx="178" cy="153" rx="47" ry="11" fill="#F2D88F" stroke="#854D51" strokeWidth="3"/>
 <path d="M224 169Q270 154 268 187Q261 211 220 202" fill="none" stroke="#F08C21" strokeWidth="14" strokeLinecap="round"/>
 <Flower x={177} y={184} r={14} color="#E36888"/><path d="M155 208q23-12 43-1" stroke="#F2D88F" strokeWidth="5" strokeLinecap="round" fill="none"/>
 <path d="M65 199l7-16 7 16 15 7-15 6-7 15-7-15-15-6Z" fill="#F2D88F"/>
 </svg>;
}
export function RetroLaptopArt({className=''}) {
 return <svg className={className} viewBox="0 0 350 245" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated retro laptop with colorful coding window, smiling flower, and sticker motifs">
 <ellipse cx="179" cy="221" rx="144" ry="11" fill="#2A4E8C" opacity=".15"/>
 <g transform="rotate(-6 180 130)"><rect x="57" y="32" width="242" height="162" rx="15" fill="#EA4335" stroke="#6B3E3B" strokeWidth="4"/>
 <rect x="69" y="44" width="218" height="136" rx="7" fill="#FFF6E3"/>
 <rect x="69" y="44" width="218" height="27" rx="7" fill="#4285F4"/>
 <circle cx="86" cy="58" r="4" fill="#F2D88F"/><circle cx="101" cy="58" r="4" fill="#F2D88F"/><circle cx="116" cy="58" r="4" fill="#34A853"/>
 <path d="M103 97l-20 18 20 18M159 97l20 18-20 18" stroke="#EA4335" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
 <path d="M135 88l-16 55" stroke="#34A853" strokeWidth="8" strokeLinecap="round"/>
 <rect x="205" y="94" width="55" height="7" rx="3" fill="#F2D88F"/><rect x="205" y="110" width="37" height="7" rx="3" fill="#6698CC"/><rect x="205" y="127" width="49" height="7" rx="3" fill="#B4B534"/>
 <path d="M42 195h272l20 19Q180 226 20 214Z" fill="#6698CC" stroke="#6B3E3B" strokeWidth="4"/>
 <rect x="149" y="197" width="53" height="6" rx="3" fill="#DCE8FF"/>
 </g>
 <Flower x={289} y={32} r={20} color="#FBBC05" middle="#EA4335"/>
 <path d="M38 47l5-18 7 18 18 5-18 7-7 19-5-19-17-7Z" fill="#34A853"/>
 </svg>;
}
export function StudioRibbon({variant='rose'}) {
 const google=variant==='google';
 return <div className={'studio-ribbon studio-ribbon--'+variant} aria-hidden="true">
  <svg viewBox="0 0 1160 115" preserveAspectRatio="none" focusable="false">
   <defs><path id={'studio-ribbon-path-'+variant} d="M-40 68C120 10 220 15 370 67S650 112 800 55S1050 7 1200 58"/></defs>
   <path d="M-40 68C120 10 220 15 370 67S650 112 800 55S1050 7 1200 58" stroke={google?'#FBBC05':'#F2D88F'} strokeWidth="56" strokeLinecap="round" fill="none"/>
   <text fill={google?'#315E83':'#9C3E53'} fontSize="16" fontWeight="900" letterSpacing="3.5" fontFamily="DM Sans, sans-serif">
    <textPath href={'#studio-ribbon-path-'+variant} startOffset="1%">{google?'CODE • CREATE • LEARN • GROW • GOOGLE SWE STUDIO • CODE • CREATE •':'LITTLE RITUALS • BIG BLOOMS • MAKE IT YOURS • LITTLE RITUALS • BIG BLOOMS •'}</textPath>
   </text>
  </svg>
 </div>;
}
export function EditorialStudioStrip({onNavigate}) {
 return <section className="studio-strip" aria-label="Explore your personal studio">
  <div className="studio-strip-heading"><div><span className="studio-eyebrow">✳ THE LITTLE STUDIO INDEX</span><h2>your world, <em>in full color.</em></h2></div><p>A little joy in the everyday. Pick a chapter and make it your own.</p></div>
  <div className="studio-strip-grid">
   <button type="button" className="studio-tile studio-tile--pink" onClick={()=>onNavigate('studio')}>
    <span className="studio-tile-eyebrow">01 / THE RITUALS</span><strong>a soft place<br/><i>to bloom.</i></strong><img className="studio-tile-art pastel-studio-art" src={`${import.meta.env.BASE_URL}art/ritual-teacups-v2.webp`} width="788" height="920" alt="" loading="lazy" decoding="async" /><span className="studio-tile-footer">VISIT THE RITUAL STUDIO <span aria-hidden="true">↗</span></span>
   </button>
   <button type="button" className="studio-tile studio-tile--blue" onClick={()=>onNavigate('swe')}>
    <span className="studio-tile-eyebrow">02 / THE BIG DREAM</span><strong>code. create.<br/><i>go further!</i></strong><img className="studio-tile-art pastel-studio-art" src={`${import.meta.env.BASE_URL}art/studio-java-v2.webp`} width="1024" height="692" alt="" loading="lazy" decoding="async" /><span className="studio-tile-footer">OPEN THE SWE STUDIO <span aria-hidden="true">↗</span></span>
   </button>
   <button type="button" className="studio-tile studio-tile--butter" onClick={()=>onNavigate('calendar')}>
    <span className="studio-tile-eyebrow">03 / YOUR LITTLE PLANS</span><strong>make space<br/><i>for magic.</i></strong><div className="studio-date-art" aria-hidden="true"><span>✿</span><span>19</span><span>NOV</span></div><span className="studio-tile-footer">FLIP TO YOUR CALENDAR <span aria-hidden="true">↗</span></span>
   </button>
  </div>
 </section>;
}
export function GoogleEditorialShelf({onTab}) {
 return <section className="google-editorial-shelf" aria-label="Explore Google SWE study tools">
  <div className="google-shelf-heading"><span>✳ THE CODING CORNER</span><strong>pick your next <i>adventure.</i></strong></div>
  <div className="google-shelf-grid">
   <button type="button" className="google-shelf-card google-shelf-card--blue" onClick={()=>onTab('leetcode')}><span className="google-shelf-small">01 / PRACTICE</span><span className="google-shelf-symbol" aria-hidden="true">{'{ }'}</span><strong>LeetCode<br/><i>dojo</i></strong><span className="google-shelf-action">OPEN THE DOJO ↗</span></button>
   <button type="button" className="google-shelf-card google-shelf-card--yellow" onClick={()=>onTab('plan')}><span className="google-shelf-small">02 / EVERYDAY</span><span className="google-shelf-symbol google-shelf-flower" aria-hidden="true">✿</span><strong>little steps,<br/><i>big brain.</i></strong><span className="google-shelf-action">TODAY'S PLAN ↗</span></button>
   <button type="button" className="google-shelf-card google-shelf-card--green" onClick={()=>onTab('journey')}><span className="google-shelf-small">03 / THE JOURNEY</span><span className="google-shelf-symbol" aria-hidden="true">✳</span><strong>road to<br/><i>Google.</i></strong><span className="google-shelf-action">SEE THE ROADMAP ↗</span></button>
  </div>
 </section>;
}
