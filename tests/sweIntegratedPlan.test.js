import test from 'node:test';
import assert from 'node:assert/strict';
import {addStudyDays} from '../src/sweStudyLogic.js';
import {PLAN_START,WEEKLY_SPRINTS,MONTH_FOCUS,OFFICIAL_SWE_II,sprintForDate,weekIndexFor,sprintDates,getDailyTasks,planProgress} from '../src/sweIntegratedPlan.js';

test('career plan covers 44 contiguous Monday-to-Sunday sprints from November 2026',()=>{
 assert.equal(PLAN_START,'2026-11-16');
 assert.equal(WEEKLY_SPRINTS.length,44);
 for(let i=0;i<WEEKLY_SPRINTS.length;i++){
  const sprint=WEEKLY_SPRINTS[i];
  assert.equal(sprint.index,i+1);
  assert.equal(sprint.monday,addStudyDays(PLAN_START,7*i));
  assert.equal(sprint.ends,addStudyDays(sprint.monday,6));
  assert.ok(sprint.dsa&&sprint.engineering&&sprint.project&&sprint.career);
  assert.ok(sprint.problemIds.length===3);
  assert.equal(sprint.revisionWeek,(i+1)%4===0);
  assert.equal(sprint.biweekly,(i+1)%2===0);
 }
 assert.equal(weekIndexFor('2026-11-16'),0);
 assert.equal(sprintForDate('2026-11-29').index,2);
});
test('day-by-day plan changes with weekday and has review+engineering+projects',()=>{
 const monday=getDailyTasks('2026-11-16');
 const tuesday=getDailyTasks('2026-11-17');
 const wednesday=getDailyTasks('2026-11-18');
 const saturday=getDailyTasks('2026-11-21');
 const sunday=getDailyTasks('2026-11-22');
 assert.ok(monday.some(t=>t.category==='dsa'));
 assert.ok(tuesday.some(t=>t.category==='leetcode'));
 assert.ok(wednesday.some(t=>t.category==='engineering'&&t.sectionPage===31));
 assert.ok(saturday.some(t=>t.category==='project'));
 assert.ok(sunday.some(t=>t.category==='career'&&t.type==='career'));
 assert.ok([monday,tuesday,wednesday,saturday,sunday].every(arr=>arr.some(t=>t.category==='review')));
});
test('OOP and SQL alternate in the first two weeks',()=>{
 assert.match(sprintForDate('2026-11-18').engineering,/oop/i);
 assert.match(sprintForDate('2026-11-25').engineering,/sql/i);
 assert.match(getDailyTasks('2026-11-25')[1].detail,/sql/i);
});
test('fortnightly review and every fourth week shift to consolidation',()=>{
 const week2Sunday=getDailyTasks('2026-11-29');
 assert.ok(week2Sunday.some(t=>/14-day retrieval/i.test(t.detail)));
 const week4Sunday=getDailyTasks('2026-12-13');
 assert.ok(week4Sunday.some(t=>/14-day retrieval/i.test(t.detail)));
 assert.match(sprintForDate('2026-12-07').dsa,/retrieval/i);
});
test('review queue is injected into the daily agenda instead of being forgotten',()=>{
 const p={id:27,title:'Remove Element'},skill={id:'s13-1',text:'Java primitive types'};
 const tasks=getDailyTasks('2026-11-16',{dueProblems:[p],dueSkills:[skill]});
 assert.match(tasks[0].detail,/#27 Remove Element/);
 assert.match(tasks[0].detail,/Java primitive types/);
 assert.equal(tasks[0].problemId,27);
 assert.equal(tasks[0].skillId,'s13-1');
});
test('light days remain substantive and checkbox IDs stay stable',()=>{
 const normal=getDailyTasks('2026-11-18');
 const light=getDailyTasks('2026-11-18',{light:true});
 assert.ok(light.length<normal.length);
 assert.ok(light.some(t=>t.category==='review'));
 assert.ok(light.reduce((a,t)=>a+t.minutes,0)<=35);
 assert.equal(light[0].id,normal[0].id);
});
test('weekly completion counts do not treat optional tasks as essential',()=>{
 const wk=WEEKLY_SPRINTS[0],today=sprintDates(wk)[0],tasks=getDailyTasks(today);
 const done={[tasks[0].id]:true,[tasks[1].id]:true};
 const stats=planProgress(done,wk);
 assert.equal(stats.completed,2);
 assert.ok(stats.total>10);
 assert.equal(stats.pct,Math.round(200/stats.total));
});
test('role source date is a research snapshot and not a promised 2027 recruiting season',()=>{
 assert.equal(OFFICIAL_SWE_II.asOf,'2026-11-16');
 assert.equal(OFFICIAL_SWE_II.closesAtLeast,'2026-11-27');
 assert.ok(MONTH_FOCUS.some(x=>x.key==='2027-05'));
 assert.ok(MONTH_FOCUS.some(x=>x.key==='2027-09'));
});
