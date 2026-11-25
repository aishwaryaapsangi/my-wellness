import React,{useMemo,useState} from 'react';
import {RECOMP_START,RECOMP_END,RECOMP_REVIEWS,WEEK_FOCUS,buildRecompDay,allRecompDays,exercisesForSession} from './bodyRecompData.js';
import {RICH_RECIPES,recipeById,mealIdsForDate,namedMeal,weeklyGrocery,weeklyMealDates} from './bodyRecompMeals.js';
import {getPrescription,getCardioPrescription,nextMatchingDates,incrementFor,weightUnit} from './bodyRecompProgress.js';
import BodyRecompBanner from './BodyRecompBanner.jsx';
import './bodyRecomp.css';

const dates=allRecompDays();
const kinds=['breakfast','lunch','dinner','snack'];
const dateTime=s=>Date.parse(s+'T12:00:00Z');
const moveDate=(s,days)=>new Date(dateTime(s)+days*86400000).toISOString().slice(0,10);
const pretty=s=>new Date(s+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
const isTraining=session=>['Lower A','Lower B','Upper A + Core','Upper B + Core'].includes(session);
const renderLb=value=>value===null||value===undefined?'set your baseline':String(value)+' lb';
const renderWeight=(value,ex)=>value===null||value===undefined?'choose a trial load':String(value)+' '+weightUnit(ex);
const emojiFor=type=>type.includes('Breakfast')?'🫐':type.includes('Snack')?'🍓':type.includes('Morning')?'🥬':type.includes('Dinner')?'🍲':'🥗';
const sections=[['today','Daily plan'],['train','My workouts'],['meals','Meals'],['recipes','Recipe book'],['prep','Weekly groceries'],['health','Healthy rituals'],['checkins','Check-ins'],['calendar','8-week calendar']];

function Card({children,tone=''}){return <section className={'rg-panel '+tone}>{children}</section>}
function NumberField({label,value,onChange,step='1',min='0',max,placeholder}){return <label className="rg-field"><span className="rg-label">{label}</span><input type="number" min={min} max={max} step={step} className="rg-input" value={value??''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>}
function Selection({label,value,onChange,items}){return <label className="rg-field"><span className="rg-label">{label}</span><select className="rg-select" value={value??''} onChange={e=>onChange(e.target.value)}>{items.map(x=><option key={x[0]} value={x[0]}>{x[1]}</option>)}</select></label>}

function ExercisePlan({ex,date,fitness,onChange}){
 const p=getPrescription(ex,date,fitness);
 const log=fitness.logs?.[date]?.[ex.id]||{};
 const override=fitness.planOverrides?.[date]?.[ex.id]||{};
 const planWeight=override.weight!==undefined&&override.weight!==''?Number(override.weight):p.weight;
 const planReps=override.reps&&override.reps.length===ex.sets?override.reps:p.reps;
 const future=nextMatchingDates(ex,date,buildRecompDay,RECOMP_END,2);
 const editLog=patch=>onChange(old=>({...old,logs:{...old.logs,[date]:{...(old.logs?.[date]||{}),[ex.id]:{...(old.logs?.[date]?.[ex.id]||{}),...patch}}}}));
 const editOverride=patch=>onChange(old=>({...old,planOverrides:{...old.planOverrides,[date]:{...(old.planOverrides?.[date]||{}),[ex.id]:{...override,...patch}}}}));
 const editBaseline=(value)=>onChange(old=>({...old,baselines:{...old.baselines,[ex.id]:value}}));
 const editIncrement=value=>onChange(old=>({...old,increments:{...old.increments,[ex.id]:value}}));
 const reps=Array.from({length:ex.sets},(_,i)=>log.reps?.[i]??'');
 const note=p.calibration?'Select your normal load for this movement.':p.trial?'Draft trial load — please check this equipment-specific starting setting before trying it.':p.source==='plan edit'||p.source==='rep-plan edit'?'Following your edited plan from '+pretty(p.sourceDate):'Based on '+(p.sourceDate?'your completed session on '+pretty(p.sourceDate):'your reported baseline');
 return <article className="rg-exercise">
   <div className="rg-exercise-top"><div><h4>{ex.name}</h4><p>{ex.cue}</p></div><span className="rg-badge">{ex.sets} sets · {ex.low}–{ex.high} reps</span></div>
   <div className="rg-target">
     <div><span className="rg-label">Today's suggested load</span><strong>{renderWeight(planWeight,ex)}</strong></div>
     <div><span className="rg-label">Target reps by set</span><strong>{planReps.join(' / ')}</strong></div>
     <div><span className="rg-label">Rest</span><strong>{p.rest}</strong></div>
   </div>
   <p className="rg-count">{note}. {p.reason}</p>
   <div className="rg-quick-edit">
    <NumberField label="Edit today's planned weight (lb)" step=".5" value={override.weight!==undefined&&override.weight!==''?override.weight:p.weight??''}
       onChange={v=>editOverride({weight:v})} placeholder="Select a comfortable starting load"/>
    <button type="button" className="rg-button rg-small" onClick={()=>editOverride({weight:'',reps:null,repsText:''})}>Reset this day's edit</button>
    <span className="rg-soft">Changes cascade to future sessions unless you later enter a different plan or actual lift.</span>
   </div>
   <div className="rg-actions" style={{margin:'12px 0'}}>
    <button className="rg-button primary" type="button" disabled={planWeight===null}
     onClick={()=>editLog({weight:String(planWeight),reps:planReps.map(String),rir:'2',pain:'no',form:'yes'})}>
      ✓ I completed this plan with good form and ~2 reps left
    </button>
   </div>
   <details className="rg-details"><summary>Customize today's plan / equipment increment</summary>
    <div className="rg-form-grid">
     <NumberField label="My baseline for this movement (lb)" step=".5" value={fitness.baselines?.[ex.id]??ex.startingWeight??''} onChange={editBaseline} placeholder="Measure first"/>
     <NumberField label="Smallest available weight step (lb)" step=".5" value={fitness.increments?.[ex.id]??incrementFor(ex,fitness)} onChange={editIncrement}/>
     
     <label className="rg-field"><span className="rg-label">Today's planned reps (one per set)</span><input className="rg-input" value={override.repsText??''} placeholder={p.reps.join(', ')} onChange={e=>{
       const t=e.target.value;const v=t.split(',').map(s=>Number(s.trim()));
       editOverride({repsText:t,reps:v.length===ex.sets&&v.every(n=>Number.isFinite(n)&&n>=0)?v.map(n=>Math.round(n)):null});
      }}/></label>
    </div><p className="rg-soft">The plan change carries forward even before you complete a session. Confirm completed sets above or edit your actuals below to trigger performance-based increases.</p>
   </details>
   <div className="rg-log-heading"><b>What I actually did</b><span>Editable anytime — this drives future suggestions</span></div>
   <div className="rg-log-grid">
     <NumberField label="Actual lb" step=".5" value={log.weight??''} placeholder={p.weight===null?'Calibrate':String(p.weight)} onChange={v=>editLog({weight:v})}/>
     {reps.map((v,i)=><NumberField key={i} label={'Set '+(i+1)} value={v} placeholder={String(planReps[i]??ex.low)} onChange={val=>{const next=[...reps];next[i]=val;editLog({reps:next})}}/>)}
     <Selection label="Reps left (RIR)" value={log.rir??''} onChange={v=>editLog({rir:v})} items={[['','Select'],['0','0 · max effort'],['1','1'],['2','2'],['3','3'],['4','4+']]}/>
     <Selection label="Any pain?" value={log.pain??'no'} onChange={v=>editLog({pain:v})} items={[['no','No'],['yes','Yes']]}/>
   </div>
   <div className="rg-form-grid" style={{marginTop:9}}>
    <Selection label="Was technique controlled?" value={log.form??'yes'} onChange={v=>editLog({form:v})} items={[['yes','Yes'],['no','No — adjust']]}/>
    <label className="rg-field"><span className="rg-label">Notes</span><input className="rg-input" value={log.notes||''} placeholder="Machine, form, recovery..." onChange={e=>editLog({notes:e.target.value})}/></label>
   </div>
   {future.length>0&&<div className="rg-hint ready">
    <b>Next matching session: {pretty(future[0])}</b> · {renderWeight(getPrescription(ex,future[0],fitness).weight,ex)} · {getPrescription(ex,future[0],fitness).reps.join(' / ')} reps.
    {log.pain==='yes'?' Pain logged — no increase recommended.':''}
   </div>}
  </article>;
}

function CardioPlan({date,session,fitness,onChange}){
 const log=fitness.cardio?.[date]||{};
 // Upper days alternate to StairMaster by default; user can choose either.
 const initialMode=session.startsWith('Upper')?'StairMaster':'Treadmill';
 const mode=log.mode||initialMode;
 const p=getCardioPrescription(date,fitness,mode);
 const edit=patch=>onChange(old=>({...old,cardio:{...old.cardio,[date]:{...(old.cardio?.[date]||{}),...patch}}}));
 const markPlanned=()=>edit({mode,completed:true,minutes:log.minutes??p.minutes,
  ...(mode==='Treadmill'?{speed:log.speed??p.speed,incline:log.incline??p.incline}:{level:log.level??p.level})});
 return <Card tone="sage">
  <p className="rg-eyebrow">Your established cardio routine · after strength training</p>
  <h3>Cardio finish ✳</h3>
  <Selection label="Cardio machine" value={mode} onChange={v=>edit({mode:v,completed:false})}
   items={[[ 'Treadmill','Incline treadmill'],['StairMaster','StairMaster']]}/>
  {mode==='Treadmill'?<p><b>Today's plan:</b> {p.minutes} minutes at <b>{p.speed} mph, {p.incline}% incline</b>. This matches your reported 12–3 treadmill routine; 20–30 minutes is your usual range.</p>
   :<p><b>Today's plan:</b> {p.minutes} minutes on StairMaster at <b>level {p.level}</b>. You reported 20–30 minutes; the machine level is a provisional trial until you change or confirm it.</p>}
  <div className="rg-form-grid" style={{marginTop:12}}>
   <NumberField label="Planned / actual minutes" value={log.minutes??p.minutes} onChange={v=>edit({minutes:v})}/>
   {mode==='Treadmill'?<>
    <NumberField label="Speed (mph)" step=".1" value={log.speed??p.speed} onChange={v=>edit({speed:v})}/>
    <NumberField label="Incline (%)" step=".5" value={log.incline??p.incline} onChange={v=>edit({incline:v})}/>
   </>:<NumberField label="StairMaster level" value={log.level??p.level} onChange={v=>edit({level:v})}/>}
   <Selection label="Effort (optional)" value={log.effort??''} onChange={v=>edit({effort:v})}
    items={[['','Not logged'],['3','3 · Easy'],['4','4 · Comfortable'],['5','5 · Moderate'],['6','6 · Challenging'],['7','7 · Hard'],['8','8+ · Very hard']]}/>
  </div>
  <div className="rg-actions" style={{marginTop:13}}>
   <button className="rg-button primary" onClick={markPlanned}>✓ I completed these cardio settings</button>
   <label className="rg-check" style={{margin:0}}><input type="checkbox" checked={!!log.completed}
    onChange={e=>edit({completed:e.target.checked})}/><span>Completed</span></label>
  </div>
  <p className="rg-soft">{p.note} If a session feels excessive, reduce it; training should not require pushing through dizziness, pain or exhaustion.</p>
 </Card>;
}
function RecompGarden({fitness={},onChange}){
 const now=new Date();const t=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const [date,setDate]=useState(t>=RECOMP_START&&t<=RECOMP_END?t:RECOMP_START);
 const [view,setView]=useState('today');
 const [recipeType,setRecipeType]=useState('All');
 const [recipeSearch,setRecipeSearch]=useState('');
 const [showNew,setShowNew]=useState(false);
 const [newRecipe,setNewRecipe]=useState({name:'',type:'Lunch / Dinner',ingredients:'',instructions:'',adjustments:'',nutrients:''});
 const [showFavOnly,setShowFavOnly]=useState(false);
 const [groceryWeek,setGroceryWeek]=useState(1);
 const update=fn=>onChange(old=>fn(old||{}));
 const plan=buildRecompDay(date),menu=mealIdsForDate(date),workout=exercisesForSession(plan.session);
 const recipes=useMemo(()=>[...RICH_RECIPES,...(fitness.customRecipes||[])],[fitness.customRecipes]);
 const daily=fitness.daily?.[date]||{};
 const marks=fitness.rituals?.[date]||{};
 const allLogged=Object.values(fitness.logs||{}).reduce((n,day)=>n+Object.values(day||{}).reduce((m,l)=>m+(l.reps||[]).filter(x=>x!==''&&x!=null).length,0),0);
 const doneDays=Object.values(fitness.dayDone||{}).filter(Boolean).length;
 const changeDaily=(key,value)=>update(old=>({...old,daily:{...old.daily,[date]:{...(old.daily?.[date]||{}),[key]:value}}}));
 const changeMark=(key,value)=>update(old=>({...old,rituals:{...old.rituals,[date]:{...(old.rituals?.[date]||{}),[key]:value}}}));
 const chooseMeal=(kind,value)=>update(old=>({...old,mealOverrides:{...old.mealOverrides,[date]:{...(old.mealOverrides?.[date]||{}),[kind]:value}}}));
 const rate=(id,value)=>update(old=>({...old,recipeRatings:{...old.recipeRatings,[id]:value}}));
 const isFavorite=id=>fitness.recipeRatings?.[id]==='love';
 const filtered=recipes.filter(r=>(recipeType==='All'||r.type.includes(recipeType))&&(!showFavOnly||isFavorite(r.id))&&[r.name,r.ingredients].join(' ').toLowerCase().includes(recipeSearch.toLowerCase()));
 const groceries=weeklyGrocery(groceryWeek,fitness);
 const markDay=()=>update(old=>({...old,dayDone:{...old.dayDone,[date]:!old.dayDone?.[date]}}));
 const addRecipe=e=>{e.preventDefault();if(!newRecipe.name.trim()||!newRecipe.ingredients.trim())return;
  update(old=>({...old,customRecipes:[...(old.customRecipes||[]),{...newRecipe,id:'custom-'+Date.now(),name:newRecipe.name.trim(),yield:'Personal recipe',shop:[] }]}));
  setShowNew(false);setNewRecipe({name:'',type:'Lunch / Dinner',ingredients:'',instructions:'',adjustments:'',nutrients:''});
 };
 const maybeName=(kind)=>namedMeal(date,kind,fitness);
 return <div className="recomp-garden">
  <BodyRecompBanner/>
  <div className="rg-date-line"><span className="rg-date-line-label">✿ 8-WEEK PERSONAL STRENGTH + WELLNESS PLANNER · NOV 25 — JAN 19</span>
   <div className="rg-date-nav"><button className="rg-button" onClick={()=>setDate(moveDate(date,-1))} disabled={date<=RECOMP_START}>‹</button>
   <input type="date" aria-label="Choose day" min={RECOMP_START} max={RECOMP_END} value={date} onChange={e=>e.target.value>=RECOMP_START&&e.target.value<=RECOMP_END&&setDate(e.target.value)}/>
   <button className="rg-button" onClick={()=>setDate(moveDate(date,1))} disabled={date>=RECOMP_END}>›</button></div>
  </div>
  <nav className="rg-tabbar" aria-label="Body recomp sections">{sections.map(([id,label])=><button className={'rg-tab '+(view===id?'active':'')} key={id} onClick={()=>setView(id)}>{label}</button>)}</nav>

  {view==='today'&&<>
   <div className="rg-metrics"><div className="rg-metric"><small>Week</small><strong>{plan.week}/8</strong><span>{pretty(date)}</span></div><div className="rg-metric"><small>Workout</small><strong style={{fontSize:18}}>{plan.session}</strong><span>Editable by performance</span></div><div className="rg-metric"><small>Sets logged</small><strong>{allLogged}</strong><span>All sessions</span></div><div className="rg-metric"><small>Days checked</small><strong>{doneDays}/56</strong><span>Rest counts too</span></div></div>
   <div className="rg-grid">
    <Card tone="blush"><p className="rg-eyebrow">AM · first little ritual</p><h3>{menu.morning.title}</h3><p>{menu.morning.detail}</p><label className="rg-check"><input type="checkbox" checked={!!marks.morning} onChange={e=>changeMark('morning',e.target.checked)}/><span>Done / enjoyed</span></label><p className="rg-soft">Gentle cleanse or water, moisturizer, broad-spectrum SPF 30+ when outdoors, and lip balm—especially during isotretinoin treatment.</p></Card>
    <Card><p className="rg-eyebrow">Breakfast · lunch · snack · dinner</p><h3>Food I look forward to ♡</h3>{kinds.map(kind=><div className="rg-meal-line" key={kind}><span>{kind}</span><strong>{maybeName(kind)}</strong></div>)}<button className="rg-button" style={{marginTop:11}} onClick={()=>setView('meals')}>Swap any meal ↗</button></Card>
    <Card tone="sage"><p className="rg-eyebrow">Today's movement</p><h3>{plan.session}</h3><p>{isTraining(plan.session)?'Your plan has specific sets, rep targets, and load suggestions for each exercise. Enter your actual lifts to update future dates.':plan.prep}</p>
     {isTraining(plan.session)?<>{workout.map(ex=>{const p=getPrescription(ex,date,fitness);return <div className="rg-mini-lift" key={ex.id}><span>{ex.name}</span><strong>{p.sets} × {p.reps.join('/')} · {renderWeight(p.weight,ex)}</strong></div>})}<p className="rg-soft">Cardio: {plan.session.startsWith('Upper')?'StairMaster · 25 min (level editable)':'Treadmill · 25 min · 3 mph · 12% incline'} — choose either machine in the workout tab.</p><button className="rg-button primary" onClick={()=>setView('train')}>Open workout + log actual sets ↗</button></>:<button className="rg-button" onClick={markDay}>{fitness.dayDone?.[date]?'✓ Done':'Mark recovery/activity day done'}</button>}</Card>
    <Card><p className="rg-eyebrow">Sleep, digestion and energy</p><h3>How my body feels</h3><div className="rg-form-grid">
      <NumberField label="Sleep (hours)" step=".5" max="24" value={daily.sleep} onChange={v=>changeDaily('sleep',v)}/>
      <NumberField label="Water (glasses of your size)" value={daily.water} onChange={v=>changeDaily('water',v)}/>
      <Selection label="Bloating / discomfort" value={daily.bloating??''} onChange={v=>changeDaily('bloating',v)} items={[['','Not checked'],['0','None'],['1','Mild'],['2','Moderate'],['3','Severe']]}/>
      <Selection label="Energy" value={daily.energy??''} onChange={v=>changeDaily('energy',v)} items={[['','Not checked'],['1','Very low'],['2','Low'],['3','Okay'],['4','Good'],['5','Excellent']]}/>
      <Selection label="Stress" value={daily.stress??''} onChange={v=>changeDaily('stress',v)} items={[['','Not checked'],['1','Low'],['2','Some'],['3','Moderate'],['4','High'],['5','Very high']]}/>
      <label className="rg-field"><span className="rg-label">Digestion / recovery notes</span><input className="rg-input" value={daily.digestiveNotes||''} onChange={e=>changeDaily('digestiveNotes',e.target.value)} placeholder="Any specific food or symptoms?"/></label>
     </div><p className="rg-soft">Observe patterns without checking your weight or appearance every day.</p></Card>
   </div>
   <Card><p className="rg-eyebrow">PM · close the day gently</p><h3>Cleanse, moisturize, recover ☾</h3><p>Use gentle skincare, moisturizer and lip balm, take prescribed medicine exactly as directed, and aim for 7–9 hours of sleep. Avoid adding retinol or vitamin A supplements while using isotretinoin.</p><label className="rg-check"><input type="checkbox" checked={!!marks.evening} onChange={e=>changeMark('evening',e.target.checked)}/><span>Evening routine done</span></label></Card>
  </>}

  {view==='train'&&<>
   <div className="rg-grid">
    <Card tone="blush"><p className="rg-eyebrow">{pretty(date)} · week {plan.week}</p><h3>{plan.session}</h3><p>{isTraining(plan.session)?'Each movement already has an exact, editable trial load, sets and reps. Edit the suggestion once if it does not match your equipment or your current strength, and your future plans update. Confirm the completed session with one tap, or log differences below.':"Today’s schedule is for recovery, an optional walk or meal preparation."}</p><p className="rg-notice">All exercises now include an editable starting trial load, with pounds explicitly labeled per hand, per dumbbell, total, or machine setting. These suggestions are not verified personal lifting records. If pain, dizziness, poor form or unusual weakness occurs, stop or adjust.</p></Card>
    <Card tone="sage"><p className="rg-eyebrow">Progressive overload · automatically updated</p><h3>Actuals → next plan</h3><p>When all sets hit the high end with good form and 1–3 reps left, the next plan offers one small equipment-appropriate increase. Otherwise, it holds the load and targets an additional clean rep. Changing earlier logged reps automatically recalculates uncompleted future sessions.</p><p className="rg-soft">Your reported +5 lb straight-leg raise and 20 lb Russian twists are retained. The specific 30-lb arm movement is still unnamed, so the other suggested loads are adjustable trials, not measurements.</p></Card>
   </div>
   {isTraining(plan.session)?<><div className="rg-session-list">{workout.map(ex=><ExercisePlan key={ex.id} ex={ex} date={date} fitness={fitness} onChange={update}/>)}</div><CardioPlan date={date} session={plan.session} fitness={fitness} onChange={update}/>
    <button className="rg-button primary" style={{marginTop:12}} onClick={markDay}>{fitness.dayDone?.[date]?'✓ Session marked complete':'Mark training day complete'}</button></>:
    <Card tone="sage"><h3>Recovery is productive too</h3><p>{plan.prep}. An enjoyable relaxed walk is optional. No need to compensate for rest days.</p></Card>}
  </>}

  {view==='meals'&&<>
   <div className="rg-grid"><Card tone="blush"><p className="rg-eyebrow">{pretty(date)}</p><h3>Your flexible menu</h3><p>Breakfast favorites can repeat. Lunch and dinner change throughout all eight weeks, with your Indian bhajis, soups, khichdi and other dishes.</p>
    <div className="rg-meal-list">{kinds.map(kind=><div className="rg-meal-card" key={kind}><h4>{kind}</h4><p>{maybeName(kind)}</p><Selection label="Swap recipe" value={fitness.mealOverrides?.[date]?.[kind]||''} onChange={v=>chooseMeal(kind,v)} items={[['','Use planned recipe'],...recipes.filter(r=>fitness.recipeRatings?.[r.id]!=='skip').map(r=>[r.name,r.name])]}/></div>)}</div>
   </Card><Card tone="sage"><p className="rg-eyebrow">Morning nourishment</p><h3>{menu.morning.title}</h3><p>{menu.morning.detail}</p><p>Protein, greens, carbohydrates, and fat in satisfying portions support training and health. Oil can be modest without banning necessary dietary fat. Dairy is optional when it bothers you; tofu is not a default meal.</p><p className="rg-notice">No automatic calorie deficit, detox, or prescribed supplement stack. With your previous missed periods and isotretinoin treatment, discuss personalized nutrition and supplements with your clinician/dietitian.</p></Card></div>
   <div className="rg-actions"><button className="rg-button" onClick={()=>{setGroceryWeek(plan.week);setView('prep')}}>See this week's groceries ↗</button><button className="rg-button" onClick={()=>setView('recipes')}>Browse detailed recipes ↗</button></div>
  </>}

  {view==='recipes'&&<>
   <Card tone="blush"><p className="rg-eyebrow">Your personal recipe collection</p><h3>Flavor first, nourishment always ✿</h3><p>Bhindi, brinjal and potato bhaji, vegetable khichdi, rajma, spinach dal, fresh wraps, soups, paneer and baked favorites—without tofu being forced into your meals. Keep the meals you love and swap the rest.</p>
    <div className="rg-form-grid">
     <Selection label="Type" value={recipeType} onChange={setRecipeType} items={['All','Breakfast','Lunch','Dinner','Snack','Morning'].map(x=>[x,x])}/>
     <label className="rg-field"><span className="rg-label">Search food</span><input className="rg-input" value={recipeSearch} placeholder="Search khichdi, bhindi, smoothies…" onChange={e=>setRecipeSearch(e.target.value)}/></label>
    </div><div className="rg-actions"><button className="rg-button" onClick={()=>setShowFavOnly(v=>!v)}>{showFavOnly?'Show all':'♡ Favorites only'}</button><button className="rg-button primary" onClick={()=>setShowNew(v=>!v)}>{showNew?'Close':'Add a family recipe +'}</button></div>
    {showNew&&<form className="rg-form-grid" style={{marginTop:14}} onSubmit={addRecipe}>
      {Object.keys(newRecipe).map(key=><label className="rg-field" key={key}><span className="rg-label">{key}</span><textarea className="rg-textarea" required={key==='name'||key==='ingredients'} value={newRecipe[key]} onChange={e=>setNewRecipe(s=>({...s,[key]:e.target.value}))}/></label>)}
      <button className="rg-button primary" type="submit">Save recipe</button><p className="rg-soft">Custom recipes won't have automatic grocery quantities until ingredients are structured.</p>
    </form>}
   </Card>
   <div className="rg-recipe-list" style={{marginTop:16}}>{filtered.map(r=><article className="rg-recipe-card" key={r.id}>
    <div className="rg-food-visual" aria-hidden="true">{emojiFor(r.type)}<span>✿</span></div><p className="rg-eyebrow">{r.type} · {r.yield}</p><h4>{r.name}</h4>
    <Selection label="My verdict" value={fitness.recipeRatings?.[r.id]||'try'} onChange={v=>rate(r.id,v)} items={[[ 'try','✿ Want to try'],['love','♡ Love it'],['skip','Not for me']]}/>
    <p><b>Ingredients:</b> {r.ingredients}</p><p><b>Steps:</b> {r.instructions}</p><p><b>Adjustments:</b> {r.adjustments}</p><p className="rg-recipe-meta">{r.nutrients}</p>
    <div className="rg-actions"><button className="rg-button rg-small" onClick={()=>{chooseMeal('lunch',r.name);setView('meals')}}>Use for lunch</button><button className="rg-button rg-small" onClick={()=>{chooseMeal('dinner',r.name);setView('meals')}}>Use for dinner</button></div>
   </article>)}</div>
  </>}

  {view==='prep'&&<>
   <div className="rg-grid"><Card tone="sage"><p className="rg-eyebrow">Each week, not one static grocery list</p><h3>Your weekly market basket</h3>
     <Selection label="Choose week" value={String(groceryWeek)} onChange={v=>setGroceryWeek(Number(v))} items={Array.from({length:8},(_,i)=>[String(i+1),'Week '+(i+1)+' · '+pretty(weeklyMealDates(i+1)[0])])}/>
     <p>Calculated from that week's breakfast, lunch, dinner and snack recipes, including your day-by-day swaps. Quantities are estimates for one person, and every item is editable.</p>
     <p className="rg-notice">Use pantry ingredients you already have; actual needs depend on brands, portions, leftovers, and appetite.</p>
     <button className="rg-button" onClick={()=>update(old=>({...old,shopping:{...old.shopping,[groceryWeek]:{}}}))}>Clear this week's checks</button>
    </Card>
    <Card><p className="rg-eyebrow">Prep routine</p><h3>Sunday batch + Wednesday refresh</h3><p>Cook one or two dals/beans, roast vegetables, wash leafy greens and prep breakfast jars. Use cooked refrigerated food within 3–4 days and freeze later meals. Make cilantro-lime yogurt dip or chutney so the food stays genuinely delicious.</p>
     <p className="rg-soft">Changing a planned recipe also changes this week's ingredient list automatically.</p>
    </Card></div>
   <div className="rg-grocery-grid">{['Protein','Greens','Vegetables','Produce','Fruit','Grains','Drinks','Pantry'].map(cat=>{
    const items=groceries.filter(x=>x.category===cat);if(!items.length)return null;
    return <Card key={cat}><h3>{cat} ✿</h3>{items.map(item=>{
     const key=item.key+'|'+item.unit;
     const checked=!!fitness.shopping?.[groceryWeek]?.[key];
     const quantity=fitness.groceryEdits?.[groceryWeek]?.[key]??String(item.amount)+' '+item.unit;
     return <div className="rg-grocery-line" key={key}><label><input type="checkbox" checked={checked} onChange={e=>update(old=>({...old,shopping:{...old.shopping,[groceryWeek]:{...(old.shopping?.[groceryWeek]||{}),[key]:e.target.checked}}}))}/><span>{item.label}</span></label><input className="rg-input" aria-label={'Quantity '+item.label} value={quantity} onChange={e=>update(old=>({...old,groceryEdits:{...old.groceryEdits,[groceryWeek]:{...(old.groceryEdits?.[groceryWeek]||{}),[key]:e.target.value}}}))}/></div>
    })}</Card>;
   })}</div>
  </>}

  {view==='health'&&<>
   <div className="rg-grid">
    <Card tone="blush"><p className="rg-eyebrow">AM & PM skin basics</p><h3>Barrier-first skincare</h3><p><b>Morning:</b> gentle wash or water, moisturizer, broad-spectrum SPF 30+ when outdoors, lip balm; reapply sunscreen as appropriate.</p><p><b>Evening:</b> gentle cleanser, moisturizer and lip ointment. Use prescribed acne medicine as directed.</p><p className="rg-notice">While on isotretinoin, don't copy the influencer's topical retinol, unprotected sun exposure, or frequent abrasive facials. Avoid vitamin A supplements. Discuss procedures and actives with your dermatologist.</p>
    </Card>
    <Card tone="sage"><p className="rg-eyebrow">Digestive comfort</p><h3>Slow fiber, not detoxes</h3><p>Soaked chia, oats, dal, vegetables and fruit are good food options, but increasing fiber quickly may temporarily increase gas. Add fiber gradually and stay hydrated. Beans, dairy or high-fat meals can cause bloating in some people.</p><p>Try a short symptom journal when uncomfortable, then adjust one ingredient at a time—not a blanket restriction of entire food groups.</p></Card>
    <Card><p className="rg-eyebrow">Supplements · discuss before adding</p><h3>Food first, targeted support</h3><p>With a vegetarian diet, ask a clinician whether B12, iron, vitamin D, calcium, or omega-3 intake needs attention. Supplements depend on your foods, medications, lab results and symptoms.</p><p>Probiotics and collagen aren't automatic necessities or cures for acne. Review the vitamin A content of any multivitamin while on isotretinoin.</p></Card>
    <Card><p className="rg-eyebrow">Movement & emotional health</p><h3>Strength, recovery, peace</h3><p>Strength training and enjoyable walks support fitness and mood; sweating more isn't inherently better. Rest and sufficient meals help recovery. Choose sunscreen rather than unfiltered sun; avoid saunas when they aggravate dizziness, irritation or dryness.</p><p>Gradual improvements in performance, digestion, energy, and consistency matter more than comparing your body to photos.</p></Card>
   </div>
   <Card><h3>Sources for your reference post</h3><p><a href="https://www.aad.org/public/diseases/acne/derm-treat/isotretinoin/side-effects" target="_blank" rel="noreferrer">American Academy of Dermatology: isotretinoin care</a> · <a href="https://www.aad.org/public/diseases/acne/causes/diet" target="_blank" rel="noreferrer">AAD: acne and diet</a> · <a href="https://www.niddk.nih.gov/health-information/digestive-diseases/gas-digestive-tract/eating-diet-nutrition" target="_blank" rel="noreferrer">NIDDK: gas and bloating</a></p></Card>
  </>}

  {view==='checkins'&&<>
   <div className="rg-grid"><Card tone="sage"><h3>Dec 22 · Jan 19</h3><p>Four- and eight-week reviews: strength, recovery, satisfying meals and other improvements. You aren't required to lose weight or force a visible physique change by a deadline.</p></Card><Card><h3>Meaningful progress ♡</h3><p>Clean reps, safe load increases, energy, sleep, digestion and a repeatable routine. Rest and your social life are parts of health too.</p></Card></div>
   <div className="rg-grid" style={{marginTop:16}}>{RECOMP_REVIEWS.map((d,i)=>{const a=fitness.reviews?.[d]||{};const change=(field,value)=>update(old=>({...old,reviews:{...old.reviews,[d]:{...(old.reviews?.[d]||{}),[field]:value}}}));
    return <Card key={d}><p className="rg-eyebrow">{i===0?'Baseline':i===4?'4-week review':i===8?'8-week review':'Weekly check-in'} · {pretty(d)}</p>
      <label className="rg-field"><span className="rg-label">Strength</span><input className="rg-input" value={a.strength||''} onChange={e=>change('strength',e.target.value)} placeholder="What improved?"/></label>
      <label className="rg-field"><span className="rg-label">Sleep, digestion, recovery</span><input className="rg-input" value={a.energy||''} onChange={e=>change('energy',e.target.value)}/></label>
      <label className="rg-field"><span className="rg-label">Reflection</span><textarea className="rg-textarea" value={a.notes||''} onChange={e=>change('notes',e.target.value)}/></label>
    </Card>;
   })}</div>
  </>}

  {view==='calendar'&&<Card><h3>All 56 days</h3><p>Choose any date to open its exact current workout prescription and personal meal plan.</p>
   <div className="rg-table-wrap"><table className="rg-day-table"><thead><tr><th>Date</th><th>Week</th><th>Training</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th><th>Done?</th></tr></thead>
   <tbody>{dates.map(d=><tr key={d.date} className={date===d.date?'current':''}>
    <td><button onClick={()=>{setDate(d.date);setView('today')}}>{pretty(d.date)}</button></td><td>{d.week}</td><td>{d.session}</td><td>{namedMeal(d.date,'breakfast',fitness)}</td><td>{namedMeal(d.date,'lunch',fitness)}</td><td>{namedMeal(d.date,'dinner',fitness)}</td><td>{fitness.dayDone?.[d.date]?'✓':'—'}</td>
   </tr>)}</tbody></table></div>
  </Card>}
  <p className="rg-notice" style={{marginTop:19}}>This is an editable planning aid, not a substitute for a clinician, registered dietitian, or trainer's assessment. Exact starting weights for unknown exercises require one real measured session; suggested progression never overrides symptoms, form or recovery. Data stays in your browser and can be exported using the app's backup.</p>
 </div>;
}
export default RecompGarden;
