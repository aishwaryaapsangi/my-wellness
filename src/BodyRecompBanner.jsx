import React,{useState} from 'react';
import './bodyRecompBanner.css';
// Prefer the original generated transparent raster illustrations.
// Temporary SVG fallback is retained until original WebP files are present in public/art.
const asset=(name,ext='webp')=>import.meta.env.BASE_URL+'art/body-recomp-'+name+'.'+ext;
function Illustration({name,className}){
 const [fallback,setFallback]=useState(false);
 return <img className={className} src={asset(name,fallback?'svg':'webp')} alt="" onError={()=>{if(!fallback)setFallback(true)}}/>;
}
export default function BodyRecompBanner(){return <section className="recomp-editorial-hero" aria-label="Body recomp and everyday wellness garden">
 <div className="reh-grid" aria-hidden="true"/>
 <div className="reh-copy"><span className="reh-kicker">✿ &nbsp; THE STRENGTH & NOURISH CHAPTER &nbsp; ✿</span><span className="reh-edition">BLOOM & BALANCE · LITTLE RITUALS</span><h1>stronger,<br/><em>softly.</em><span className="reh-heart" aria-hidden="true">♡</span></h1><p>A little strength, something nourishing, and room to feel good in the life you have today.</p><div className="reh-ribbon"><span>✳ MOVE</span><span>✿ NOURISH</span><span>☾ REST</span><span>♡ GROW</span></div><span className="reh-handwritten">my healthy era, at my own pace ↗</span></div>
 <div className="reh-scene" aria-hidden="true"><Illustration className="reh-window" name="nyc-window"/><Illustration className="reh-clouds" name="clouds"/><Illustration className="reh-woman" name="woman"/><div className="reh-note"><span>♡ your little reset</span><strong>feel good,<br/>get stronger.</strong><small>progress, not punishment</small></div></div>
 </section>}
