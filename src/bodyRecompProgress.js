// Per-exercise DRAFT loads. These numbers are editable first-session trials,
// NOT measurements of the user's strength. Machine stacks are not comparable.
// Future session targets come from plan edits and completed actuals.
import {RECOMP_START} from './bodyRecompData.js';

const numeric=value=>value!==''&&value!==null&&value!==undefined&&Number.isFinite(Number(value))?Number(value):null;
const round=value=>Math.round(value*100)/100;
const upper=ex=>ex.session?.startsWith('Upper')??false;
const isCore=ex=>['weighted-straight-leg-captain-s-chair-raise','weighted-russian-twist','pallof-press','weighted-dead-bug','cable-crunch','controlled-leg-rainbow-with-ball'].includes(ex.id);
const restFor=ex=>isCore(ex)?'60–120 sec':upper(ex)?'90–120 sec':'120–180 sec';
export const STARTER_TRIALS={
 'machine-or-barbell-hip-thrust':{weight:25,unit:'lb single dumbbell total',note:'Suggested one-dumbbell starting trial on a stable bench. No barbell. Edit to your comfortable working load.'},
 'romanian-deadlift':{weight:15,unit:'lb per dumbbell',note:'15 lb in each hand is an editable technique-first trial, not a measured maximum.'},
 'leg-press':{weight:90,unit:'lb on machine display',note:'Machine/sled starting resistance varies widely.'},
 'seated-hip-abduction':{weight:60,unit:'lb stack setting'},
 'lat-pulldown':{weight:50,unit:'lb stack setting'},
 'chest-press':{weight:35,unit:'lb machine setting'},
 'seated-row':{weight:45,unit:'lb stack setting'},
 'dumbbell-shoulder-press':{weight:10,unit:'lb per dumbbell'},
 'weighted-straight-leg-captain-s-chair-raise':{weight:5,unit:'lb added',note:'This one is based on your reported +5 lb baseline.'},
 'glute-bridge':{weight:25,unit:'lb single dumbbell total'},
 'supported-split-squat':{weight:10,unit:'lb per hand'},
 'seated-or-lying-hamstring-curl':{weight:40,unit:'lb machine setting'},
 'goblet-squat':{weight:25,unit:'lb single dumbbell'},
 'calf-raise':{weight:40,unit:'lb machine setting'},
 'seated-cable-row':{weight:50,unit:'lb cable setting'},
 'incline-chest-press':{weight:35,unit:'lb machine setting'},
 'lateral-raise':{weight:10,unit:'lb per dumbbell'},
 'biceps-curl':{weight:10,unit:'lb per dumbbell'},
 'triceps-pushdown':{weight:20,unit:'lb cable setting',note:'Cable stack trials are separate from the user-reported 10 lb dumbbells.'},
 'pallof-press':{weight:15,unit:'lb cable setting'},
 'controlled-leg-rainbow-with-ball':{weight:0,unit:'lb added (bodyweight + light ball)',note:'Bodyweight with a light ball between the feet. Add no extra weight by default.'},
 'weighted-dead-bug':{weight:20,unit:'lb single dumbbell held with both hands',note:'You reported up to 30 lb. Starting trial at 20 lb allows slow control; edit if comfortable.'},
 'cable-crunch':{weight:25,unit:'lb cable stack setting',note:'Cable resistance varies. Choose a load that allows controlled spinal flexion, not momentum.'},
 'weighted-russian-twist':{weight:20,unit:'lb plate total',note:'This one is based on your reported 20 lb Russian twists.'}
};
export const weightUnit=ex=>STARTER_TRIALS[ex.id]?.unit||'lb (verify machine)';
export const defaultIncrement=ex=>ex.id==='controlled-leg-rainbow-with-ball'?0:
 ex.id==='weighted-straight-leg-captain-s-chair-raise'?1:
 weightUnit(ex).includes('per dumbbell')||weightUnit(ex).includes('per hand')?2.5:upper(ex)?2.5:5;
export const incrementFor=(ex,fitness={})=>numeric(fitness.increments?.[ex.id])??defaultIncrement(ex);

export function lastActual(ex,date,fitness={}){
 const dates=Object.keys(fitness.logs||{}).filter(d=>d<date&&fitness.logs[d]?.[ex.id]).sort().reverse();
 for(const d of dates){
  const l=fitness.logs[d][ex.id];
  if(numeric(l.weight)===null||Number(l.weight)<0)continue;
  const reps=(l.reps||[]).slice(0,ex.sets).map(numeric);
  if(reps.length!==ex.sets||reps.some(v=>v===null||v<0))continue;
  return {date:d,weight:Number(l.weight),reps,rir:numeric(l.rir),pain:l.pain==='yes',form:l.form??'yes'};
 }
 return null;
}
const validReps=(reps,count)=>Array.isArray(reps)&&reps.length===count&&reps.every(v=>numeric(v)!==null&&Number(v)>=0);
function afterActual(ex,log,fitness){
 const weight=Number(log.weight),reps=log.reps.map(Number);
 const base={sourceDate:log.date,calibration:false,source:'actual',rest:restFor(ex),
  sets:ex.sets,increment:incrementFor(ex,fitness),unit:weightUnit(ex),trial:false};
 if(log.pain||log.form==='no')return {...base,weight,reps:reps.map(v=>Math.max(ex.low,Math.min(ex.high,v))),increase:false,
   reason:'Pain or unstable technique reported. Do not increase; stop if pain persists and check your form or seek guidance.'};
 if(ex.id==='controlled-leg-rainbow-with-ball'&&reps.every(v=>v>=ex.high)){
  return {...base,weight:0,reps:Array(ex.sets).fill(ex.high),increase:false,
   reason:'All top reps completed. Keep bodyweight; progress by slowing the lowering phase or a short pause, never by automatically adding a dumbbell to the feet.'};
 }
 if(log.rir!==null&&log.rir>=1&&log.rir<=3&&reps.every(v=>v>=ex.high)){
   return {...base,weight:round(weight+incrementFor(ex,fitness)),reps:Array(ex.sets).fill(ex.low),increase:true,
    reason:'Last completed session met all top reps with control and 1–3 reps left. Try the smallest available increase if recovery is good.'};
 }
 const next=reps.map(v=>Math.max(ex.low,Math.min(ex.high,v)));
 if(log.rir!==0){const first=next.findIndex(v=>v<ex.high);if(first!==-1)next[first]+=1;}
 return {...base,weight,reps:next,increase:false,
  reason:log.rir===0?'You were at your limit; keep this load and focus on steady technique.':'Hold your previous actual load; aim for one more clean rep when ready.'};
}
export function getPrescription(ex,date,fitness={}){
 const saved=numeric(fitness.baselines?.[ex.id]);
 const reported=numeric(ex.startingWeight);
 const trial=STARTER_TRIALS[ex.id];
 const initial=saved??reported??trial?.weight??null;
 let state={sets:ex.sets,reps:Array(ex.sets).fill(ex.low),weight:initial,unit:weightUnit(ex),
  sourceDate:null,source:saved!==null?'personal baseline':reported!==null?'reported baseline':trial?'draft starting trial':'unmeasured',
  calibration:initial===null,increase:false,trial:saved===null&&reported===null&&!!trial,
  increment:incrementFor(ex,fitness),rest:restFor(ex),
  reason:saved!==null||reported!==null?'Starting from your saved/reported weight; editable anytime.':trial?'Suggested first-session trial, NOT a measured personal best. Check against your own machine and adjust before lifting.':'No equipment-specific weight known: enter your usual load.'};
 // The plan is prefilled for EVERY date, including days not yet completed.
 // Changing a dated plan anchors all later dates until superseded by another
 // dated edit or actual performance. No arbitrary increases on uncompleted days.
 const start=Date.parse(RECOMP_START+'T12:00:00Z');
 const selected=Date.parse(date+'T12:00:00Z');
 for(let time=start;time<=selected&&time<start+56*86400000;time+=86400000){
  const key=new Date(time).toISOString().slice(0,10);
  // Include off-schedule workouts too: user may rearrange days.
  const plan=fitness.planOverrides?.[key]?.[ex.id]||{};
  const weight=numeric(plan.weight);
  if(weight!==null&&weight>=0){
   state={...state,weight,sourceDate:key,source:'plan edit',calibration:false,trial:false,increase:false,
     reason:'Using the load you set on '+key+'. That edit carries forward until an actual workout or later edit changes it.'};
  }
  if(validReps(plan.reps,ex.sets)){
    state={...state,reps:plan.reps.map(Number),sourceDate:key,source:state.source==='plan edit'?'plan edit':'rep-plan edit',
      reason:'Using the set targets you edited. This change carries into later sessions until updated.'};
  }
  if(key===date)break;
  const record=fitness.logs?.[key]?.[ex.id];
  if(record&&numeric(record.weight)!==null&&Number(record.weight)>=0&&validReps(record.reps,ex.sets)){
    state=afterActual(ex,{date:key,weight:Number(record.weight),reps:record.reps.map(Number),
      rir:numeric(record.rir),pain:record.pain==='yes',form:record.form??'yes'},fitness);
  }
 }
 return state;
}
// Treat StairMaster and treadmill as independent activities; never copy a
// treadmill speed/incline onto StairMaster levels.
export function getCardioPrescription(date,fitness={},mode='Treadmill'){
 const machine=mode==='StairMaster'?'StairMaster':'Treadmill';
 const defaults=machine==='StairMaster'
  ?{mode:machine,minutes:25,level:6,trial:true,note:'StairMaster 25 minutes; level 6 is an editable first-session trial, not a known setting. You mentioned 20–30 minutes. Adapt intensity to your effort.'}
  :{mode:machine,minutes:25,speed:3,incline:12,trial:false,note:'Your reported baseline: treadmill 3 mph, 12% incline, 20–30 minutes. Adjust duration to fatigue and recovery.'};
 const dates=Object.keys(fitness.cardio||{}).filter(d=>d<date).sort().reverse();
 for(const key of dates){
  const l=fitness.cardio[key];
  if(!l||l.completed!==true||(l.mode||'Treadmill')!==machine)continue;
  const minutes=numeric(l.minutes),effort=numeric(l.effort);
  if(machine==='StairMaster'){
   const level=numeric(l.level);if(minutes===null||level===null)continue;
   return {mode:machine,minutes,level,trial:false,sourceDate:key,
    note:effort!==null&&effort>=7?'Last session felt hard; repeat or shorten it rather than automatically increasing.':'Use your latest completed StairMaster settings; change them anytime.'};
  }
  const speed=numeric(l.speed),incline=numeric(l.incline);
  if(minutes===null||speed===null||incline===null)continue;
  return {mode:machine,minutes,speed,incline,trial:false,sourceDate:key,
   note:effort!==null&&effort>=7?'Your last treadmill session felt hard; repeat or ease intensity if needed.':'Use your latest completed treadmill settings; your reported 3 mph at 12% remains the original reference.'};
 }
 return defaults;
}
export function nextMatchingDates(ex,date,buildDay,until,count=3){
 const out=[];let time=Date.parse(date+'T12:00:00Z'),end=Date.parse(until+'T12:00:00Z');
 while((time+=86400000)<=end&&out.length<count){
  const key=new Date(time).toISOString().slice(0,10);
  if(buildDay(key)?.session===ex.session)out.push(key);
 }
 return out;
}
