import React,{useMemo,useState} from 'react';
import {BookOpen,CalendarClock,CheckCircle2,ChevronDown,ChevronRight,Clock3,Code2,Flower2,LibraryBig,Lightbulb,NotebookPen,RefreshCcw,Search,Tag} from 'lucide-react';
import {dateKey,addStudyDays} from './sweStudyLogic.js';
import {MICRO_CONCEPTS,MICRO_FAMILIES,microLessonForDate,microDueLessons,microReviewForDate,getMicroRecord,microGrade} from './sweMicroConcepts.js';
import './swe-micro-lab.css';

const GRADE_CHOICES=[
 ['red','RED','Couldn’t explain','Try again tomorrow'],
 ['yellow','YELLOW','Needed notes / hint','Try again in 3 days'],
 ['green','GREEN','Independent recall','1 → 3 → 7 → 14+ days'],
 ['mock','MOCK','Explained + traced','Move to longer interval']
];
const readable=d=>d?new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'—';

export function MicroConceptCard({lesson,date,today=dateKey(),db={},update,kind='learn',onOpenProblem,onOpenSection}){
 const [showAnswer,setShowAnswer]=useState(false);
 const [showLog,setShowLog]=useState(false);
 const [feedback,setFeedback]=useState('');
 const record=getMicroRecord(db,lesson)||{};
 const afterToday=date>today;
 const olderRecord=record.lastReviewed&&date<record.lastReviewed;
 const gradedToday=record.lastReviewed===date;
 const canGrade=!afterToday&&!olderRecord;
 const note=(db.microRecords?.[lesson.id]?.notes ?? record.notes ?? '');
 function grade(g){
  if(!canGrade)return;
  try{
   update(old=>{
    const before=(old.microRecords||{})[lesson.id]||getMicroRecord(old,lesson)||{};
    return {microRecords:{...(old.microRecords||{}),[lesson.id]:microGrade(before,g,date)}};
   });
   setFeedback('Saved for '+readable(date)+'. Next recall is scheduled separately.');
   setShowAnswer(false);
  }catch(err){setFeedback(err.message)}
 }
 function saveNote(value){
  update(old=>{
   const current=(old.microRecords||{})[lesson.id]||getMicroRecord(old,lesson)||{};
   return {microRecords:{...(old.microRecords||{}),[lesson.id]:{...current,notes:value.slice(0,2400)}}};
  });
 }
 return <article className={'sml-card '+(kind==='review'?'sml-review':'')}>
  <div className="sml-top">
   <span className="sml-eyebrow">{kind==='review'?'↻ ONE-CONCEPT ACTIVE RECALL':kind==='library'?'✿ CONCEPT STUDY LIBRARY':'✦ ONE NEW CONCEPT TODAY'}</span>
   <span className="sml-date"><CalendarClock size={13}/> {readable(date)}</span>
  </div>
  <div className="sml-title-row">
   <div><span className="sml-family">{lesson.family}</span><h4>{lesson.title}</h4></div>
   <span className="sml-index">#{String(lesson.order).padStart(3,'0')}</span>
  </div>
  <p className="sml-focus">{kind==='review'?'Try answering from memory before opening the explanation. One concept, one honest grade.':lesson.goal}</p>
  {kind==='review'&&<div className="sml-question"><strong>Recall without peeking</strong><p>{lesson.recall}</p></div>}
  <button type="button" className="sml-reveal" aria-expanded={showAnswer} onClick={()=>setShowAnswer(v=>!v)}>
   <BookOpen size={16}/>{showAnswer?'Hide explanation + code':'Show explanation, syntax + pitfalls'} <ChevronDown size={15}/>
  </button>
  {showAnswer&&<div className="sml-revealed">
    <div><strong>What to know</strong><p>{lesson.goal}</p></div>
    {lesson.syntax&&<div><strong>Java example</strong><pre><code>{lesson.syntax}</code></pre></div>}
    <div><strong>{kind==='review'?'Check your answer':'Quiz yourself'}</strong><p>{lesson.recall}</p></div>
    <div className="sml-trap"><Lightbulb size={15}/><p><strong>Watch out:</strong> {lesson.trap}</p></div>
   </div>}
  <div className="sml-actions">
   {lesson.problemId&&onOpenProblem&&<button className="sml-lesson-link" onClick={()=>onOpenProblem(lesson.problemId)}><Code2 size={14}/> Practice #{lesson.problemId}<ChevronRight size={13}/></button>}
   {lesson.page&&onOpenSection&&<button className="sml-lesson-link" onClick={()=>onOpenSection(lesson.page)}><BookOpen size={14}/> Handbook p. {lesson.page}<ChevronRight size={13}/></button>}
  </div>
  <label className="sml-notes"><span><NotebookPen size={13}/> My memory hook / mistake / edge case</span><textarea rows={2} value={note} onChange={e=>saveNote(e.target.value)} placeholder="What would I forget in two weeks? Add a tiny trace or Java syntax reminder…"/></label>
  <div className="sml-grade-head"><strong>How did you recall this ONE concept?</strong><span>{afterToday?'Future preview — grading available on that date':olderRecord?'A later review is already recorded; use the current day to grade':gradedToday?'Recorded today · you can correct your grade':'Record learning / recall date and schedule its next review'}</span></div>
  <div className="sml-grades">{GRADE_CHOICES.map(([id,label,detail])=><button key={id} type="button" className={'sml-grade '+id+(gradedToday&&record.grade===id?' active':'')} disabled={!canGrade} onClick={()=>grade(id)}><strong>{label}</strong><small>{detail}</small></button>)}</div>
  <div className="sml-schedule"><RefreshCcw size={15}/><span>{record.lastReviewed?<>Last graded <strong>{readable(record.lastReviewed)}</strong> · next due <strong>{readable(record.dueDate)}</strong></>:<>Not graded yet · first independent recall will be scheduled after you grade it</>}</span></div>
  {feedback&&<div className="sml-feedback" role="status">{feedback}</div>}
  {!!record.history?.length&&<div className="sml-history">
    <button onClick={()=>setShowLog(v=>!v)} aria-expanded={showLog}><Clock3 size={13}/> {record.history.length} recall record{record.history.length!==1?'s':''}<ChevronDown size={12}/></button>
    {showLog&&<div className="sml-history-items">{record.history.map((entry,i)=><span key={i}>{readable(entry.date)} · {String(entry.grade).toUpperCase()}</span>)}</div>}
  </div>}
 </article>;
}

export function DailyMicroConcepts({date,today,db,update,onOpenProblem,onOpenSection,light=false}){
 const newLesson=microLessonForDate(date);
 const review=microDueLessons(db,date).find(x=>x.id!==newLesson?.id)||null;
 const dueCount=microDueLessons(db,date).length;
 if(!newLesson&&!review)return <div className="sml-empty"><Flower2 size={23}/> You have introduced every micro-concept! Keep practicing: your independent recall queue continues for life of your Google SWE journey. You can also review any skill in the library.</div>;
 return <section className="sml-daily" aria-label="Daily micro-concepts and active recall">
  <div className="sml-day-head"><div><span className="sml-eyebrow">YOUR DAILY LEARNING PAIR</span><h3>one new idea. <em>one small recall.</em></h3><p>Each topic gets its own date and spaced review. A completed checkbox alone never means you have mastered it.</p></div><span className="sml-due-count">{dueCount} due in backlog · <strong>1</strong> scheduled today</span></div>
  <div className={'sml-daily-grid'+(light?' is-light':'')}>
   {newLesson&&<MicroConceptCard key={'new-'+date+'-'+newLesson.id} lesson={newLesson} date={date} today={today} db={db} update={update} onOpenProblem={onOpenProblem} onOpenSection={onOpenSection}/>}
   {review?<MicroConceptCard key={'review-'+date+'-'+review.id} kind="review" lesson={review} date={date} today={today} db={db} update={update} onOpenProblem={onOpenProblem} onOpenSection={onOpenSection}/>:<div className="sml-rest-card"><RefreshCcw size={24}/><h4>{date==='2026-11-16'?'your recall queue starts here':'No concept review assigned yet'}</h4><p>Grade a new concept after studying it. GREEN progresses through 1, 3, 7, 14, 30, 60 and 90-day recall; YELLOW returns in 3 days, RED tomorrow. Every concept keeps returning, even after you finish the whole syllabus.</p></div>}
  </div>
 </section>;
}

export default function SWEMicroLab({db,update,today=dateKey(),onOpenProblem,onOpenSection}){
 const [family,setFamily]=useState('all');
 const [search,setSearch]=useState('');
 const [status,setStatus]=useState('all');
 const [selected,setSelected]=useState(null);
 const [limit,setLimit]=useState(24);
 const records=useMemo(()=>MICRO_CONCEPTS.filter(x=>!!getMicroRecord(db,x)?.grade).length,[db.microRecords,db.skills]);
 const due=microDueLessons(db,today),todayLesson=microLessonForDate(today),review=microReviewForDate(db,today);
 const list=MICRO_CONCEPTS.filter(c=>{
  const r=getMicroRecord(db,c);
  return (family==='all'||c.family===family)&&
    (status==='all'||(status==='not-started'&&!r?.grade)||(status==='studied'&&!!r?.grade)||(status==='due'&&due.some(x=>x.id===c.id)))&&
    (!search||[c.title,c.goal,c.family,c.recall].join(' ').toLowerCase().includes(search.toLowerCase()));
 });
 const focus=selected?MICRO_CONCEPTS.find(c=>c.id===selected):null;
 return <section className="sml-library">
  <div className="sml-library-header"><span className="sml-eyebrow">THE PINK CODING LIBRARY · ATOMIC STUDY</span><h3>your concept <em>memory garden.</em></h3><p>One concept each day, not an entire data structure at once. This searchable library has atomic lessons across every DSA family, from Java methods and arrays to trees, graphs, greedy and dynamic programming. All studied concepts return for spaced recall until you land the job.</p>
   <div className="sml-counts"><span><strong>{MICRO_CONCEPTS.length}</strong> concepts in the library</span><span><strong>{records}</strong> graded</span><span><strong>{due.length}</strong> due · one featured today; open the Due filter for extras</span></div>
  </div>
  <div className="sml-schedule-preview"><h4>Coming up in your study notebook</h4><div>{Array.from({length:7},(_,i)=>{const day=addStudyDays(today,i),item=microLessonForDate(day);return item?<button key={day} onClick={()=>setSelected(item.id)}><small>{readable(day)}</small><strong>{item.title}</strong><span>{item.family}</span></button>:null})}</div></div>
  {review&&<div className="sml-queued"><RefreshCcw size={18}/><span><strong>Today’s single recall:</strong> {review.title} · due since {readable(getMicroRecord(db,review)?.dueDate)}</span><button onClick={()=>setSelected(review.id)}>Open recall <ChevronRight size={13}/></button></div>}
  <div className="sml-library-tools"><label><Search size={16}/><input placeholder="Search methods, Java syntax, data structures or invariants…" value={search} onChange={e=>{setSearch(e.target.value);setLimit(24);setSelected(null)}}/></label><select aria-label="Filter concept family" value={family} onChange={e=>{setFamily(e.target.value);setLimit(24);setSelected(null)}}><option value="all">All concept families</option>{MICRO_FAMILIES.map(x=><option key={x}>{x}</option>)}</select><select aria-label="Filter learning status" value={status} onChange={e=>{setStatus(e.target.value);setLimit(24);setSelected(null)}}><option value="all">All statuses</option><option value="not-started">Not started</option><option value="studied">Graded / studied</option><option value="due">Due for recall</option></select></div>
  <div className="sml-library-grid">
   <aside className="sml-list"><div className="sml-list-count">{list.length} matching micro-concepts</div>{list.slice(0,limit).map(c=>{const r=getMicroRecord(db,c);return <button type="button" key={c.id} className={'sml-list-item'+(c.id===selected?' active':'')} onClick={()=>setSelected(c.id)}><span className="sml-list-number">{String(c.order).padStart(3,'0')}</span><span><strong>{c.title}</strong><small>{c.family} · {r?.grade?r.grade.toUpperCase():'NEW'}</small></span><ChevronRight size={14}/></button>})}{limit<list.length&&<button className="sml-load-more" onClick={()=>setLimit(x=>x+24)}>Show 24 more concepts</button>}{!list.length&&<p className="sml-none">No matching concept. Try another family or search.</p>}</aside>
   <div className="sml-library-detail">{focus?<MicroConceptCard key={focus.id} kind="library" lesson={focus} date={today} today={today} db={db} update={update} onOpenProblem={onOpenProblem} onOpenSection={onOpenSection}/>:<div className="sml-library-placeholder"><LibraryBig size={33}/><h4>Pick a micro-concept to open its lesson</h4><p>You can read the Java example, answer the memory prompt, save a personal note, and grade it independently without marking the whole topic complete.</p><p>The first seven lessons cover arrays and ArrayList basics, then every DSA family rotates in. Every concept has its own recall history and next-due date.</p></div>}</div>
  </div>
 </section>;
}
