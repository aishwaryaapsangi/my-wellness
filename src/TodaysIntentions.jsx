import React,{useState} from 'react';
import {Sunrise,Sparkles,Plus,Trash2,LockKeyhole,ListTodo,Heart,Check} from 'lucide-react';
import {normalizeIntention} from './dailyIntentions.js';
import './todays-intentions.css';

export default function TodaysIntentions({date,value,onChange,onAddTodo,onUpdateTodo,onRemoveTodo}){
 const [draft,setDraft]=useState('');
 const day=normalizeIntention(value);
 const finished=day.todos.filter(t=>t.done).length;
 const formatted=new Date(date+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
 function add(e){
  e.preventDefault();
  const text=draft.trim();
  if(!text)return;
  onAddTodo(text);
  setDraft('');
 }
 return <section className="intentions-card" aria-labelledby="intentions-title">
  <div className="intentions-tape" aria-hidden="true"/>
  <header className="intentions-head">
   <div>
    <div className="intentions-overline"><Sunrise size={15}/> BEFORE THE DAY UNFOLDS · {formatted}</div>
    <h2 id="intentions-title">today, i'd like to <em>bloom.</em> <span aria-hidden="true">✿</span></h2>
    <p>Set a gentle intention, leave yourself a note, and make space for the little things that matter.</p>
   </div>
   <div className="intentions-sticker" aria-hidden="true"><span>✿</span><small>my little<br/>morning page</small></div>
  </header>
  <div className="intentions-grid">
   <div className="intentions-writing">
    <label className="intentions-field">
     <span><Sparkles size={15}/> How I want to feel today</span>
     <input type="text" maxLength={120} value={day.feeling}
      onChange={e=>onChange({feeling:e.target.value})}
      placeholder="grounded, confident, peaceful, excited…"/>
    </label>
    <label className="intentions-field">
     <span><Sunrise size={15}/> My intention for today</span>
     <textarea rows={4} maxLength={1800}
      value={day.intention} onChange={e=>onChange({intention:e.target.value})}
      placeholder="Today I want to show up with kindness, stay present, make progress on one thing, and enjoy the little moments…"/>
    </label>
    <label className="intentions-field intentions-last-field">
     <span><Heart size={15}/> Little reminders & anything on my mind</span>
     <textarea rows={2} maxLength={1200}
      value={day.notes} onChange={e=>onChange({notes:e.target.value})}
      placeholder="Something I'm looking forward to, a reminder to myself, a thought I don't want to forget…"/>
    </label>
   </div>
   <div className="intentions-todo-area">
    <div className="intentions-todo-heading">
     <div><ListTodo size={18}/><strong>my little to-dos</strong></div>
     <span className="intentions-count">{finished}/{day.todos.length} done</span>
    </div>
    <p className="intentions-todo-intro">Personal plans and one-off reminders, separate from your everyday rituals.</p>
    {day.todos.length>0&&<div className="intentions-progress" role="progressbar" aria-label="Personal to-do completion" aria-valuenow={finished} aria-valuemin={0} aria-valuemax={day.todos.length}><span style={{width:(finished/day.todos.length*100)+'%'}}/></div>}
    <div className="intentions-todo-list">
     {day.todos.map(todo=><div className={'intentions-todo'+(todo.done?' is-done':'')} key={todo.id}>
      <label className="intentions-check">
       <input type="checkbox" checked={todo.done} onChange={e=>onUpdateTodo(todo.id,{done:e.target.checked})} aria-label={'Complete '+(todo.text||'personal task')}/>
       <span aria-hidden="true"><Check size={13}/></span>
      </label>
      <input className="intentions-todo-text" type="text" maxLength={180}
       aria-label="Edit personal to-do" value={todo.text}
       onChange={e=>onUpdateTodo(todo.id,{text:e.target.value})}/>
      <button type="button" className="intentions-remove" onClick={()=>onRemoveTodo(todo.id)} aria-label={'Remove '+(todo.text||'personal task')} title="Remove this to-do"><Trash2 size={15}/></button>
     </div>)}
     {day.todos.length===0&&<div className="intentions-empty"><span aria-hidden="true">✎</span><p>A tiny list, a big breath. Add anything you'd like to remember.</p></div>}
    </div>
    <form className="intentions-add-form" onSubmit={add}>
     <label className="sr-only" htmlFor={'intentions-add-'+date}>New personal to-do</label>
     <input id={'intentions-add-'+date} maxLength={180} type="text"
      placeholder="e.g. call a friend, finish a ticket…" value={draft}
      onChange={e=>setDraft(e.target.value)}/>
     <button type="submit" disabled={!draft.trim()} aria-label="Add personal to-do"><Plus size={18}/><span>Add</span></button>
    </form>
    <div className="intentions-todo-footer">✿ these are yours to edit, check off, or remove whenever you like.</div>
   </div>
  </div>
  <footer className="intentions-foot"><span><LockKeyhole size={14}/> Private on this device · automatically saved for {formatted}</span><span className="intentions-foot-flower" aria-hidden="true">❀ &nbsp; ♡ &nbsp; ✿</span></footer>
 </section>;
}
