import test from 'node:test';
import assert from 'node:assert/strict';
import {attempted,conceptsForProblem,logProblemAttempt,editProblemAttempt,deleteProblemAttempt,recalcProblem,filterLeetCodeProblems,validStudyDate,ALL_CONCEPTS} from '../src/leetcodeStudyModel.js';

const bank=[
 {id:27,title:'Remove Element',phase:'F1',pattern:'read/write indices',prior:true},
 {id:1,title:'Two Sum',phase:'F2',pattern:'HashMap complement',prior:false},
 {id:206,title:'Reverse Linked List',phase:'F3',pattern:'pointer reversal',prior:false},
 {id:200,title:'Number of Islands',phase:'F4',pattern:'grid DFS/BFS',prior:false},
 {id:989,title:'Add to Array-Form of Integer',phase:'PRIOR',pattern:'digit carry',prior:true}
];
test('previously discussed questions do NOT count as attempted without an actual saved grade',()=>{
 assert.equal(attempted(undefined),false);
 assert.equal(attempted({notes:'did this before'}),false);
 assert.equal(filterLeetCodeProblems(bank,{}, {status:'prior'}).length,0);
 assert.equal(filterLeetCodeProblems(bank,{}, {status:'unattempted'}).length,bank.length);
 const records={27:logProblemAttempt({},'red','2026-11-16','class Solution {}','Forgot pointer','a1')};
 assert.deepEqual(filterLeetCodeProblems(bank,records,{status:'prior'}).map(p=>p.id),[27]);
 assert.deepEqual(filterLeetCodeProblems(bank,records,{status:'unattempted'}).map(p=>p.id),[1,206,200,989]);
});
test('array filter returns only data-structure matches and can combine with difficulty',()=>{
 const list=filterLeetCodeProblems(bank,{}, {concept:'Arrays'});
 assert.deepEqual(list.map(p=>p.id),[27,1,989]); // #989 operates on digit array; #206 is NOT an array
 assert.ok(conceptsForProblem(bank[0]).includes('Two Pointers'));
 assert.deepEqual(filterLeetCodeProblems(bank,{}, {concept:'Linked List'}).map(p=>p.id),[206]);
 assert.deepEqual(filterLeetCodeProblems(bank,{}, {concept:'Graphs'}).map(p=>p.id),[200]);
 const records={27:{difficulty:'Easy'},1:{difficulty:'Easy'},989:{difficulty:'Medium'}};
 assert.deepEqual(filterLeetCodeProblems(bank,records,{concept:'Arrays',difficulty:'Easy'}).map(p=>p.id),[27,1]);
 assert.deepEqual(filterLeetCodeProblems(bank,records,{concept:'Arrays',difficulty:'Medium'}).map(p=>p.id),[989]);
});
test('user-edited tags override suggestions including an intentional empty tag set',()=>{
 const p=bank[0];
 assert.ok(conceptsForProblem(p,{}).includes('Arrays'));
 assert.deepEqual(conceptsForProblem(p,{concepts:['Strings','Strings','Nonexistent']}),['Strings']);
 assert.deepEqual(conceptsForProblem(p,{concepts:[]}),[]);
 assert.deepEqual(filterLeetCodeProblems(bank,{27:{concepts:['Strings']}},{concept:'Arrays'}).map(x=>x.id),[1,989]);
 assert.ok(ALL_CONCEPTS.includes('Dynamic Programming'));
});
test('due queue includes scheduled retakes AND this week first-time assignments, not every unread problem',()=>{
 const records={27:logProblemAttempt({},'red','2026-11-16','','','old')};
 const due=filterLeetCodeProblems(bank,records,{status:'due',today:'2026-11-17',firstAttempts:[1,206]});
 assert.deepEqual(due.map(p=>p.id),[27,1,206]);
 assert.deepEqual(filterLeetCodeProblems(bank,records,{status:'due',today:'2026-11-16',firstAttempts:[]}),[]);
});
test('dated retakes preserve code snapshots and compute correct SRS from chronological history',()=>{
 let r={difficulty:'Easy',concepts:['Arrays','Two Pointers'],referenceCode:'// Verified expected solution',workingCode:'// My latest code'};
 r=logProblemAttempt(r,'red','2026-11-10','int a=0;','My first pointer bug','one');
 assert.equal(r.dueDate,'2026-11-11');
 r=logProblemAttempt(r,'yellow','2026-11-12','int count=1;','Fixed bug with hint','two');
 assert.equal(r.dueDate,'2026-11-15');
 r=logProblemAttempt(r,'green','2026-11-17','int write=0;','Independent!','three');
 assert.equal(r.dueDate,'2026-11-20');
 assert.equal(r.lastReviewed,'2026-11-17');
 assert.equal(r.attempts,3);
 assert.deepEqual(r.history.map(h=>h.date),['2026-11-10','2026-11-12','2026-11-17']);
 assert.equal(r.history[0].code,'int a=0;');
 assert.equal(r.history[2].code,'int write=0;');
 assert.equal(r.referenceCode,'// Verified expected solution');
 assert.equal(r.difficulty,'Easy');
 assert.deepEqual(r.concepts,['Arrays','Two Pointers']);
});
test('backdated attempts sort chronologically, change next review, and can be edited/deleted',()=>{
 let r=logProblemAttempt({},'green','2026-11-14','a','', 'a');
 r=logProblemAttempt(r,'green','2026-11-17','b','', 'b');
 assert.equal(r.dueDate,'2026-11-20');
 r=logProblemAttempt(r,'red','2026-11-15','c','', 'c');
 assert.deepEqual(r.history.map(h=>h.id),['a','c','b']);
 assert.equal(r.dueDate,'2026-11-18'); // a GREEN then c RED resets; b GREEN starts at day 1
 r=editProblemAttempt(r,'c',{date:'2026-11-16',grade:'yellow'});
 assert.equal(r.history[1].date,'2026-11-16');
 assert.equal(r.history[1].grade,'yellow');
 r=deleteProblemAttempt(r,'c');
 assert.deepEqual(r.history.map(h=>h.id),['a','b']);
 assert.equal(r.dueDate,'2026-11-20');
});
test('duplicate clicks do not invent attempts and legacy IDs can be edited without loss',()=>{
 let r=logProblemAttempt({},'red','2026-11-17','my code','oops','repeat');
 const before=r.history.length;
 r=logProblemAttempt(r,'red','2026-11-17','my code','oops','another');
 assert.equal(r.history.length,before);
 const legacy=recalcProblem({notes:'existing reflection',history:[{date:'2026-11-16',grade:'red',previousStage:-1}]});
 assert.equal(legacy.history[0].id,'legacy-0-2026-11-16-red');
 assert.equal(legacy.notes,'existing reflection');
 const fixed=editProblemAttempt(legacy,legacy.history[0].id,{date:'2026-11-15'});
 assert.equal(fixed.dueDate,'2026-11-16');
});
test('invalid or future attempt dates are never silently inserted',()=>{
 assert.equal(validStudyDate('2026-02-30','2026-11-17'),false);
 assert.equal(validStudyDate('2026-11-18','2026-11-17'),false);
 assert.equal(validStudyDate('2026-11-17','2026-11-17'),true);
 assert.throws(()=>logProblemAttempt({},'mock','2099-01-01'),/date/i);
 assert.throws(()=>logProblemAttempt({},'invalid','2026-11-17'),/grade/i);
});
test('grade and date filter with search combines correctly',()=>{
 const records={27:logProblemAttempt({difficulty:'Easy'},'green','2026-11-16'),1:logProblemAttempt({difficulty:'Easy'},'yellow','2026-11-15')};
 assert.deepEqual(filterLeetCodeProblems(bank,records,{status:'green',concept:'Arrays',difficulty:'Easy',search:'remove'}).map(p=>p.id),[27]);
 assert.deepEqual(filterLeetCodeProblems(bank,records,{phase:'F3',status:'unattempted',concept:'Linked List'}).map(p=>p.id),[206]);
});
