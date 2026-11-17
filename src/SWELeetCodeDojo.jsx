import React,{useEffect,useMemo,useState} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import {java} from '@codemirror/lang-java';
import {CalendarDays,Check,ChevronDown,ChevronRight,ClipboardCheck,Code2,ExternalLink,FileCode2,Filter,History,NotebookPen,Plus,RefreshCcw,RotateCcw,Search,Tag,Trash2} from 'lucide-react';
import {dateKey} from './sweStudyLogic.js';
import {sprintForDate} from './sweIntegratedPlan.js';
import {ALL_CONCEPTS,CONCEPT_GROUPS,DIFFICULTIES,attempted,conceptsForProblem,logProblemAttempt,editProblemAttempt,deleteProblemAttempt,filterLeetCodeProblems,recalcProblem,validStudyDate} from './leetcodeStudyModel.js';
import './swe-leetcode-dojo.css';

const JAVA_EXT=[java()];
const GRADES={red:'RED · needed a solution',yellow:'YELLOW · used hints / slow',green:'GREEN · fully independent',mock:'MOCK · timed and explained'};
const GRADE_DESCRIPTIONS={red:'Stuck / saw solution',yellow:'Hints or slow',green:'Independent solve',mock:'Timed + clear'};
const LEVELS=[['all','All difficulties'],['Easy','Easy'],['Medium','Medium'],['Hard','Hard'],['Unrated','Not rated']];
const PHASES=[['all','All curriculum paths'],['F1','F1 · Java & arrays'],['F2','F2 · Strings & hash'],['F3','F3 · Search / stacks'],['F4','F4 · Trees & graphs'],['F5','F5 · DP & greedy'],['PRIOR','Earlier study list'],['CUSTOM','My additions']];
const FILTERS=[['all','All'],['due','Due / first try'],['red','Red'],['yellow','Yellow'],['green','Green'],['mock','Mock'],['prior','Prior attempts'],['unattempted','Not attempted']];
const codeDefaults={basicSetup:{lineNumbers:true,highlightActiveLine:true,foldGutter:true,autocompletion:true,bracketMatching:true},theme:'light',extensions:JAVA_EXT};
const displayDate=day=>day?new Date(day+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'—';
const linkFor=p=>'https://leetcode.com/problems/'+p.title.toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'/';

function GradePill({grade}){return <span className={'sld-grade '+(grade||'new')}>{grade?grade.toUpperCase():'NEW'}</span>}
function CodeNotebook({value,onChange,label,sub,readOnly=false}){
 return <div className="sld-editor">
   <div className="sld-editor-heading"><div><FileCode2 size={17}/><strong>{label}</strong></div><span>Java · {readOnly?'saved snapshot':'autosaved locally'}</span></div>
   {sub&&<p>{sub}</p>}
   <CodeMirror value={value||''} {...codeDefaults} height="230px" onChange={readOnly?undefined:onChange} readOnly={readOnly}
     placeholder={readOnly?'No code saved for this attempt.':'// class Solution {\n//     public int solve(int[] nums) {\n//         // Write your Java code here…\n//     }\n// }'}/>
 </div>;
}

export default function SWELeetCodeDojo({db,update,allProblems,today=dateKey(),initialProblemId,onSelected}){
 const [search,setSearch]=useState('');
 const [phase,setPhase]=useState('all');
 const [status,setStatus]=useState('all');
 const [concept,setConcept]=useState('all');
 const [difficulty,setDifficulty]=useState('all');
 const [activeId,setActiveId]=useState(initialProblemId);
 const [attemptDate,setAttemptDate]=useState(today);
 const [editorTab,setEditorTab]=useState('my');
 const [message,setMessage]=useState('');
 const [addOpen,setAddOpen]=useState(false);
 const [draftNum,setDraftNum]=useState('');
 const [draftTitle,setDraftTitle]=useState('');
 const [draftPattern,setDraftPattern]=useState('');
 const [showAllTags,setShowAllTags]=useState(false);
 const [historyExpanded,setHistoryExpanded]=useState(false);
 const [sort,setSort]=useState('curriculum');
 const currentSprint=sprintForDate(today);
 const firstAttempts=currentSprint.problemIds.filter(id=>!attempted(db.problems?.[id]));
 const records=db.problems||{};
 const filtered=useMemo(()=>filterLeetCodeProblems(allProblems,records,{search,phase,status,concept,difficulty,today,firstAttempts}),[allProblems,records,search,phase,status,concept,difficulty,today,firstAttempts.join(',')]);
 const ordered=useMemo(()=>{
  const arr=[...filtered];
  if(sort==='last')arr.sort((a,b)=>(records[b.id]?.lastReviewed||'').localeCompare(records[a.id]?.lastReviewed||''));
  if(sort==='id')arr.sort((a,b)=>a.id-b.id);
  if(sort==='due')arr.sort((a,b)=>{
   const aDate=records[a.id]?.dueDate||'9999-12-31',bDate=records[b.id]?.dueDate||'9999-12-31';
   return aDate.localeCompare(bDate);
  });
  return arr;
 },[filtered,records,sort]);
 const chosen=allProblems.find(p=>String(p.id)===String(activeId))||ordered[0]||null;
 const record=chosen?records[chosen.id]||{}:{};
 const history=recalcProblem(record).history;
 const tags=chosen?conceptsForProblem(chosen,record):[];
 const hasAttempt=attempted(record);
 const due=hasAttempt&&!!record.dueDate&&record.dueDate<=today;
 const suggestedFirst=chosen&&!hasAttempt&&firstAttempts.includes(chosen.id);
 const countAttempted=allProblems.filter(p=>attempted(records[p.id])).length;
 const countNotAttempted=allProblems.length-countAttempted;
 const countDue=allProblems.filter(p=>attempted(records[p.id])&&records[p.id]?.dueDate<=today).length;
 const selectedId=chosen?.id;
 useEffect(()=>{
  if(initialProblemId!==null&&initialProblemId!==undefined){
   setActiveId(initialProblemId);
   setStatus('all');setSearch('');setConcept('all');setDifficulty('all');setPhase('all');
  }
 },[initialProblemId]);
 const choose=p=>{
  setActiveId(p.id);
  onSelected?.(p.id);
  setMessage('');
  setEditorTab('my');
  setHistoryExpanded(false);
 };
 const chooseFilter=(setter,value)=>{
  setter(value);
  setMessage('');
  setActiveId(null);
 };
 function changeRecord(patch){
  if(!chosen)return;
  update(old=>({problems:{...old.problems,[chosen.id]:{...(old.problems[chosen.id]||{}),...patch}}}));
 }
 function toggleConcept(label){
  const next=tags.includes(label)?tags.filter(x=>x!==label):[...tags,label];
  changeRecord({concepts:next});
 }
 function resetConcepts(){
  if(!chosen)return;
  update(old=>{
   const item={...(old.problems[chosen.id]||{})};
   delete item.concepts;
   return {problems:{...old.problems,[chosen.id]:item}};
  });
 }
 function saveAttempt(grade){
  if(!chosen)return;
  if(!validStudyDate(attemptDate,today)){setMessage('Choose a real attempt date on or before today.');return}
  const was=record.history?.length||0;
  update(old=>{
   const existing=old.problems?.[chosen.id]||{};
   const next=logProblemAttempt(existing,grade,attemptDate,existing.workingCode||'',existing.notes||'');
   return {problems:{...(old.problems||{}),[chosen.id]:next}};
  });
  setStatus(prev=>prev==='unattempted'||prev==='due'?'prior':prev);
  setMessage('Attempt recorded for '+displayDate(attemptDate)+'. You can edit its date, grade or notes in the history below. Your code was snapshotted.');
  setHistoryExpanded(true);
 }
 function modifyAttempt(id,patch){
  if(!chosen)return;
  if(patch.date&&!validStudyDate(patch.date,today)){setMessage('The attempt date must be a real date on or before today.');return}
  update(old=>({problems:{...old.problems,[chosen.id]:editProblemAttempt(old.problems[chosen.id]||{},id,patch)}}));
  setMessage('Attempt updated. Your chronological review schedule has been recalculated.');
 }
 function removeAttempt(id){
  if(!chosen||!window.confirm('Remove this saved attempt? This changes the review schedule.'))return;
  update(old=>({problems:{...old.problems,[chosen.id]:deleteProblemAttempt(old.problems[chosen.id]||{},id)}}));
  setMessage('Attempt removed and next review recalculated.');
 }
 function addCustom(){
  const id=Number(draftNum),title=draftTitle.trim();
  if(!Number.isInteger(id)||id<=0||!title){setMessage('Enter a positive LeetCode number and title.');return}
  if(allProblems.some(p=>p.id===id)){setMessage('That problem is already in the library. Search for #'+id+'.');return}
  update(old=>({customProblems:[...(old.customProblems||[]),{id,title:title.slice(0,160),pattern:draftPattern.trim().slice(0,140)||'Personal practice',phase:'CUSTOM'}]}));
  setActiveId(id);onSelected?.(id);
  setStatus('all');setPhase('all');setSearch('');setConcept('all');setDifficulty('all');
  setDraftNum('');setDraftTitle('');setDraftPattern('');setAddOpen(false);
  setMessage('#'+id+' added to your library. Set its difficulty and concepts, then log a dated attempt.');
 }
 const currentGrade=hasAttempt?record.grade:null;
 const dueLabel=due?'Due now'+(record.dueDate?' (since '+displayDate(record.dueDate)+')':''):suggestedFirst?'Planned first attempt this week':record.dueDate?'Next recall '+displayDate(record.dueDate):'No scheduled review yet';
 return <div className="sld-wrap">
  <header className="sld-page-heading"><div><span className="sld-kicker">✿ A REAL CODING LAB · MEMORY OVER STREAKS</span><h3>your LeetCode <em>study archive.</em></h3><p>Choose an attempt date, save your Java code, label its concepts, and keep every redo. Only your recorded attempts count as attempted.</p></div><div className="sld-counters"><span><strong>{countAttempted}</strong> attempted</span><span><strong>{countNotAttempted}</strong> not yet</span><span><strong>{countDue}</strong> due reviews</span></div></header>
  {message&&<div role="status" className="sld-notice">{message}<button onClick={()=>setMessage('')} aria-label="Dismiss message">×</button></div>}
  <div className="sld-grid"><aside className="swe-paper sld-browser">
   <div className="sld-browser-top"><div><Search size={15}/><input type="search" aria-label="Search LeetCode questions" placeholder="Find a problem, number or pattern…" value={search} onChange={e=>chooseFilter(setSearch,e.target.value)}/></div><span>{ordered.length} matching</span></div>
   <div className="sld-filter-pills">{FILTERS.map(([id,label])=><button key={id} className={status===id?'active':''} onClick={()=>chooseFilter(setStatus,id)}>{label}{id==='prior'&&countAttempted>0?' · '+countAttempted:''}{id==='unattempted'?' · '+countNotAttempted:''}</button>)}</div>
   <div className="sld-select-filters">
    <label>Learning path<select value={phase} onChange={e=>chooseFilter(setPhase,e.target.value)}>{PHASES.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
    <label>Data structure / concept<select aria-label="Filter by data structure or concept" value={concept} onChange={e=>chooseFilter(setConcept,e.target.value)}><option value="all">All data structures and patterns</option>{Object.entries(CONCEPT_GROUPS).map(([group,values])=><optgroup label={group} key={group}>{values.map(value=><option value={value} key={value}>{value}</option>)}</optgroup>)}</select></label>
    <label>Difficulty<select aria-label="Filter by difficulty" value={difficulty} onChange={e=>chooseFilter(setDifficulty,e.target.value)}>{LEVELS.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
    <label>Sort<select aria-label="Sort LeetCode problems" value={sort} onChange={e=>setSort(e.target.value)}><option value="curriculum">Curriculum order</option><option value="last">Latest attempt first</option><option value="due">Next review date</option><option value="id">Problem number</option></select></label>
   </div>
   {status==='due'&&<p className="sld-filter-explain">Shows scheduled reattempts that are due <strong>plus your 3 first-try suggestions for this week</strong>. Use Not attempted for the complete unattempted library.</p>}
   {status==='prior'&&<p className="sld-filter-explain">Only questions with at least one RED / YELLOW / GREEN / MOCK attempt you actually saved appear here. Your earlier discussed questions aren't automatically marked attempted.</p>}
   <div className="sld-problems">{ordered.map(p=>{
    const r=records[p.id]||{},has=attempted(r),isDue=has&&r.dueDate<=today;
    const badges=conceptsForProblem(p,r);
    return <button type="button" key={p.id} className={'sld-problem '+(selectedId===p.id?'selected':'')} onClick={()=>choose(p)}>
     <span className="sld-problem-num">#{p.id}</span><span className="sld-problem-details"><strong>{p.title}</strong><small>{badges.slice(0,2).join(' · ')||p.pattern}</small><span>{has?'Last attempt '+displayDate(r.lastReviewed||r.history?.at(-1)?.date):isDue?'Due':'Not attempted'}</span></span>
     <span className="sld-row-right"><GradePill grade={has?r.grade:null}/><small>{r.difficulty||'Unrated'}</small></span>
    </button>;
   })}{!ordered.length&&<div className="sld-no-results"><Filter size={20}/><strong>No problems match</strong><p>Try clearing the concept, difficulty or status filter.</p><button onClick={()=>{setSearch('');setConcept('all');setDifficulty('all');setPhase('all');setStatus('all')}}>Clear filters</button></div>}</div>
   <div className="sld-new-problem">
    <button className="sld-new-toggle" onClick={()=>setAddOpen(v=>!v)}><Plus size={15}/> {addOpen?'Close the new-problem form':'Add my own LeetCode problem'}</button>
    {addOpen&&<div className="sld-new-fields"><label>LeetCode problem #<input type="number" min="1" value={draftNum} onChange={e=>setDraftNum(e.target.value)}/></label><label>Title<input value={draftTitle} onChange={e=>setDraftTitle(e.target.value)} placeholder="Problem title"/></label><label>Pattern (optional)<input value={draftPattern} onChange={e=>setDraftPattern(e.target.value)} placeholder="e.g. two pointers"/></label><button className="sld-primary" onClick={addCustom}>Add to my library</button></div>}
   </div>
  </aside>
  <main className="swe-paper sld-detail">
   {chosen?<>
    <div className="sld-detail-top"><span className="sld-overline">LEETCODE #{chosen.id} · {chosen.phase||'PERSONAL'}</span><GradePill grade={currentGrade}/></div>
    <h3>{chosen.title}</h3><div className="sld-subtitle">{chosen.pattern} · {hasAttempt?history.length+' actual attempt'+(history.length===1?'':'s'):'not attempted yet'}</div>
    <a className="sld-open" href={linkFor(chosen)} target="_blank" rel="noopener noreferrer"><ExternalLink size={15}/> Open in LeetCode</a>
    {chosen.prior&&!hasAttempt&&<p className="sld-prior-note">✎ This problem appeared in our earlier practice notes, but you haven't logged a dated attempt here yet. It stays under Not attempted until you record one.</p>}
    <div className="sld-meta-head"><Tag size={16}/><h4>Organize this problem</h4><span>Auto-saved filters</span></div>
    <div className="sld-difficulty"><label>LeetCode difficulty<select value={record.difficulty||'Unrated'} onChange={e=>changeRecord({difficulty:e.target.value})}>{DIFFICULTIES.map(level=><option key={level} value={level}>{level==='Unrated'?'Choose difficulty…':level}</option>)}</select></label><span className="sld-meta-help">Set it from the actual LeetCode question. You can change it later.</span></div>
    <div className="sld-tag-heading"><strong>What data structures and concepts does it test?</strong><button type="button" onClick={resetConcepts}><RotateCcw size={12}/> Restore suggested tags</button></div>
    <div className="sld-concept-tags">{(showAllTags?ALL_CONCEPTS:tags.length?tags:ALL_CONCEPTS.slice(0,7)).map(label=><button key={label} type="button" className={'sld-concept-tag '+(tags.includes(label)?'selected':'')} onClick={()=>toggleConcept(label)} aria-pressed={tags.includes(label)}>{tags.includes(label)?'✓ ':'+ '}{label}</button>)}</div>
    <button className="sld-see-tags" onClick={()=>setShowAllTags(v=>!v)}>{showAllTags?'Show only chosen concepts':'Edit / add more concepts'} <ChevronDown size={13}/></button>
    <div className="sld-attempt-header"><div><span className="sld-overline">ACTUAL PRACTICE LOG</span><h4>Record an attempt or reattempt</h4><p>Pick the day you worked on it. Your grade determines the next spaced review; your code and notes are snapshotted with that attempt.</p></div><CalendarDays size={25}/></div>
    <label className="sld-attempt-date"><span><CalendarDays size={15}/> Date I worked on this problem</span><input type="date" value={attemptDate} max={today} onChange={e=>setAttemptDate(e.target.value)}/><small>Backdate older attempts instead of falsely logging them today.</small></label>
    <div className="sld-editor-tabs" role="tablist" aria-label="Code notes"><button type="button" role="tab" aria-selected={editorTab==='my'} className={editorTab==='my'?'active':''} onClick={()=>setEditorTab('my')}><Code2 size={15}/> My Java attempt</button><button type="button" role="tab" aria-selected={editorTab==='reference'} className={editorTab==='reference'?'active':''} onClick={()=>setEditorTab('reference')}><FileCode2 size={15}/> Expected / reference solution</button></div>
    {editorTab==='my'?<CodeNotebook key={'my-'+chosen.id} label="My working Java solution" sub="Write or paste your current code before marking RED / YELLOW / GREEN. The editor autosaves, and each logged attempt keeps a snapshot of this code." value={record.workingCode||''} onChange={value=>changeRecord({workingCode:value})}/>:<CodeNotebook key={'reference-'+chosen.id} label="My reference / expected Java solution" sub="Paste a verified solution or an approach you want to study. It stays separate from your own attempt and does not change your grade." value={record.referenceCode||''} onChange={value=>changeRecord({referenceCode:value})}/>}
    <label className="sld-reflection"><span><NotebookPen size={15}/> My mistake / invariant / edge cases to remember</span><textarea value={record.notes||''} onChange={e=>changeRecord({notes:e.target.value.slice(0,3500)})} rows={4} placeholder="What went wrong? What did the two pointers mean? Which Java syntax will I review next time?"/></label>
    <div className="sld-rating-title"><strong>How did THIS attempt go?</strong><span>Click once to record the grade + chosen date + current code.</span></div>
    <div className="sld-ratings">{Object.entries(GRADE_DESCRIPTIONS).map(([grade,caption])=><button type="button" key={grade} className={'sld-rating '+grade} onClick={()=>saveAttempt(grade)}><strong>{grade.toUpperCase()}</strong><small>{caption}</small></button>)}</div>
    <div className="sld-next-review"><RefreshCcw size={17}/><div><strong>{dueLabel}</strong><small>{history.length} logged attempt{history.length===1?'':'s'} · {hasAttempt?'most recent '+displayDate(record.lastReviewed):'first try not yet logged'}. Reviews follow RED → tomorrow, YELLOW → 3 days, and GREEN/MOCK → 1, 3, 7, 14, 30, 60 days with advancing recall.</small></div></div>
    <section className="sld-history"><div className="sld-history-title"><div><History size={17}/><h4>Every attempt, every date</h4></div><span>{history.length} saved</span></div>
     {!history.length?<div className="sld-empty-history">Your first entry will appear here. Dates, grades, old code and reflections stay attached to each attempt so you can see improvement over time.</div>:
     [...history].reverse().map((event,i)=><div className="sld-history-item" key={event.id||i}><div className="sld-history-top"><div><GradePill grade={event.grade}/><strong>{displayDate(event.date)}</strong><small>{i===0?'Latest attempt':'Earlier attempt'}</small></div><button className="sld-delete" title="Delete this attempt" aria-label={'Delete attempt on '+event.date} onClick={()=>removeAttempt(event.id)}><Trash2 size={15}/></button></div>
      <div className="sld-history-edit"><label>Correct this date<input type="date" value={event.date} max={today} onChange={e=>modifyAttempt(event.id,{date:e.target.value})}/></label><label>Correct this grade<select value={event.grade} onChange={e=>modifyAttempt(event.id,{grade:e.target.value})}>{Object.keys(GRADE_DESCRIPTIONS).map(g=><option key={g} value={g}>{g.toUpperCase()}</option>)}</select></label></div>
      <details><summary>Code and reflection from this attempt <ChevronDown size={13}/></summary><label>My code snapshot<pre className="sld-code-snapshot">{event.code||'No code was saved with this attempt.'}</pre></label><label>My note for this attempt<textarea rows={3} value={event.notes||''} onChange={e=>modifyAttempt(event.id,{notes:e.target.value.slice(0,3500)})} placeholder="An important mistake, tricky test or better approach…"/></label></details>
     </div>)}
    </section>
    <p className="sld-local-note">✿ All code, tags, dates and attempts stay in this browser and are included in your SWE study backup. This editor highlights Java, but it does not execute or submit code to LeetCode.</p>
   </>:<div className="sld-no-results"><Search size={25}/><strong>Select a problem to study</strong><p>Adjust the filters or add your own problem.</p></div>}
  </main></div></div>;
}
