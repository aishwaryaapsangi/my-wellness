import React from 'react';

/**
 * Small decorative vectors for the editorial scrapbook theme.
 * SVG only: no external image assets, heavy animation runtime or remote requests.
 * Both bouquets are decorative (hidden from screen readers).
 */
const COLORS={
  money:{stem:'#648b54',leaf:'#7ea66a',petal:'#f7d78e',petal2:'#e6a4a4',inner:'#dd895e',small:'#c6e3af',stroke:'#55784a'},
  google:{stem:'#34a853',leaf:'#78bb78',petal:'#ea4335',petal2:'#4285f4',inner:'#fbbc05',small:'#fbbc05',stroke:'#29654c'},
  bloom:{stem:'#5d944f',leaf:'#6aaf54',petal:'#fbe9c9',petal2:'#f16791',inner:'#ffce56',small:'#65b5cd',stroke:'#527a48'}
};

function Flower({x,y,scale=1,petal,center,rotation=0,stroke}){
 const petals=Array.from({length:5},(_,i)=><ellipse key={i} cx="0" cy="-19" rx="12" ry="20"
  fill={petal} stroke={stroke} strokeWidth="1.5" transform={'rotate('+(i*72)+')'}/>);
 return <g transform={'translate('+x+' '+y+') rotate('+rotation+') scale('+scale+')'}>{petals}<circle r="13" fill={center} stroke={stroke} strokeWidth="1.4"/><circle r="4" fill="#fff4e4" opacity=".65"/></g>;
}
export default function FlowerBouquet({variant='money',className=''}) {
 const p=COLORS[variant]||COLORS.money;
 return <svg className={'theme-bouquet '+className} viewBox="0 0 308 290" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <g stroke={p.stem} strokeWidth="5" strokeLinecap="round">
   <path d="M144 276C147 233 152 199 131 155C104 102 103 92 100 69"/>
   <path d="M149 274C160 230 182 196 214 172C230 155 229 108 234 84"/>
   <path d="M148 277C149 246 152 213 166 193C172 179 176 161 169 142"/>
  </g>
  <g fill={p.leaf} stroke={p.stroke} strokeWidth="1.8">
   <path d="M146 224C114 224 96 203 91 185C121 182 145 197 146 224Z"/>
   <path d="M160 224C187 220 201 201 207 187C184 185 169 199 160 224Z"/>
   <path d="M122 140C94 139 77 123 70 109C97 106 114 119 122 140Z"/>
   <path d="M197 188C202 156 223 144 244 140C239 163 224 180 197 188Z"/>
   <path d="M154 252C126 254 105 242 100 224C122 220 144 230 154 252Z"/>
  </g>
  <Flower x={100} y={66} scale={1.08} petal={p.petal} center={p.inner} stroke={p.stroke} rotation={-11}/>
  <Flower x={233} y={86} scale={.9} petal={p.petal2} center={p.inner} stroke={p.stroke} rotation={24}/>
  <Flower x={167} y={142} scale={.66} petal={p.small} center={p.inner} stroke={p.stroke} rotation={14}/>
  <g fill={p.inner} opacity=".9">
   <path d="M47 180l5 9 10 1-7 8 2 10-10-5-8 6 1-11-8-6 10-2 5-10Z"/>
   <path d="M269 203l3 7 8 1-6 5 1 7-7-4-7 4 1-8-6-4 9-1 4-7Z"/>
   <circle cx="271" cy="50" r="4"/><circle cx="25" cy="121" r="3"/>
  </g>
  <g fill={p.stroke} opacity=".8">
   <circle cx="54" cy="104" r="2"/><circle cx="290" cy="157" r="3"/><circle cx="42" cy="236" r="3"/>
  </g>
 </svg>;
}
