import test from 'node:test';
import assert from 'node:assert/strict';
import {getPrescription,getCardioPrescription,incrementFor} from '../src/bodyRecompProgress.js';
import {RICH_RECIPES,mealIdsForDate,namedMeal,weeklyGrocery,weeklyMealDates} from '../src/bodyRecompMeals.js';
import {RECOMP_EXERCISES} from '../src/bodyRecompData.js';

const raised=RECOMP_EXERCISES.find(x=>x.name.includes('straight-leg'));
const curl={id:'a-curl',session:'Upper B + Core',name:'Biceps curl',sets:2,low:8,high:12};
const lower={id:'hip-thrust-test',session:'Lower A',sets:3,low:8,high:12};

test('known strength starts at actually reported resistance; unknowns require calibration',()=>{
 const p=getPrescription(raised,'2026-11-27',{});
 assert.equal(p.weight,5);
 assert.equal(p.sets,3);
 assert.deepEqual(p.reps,[8,8,8]);
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
 assert.deepEqual([p.minutes,p.speed,p.incline],[20,2.8,2]);
 const q=getCardioPrescription('2026-12-04',{cardio:{'2026-11-27':{completed:true,minutes:30,speed:3,incline:4,effort:7}}});
 assert.deepEqual([q.minutes,q.speed,q.incline],[30,3,4]);
 assert.match(q.note,/difficult/);
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
