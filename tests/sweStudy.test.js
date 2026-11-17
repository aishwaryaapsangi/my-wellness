import test from 'node:test';
import assert from 'node:assert/strict';
import {REVIEW_GAPS,addStudyDays,gradeStudy,reviewDue,reviewOverdue,dailyStreak,completionStats,daysUntil} from '../src/sweStudyLogic.js';

test('spaced repetition moves from D1 to D3 to D7 to D14 on independent reviews',()=>{
 let r=gradeStudy({},'green','2026-11-16');
 assert.equal(r.dueDate,'2026-11-17');
 r=gradeStudy(r,'green','2026-11-17');assert.equal(r.dueDate,'2026-11-20');
 r=gradeStudy(r,'green','2026-11-20');assert.equal(r.dueDate,'2026-11-27');
 r=gradeStudy(r,'green','2026-11-27');assert.equal(r.dueDate,'2026-12-11');
 assert.equal(r.attempts,4);
});
test('red resets to tomorrow; yellow moves review to three days',()=>{
 let r=gradeStudy({},'green','2026-11-16');
 r=gradeStudy(r,'red','2026-11-17');assert.equal(r.stage,0);assert.equal(r.dueDate,'2026-11-18');
 r=gradeStudy(r,'yellow','2026-11-18');assert.equal(r.dueDate,'2026-11-21');
});
test('calendar arithmetic works across months and leap years',()=>{
 assert.equal(addStudyDays('2027-02-27',3),'2027-03-02');
 assert.equal(addStudyDays('2028-02-27',3),'2028-03-01');
 assert.equal(daysUntil('2027-05-31','2027-05-01'),30);
});
test('due and overdue detection',()=>{
 const r=gradeStudy({},'green','2026-11-16');
 assert.equal(reviewDue(r,'2026-11-16'),false);
 assert.equal(reviewDue(r,'2026-11-17'),true);
 assert.equal(reviewOverdue(r,'2026-11-20'),3);
});
test('streak tolerates no work today and avoids counting duplicate logs',()=>{
 const a={history:[{date:'2026-11-13'},{date:'2026-11-14'},{date:'2026-11-15'}]};
 const b={history:[{date:'2026-11-15'}]};
 assert.equal(dailyStreak([a,b],'2026-11-16'),3);
 assert.equal(dailyStreak([a,b],'2026-11-18'),0);
});
test('completion is independent only; recognizing is not mastery',()=>{
 const sections=[{skills:[{id:'a'},{id:'b'},{id:'c'}]}];
 assert.deepEqual(completionStats(sections,{a:{level:1},b:{level:3},c:{level:4}}),{total:3,mastered:2,practiced:3,percent:67});
});
test('invalid review labels cannot silently corrupt history',()=>{
 assert.throws(()=>gradeStudy({},'solved','2026-11-16'),/grade/i);
 assert.equal(REVIEW_GAPS.length,6);
});

test('reclicking a grade on the same day does not skip repetition intervals',()=>{
 let r=gradeStudy({},'green','2026-11-16');
 r=gradeStudy(r,'green','2026-11-16');
 assert.equal(r.dueDate,'2026-11-17');
 assert.equal(r.history.length,1);
 r=gradeStudy(r,'yellow','2026-11-16');
 assert.equal(r.history.length,1);
 assert.equal(r.dueDate,'2026-11-19');
});
