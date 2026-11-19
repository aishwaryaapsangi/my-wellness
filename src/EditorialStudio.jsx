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

/* One little pixel-art family across all three Home cards.
   Every motif is drawn in React SVG; no PNG/WebP is loaded by the cards. */
const PIXEL_PALETTE = {
 blush:'#D9A0AE', blushLight:'#EEC4CE', blushDark:'#AF7286',
 cream:'#FFF9EE', yellow:'#F4DDA4', yellowLight:'#FAEAC2',
 brown:'#77565F', sage:'#A9B397'
};
function PixelRect({x,y,w=1,h=1,color,unit=7}) {
 return <rect x={x*unit} y={y*unit} width={w*unit} height={h*unit} fill={color}/>;
}
function PixelCup({x,y,fill,handle='right',design='heart'}) {
 const u=7;
 return <g transform={`translate(${x*u} ${y*u})`}>
  {/* Stepped handle and bowl, all on the same seven-pixel grid. */}
  {handle==='right'
   ? <><PixelRect x={17} y={3} w={4} h={2} color={fill}/><PixelRect x={20} y={5} w={2} h={5} color={fill}/><PixelRect x={17} y={10} w={4} h={2} color={fill}/></>
   : <><PixelRect x={0} y={3} w={4} h={2} color={fill}/><PixelRect x={0} y={5} w={2} h={5} color={fill}/><PixelRect x={0} y={10} w={4} h={2} color={fill}/></>}
  <PixelRect x={4} y={2} w={13} h={10} color={fill}/>
  <PixelRect x={5} y={12} w={11} h={2} color={fill}/>
  <PixelRect x={7} y={14} w={7} h={1} color={fill}/>
  <PixelRect x={4} y={1} w={13} h={2} color={PIXEL_PALETTE.cream}/>
  <PixelRect x={6} y={2} w={9} h={1} color={PIXEL_PALETTE.yellowLight}/>
  {design==='heart'
   ? <><PixelRect x={9} y={6} w={2} h={2} color={PIXEL_PALETTE.cream}/><PixelRect x={12} y={6} w={2} h={2} color={PIXEL_PALETTE.cream}/><PixelRect x={9} y={8} w={5} h={2} color={PIXEL_PALETTE.cream}/><PixelRect x={10} y={10} w={3} h={1} color={PIXEL_PALETTE.cream}/><PixelRect x={11} y={11} w={1} h={1} color={PIXEL_PALETTE.cream}/></>
   : design==='dots'
   ? <><PixelRect x={7} y={6} w={2} h={2} color={PIXEL_PALETTE.cream}/><PixelRect x={12} y={6} w={2} h={2} color={PIXEL_PALETTE.cream}/><PixelRect x={10} y={9} w={2} h={2} color={PIXEL_PALETTE.cream}/></>
   : <><PixelRect x={10} y={6} w={3} h={2} color={PIXEL_PALETTE.blush}/><PixelRect x={9} y={8} w={5} h={2} color={PIXEL_PALETTE.blush}/><PixelRect x={11} y={5} w={1} h={6} color={PIXEL_PALETTE.yellow}/></>}
 </g>;
}
export function MinimalTeacups({className=''}) {
 return <svg className={className} viewBox="0 0 224 336" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
  <PixelCup x={5} y={2} fill={PIXEL_PALETTE.cream} design="flower"/>
  <PixelCup x={3} y={17} fill={PIXEL_PALETTE.yellow} handle="left" design="dots"/>
  <PixelCup x={5} y={32} fill={PIXEL_PALETTE.blush} design="heart"/>
 </svg>;
}
/* The head and snout use the familiar Chrome-Dino profile; square cells
   keep the silhouette legible at small card sizes. */
const DINO_ROWS=[
 '             PPPPPPPP      ',
 '             PPPPPPPP      ',
 '             PPPPPPEP      ',
 '             PPPPPPPP      ',
 '             PPPPPPPPP     ',
 '             PPPPPP        ',
 '             PPPPPPPPP     ',
 '             PPPPPPP       ',
 '            PPPPP          ',
 '           PPPPPP          ',
 '          PPPPPPPP         ',
 '  P      PPPPPPPPPP        ',
 '  PP    PPPPPPPPPPP        ',
 '  PPP  PPPPPPPPPPP         ',
 '  PPPPPPPPPPPPPPP          ',
 '   PPPPPPPPPPPPP           ',
 '     PPPPPPPPPPP           ',
 '       PPPPPPPPPP          ',
 '        PPP  PPP           ',
 '        PPP  PPP           ',
 '        PP    PP           ',
 '        PP    PP           '
];
export function MinimalPixelDino({className=''}) {
 return <svg className={className} viewBox="0 0 189 154" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
  {DINO_ROWS.flatMap((row,y)=>[...row].map((pixel,x)=>pixel===' '?null:<rect key={`${y}-${x}`} x={x*7} y={y*7} width="7" height="7" fill={pixel==='E'?PIXEL_PALETTE.brown:PIXEL_PALETTE.blush}/>))}
 </svg>;
}
const NUMBER_PIXELS={
 '0':['111','101','101','101','111'],'1':['010','110','010','010','111'],
 '2':['111','001','111','100','111'],'3':['111','001','111','001','111'],
 '4':['101','101','111','001','001'],'5':['111','100','111','001','111'],
 '6':['111','100','111','101','111'],'7':['111','001','010','010','010'],
 '8':['111','101','111','101','111'],'9':['111','101','111','001','111']
};
const LETTER_PIXELS={
 A:['010','101','111','101','101'],B:['110','101','110','101','110'],
 C:['011','100','100','100','011'],D:['110','101','101','101','110'],
 E:['111','100','110','100','111'],F:['111','100','110','100','100'],
 G:['011','100','101','101','011'],J:['011','001','001','101','010'],
 L:['100','100','100','100','111'],M:['101','111','111','101','101'],
 N:['101','111','111','111','101'],O:['010','101','101','101','010'],
 P:['110','101','110','100','100'],R:['110','101','110','101','101'],
 S:['011','100','010','001','110'],T:['111','010','010','010','010'],
 U:['101','101','101','101','111'],V:['101','101','101','101','010'],
 Y:['101','101','010','010','010']
};
function PixelWord({value,x,y,unit=4,color,maps}) {
 return <g>{[...String(value)].flatMap((char,i)=>(maps[char]||[]).flatMap((row,j)=>[...row].map((pixel,k)=>pixel==='1'?<rect key={`${i}-${j}-${k}`} x={x+(i*4+k)*unit} y={y+j*unit} width={unit} height={unit} fill={color}/>:null)))}</g>;
}
export function MinimalPixelCalendar({className='',date=new Date()}) {
 const num=String(date.getDate()).padStart(2,'0');
 const month=date.toLocaleString('en-US',{month:'short'}).toUpperCase();
 return <svg className={className} viewBox="0 0 160 192" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
  {/* Tabbed stationery outline and two square binding rings */}
  <rect x="16" y="24" width="128" height="152" fill={PIXEL_PALETTE.cream}/>
  <rect x="16" y="24" width="128" height="28" fill={PIXEL_PALETTE.blushLight}/>
  <rect x="36" y="12" width="16" height="28" fill={PIXEL_PALETTE.blushDark}/>
  <rect x="108" y="12" width="16" height="28" fill={PIXEL_PALETTE.blushDark}/>
  <rect x="40" y="18" width="8" height="22" fill={PIXEL_PALETTE.cream}/>
  <rect x="112" y="18" width="8" height="22" fill={PIXEL_PALETTE.cream}/>
  <PixelWord value={num} x={38} y={70} unit={12} color={PIXEL_PALETTE.blushDark} maps={NUMBER_PIXELS}/>
  <PixelWord value={month} x={57} y={147} unit={4} color={PIXEL_PALETTE.brown} maps={LETTER_PIXELS}/>
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
    <span className="studio-tile-eyebrow">03 / YOUR LITTLE PLANS</span><strong>make space<br/><i>for magic.</i></strong><MinimalPixelCalendar className="studio-tile-art studio-vector-art studio-vector-calendar" /><span className="studio-tile-footer">FLIP TO YOUR CALENDAR <span aria-hidden="true">↗</span></span>
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
