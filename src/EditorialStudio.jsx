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

/* Home-card artwork: tiny, scalable SVG shapes. Shared palette with the CSS calendar.
   The artwork is intentionally flat and outline-free; the watercolor banner stays separate. */
export function MinimalTeacups({className=''}) {
 return <svg className={className} viewBox="0 0 240 258" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <g transform="translate(0 1)">
   <path d="M66 23 Q66 15 79 15 H177 Q189 15 189 27 V69 Q189 95 162 99 H99 Q70 95 66 69Z" fill="#FFFBF2"/>
   <path d="M188 29 Q219 26 216 55 Q214 75 188 73" fill="none" stroke="#FFFBF2" strokeWidth="12" strokeLinecap="round"/>
   <path d="M77 21H178" stroke="#D99AA6" strokeWidth="6" strokeLinecap="round"/>
   <circle cx="122" cy="57" r="8" fill="#E6ACB8"/><circle cx="143" cy="57" r="8" fill="#E6ACB8"/><circle cx="133" cy="48" r="8" fill="#E6ACB8"/><circle cx="133" cy="65" r="8" fill="#E6ACB8"/><circle cx="133" cy="57" r="5" fill="#EECF8D"/>
  </g>
  <g transform="translate(0 79)">
   <path d="M59 25 Q59 17 72 17 H171 Q184 17 184 30 V77 Q184 101 155 104 H92 Q65 101 59 77Z" fill="#F5DEA1"/>
   <path d="M60 33Q34 28 33 52 Q32 72 60 73" fill="none" stroke="#F5DEA1" strokeWidth="13" strokeLinecap="round"/>
   <ellipse cx="121" cy="25" rx="62" ry="9" fill="#F9E8BE"/>
   <circle cx="103" cy="61" r="8" fill="#FFFBF2"/><circle cx="145" cy="61" r="8" fill="#FFFBF2"/>
  </g>
  <g transform="translate(0 163)">
   <path d="M53 20 Q53 12 66 12 H168 Q182 12 182 25 V69 Q182 95 156 99 H81 Q56 95 53 69Z" fill="#DDA3AE"/>
   <path d="M182 26 Q218 20 216 51 Q215 74 181 72" fill="none" stroke="#DDA3AE" strokeWidth="13" strokeLinecap="round"/>
   <ellipse cx="118" cy="19" rx="65" ry="9" fill="#F5C8D0"/>
   <path d="M114 53 C103 37 86 49 95 61 L116 80 L137 61 C146 47 127 37 114 53Z" fill="#FFF9EE"/>
  </g>
 </svg>;
}
export function MinimalPixelDino({className=''}) {
 return <svg className={className} viewBox="0 0 210 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
  <path d="M89 18H150V28H169V75H150V84H118V96H137V108H146V129H157V140H146V149H134V140H126V158H113V174H99V150H80V173H65V149H52V139H38V126H27V111H16V95H30V111H40V122H54V105H65V94H76V39H89Z" fill="#DDA3AE"/>
  <path d="M89 18H150V28H169V45H155V33H104V45H89Z" fill="#EFC3CD"/>
  <rect x="139" y="45" width="10" height="10" rx="0" fill="#795B62"/>
  <rect x="154" y="67" width="15" height="9" fill="#F7E4D5"/>
  <path d="M77 108H90V121H77Z" fill="#EFC3CD"/>
  <path d="M99 150H113V174H99Z" fill="#C88799"/>
  <path d="M65 149H80V173H65Z" fill="#C88799"/>
 </svg>;
}

export function EditorialStudioStrip({onNavigate}) {
 return <section className="studio-strip" aria-label="Explore your personal studio">
  <div className="studio-strip-heading"><div><span className="studio-eyebrow">✳ THE LITTLE STUDIO INDEX</span><h2>your world, <em>in full color.</em></h2></div><p>A little joy in the everyday. Pick a chapter and make it your own.</p></div>
  <div className="studio-strip-grid">
   <button type="button" className="studio-tile studio-tile--pink" onClick={()=>onNavigate('studio')}>
    <span className="studio-tile-eyebrow">01 / THE RITUALS</span><strong>a soft place<br/><i>to bloom.</i></strong><MinimalTeacups className="studio-tile-art studio-vector-art studio-vector-teacups" /><span className="studio-tile-footer">VISIT THE RITUAL STUDIO <span aria-hidden="true">↗</span></span>
   </button>
   <button type="button" className="studio-tile studio-tile--blue" onClick={()=>onNavigate('swe')}>
    <span className="studio-tile-eyebrow">02 / THE BIG DREAM</span><strong>code. create.<br/><i>go further!</i></strong><MinimalPixelDino className="studio-tile-art studio-vector-art studio-vector-dino" /><span className="studio-tile-footer">OPEN THE SWE STUDIO <span aria-hidden="true">↗</span></span>
   </button>
   <button type="button" className="studio-tile studio-tile--butter" onClick={()=>onNavigate('calendar')}>
    <span className="studio-tile-eyebrow">03 / YOUR LITTLE PLANS</span><strong>make space<br/><i>for magic.</i></strong><div className="studio-date-art studio-date-art--minimal" aria-hidden="true"><span className="studio-date-ring"/><span className="studio-date-number">{new Date().getDate()}</span><span className="studio-date-month">{new Date().toLocaleString("en-US",{month:"short"}).toUpperCase()}</span></div><span className="studio-tile-footer">FLIP TO YOUR CALENDAR <span aria-hidden="true">↗</span></span>
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
