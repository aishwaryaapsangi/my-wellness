import test from 'node:test';import assert from 'node:assert/strict';
import {DEFAULT_TASKS,due,weekday,offset,monthGrid,WORKOUTS,mergedTasks} from '../src/planner.js';
const t=id=>DEFAULT_TASKS.find(t=>t.id===id);
test('Monday hair wash shows on Mondays but not Tuesdays',()=>{assert.equal(due(t('hair-keto'),'2026-11-16'),true);assert.equal(due(t('hair-keto'),'2026-11-17'),false)});
test('every two days recurs from editable anchor',()=>{const e=t('eyedrops');assert.equal(due(e,'2026-11-16'),true);assert.equal(due(e,'2026-11-17'),false);assert.equal(due(e,'2026-11-18'),true);const changed=mergedTasks({'eyedrops':{schedule:{type:'interval',every:3,anchor:'2026-11-17'}}}).find(t=>t.id==='eyedrops');assert.equal(due(changed,'2026-11-20'),true);assert.equal(due(changed,'2026-11-19'),false)});
test('three abs one upper one lower',()=>{assert.equal(WORKOUTS.filter(x=>x.name.startsWith('Abs')).length,3);assert.match(WORKOUTS[2].name,/Upper/);assert.match(WORKOUTS[4].name,/Lower/)});
test('timezone-safe dates and calendar',()=>{assert.equal(weekday('2026-11-16'),1);assert.equal(offset('2026-11-30',1),'2026-12-01');assert.equal(monthGrid('2026-11-16').length,42)});
test('optional items are not forced into daily list',()=>{assert.equal(due(t('heatless'),'2026-11-16'),false)});
