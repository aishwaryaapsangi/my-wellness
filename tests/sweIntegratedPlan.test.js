import test from 'node:test';
import assert from 'node:assert/strict';
import {addStudyDays} from '../src/sweStudyLogic.js';
import {PLAN_START,WEEKLY_SPRINTS,MONTH_FOCUS,OFFICIAL_SWE_II,sprintForDate,weekIndexFor,sprintDates,getDailyTasks,planProgress} from '../src/sweIntegratedPlan.js';
import {NOVEMBER_DAILY,NOVEMBER_DSA_FAMILIES,acceleratedWeekProblemIds} from '../src/sweAcceleratedNovember.js';

test('career plan still covers 44 consecutive weeks with work, engineering and portfolio',()=>{
 assert.equal(PLAN_START,'2026-11-16');
 assert.equal(WEEKLY_SPRINTS.length,44);
 for(let i=0;i<WEEKLY_SPRINTS.length;i++){
  const sprint=WEEKLY_SPRINTS[i];
  assert.equal(sprint.index,i+1);
  assert.equal(sprint.monday,addStudyDays(PLAN_START,7*i));
  assert.equal(sprint.ends,addStudyDays(sprint.monday,6));
  assert.ok(sprint.dsa&&sprint.engineering&&sprint.project&&sprint.career);
  assert.equal(sprint.problemIds.length,3);
  assert.equal(sprint.revisionWeek,(i+1)%4===0);
 }
 assert.equal(weekIndexFor('2026-11-16'),0);
 assert.equal(sprintForDate('2026-11-29').index,2);
});
test('November covers 15 distinct daily topics and the full DSA structure map',()=>{
 assert.equal(Object.keys(NOVEMBER_DAILY).length,15);
 assert.equal(NOVEMBER_DSA_FAMILIES.length,11);
 const titles=Object.values(NOVEMBER_DAILY).map(d=>d.title).join('; ');
 for(const pattern of [/arrays/i,/hash/i,/string/i,/linked/i,/stack/i,/binary/i,/tree/i,/graph/i,/recursion/i,/greedy/i,/dynamic programming/i,/bit/i]){
  assert.match(titles,pattern);
 }
 assert.match(MONTH_FOCUS[0].dsa,/graphs/);
 assert.match(MONTH_FOCUS[0].proof,/not mastery/i);
});
test('Nov 16 refreshes Java foundations once; following days move quickly to hashing, windows, linked lists and trees',()=>{
 const a=getDailyTasks('2026-11-16'),b=getDailyTasks('2026-11-17'),c=getDailyTasks('2026-11-18');
 assert.match(a[0].detail,/ArrayList/);
 assert.match(b[0].label,/HashMap/);
 assert.match(c[0].label,/Strings/);
 assert.match(getDailyTasks('2026-11-19')[0].label,/Linked lists/);
 assert.match(getDailyTasks('2026-11-21')[0].label,/Trees/);
 assert.match(getDailyTasks('2026-11-25')[0].label,/Dynamic programming/);
});
test('November mixes DSA, SQL, OOP engineering and a concrete project task in one day',()=>{
 for(const day of ['2026-11-17','2026-11-18','2026-11-21','2026-11-25']){
  const tasks=getDailyTasks(day);
  assert.ok(tasks.some(t=>t.category==='dsa'),day);
  assert.ok(tasks.some(t=>t.category==='leetcode'&&t.problemId),day);
  assert.ok(tasks.some(t=>t.category==='engineering'&&t.sectionPage),day);
  assert.ok(tasks.some(t=>t.category==='project'),day);
  assert.ok(tasks.some(t=>t.type==='sql-practice'&&t.problemId),day);
 }
 assert.equal(getDailyTasks('2026-11-17').find(t=>t.type==='sql-practice').problemId,584);
 assert.equal(getDailyTasks('2026-11-18').find(t=>t.type==='sql-practice').problemId,175);
 assert.equal(getDailyTasks('2026-11-21').find(t=>t.type==='java-leetcode').problemId,104);
});
test('November is a first pass, not formal every-day spaced retrieval',()=>{
 const first=getDailyTasks('2026-11-17');
 assert.ok(!first.some(t=>t.label.startsWith('Spaced recall')));
 assert.ok(first.some(t=>t.type==='proof-log'));
 assert.ok(!getDailyTasks('2026-11-29').some(t=>/mandatory 14-day retrieval/i.test(t.detail)));
});
test('December implements spaced recall and still includes varied engineering + portfolio work',()=>{
 const dueProblems=[{id:27,title:'Remove Element'},{id:200,title:'Number of Islands'}];
 const dueSkills=[{id:'s1',text:'Understand Java references'}];
 const tasks=getDailyTasks('2026-12-01',{dueProblems,dueSkills});
 assert.equal(tasks[0].category,'review');
 assert.match(tasks[0].detail,/#27/);
 assert.match(tasks[0].detail,/Java references/);
 assert.ok(tasks.some(t=>t.category==='leetcode'));
 assert.ok(tasks.some(t=>t.category==='engineering'));
 assert.ok(tasks.some(t=>t.category==='project'));
 assert.ok(getDailyTasks('2026-12-14').some(t=>t.category==='review'));
 assert.match(MONTH_FOCUS[1].dsa,/ALL November/);
});
test('light mode remains a valid 30-minute backup with same task IDs',()=>{
 const full=getDailyTasks('2026-11-18');
 const light=getDailyTasks('2026-11-18',{light:true});
 assert.ok(light.length<full.length);
 assert.ok(light.some(t=>t.category==='dsa'));
 assert.ok(light.some(t=>t.category==='leetcode'));
 assert.ok(light.reduce((n,t)=>n+t.minutes,0)<=35);
 assert.equal(full[0].id,light[0].id);
 const decLight=getDailyTasks('2026-12-01',{light:true});
 assert.ok(decLight.some(t=>t.category==='review'));
 assert.ok(decLight.reduce((n,t)=>n+t.minutes,0)<=35);
});
test('November week ladder includes genuine Java and SQL problem references',()=>{
 const week=acceleratedWeekProblemIds(WEEKLY_SPRINTS[0]);
 assert.ok(week.includes(27));
 assert.ok(week.includes(175));
 assert.ok(week.includes(104));
 assert.ok(!week.includes(198));
 const second=acceleratedWeekProblemIds(WEEKLY_SPRINTS[1]);
 assert.ok(second.includes(198));
 assert.ok(second.includes(1193));
});
test('progress still uses only essential tasks and handles earlier dates safely',()=>{
 const sprint=WEEKLY_SPRINTS[0];
 const today=sprintDates(sprint)[0];
 const tasks=getDailyTasks(today);
 const data={[tasks[0].id]:true,[tasks[1].id]:true};
 const p=planProgress(data,sprint);
 assert.equal(p.completed,2);
 assert.ok(p.total>10);
 assert.equal(p.pct,Math.round(200/p.total));
});
test('Google role information remains a dated snapshot rather than a promised application season',()=>{
 assert.equal(OFFICIAL_SWE_II.asOf,'2026-11-16');
 assert.equal(OFFICIAL_SWE_II.closesAtLeast,'2026-11-27');
 assert.ok(MONTH_FOCUS.some(x=>x.key==='2027-05'));
 assert.ok(MONTH_FOCUS.some(x=>x.key==='2027-09'));
});
