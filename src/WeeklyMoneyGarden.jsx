import React,{useMemo,useState} from 'react';
import './WeeklyMoneyGarden.css';

const WEEK_CATS=[
{id:'groceries',label:'Groceries',limit:275,icon:'🥑'},
{id:'fuel',label:'Gas',limit:140,icon:'⛽'},
{id:'dining',label:'Eating out & delivery',limit:100,icon:'🍜'},
{id:'coffee',label:'Coffee shop',limit:65,icon:'☕'},
{id:'brows',label:'Eyebrows',limit:44,icon:'🎀'},
{id:'lash',label:'Lash lift',limit:115,icon:'✧',everyOther:true},
{id:'drain',label:'Lymphatic drainage',limit:90,icon:'🌿',everyOther:true},
{id:'shopping',label:'Shopping + household refills',limit:100,icon:'🛍️'},
{id:'medical',label:'Medical & pharmacy',limit:100,icon:'🩹'},
{id:'fitness',label:'Fitness',limit:20,icon:'💪'},
{id:'subscriptions',label:'Subscriptions',limit:49.22,icon:'🎧'},
{id:'fun',label:'Entertainment',limit:35,icon:'🎟️'},
{id:'misc',label:'Miscellaneous + parking',limit:40,icon:'✿'}
];
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n||0);
const parse=k=>new Date(k+'T12:00:00');
const fmt=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const plus=(k,n)=>{const d=parse(k);d.setDate(d.getDate()+n);return fmt(d)};
const start=(k)=>plus(k,-parse(k).getDay());
const endOfMonth=m=>m+'-'+String(new Date(+m.slice(0,4),+m.slice(5),0).getDate()).padStart(2,'0');
const intersectDays=(a,b,m)=>{const x=Math.max(parse(a).getTime(),parse(m+'-01').getTime()),y=Math.min(parse(b).getTime(),parse(endOfMonth(m)).getTime());return Math.max(0,Math.round((y-x)/86400000)+1)};
const monthWeeks=m=>{let w=start(m+'-01');const last=endOfMonth(m),out=[];while(w<=last){out.push({start:w,end:plus(w,6)});w=plus(w,7)}return out};
const inMonth=(t,m)=>t.date?.slice(0,7)===m;
const classify=t=>{
  const p=String(t.category||'').toLowerCase(),n=String(t.name||'').toLowerCase();
  if(p==='transfer / exclude'||p==='income'||p==='housing'||p==='utilities'||p==='student loans')return null;
  if(/cubby|starbucks|dunkin|coffee/.test(n))return 'coffee';
  if(/threading|eyebrow/.test(n))return 'brows';
  if(/lash lift/.test(n))return 'lash';
  if(/lymphatic|drainage/.test(n))return 'drain';
  if(/classpass/.test(n))return null;
  if(/planet fitness/.test(n))return 'fitness';
  if(/cvs|pharmacy|dermatolog|medical/.test(n))return 'medical';
  if(/shell|exxon|mobil|sunoco|gas station/.test(n))return 'fuel';
  if(/uber eats|ubereats|doordash|restaurant|chipotle|taco|pizza/.test(n))return 'dining';
  if(/spotify|openai|chatgpt|apple services|icloud/.test(n))return 'subscriptions';
  if(p==='groceries')return 'groceries';
  if(p==='gas & transport')return 'fuel';
  if(p==='shopping')return 'shopping';
  if(p==='coffee & dining')return 'dining';
  if(p==='health & beauty')return null;
  if(p==='subscriptions')return 'subscriptions';
  if(p==='travel & fun')return 'fun';
  if(p==='other')return 'misc';
  return null;
};
const STORAGE='bloom-weekly-budgets-v2';
const initial=()=>{try{const x=JSON.parse(localStorage.getItem(STORAGE));if(x&&Array.isArray(x.rows))return x}catch(e){}return {rows:WEEK_CATS.map(x=>({id:x.id,limit:x.limit})),overrides:{},entries:[]}};
export default function WeeklyMoneyGarden({month,transactions=[]}){
 const [state,setState]=useState(initial);
 const [weekIndex,setWeekIndex]=useState(null);
 const [entry,setEntry]=useState({date:fmt(new Date()),name:'',amount:'',category:'coffee'});
 const [expanded,setExpanded]=useState(null);
 const [notice,setNotice]=useState('');
 const currentMonth=month||fmt(new Date()).slice(0,7);
 const weeks=useMemo(()=>monthWeeks(currentMonth),[currentMonth]);
 const today=fmt(new Date());
 const autoIndex=weeks.findIndex(w=>today>=w.start&&today<=w.end);
 const validIndex=weekIndex===null?Math.max(0,autoIndex):Math.min(weekIndex,weeks.length-1);
 const week=weeks[validIndex];
 const persist=next=>{setState(next);try{localStorage.setItem(STORAGE,JSON.stringify(next))}catch(e){setNotice('Could not save locally. Check browser storage settings.')}};
 const budget=cat=>{
  if(cat.everyOther && (+currentMonth.slice(0,4)*12 + +currentMonth.slice(5) - (2026*12+11))%2!==0)return 0;
  if(cat.id==='shopping' && currentMonth==='2026-11' && !state.overrides['shopping:2026-11'])return 350;
  return Number(state.overrides[cat.id+':'+currentMonth]??state.rows.find(x=>x.id===cat.id)?.limit??cat.limit);
 };
 const monthly=useMemo(()=>[...transactions.map(t=>({...t,categoryId:classify(t),origin:'tracker'})),...state.entries.map(t=>({...t,categoryId:t.category,origin:'weekly'}))].filter(t=>inMonth(t,currentMonth)&&t.categoryId),[transactions,state.entries,currentMonth]);
 const amount=t=>t.type==='refund'?-Number(t.amount||0):t.type==='income'?0:Number(t.amount||0);
 const monthTotal=WEEK_CATS.reduce((s,c)=>s+budget(c),0);
 const spent=monthly.reduce((s,t)=>s+amount(t),0);
 const weekSpend=monthly.filter(t=>t.date>=week.start&&t.date<=week.end).reduce((s,t)=>s+amount(t),0);
 const remaining=Math.max(0,monthTotal-spent);
 const monthDays=intersectDays(currentMonth+'-01',endOfMonth(currentMonth),currentMonth);
 const weekDays=intersectDays(week.start,week.end,currentMonth);
 const totals=WEEK_CATS.map(c=>{
  const b=budget(c),tx=monthly.filter(t=>t.categoryId===c.id);
  const before=tx.filter(t=>t.date<week.start).reduce((s,t)=>s+amount(t),0);
  const during=tx.filter(t=>t.date>=week.start&&t.date<=week.end).reduce((s,t)=>s+amount(t),0);
  const monthSpent=tx.reduce((s,t)=>s+amount(t),0);
  const daysRemaining=intersectDays(week.start,endOfMonth(currentMonth),currentMonth);
  const allowance=daysRemaining?Math.max(0,b-before)*weekDays/daysRemaining:0;
  return {...c,b,monthSpent,before,during,allowance,left:allowance-during,monthlyLeft:b-monthSpent};
 });
 const overspent=totals.filter(x=>x.monthlyLeft<-.005);
 const add=e=>{
  e.preventDefault();
  if(!entry.date.startsWith(currentMonth)){setNotice('Choose a purchase date inside the selected month.');return}
  const n=Number(entry.amount);
  if(!(n>0)){setNotice('Enter a positive amount including tax and tip.');return}
  const row={id:'weekly-'+Date.now(),date:entry.date,name:entry.name.trim()||'Manual purchase',amount:Math.round(n*100)/100,type:'expense',category:entry.category};
  persist({...state,entries:[...state.entries,row]});setNotice('Purchase recorded; weekly allowances recalculated.');setEntry({...entry,name:'',amount:''});
 };
 const setLimit=(id,n)=>persist({...state,overrides:{...state.overrides,[id+':'+currentMonth]:Math.max(0,Number(n)||0)}});
 const dateLabel=k=>parse(k).toLocaleDateString('en-US',{month:'short',day:'numeric'});
 return <section className="week-garden" aria-label="Weekly Money Garden">
  <header className="week-hero"><div><p className="week-kicker">✿ THE LITTLE MONEY GARDEN</p><h3>tiny budgets, <em>big blooms.</em></h3><p>Choose your week, track your little purchases, and let your allowances grow with you.</p></div><div className="week-hero-doodle" aria-hidden="true">☁️<span>🌷</span><i>✦</i></div></header>
  <div className="week-stats"><article><small>monthly plan</small><b>{money(monthTotal)}</b></article><article><small>logged this month</small><b>{money(spent)}</b></article><article><small>remaining</small><b className={spent>monthTotal?'week-red':''}>{money(remaining)}</b></article></div>
  <p className="week-caption">Monthly targets are editable drafts. Data comes from the existing Money Garden spending diary plus entries added here. This is not a live bank feed unless you've configured the secure connection.</p>
  <div className="week-picker"><div><p className="week-kicker">YOUR WEEKLY ENVELOPES</p><h4>{parse(currentMonth+'-01').toLocaleDateString('en-US',{month:'long',year:'numeric'})}</h4></div><div className="week-chip-list" role="group" aria-label="Choose a week">{weeks.map((w,i)=><button key={w.start} className={i===validIndex?'week-selected':''} onClick={()=>setWeekIndex(i)}>Week {i+1}<small>{dateLabel(w.start)}–{dateLabel(w.end)}</small></button>)}</div></div>
  <div className="week-intro"><div><b>{dateLabel(week.start)} – {dateLabel(week.end)}</b><small>{weekDays} day{weekDays!==1?'s':''} in this month · {money(weekSpend)} logged in this week</small></div><span className="week-tag">Sunday → Saturday</span></div>
  {overspent.length>0&&<div className="week-alert" role="alert">✦ {overspent.length} monthly categor{overspent.length===1?'y is':'ies are'} over budget. Future weekly allowances decrease automatically. Essential expenses are not reduced without your approval.</div>}
  <div className="week-grid">{totals.map(c=><article className={'week-envelope '+(c.left<-.005?'week-over':'')} key={c.id}><div className="week-envelope-head"><span className="week-envelope-icon">{c.icon}</span><div><strong>{c.label}</strong><small>{c.everyOther&&c.b===0?'No appointment planned this month':'Monthly plan '+money(c.b)}</small></div><button aria-label={'Edit '+c.label+' budget'} title="Edit monthly budget" onClick={()=>setExpanded(expanded===c.id?null:c.id)}>✎</button></div><div className="week-envelope-values"><div><small>Week allowance</small><b>{money(c.allowance)}</b></div><div><small>Spent</small><b>{money(c.during)}</b></div><div><small>Left this week</small><b className={c.left<0?'week-red':''}>{money(c.left)}</b></div></div><div className="week-meter"><span style={{width:Math.min(100,c.allowance>0?c.during/c.allowance*100:c.during>0?100:0)+'%'}}/></div><p className="week-balance">Month remaining: <b className={c.monthlyLeft<0?'week-red':''}>{money(c.monthlyLeft)}</b></p>{expanded===c.id&&<label className="week-edit">Monthly target ($)<input type="number" min="0" step=".01" value={c.b} onChange={e=>setLimit(c.id,e.target.value)}/></label>}</article>)}</div>
  <section className="week-form-panel"><div><p className="week-kicker">LITTLE PURCHASES ADD UP</p><h4>Log a purchase ✿</h4><p>Record the final amount including tax and tip. Pick the exact category and your weekly limits update immediately.</p></div><form onSubmit={add}><label>Date<input required type="date" value={entry.date} onChange={e=>setEntry({...entry,date:e.target.value})}/></label><label>Category<select value={entry.category} onChange={e=>setEntry({...entry,category:e.target.value})}>{WEEK_CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label><label>Merchant or note<input value={entry.name} onChange={e=>setEntry({...entry,name:e.target.value})} placeholder="Reese's latte at The Cubby"/></label><label>Final amount ($)<input type="number" step=".01" min=".01" required value={entry.amount} onChange={e=>setEntry({...entry,amount:e.target.value})} placeholder="7.35"/></label><button type="submit">✿ Add purchase</button></form></section>
  {notice&&<p className="week-message" role="status">{notice}</p>}
  <details className="week-history"><summary>View or remove manually logged weekly purchases ({state.entries.filter(t=>inMonth(t,currentMonth)).length})</summary>{state.entries.filter(t=>inMonth(t,currentMonth)).map(t=><div key={t.id}><span>{t.date} · {t.name} · {money(t.amount)}</span><button onClick={()=>persist({...state,entries:state.entries.filter(x=>x.id!==t.id)})}>Remove</button></div>)}<p>Imported bank transactions should be edited in the Spending Diary. Avoid logging the same purchase twice.</p></details>
  <div className="week-goals"><div><span>🛡️</span><b>Emergency Fund</b><small>Goal: $10,000 · first milestone $1,000</small></div><div><span>🚗</span><b>Tesla Fund</b><small>Goal: $50,000 · saving for the full cash purchase</small></div></div>
  <p className="week-caption">Safety note: a positive budget remainder is not proof of money available for savings. Confirm bank cash and upcoming bills before moving money. This public website stores manual entries in this browser only, not in GitHub.</p>
 </section>;
}
