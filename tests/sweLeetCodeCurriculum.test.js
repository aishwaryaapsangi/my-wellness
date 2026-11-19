import test from 'node:test';
import assert from 'node:assert/strict';
import {selectNewLeetCode,isNewProblemEligible,GOOGLE_TOP_50_PROBLEMS,LEETCODE_PHASES} from '../src/sweLeetCodeCurriculum.js';
import {isLeetCodeDue,leetCodeDueDate,problemRecallGap,logProblemAttempt} from '../src/leetcodeStudyModel.js';
const bank=[
 {id:26,title:'Remove Duplicates from Sorted Array',difficulty:'Easy',language:'Java'},
 {id:283,title:'Move Zeroes',difficulty:'Easy',language:'Java'},
 {id:1480,title:'Running Sum of 1d Array',difficulty:'Easy',language:'Java'},
 {id:206,title:'Reverse Linked List',difficulty:'Easy',language:'Java'},
 {id:200,title:'Number of Islands',difficulty:'Medium',language:'Java'},
 ...GOOGLE_TOP_50_PROBLEMS
];
test('foundation-first selection never pushes linked lists or graphs into the current array stage',()=>{
 for(const date of ['2026-11-19','2026-11-23','2026-11-25']){
  const p=selectNewLeetCode(date,bank,{});
  assert.ok(p&&[26,283,1480].includes(p.id),date+' '+p?.id);
  assert.equal(isNewProblemEligible(bank.find(x=>x.id===206),date,{}),false);
  assert.equal(isNewProblemEligible(bank.find(x=>x.id===200),date,{}),false);
 }
 assert.ok(LEETCODE_PHASES.length>=8);
});
test('never calls an attempted or prior problem a new assignment',()=>{
 const entries=[{id:26,title:'Old',prior:true,difficulty:'Easy',language:'Java'},...bank.slice(1)];
 const records={283:logProblemAttempt({},'green','2026-11-18')};
 const candidate=selectNewLeetCode('2026-11-19',entries,records);
 assert.equal(candidate.id,1480);
});
test('Top Google 50 is available in library but not assigned before prerequisites',()=>{
 assert.equal(GOOGLE_TOP_50_PROBLEMS.length,50);
 const hard=GOOGLE_TOP_50_PROBLEMS.find(x=>x.id===1293);
 assert.equal(isNewProblemEligible(hard,'2026-11-19'),false);
 assert.equal(isNewProblemEligible(hard,'2027-02-01'),true);
});
test('LeetCode review is always at least five days, including legacy saves',()=>{
 for(const grade of ['red','yellow','green','mock'])for(const effort of ['struggled','normal','easy']){
  assert.ok(problemRecallGap(grade,0,effort)>=5,grade+' '+effort);
 }
 const legacy={lastReviewed:'2026-11-19',dueDate:'2026-11-20',history:[{date:'2026-11-19',grade:'red'}]};
 assert.equal(leetCodeDueDate(legacy),'2026-11-24');
 assert.equal(isLeetCodeDue(legacy,'2026-11-20'),false);
 assert.equal(isLeetCodeDue(legacy,'2026-11-24'),true);
});
