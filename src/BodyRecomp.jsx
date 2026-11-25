import React,{useMemo,useState} from 'react';
import {RECOMP_START,RECOMP_END,RECOMP_BASELINE,RECOMP_REVIEWS,WEEK_FOCUS,RECOMP_EXERCISES,RECOMP_RECIPES,RECOMP_GROCERIES,buildRecompDay,allRecompDays,exercisesForSession} from './bodyRecompData.js';
import './bodyRecomp.css';

const LIMIT=56;
const dateToTime=s=>Date.parse(s+'T12:00:00Z');
const moveDate=(key,step)=>new Date(dateToTime(key)+step*86400000).toISOString().slice(0,10);
const dateLabel=key=>new Date(key+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
const validDate=key=>key>=RECOMP_START&&key<=RECOMP_END;
const sessions=['Lower A','Upper A + Core','Lower B','Upper B + Core'];
const isLift=session=>sessions.includes(session);
const statusName={love:'♡ love it',try:'✿ want to try',skip:'↷ skip'};
const allDays=allRecompDays();

function InputField({label,value,onChange,type='text',min,max,step,placeholder}){
 return <label className="rg-field"><span className="rg-label">{label}</span><input className="rg-input" type={type} value={value??''} onChange={e=>onChange(e.target.value)} min={min} max={max} step={step} placeholder={placeholder}/></label>;
}
function RecompCard({children,tone=''}){return <section className={'rg-panel '+tone}>{children}</section>}
function normalizeRepList(ex,log){return Array.from({length:ex.sets},(_,i)=>log?.reps?.[i]??'')}
function progressionStatus(ex,log){
 if(!log||!log.weight&&log.weight!==0)return 'Enter this movement’s actual working resistance to establish a baseline.';
 const reps=normalizeRepList(ex,log);
 if(reps.some(v=>v===''||!Number.isFinite(Number(v))))return 'Log every set before deciding whether to progress.';
 if(log.pain==='yes')return 'Pain reported: do not increase. Review technique and seek professional advice if needed.';
 if(reps.some(v=>Number(v)<ex.high))return 'Repeat this load next session; aim for a clean additional rep when ready.';
 if(log.rir===''||log.rir==null)return 'Top reps reached. Record reps in reserve (RIR) before deciding.';
 const rir=Number(log.rir);
 if(rir>3)return 'This resistance may be easy; verify range and technique before making a modest increase.';
 if(rir>=1&&rir<=3)return 'Eligible to CONSIDER the smallest safe increase next session if form was stable and recovery is good.';
 return 'Work at the current load until you can complete reps with control and a little reserve.';
}
function mealName(plan,fitness,kind){return fitness?.mealOverrides?.[plan.date]?.[kind]||plan[kind]}
function RecompGarden({fitness={},onChange}){
 const now=new Date();
 const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const [date,setDate]=useState(validDate(today)?today:RECOMP_START);
 const [view,setView]=useState('today');
 const [recipeType,setRecipeType]=useState('All');
 const [recipeSearch,setRecipeSearch]=useState('');
 const [newRecipe,setNewRecipe]=useState({name:'',type:'Dinner',ingredients:'',instructions:'',adjustments:'',nutrients:''});
 const [showCreate,setShowCreate]=useState(false);
 const plan=buildRecompDay(date);
 const recipes=useMemo(()=>[...RECOMP_RECIPES,...(fitness.customRecipes||[])],[fitness.customRecipes]);
 const workout=exercisesForSession(plan?.session);
 const doneDays=Object.values(fitness.dayDone||{}).filter(Boolean).length;
 const loggedSets=Object.values(fitness.logs||{}).reduce((total,day)=>total+Object.values(day||{}).reduce((n,record)=>n+(record?.reps||[]).filter(v=>v!==''&&v!=null).length,0),0);
 const update=change=>onChange(old=>typeof change==='function'?change(old||{}):{...(old||{}),...change});
 const patchDay=(key,field,value)=>update(old=>({...old,daily:{...old.daily,[key]:{...(old.daily?.[key]||{}),[field]:value}}}));
 const patchLog=(ex,patch)=>update(old=>({...old,logs:{...old.logs,[date]:{...(old.logs?.[date]||{}),[ex.id]:{...(old.logs?.[date]?.[ex.id]||{}),...patch}}}}));
 const chooseMeal=(kind,name)=>update(old=>({...old,mealOverrides:{...old.mealOverrides,[date]:{...(old.mealOverrides?.[date]||{}),[kind]:name}}}));
 const markDone=checked=>update(old=>({...old,dayDone:{...old.dayDone,[date]:checked}}));
 const setRecipeRating=(id,value)=>update(old=>({...old,recipeRatings:{...old.recipeRatings,[id]:value}}));
 const toggleShopping=index=>update(old=>({...old,shopping:{...old.shopping,[index]:!old.shopping?.[index]}}));
 const patchReview=(key,field,value)=>update(old=>({...old,reviews:{...old.reviews,[key]:{...(old.reviews?.[key]||{}),[field]:value}}}));
 const saveCustomRecipe=e=>{e.preventDefault();if(!newRecipe.name.trim()||!newRecipe.ingredients.trim())return;
  const entry={...newRecipe,name:newRecipe.name.trim(),id:'custom-'+Date.now(),yield:'Personal recipe'};
  update(old=>({...old,customRecipes:[...(old.customRecipes||[]),entry]}));
  setShowCreate(false);setNewRecipe({name:'',type:'Dinner',ingredients:'',instructions:'',adjustments:'',nutrients:''});
 };
 const recentExercise=(ex)=>{
   const dates=Object.keys(fitness.logs||{}).filter(d=>d<date&&fitness.logs[d]?.[ex.id]).sort();
   const last=dates.length?dates[dates.length-1]:null;return last?{date:last,...fitness.logs[last][ex.id]}:null;
 };
 const selectedLog=fitness.logs?.[date]||{};
 const daily=fitness.daily?.[date]||{};
 const filteredRecipes=recipes.filter(r=>(recipeType==='All'||r.type.toLowerCase().includes(recipeType.toLowerCase()))&&(!recipeSearch||[r.name,r.ingredients].join(' ').toLowerCase().includes(recipeSearch.toLowerCase())));
 const completedReview=RECOMP_REVIEWS.filter(d=>fitness.reviews?.[d]?.notes?.trim()).length;
 return <div className="recomp-garden">
  <section className="rg-cover">
   <div><p className="rg-eyebrow">✿ BODY RECOMP · YOUR STRENGTH CHAPTER</p><h1>stronger, softly.</h1><p>56 little days of strength, food you actually enjoy, and sustainable progress. A plan to follow, not a body to punish.</p></div>
   <div className="rg-date-nav"><button className="rg-button" aria-label="Previous date" disabled={date<=RECOMP_START} onClick={()=>setDate(moveDate(date,-1))}>‹</button><input aria-label="Selected fitness date" type="date" value={date} min={RECOMP_START} max={RECOMP_END} onChange={e=>validDate(e.target.value)&&setDate(e.target.value)}/><button className="rg-button" aria-label="Next date" disabled={date>=RECOMP_END} onClick={()=>setDate(moveDate(date,1))}>›</button></div>
  </section>
  <nav aria-label="Body recomp sections" className="rg-tabbar">
   {[['today','Today'],['train','Workout log'],['meals','Meal plan'],['recipes','Recipe box'],['prep','Grocery + prep'],['checkins','Check-ins'],['calendar','56-day calendar']].map(([id,label])=><button key={id} className={'rg-tab '+(view===id?'active':'')} onClick={()=>setView(id)} aria-current={view===id?'page':undefined}>{label}</button>)}
  </nav>
  {view==='today'&&<>
   <div className="rg-metrics">
    <div className="rg-metric"><small>Week</small><strong>{plan.week} / 8</strong><span>{dateLabel(date)}</span></div>
    <div className="rg-metric"><small>Today's rhythm</small><strong style={{fontSize:'18px'}}>{plan.session}</strong><span>Recovery is part of training</span></div>
    <div className="rg-metric"><small>Workout sets logged</small><strong>{loggedSets}</strong><span>Across your program</span></div>
    <div className="rg-metric"><small>Days checked off</small><strong>{doneDays} / {LIMIT}</strong><span>No penalties for missed days</span></div>
   </div>
   <div className="rg-grid">
    <RecompCard tone="blush"><p className="rg-eyebrow">This week's focus</p><h3>{WEEK_FOCUS[plan.week-1]}</h3><p>{plan.note}</p><div className="rg-hint">{plan.cardio}</div><div className="rg-actions">{isLift(plan.session)&&<button className="rg-button primary" onClick={()=>setView('train')}>Log today's lifts ↗</button>}<button className="rg-button" onClick={()=>markDone(!fitness.dayDone?.[date])}>{fitness.dayDone?.[date]?'✓ Marked complete':'Mark day complete'}</button></div></RecompCard>
    <RecompCard><p className="rg-eyebrow">Today's food</p><h3>Nourish & enjoy ♡</h3>{['breakfast','lunch','dinner','snack'].map(kind=><p key={kind}><b style={{textTransform:'capitalize'}}>{kind}:</b> {mealName(plan,fitness,kind)}</p>)}<button className="rg-button" onClick={()=>setView('meals')}>Edit today's meals ↗</button></RecompCard>
    <RecompCard><p className="rg-eyebrow">Recovery check-in</p><h3>How are you feeling?</h3><div className="rg-form-grid">
      <InputField label="Sleep (hours)" value={daily.sleep} onChange={v=>patchDay(date,'sleep',v)} type="number" min="0" max="24" step=".5"/>
      <InputField label="Water (glasses, your size)" value={daily.water} onChange={v=>patchDay(date,'water',v)} type="number" min="0" max="30"/>
      <label className="rg-field"><span className="rg-label">Stress</span><select className="rg-select" value={daily.stress||''} onChange={e=>patchDay(date,'stress',e.target.value)}><option value="">Select</option>{[1,2,3,4,5].map(v=><option key={v}>{v}</option>)}</select></label>
      <label className="rg-field"><span className="rg-label">Energy</span><select className="rg-select" value={daily.energy||''} onChange={e=>patchDay(date,'energy',e.target.value)}><option value="">Select</option>{[1,2,3,4,5].map(v=><option key={v}>{v}</option>)}</select></label>
    </div><p className="rg-soft">No mandatory water quota or calorie deficit. Drink regularly, eat enough, and pay attention to recovery.</p></RecompCard>
    <RecompCard tone="sage"><p className="rg-eyebrow">A little preparation</p><h3>{plan.session==='Rest + meal prep'?'Sunday food reset':'Tomorrow starts tonight'}</h3><p>{plan.prep}</p><p>Choose favorites in the recipe box so the food plan evolves with your actual taste, not an influencer's.</p><button className="rg-button" onClick={()=>setView('prep')}>View prep & groceries</button></RecompCard>
   </div>
  </>}
  {view==='train'&&<>
    <div className="rg-grid">
     <RecompCard><p className="rg-eyebrow">{dateLabel(date)} · week {plan.week}</p><h3>{plan.session}</h3><p>{isLift(plan.session)?'Work through the prescribed movements below. Enter weights for this exercise—not a guessed universal starting weight.':'No mandatory strength session today. Recovery and life outside the gym are part of the plan.'}</p><div className="rg-hint">{plan.cardio}</div></RecompCard>
     <RecompCard tone="sage"><p className="rg-eyebrow">Your overload rule</p><h3>Repeat → improve → add</h3><p>When every set reaches the top of its rep range with controlled technique, no pain and approximately 1–3 good reps left, consider the smallest safe load increase next time. Never increase automatically.</p><p>For your straight-leg captain's-chair raise, the existing 5 lb added load is a baseline—not a requirement to drop to knee raises.</p></RecompCard>
    </div>
    {isLift(plan.session)?<div className="rg-session-list" style={{marginTop:16}}>{workout.map(ex=>{
      const log=selectedLog[ex.id]||{};const prev=recentExercise(ex);const reps=normalizeRepList(ex,log);
      return <div className="rg-exercise" key={ex.id}>
       <div className="rg-exercise-top"><div><h4>{ex.name}</h4><p>{ex.cue}</p></div><span className="rg-badge">{ex.sets} × {ex.low}–{ex.high}</span></div>
       {prev&&<p className="rg-count">Previous: {dateLabel(prev.date)} · {prev.weight||'bodyweight'} lb · {(prev.reps||[]).join(' / ')} reps</p>}
       <div className="rg-log-grid">
         <InputField label="Weight (lb)" type="number" min="0" step=".5" value={log.weight??''} placeholder={ex.startingWeight?String(ex.startingWeight)+' baseline':'Actual lb'} onChange={v=>patchLog(ex,{weight:v})}/>
         {reps.map((n,i)=><InputField key={i} label={'Set '+(i+1)} type="number" min="0" value={n} placeholder={String(ex.low)} onChange={v=>{const next=[...reps];next[i]=v;patchLog(ex,{reps:next})}}/>)}
         <label className="rg-field"><span className="rg-label">RIR</span><select className="rg-select" value={log.rir??''} onChange={e=>patchLog(ex,{rir:e.target.value})}><option value="">Choose</option>{[0,1,2,3,4,5].map(v=><option key={v} value={v}>{v}{v===5?'+':''}</option>)}</select></label>
         <label className="rg-field"><span className="rg-label">Pain?</span><select className="rg-select" value={log.pain??'no'} onChange={e=>patchLog(ex,{pain:e.target.value})}><option value="no">No</option><option value="yes">Yes</option></select></label>
       </div>
       <div className={'rg-hint '+(progressionStatus(ex,log).startsWith('Eligible')?'ready':'')}>{progressionStatus(ex,log)}</div>
       <label className="rg-field" style={{marginTop:9}}><span className="rg-label">Form / recovery notes</span><input className="rg-input" value={log.notes||''} onChange={e=>patchLog(ex,{notes:e.target.value})} placeholder="Form, tempo, symptoms or how the set felt"/></label>
      </div>
    })}</div>:<RecompCard><h3>Enjoy your recovery day</h3><p>{plan.prep}</p></RecompCard>}
   </>}
  {view==='meals'&&<>
    <div className="rg-grid">
      <RecompCard><p className="rg-eyebrow">{dateLabel(date)}</p><h3>Today's menu</h3><div className="rg-meal-list">{['breakfast','lunch','dinner','snack'].map(kind=><div className="rg-meal-card" key={kind}><h4>{kind}</h4><p>{mealName(plan,fitness,kind)}</p><label className="rg-field"><span className="rg-label">Swap for a recipe</span><select className="rg-select" value={fitness.mealOverrides?.[date]?.[kind]||''} onChange={e=>chooseMeal(kind,e.target.value)}><option value="">Use planned meal</option>{recipes.filter(r=>fitness.recipeRatings?.[r.id]!=='skip').map(r=><option key={r.id} value={r.name}>{r.name}</option>)}</select></label></div>)}</div></RecompCard>
      <RecompCard tone="sage"><h3>Meals for muscle & energy</h3><p>Build meals with protein, colorful vegetables or fruit, carbohydrates, and fats. Our default plan favors vegetarian meals with modest added oil; foods are not morally good or bad.</p><p>Prep 2–3 days at a time; refrigerate promptly and freeze extras. If a meal doesn't appeal, swap it—consistency comes from eating food you enjoy.</p><p className="rg-notice">Your plan intentionally does not set a weight-loss calorie target. Given past menstrual irregularity and appetite changes, check with your clinician or dietitian before attempting a deficit.</p></RecompCard>
    </div>
  </>}
  {view==='recipes'&&<>
    <RecompCard tone="blush"><p className="rg-eyebrow">Build your own recipe collection</p><h3>Keep what tastes good. Skip what doesn't.</h3><p>Your ratings and personal recipes stay in browser storage. Mark recipes you love, filter the list, and assign recipes to a day's meals. We'll develop this box together as you try more food.</p>
    <div className="rg-form-grid">
      <label className="rg-field"><span className="rg-label">Type</span><select className="rg-select" value={recipeType} onChange={e=>setRecipeType(e.target.value)}>{['All','Breakfast','Lunch','Dinner','Snack'].map(t=><option key={t}>{t}</option>)}</select></label>
      <InputField label="Find a recipe" value={recipeSearch} onChange={setRecipeSearch} placeholder="Search chia, tofu, spinach..."/>
    </div><div className="rg-actions"><button className="rg-button primary" onClick={()=>setShowCreate(v=>!v)}>{showCreate?'Close form':'+ Add my own recipe'}</button><span className="rg-count">{recipes.filter(r=>fitness.recipeRatings?.[r.id]==='love').length} favorites</span></div>
    {showCreate&&<form onSubmit={saveCustomRecipe} style={{marginTop:14}} className="rg-form-grid">
      {['name','type','ingredients','instructions','adjustments','nutrients'].map(k=><label key={k} className="rg-field"><span className="rg-label">{k}</span><textarea className="rg-textarea" rows={k==='ingredients'||k==='instructions'?3:2} required={k==='name'||k==='ingredients'} value={newRecipe[k]} onChange={e=>setNewRecipe(old=>({...old,[k]:e.target.value}))}/></label>)}<button className="rg-button primary" type="submit">Save personal recipe</button>
    </form>}</RecompCard>
    <div className="rg-recipe-list" style={{marginTop:16}}>{filteredRecipes.map(r=><article className="rg-recipe-card" key={r.id}>
      <p className="rg-eyebrow">{r.type} · {r.yield}</p><h4>{r.name}</h4>
      <div className="rg-actions"><label className="rg-field"><span className="rg-label">My verdict</span><select className="rg-select" value={fitness.recipeRatings?.[r.id]||'try'} onChange={e=>setRecipeRating(r.id,e.target.value)}>{Object.keys(statusName).map(key=><option key={key} value={key}>{statusName[key]}</option>)}</select></label></div>
      <p><b>Ingredients</b> · {r.ingredients}</p><p><b>Make it</b> · {r.instructions}</p><p><b>Adjust it</b> · {r.adjustments}</p><p className="rg-recipe-meta"><b>Highlights</b> · {r.nutrients}</p>
      <div className="rg-actions"><button className="rg-button rg-small" onClick={()=>{chooseMeal('lunch',r.name);setView('meals')}}>Use for today's lunch</button><button className="rg-button rg-small" onClick={()=>{chooseMeal('dinner',r.name);setView('meals')}}>Use for today's dinner</button></div>
    </article>)}</div>
  </>}
  {view==='prep'&&<>
    <div className="rg-grid">
     <RecompCard tone="sage"><p className="rg-eyebrow">Sunday · 45–75 minutes</p><h3>Batch & breathe</h3><p>Cook grains and legumes; prep tofu or eggs; roast a couple trays of vegetables; make one sauce. Save a few portions for the next two or three days and freeze later extras.</p></RecompCard>
     <RecompCard><p className="rg-eyebrow">Wednesday · 20–30 minutes</p><h3>Midweek refresh</h3><p>Top up fresh greens and protein, check what you're actually enjoying, and swap meals rather than forcing yourself to eat something you don't want.</p></RecompCard>
    </div>
    <RecompCard><h3>Grocery & prep checklist</h3>{RECOMP_GROCERIES.map((g,i)=><label key={g.category} className="rg-check"><input type="checkbox" checked={!!fitness.shopping?.[i]} onChange={()=>toggleShopping(i)}/><span><b>{g.category}</b><br/>{g.items}<br/><span>{g.prep} · {g.note}</span></span></label>)}<button className="rg-button" style={{marginTop:15}} onClick={()=>update(old=>({...old,shopping:{}}))}>Reset grocery checkboxes</button></RecompCard>
  </>}
  {view==='checkins'&&<>
   <div className="rg-grid">
    <RecompCard tone="sage"><p className="rg-eyebrow">Your milestones</p><h3>Dec 22 · Jan 19</h3><p>Check strength, energy, appetite, technique and recovery. Record visual changes only if helpful; a flatter stomach or lower scale number is not a required milestone.</p><p>Reviews written: {completedReview} / {RECOMP_REVIEWS.length}</p></RecompCard>
    <RecompCard><h3>What progress looks like</h3><p>✓ More clean reps at the same load.<br/>✓ A safe increase on a familiar exercise.<br/>✓ Better energy and consistent meals.<br/>✓ Recovery that feels sustainable.<br/>✓ Showing up without exercise becoming a punishment.</p></RecompCard>
   </div>
   <div className="rg-grid" style={{marginTop:16}}>{RECOMP_REVIEWS.map((d,i)=><RecompCard key={d}><p className="rg-eyebrow">{i===0?'Baseline':i===4?'Four-week review':i===8?'Eight-week review':'Weekly review'} · {dateLabel(d)}</p>
    <InputField label="Strength / performance notes" value={fitness.reviews?.[d]?.strength} onChange={v=>patchReview(d,'strength',v)} placeholder="What became easier?"/>
    <InputField label="Energy, digestion, recovery" value={fitness.reviews?.[d]?.energy} onChange={v=>patchReview(d,'energy',v)} placeholder="How did your week feel?"/>
    <label className="rg-field"><span className="rg-label">My reflection</span><textarea className="rg-textarea" value={fitness.reviews?.[d]?.notes||''} onChange={e=>patchReview(d,'notes',e.target.value)} placeholder="What worked? What will I adjust?"/></label>
   </RecompCard>)}</div>
  </>}
  {view==='calendar'&&<RecompCard><h3>The complete 56-day rhythm</h3><p>Follow your schedule by date. Each day can be opened for meals, logs, and recovery.</p><div className="rg-table-wrap"><table className="rg-day-table"><thead><tr><th>Date</th><th>Week</th><th>Session</th><th>Breakfast</th><th>Lunch</th><th>Done</th></tr></thead><tbody>{allDays.map(d=><tr key={d.date} className={date===d.date?'current':''}><td><button onClick={()=>{setDate(d.date);setView('today')}}>{dateLabel(d.date)}</button></td><td>{d.week}</td><td>{d.session}</td><td>{mealName(d,fitness,'breakfast')}</td><td>{mealName(d,fitness,'lunch')}</td><td>{fitness.dayDone?.[d.date]?'✓':'—'}</td></tr>)}</tbody></table></div></RecompCard>}
  <p className="rg-notice" style={{marginTop:20}}>This is an adaptable wellness tracker, not an individualized medical prescription. If you experience pain, unusual weakness, poor recovery, or menstrual changes, reduce training and discuss symptoms with your clinician. Your entries are stored in this browser and included in Bloom & Balance's JSON backup.</p>
 </div>
}
export default RecompGarden;
