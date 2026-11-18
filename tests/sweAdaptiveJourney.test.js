import test from 'node:test';
import assert from 'node:assert/strict';
import {ENGINEERING_MICROS,engineeringLessonsForDate,engineeringDueLessons} from '../src/sweEngineeringMicro.js';
import {microGrade} from '../src/sweMicroConcepts.js';
import {getDailyTasks} from '../src/sweIntegratedPlan.js';
import {recalcProblem,logProblemAttempt,editProblemAttempt,problemRecallGap} from '../src/leetcodeStudyModel.js';

test('Nov 18 and 19 reflect reported OOP/Java learning without auto-grading',()=>{
 const today=engineeringLessonsForDate('2026-11-18');
 assert.deepEqual(today.map(x=>x.title),[
  'Polymorphism: declared vs runtime type',
  'Object methods: equals, hashCode, toString',
  'BigDecimal: exact money values']);
 const tomorrow=engineeringLessonsForDate('2026-11-19');
 assert.deepEqual(tomorrow.map(x=>x.title),[
  'Enums: constants, fields and methods',
  'Encapsulation: private fields and invariants']);
 assert.ok(today.every(x=>x.priority));
 assert.ok(getDailyTasks('2026-11-18').some(x=>x.label.includes('BigDecimal')));
 assert.ok(getDailyTasks('2026-11-19').some(x=>x.label.includes('Encapsulation')));
});
test('engineering curriculum has atomic cross-stack coverage, distinct IDs, and due recall',()=>{
 assert.ok(ENGINEERING_MICROS.length>=60);
 assert.equal(new Set(ENGINEERING_MICROS.map(x=>x.id)).size,ENGINEERING_MICROS.length);
 for(const f of ['Java OOP','Backend / APIs','SQL / databases','Angular / TypeScript','Engineering practice'])
  assert.ok(ENGINEERING_MICROS.some(x=>x.family===f),f);
 const c=ENGINEERING_MICROS[0];
 assert.ok(c.goal&&c.syntax&&c.recall&&c.trap);
 const graded=microGrade({},'green','2026-11-18');
 assert.equal(graded.dueDate,'2026-11-19');
 assert.ok(engineeringDueLessons({microRecords:{[c.id]:graded}},'2026-11-19').some(x=>x.id===c.id));
 assert.ok(engineeringLessonsForDate('2027-02-01').length===0);
});
test('LeetCode official difficulty is independent of self-reported attempt effort',()=>{
 const baseline=logProblemAttempt({difficulty:'Hard'},'green','2026-11-16','class Solution {}','','seed','normal');
 const first=logProblemAttempt(baseline,'green','2026-11-18','class Solution {}','','one','struggled');
 const normal=logProblemAttempt(baseline,'green','2026-11-18','class Solution {}','','one','normal');
 const easy=logProblemAttempt(baseline,'green','2026-11-18','class Solution {}','','one','easy');
 assert.equal(first.difficulty,'Hard');
 assert.ok(first.dueDate<normal.dueDate);
 assert.ok(easy.dueDate>normal.dueDate);
 assert.equal(first.history.at(-1).effort,'struggled');
 assert.equal(editProblemAttempt(first,first.history.at(-1).id,{effort:'easy'}).dueDate,easy.dueDate);
 assert.equal(problemRecallGap('yellow',0,'struggled'),1);
 assert.equal(problemRecallGap('red',0,'struggled'),1);
});
test('editing historical effort updates the schedule and old data still works',()=>{
 const legacy=recalcProblem({history:[{id:'a',date:'2026-11-18',grade:'green'}]});
 assert.equal(legacy.history[0].effort,'normal');
 const fixed=editProblemAttempt(legacy,'a',{effort:'easy'});
 assert.ok(fixed.dueDate>legacy.dueDate);
});
