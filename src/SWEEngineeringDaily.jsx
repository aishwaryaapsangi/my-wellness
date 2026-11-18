import React,{useState} from 'react';
import {ENGINEERING_MICROS,engineeringLessonsForDate,engineeringDueLessons} from './sweEngineeringMicro.js';
import {MicroConceptCard} from './SWEMicroLab.jsx';
import {getMicroRecord} from './sweMicroConcepts.js';

// Every engineering topic uses the same per-atomic-skill progress store and recall algorithm.
export default function SWEEngineeringDaily({date,today,db,update,onOpenProblem,onOpenSection}){
 const lessons=engineeringLessonsForDate(date);
 const due=engineeringDueLessons(db,date).filter(c=>!lessons.some(l=>l.id===c.id));
 const [chosen,setChosen]=useState('');
 const picked=ENGINEERING_MICROS.find(c=>c.id===chosen);
 return <section className="sip-panel" aria-label="Java OOP, backend, SQL and Angular micro study">
  <div className="sip-panel-top"><div><span className="sip-eyebrow">✦ JAVA / OOP → API → DATABASE → ANGULAR</span>
   <h3>engineering micro-skills + lifelong recall</h3>
   <p>Small, testable concepts rather than an entire subject in one sitting. Core = higher priority for coding, Java, backend and general SWE interviews; project skills still matter.</p></div>
   <span className="sip-muted">{ENGINEERING_MICROS.length} atomic lessons · {due.length} awaiting recall</span>
  </div>
  {date==='2026-11-18'&&<p className="sip-muted"><strong>Your reported study today:</strong> polymorphism, BigDecimal, and inherited Object methods. Open each card to grade your actual recall; nothing is auto-marked mastered.</p>}
  {date==='2026-11-19'&&<p className="sip-muted"><strong>Tomorrow’s requested focus:</strong> enums and encapsulation. These each have their own recall records.</p>}
  <div className="sml-daily-grid">
   {lessons.map(lesson=><div key={lesson.id}><p className="sip-muted"><strong>{lesson.priority==='core'?'CORE / HIGH PRIORITY':'SUPPORT / PROJECT DEPTH'}</strong> · {lesson.family}</p><MicroConceptCard lesson={lesson} date={date} today={today} db={db} update={update} kind="learn" onOpenProblem={onOpenProblem} onOpenSection={onOpenSection}/></div>)}
   {due[0]&&<div><p className="sip-muted"><strong>ENGINEERING ACTIVE RECALL</strong> · {due[0].family}</p><MicroConceptCard key={'eng-recall-'+due[0].id+'-'+date} lesson={due[0]} date={date} today={today} db={db} update={update} kind="review" onOpenProblem={onOpenProblem} onOpenSection={onOpenSection}/></div>}
  </div>
  {!lessons.length&&!due.length&&<p className="sip-muted">You have introduced every engineering micro-skill. Reviews continue whenever due; revisit any concept below at any time.</p>}
  <div className="sip-inline-actions">
   <label>Open any engineering concept <select value={chosen} onChange={e=>setChosen(e.target.value)}><option value="">Choose a micro-lesson…</option>{ENGINEERING_MICROS.map(x=><option key={x.id} value={x.id}>{x.priority==='core'?'★ ':'· '}{x.family} — {x.title}</option>)}</select></label>
   {due.length>1&&<span className="sip-muted">{due.length-1} additional due concepts remain available through this picker; none are discarded.</span>}
  </div>
  {picked&&<MicroConceptCard key={'eng-picked-'+picked.id} lesson={picked} date={date} today={today} db={db} update={update} kind="library" onOpenProblem={onOpenProblem} onOpenSection={onOpenSection}/>}
 </section>;
}
