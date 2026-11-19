import React from 'react';

/**
 * Small resolution-independent pencil & wash illustrations.
 * Each image is a different subject. They are deliberately compact accents;
 * the existing low-resolution raster images are never stretched to fill cards.
 */
const Filters=({id})=><defs>
  <filter id={id+'paper'} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency=".052" numOctaves="3" seed="7" stitchTiles="stitch" result="grain"/>
    <feComposite in="grain" in2="SourceGraphic" operator="in" result="mask"/>
    <feBlend in="SourceGraphic" in2="mask" mode="multiply"/>
  </filter>
  <linearGradient id={id+'rose'} x1="0" x2=".8" y1="0" y2="1"><stop stopColor="#F7D5DE"/><stop offset=".68" stopColor="#D99DAE"/><stop offset="1" stopColor="#B9788B"/></linearGradient>
  <linearGradient id={id+'cream'} x1="0" x2=".9" y1="0" y2="1"><stop stopColor="#FFF9E8"/><stop offset="1" stopColor="#E9D7B7"/></linearGradient>
  <linearGradient id={id+'blue'} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#DBEAF2"/><stop offset="1" stopColor="#92B3CE"/></linearGradient>
  <linearGradient id={id+'yellow'} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#FFF0B9"/><stop offset="1" stopColor="#E9BA69"/></linearGradient>
</defs>;

export function TeaCupSketch({className=''}) {
 const id='mugs-';
 return <svg className={className} viewBox="0 0 380 360" role="img" aria-label="Pastel hand-sketched stack of three patterned teacups" xmlns="http://www.w3.org/2000/svg">
  <Filters id={id}/>
  <g stroke="#A37E79" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter={'url(#'+id+'paper)'}>
   <path d="M115 266q-11-19-3-35 18-13 35-3l91 3q15 4 17 18l-10 62q-36 33-109 2Z" fill={'url(#'+id+'rose)'}/>
   <path d="M255 246q46-14 46 19 0 30-52 24" fill="none" strokeWidth="13"/>
   <path d="M255 246q43-11 40 20-1 20-41 16" fill="none" stroke="#F1C4CB" strokeWidth="9"/>
   <ellipse cx="187" cy="236" rx="69" ry="14" fill="#FFF1DD"/>
   <path d="M145 251q16 8 25 3m27 5q15 5 24 0m-77 28q22 10 38 1m29 1q15 4 28-2" fill="none" stroke="#FFF8E8" strokeWidth="5" opacity=".7"/>
   <path d="M137 172q-15-17-2-28 23-10 35-5h77q14 2 19 14l-17 72q-40 21-91-1Z" fill={'url(#'+id+'blue)'}/>
   <path d="M265 150q43-10 39 16-2 24-48 18" fill="none" stroke="#8AA7B5" strokeWidth="13"/>
   <path d="M265 150q36-9 34 15-2 15-43 11" fill="none" stroke="#EAF4F4" strokeWidth="9"/>
   <ellipse cx="200" cy="142" rx="67" ry="13" fill="#FFF4E0"/>
   <path d="M160 155q5 13 16 5m29 4q7 12 15 0m25 8q6 8 11 0" stroke="#FFF7EB" strokeWidth="5" fill="none"/>
   <path d="M133 83q-7-22 15-26 17-4 29-3l71 4q13 3 14 19l-12 54q-33 23-96-4Z" fill={'url(#'+id+'yellow)'}/>
   <path d="M261 72q45-16 46 16 0 30-47 23" fill="none" stroke="#D7AA68" strokeWidth="14"/>
   <path d="M261 72q42-12 39 16-1 21-40 16" fill="none" stroke="#FBE5A8" strokeWidth="9"/>
   <ellipse cx="195" cy="58" rx="68" ry="14" fill="#F4DABA"/>
   <ellipse cx="195" cy="58" rx="57" ry="8" fill="#A96E53"/>
   <g fill="#F4E3DB" stroke="none"><circle cx="152" cy="98" r="7"/><circle cx="200" cy="92" r="7"/><circle cx="238" cy="104" r="7"/></g>
   <path d="M177 273q7-11 15 1 9-12 17-1 1 13-17 22-16-8-15-22Z" fill="#FFF3E3" stroke="none"/>
   <path d="M187 199q8-15 16 0 10-14 17 0 1 13-16 22-17-9-17-22Z" fill="#F5D0DA" stroke="none"/>
  </g>
  <path d="M102 66q-9-9-3-21m13 22q11-10 10-23" fill="none" stroke="#CEABA3" strokeWidth="3.5" opacity=".64" strokeLinecap="round"/>
  <g fill="#E6B5C2"><path d="m85 178 5-13 6 13 13 5-13 5-6 13-5-13-13-5Z"/><circle cx="302" cy="207" r="4"/></g>
 </svg>;
}

export function JavaStudySketch({className=''}) {
 const id='java-';
 return <svg className={className} viewBox="0 0 420 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pastel hand-drawn coding notes, a Java mug and a tiny flower vase">
  <Filters id={id}/>
  <g filter={'url(#'+id+'paper)'} stroke="#AF8A84" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
   <path d="M75 68q0-9 12-12l165 5q11 0 13 14l-8 176q-2 10-12 12l-167-9q-10-2-9-14Z" fill={'url(#'+id+'cream)'}/>
   <path d="M89 73q22-4 45-2m-55 9 175 9M89 115l137 6m-138 22 151 5m-150 24 110 2m-111 22 144 5m-145 23 116 5" fill="none" stroke="#9FB9C7" strokeWidth="2" opacity=".52"/>
   <rect x="100" y="89" width="112" height="29" rx="8" fill="#F5CDCE" stroke="none"/>
   <path d="M115 105l-10 5 10 5m55-9 10 5-10 5" stroke="#B4717C" strokeWidth="4" fill="none"/>
   <path d="M141 105l-9 14" stroke="#D2A265" strokeWidth="3" fill="none"/>
   <path d="M120 148l11 3 8-3m-14 27 9 2m-11 23 33 3" fill="none" stroke="#C4889F" strokeWidth="3.5"/>
   <path d="M270 173q-20-10-36 1l-6 51q4 30 45 35 38 0 43-33l-6-47q-16-17-40-7Z" fill={'url(#'+id+'blue)'}/>
   <ellipse cx="271" cy="176" rx="42" ry="12" fill="#FFF4E1"/>
   <path d="M311 193q34-16 38 8 2 21-36 20" fill="none" stroke="#9CB8CA" strokeWidth="12"/>
   <path d="M311 193q30-12 30 8 0 12-29 12" fill="none" stroke="#EDF4F3" strokeWidth="7"/>
   <path d="M273 160q-12-15 2-28m5 29q15-13 5-27" fill="none" stroke="#C59D85" strokeWidth="3" opacity=".7"/>
   <path d="M280 226q-13-11-1-17 8-3 11 5 8-8 13 0 2 10-13 18Z" fill="#F3CBCE" stroke="none"/>
   <path d="M289 58l-2 84 45-2 2-86Z" fill="#D2BDA3"/>
   <path d="M284 50q14 9 29 1 13-3 22 3v13q-25-7-50 0Z" fill="#D5BE9E"/>
   <path d="M312 53q-12-20-6-38m-1 50q-1-18-20-31m27 28q4-16 23-31" fill="none" stroke="#8CA482" strokeWidth="5"/>
   <path d="M306 27q-12-5-17 4 4 13 18 7m3-12q15-9 19-1-1 14-19 14m-3-16q-1-15 12-13 9 9-2 17" fill="#DFB2BE" stroke="#B38B9B" strokeWidth="1.4"/>
   <path d="M53 238q-18 0-20 16l9 13 48 3" fill="#EFCBD7" stroke="none"/>
   <path d="m45 272 13-11 9 13 14-15 14 15" fill="none" stroke="#D9A0AF" strokeWidth="3.5"/>
  </g>
  <path d="m347 118 6-18 7 18 16 5-17 7-7 17-6-17-17-7Z" fill="#EAC983" opacity=".75"/>
 </svg>;
}

export function JournalMorningSketch({className=''}) {
 const id='journal-';
 return <svg className={className} viewBox="0 0 420 340" role="img" aria-label="Soft pencil-style sketch of a pink journal, tea, and little flowers">
  <Filters id={id}/>
  <g filter={'url(#'+id+'paper)'} strokeLinecap="round" strokeLinejoin="round" stroke="#B18A83" strokeWidth="2">
   <ellipse cx="206" cy="301" rx="157" ry="16" fill="#DDBBBB" opacity=".22" stroke="none"/>
   <path d="M62 193q-3-12 13-16l115-21q14-2 26 6l28 19 95-12q15 0 16 15l7 105q-2 11-13 13l-118-4q-12-1-19-8l-116 12q-10 0-14-11Z" fill="#E4AEBB"/>
   <path d="M73 180q57-22 129-18l11 18 24-12q50-14 110 5l6 109q-66-14-126 5-70-10-142 9Z" fill={'url(#'+id+'cream)'}/>
   <path d="M215 180q-3 55 12 107" fill="none" stroke="#BD9996" strokeWidth="3"/>
   <path d="M104 212l79-17m-73 36 69-13m-62 30 58-16m-46 30 52-12M260 210l67-9m-61 23 61-10m-53 29 50-9" fill="none" stroke="#C6ADB5" strokeWidth="2.2" opacity=".8"/>
   <path d="M135 275q12-16 22-2 8-15 22-8" fill="none" stroke="#D18DAB" strokeWidth="3"/>
   <path d="M278 264q10-16 20-3 15-17 24 1" fill="none" stroke="#B6C59E" strokeWidth="3"/>
   <path d="M84 86q-12-15 6-23l93-2q23 3 20 21l-5 46q-4 20-53 20-42 1-53-17Z" fill={'url(#'+id+'blue)'}/>
   <ellipse cx="144" cy="73" rx="61" ry="17" fill="#FFF2D5"/>
   <ellipse cx="144" cy="73" rx="51" ry="10" fill="#AD8167"/>
   <path d="M197 91q30-14 34 10 3 21-33 21" stroke="#AAC2D0" strokeWidth="14" fill="none"/>
   <path d="M197 91q27-10 28 9 1 14-27 14" stroke="#F3F5E9" strokeWidth="8" fill="none"/>
   <path d="M126 51q-7-11 2-21m25 22q13-13 4-25" fill="none" stroke="#C8B1A0" strokeWidth="3.5"/>
   <path d="M316 80l11 91 45-4-8-92Z" fill="#EFD4BC"/>
   <ellipse cx="344" cy="78" rx="26" ry="10" fill="#F7DECB"/>
   <path d="M341 74q-22-15-22-35m22 35q18-20 17-43" fill="none" stroke="#98AC88" strokeWidth="5"/>
   <path d="M324 44q-11-9-23-2 0 18 19 16m31-25q19-8 23 1-5 18-22 15" fill="#D8A9B9"/>
   <path d="M330 59q-19-10-29 1 5 18 22 14" fill="#E6C1CC"/>
  </g>
  <path d="m263 43 5-10 5 10 13 3-13 5-5 12-5-12-13-5Z" fill="#EBCF8A"/>
  <path d="m48 145 5-10 5 10 12 4-12 5-5 11-5-11-12-5Z" fill="#E5B1C3"/>
 </svg>;
}

export function CozyCodingCoverSketch({className=''}) {
 const id='cover-';
 return <svg className={className} viewBox="0 0 480 355" role="img" aria-label="Pastel sketch of a laptop showing Java code beside a notebook, mug, and desk flowers">
  <Filters id={id}/>
  <g filter={'url(#'+id+'paper)'} stroke="#9F8584" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
   <path d="M70 281q65-20 170-7 131 7 180-2l5 32q-166 28-342 3Z" fill="#E9CCB7" stroke="none"/>
   <g transform="rotate(-5 217 161)">
    <rect x="104" y="76" width="250" height="160" rx="15" fill="#DAB0C1" stroke="#AA849B" strokeWidth="4"/>
    <rect x="117" y="88" width="223" height="134" rx="6" fill="#FFF7E7" stroke="none"/>
    <path d="M119 91h220v27H119Z" fill="#BED3E2" stroke="none"/>
    <circle cx="133" cy="105" r="4" fill="#D697A7" stroke="none"/><circle cx="147" cy="105" r="4" fill="#EDD18E" stroke="none"/><circle cx="161" cy="105" r="4" fill="#AFBD9B" stroke="none"/>
    <path d="M170 152l-18 16 18 16m60-32 18 16-18 16" fill="none" stroke="#A97F91" strokeWidth="8"/>
    <path d="M208 145l-17 47" fill="none" stroke="#DBB773" strokeWidth="5"/>
    <path d="M269 156h47m-47 15h37m-37 15h44" fill="none" stroke="#9CAFA4" strokeWidth="4" opacity=".9"/>
    <path d="M89 238h278l24 19q-151 19-322 0Z" fill="#BFD0DE" stroke="#96A9B5" strokeWidth="3"/>
    <path d="M211 240h50l7 6h-63Z" fill="#FFF7EB" stroke="none"/>
   </g>
   <path d="M45 216q5-10 13-9h62q10 1 12 12l-4 51q-17 24-70 11Z" fill={'url(#'+id+'yellow)'}/>
   <ellipse cx="90" cy="213" rx="44" ry="11" fill="#FFF2DA"/>
   <path d="M126 233q32-7 32 15 0 20-29 15" fill="none" stroke="#D1B084" strokeWidth="11"/>
   <path d="M74 253q10-14 20-4 8-9 18 0" fill="none" stroke="#D99EA7" strokeWidth="4"/>
   <path d="M376 212q12-14 26-1l25 56-78 3Z" fill="#F7E6D5"/>
   <path d="M366 212q25-16 49 0" fill="none" stroke="#EAB8BF" strokeWidth="7"/>
   <path d="M365 208q-2-25-16-42m18 43q18-32 27-49m-25 49q0-32 5-55" fill="none" stroke="#94AC87" strokeWidth="4.5"/>
   <path d="M347 161q-20-15-29-1 7 22 29 14m34-20q19-17 30-4-3 23-27 21m-11-22q-3-19 12-18 17 7 1 22" fill="#E4ADBC" stroke="#B78D9B" strokeWidth="1.2"/>
   <path d="M346 277q-25 2-36 17l93 3q8-8 2-14Z" fill="#9EAD92" stroke="none"/>
  </g>
  <path d="m76 128 6-14 6 14 13 5-13 6-6 14-6-14-13-6Z" fill="#E6BE81" opacity=".8"/>
 </svg>;
}
