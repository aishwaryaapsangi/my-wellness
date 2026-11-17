import React, {useEffect, useMemo, useState} from 'react';
import './money-garden.css';
import LiveBankPanel from './LiveBankPanel.jsx';

const STORAGE = 'bloom-money-garden-v1';
const CATEGORIES = ['Groceries','Gas & transport','Coffee & dining','Shopping','Health & beauty','Subscriptions','Housing','Utilities','Student loans','Travel & fun','Other','Transfer / exclude'];
const VARIABLE = ['Groceries','Gas & transport','Coffee & dining','Shopping','Health & beauty','Travel & fun','Other'];
const DEFAULT = {
  version:1, income:{paycheck:0,cadence:'biweekly',otherMonthly:0},
  budgets:VARIABLE.map(name=>({name,limit:0})), bills:[], debts:[],
  goals:[{id:'emergency',name:'Emergency cushion',target:0,saved:0,monthly:0},{id:'home',name:'Dream home',target:0,saved:0,monthly:0},{id:'car',name:'Future car',target:0,saved:0,monthly:0},{id:'travel',name:'Travel adventures',target:0,saved:0,monthly:0}],
  transactions:[], rules:[], categoryOverrides:{}, paid:{}, savingsReserve:0
};
const dollars=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(n)||0);
const asNumber=v=>Math.max(0,Number(v)||0);
const uid=()=>Math.random().toString(36).slice(2,10);
const txnHash=input=>{let h=2166136261;for(let i=0;i<input.length;i++)h=Math.imul(h^input.charCodeAt(i),16777619);return 'tx-'+(h>>>0).toString(16).padStart(8,'0')};
const ymd=date=>{const d=new Date(date);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const monthLabel=m=>new Date(m+'-01T12:00:00').toLocaleDateString('en-US',{month:'long',year:'numeric'});
const startOfWeek=date=>{const d=new Date(date+'T12:00:00');d.setDate(d.getDate()-(d.getDay()+6)%7);return ymd(d)};
const numDays=m=>new Date(Number(m.slice(0,4)),Number(m.slice(5,7)),0).getDate();
const moneyInput=(value,onChange,extra={})=><input type="number" min="0" step=".01" value={value??0} onChange={e=>onChange(asNumber(e.target.value))} {...extra}/>;
const toMonthly=(value,cadence)=>asNumber(value)*(cadence==='weekly'?52/12:cadence==='biweekly'?26/12:cadence==='semimonthly'?2:1);
const asMonthlyBill=b=>asNumber(b.amount)*(b.cadence==='annual'?1/12:1);
function parseCSV(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}else cell+=c;}
  row.push(cell);if(row.some(x=>x.trim()))rows.push(row);return rows;
}
function normalizeDate(raw){
  const s=String(raw||'').trim();if(/^\d{4}-\d\d-\d\d/.test(s))return s.slice(0,10);
  const m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);return m?m[3]+'-'+m[1].padStart(2,'0')+'-'+m[2].padStart(2,'0'):null;
}
function inferCategory(name,primary,amount){
  const n=String(name||'').toLowerCase(),p=String(primary||'').toLowerCase();
  if(n.includes('the cubby')||n.includes('coffee cubby')||n.includes('starbucks')||n.includes('dunkin'))return 'Coffee & dining';
  if(n.includes('student loan')||n.includes('aidvantage')||n.includes('education loan')||n.includes('department of education')||n.includes('cri '))return 'Student loans';
  if(n.includes('zelle')||n.includes('venmo'))return 'Other';
  if(p==='transfers'||n.includes('payment from checking')||n.includes('transfer from checking')||n.includes('transfer to checking')||n.includes('credit card payment'))return 'Transfer / exclude';
  if(p==='groceries'||n.includes('stop & shop')||n.includes('whole foods')||n.includes('patel brothers'))return 'Groceries';
  if(p==='transportation'||n.includes('shell')||n.includes('exxon')||n.includes('fuel'))return 'Gas & transport';
  if(p==='dining_drinks'||n.includes('ubereats')||n.includes('uber eats')||n.includes('cafe'))return 'Coffee & dining';
  if(p==='shopping'||n.includes('amazon')||n.includes('target')||n.includes('tiktok shop'))return 'Shopping';
  if(p==='health_wellness'||n.includes('cvs')||n.includes('classpass'))return 'Health & beauty';
  if(p==='education')return 'Student loans';
  if(p==='housing')return 'Housing';
  if(p==='bills_utilities')return 'Utilities';
  if(p==='services'||p==='entertainment'||n.includes('spotify')||n.includes('chatgpt')||n.includes('apple services'))return 'Subscriptions';
  if(p==='travel')return 'Travel & fun';
  if(p==='income'||(amount>0&&n.includes('payroll')))return 'Income';
  return 'Other';
}
function applyRules(item,rules){
  for(const rule of rules||[]){
    if(rule.name&&String(item.name||'').toLowerCase().includes(String(rule.name).toLowerCase())&&
      (rule.amount==null||Math.abs(Math.abs(Number(item.amount))-Number(rule.amount))<0.015))return rule.category;
  }
  return item.category;
}
function parseTransactionsCSV(text,rules){
  const rows=parseCSV(text);const headerAt=rows.findIndex(r=>r.some(c=>/^(date|transaction date|posted date)$/i.test(c.trim()))&&r.some(c=>/^(amount|normalized_amount|description|name)$/i.test(c.trim())));
  if(headerAt<0)throw Error('Could not identify the date and amount columns. Export a transaction CSV, not an account summary.');
  const headers=rows[headerAt].map(s=>s.trim().toLowerCase().replace(/\s+/g,'_'));
  const get=(row,...keys)=>{for(const key of keys){const j=headers.indexOf(key);if(j>=0)return row[j]??''}return ''};
  const hasNormalized=headers.includes('normalized_amount'),hasPlaid=headers.includes('account_id');
  const out=[];
  for(const row of rows.slice(headerAt+1)){
    const date=normalizeDate(get(row,'date','transaction_date','posted_date'));if(!date)continue;
    const raw=get(row,'normalized_amount','amount');const n=Number(String(raw).replace(/[$,\s]/g,'').replace(/^\((.*)\)$/,'-$1'));
    if(!Number.isFinite(n)||n===0)continue;
    const signed=hasNormalized?n:hasPlaid?-n:n;
    const name=get(row,'name','description','merchant_name','transaction','payee')||'Unlabeled';
    const primary=get(row,'personal_finance_category_primary','category');
    const pending=get(row,'pending').toLowerCase()==='true';
    if(pending)continue;
    const category=inferCategory(name,primary,signed);
    const id=get(row,'transaction_id')?txnHash(get(row,'transaction_id')):[date,name,signed,get(row,'account_name','account')].join('|').toLowerCase();
    out.push({...{id,date,name,amount:Math.round(Math.abs(signed)*100)/100,type:signed>=0?'income':'expense',category,account:get(row,'account_name','account')||'',source:'import'},category:applyRules({name,amount:signed,category},rules)});
  }
  if(!out.length)throw Error('There were no usable posted transactions in that file.');
  return out;
}
function monthlyDebtEstimate(debt,extra=0){
  let balance=asNumber(debt.balance),rate=Number(debt.apr),payment=asNumber(debt.payment)+asNumber(extra);
  if(!Number.isFinite(rate)||rate<0||!balance||payment<=0)return null;
  const monthlyInterest=balance*rate/1200;if(payment<=monthlyInterest)return null;
  for(let m=1;m<=600;m++){balance=balance*(1+rate/1200)-payment;if(balance<=0)return m;}return null;
}
function initialize(){
  try{const saved=JSON.parse(localStorage.getItem(STORAGE));if(saved&&saved.version===1)return {...DEFAULT,...saved};}catch(e){}
  return structuredClone(DEFAULT);
}
export default function MoneyGarden(){
 const [data,setData]=useState(initialize);
 const [bankFeed,setBankFeed]=useState({connected:false,transactions:[],accounts:[],syncedAt:null});
 const [pane,setPane]=useState('overview');
 const [month,setMonth]=useState(()=>ymd(new Date()).slice(0,7));
 const [notice,setNotice]=useState('');
 const [newBill,setNewBill]=useState({name:'',amount:'',dueDay:'',category:'Other'});
 const [newTx,setNewTx]=useState({date:ymd(new Date()),name:'',amount:'',type:'expense',category:'Coffee & dining'});
 const [newGoal,setNewGoal]=useState({name:'',target:'',saved:'',monthly:''});
 const [newDebt,setNewDebt]=useState({name:'',balance:'',apr:'',payment:''});
 const [raise,setRaise]=useState(0);
 const [extraLoan,setExtraLoan]=useState(0);
 useEffect(()=>{try{localStorage.setItem(STORAGE,JSON.stringify(data))}catch(e){setNotice('Your browser could not save this data. Export a backup.')}},[data]);
 const update=(key,val)=>setData(s=>({...s,[key]:val}));
 const patchItem=(key,id,patch)=>setData(s=>({...s,[key]:(s[key]||[]).map(item=>item.id===id?{...item,...patch}:item)}));
 const removeItem=(key,id)=>{if(window.confirm('Remove this item?'))update(key,(data[key]||[]).filter(x=>x.id!==id))};
 const bankTransactions=useMemo(()=>bankFeed.transactions.map(raw=>{
  const signed=Number(raw.amount)||0,name=raw.merchant||raw.description||'Unlabeled';
  const category=signed<0&&raw.category_primary==='income'?'Income':inferCategory(name,raw.category_primary,-signed);
  const type=signed>=0?'expense':category==='Income'?'income':'refund';
  const id='bank:'+raw.id;
  return {id,date:raw.date,name,account:bankFeed.accounts.find(a=>a.id===raw.account_id)?.name||'Bank',amount:Math.abs(signed),category:(data.categoryOverrides||{})[id]||category,type,source:'linked',pending:!!raw.pending};
 }),[bankFeed.transactions,bankFeed.accounts,data.categoryOverrides]);
 const activityTransactions=bankFeed.connected?bankTransactions:data.transactions;
 const bankPaychecks=bankTransactions.filter(t=>t.type==='income'&&/fidelity|payroll|salary/i.test(t.name)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
 const detectedPaycheck=bankPaychecks.length?bankPaychecks.reduce((sum,t)=>sum+t.amount,0)/bankPaychecks.length:0;
 const averageMonthlyIncome=toMonthly(data.income.paycheck||detectedPaycheck,data.income.cadence)+asNumber(data.income.otherMonthly);
 const paycheck=asNumber(data.income.paycheck||detectedPaycheck);
 const pay=(data.income.cadence==='biweekly'?paycheck*2:data.income.cadence==='weekly'?paycheck*4:toMonthly(paycheck,data.income.cadence))+asNumber(data.income.otherMonthly);
 const hypothetical=pay*(1+raise/100);
 const billTotal=data.bills.reduce((sum,b)=>sum+asMonthlyBill(b),0);
 const goalsMonthly=data.goals.reduce((sum,g)=>sum+asNumber(g.monthly),0);
 const budgetTotal=data.budgets.reduce((sum,b)=>sum+asNumber(b.limit),0);
 const afterPlan=hypothetical-billTotal-goalsMonthly-budgetTotal-asNumber(data.savingsReserve);
 const monthTx=activityTransactions.filter(t=>t.date.slice(0,7)===month);
 const weekStart=startOfWeek(ymd(new Date()));
 const weekEnd=ymd(new Date(new Date(weekStart+'T12:00:00').getTime()+6*86400000));
 const spends=t=>(t.type==='expense'||t.type==='refund')&&t.category!=='Transfer / exclude'&&t.category!=='Income';
 const net=t=>t.type==='refund'?-asNumber(t.amount):asNumber(t.amount);
 const spendMonth=monthTx.filter(spends).reduce((s,t)=>s+net(t),0);
 const newestTransaction=activityTransactions.reduce((latest,t)=>t.date>latest?t.date:latest,'');
 const currentWeekHasData=!!newestTransaction&&newestTransaction>=weekStart;
 const spendingWeek=activityTransactions.filter(t=>t.date>=weekStart&&t.date<=weekEnd&&spends(t)).reduce((s,t)=>s+net(t),0);
 const variableSpent=monthTx.filter(t=>spends(t)&&VARIABLE.includes(t.category)).reduce((s,t)=>s+net(t),0);
 const weeklyTarget=budgetTotal*12/52;
 const currentDay=Number(ymd(new Date()).slice(-2));
 const daysLeft=Math.max(1,numDays(month)-currentDay+1);
 const remainingVariable=Math.max(0,budgetTotal-variableSpent);
 const dailyRemaining=month===ymd(new Date()).slice(0,7)?remainingVariable/daysLeft:budgetTotal/numDays(month);
 const alerts=[];
 if(activityTransactions.length&&variableSpent>budgetTotal&&budgetTotal>0)alerts.push('Variable spending is over the monthly plan by '+dollars(variableSpent-budgetTotal)+'.');
 if(currentWeekHasData&&spendingWeek>weeklyTarget&&weeklyTarget>0)alerts.push('This week is '+dollars(spendingWeek-weeklyTarget)+' above the average weekly envelope.');
 if(pay>0&&afterPlan<0)alerts.push('Your planned bills, budgets and goals exceed your modeled income by '+dollars(-afterPlan)+'.');
 if(data.bills.some(b=>!b.verified))alerts.push('Some bill due dates are estimates. Confirm them with the provider before relying on alerts.');
 const now=ymd(new Date());
 const billsByDue=[...data.bills].map(b=>{const day=Math.max(1,Math.min(31,Number(b.dueDay)||1));const year=Number(now.slice(0,4)),mo=Number(now.slice(5,7));let y=year,m=mo;
  if(b.cadence==='annual'){m=Math.max(1,Math.min(12,Number(b.dueMonth)||1));if(m<mo||(m===mo&&day<Number(now.slice(-2))))y++;}
  else if(day<Number(now.slice(-2))){m++;if(m===13){m=1;y++;}}
  const d=new Date(y,m-1,Math.min(day,new Date(y,m,0).getDate()));return {...b,next:ymd(d)};
 }).sort((a,b)=>a.next.localeCompare(b.next));
 const daysAhead=7;
 for(const b of billsByDue){const difference=Math.round((new Date(b.next+'T12:00:00')-new Date(now+'T12:00:00'))/86400000);if(difference>=0&&difference<=daysAhead&&b.verified&&!data.paid[b.id+'|'+b.next.slice(0,7)])alerts.push(b.name+' is scheduled for '+b.next+(b.autopay?' (autopay; confirm it processes).':'.'));}
 const formatDelta=n=>n>=0?dollars(n):'-'+dollars(-n);
 const exportJSON=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='money-garden-private-backup.json';a.click();URL.revokeObjectURL(url)};
 async function importJSON(file){try{const raw=JSON.parse(await file.text());if(!raw||raw.version!==1||!Array.isArray(raw.bills)||!Array.isArray(raw.transactions))throw Error('This is not a Money Garden backup or starter file.');if(data.transactions.length&&!window.confirm('Replace the current Money Garden data with this file?'))return;setData({...structuredClone(DEFAULT),...raw});setNotice('Your private starter data has been imported into this browser.');}catch(e){setNotice('Import error: '+e.message)}}
 async function importCSV(file){try{const incoming=parseTransactionsCSV(await file.text(),data.rules);setData(s=>{const map=new Map((s.transactions||[]).map(t=>[t.id,t]));incoming.forEach(t=>{if(!map.has(t.id))map.set(t.id,t)});return {...s,transactions:[...map.values()]}});setNotice('Imported '+incoming.length+' posted transactions. Review categorization and exclude transfers.');setPane('activity')}catch(e){setNotice('CSV import error: '+e.message)}}
 function addBill(){if(!newBill.name.trim()||!Number(newBill.amount)){setNotice('Add a bill name and amount first.');return}update('bills',[...data.bills,{id:uid(),name:newBill.name,amount:asNumber(newBill.amount),dueDay:Math.max(1,Math.min(31,Number(newBill.dueDay)||1)),category:newBill.category,autopay:false,verified:false,cadence:'monthly'}]);setNewBill({name:'',amount:'',dueDay:'',category:'Other'})}
 function addTx(){if(!newTx.name.trim()||!Number(newTx.amount)){setNotice('Add a merchant and amount.');return}update('transactions',[{...newTx,id:uid(),amount:asNumber(newTx.amount),source:'manual'},...data.transactions]);setNewTx({...newTx,name:'',amount:''})}
 function addGoal(){if(!newGoal.name.trim()){setNotice('Name your goal first.');return}update('goals',[...data.goals,{id:uid(),name:newGoal.name,target:asNumber(newGoal.target),saved:asNumber(newGoal.saved),monthly:asNumber(newGoal.monthly)}]);setNewGoal({name:'',target:'',saved:'',monthly:''})}
 function addDebt(){if(!newDebt.name.trim()){setNotice('Name the loan first.');return}update('debts',[...data.debts,{id:uid(),name:newDebt.name,balance:asNumber(newDebt.balance),payment:asNumber(newDebt.payment),apr:newDebt.apr===''?null:Number(newDebt.apr)}]);setNewDebt({name:'',balance:'',apr:'',payment:''})}
 const title=(head,sub)=><div className="mg-section-title"><h3>{head}</h3><p>{sub}</p></div>;
 return <section className="money-garden" aria-label="Money Garden personal budget">
  <div className="mg-hero"><div><span className="mg-kicker">✦ A KINDER KIND OF MONEY MANAGEMENT</span><h2>money <em>garden.</em> <span>✿</span></h2><p>Give every dollar a little purpose. Track the bills, nurture the dreams, and learn what your money is doing—without shame.</p></div><div className="mg-hero-flower" aria-hidden="true">✿<small>grow at your own pace</small></div></div>
  <div className="mg-privacy"><strong>🔒 Your spending deserves privacy.</strong> When configured, live banking data is read from your authenticated account and not stored in this public GitHub repository. Manual entries and category corrections are saved locally in this browser. Bank credentials never belong in website source code.</div>
  <LiveBankPanel onChange={setBankFeed}/>
  {data.starterNotes?.coverage&&<div className="mg-data-snapshot"><strong>✿ Imported starting snapshot:</strong> {data.starterNotes.coverage} The data does not update automatically; import a newer CSV when you want current spending.</div>}
  <div className="mg-controls"><nav className="mg-tabs" aria-label="Money Garden sections">{[['overview','Overview'],['activity','Spending diary'],['bills','Bill calendar'],['goals','Dream planner'],['settings','Setup & privacy']].map(([id,label])=><button key={id} type="button" className={pane===id?'mg-active':''} onClick={()=>setPane(id)}>{label}</button>)}</nav><label className="mg-month">Viewing <input type="month" value={month} onChange={e=>setMonth(e.target.value)} /></label></div>
  {notice&&<div className="mg-notice" role="status">{notice}<button aria-label="Dismiss notice" onClick={()=>setNotice('')}>×</button></div>}
  {pane==='overview'&&<div className="mg-stack">
    {title('Your money at a glance','Amounts are estimates from the setup you provide. Spending is measured only from imported or manually added transactions.')}
    <div className="mg-data-date">{newestTransaction?'Latest recorded transaction: '+newestTransaction+' · ':'No transactions imported · '}Your actual checking-account cash and remaining unpaid commitments still need confirmation for safe-to-spend advice.</div>
    <div className="mg-metrics">
     <article className="mg-metric"><span>Typical-month income for budgeting</span><strong>{dollars(pay)}</strong><small>{data.income.cadence==='biweekly'?'Two-paycheck month; third paychecks are extra':'Conservative regular-paycheck assumption'}</small></article>
     <article className="mg-metric"><span>Scheduled bills (monthly equivalent)</span><strong>{dollars(billTotal)}</strong><small>Includes your tracked loan autopay obligations</small></article>
     <article className="mg-metric"><span>Weekly variable allowance</span><strong>{dollars(weeklyTarget)}</strong><small>{currentWeekHasData?dollars(spendingWeek)+' recorded this week':'No current-week transactions imported'}</small></article>
     <article className="mg-metric"><span>{monthLabel(month)} recorded spending</span><strong>{activityTransactions.length?dollars(spendMonth):'No live data yet'}</strong><small>Excludes transfers and incoming money; includes loan payments</small></article>
    </div>
    {alerts.length>0&&<div className="mg-alerts"><strong>Little money nudges</strong>{alerts.map((a,i)=><p key={i}>✦ {a}</p>)}</div>}
    <div className="mg-two">
      <article className="mg-paper">{title('Your weekly envelopes','Track one category at a time. Weekly limits are monthly goals × 12 ÷ 52.')}
       <div className="mg-envelope-list">{data.budgets.map(b=>{const spent=monthTx.filter(t=>spends(t)&&t.category===b.name).reduce((s,t)=>s+net(t),0),lim=asNumber(b.limit);return <div className="mg-envelope" key={b.name}><div><span>{b.name}</span><b>{dollars(spent)} / {dollars(lim)}</b></div><div className="mg-track"><span className={spent>lim&&lim>0?'mg-over':''} style={{width:(lim?Math.min(100,100*spent/lim):0)+'%'}}/></div><small>{lim?dollars(lim*12/52)+' / week target':'Set a limit to begin'} {spent>lim&&lim>0?' · over by '+dollars(spent-lim):''}</small></div>})}</div>
      </article>
      <article className="mg-paper">{title('The bigger picture','These are planning buckets, not your spendable bank balance.')}
       <div className="mg-equation"><div><span>Modeled take-home income</span><b>{dollars(pay)}</b></div><div><span>Scheduled monthly bills</span><b>-{dollars(billTotal)}</b></div><div><span>Category spending plan</span><b>-{dollars(budgetTotal)}</b></div><div><span>Goals and savings contributions</span><b>-{dollars(goalsMonthly+asNumber(data.savingsReserve))}</b></div><div className="mg-result"><span>Unallocated in this plan</span><b>{formatDelta(afterPlan)}</b></div></div>
       <p className="mg-fine">Unallocated ≠ available to spend today. We still need a current cash check, outstanding bills and every recurring expense before setting safe purchase limits.</p>
       <div className="mg-mini-kpis"><div><small>Daily variable pace</small><b>{dollars(dailyRemaining)}</b></div><div><small>Week to date</small><b>{dollars(spendingWeek)}</b></div></div>
       <button type="button" className="mg-link-button" onClick={()=>setPane('settings')}>Adjust your income and plan →</button>
      </article>
    </div>
    <div className="mg-two"><article className="mg-paper">{title('Bills coming up','Unverified dates are estimates until you confirm them.')}<div className="mg-list">{billsByDue.slice(0,5).map(b=><div key={b.id} className="mg-list-row"><span><b>{b.name}</b><small>{b.next}{b.verified?'':' · confirm date'}{b.autopay?' · autopay':''}</small></span><strong>{dollars(b.amount)}</strong></div>)}{!billsByDue.length&&<p>Add your bills in the bill calendar.</p>}</div><button className="mg-link-button" onClick={()=>setPane('bills')}>See all bills →</button></article>
      <article className="mg-paper">{title('Your dream funds','Little contributions become visible progress.')}<div className="mg-list">{data.goals.slice(0,5).map(g=><div key={g.id}><div className="mg-list-row"><span><b>{g.name}</b><small>{asNumber(g.target)>0?Math.min(100,Math.round(100*asNumber(g.saved)/g.target))+'% saved':'Add a savings target'}</small></span><strong>{dollars(g.saved)}</strong></div><div className="mg-track"><span style={{width:(g.target?Math.min(100,100*asNumber(g.saved)/asNumber(g.target)):0)+'%'}}/></div></div>)}</div><button className="mg-link-button" onClick={()=>setPane('goals')}>Plan your dreams →</button></article></div>
  </div>}
  {pane==='activity'&&<div className="mg-stack">
    {title('Spending diary','Every payment can have a real purpose. Imports stay in this browser; you can fix merchant categories yourself.')}
    <div className="mg-paper"><div className="mg-toolbar"><label className="mg-upload" style={bankFeed.connected?{display:'none'}:undefined}>Import a CSV statement <input type="file" accept=".csv,text/csv" onChange={e=>{if(e.target.files?.[0])importCSV(e.target.files[0]);e.target.value=''}}/></label><span>{bankFeed.connected?activityTransactions.length+' linked bank transactions (read only)':data.transactions.length+' locally stored transactions'}</span></div><p className="mg-fine">{bankFeed.connected?'Transactions refresh from your private banking backend; bank data is never committed to GitHub. Corrections here are local to this browser.':'Until automatic banking is configured, only locally imported or manually logged transactions can appear here.'} Accepts transaction CSV files with Date and Amount columns, including the Finances export format. Pending charges are skipped when identified. Own-account transfers and credit-card payments should be marked “Transfer / exclude.” Review categories after each import.</p>
     {!bankFeed.connected&&<div className="mg-add-grid"><input aria-label="Merchant" placeholder="Merchant / what was it?" value={newTx.name} onChange={e=>setNewTx(s=>({...s,name:e.target.value}))}/><input aria-label="Amount" type="number" min="0" step=".01" placeholder="Amount" value={newTx.amount} onChange={e=>setNewTx(s=>({...s,amount:e.target.value}))}/><input aria-label="Date" type="date" value={newTx.date} onChange={e=>setNewTx(s=>({...s,date:e.target.value}))}/><select aria-label="Transaction category" value={newTx.category} onChange={e=>setNewTx(s=>({...s,category:e.target.value}))}>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select><select aria-label="Money direction" value={newTx.type} onChange={e=>setNewTx(s=>({...s,type:e.target.value}))}><option value="expense">Expense</option><option value="income">Income</option></select><button className="mg-btn" onClick={addTx}>+ Add transaction</button></div>}
    </div>
    <div className="mg-paper">{title(monthLabel(month)+' ledger','Only posted transactions you have imported or logged are included.')}<div className="mg-table-scroll"><table className="mg-table"><thead><tr><th>Date</th><th>Merchant</th><th>Category · editable</th><th>Amount</th><th></th></tr></thead><tbody>{[...monthTx].sort((a,b)=>b.date.localeCompare(a.date)).map(t=><tr key={t.id}><td>{t.date.slice(5)}</td><td><strong>{t.name}</strong><small>{t.account||t.source||''}</small></td><td><select aria-label={'Category for '+t.name} value={t.category} onChange={e=>bankFeed.connected?update('categoryOverrides',{...(data.categoryOverrides||{}),[t.id]:e.target.value}):patchItem('transactions',t.id,{category:e.target.value})}>{[...CATEGORIES,'Income'].map(x=><option key={x}>{x}</option>)}</select></td><td className={t.type==='income'?'mg-positive':''}>{t.type==='income'||t.type==='refund'?'+':'-'}{dollars(t.amount)}</td><td>{!bankFeed.connected&&<button className="mg-x" onClick={()=>removeItem('transactions',t.id)} aria-label={'Remove '+t.name}>×</button>}</td></tr>)}{!monthTx.length&&<tr><td colSpan="5">No transactions for this month yet. Connect a bank above to start automatic syncing.</td></tr>}</tbody></table></div></div>
  </div>}
  {pane==='bills'&&<div className="mg-stack">
    {title('Your bill calendar','Autopay is not the same as confirmed paid. Check due dates and payments with each provider.')}
    <div className="mg-paper"><div className="mg-table-scroll"><table className="mg-table"><thead><tr><th>Bill / loan</th><th>Amount</th><th>Due day</th><th>Frequency</th><th>Autopay</th><th>Date verified</th><th>Paid {month}</th><th></th></tr></thead><tbody>{data.bills.map(b=><tr key={b.id}><td><input aria-label="Bill name" value={b.name} onChange={e=>patchItem('bills',b.id,{name:e.target.value})}/>{b.note&&<small className="mg-bill-note">{b.note}</small>}</td><td>{moneyInput(b.amount,v=>patchItem('bills',b.id,{amount:v}),{'aria-label':'Bill amount'})}</td><td><input type="number" min="1" max="31" aria-label="Due day of month" value={b.dueDay||''} onChange={e=>patchItem('bills',b.id,{dueDay:Math.max(1,Math.min(31,Number(e.target.value)||1))})}/></td><td><select aria-label="Frequency" value={b.cadence||'monthly'} onChange={e=>patchItem('bills',b.id,{cadence:e.target.value})}><option value="monthly">Monthly</option><option value="annual">Yearly</option></select>{b.cadence==='annual'&&<input aria-label="Annual due month" type="number" min="1" max="12" value={b.dueMonth||1} onChange={e=>patchItem('bills',b.id,{dueMonth:Number(e.target.value)||1})}/>}</td><td><input type="checkbox" checked={!!b.autopay} aria-label={'Autopay '+b.name} onChange={e=>patchItem('bills',b.id,{autopay:e.target.checked})}/></td><td><input type="checkbox" checked={!!b.verified} aria-label={'Verified date for '+b.name} onChange={e=>patchItem('bills',b.id,{verified:e.target.checked})}/></td><td><input type="checkbox" checked={!!data.paid[b.id+'|'+month]} aria-label={'Mark '+b.name+' paid for '+month} onChange={e=>update('paid',{...data.paid,[b.id+'|'+month]:e.target.checked})}/></td><td><button className="mg-x" onClick={()=>removeItem('bills',b.id)} aria-label={'Remove '+b.name}>×</button></td></tr>)}</tbody></table></div>
    <div className="mg-add-grid"><input aria-label="New bill name" placeholder="New bill name" value={newBill.name} onChange={e=>setNewBill(s=>({...s,name:e.target.value}))}/><input type="number" min="0" step=".01" aria-label="New bill amount" placeholder="Monthly amount" value={newBill.amount} onChange={e=>setNewBill(s=>({...s,amount:e.target.value}))}/><input type="number" min="1" max="31" aria-label="New bill due day" placeholder="Day of month" value={newBill.dueDay} onChange={e=>setNewBill(s=>({...s,dueDay:e.target.value}))}/><select aria-label="New bill category" value={newBill.category} onChange={e=>setNewBill(s=>({...s,category:e.target.value}))}>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select><button className="mg-btn" onClick={addBill}>+ Add bill</button></div>
    </div><div className="mg-two"><article className="mg-paper">{title('Upcoming due dates','Based on scheduled day of month, not payment verification.')}<div className="mg-list">{billsByDue.slice(0,12).map(b=><div key={b.id} className="mg-list-row"><span><b>{b.name}</b><small>{b.next} · {b.autopay?'Autopay scheduled':'Manual payment'}{!b.verified?' · date unverified':''}</small></span><strong>{dollars(b.amount)}</strong></div>)}</div></article>
    <article className="mg-paper">{title('Loan payoff laboratory','Estimates are illustrative—not a servicer payoff quote.')}<p className="mg-fine">Annual rates must be known to calculate a payoff. Your actual loans may accrue interest daily, be grouped differently, or have changing payments.</p><label className="mg-slider">What if I pay an EXTRA <b>{dollars(extraLoan)}</b> each month toward the highest-APR loan with a known interest rate?<input type="range" min="0" max="2000" step="25" value={extraLoan} onChange={e=>setExtraLoan(Number(e.target.value))}/></label><div className="mg-list">{data.debts.map(d=><div key={d.id} className="mg-debt"><div className="mg-list-row"><b>{d.name}</b><button className="mg-x" onClick={()=>removeItem('debts',d.id)} aria-label={'Remove '+d.name}>×</button></div><div className="mg-debt-fields"><label>Balance{moneyInput(d.balance,v=>patchItem('debts',d.id,{balance:v}))}</label><label>APR %<input aria-label={'APR for '+d.name} type="number" min="0" step=".01" value={d.apr??''} placeholder="Unknown" onChange={e=>patchItem('debts',d.id,{apr:e.target.value===''?null:Number(e.target.value)})}/></label><label>Required / mo{moneyInput(d.payment,v=>patchItem('debts',d.id,{payment:v}))}</label></div><small>{d.apr==null?'Add the interest rate for a payoff estimate':monthlyDebtEstimate(d,extraLoan>0&&Number(d.apr)===Math.max(...data.debts.map(x=>Number(x.apr)||0))?extraLoan:0)?'Modeled payoff: approximately '+monthlyDebtEstimate(d,extraLoan>0&&Number(d.apr)===Math.max(...data.debts.map(x=>Number(x.apr)||0))?extraLoan:0)+' months':'Payment may not cover interest, or a term cannot be estimated'}</small></div>)}</div><div className="mg-add-grid"><input placeholder="Loan name" aria-label="Loan name" value={newDebt.name} onChange={e=>setNewDebt(s=>({...s,name:e.target.value}))}/><input type="number" min="0" step=".01" placeholder="Balance" aria-label="Loan balance" value={newDebt.balance} onChange={e=>setNewDebt(s=>({...s,balance:e.target.value}))}/><input type="number" min="0" step=".01" placeholder="APR % (optional)" aria-label="Loan APR" value={newDebt.apr} onChange={e=>setNewDebt(s=>({...s,apr:e.target.value}))}/><input type="number" min="0" step=".01" placeholder="Monthly minimum" aria-label="Loan monthly minimum" value={newDebt.payment} onChange={e=>setNewDebt(s=>({...s,payment:e.target.value}))}/><button className="mg-btn" onClick={addDebt}>+ Add loan</button></div></article></div>
  </div>}
  {pane==='goals'&&<div className="mg-stack">
   {title('Your dream planner','A trip, a car, a beautiful home—it all starts with a realistic savings habit.')}
   <div className="mg-goal-grid">{data.goals.map(g=>{const target=asNumber(g.target),saved=asNumber(g.saved),monthly=asNumber(g.monthly),remaining=Math.max(0,target-saved),months=monthly>0?Math.ceil(remaining/monthly):null;return <article className="mg-paper" key={g.id}><div className="mg-goal-title"><input aria-label="Goal title" value={g.name} onChange={e=>patchItem('goals',g.id,{name:e.target.value})}/><button className="mg-x" onClick={()=>removeItem('goals',g.id)} aria-label={'Remove '+g.name}>×</button></div><div className="mg-progress-ring">{target?Math.min(100,Math.round(100*saved/target)):0}%<small>saved</small></div><div className="mg-track"><span style={{width:(target?Math.min(100,100*saved/target):0)+'%'}}/></div><div className="mg-goal-fields"><label>Dream amount{moneyInput(g.target,v=>patchItem('goals',g.id,{target:v}))}</label><label>Saved already{moneyInput(g.saved,v=>patchItem('goals',g.id,{saved:v}))}</label><label>Monthly contribution{moneyInput(g.monthly,v=>patchItem('goals',g.id,{monthly:v}))}</label></div><p className="mg-fine">{remaining<=0&&target>0?'Goal reached!':months!=null&&target>0?'About '+months+' months at this contribution, before interest or investment returns.':'Set a target and monthly contribution to see a timeline.'}</p></article>})}</div><div className="mg-paper">{title('Plant another dream','Your goals are editable as your career and priorities change.')}<div className="mg-add-grid"><input placeholder="Goal name" aria-label="New goal name" value={newGoal.name} onChange={e=>setNewGoal(s=>({...s,name:e.target.value}))}/><input type="number" min="0" placeholder="Target $" aria-label="New goal target" value={newGoal.target} onChange={e=>setNewGoal(s=>({...s,target:e.target.value}))}/><input type="number" min="0" placeholder="Already saved $" aria-label="New goal savings" value={newGoal.saved} onChange={e=>setNewGoal(s=>({...s,saved:e.target.value}))}/><input type="number" min="0" placeholder="Monthly $" aria-label="New goal contribution" value={newGoal.monthly} onChange={e=>setNewGoal(s=>({...s,monthly:e.target.value}))}/><button className="mg-btn" onClick={addGoal}>+ Add a goal</button></div></div>
  </div>}
  {pane==='settings'&&<div className="mg-stack">
    {title('Set up your money garden','All settings are editable. Initial values should reflect your real take-home pay, not salary before taxes.')}
    <div className="mg-two"><article className="mg-paper">{title('Paycheck and income','Calculate annualized take-home rather than assuming every month has the same number of paydays.')}<div className="mg-field"><label>Take-home per paycheck{moneyInput(data.income.paycheck,v=>update('income',{...data.income,paycheck:v}))}</label></div><div className="mg-field"><label>Pay schedule<select value={data.income.cadence} onChange={e=>update('income',{...data.income,cadence:e.target.value})}><option value="biweekly">Every 2 weeks (26/year)</option><option value="semimonthly">Twice monthly</option><option value="weekly">Every week</option><option value="monthly">Once monthly</option></select></label></div><div className="mg-field"><label>Other recurring monthly take-home{moneyInput(data.income.otherMonthly,v=>update('income',{...data.income,otherMonthly:v}))}</label></div><div className="mg-mini-kpis"><div><small>Normal budgeting month</small><b>{dollars(pay)}</b></div><div><small>Annualized workday equivalent</small><b>{dollars(averageMonthlyIncome*12/260)}</b></div></div><p className="mg-fine">For biweekly pay, this plan uses only two checks per normal month. Annualized average monthly take-home is {dollars(averageMonthlyIncome)}; treat occasional third paychecks as extras, not recurring spending money. Workday earnings are an average allocation, not a literal daily paycheck.</p></article>
     <article className="mg-paper">{title('What if you get promoted?','A scenario, not a prediction or a promise of a raise.')}<label className="mg-slider">Hypothetical increase to NET income: <b>{raise}%</b><input type="range" min="0" max="50" step="1" value={raise} onChange={e=>setRaise(Number(e.target.value))}/></label><div className="mg-mini-kpis"><div><small>Modeled monthly income</small><b>{dollars(hypothetical)}</b></div><div><small>Unallocated after plan</small><b>{formatDelta(afterPlan)}</b></div></div><p className="mg-fine">Gross raises don't translate directly into net raises. This illustrates what an actual take-home increase could change.</p><div className="mg-field"><label>Additional monthly buffer (unallocated emergency reserve){moneyInput(data.savingsReserve,v=>update('savingsReserve',v))}</label></div></article></div>
    <div className="mg-paper">{title('Monthly category budgets','These are your proposed limits. Adjust them after reviewing real spending.')}<div className="mg-budget-grid">{data.budgets.map(b=><label key={b.name}>{b.name}{moneyInput(b.limit,v=>update('budgets',data.budgets.map(x=>x.name===b.name?{...x,limit:v}:x)))}</label>)}</div><p className="mg-fine">Budgeted variable spending: {dollars(budgetTotal)} per month · {dollars(weeklyTarget)} per week.</p></div>
    <div className="mg-paper">{title('Private import and backup','Import the personalized starter file from this chat. Nothing is sent to a server by this tab.')}<div className="mg-upload-row"><label className="mg-upload">Import Money Garden starter / backup JSON <input type="file" accept=".json,application/json" onChange={e=>{if(e.target.files?.[0])importJSON(e.target.files[0]);e.target.value=''}}/></label><button className="mg-btn mg-outline" onClick={exportJSON}>Download private backup</button><button className="mg-btn mg-danger" onClick={()=>{if(window.confirm('Erase every Money Garden entry stored in this browser? Download a backup first.')){setData(structuredClone(DEFAULT));setNotice('Local Money Garden data cleared.')}}}>Erase local Money Garden data</button></div><p className="mg-fine">LocalStorage is not encryption. Clearing browser data removes your tracker. Backups contain personal financial information and should be stored privately. Your Bloom & Balance checklist data is kept separately.</p></div>
    <div className="mg-paper">{title('Real bank connection and notifications','Understand the difference between a browser tracker and your connected Finances account.')}<p>This public GitHub Pages site cannot safely hold Bank of America or Plaid tokens, nor can it automatically email or text you when you exceed a limit. To update transactions here, import a new CSV or manually log expenses. For connected-account insights, open <a href="https://chatgpt.com/finances" target="_blank" rel="noreferrer">ChatGPT Finances ↗</a>. In-app banners appear when recorded spending exceeds a budget; they are not automatic phone or email notifications.</p></div>
  </div>}
 </section>;
}
