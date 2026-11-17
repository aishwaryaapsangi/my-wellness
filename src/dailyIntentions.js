// Pure helpers keep personal intention entries date-scoped and safe for old backups.
export const DEFAULT_INTENTION={feeling:'',intention:'',notes:'',todos:[]};
export function normalizeIntention(raw){
 const source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 return {
  feeling:typeof source.feeling==='string'?source.feeling:'',
  intention:typeof source.intention==='string'?source.intention:'',
  notes:typeof source.notes==='string'?source.notes:'',
  todos:Array.isArray(source.todos)?source.todos.filter(t=>t&&typeof t.id==='string').map(t=>({
    id:t.id,text:typeof t.text==='string'?t.text:'',done:!!t.done
  })):[]
 };
}
export function setIntentionForDate(all,date,patch){
 const current=normalizeIntention(all?.[date]);
 return {...(all||{}),[date]:{...current,...patch}};
}
export function addIntentionTodo(all,date,text,id){
 const clean=String(text??'').trim().slice(0,180);
 if(!clean)return all||{};
 if(!id||typeof id!=='string')throw new Error('Each todo needs an ID');
 const current=normalizeIntention(all?.[date]);
 return setIntentionForDate(all,date,{todos:[...current.todos,{id,text:clean,done:false}]});
}
export function changeIntentionTodo(all,date,id,patch){
 const current=normalizeIntention(all?.[date]);
 return setIntentionForDate(all,date,{todos:current.todos.map(todo=>todo.id===id?{...todo,...patch}:todo)});
}
export function removeIntentionTodo(all,date,id){
 const current=normalizeIntention(all?.[date]);
 return setIntentionForDate(all,date,{todos:current.todos.filter(todo=>todo.id!==id)});
}
