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
  assert.equal(ready?.time,i===0||i===6?'9:05 AM':'6:40 AM');
  assert.match(ready?.steps.join(' ')||'',/iron/i);
  assert.match(ready?.steps.join(' ')||'',/hair/i);
  assert.ok(scheduledItems(DEFAULT_TASKS,date).filter(x=>x.tag==='hair').every(x=>x.phase==='sunset'));
 }
});


test('weekday 7:00–7:30 work goal and 3:30 home target are explicitly conditional',()=>{
  const mon=all('2026-11-16');
  const work=mon.find(t=>t.id==='workday-start');
  const home=mon.find(t=>t.id==='home-by-three');
  assert.equal(work?.phase,'sunrise');
  assert.equal(work?.time,'7:10 AM');
  assert.equal(home?.phase,'after');
  assert.equal(home?.time,'3:30 PM');
  assert.match(home?.steps.join(' ')||'',/commute/i);
  const sun=all('2026-11-22');
  assert.equal(sun.some(t=>t.id==='workday-start'),false);
  assert.equal(sun.some(t=>t.id==='home-by-three'),false);
});
test('after-work coding appears on weekdays and leaves weekends open',()=>{
  const mon=all('2026-11-16').find(t=>t.id==='after-code');
  assert.equal(mon?.phase,'after');
  assert.equal(mon?.time,'6:45 PM');
  assert.match(mon?.steps.join(' ')||'',/LeetCode/);
  assert.equal(all('2026-11-22').some(t=>t.id==='after-code'),false);
});
test('weekday and weekend mornings flow earlier or later without overriding custom times',()=>{
  const mon=all('2026-11-16');
  const sat=all('2026-11-21');
  assert.equal(mon.find(t=>t.id==='breakfast')?.time,'6:55 AM');
  assert.equal(mon.find(t=>t.id==='get-ready')?.time,'6:40 AM');
  assert.equal(sat.find(t=>t.id==='breakfast')?.time,'9:20 AM');
  assert.equal(sat.find(t=>t.id==='get-ready')?.time,'9:05 AM');
  const edited=mergedTasks({'get-ready':{time:'7:05 AM'}});
  assert.equal(scheduledItems(edited,'2026-11-21').find(t=>t.id==='get-ready')?.time,'7:05 AM');
});
test('lubricating drops remain at night on alternate days',()=>{
  const mon=all('2026-11-16');
  assert.equal(mon.find(t=>t.id==='eyedrops')?.phase,'sunset');
  assert.equal(mon.find(t=>t.id==='eyedrops')?.time,'9:17 PM');
  assert.equal(all('2026-11-17').some(t=>t.id==='eyedrops'),false);
});

import {PERIOD_START,PERIOD_END,inPeriod,clampPeriod,elapsedPeriodDates,dayProgress,periodProgress,SKINCARE_ROTATION,WATER_ROTATION,MEALS} from '../src/planner.js';
test('season only includes Nov 16 through Dec 31, 2026',()=>{
 assert.equal(PERIOD_START,'2026-11-16');assert.equal(PERIOD_END,'2026-12-31');
 assert.equal(inPeriod('2026-11-15'),false);assert.equal(inPeriod('2026-11-16'),true);
 assert.equal(inPeriod('2026-12-31'),true);assert.equal(inPeriod('2027-01-01'),false);
 assert.equal(clampPeriod('2026-11-15'),PERIOD_START);
 assert.equal(clampPeriod('2027-01-01'),PERIOD_END);
 assert.deepEqual(elapsedPeriodDates('2026-11-16'),['2026-11-16']);
 assert.equal(elapsedPeriodDates('2026-11-30').length,15);
 assert.equal(elapsedPeriodDates('2026-12-01').length,16);
 assert.equal(elapsedPeriodDates('2026-12-31').length,46);
 assert.equal(elapsedPeriodDates('2027-01-01').length,46);
});
test('selected-day progress is independent of elapsed period percentage',()=>{
 const monday=scheduledItems(DEFAULT_TASKS,'2026-11-16');
 const state={completion:{'2026-11-16':{[monday[0].id]:true}}};
 const day=dayProgress(DEFAULT_TASKS,'2026-11-16',state);
 assert.equal(day.completed,1);
 assert.ok(day.percent>0);
 const season=periodProgress(DEFAULT_TASKS,state,'2026-11-17');
 assert.equal(season.daysElapsed,2);
 assert.equal(season.completed,1);
 assert.equal(season.activeDays,1);
 assert.equal(season.scheduled,scheduledItems(DEFAULT_TASKS,'2026-11-16').length+scheduledItems(DEFAULT_TASKS,'2026-11-17').length);
 assert.equal(season.percent,Math.round(100/season.scheduled));
});
test('future days do not lower overall consistency until they arrive',()=>{
 const future=scheduledItems(DEFAULT_TASKS,'2026-12-31')[0].id;
 const state={completion:{'2026-12-31':{[future]:true}}};
 assert.equal(periodProgress(DEFAULT_TASKS,state,'2026-11-16').completed,0);
 assert.equal(periodProgress(DEFAULT_TASKS,state,'2026-12-31').completed,1);
 assert.equal(periodProgress(DEFAULT_TASKS,state,'2027-01-02').completed,1);
});
test('skincare rotation and nighttime eyedrops follow each day',()=>{
 assert.equal(SKINCARE_ROTATION.length,7);
 const monday=scheduledItems(DEFAULT_TASKS,'2026-11-16');
 const tuesday=scheduledItems(DEFAULT_TASKS,'2026-11-17');
 assert.ok(monday.some(x=>x.id==='hair-keto'&&x.phase==='sunset'));
 assert.ok(tuesday.some(x=>x.id==='hair-rest-tue'&&x.phase==='sunset'));
 assert.notEqual(monday.find(x=>x.id==='skincare-pm').subtitle,tuesday.find(x=>x.id==='skincare-pm').subtitle);
 assert.equal(monday.find(x=>x.id==='eyedrops').phase,'sunset');
 assert.equal(tuesday.some(x=>x.id==='eyedrops'),false);
 assert.notEqual(WATER_ROTATION[1].name,WATER_ROTATION[2].name);
 assert.notDeepEqual(MEALS[1],MEALS[2]);
});
