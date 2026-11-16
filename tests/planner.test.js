import test from 'node:test';import assert from 'node:assert/strict';
import {DEFAULT_TASKS,due,weekday,offset,monthGrid,WORKOUTS,mergedTasks} from '../src/planner.js';
const t=id=>DEFAULT_TASKS.find(t=>t.id===id);
test('Monday hair wash shows on Mondays but not Tuesdays',()=>{assert.equal(due(t('hair-keto'),'2026-11-16'),true);assert.equal(due(t('hair-keto'),'2026-11-17'),false)});
test('every two days recurs from editable anchor',()=>{const e=t('eyedrops');assert.equal(due(e,'2026-11-16'),true);assert.equal(due(e,'2026-11-17'),false);assert.equal(due(e,'2026-11-18'),true);const changed=mergedTasks({'eyedrops':{schedule:{type:'interval',every:3,anchor:'2026-11-17'}}}).find(t=>t.id==='eyedrops');assert.equal(due(changed,'2026-11-20'),true);assert.equal(due(changed,'2026-11-19'),false)});
test('three abs one upper one lower',()=>{assert.equal(WORKOUTS.filter(x=>x.name.startsWith('Abs')).length,3);assert.match(WORKOUTS[2].name,/Upper/);assert.match(WORKOUTS[4].name,/Lower/)});
test('timezone-safe dates and calendar',()=>{assert.equal(weekday('2026-11-16'),1);assert.equal(offset('2026-11-30',1),'2026-12-01');assert.equal(monthGrid('2026-11-16').length,42)});
test('optional items are not forced into daily list',()=>{assert.equal(due(t('heatless'),'2026-11-16'),false)});
import {scheduledItems,socialPlansForDate,HAIR_WEEK_LABELS,SOCIAL_CHALLENGES} from '../src/planner.js';
const all=(date,s={})=>scheduledItems(DEFAULT_TASKS,date,s);
test('all seven days have distinct evening hair-care routines',()=>{
 const expected=['hair-sun','hair-keto','hair-rest-tue','hair-moisture','hair-tonic','hair-keto','hair-recovery'];
 for(let i=0;i<7;i++){
   const date=offset('2026-11-15',i);const hair=all(date).filter(t=>t.tag==='hair');
   assert.ok(hair.some(t=>t.id===expected[i]),`missing ${expected[i]} on ${date}`);
   assert.equal(hair.filter(t=>t.id!=='heatless').every(t=>t.phase==='sunset'),true,`${date} hair moved to sunset`);
 }
});
test('morning prayers and gua sha happen daily, early sessions alternate',()=>{
 const m=all('2026-11-16');const tues=all('2026-11-17');
 assert.ok(m.find(t=>t.id==='morning-prayer'));
 assert.ok(tues.find(t=>t.id==='morning-prayer'));
 assert.ok(m.find(t=>t.id==='gua-sha'));
 assert.equal(m.find(t=>t.id==='early-code')?.time,'5:00 AM');
 assert.equal(m.some(t=>t.id==='early-run'),false);
 assert.equal(tues.find(t=>t.id==='early-run')?.time,'6:00 AM');
 assert.equal(tues.some(t=>t.id==='early-code'),false);
});
test('mental themes rotate across all seven dates',()=>{
 for(let i=0;i<7;i++){
   const date=offset('2026-11-15',i);
   assert.equal(all(date).filter(t=>t.id.startsWith('mind-day-')).length,1);
   assert.equal(all(date).find(t=>t.id.startsWith('mind-day-')).id,`mind-day-${i}`);
 }
 assert.equal(SOCIAL_CHALLENGES.length,7);
});
test('weekend social plan feeds back into daily ritual and weekday plans are supported',()=>{
 const events=[{id:'a',title:'Museum with friend',date:'2026-11-21',time:'14:00',place:'Providence',note:'Meet outside'}];
 assert.equal(socialPlansForDate(events,'2026-11-21').length,1);
 const sat=all('2026-11-21',{socialEvents:events});
 const task=sat.find(t=>t.id==='weekend-connection');
 assert.match(task.subtitle,/Museum with friend/);
 assert.match(task.steps.join(' '),/Providence/);
 const monday=all('2026-11-23',{socialEvents:[{id:'b',date:'2026-11-23',title:'Call Bonnie',time:'18:00'}]});
 assert.ok(monday.some(t=>t.id==='social-plans-for-date'));
});
test('editing hair recurrence changes dates, including weekly preview data',()=>{
 const changed=mergedTasks({'hair-keto':{schedule:{type:'days',days:[2,6]}}});
 assert.equal(all('2026-11-16',{ }).some(t=>t.id==='hair-keto'),true);
 assert.equal(scheduledItems(changed,'2026-11-16').some(t=>t.id==='hair-keto'),false);
 assert.equal(scheduledItems(changed,'2026-11-17').some(t=>t.id==='hair-keto'),true);
});

test('nighttime lubricating drops keep two-day cadence and remain editable',()=>{
 const eye=t('eyedrops');
 assert.equal(eye.phase,'sunset');
 assert.equal(eye.time,'9:17 PM');
 assert.equal(due(eye,'2026-11-16'),true);
 assert.equal(due(eye,'2026-11-17'),false);
 const changed=mergedTasks({'eyedrops':{schedule:{type:'interval',every:3,anchor:'2026-11-17'}}}).find(x=>x.id==='eyedrops');
 assert.equal(changed.phase,'sunset');
 assert.equal(due(changed,'2026-11-20'),true);
});
test('elegant morning preparation appears daily with hair care still at night',()=>{
 for(let i=0;i<7;i++){
  const date=offset('2026-11-15',i);
  const ready=scheduledItems(DEFAULT_TASKS,date).find(x=>x.id==='get-ready');
  assert.equal(ready?.phase,'sunrise');
  assert.equal(ready?.time,'8:20 AM');
  assert.match(ready?.steps.join(' ')||'',/iron/i);
  assert.match(ready?.steps.join(' ')||'',/hair/i);
  assert.ok(scheduledItems(DEFAULT_TASKS,date).filter(x=>x.tag==='hair').every(x=>x.phase==='sunset'));
 }
});
