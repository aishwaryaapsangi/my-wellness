import test from 'node:test';
import assert from 'node:assert/strict';
import {getPrescription,getCardioPrescription,incrementFor,STARTER_TRIALS,weightUnit} from '../src/bodyRecompProgress.js';
import {RICH_RECIPES,mealIdsForDate,namedMeal,weeklyGrocery,weeklyMealDates,weeklyBatchSummary} from '../src/bodyRecompMeals.js';
import {RECOMP_EXERCISES} from '../src/bodyRecompData.js';

const raised=RECOMP_EXERCISES.find(x=>x.name.includes('straight-leg'));
const curl={id:'a-curl',session:'Upper B + Core',name:'Biceps curl',sets:2,low:8,high:12};
const lower={id:'hip-thrust-test',session:'Lower A',sets:3,low:8,high:12};

test('known strength starts at actually reported resistance; unknowns require calibration',()=>{
 const p=getPrescription(raised,'2026-11-27',{});
 assert.equal(p.weight,5);
 assert.equal(p.sets,3);
 assert.deepEqual(p.reps,[10,10,10]);
 assert.equal(p.calibration,false);
 assert.equal(getPrescription(curl,'2026-11-27',{}).weight,null);
 assert.equal(getPrescription(curl,'2026-11-27',{}).calibration,true);
 assert.equal(getPrescription(lower,'2026-11-27',{baselines:{[lower.id]:40}}).weight,40);
});

test('every later day updates from logged ACTUALS, not optimistic forecast',()=>{
 const logs={'2026-11-27':{[curl.id]:{weight:'30',reps:['15','15'],rir:'2',pain:'no'}}};
 const old=getPrescription(curl,'2026-12-04',{logs});
 assert.equal(old.weight,32.5);
 assert.deepEqual(old.reps,[8,8]);
 logs['2026-11-27'][curl.id].reps=['10','15'];
 const updated=getPrescription(curl,'2026-12-04',{logs});
 assert.equal(updated.weight,30);
 assert.deepEqual(updated.reps,[11,12]);
 assert.equal(updated.increase,false);
});

test('latest completed sessions take precedence and respect form and pain',()=>{
 const logs={
  '2026-11-27':{[curl.id]:{weight:30,reps:[12,12],rir:2,pain:'no'}},
  '2026-12-04':{[curl.id]:{weight:32.5,reps:[10,10],rir:1,pain:'yes'}}};
 const next=getPrescription(curl,'2026-12-11',{logs});
 assert.equal(next.weight,32.5);
 assert.equal(next.increase,false);
 assert.match(next.reason,/Pain/);
});
test('minimum increment is user editable to match available equipment',()=>{
 const p=getPrescription(lower,'2026-12-03',{logs:{'2026-11-26':{[lower.id]:{weight:40,reps:[12,12,12],rir:2,pain:'no'}}},increments:{[lower.id]:'2.5'}});
 assert.equal(p.weight,42.5);
 assert.deepEqual(p.reps,[8,8,8]);
});
test('cardio default and actual history are editable, no compulsory increases',()=>{
 const p=getCardioPrescription('2026-11-27',{});
 assert.deepEqual([p.minutes,p.speed,p.incline],[25,3,12]);
 const q=getCardioPrescription('2026-12-04',{cardio:{'2026-11-27':{completed:true,minutes:30,speed:3,incline:4,effort:7}}});
 assert.deepEqual([q.minutes,q.speed,q.incline],[30,3,4]);
 assert.match(q.note,/hard/);
});
test('eight weekly meal plans change mains and do not default to tofu',()=>{
 assert.ok(RICH_RECIPES.length>=20);
 const weeks=Array.from({length:8},(_,i)=>weeklyMealDates(i+1).map(day=>namedMeal(day,'lunch')+'|'+namedMeal(day,'dinner')).join(';'));
 assert.equal(new Set(weeks).size,8);
 assert.ok(!weeks.some(w=>w.toLowerCase().includes('tofu')));
 assert.ok(weeks.some(w=>w.includes('bhindi')));
 assert.ok(weeks.some(w=>w.includes('khichdi')));
 assert.ok(weeks.some(w=>w.includes('brinjal')));
});
test('grocery list truly changes each week and after swapping a recipe',()=>{
 const before=weeklyGrocery(1,{});
 const after=weeklyGrocery(2,{});
 assert.notEqual(JSON.stringify(before),JSON.stringify(after));
 const swap={'mealOverrides':{'2026-11-25':{'lunch':'Spicy paneer fajita rice bowl'}}};
 const changed=weeklyGrocery(1,swap);
 assert.notDeepEqual(changed,before);
 assert.ok(changed.some(item=>item.key==='paneer'));
});
test('morning ritual is a nonmandatory daily rotation',()=>{
 const values=Array.from({length:7},(_,i)=>mealIdsForDate(weeklyMealDates(1)[i]).morning.title);
 assert.equal(new Set(values).size,7);
 assert.ok(values.some(x=>x.includes('Green smoothie')));
});

test('every named exercise has a distinct editable trial prescription with correct load units',()=>{
 for(const exercise of RECOMP_EXERCISES){
  const trial=STARTER_TRIALS[exercise.id];
  assert.ok(trial,exercise.id+' missing suggested trial weight');
  assert.ok(Number.isFinite(trial.weight)&&trial.weight>=0);
  const p=getPrescription(exercise,'2026-11-25',{});
  assert.ok(p.weight!==null,exercise.name+' should not demand manual initial entry');
  assert.ok(weightUnit(exercise).includes('lb'));
  assert.equal(p.reps.length,exercise.sets);
 }
 assert.equal(weightUnit(RECOMP_EXERCISES.find(x=>x.id==='dumbbell-shoulder-press')),'lb per dumbbell');
 assert.equal(getPrescription(raised,'2026-11-27',{}).weight,5);
});
test('changing an editable planned weight cascades even before a workout is completed',()=>{
 const hip=RECOMP_EXERCISES.find(x=>x.id==='machine-or-barbell-hip-thrust');
 const initial=getPrescription(hip,'2026-12-03',{});
 assert.equal(initial.weight,25);
 const p={planOverrides:{'2026-11-26':{[hip.id]:{weight:'95',reps:[10,10,10]}}}};
 assert.equal(getPrescription(hip,'2026-11-26',p).weight,95);
 const future=getPrescription(hip,'2026-12-03',p);
 assert.equal(future.weight,95);
 assert.deepEqual(future.reps,[10,10,10]);
 const lowered={planOverrides:{'2026-11-26':{[hip.id]:{weight:'65',reps:[8,8,8]}}}};
 assert.equal(getPrescription(hip,'2026-12-03',lowered).weight,65);
 assert.deepEqual(getPrescription(hip,'2026-12-03',lowered).reps,[8,8,8]);
});
test('performance updates override planned progression without forcing an increase',()=>{
 const hip=RECOMP_EXERCISES.find(x=>x.id==='machine-or-barbell-hip-thrust');
 const data={planOverrides:{'2026-11-26':{[hip.id]:{weight:'95'}}},
  logs:{'2026-11-26':{[hip.id]:{weight:'85',reps:['10','10','8'],rir:'2',pain:'no',form:'yes'}}}};
 let future=getPrescription(hip,'2026-12-03',data);
 assert.equal(future.weight,85);
 assert.deepEqual(future.reps,[11,10,8]);
 data.logs['2026-11-26'][hip.id].reps=['12','12','12'];
 future=getPrescription(hip,'2026-12-03',data);
 assert.equal(future.weight,90);
 assert.deepEqual(future.reps,[8,8,8]);
 data.logs['2026-11-26'][hip.id].pain='yes';
 assert.equal(getPrescription(hip,'2026-12-03',data).weight,85);
});
test('reported 12-3 incline treadmill and distinct StairMaster suggestions',()=>{
 const treadmill=getCardioPrescription('2026-11-26',{},'Treadmill');
 assert.equal(treadmill.speed,3);
 assert.equal(treadmill.incline,12);
 assert.equal(treadmill.minutes,25);
 const stairs=getCardioPrescription('2026-11-27',{},'StairMaster');
 assert.equal(stairs.minutes,25);
 assert.equal(stairs.level,6);
 assert.equal(stairs.trial,true);
 const fitness={cardio:{
  '2026-11-26':{completed:true,mode:'Treadmill',minutes:30,speed:3,incline:12},
  '2026-11-27':{completed:true,mode:'StairMaster',minutes:22,level:8}
 }};
 assert.deepEqual([getCardioPrescription('2026-12-04',fitness,'Treadmill').speed,
   getCardioPrescription('2026-12-04',fitness,'Treadmill').incline],[3,12]);
 assert.deepEqual([getCardioPrescription('2026-12-04',fitness,'StairMaster').minutes,
   getCardioPrescription('2026-12-04',fitness,'StairMaster').level],[22,8]);
});

test('every week has five batch-prepped portions and two alternative days per meal',()=>{
 for(let week=1;week<=8;week++){
  const dates=weeklyMealDates(week);
  const plan=weeklyBatchSummary(week);
  assert.ok(plan,'missing batch plan week '+week);
  assert.equal(plan.lunch[0].servings,5);
  assert.equal(plan.lunch[1].servings,2);
  assert.equal(plan.dinner[0].servings,5);
  assert.equal(plan.dinner[1].servings,2);
  for(const kind of ['lunch','dinner']){
   const tally=new Map();
   for(const day of dates){
    const menu=mealIdsForDate(day);
    tally.set(menu[kind],(tally.get(menu[kind])||0)+1);
   }
   assert.equal(tally.size,2,kind+' in week '+week+' should have only two batch choices');
   assert.equal(tally.get(plan[kind][0].id),5);
   assert.equal(tally.get(plan[kind][1].id),2);
  }
 }
});
test('main meal-prep lunches and dinners change each new week',()=>{
 const mainLunches=Array.from({length:8},(_,i)=>weeklyBatchSummary(i+1).lunch[0].id);
 const mainDinners=Array.from({length:8},(_,i)=>weeklyBatchSummary(i+1).dinner[0].id);
 assert.equal(new Set(mainLunches).size,8);
 assert.equal(new Set(mainDinners).size,8);
});
test('day-specific meal swaps still override the batched meal and update groceries',()=>{
 const date='2026-11-26';
 const before=namedMeal(date,'lunch',{});
 const after=namedMeal(date,'lunch',{mealOverrides:{[date]:{lunch:'Egg & spinach rice bowl'}}});
 assert.notEqual(before,after);
 const normal=weeklyGrocery(1,{});
 const altered=weeklyGrocery(1,{mealOverrides:{[date]:{lunch:'Egg & spinach rice bowl'}}});
 assert.notDeepEqual(normal,altered);
});

test('updated dumbbell and core loads are prefilled for every future workout date',()=>{
 const hip=RECOMP_EXERCISES.find(x=>x.id==='machine-or-barbell-hip-thrust');
 const bridge=RECOMP_EXERCISES.find(x=>x.id==='glute-bridge');
 const curl=RECOMP_EXERCISES.find(x=>x.id==='biceps-curl');
 const shoulder=RECOMP_EXERCISES.find(x=>x.id==='dumbbell-shoulder-press');
 const deadbug=RECOMP_EXERCISES.find(x=>x.id==='weighted-dead-bug');
 const cable=RECOMP_EXERCISES.find(x=>x.id==='cable-crunch');
 assert.equal(getPrescription(hip,'2026-11-26',{}).weight,25);
 assert.equal(getPrescription(bridge,'2026-11-30',{}).weight,25);
 assert.equal(weightUnit(hip),'lb single dumbbell total');
 assert.equal(getPrescription(curl,'2026-12-01',{}).weight,10);
 assert.equal(getPrescription(shoulder,'2026-11-27',{}).weight,10);
 assert.equal(getPrescription(deadbug,'2026-11-25',{}).weight,30);
 assert.equal(getPrescription(cable,'2026-11-25',{}).weight,25);
});
test('core sets completed Nov 25 recalculate the subsequent Friday core workout',()=>{
 const ex=RECOMP_EXERCISES.find(x=>x.id==='weighted-dead-bug');
 const fitness={logs:{'2026-11-25':{[ex.id]:{weight:'30',reps:['12','12','12'],rir:'2',pain:'no',form:'yes'}}}};
 const next=getPrescription(ex,'2026-11-27',fitness);
 assert.equal(next.weight,32.5);
 assert.deepEqual(next.reps,[8,8,8]);
 fitness.logs['2026-11-25'][ex.id].reps=['8','10','10'];
 const corrected=getPrescription(ex,'2026-11-27',fitness);
 assert.equal(corrected.weight,30);
 assert.deepEqual(corrected.reps,[9,10,10]);
});
test('future Upper B + Core Russian twists react to prior log and editable actuals',()=>{
 const ex=RECOMP_EXERCISES.find(x=>x.id==='weighted-russian-twist');
 const fitness={logs:{'2026-11-25':{[ex.id]:{weight:'20',reps:['24','24','24'],rir:'2',pain:'no',form:'yes'}}}};
 const dec1=getPrescription(ex,'2026-12-01',fitness);
 assert.equal(dec1.weight,22.5);
 fitness.logs['2026-11-25'][ex.id].reps=['20','18','20'];
 assert.equal(getPrescription(ex,'2026-12-01',fitness).weight,20);
});
test('leg rainbows stay at bodyweight instead of adding 5 lb after top reps',()=>{
 const ex=RECOMP_EXERCISES.find(x=>x.id==='controlled-leg-rainbow-with-ball');
 const f={logs:{'2026-11-25':{[ex.id]:{weight:'0',reps:['14','14'],rir:'2',pain:'no',form:'yes'}}}};
 const next=getPrescription(ex,'2026-11-27',f);
 assert.equal(next.weight,0);
 assert.equal(next.increase,false);
 assert.match(next.reason,/tempo|slowing/i);
});
test('user-changed dumbbell loads are carried forward and do not revert to trials',()=>{
 const ex=RECOMP_EXERCISES.find(x=>x.id==='machine-or-barbell-hip-thrust');
 const data={planOverrides:{'2026-11-26':{[ex.id]:{weight:'35',reps:[10,10,10]}}}};
 assert.equal(getPrescription(ex,'2026-12-10',data).weight,35);
 data.planOverrides['2026-11-26'][ex.id].weight='20';
 assert.equal(getPrescription(ex,'2026-12-10',data).weight,20);
});
