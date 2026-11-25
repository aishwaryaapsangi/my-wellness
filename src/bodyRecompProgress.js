// Adaptive prescriptions are suggestions based on *documented* exercises,
// not medical advice or untested strength estimates. Pure functions for testing.
const asNumber=(value)=>value!==''&&value!==null&&value!==undefined&&Number.isFinite(Number(value))?Number(value):null;
const roundLoad=n=>Math.round(n*100)/100;
const upper=(ex)=>ex.session?.startsWith('Upper')??false;
export const defaultIncrement=ex=>ex.id==='weighted-straight-leg-captain-s-chair-raise'?1:
 upper(ex)?2.5:5;
export const incrementFor=(ex,fitness={})=>asNumber(fitness.increments?.[ex.id])??defaultIncrement(ex);

export function lastActual(ex, date, fitness={}){
 const dates=Object.keys(fitness.logs||{}).filter(d=>d<date&&fitness.logs[d]?.[ex.id]).sort().reverse();
 for(const d of dates){
  const l=fitness.logs[d][ex.id];
  if(asNumber(l.weight)===null)continue;
  const reps=(l.reps||[]).slice(0,ex.sets).map(asNumber);
  if(reps.length!==ex.sets||reps.some(v=>v===null||v<0))continue;
  return {date:d,weight:Number(l.weight),reps,rir:asNumber(l.rir),pain:l.pain==='yes',form:l.form??'yes'};
 }
 return null;
}
export function getPrescription(ex,date,fitness={}){
 const previous=lastActual(ex,date,fitness);
 const basic=Array(ex.sets).fill(ex.low);
 const initial=asNumber(fitness.baselines?.[ex.id])??(asNumber(ex.startingWeight)??null);
 const base={sets:ex.sets,reps:basic,weight:initial,sourceDate:null,calibration:initial===null,increase:false,increment:incrementFor(ex,fitness),rest:upper(ex)?'90–120 sec':'120–180 sec'};
 if(!previous)return {...base,reason:initial===null?'Choose the load you already handle for THIS specific movement. Record the first session to personalize every future date.':'Starting from your reported resistance; adjust actual sets if needed.'};
 if(previous.pain||previous.form==='no')return {...base,weight:previous.weight,sourceDate:previous.date,calibration:false,reason:'Pain or form concerns: do not increase. Stop painful work and review technique or get qualified guidance.'};
 if(previous.rir!==null&&previous.rir>=1&&previous.rir<=3&&previous.reps.every(v=>v>=ex.high)){
  const next=roundLoad(previous.weight+incrementFor(ex,fitness));
  return {...base,weight:next,sourceDate:previous.date,calibration:false,increase:true,reason:'You completed all top-range reps with 1–3 in reserve. This is the next SMALL load to try only if the equipment allows it and recovery is good.'};
 }
 const reps=previous.reps.map(v=>Math.max(ex.low,Math.min(ex.high,v)));
 if(previous.rir!==0){
  const first=reps.findIndex(v=>v<ex.high);
  if(first!==-1)reps[first]+=1;
 }
 const caution=previous.rir===0?'Last session was at your limit; keep load and aim for cleaner reps and recovery.':'Same load; aim to improve one controlled rep when ready.';
 return {...base,weight:previous.weight,reps,sourceDate:previous.date,calibration:false,reason:caution};
}
// No forced rapid increases. User-recorded cardio sets the next suggested baseline.
export function getCardioPrescription(date,fitness={}){
 const defaults={minutes:20,speed:2.8,incline:2,mode:'Treadmill',note:'Comfortable/moderate pace after lifting; use talk test. Edit to match your equipment and energy.'};
 const keys=Object.keys(fitness.cardio||{}).filter(d=>d<date).sort().reverse();
 for(const key of keys){const actual=fitness.cardio[key];if(!actual||actual.completed===false)continue;
  const minutes=asNumber(actual.minutes),speed=asNumber(actual.speed),incline=asNumber(actual.incline);
  if(minutes===null||speed===null||incline===null)continue;
  const feel=asNumber(actual.effort);
  return {minutes, speed,incline,mode:'Treadmill',sourceDate:key,
   note:feel!==null&&feel>=7?'Prior cardio was difficult. Repeat or ease intensity; no automatic increase.':'Repeat your recorded comfortable settings. Cardio is for fitness and enjoyment, not punishment.'};
 }
 return defaults;
}
export function nextMatchingDates(ex, date, buildRecompDay, until, count=3){
 const out=[];let d=Date.parse(date+'T12:00:00Z');
 const end=Date.parse(until+'T12:00:00Z');
 while((d+=86400000)<=end&&out.length<count){
  const key=new Date(d).toISOString().slice(0,10);
  if(buildRecompDay(key)?.session===ex.session)out.push(key);
 }
 return out;
}
