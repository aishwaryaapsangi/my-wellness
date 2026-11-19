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
