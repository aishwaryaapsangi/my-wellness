import React from 'react';
import './bodyRecompBanner.css';
// Five transparent SVG files are separately maintainable under public/art.
const asset=name=>import.meta.env.BASE_URL+'art/body-recomp-'+name+'.svg';
export default function BodyRecompBanner(){return <section className="recomp-editorial-hero" aria-label="Body recomp and everyday wellness garden">
 <div className="reh-grid" aria-hidden="true"/>
 <div className="reh-copy"><span className="reh-kicker">✿ &nbsp; THE STRENGTH & NOURISH CHAPTER &nbsp; ✿</span><span className="reh-edition">BLOOM & BALANCE · LITTLE RITUALS</span><h1>stronger,<br/><em>softly.</em><span className="reh-heart" aria-hidden="true">♡</span></h1><p>A little strength, something nourishing, and room to feel good in the life you have today.</p><div className="reh-ribbon"><span>✳ MOVE</span><span>✿ NOURISH</span><span>☾ REST</span><span>♡ GROW</span></div><span className="reh-handwritten">my healthy era, at my own pace ↗</span></div>
 <div className="reh-scene" aria-hidden="true"><img className="reh-window" src={asset('nyc-window')} alt=""/><img className="reh-clouds" src={asset('clouds')} alt=""/><img className="reh-woman" src={asset('woman')} alt=""/><img className="reh-drinks" src={asset('drinks')} alt=""/><img className="reh-gear" src={asset('gear')} alt=""/><div className="reh-note"><span>♡ your little reset</span><strong>feel good,<br/>get stronger.</strong><small>progress, not punishment</small></div></div>
 <span className="reh-seal" aria-hidden="true">wellness<br/>in bloom<br/>✿</span>
 </section>}
