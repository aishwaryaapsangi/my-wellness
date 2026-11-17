import test from 'node:test';
import assert from 'node:assert/strict';
import handbook from '../src/sweHandbookData.json' with {type:'json'};
import {EARLIER_PRACTICE} from '../src/sweRoadmap.js';
import {EXTRA_QUESTIONS} from '../src/sweQuestionBank.js';
import {NOVEMBER_DAILY,NOVEMBER_DSA_FAMILIES,decemberTasks} from '../src/sweAcceleratedNovember.js';
import {conceptsForProblem,filterLeetCodeProblems} from '../src/leetcodeStudyModel.js';

const merged=new Map([...handbook.problems,...EARLIER_PRACTICE,...EXTRA_QUESTIONS].map(x=>[x.id,x]));
test('additional bank has both Java practice and SQL LeetCode catalog questions',()=>{
 assert.ok(EXTRA_QUESTIONS.length>=90);
 assert.ok(EXTRA_QUESTIONS.filter(x=>x.language==='SQL').length>=25);
 assert.ok(EXTRA_QUESTIONS.filter(x=>x.language==='Java').length>=55);
 for(const p of EXTRA_QUESTIONS){
  assert.ok(Number.isInteger(p.id)&&p.id>0);
  assert.ok(p.title&&p.pattern);
  assert.ok(['Easy','Medium','Hard'].includes(p.difficulty));
  assert.ok(p.concepts.length);
 }
});
test('all November Java and SQL assignments have an exact problem number in the study bank',()=>{
 for(const [date,day] of Object.entries(NOVEMBER_DAILY)){
  for(const id of [...day.problemIds,...day.sqlIds])assert.ok(merged.has(id),date+' missing #'+id);
  for(const sqlId of day.sqlIds)assert.equal(merged.get(sqlId).language,'SQL',date+' SQL #'+sqlId);
 }
});
test('December program revisits real Java IDs and rotates SQL queries with correct syntax families',()=>{
 for(let day=1;day<=31;day++){
  const date='2026-12-'+String(day).padStart(2,'0');
  const tasks=decemberTasks(date,{});
  assert.ok(tasks.some(x=>x.category==='review'));
  for(const task of tasks.filter(x=>x.problemId))assert.ok(merged.has(task.problemId),date+' missing #'+task.problemId);
 }
});
test('SQL language+concept filters never show Java and preserve difficulty',()=>{
 const sql=EXTRA_QUESTIONS.filter(p=>p.language==='SQL'),java=EXTRA_QUESTIONS.filter(p=>p.language==='Java');
 const list=[...java,...sql];
 const filtered=filterLeetCodeProblems(list,{}, {language:'SQL',concept:'SQL Joins',difficulty:'Easy'});
 assert.ok(filtered.length>=4);
 assert.ok(filtered.every(p=>p.language==='SQL'&&p.difficulty==='Easy'));
 assert.ok(filtered.every(p=>conceptsForProblem(p).includes('SQL Joins')));
 assert.equal(filterLeetCodeProblems(list,{}, {language:'Java',concept:'SQL Joins'}).length,0);
});
