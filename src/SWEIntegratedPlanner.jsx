import React,{useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,CalendarDays,Check,CheckCircle2,ChevronRight,Clock3,Code2,Compass,ExternalLink,Flower2,GitBranch,GraduationCap,Layers3,Lightbulb,ListTodo,NotebookPen,Plus,RefreshCcw,Search,Settings2,Target,Trash2,Workflow} from 'lucide-react';
import handbook from './sweHandbookData.json';
import {addStudyDays,daysUntil,reviewDue} from './sweStudyLogic.js';
import {APPLICATION_RULES,DAY_NAMES,DAY_ROLE,MONTH_FOCUS,OFFICIAL_SWE_II,PLAN_START,WEEKLY_SPRINTS,getDailyTasks,monthForDate,planProgress,sprintDates,sprintForDate,weekIndexFor} from './sweIntegratedPlan.js';
import {NOVEMBER_DAILY} from './sweAcceleratedNovember.js';
import {DailyMicroConcepts} from './SWEMicroLab.jsx';
import SWEEngineeringDaily from './SWEEngineeringDaily.jsx';
import {MICRO_FAMILIES,microLessonForDate,microDueLessons} from './sweMicroConcepts.js';
import './swe-integrated-plan.css';

const start='2026-11-16';
// Study dates remain open-ended; the 2027 roadmap is only the first chapter.
const readable=date=>new Date(date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const short=date=>new Date(date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'});
const weekdays=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const isInRange=date=>typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&date>=start;
const relative=(date,today)=>{const n=daysUntil(date,today);return n===0?'today':n===1?'tomorrow':n<0?Math.abs(n)+' days ago':n+' days away'};
const DOMAIN_STYLES={review:'review',dsa:'dsa',leetcode:'leetcode',engineering:'tech',java:'java',career:'career',project:'project',optional:'optional'};
function Progress({done,total}){const n=total?Math.round(done/total*100):0;return <div className="sip-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total||1} aria-valuenow={done} aria-label={done+' of '+total+' tasks finished'}><span style={{width:n+'%'}}/></div>}
function Flag({children,tone='pink'}){return <span className={'sip-flag '+tone}>{children}</span>}
function monthWeeks(key){const first=key+'-01';if(!/^\d{4}-\d{2}$/.test(key))return [];const initial=sprintForDate(first).monday;return Array.from({length:7},(_,i)=>sprintForDate(addStudyDays(initial,i*7))).filter(w=>w.monday.slice(0,7)===key||w.ends.slice(0,7)===key)}
function Hero({onGoDaily,view}){return <div className="sip-banner"><span className="sip-eyebrow">✦ THE BIG PICTURE + LITTLE STEPS</span><div className="sip-hero-row"><div><h3>your career, <em>built week by week.</em></h3><p>Not a LeetCode checklist. Every DSA, OOP, backend, database and Angular skill gets its own micro-lesson and recurring recall, while LeetCode adapts to how hard each attempt felt.</p></div><div className="sip-sticker" aria-hidden="true">✿<span>REPEAT<br/>BUILD<br/>APPLY</span></div></div><div className="sip-banner-actions">{view!=='daily'&&<button onClick={onGoDaily}>Back to today’s plan <ArrowRight size={14}/></button>}<span>14 DSA families · ongoing micro-recall · LeetCode, engineering and career prep without an end date</span></div></div>}
export default function SWEIntegratedPlanner({mode='daily',db,update,allProblems,onOpenProblem,onOpenSection,onGoToDaily,initialDay,today}){
 const initial=isInRange(today)?today:start;
 const [selectedDay,setSelectedDay]=useState(isInRange(initialDay)?initialDay:initial);
 const [selectedMonth,setSelectedMonth]=useState(initial.slice(0,7));
 const [showApplicationForm,setShowApplicationForm]=useState(false);
 const [newRole,setNewRole]=useState({company:'Google',title:'',url:'',location:'New York, NY',status:'Watching',deadline:'',appliedAt:'',nextAction:'',notes:''});
 const [editingFocus,setEditingFocus]=useState(false);
 const [notice,setNotice]=useState('');
 const chosen=sprintForDate(selectedDay),weekDates=sprintDates(chosen);
 const checks=db.planChecks||{},lightDays=db.lightDays||{},overrides=db.sprintOverrides||{};
 const userWeek={...chosen,...(overrides[chosen.id]||{})};
 const isLight=!!lightDays[selectedDay];
 const dateDueProblems=allProblems.filter(p=>reviewDue(db.problems?.[p.id],selectedDay)).sort((a,b)=>(db.problems[a.id]?.dueDate||'').localeCompare(db.problems[b.id]?.dueDate||''));
 const sectionSkills=useMemo(()=>handbook.sections.flatMap(s=>s.skills.map(x=>({...x,section:s.title,sectionId:s.id,page:s.page}))),[]);
 const dateDueSkills=sectionSkills.filter(sk=>reviewDue(db.skills?.[sk.id],selectedDay)).sort((a,b)=>(db.skills[a.id]?.dueDate||'').localeCompare(db.skills[b.id]?.dueDate||''));
 const dayTasks=getDailyTasks(selectedDay,{light:isLight,dueProblems:dateDueProblems,dueSkills:dateDueSkills,sprintOverride:overrides[chosen.id]});
 const todayMicro=microLessonForDate(selectedDay);
 const microBacklog=microDueLessons(db,selectedDay);
 const dailyMicroReview=microBacklog.find(c=>c.id!==todayMicro?.id)||null;
 const dayDone=dayTasks.filter(t=>checks[t.id]&&!t.optional).length;
 const dayTotal=dayTasks.filter(t=>!t.optional).length;
 const weekStats=planProgress(checks,chosen,lightDays);
 const dayMinutes=dayTasks.filter(t=>!t.optional).reduce((sum,t)=>sum+t.minutes,0);
 const allMonthlyWeeks=monthWeeks(selectedMonth);
 const monthMeta=monthForDate(selectedMonth+'-01');
 const monthStats=allMonthlyWeeks.map(w=>planProgress(checks,w,lightDays));
 const monthDone=monthStats.reduce((sum,s)=>sum+s.completed,0),monthTotal=monthStats.reduce((sum,s)=>sum+s.total,0);
 const index=chosen.index;
 const questions=[...new Map(weekDates.flatMap(date=>getDailyTasks(date,{sprintOverride:overrides[chosen.id]}).filter(t=>t.problemId).map(t=>{const problem=allProblems.find(p=>p.id===t.problemId);return problem?[problem.id,{...problem,plannedDate:date}]:null})).filter(Boolean)).values()].slice(0,12);
 const applications=db.applications||[];
 const since30=addStudyDays(today,-29);
 const recentApps=applications.filter(a=>/google/i.test(a.company)&&a.appliedAt&&a.appliedAt>=since30&&a.appliedAt<=today);
 const milestoneChecks=db.monthMilestones||{};
 const checkedMonth=['proof','code','engineer','project','career'].filter(id=>milestoneChecks[selectedMonth+':'+id]).length;
 const updateObj=(key,patch)=>update(old=>({[key]:{...(old[key]||{}),...patch}}));
 const setCheck=(id,done)=>updateObj('planChecks',{[id]:done});
 const moveDay=number=>setSelectedDay(day=>{const proposed=addStudyDays(day,number);return isInRange(proposed)?proposed:day});
 const jumpWeek=number=>setSelectedDay(day=>{const target=addStudyDays(day,number*7);return isInRange(target)?target:day});
 const setFocus=(field,value)=>updateObj('sprintOverrides',{[chosen.id]:{...(overrides[chosen.id]||{}),[field]:value}});
 const resetFocus=()=>update(old=>({sprintOverrides:Object.fromEntries(Object.entries(old.sprintOverrides||{}).filter(([k])=>k!==chosen.id))}));
 const addRole=()=>{
   if(!newRole.title.trim()||!newRole.company.trim()){setNotice('Enter a company and job title first.');return}
   if(newRole.url.trim()&&!/^https?:\/\//i.test(newRole.url.trim())){setNotice('Please enter an HTTPS or HTTP job URL, not another URL scheme.');return}
   update({applications:[...applications,{...newRole,id:'role-'+Date.now(),title:newRole.title.trim().slice(0,150),company:newRole.company.trim().slice(0,110),url:newRole.url.trim(),notes:newRole.notes.slice(0,1000)}]});
   setNewRole({company:'Google',title:'',url:'',location:'New York, NY',status:'Watching',deadline:'',appliedAt:'',nextAction:'',notes:''});
   setShowApplicationForm(false);setNotice('Opportunity saved locally. Check the official job page for current availability.');
 };
 function toggleMonthly(key){updateObj('monthMilestones',{[selectedMonth+':'+key]:!milestoneChecks[selectedMonth+':'+key]})}
 function setRole(id,patch){update({applications:applications.map(a=>a.id===id?{...a,...patch}:a)})}
 function currentMonthTasks(){
   return [
    ['code','DSA / LeetCode',monthMeta.dsa],
    ['engineer','Java + engineering',monthMeta.java+' · '+monthMeta.eng],
    ['project','Portfolio deliverable',monthMeta.project],
    ['career','Career action',monthMeta.career],
    ['proof','Independent proof',monthMeta.proof]
   ];
 }
 const stats=(sprint)=>{const count=planProgress(checks,sprint,lightDays);return count};
 const showSkill=(sectionPage)=>{const sec=handbook.sections.find(s=>s.page===sectionPage)||handbook.sections.find(s=>s.page===63);onOpenSection(sec?.id)};
 const jobCard=<div className="sip-job-card"><div className="sip-job-top"><Flag tone="sky">Verified November 16, 2026</Flag><span>Official Google listing · not auto-refreshed</span></div><h4>{OFFICIAL_SWE_II.title}</h4><p>{OFFICIAL_SWE_II.locations}. Listed to remain open until at least <strong>Nov 27, 2026</strong>, subject to business needs. Check its live status before applying; there is no guarantee it stays open.</p><div className="sip-inline-actions"><a href={OFFICIAL_SWE_II.url} target="_blank" rel="noopener noreferrer">Review the official job <ExternalLink size={14}/></a><button onClick={()=>{setNewRole({...newRole,company:'Google',title:OFFICIAL_SWE_II.title,url:OFFICIAL_SWE_II.url,location:'New York, NY',deadline:'',status:'Watching'});setShowApplicationForm(true);setNotice('Draft populated. Verify the posting live before you save or submit anything.')}}>Add to my applications <Plus size={14}/></button></div></div>;
 return <section className="sip">
  <Hero view={mode} onGoDaily={()=>onGoToDaily?.(isInRange(today)?today:start)}/>
  {notice&&<div className="sip-notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss">×</button></div>}
  {mode==='daily'?<div className="sip-column">
   <div className="sip-summary-grid">
    <article className="sip-summary"><CalendarDays size={19}/><span>Today’s agenda</span><strong>{dayDone}/{dayTotal}</strong><small>{dayMinutes} planned focused minutes</small></article>
    <article className="sip-summary"><CheckCircle2 size={19}/><span>Week {chosen.index} · daily tasks</span><strong>{weekStats.pct}%</strong><small>{weekStats.completed}/{weekStats.total} essential blocks</small></article>
    <article className="sip-summary"><RefreshCcw size={19}/><span>Single-concept recall</span><strong>{dailyMicroReview?'1':'0'}</strong><small>{microBacklog.length} micro-concepts queued · only one assigned</small></article>
    <article className="sip-summary"><Target size={19}/><span>Next role milestone</span><strong>May ’27</strong><small>Readiness evidence review, not a hiring deadline</small></article>
   </div>
   <DailyMicroConcepts date={selectedDay} today={today} db={db} update={update} light={isLight} onOpenProblem={onOpenProblem} onOpenSection={showSkill}/>
   <SWEEngineeringDaily date={selectedDay} today={today} db={db} update={update} onOpenProblem={onOpenProblem} onOpenSection={showSkill}/>
   <div className="sip-split">
    <div className="sip-panel sip-main-day">
     <div className="sip-panel-top"><div><span className="sip-eyebrow">✦ YOUR DAY-TO-DAY PLAN</span><h3>{readable(selectedDay)}</h3><p>{todayMicro?.title||NOVEMBER_DAILY[selectedDay]?.title||DAY_ROLE[Math.round((Date.parse(selectedDay+'T12:00:00Z')-Date.parse(chosen.monday+'T12:00:00Z'))/86400000)]?.[0]||'Weekly focus'} · {dayMinutes} essential minutes</p></div><div className="sip-date-nav"><button aria-label="Previous day" onClick={()=>moveDay(-1)} disabled={selectedDay<=start}><ArrowLeft size={16}/></button><input aria-label="Choose a study date" type="date" min={start} value={selectedDay} onChange={e=>{if(isInRange(e.target.value))setSelectedDay(e.target.value)}}/><button aria-label="Next day" onClick={()=>moveDay(1)} ><ArrowRight size={16}/></button></div></div>
     <div className="sip-day-progress"><Progress done={dayDone} total={dayTotal}/><span>{dayDone}/{dayTotal} completed</span></div>
     <div className="sip-light-row"><div><strong>Office-heavy day?</strong><small>Switch to a short concept + code checkpoint. Every family gets atomic lessons and ongoing recall.</small></div><button className={isLight?'active':''} onClick={()=>updateObj('lightDays',{[selectedDay]:!isLight})}>{isLight?'Light mode ON':'Use light mode'}</button></div>
     <div className="sip-task-list">{dayTasks.map(t=><div key={t.id} className={'sip-task '+(checks[t.id]?'is-done':'')}>
      <label><input type="checkbox" checked={!!checks[t.id]} onChange={e=>setCheck(t.id,e.target.checked)}/><span className={'sip-task-icon '+(DOMAIN_STYLES[t.category]||'')}>{t.category==='review'?<RefreshCcw size={16}/>:t.category==='leetcode'?<Code2 size={16}/>:t.category==='project'?<GitBranch size={16}/>:t.category==='career'?<Target size={16}/>:t.category==='engineering'?<Layers3 size={16}/>:<BookOpen size={16}/>}</span><span className="sip-task-detail"><strong>{t.label}{t.optional?' · optional':''}</strong><small>{t.detail}</small><span className="sip-task-meta"><Clock3 size={12}/> {t.minutes} min · {t.category}</span></span></label>
      {(t.problemId||t.sectionPage||t.skillId)&&<div className="sip-task-helpers">{t.problemId&&<button onClick={()=>onOpenProblem(t.problemId)}>Open problem #{t.problemId} <ChevronRight size={13}/></button>}{t.sectionPage&&<button onClick={()=>showSkill(t.sectionPage)}>Open tech lesson <ChevronRight size={13}/></button>}{t.skillId&&<button onClick={()=>{const s=handbook.sections.find(x=>x.skills.some(z=>z.id===t.skillId));onOpenSection(s?.id)}}>Review micro-skill <ChevronRight size={13}/></button>}</div>}
     </div>)}</div>
     <p className="sip-honesty">Checking a plan task means you did the activity. It does <strong>not</strong> automatically mark a LeetCode problem or micro-skill GREEN. Log your real independent performance in the appropriate tracker.</p>
    </div>
    <aside className="sip-side-stack">
      <div className="sip-panel"><span className="sip-eyebrow">YOUR CURRENT ROTATION</span><div className="sip-panel-top"><h3>Week {chosen.index}: {short(chosen.monday)}–{short(chosen.ends)}</h3><div className="sip-date-nav"><button onClick={()=>jumpWeek(-1)} disabled={chosen.index===1} aria-label="Previous study week"><ArrowLeft size={15}/></button><button onClick={()=>jumpWeek(1)}  aria-label="Next study week"><ArrowRight size={15}/></button></div></div>
       {selectedDay.startsWith('2026-11')?<Flag tone="sage">NOVEMBER · ONE ATOMIC CONCEPT EACH DAY</Flag>:<>{chosen.revisionWeek&&<Flag tone="sage">RETRIEVAL-HEAVY WEEK · RED/YELLOW REPAIRS FIRST</Flag>}{chosen.biweekly&&<Flag tone="pink">14-DAY LEETCODE REATTEMPT WEEK</Flag>}</>}
       <div className="sip-rotation"><div><span>01 · DSA + JAVA</span><strong>{overrides[chosen.id]?.dsa||'One new concept each day · '+weekDates.map(d=>microLessonForDate(d)?.title||'Self-paced review').join(' / ')}</strong></div><div><span>02 · TECH / ENGINEERING</span><strong>{userWeek.engineering}</strong><small>{userWeek.engineeringExercise}</small></div><div><span>03 · PERSONAL PROJECT</span><strong>{userWeek.project}</strong></div><div><span>04 · RECRUITING</span><strong>{userWeek.career}</strong></div></div>
       <button className="sip-underlink" onClick={()=>setEditingFocus(v=>!v)}><Settings2 size={14}/> {editingFocus?'Close this week’s customization':'Customize this week’s rotation'}</button>
       {editingFocus&&<div className="sip-editor">{[['dsa','DSA focus'],['engineering','Weekly tech skill'],['engineeringExercise','Engineering drill'],['project','Project deliverable'],['career','Career action']].map(([key,label])=><label key={key}>{label}<textarea rows={2} value={userWeek[key]||''} onChange={e=>setFocus(key,e.target.value)}/></label>)}<button onClick={resetFocus}>Restore handbook suggestions</button></div>}
      </div>
      <div className="sip-panel"><span className="sip-eyebrow">REVISIT, DON'T RESTART</span><h3>Optional LeetCode reviews</h3><p className="sip-muted">Your one scheduled concept recall is above. These LeetCode reattempts are a separate optional queue, not additional mandatory concept prompts.</p>
       {dateDueProblems.slice(0,3).map(p=><button key={p.id} className="sip-review-link" onClick={()=>onOpenProblem(p.id)}><RefreshCcw size={15}/><span><strong>#{p.id} {p.title}</strong><small>Due {db.problems[p.id]?.dueDate}</small></span><ChevronRight size={15}/></button>)}
       {!dateDueProblems.length&&<p className="sip-empty-inline">No LeetCode problems due. Micro-concept recalls are assigned one at a time above after you grade a lesson.</p>}
      </div>
    </aside>
   </div>
   <div className="sip-panel"><div className="sip-panel-top"><div><span className="sip-eyebrow">MONDAY TO SUNDAY</span><h3>See your whole week at once</h3></div><span className="sip-muted">A balanced mix every week · weekly tech focus rotates</span></div><div className="sip-week-strip">{weekDates.map((date,i)=>{const d=getDailyTasks(date,{light:lightDays[date],sprintOverride:overrides[chosen.id]});const done=d.filter(t=>checks[t.id]&&!t.optional).length,total=d.filter(t=>!t.optional).length;return <button key={date} className={'sip-week-day '+(selectedDay===date?'is-selected':'')+(done===total?' is-complete':'')} onClick={()=>setSelectedDay(date)}><span>{weekdays[i]}</span><strong>{date.slice(-2)}</strong><small>{microLessonForDate(date)?.title||NOVEMBER_DAILY[date]?.title||DAY_ROLE[i][0]}</small><Progress done={done} total={total}/><i>{done}/{total}</i></button>})}</div>
   </div>
   <div className="sip-panel"><div className="sip-panel-top"><div><span className="sip-eyebrow">PRACTICE ASSIGNMENTS</span><h3>This week's LeetCode ladder</h3></div><span className="sip-muted">Your week’s Java DSA + SQL question assignments</span></div><div className="sip-problem-grid">{questions.map((p,i)=><div key={p.id} className="sip-problem-card"><div><Flag tone={i===0?'pink':'sky'}>{short(p.plannedDate)+' · '+(p.language==='SQL'?'SQL':'JAVA')}</Flag><span>#{p.id}</span></div><strong>{p.title}</strong><small>{p.pattern}</small><button onClick={()=>onOpenProblem(p.id)}>Practice / review <ChevronRight size={14}/></button></div>)}</div><p className="sip-muted">On fourth-week consolidations, these are re-solves—not a requirement to learn three new patterns. Every second Sunday also explicitly asks for a two-week LeetCode replay.</p></div>
  </div>:
  <div className="sip-column">
   <div className="sip-panel"><div className="sip-panel-top"><div><span className="sip-eyebrow">THE HAWK-EYE VIEW</span><h3>Nov 2026 → Google SWE offer · what matters each month</h3><p>DSA, Java, SQL/OOP/networking, your flagship project, and networking run <em>in parallel</em>. The emphasis changes each month; review never disappears.</p></div><Flag tone="sage">Monthly consolidation built in</Flag></div>
    <label className="sip-muted">Explore any future study month <input type="month" min="2026-11" value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}/></label><div className="sip-month-grid">{[...MONTH_FOCUS,...(MONTH_FOCUS.some(m=>m.key===selectedMonth)?[]:[monthMeta])].map(m=>{const w=monthWeeks(m.key),stats=w.map(x=>planProgress(checks,x,lightDays));const total=stats.reduce((n,x)=>n+x.total,0),done=stats.reduce((n,x)=>n+x.completed,0);return <button className={'sip-month-tile '+(selectedMonth===m.key?'selected':'')} key={m.key} onClick={()=>setSelectedMonth(m.key)}><small>{m.stage}</small><strong>{m.title}</strong><p>{m.dsa}</p><Progress done={done} total={total}/><span>{total?Math.round(done/total*100):0}% of planned activities</span></button>})}</div>
   </div>
   <div className="sip-split"><div className="sip-panel">
      <div className="sip-panel-top"><div><span className="sip-eyebrow">MONTHLY DEEP DIVE</span><h3>{monthMeta.title}</h3><p>{monthMeta.stage} · approximately {allMonthlyWeeks.length} weekly focus blocks touch this month</p></div><Flag tone="pink">{checkedMonth}/5 outcomes evidenced</Flag></div>
      {selectedMonth==='2026-11'&&<div className="sip-coverage"><strong>November goal · learn one micro-concept per day</strong><p>First week: Arrays + ArrayList basics and APIs, one daily lesson. The complete database continues through all other structures over the following months. RED/YELLOW/GREEN creates an independent future review for each concept.</p><div>{MICRO_FAMILIES.map(item=><span key={item}>{item}</span>)}</div></div>}
      <div className="sip-month-missions">{currentMonthTasks().map(([id,label,detail])=><label key={id} className={'sip-month-mission '+(milestoneChecks[selectedMonth+':'+id]?'done':'')}><input type="checkbox" checked={!!milestoneChecks[selectedMonth+':'+id]} onChange={()=>toggleMonthly(id)}/><span><strong>{label}</strong><small>{detail}</small></span></label>)}</div>
      <div className="sip-month-notes"><label>Monthly proof journal (how do you KNOW you've learned it?)<textarea rows={5} placeholder="Specific problems I solved independently, one deployed feature, an engineering explanation, interview feedback…" value={(db.monthNotes||{})[selectedMonth]||''} onChange={e=>updateObj('monthNotes',{[selectedMonth]:e.target.value.slice(0,2500)})}/></label></div>
     </div>
     <aside className="sip-panel"><span className="sip-eyebrow">THE ROTATION MAKES THE DIFFERENCE</span><h3>Where each week goes</h3><p className="sip-muted">Each sprint has a coding focus, ONE engineering/technology deep dive, one personal-project deliverable, and one recruiting action. Week 4, 8, 12… are revision-heavy.</p>
      <div className="sip-month-week-list">{allMonthlyWeeks.map(w=>{const p=stats(w);return <button key={w.id} onClick={()=>{setSelectedDay(w.monday);setSelectedMonth(w.monday.slice(0,7));onGoToDaily?.(w.monday)}}><span><strong>Week {w.index} · {short(w.monday)}–{short(w.ends)}</strong><small>{w.dsa} · {w.engineering}</small><small>{w.project}</small></span><span className="sip-mini-progress">{p.pct}%</span></button>})}</div>
      <div className="sip-fortnight-legend"><span>↻ One micro-concept recall per day: RED +3, YELLOW +7, GREEN +14/30/60+ days</span><span>↻ Every two weeks: blank-file LeetCode replay</span><span>↻ Every four weeks: reduce new study; consolidate old material</span><span>✿ Every week: build, test, reflect and watch roles</span></div>
     </aside></div>
   <div className="sip-panel">
    <div className="sip-panel-top"><div><span className="sip-eyebrow">CAREER APPLICATION RADAR</span><h3>Start looking now, apply when fit is real</h3><p>Early-career and experienced SWE II openings are not guaranteed to follow one annual launch. Campus, internships and industry SWE II have different eligibility and dates.</p></div><Flag tone="sky">Google Careers · official links</Flag></div>
    {jobCard}
    <div className="sip-app-warning"><Lightbulb size={19}/><div><strong>Application season ≠ one date.</strong><p>For your non-intern SWE II/L3 goal, begin role checks now. May 31, 2027 is a suggested readiness assessment; June is a ramp-up if mocks and fit support it, not an official Google opening. Some 2027 campus opportunities opened in 2026, and role-specific windows differ.</p></div></div>
    <div className="sip-rule-list">{APPLICATION_RULES.map((s,i)=><div key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{s}</p></div>)}</div>
    <div className="sip-app-controls"><div><strong>{recentApps.length} / 3</strong><small>Google applications recorded in the last 30 calendar days; up to three allowed</small></div><button className="sip-action" onClick={()=>setShowApplicationForm(v=>!v)}><Plus size={14}/> Track an opportunity</button><a href="https://www.google.com/about/careers/applications/jobs/results/?q=software%20engineer%20II&location=New%20York" target="_blank" rel="noopener noreferrer">Browse live NYC job listings <ExternalLink size={14}/></a></div>
    {showApplicationForm&&<div className="sip-app-form">
      <div className="sip-form-grid"><label>Company<input value={newRole.company} onChange={e=>setNewRole(s=>({...s,company:e.target.value}))}/></label><label>Role title<input value={newRole.title} onChange={e=>setNewRole(s=>({...s,title:e.target.value}))}/></label><label>Location<input value={newRole.location} onChange={e=>setNewRole(s=>({...s,location:e.target.value}))}/></label><label>Status<select value={newRole.status} onChange={e=>setNewRole(s=>({...s,status:e.target.value}))}>{['Watching','Preparing','Applied','Recruiter screen','Interviewing','Closed','Offer'].map(x=><option key={x}>{x}</option>)}</select></label><label>Job URL<input type="url" value={newRole.url} placeholder="Official application URL" onChange={e=>setNewRole(s=>({...s,url:e.target.value}))}/></label><label>Advertised date / deadline<input type="date" value={newRole.deadline} onChange={e=>setNewRole(s=>({...s,deadline:e.target.value}))}/></label><label>Applied date (if applicable)<input type="date" value={newRole.appliedAt} onChange={e=>setNewRole(s=>({...s,appliedAt:e.target.value}))}/></label><label>Next action / check date<input type="date" value={newRole.nextAction} onChange={e=>setNewRole(s=>({...s,nextAction:e.target.value}))}/></label></div><label>Role-fit evidence<textarea rows={2} value={newRole.notes} onChange={e=>setNewRole(s=>({...s,notes:e.target.value}))}/></label><button className="sip-action" onClick={addRole}>Save opportunity</button>
    </div>}
    {applications.length>0&&<div className="sip-app-table"><div className="sip-table-header"><span>ROLE / COMPANY</span><span>STATUS</span><span>DATE / NEXT ACTION</span><span></span></div>{applications.map(a=><div key={a.id} className="sip-app-row"><div><strong>{a.title}</strong><small>{a.company} · {a.location}</small>{a.url&&<a href={a.url} target="_blank" rel="noopener noreferrer">Official job page <ExternalLink size={12}/></a>}</div><select aria-label={'Status of '+a.title} value={a.status} onChange={e=>setRole(a.id,{status:e.target.value})}>{['Watching','Preparing','Applied','Recruiter screen','Interviewing','Closed','Offer'].map(x=><option key={x}>{x}</option>)}</select><div><label>Applied <input type="date" value={a.appliedAt||''} onChange={e=>setRole(a.id,{appliedAt:e.target.value})}/></label><label>Next check <input type="date" value={a.nextAction||''} onChange={e=>setRole(a.id,{nextAction:e.target.value})}/></label></div><button aria-label={'Remove '+a.title} onClick={()=>{if(window.confirm('Remove this opportunity from the tracker?'))update({applications:applications.filter(x=>x.id!==a.id)})}}><Trash2 size={15}/></button></div>)}</div>}
    <p className="sip-muted">Jobs and dates shown above are a November 16, 2026 research snapshot, NOT an automated feed of current open roles. Verify live listings before acting; your application tracker is saved locally.</p>
   </div>
   <div className="sip-panel"><span className="sip-eyebrow">AN EVIDENCE-BASED STUDY LOOP</span><h3>Why the plan deliberately repeats</h3><div className="sip-loop-grid"><div><RefreshCcw size={21}/><strong>Daily recall</strong><p>10–15 minutes at the start of sessions. RED resets sooner; YELLOW gets more practice.</p></div><div><Code2 size={21}/><strong>14-day blank-file redo</strong><p>Every other Sunday, re-solve older LeetCode problems without notes or copying.</p></div><div><Layers3 size={21}/><strong>Weekly tech rotation</strong><p>SQL one week, OOP next, then Spring/HTTP, testing, networking and systems.</p></div><div><GitBranch size={21}/><strong>One real weekly artifact</strong><p>Write a query, design an API, add tests, deploy code or improve the portfolio.</p></div><div><BookOpen size={21}/><strong>Four-week consolidation</strong><p>One new atomic concept each day; periodic sessions emphasize one due concept, never a large family dump.</p></div><div><GraduationCap size={21}/><strong>Application checkpoints</strong><p>Read requirements weekly, build relationships early, and act when both fit and evidence align.</p></div></div></div>
  </div>}
 </section>;
}
