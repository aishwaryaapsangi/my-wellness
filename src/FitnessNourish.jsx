import React from 'react';
import {dateTitle,offset,weekday,PERIOD_START,PERIOD_END} from './planner.js';
import './fitness-nourish.css';

const meals=[
 ['Idli and sambar','Dal, rice, vegetables and curd','Paneer, roti and sabzi'],
 ['Blueberry banana yogurt smoothie and toast','Rajma chawal and cucumber','Tofu, rice and vegetables'],
 ['Poha with yogurt','Chole, roti and sabzi','Palak paneer and rice'],
 ['Oats, fruit and nuts','Dal, rice and greens','Vegetable khichdi and curd'],
 ['Cottage cheese toast and fruit','Homemade thali','Family meal of your choice'],
 ['Banana oatmeal and yogurt','Paneer wrap and soup','Chana masala and roti'],
 ['Dosa and sambar','Vegetable pulao and curd','Dal, rice and vegetables']
];
const equipment=[
 ['Leg press','Knee and hip extension','Ask a trainer to check seat fit and foot support.'],
 ['Glute bridge','Hip extension','Review pelvic positioning and comfortable range.'],
 ['Seated leg curl','Knee flexion','Check the machine pivot and pad alignment.'],
 ['Hip abduction','Lateral hip movement','Review seat fit and controlled movement.'],
 ['Lat pulldown','Vertical pull','Review handle position and shoulder comfort.'],
 ['Seated row','Horizontal pull','Review torso stability and handle position.'],
 ['Chest press','Horizontal push','Review seat height and wrist alignment.'],
 ['Captain’s chair','Hip flexion and trunk stabilization','Ask about controlled movement and avoiding swinging.']
];
const dateKey=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
export default function FitnessNourish({date,onSelect}){
 const wd=weekday(date),m=meals[wd],work=wd>0&&wd<6;
 const timeline=[
 ['7:00 AM','Morning','Get ready, drink water and enjoy a relaxed start.'],
 ['7:30 AM','Breakfast',m[0]],
 ['10:30 AM','Snack break','Fruit, yogurt, nuts or a snack you enjoy.'],
 ['12:30 PM','Lunch',m[1]],
 ['3:30 PM','Afternoon','Water and a satisfying snack if hungry.'],
 ['5:00 PM','Transition',work?'Finish work and commute.':'Enjoy personal time.'],
 ['Evening','Movement or rest','If visiting the gym, warm up comfortably, follow your trainer’s guidance, and cool down. Optional enjoyable cardio if you feel recovered.'],
 ['7:00 PM','Dinner',m[2]],
 ['8:00 PM','Personal time','Coding, friends, hobbies or relaxation.'],
 ['9:30 PM','Wind down','Prepare for tomorrow and allow enough time for sleep.']
 ];
 const days=Array.from({length:46},(_,i)=>offset(PERIOD_START,i));
 return <section className="fn-studio">
 <header className="fn-hero"><p className="eyebrow">BLOOM & BALANCE · DAILY STUDIO</p><h1>Fitness &amp; Nourish ✿</h1><p>Make room for meals, movement, rest and the rest of your life.</p></header>
 <div className="fn-date"><button disabled={date<=PERIOD_START} onClick={()=>onSelect(offset(date,-1))}>Previous</button><label>Choose date <input type="date" min={PERIOD_START} max={PERIOD_END} value={date} onChange={e=>{if(e.target.value)onSelect(e.target.value)}}/></label><button disabled={date>=PERIOD_END} onClick={()=>onSelect(offset(date,1))}>Next</button><button onClick={()=>onSelect(dateKey(new Date()))}>Today</button></div>
 <div className="fn-calendar" aria-label="Season dates">{days.map(d=><button key={d} aria-pressed={d===date} onClick={()=>onSelect(d)}>{d.slice(5).replace('-','/')}</button>)}</div>
 <h2>{dateTitle(date)}</h2><p>{work?'Work: 9 AM – 5 PM. Allow for your actual commute and breaks.':'Flexible weekend rhythm.'} Times are suggestions, not rules. Eat enough and adjust meals to your needs.</p>
 <div className="fn-columns"><section className="fn-panel"><h3>Morning to evening</h3>{timeline.map(([time,title,body])=><article className="fn-slot" key={title}><small>{time}</small><div><strong>{title}</strong><p>{body}</p></div></article>)}</section>
 <aside className="fn-panel"><h3>Gym visit guide</h3><p>Choose movement you enjoy, or rest. A trainer can help choose appropriate exercises and resistance.</p><ol><li>Check how you feel and warm up comfortably.</li><li>Check equipment setup and practice controlled movement.</li><li>Rest as needed between movements.</li><li>Optional comfortable cardio, not a requirement.</li><li>Cool down, rehydrate and eat a satisfying meal.</li></ol><h3>Hydration &amp; nourishment</h3><p>Keep water available throughout the day and drink according to thirst and activity. Include carbohydrates, protein and fats in meals. Supplements are not a substitute for food; discuss individual needs with a clinician.</p><h3>Progressive overload: the idea</h3><p>As the body adapts, a qualified trainer can assess whether a change in challenge is appropriate. Movement control and recovery matter; progress is not a requirement to lift more each visit.</p><p>Stop if you have sharp pain, dizziness or unusual fatigue.</p></aside></div>
 <section className="fn-panel"><h3>Equipment reference</h3><div className="fn-equipment">{equipment.map(([name,action,cue])=><details key={name}><summary>{name}</summary><p><b>{action}</b></p><p>{cue}</p></details>)}</div></section>
 <section className="fn-panel"><h3>Further learning</h3><p><a href="https://www.planetfitness.com/" target="_blank" rel="noreferrer">Planet Fitness equipment and trainer resources</a></p><p><a href="https://www.healthychildren.org/english/healthy-living/sports/pages/strength-training.aspx" target="_blank" rel="noreferrer">Strength training guidance</a></p><p>Video transcripts have not been verified; no creator-specific advice is attributed here.</p></section>
 </section>;
}
