import React,{useEffect,useMemo,useRef,useState} from 'react';
import {BookOpen,BrainCircuit,CalendarClock,Check,CheckCircle2,ChevronRight,CircleHelp,Clock3,Code2,Download,ExternalLink,Flame,Flower2,GraduationCap,Heart,Layers3,Lightbulb,NotebookPen,Pause,Play,Plus,RefreshCcw,RotateCcw,Search,Settings2,Sparkles,Target,Timer,Trash2,Trophy,Upload,Workflow,X} from 'lucide-react';
import {Bar,BarChart,CartesianGrid,Cell,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import handbook from './sweHandbookData.json';
import {EARLIER_PRACTICE,ROADMAP,WEEKLY_RHYTHM,PROJECT_PLAN,READINESS,LESSON_LOOP} from './sweRoadmap.js';
import {dateKey,addStudyDays,gradeStudy,reviewDue,reviewOverdue,daysUntil,dailyStreak,completionStats,GRADES} from './sweStudyLogic.js';
import './google-swe.css';
import FlowerBouquet from './ThemeDoodles.jsx';
import SWEIntegratedPlanner from './SWEIntegratedPlanner.jsx';
import SWELeetCodeDojo from './SWELeetCodeDojo.jsx';
import SWEMicroLab from './SWEMicroLab.jsx';
import {EXTRA_QUESTIONS} from './sweQuestionBank.js';

const STORAGE='bloom-google-swe-prep-v1';
const REVIEWS=['red','yellow','green','mock'];
const SKILL_LEVELS=[{value:0,label:'Unknown'},{value:1,label:'Recognize'},{value:2,label:'Apply'},{value:3,label:'Independent'},{value:4,label:'Mock ready'}];
const LEETCODE_PHASES=[['all','All paths'],['F1','01 · Java & arrays'],['F2','02 · Strings & hash'],['F3','03 · Sort & search'],['F4','04 · Trees & graphs'],['F5','05 · DP & greedy'],['PRIOR','Prior practice']];
const SECTIONS=handbook.sections;
const GROUPS=['Java fundamentals','Algorithms & data structures','Computer science','Full-stack technologies','System design','Engineering practice','Behavioral','Projects & portfolio','Career & networking'];
const ENGINEERING_GROUPS=GROUPS.filter(g=>g!=='Java fundamentals'&&g!=='Algorithms & data structures');
const INITIAL=()=>({
 version:1,problems:{},skills:{},microRecords:{},customProblems:[],roadmapDone:{},projectDone:{},readinessDone:{},
 sessions:[],stories:[],targetDate:'2027-05-31',weeklyGoalMinutes:420,focusNote:'',studyNotes:'',preferredLanguage:'Java'
});
function load(){
 try{const saved=JSON.parse(localStorage.getItem(STORAGE));if(saved?.version===1)return {...INITIAL(),...saved}}catch{}
 return INITIAL();
}
function Pill({children,tone=''}){return <span className={'swe-pill '+tone}>{children}</span>}
function BarLine({value,max=100}){const fraction=max?Math.max(0,Math.min(100,value/max*100)):0;return <span className="swe-bar-track"><span style={{width:fraction+'%'}}/></span>}
function Stat({icon:Icon,eyebrow,value,detail}){return <article className="swe-stat"><Icon size={20}/><span>{eyebrow}</span><strong>{value}</strong><small>{detail}</small></article>}
function Empty({title,sub}){return <div className="swe-empty"><Flower2 size={29}/><strong>{title}</strong><p>{sub}</p></div>}
function sectionCompletion(section,store){const done=section.skills.filter(sk=>(store.skills[sk.id]?.level||0)>=3).length;return {done,total:section.skills.length,pct:Math.round(done/section.skills.length*100)}}
function lcUrl(p){return 'https://leetcode.com/problems/'+p.title.toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'/'}
function currentDateTime(){return new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
function safeName(x){return String(x||'').trim().slice(0,180)}
function gradeText(grade){return GRADES[grade]||'Not reviewed'}
function ProblemRow({problem,record,active,onSelect,daysToday}){
 const due=reviewDue(record,daysToday),tone=record?.grade||'new';
 return <button type="button" className={'swe-problem-row '+(active?'swe-selected':'')} onClick={onSelect}>
  <span className="swe-lc-number">#{problem.id}</span><span className="swe-problem-main"><strong>{problem.title}</strong><small>{problem.pattern}{problem.prior?' · previously attempted':' · handbook p.'+problem.page}</small></span>
  <span className={'swe-status '+tone}>{due?'DUE':tone==='new'?'NEW':tone.toUpperCase()}</span><ChevronRight size={16}/></button>
}
export default function GoogleSWE(){
 const [db,setDb]=useState(load),[tab,setTab]=useState('plan'),[search,setSearch]=useState(''),[phase,setPhase]=useState('all'),
 [problemFilter,setProblemFilter]=useState('all'),[selectedProblemId,setSelectedProblemId]=useState(null),
 [skillGroup,setSkillGroup]=useState('Java fundamentals'),[sectionId,setSectionId]=useState('section-17'),
 [skillSearch,setSkillSearch]=useState(''),[notice,setNotice]=useState(''),[showImport,setShowImport]=useState(false),
 [timerOn,setTimerOn]=useState(false),[seconds,setSeconds]=useState(0),[sessionTopic,setSessionTopic]=useState(''),
 [sessionKind,setSessionKind]=useState('Coding mock'),[sessionScore,setSessionScore]=useState(3),[sessionNotes,setSessionNotes]=useState(''),
 [newTitle,setNewTitle]=useState(''),[newNumber,setNewNumber]=useState(''),[newPattern,setNewPattern]=useState(''),
 [noteDraft,setNoteDraft]=useState(''),[savedNoteId,setSavedNoteId]=useState(''),[showSettings,setShowSettings]=useState(false);
 const fileRef=useRef(null),today=dateKey();
 const [planDay,setPlanDay]=useState(today);
 useEffect(()=>{try{localStorage.setItem(STORAGE,JSON.stringify(db))}catch{setNotice('Browser storage could not be saved; export your work as a backup.')}},[db]);
 useEffect(()=>{if(!timerOn)return;const id=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(id)},[timerOn]);
 const update=(patch)=>setDb(old=>({...old,...(typeof patch==='function'?patch(old):patch)}));
 const allProblems=useMemo(()=>{
   const map=new Map(handbook.problems.map(p=>[String(p.id),{...p,prior:false,suggestedReview:!!p.review}]));
   for(const p of EXTRA_QUESTIONS){if(!map.has(String(p.id)))map.set(String(p.id),{...p,prior:false})}
   for(const p of EARLIER_PRACTICE){if(!map.has(String(p.id)))map.set(String(p.id),{...p,page:0,phase:'PRIOR',prior:true});
    else map.set(String(p.id),{...map.get(String(p.id)),prior:true})}
   for(const p of db.customProblems||[])map.set(String(p.id),{...p,phase:p.phase||'PRIOR',page:0,prior:false});
   return [...map.values()];
 },[db.customProblems]);
 const pRecords=Object.values(db.problems),sRecords=Object.values(db.skills);
 const dueProblems=allProblems.filter(p=>reviewDue(db.problems[p.id],today)).sort((a,b)=>reviewOverdue(db.problems[b.id],today)-reviewOverdue(db.problems[a.id],today));
 const dueSkills=SECTIONS.flatMap(s=>s.skills.map(sk=>({...sk,section:s.title,page:s.page,sectionId:s.id}))).filter(sk=>reviewDue(db.skills[sk.id],today));
 const dueCount=dueProblems.length+dueSkills.length;
 const skillStats=completionStats(SECTIONS,db.skills);
 const independentCount=allProblems.filter(p=>['green','mock'].includes(db.problems[p.id]?.grade)).length;
 const practicedCount=allProblems.filter(p=>db.problems[p.id]?.history?.length).length;
 const attemptCount=pRecords.reduce((n,r)=>n+(r?.history?.length||0),0);
 const streak=dailyStreak([...pRecords,...sRecords],today);
 const todaySessionMinutes=db.sessions.filter(s=>s.date===today).reduce((a,b)=>a+b.minutes,0);
 const startOfWeek=addStudyDays(today,-((new Date(today+'T12:00:00').getDay()+6)%7));
 const weekSessions=db.sessions.filter(s=>s.date>=startOfWeek).reduce((sum,s)=>sum+Number(s.minutes||0),0);
 const currentlySelected=allProblems.find(p=>String(p.id)===String(selectedProblemId))||dueProblems[0]||allProblems[0];
 const selectedRecord=currentlySelected?db.problems[currentlySelected.id]||{}:{};
 const chosenSection=SECTIONS.find(s=>s.id===sectionId)||SECTIONS[0];
 const displaySections=SECTIONS.filter(s=>s.group===skillGroup);
 const filteredProblems=allProblems.filter(p=>{
   const q=search.toLowerCase();
   const inPhase=phase==='all'||p.phase===phase||(phase==='PRIOR'&&p.prior);
   const grade=db.problems[p.id]?.grade||'new';
   const ok=problemFilter==='all'||(problemFilter==='due'?reviewDue(db.problems[p.id],today):problemFilter==='prior'?p.prior:problemFilter===grade);
   return inPhase&&ok&&(!q||String(p.id).includes(q)||p.title.toLowerCase().includes(q)||p.pattern.toLowerCase().includes(q));
 });
 const charts=GROUPS.map(g=>{const relevant=SECTIONS.filter(s=>s.group===g);const total=relevant.reduce((n,s)=>n+s.skills.length,0);const mastered=relevant.reduce((n,s)=>n+s.skills.filter(sk=>(db.skills[sk.id]?.level||0)>=3).length,0);return {group:g==='Algorithms & data structures'?'DSA':g.replace(' fundamentals','').replace(' technologies',''),mastered,total}});
 function recordProblem(problem,grade){
  setSelectedProblemId(problem.id);
  update(old=>({problems:{...old.problems,[problem.id]:gradeStudy(old.problems[problem.id]||{},grade,today)}}));
  setNotice(grade.toUpperCase()+' saved · next recall automatically scheduled. Accepted code with help is YELLOW, not GREEN.');
 }
 function setSkillLevel(sk,level){
  update(old=>{
   const oldSkill=old.skills[sk.id]||{};
   const grade=level===0?'red':level===1?'yellow':level===2?'yellow':level===3?'green':'mock';
   const next=gradeStudy(oldSkill,grade,today);
   return {skills:{...old.skills,[sk.id]:{...next,level}}};
  });
 }
 function addCustom(){
   const number=Number(newNumber),title=safeName(newTitle),pattern=safeName(newPattern)||'Personal practice';
   if(!Number.isInteger(number)||number<1||!title){setNotice('Enter a valid LeetCode problem number and title.');return}
   if(allProblems.some(p=>p.id===number)){setNotice('That problem is already in your list. Search for #'+number+'.');return}
   update({customProblems:[...db.customProblems,{id:number,title,pattern,phase:'PRIOR'}]});
   setSelectedProblemId(number);setNewTitle('');setNewNumber('');setNewPattern('');setNotice('New problem added to your study library.');
 }
 function submitSession(){
   if(!sessionTopic.trim()){setNotice('Write the problem or skill you practiced before saving the session.');return}
   const minutes=Math.max(1,Math.round(seconds/60)||25);
   update({sessions:[...db.sessions,{id:'session-'+Date.now(),date:today,minutes,topic:safeName(sessionTopic),kind:sessionKind,score:Number(sessionScore),notes:sessionNotes.slice(0,1500)}]});
   setTimerOn(false);setSeconds(0);setSessionTopic('');setSessionNotes('');setNotice('Study session saved. Consistency matters more than perfect streaks.');
 }
 const exportFile=()=>{
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='my-swe-study-private-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),4000);
 };
 async function importFile(file){
   try{
    const val=JSON.parse(await file.text());
    if(val.version!==1||typeof val.problems!=='object'||typeof val.skills!=='object'||!Array.isArray(val.sessions))throw Error('Unrecognized study backup.');
    if(!window.confirm('Replace this browser’s SWE progress with the imported file?'))return;
    setDb({...INITIAL(),...val});setNotice('Your backup has been restored.');
   }catch(e){setNotice('Import failed: '+e.message)}
 }
 const reviewSuggestion=dueProblems[0]||allProblems.find(p=>p.prior&&!db.problems[p.id])||allProblems.find(p=>!db.problems[p.id])||allProblems[0];
 const setProblemNote=()=>{if(!currentlySelected)return;update(old=>({problems:{...old.problems,[currentlySelected.id]:{...(old.problems[currentlySelected.id]||{}),notes:noteDraft.slice(0,2000)}}}));setSavedNoteId(String(currentlySelected.id));setNotice('Your reflection has been saved locally.')};
 const activeSectionProgress=sectionCompletion(chosenSection,db);
 const daysToTarget=daysUntil(db.targetDate,today);
 const totalProjects=PROJECT_PLAN.reduce((n,p)=>n+p.deliverables.length,0),projectsDone=Object.values(db.projectDone).filter(Boolean).length;
 const totalRoadmap=ROADMAP.reduce((n,r)=>n+r.themes.length,0),roadmapDone=Object.values(db.roadmapDone).filter(Boolean).length;
 const tabList=[
  {key:'plan',label:'Day-by-day plan',icon:CalendarClock},
  {key:'journey',label:'Hawk-eye roadmap',icon:Workflow},
  {key:'dashboard',label:'Progress snapshot',icon:Flower2},
  {key:'leetcode',label:'LeetCode dojo',icon:Code2},
  {key:'micro',label:'Concept memory garden',icon:BookOpen},
  {key:'skills',label:'Java + DSA',icon:BrainCircuit},
  {key:'engineering',label:'Tech + engineering',icon:Layers3},
  {key:'projects',label:'Projects + portfolio',icon:BookOpen},
  {key:'interviews',label:'Interview lab',icon:Timer}
 ];
 const title=(name,sub)=><div className="swe-subhead"><h3>{name}</h3><p>{sub}</p></div>;
 const skillSection=(section)=>{const result=sectionCompletion(section,db);return <div key={section.id} className="swe-section-progress"><div><strong>{section.title}</strong><small>{result.done}/{result.total} independent · handbook p.{section.page}</small></div><BarLine value={result.done} max={result.total}/></div>};
 const renderLesson=(section)=>{
  const items=section.skills.filter(sk=>!skillSearch||sk.text.toLowerCase().includes(skillSearch.toLowerCase()));
  return <div className="swe-paper swe-lesson-detail">
    <div className="swe-paper-head"><div><Pill tone="pink">{section.priority}</Pill><h3>{section.title}</h3><p>{section.sourceTitle} · Your uploaded handbook, page {section.page}</p></div><span className="swe-lesson-count">{sectionCompletion(section,db).done}/{section.skills.length}<small>independent</small></span></div>
    <BarLine value={sectionCompletion(section,db).done} max={section.skills.length}/>
    <div className="swe-learning-loop"><Lightbulb size={16}/><span>Learn → write syntax → draw a trace → attempt a tiny drill → solve → test → explain Big-O → review later.</span></div>
    <input className="swe-field" aria-label="Search micro skills" placeholder="Find an exact micro-skill in this section…" value={skillSearch} onChange={e=>setSkillSearch(e.target.value)}/>
    <div className="swe-micro-list">
     {items.map((sk,i)=>{
      const current=db.skills[sk.id]||{},due=reviewDue(current,today);
      return <div key={sk.id} className={'swe-micro '+((current.level||0)>=3?'is-mastered':'')}>
       <span className="swe-micro-num">{String(i+1).padStart(2,'0')}</span><div className="swe-micro-content"><p>{sk.text}</p><div className="swe-rating-row">{SKILL_LEVELS.map(l=><button type="button" key={l.value} className={(current.level||0)===l.value&&current.lastReviewed?'is-selected level-'+l.value:''} onClick={()=>setSkillLevel(sk,l.value)} title={l.value===4?'Demonstrated in a timed mock':'Set understanding level'}>{l.label}</button>)}</div>{current.dueDate&&<small className={'swe-micro-date '+(due?'is-due':'')}>Next active recall: {current.dueDate}{due?' · due now':''}</small>}</div>
      </div>
     })}{!items.length&&<Empty title="No skill matches" sub="Try a different keyword."/>}
    </div>
   </div>
 };
 return <section className="swe-prep" aria-label="Google SWE preparation studio">
  <div className="swe-hero"><div className="swe-hero-art" aria-hidden="true">✿ <span>✧</span> ♡</div><div className="swe-hero-copy"><span className="swe-kicker">THE SWE GLOW-UP · YOUR ENGINEERING ERA</span><h2>from learning <em>to leading.</em> <span>✦</span></h2><p>A thoughtful little command center for Java, LeetCode, full-stack engineering and your Google SWE II / L3 journey. Small, independent wins count.</p><div className="swe-hero-bottom"><Pill tone="dark"><Target size={13}/> GOOGLE SWE II / L3</Pill><Pill>Goal: May 31, 2027 readiness gate</Pill><Pill>Java first · no copying</Pill></div></div><div className="swe-hero-sticker" aria-hidden="true"><FlowerBouquet variant="google"/><strong>learn · build · bloom</strong><span>✦</span></div></div>
  <nav className="swe-tabs" aria-label="Google SWE study sections">{tabList.map(({key,label,icon:Icon})=><button key={key} type="button" className={tab===key?'active':''} onClick={()=>{setTab(key);setNotice('')}}><Icon size={15}/>{label}</button>)}<button className="swe-settings-link" onClick={()=>setShowSettings(v=>!v)} title="Preferences and backup"><Settings2 size={16}/><span>Settings</span></button></nav>
  {notice&&<div className="swe-toast" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss message"><X size={14}/></button></div>}
  {showSettings&&<div className="swe-paper swe-settings">
   {title('Make the plan yours','Dates and progress are editable. Records stay in this browser; backups stay with you.')}
   <div className="swe-setting-grid"><label>Readiness target date<input className="swe-field" type="date" value={db.targetDate} onChange={e=>update({targetDate:e.target.value})}/></label><label>Weekly study goal (minutes)<input className="swe-field" type="number" min="30" max="2100" value={db.weeklyGoalMinutes} onChange={e=>update({weeklyGoalMinutes:Math.max(30,Number(e.target.value)||30)})}/></label></div>
   <div className="swe-actions"><button className="swe-button" onClick={exportFile}><Download size={15}/> Export study backup</button><label className="swe-button swe-outline"><Upload size={15}/> Restore backup<input ref={fileRef} type="file" accept=".json" onChange={e=>{const f=e.target.files?.[0];if(f)importFile(f);e.target.value=''}}/></label><button className="swe-button swe-danger" onClick={()=>{if(window.confirm('Clear only the SWE prep progress on this browser?')){setDb(INITIAL());setNotice('SWE progress reset. Your wellness and Money Garden data are unchanged.')}}}><Trash2 size={14}/> Reset SWE progress</button></div>
   <p className="swe-muted">This is separate from the wellness checkboxes and Money Garden. No LeetCode account integration or hidden Google hiring score is implied. Do not paste proprietary employer code or interview NDA information into this public website.</p>
  </div>}
  {(tab==='plan'||tab==='journey')&&<SWEIntegratedPlanner
    mode={tab==='plan'?'daily':'horizon'}
    db={db} update={update} allProblems={allProblems} today={today} initialDay={planDay}
    onGoToDaily={day=>{if(day)setPlanDay(day);setTab('plan')}}
    onOpenProblem={id=>{setSelectedProblemId(id);setNoteDraft(db.problems?.[id]?.notes||'');setTab('leetcode')}}
    onOpenSection={id=>{const section=SECTIONS.find(s=>s.id===id);if(!section)return;setSectionId(id);setSkillGroup(section.group);setTab(['Java fundamentals','Algorithms & data structures'].includes(section.group)?'skills':'engineering')}}
   />}
  {tab==='dashboard'&&<div className="swe-content">
   <div className="swe-intro-row">{title('Your engineer era, at a glance','Learning is counted as independent only when you can explain and solve it without a solution open.')}<span className="swe-asof">Updated {currentDateTime()}</span></div>
   <div className="swe-stat-grid">
    <Stat icon={BrainCircuit} eyebrow="Micro-skills you own" value={skillStats.mastered+' / '+skillStats.total} detail={skillStats.percent+'% independent or mock ready'}/>
    <Stat icon={Code2} eyebrow="Problem bank" value={independentCount+' / '+allProblems.length} detail={practicedCount+' attempted · '+attemptCount+' review entries'}/>
    <Stat icon={CalendarClock} eyebrow="Recall queue" value={String(dueCount)} detail={dueProblems.length+' problems · '+dueSkills.length+' micro-skills due'}/>
    <Stat icon={Flame} eyebrow="Consistency garden" value={streak+' day'+(streak===1?'':'s')} detail={weekSessions+' / '+db.weeklyGoalMinutes+' minutes this week'}/>
   </div>
   <div className="swe-dual">
    <article className="swe-paper swe-todays-plan">{title('Your next three moves','Do the due review first. Then learn something small and apply it.')}
     <div className="swe-next-tasks">
      <button onClick={()=>{setTab('leetcode');setProblemFilter('due');setSelectedProblemId(dueProblems[0]?.id||reviewSuggestion?.id)}}><span className="swe-task-icon">01</span><div><strong>{dueProblems.length?'Recall '+dueProblems[0].title:'Re-test '+(reviewSuggestion?.title||'an array Easy')}</strong><small>{dueProblems.length?'Review due since '+db.problems[dueProblems[0].id]?.dueDate:'Begin with an independent baseline, no solution tab.'}</small></div><ChevronRight size={15}/></button>
      <button onClick={()=>{setTab('skills');setSkillGroup('Java fundamentals');setSectionId('section-17')}}><span className="swe-task-icon">02</span><div><strong>Java arrays · trace + syntax</strong><small>Explore the smallest unmastered micro-checklist item.</small></div><ChevronRight size={15}/></button>
      <button onClick={()=>setTab('engineering')}><span className="swe-task-icon">03</span><div><strong>Engineer for 15 minutes</strong><small>Read a Java/Spring, SQL, web or debugging micro-skill.</small></div><ChevronRight size={15}/></button>
     </div><div className="swe-habit-note"><Heart size={16}/> Office-heavy day? A 10-minute recall still counts. Protect your sleep and gym routine.</div>
    </article>
    <article className="swe-paper">{title('Skill garden by track','Progress is based on tracked independent competency, not boxes you only read.')}
      <div className="swe-chart" role="img" aria-label="Bar chart of independently mastered micro skills by study track"><ResponsiveContainer width="100%" height={245}><BarChart data={charts} margin={{left:-15,right:8,top:12,bottom:40}}><CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e9dfe5"/><XAxis dataKey="group" interval={0} angle={-31} textAnchor="end" height={68} tick={{fontSize:9,fill:"#746875"}}/><YAxis allowDecimals={false} tick={{fontSize:10,fill:"#8c7585"}}/><Tooltip formatter={(v)=>v+' mastered'} contentStyle={{borderRadius:12,fontSize:11,borderColor:"#e2c7d6"}}/><Bar dataKey="mastered" radius={[5,5,0,0]} maxBarSize={38}>{charts.map((c,i)=><Cell key={c.group} fill={['#bc799b','#87a5a0','#b0a1c6','#ad9a87','#c6898a'][i%5]}/>)}</Bar></BarChart></ResponsiveContainer></div>
      <div className="swe-caption">Hover the chart for exact mastered counts. All tracks start at zero unless you've assessed them.</div>
    </article>
   </div>
   <div className="swe-dual">
    <article className="swe-paper">{title('Your next recall dates','A real D1 → D3 → D7 → D14 → D30 → D60 ladder, adjusted if you need hints.')}
      {dueProblems.length?dueProblems.slice(0,5).map(p=><button key={p.id} className="swe-due-card" onClick={()=>{setTab('leetcode');setSelectedProblemId(p.id)}}><RefreshCcw size={15}/><span><strong>{p.title}</strong><small>{gradeText(db.problems[p.id]?.grade)} · {reviewOverdue(db.problems[p.id],today)} days overdue</small></span><ChevronRight size={15}/></button>):<Empty title="No scheduled problems due yet" sub="Grade your first independent attempt to start the repetition ladder."/>}
      {dueSkills.length>0&&<button className="swe-subtle-link" onClick={()=>{setTab('skills');setSkillGroup(SECTIONS.find(x=>x.id===dueSkills[0].sectionId)?.group||'Java fundamentals');setSectionId(dueSkills[0].sectionId)}}>{dueSkills.length} micro-skill recalls are waiting →</button>}
    </article>
    <article className="swe-paper">{title('Your North Star','A target date for readiness, not a guarantee of a Google offer.')}
      <div className="swe-northstar"><GraduationCap size={36}/><div><strong>{db.targetDate}</strong><span>{daysToTarget>=0?daysToTarget+' calendar days to your self-review':Math.abs(daysToTarget)+' days past target — revise the plan from evidence'}</span></div></div>
      <div className="swe-readiness-rail"><BarLine value={Object.values(db.readinessDone).filter(Boolean).length} max={READINESS.length}/><span>{Object.values(db.readinessDone).filter(Boolean).length}/{READINESS.length} diagnostic pillars evidenced</span></div>
      <button className="swe-button swe-outline" onClick={()=>setTab('journey')}>Explore the full roadmap <ChevronRight size={15}/></button><p className="swe-muted">Main target: Google SWE II / L3, NYC preferred. A SWE III / L4 role is a stretch only if its posted requirements and your evidence align.</p>
    </article>
   </div>
   <article className="swe-paper">{title('A realistic week','5–7 hours is the handbook’s sustainable base. More is optional after you build consistency.')}<div className="swe-week-grid">{WEEKLY_RHYTHM.map(x=><div key={x.day}><strong>{x.day}</strong><span>{x.focus}</span><small>{x.minutes}</small></div>)}</div></article>
  </div>}
  {tab==='micro'&&<SWEMicroLab db={db} update={update} today={today} onOpenProblem={id=>{setSelectedProblemId(id);setNoteDraft(db.problems?.[id]?.notes||'');setTab('leetcode')}} onOpenSection={page=>{const sec=SECTIONS.find(x=>x.page===page);if(!sec)return;setSectionId(sec.id);setSkillGroup(sec.group);setTab(['Java fundamentals','Algorithms & data structures'].includes(sec.group)?'skills':'engineering')}}/>}
  {tab==='leetcode'&&<SWELeetCodeDojo db={db} update={update} allProblems={allProblems} today={today} initialProblemId={selectedProblemId}/>}
  {tab==='skills'&&<div className="swe-content">
   {title('Java + DSA mastery studio','Learn each micro-action, explain it, code a tiny example, test it, and revisit it. “Read once” is not mastered.')}
   <div className="swe-resource-layout">
    <aside className="swe-paper swe-section-nav"><div className="swe-nav-title"><BookOpen size={17}/> Java chapters</div>{SECTIONS.filter(x=>x.group==='Java fundamentals').map(s=><button key={s.id} className={sectionId===s.id?'active':''} onClick={()=>{setSectionId(s.id);setSkillGroup(s.group);setSkillSearch('')}}>{skillSection(s)}</button>)}<div className="swe-nav-title"><Workflow size={17}/> DSA patterns</div>{SECTIONS.filter(x=>x.group==='Algorithms & data structures').map(s=><button key={s.id} className={sectionId===s.id?'active':''} onClick={()=>{setSectionId(s.id);setSkillGroup(s.group);setSkillSearch('')}}>{skillSection(s)}</button>)}</aside>
    {renderLesson(SECTIONS.some(x=>x.id===sectionId&&['Java fundamentals','Algorithms & data structures'].includes(x.group))?chosenSection:SECTIONS[0])}
   </div>
  </div>}
  {tab==='engineering'&&<div className="swe-content">
    {title('Technologies + engineering depth','What makes you a strong SWE beyond LeetCode: CS fundamentals, APIs, databases, Spring, Angular, testing and technical judgment.')}
    <div className="swe-domain-filters">{ENGINEERING_GROUPS.map(g=><button key={g} className={skillGroup===g?'active':''} onClick={()=>{setSkillGroup(g);setSectionId(SECTIONS.find(s=>s.group===g)?.id);setSkillSearch('')}}>{g}</button>)}</div>
    <div className="swe-resource-layout"><aside className="swe-paper swe-section-nav"><div className="swe-nav-title"><Layers3 size={17}/> Explore this technology</div>{SECTIONS.filter(x=>x.group===(ENGINEERING_GROUPS.includes(skillGroup)?skillGroup:'Computer science')).map(s=><button key={s.id} className={chosenSection.id===s.id?'active':''} onClick={()=>{setSectionId(s.id);setSkillSearch('')}}>{skillSection(s)}</button>)}<div className="swe-tech-note"><strong>Engineer proof, not memorization:</strong> Can you draw a real end-to-end request, explain a bug diagnosis, write a test and describe the release path? Use only nonconfidential examples.</div></aside>
      {renderLesson(ENGINEERING_GROUPS.includes(chosenSection.group)?chosenSection:SECTIONS.find(s=>s.group==='Computer science'))}
    </div>
  </div>}
  {tab==='projects'&&<div className="swe-content">
    {title('Project studio + portfolio proof','One maintained, tested full-stack app matters more than five unfinished demos. CityCircle is a proposed flagship, not a required product idea.')}
    <div className="swe-project-summary"><div><strong>{projectsDone}/{totalProjects}</strong><small>project milestones finished</small></div><BarLine value={projectsDone} max={totalProjects}/><span>CityCircle · Angular + Spring Boot + Postgres</span></div>
    <div className="swe-project-grid">{PROJECT_PLAN.map((stage,i)=>{const n=stage.deliverables.filter((_,j)=>db.projectDone[stage.id+'-'+j]).length;return <article key={stage.id} className="swe-paper"><span className="swe-project-month">{stage.month}</span><div className="swe-paper-head"><h3>{stage.title}</h3><span>{n}/{stage.deliverables.length}</span></div>{stage.deliverables.map((d,j)=><label key={j} className="swe-project-task"><input type="checkbox" checked={!!db.projectDone[stage.id+'-'+j]} onChange={e=>update(old=>({projectDone:{...old.projectDone,[stage.id+'-'+j]:e.target.checked}}))}/><span>{d}</span></label>)}</article>})}</div>
    <div className="swe-dual"><article className="swe-paper">{title('Portfolio gallery · proof over polish','Suggested projects you can explain confidently.')}<div className="swe-project-item"><strong>CityCircle</strong><p>Flagship full-stack app. Explain the user problem, API, DB model, security, tests, deployment, accessibility and tradeoffs.</p><Pill tone="sage">MVP first</Pill></div><div className="swe-project-item"><strong>Pixel Matcha Café</strong><p>Polish this as a frontend interaction/design example; don’t exaggerate backend features it doesn’t have.</p><Pill>Frontend proof</Pill></div><div className="swe-project-item"><strong>Portfolio website</strong><p>Curate 2–3 real projects, working links, architecture evidence and a clear resume.</p><Pill>Present your work</Pill></div></article>
      <article className="swe-paper">{title('Use your job as an engineering laboratory','Private accomplishment journal — never paste employer source code or secrets.') }<label className="swe-reflection">This week: problem → my action → test → result → lesson<textarea rows={8} value={db.studyNotes||''} onChange={e=>update({studyNotes:e.target.value.slice(0,3000)})} placeholder="Keep this high-level and non-confidential. Example: debugged a service failure by checking logs, contract assumptions and local tests…"/></label><p className="swe-muted">The handbook highlights Angular version upgrades, Spring APIs, build/deploy flow, tests and debugging as useful engineering evidence—only describe what you personally verified.</p></article></div>
  </div>}
  {tab==='interviews'&&<div className="swe-content">
    {title('Interview lab + readiness gate','Practice how you explain your thinking, not only whether LeetCode says “Accepted.” This rubric is yours, not an official Google cutoff.')}
    <div className="swe-dual"><article className="swe-paper">{title('45-minute coding mock','Follow the handbook pacing: clarify (5), approach (5), implement (18), test (10), summarize (7).')}<div className="swe-timer"><Timer size={29}/><strong>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</strong><span>{seconds>=2700?'45-minute target reached · finish your thought!':'45-minute mock target'}</span></div><div className="swe-actions"><button className="swe-button" onClick={()=>setTimerOn(v=>!v)}>{timerOn?<Pause size={15}/>:<Play size={15}/>} {timerOn?'Pause':'Start / resume'}</button><button className="swe-button swe-outline" onClick={()=>{setTimerOn(false);setSeconds(0)}}><RotateCcw size={15}/> Reset</button></div><div className="swe-interview-steps">{[['00–05','Clarify inputs, outputs, constraints'],['05–10','Brute force, optimized strategy'],['10–28','Implement Java and narrate'],['28–38','Normal, edge, adversarial tests'],['38–45','Big-O and extension']].map(([time,text])=><div key={time}><span>{time}</span>{text}</div>)}</div></article>
      <article className="swe-paper">{title('Record honest mock evidence','Self-rating is a reflection, not a hiring predictor.')}<label className="swe-form-label">Practice topic / problem<input className="swe-field" value={sessionTopic} onChange={e=>setSessionTopic(e.target.value)} placeholder="e.g. #200 Number of Islands / mock"/></label><div className="swe-form-grid"><label>Session kind<select className="swe-field" value={sessionKind} onChange={e=>setSessionKind(e.target.value)}><option>Coding mock</option><option>Spaced review</option><option>Java micro-drill</option><option>Engineering / project</option><option>Behavioral / STAR</option></select></label><label>Self-rating (1–5)<select className="swe-field" value={sessionScore} onChange={e=>setSessionScore(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} / 5</option>)}</select></label></div><label className="swe-reflection">What worked / what failed / next action<textarea rows={4} value={sessionNotes} onChange={e=>setSessionNotes(e.target.value)} placeholder="What did I clarify? Which edge case did I miss? Did I need a hint?"/></label><button className="swe-button" onClick={submitSession}><Check size={15}/> Save this session</button><p className="swe-muted">If you never started the timer, the record defaults to a 25-minute practice block. You can adapt your duration in a future version.</p></article></div>
    <div className="swe-paper">{title('May 31 evidence checklist','Eight pillars from the handbook. Mark each only after you have evidence, not after reading the sentence.')}<div className="swe-readiness-grid">{READINESS.map(r=><label key={r.id} className={'swe-readiness-item '+(db.readinessDone[r.id]?'complete':'')}><input type="checkbox" checked={!!db.readinessDone[r.id]} onChange={e=>update(old=>({readinessDone:{...old.readinessDone,[r.id]:e.target.checked}}))}/><span><strong>{r.name}</strong><small>{r.test}</small></span></label>)}</div></div>
    <div className="swe-dual"><article className="swe-paper">{title('Googleyness + leadership stories','Use STAR: Situation → Task → your Action → Result → Reflection.')}<div className="swe-story-prompts">{['Ownership and initiative','Technical disagreement','Ambiguous requirements','Production debugging','Learning from feedback','Cross-team collaboration','Tradeoffs and prioritization','Learning difficult technology','Quality vs speed','Why this team / role'].map((name,i)=><label key={i}><input type="checkbox" checked={!!db.readinessDone['story-'+i]} onChange={e=>update(old=>({readinessDone:{...old.readinessDone,['story-'+i]:e.target.checked}}))}/><span>{name}</span></label>)}</div><p className="swe-muted">Do not invent metrics or reveal confidential business information.</p></article><article className="swe-paper">{title('Recent sessions','Your rehearsal history helps you distinguish comfort from readiness.') }{db.sessions.length?db.sessions.slice(-10).reverse().map(s=><div className="swe-session" key={s.id}><span><strong>{s.topic}</strong><small>{s.date} · {s.kind} · {s.minutes} min · {s.score}/5</small>{s.notes&&<small>{s.notes}</small>}</span><button aria-label={'Delete session '+s.topic} onClick={()=>{if(window.confirm('Remove this study session?'))update({sessions:db.sessions.filter(x=>x.id!==s.id)})}}><Trash2 size={13}/></button></div>):<Empty title="Your first mock is waiting" sub="Start the clock and reflect on an honest practice attempt."/>}</article></div>
  </div>}
  <footer className="swe-footer"><span>✿ Inspired by your 99-page SWE Glow-Up handbook · micro-level practice, not a hiring guarantee</span><span><a href="https://www.google.com/about/careers/applications/" target="_blank" rel="noopener noreferrer">Google Careers <ExternalLink size={12}/></a> <span>·</span> Private browser progress</span></footer>
 </section>;
}
