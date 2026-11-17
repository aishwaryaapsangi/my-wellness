import test from 'node:test';
import assert from 'node:assert/strict';
import {addStudyDays} from '../src/sweStudyLogic.js';
import {MICRO_START,MICRO_CONCEPTS,MICRO_FAMILIES,microLessonForDate,microDueLessons,microReviewForDate,microGrade,getMicroRecord} from '../src/sweMicroConcepts.js';
import {getDailyTasks} from '../src/sweIntegratedPlan.js';

test('the full micro database has unique, stable concepts across all data structures',()=>{
 assert.equal(MICRO_START,'2026-11-16');
 assert.ok(MICRO_CONCEPTS.length>=350);
 assert.equal(new Set(MICRO_CONCEPTS.map(c=>c.id)).size,MICRO_CONCEPTS.length);
 for(const c of MICRO_CONCEPTS){
  assert.ok(c.id&&c.title&&c.goal&&c.recall&&c.family);
  assert.ok(Number.isInteger(c.order));
  assert.ok(c.page>0);
 }
 for(const name of ['Arrays & ArrayList','HashMap / HashSet','Strings & characters','Stacks & queues','Linked lists','Trees & BST','Heaps & tries','Graphs & grids','Dynamic programming','Recursion & backtracking']){
  assert.ok(MICRO_FAMILIES.includes(name),name);
 }
});
test('one arrays/list concept per date for exactly the opening week',()=>{
 const titles=['Array slots','Primitive/reference','2D and ragged','ArrayList access','ArrayList add','ArrayList remove','Arrays.sort'];
 for(let i=0;i<7;i++){
  const d=addStudyDays(MICRO_START,i);
  const lesson=microLessonForDate(d);
  assert.ok(lesson.title.includes(titles[i]),d);
  assert.equal(lesson.order,i+1);
  const assigned=getDailyTasks(d).filter(t=>!!t.microId);
  assert.equal(assigned.length,1,d);
  assert.equal(assigned[0].microId,lesson.id);
 }
 assert.equal(microLessonForDate('2026-11-15'),null);
});
test('subsequent dates interleave other detailed structures instead of grouping whole subjects',()=>{
 const first=Array.from({length:40},(_,i)=>microLessonForDate(addStudyDays(MICRO_START,i+7)));
 assert.ok(first.some(x=>x.family==='Arrays & ArrayList'));
 assert.ok(first.some(x=>x.family==='HashMap / HashSet'));
 assert.ok(first.some(x=>x.family!=='Arrays & ArrayList'));
 assert.equal(getDailyTasks('2026-12-06').filter(t=>!!t.microId).length,1);
 assert.equal(getDailyTasks('2027-01-07').filter(t=>!!t.microId).length,1);
});
test('RED, YELLOW, GREEN and MOCK schedule a single concept separately',()=>{
 const red=microGrade({},'red','2026-11-16');
 const yellow=microGrade({},'yellow','2026-11-16');
 const green=microGrade({},'green','2026-11-16');
 assert.equal(red.dueDate,'2026-11-19');
 assert.equal(yellow.dueDate,'2026-11-23');
 assert.equal(green.dueDate,'2026-11-30');
 assert.equal(red.history.length,1);
 const again=microGrade(green,'green','2026-11-30');
 assert.equal(again.dueDate,'2026-12-30');
 assert.equal(again.history.length,2);
 const corrected=microGrade(again,'yellow','2026-11-30');
 assert.equal(corrected.history.length,2);
 assert.equal(corrected.dueDate,'2026-12-07');
 assert.throws(()=>microGrade(again,'green','2026-11-29'),/before/);
});
test('review selection is one oldest due concept; other concepts remain in backlog',()=>{
 const a=MICRO_CONCEPTS[0],b=MICRO_CONCEPTS[1],c=MICRO_CONCEPTS[2];
 const db={microRecords:{
  [a.id]:microGrade({},'red','2026-11-16'),
  [b.id]:microGrade({},'yellow','2026-11-16'),
  [c.id]:microGrade({},'red','2026-11-17')
 }};
 assert.equal(microDueLessons(db,'2026-11-18').length,0);
 assert.equal(microReviewForDate(db,'2026-11-19').id,a.id);
 assert.deepEqual(microDueLessons(db,'2026-11-23').slice(0,3).map(x=>x.id),[a.id,c.id,b.id]);
 db.microRecords[a.id]=microGrade(db.microRecords[a.id],'green','2026-11-23');
 assert.equal(microReviewForDate(db,'2026-11-23').id,c.id);
 assert.equal(db.microRecords[b.id].dueDate,'2026-11-23');
});
test('existing handbook skill history is available through the micro-library migration',()=>{
 const source=MICRO_CONCEPTS.find(c=>c.sourceSkillId);
 assert.ok(source);
 const old=microGrade({},'green','2026-11-16');
 assert.deepEqual(getMicroRecord({skills:{[source.sourceSkillId]:old}},source),old);
 const newer=microGrade(old,'yellow','2026-11-30');
 assert.deepEqual(getMicroRecord({skills:{[source.sourceSkillId]:old},microRecords:{[source.id]:newer}},source),newer);
});
test('all study dates map to one new lesson until the source-backed curriculum ends',()=>{
 const ids=[];
 for(let i=0;i<MICRO_CONCEPTS.length;i++)ids.push(microLessonForDate(addStudyDays(MICRO_START,i))?.id);
 assert.deepEqual(ids,MICRO_CONCEPTS.map(c=>c.id));
 assert.equal(microLessonForDate(addStudyDays(MICRO_START,MICRO_CONCEPTS.length)),null);
});
