import React,{useMemo,useState,useEffect} from 'react';
import {PieChart,Pie,Cell,Tooltip,ResponsiveContainer,BarChart,Bar,XAxis,YAxis,CartesianGrid,Legend} from 'recharts';
import './money-deep-dive.css';

const STORE='money-garden-private-deep-dive-v1';
const COLORS=['#7ea99f','#d49ab0','#f2bd83','#8caed4','#b09dc8','#d4bd9a','#8fbdba','#e0a5a0','#96a77c','#c7a6c1','#b0bcc9','#b99486','#d2b1a1'];
const USD=v=>Number(v||0).toLocaleString('en-US',{style:'currency',currency:'USD'});
const pretty=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const n=v=>Math.max(0,Number(v)||0);
const toDate=m=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+m);return d.toLocaleString('en-US',{month:'short',year:'numeric'})};
const DEFAULT_CATS=['Coffee','Delivery','Restaurants / food out','Groceries','Shopping','Beauty / grooming','Medical / pharmacy','Transportation','Subscriptions','Entertainment','Other / review','Fees','Housing','Utilities','Internet','Rent','Student loans'];
const FIXED=['Student loans','Rent','Utilities','Internet'];
const initial=()=>{try{const x=JSON.parse(localStorage.getItem(STORE));return x?.format==='money-garden-private-v1'?x:null}catch{return null}};
function calculate(loans,criExtra,otherExtra,includeElectronic,electronic,allocation){
 const states=loans.map(x=>({...x,left:n(x.balance),paidAt:null,interest:0,paid:0}));
 let totalInterest=0,month=0,history=[],invalid=states.some(x=>!Number.isFinite(Number(x.apr))||x.apr===null||x.apr===''||n(x.minimum)<=0);
 if(invalid)return {invalid:true,reason:'Enter the interest rate and monthly minimum for every loan to calculate a combined payoff date.'};
 if(!states.length)return {invalid:true,reason:'Add your loan balances and APRs first.'};
 for(let i=1;i<=600;i++){
  if(!states.some(x=>x.left>0.005))break;
  month=i;
  for(const s of states){if(s.left<=0)continue;const charge=s.left*n(s.apr)/1200;s.left+=charge;s.interest+=charge;totalInterest+=charge}
  // Base minimums are applied to each live loan first. Extra goes to selected priority group.
  for(const s of states){if(s.left<=0)continue;const p=Math.min(s.left,n(s.minimum));s.left-=p;s.paid+=p;if(s.left<=0.005){s.left=0;s.paidAt=i}}
  // Redirect completed loans' former minimums (snowball), preserving total monthly effort.
  const freed=states.filter(x=>x.left===0&&x.paidAt<i).reduce((a,x)=>a+n(x.minimum),0);
  let budget=n(criExtra)+n(otherExtra)+(includeElectronic?n(electronic):0)+freed;
  let guard=0;
  while(budget>0.005&&states.some(x=>x.left>0)&&guard++<20){
    const live=states.filter(x=>x.left>0);
    let chosen=live.find(x=>x.id===allocation);
    if(!chosen)chosen=[...live].sort((a,b)=>n(b.apr)-n(a.apr))[0];
    const p=Math.min(chosen.left,budget);
    chosen.left-=p;chosen.paid+=p;budget-=p;
    if(chosen.left<=.005){chosen.left=0;chosen.paidAt=i}
  }
  history.push({month:i,label:i%12===0?i/12+' yr':i+' mo',balance:Math.round(states.reduce((s,x)=>s+x.left,0))});
 }
 return {invalid:false,months:month,interest:totalInterest,loans:states,history,unpaid:states.some(x=>x.left>0.005)};
}
function dateAfter(months){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+months);return d.toLocaleDateString('en-US',{month:'long',year:'numeric'})}
export default function MoneyDeepDive(){
 const [snapshot,setSnapshot]=useState(initial);
 const [notice,setNotice]=useState('');
 const [section,setSection]=useState('spending');
 const [period,setPeriod]=useState('all');
 const [excluded,setExcluded]=useState(true);
 const [selected,setSelected]=useState(null);
 const [search,setSearch]=useState('');
 const [day,setDay]=useState('');
 const [overrides,setOverrides]=useState({});
 const [criExtra,setCriExtra]=useState(null);
 const [otherExtra,setOtherExtra]=useState(0);
 const [electronic,setElectronic]=useState(false);
 const [allocation,setAllocation]=useState('cri-ab');
 const [loanEdits,setLoanEdits]=useState({});
 const [budget,setBudget]=useState({});
 useEffect(()=>{try{if(snapshot)localStorage.setItem(STORE,JSON.stringify(snapshot))}catch{setNotice('Storage is blocked. Import a backup next time.')}},[snapshot]);
 async function importPrivate(file){
  try{
   if(!file)return;
   const data=JSON.parse(await file.text());
   if(data.format!=='money-garden-private-v1'||!Array.isArray(data.transactions)||!Array.isArray(data.loans))throw Error('Please select a Money Garden private snapshot JSON.');
   if(data.transactions.length>10000)throw Error('Too many transactions.');
   setSnapshot(data);setSelected(null);setDay('');setSearch('');setOverrides({});setLoanEdits({});setCriExtra(null);setElectronic(false);setBudget({});
   setNotice('Loaded '+data.transactions.length+' dated transactions privately in this browser. No financial data was sent to GitHub.');
  }catch(err){setNotice('Import failed: '+err.message)}
 }
 const rows=useMemo(()=>snapshot?.transactions?.map((x,i)=>({...x,id:x.id||String(i),category:overrides[x.id]||x.category,amount:Number(x.amount)}))||[],[snapshot,overrides]);
 const allMonths=['all',...new Set(rows.map(x=>x.date?.slice(0,7)).filter(Boolean))].sort((a,b)=>a==='all'?-1:b==='all'?1:a.localeCompare(b));
 const eligible=useMemo(()=>rows.filter(x=>(period==='all'||x.date.startsWith(period))&&(!excluded||!FIXED.includes(x.category))),[rows,period,excluded]);
 const groups=useMemo(()=>{const totals={};eligible.forEach(x=>{totals[x.category]=(totals[x.category]||0)+x.amount});return Object.entries(totals).filter(x=>x[1]>0.005).map(([name,value])=>({name,value:Math.round(value*100)/100,count:eligible.filter(x=>x.category===name).length})).sort((a,b)=>b.value-a.value)},[eligible]);
 const total=eligible.reduce((s,x)=>s+x.amount,0);
 const drill=eligible.filter(x=>(!selected||selected===x.category)&&(!day||day===x.date)&&(!search||[x.merchant,x.account,x.category,x.date].join(' ').toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>b.date.localeCompare(a.date)||b.amount-a.amount);
 const daily=Object.entries(eligible.reduce((a,x)=>{a[x.date]=(a[x.date]||0)+x.amount;return a},{})).sort((a,b)=>a[0].localeCompare(b[0])).map(([date,value])=>({date:date.slice(5),full:date,total:+value.toFixed(2)}));
 const loans=(snapshot?.loans||[]).map(x=>({...x,...loanEdits[x.id]}));
 const activeExtra=criExtra===null?n(snapshot?.criExtra):criExtra;
 const result=calculate(loans,activeExtra,otherExtra,electronic,snapshot?.monthlyElectronic,allocation);
 const criOnly=calculate(loans.filter(x=>x.category==='CRI'),activeExtra,0,electronic,snapshot?.monthlyElectronic,allocation);
 const standard=calculate(loans,0,0,false,0,allocation);
 function changeLoan(id,key,value){setLoanEdits(s=>({...s,[id]:{...s[id],[key]:value===''?null:Number(value)}}))}
 function downloadBackup(){if(!snapshot)return;const blob=new Blob([JSON.stringify({...snapshot,loans:loans,criExtra:activeExtra,otherExtra,monthlyElectronicEnabled:electronic,categoryOverrides:overrides},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='money-garden-private-backup.json';a.click();URL.revokeObjectURL(url)}
 return <div className="mdd">
  <div className="mdd-header"><div><span className="mg-kicker">✧ TWO WAYS TO SEE YOUR MONEY</span><h3>your money, under the magnifying glass</h3><p>Click any spending slice to see the individual dates, merchants and amounts. Adjust loan payments to explore possible payoff paths.</p></div><div className="mdd-actions"><label className="mdd-upload">Import private snapshot<input type="file" accept=".json,application/json" onChange={e=>{importPrivate(e.target.files?.[0]);e.target.value=''}}/></label>{snapshot&&<button onClick={downloadBackup}>Export private backup</button>}</div></div>
  <div className="mdd-privacy">🔒 Your personal transactions and loan balances are <b>not embedded in the public website</b>. Import a private snapshot on your own device; the browser stores it locally. Do not import on a shared device. Clear the private snapshot when finished.</div>
  {notice&&<p className="mdd-note" role="status">{notice}</p>}
  {!snapshot?<div className="mdd-empty"><h4>Start with your private October–November snapshot</h4><p>Download the private JSON file from our ChatGPT conversation, then select <strong>Import private snapshot</strong>. This public website cannot access your ChatGPT Finances connection directly. You can explore both dashboards once imported.</p><p>Nothing is uploaded to the GitHub repository or sent to a server by this importer.</p></div>:<>
  <div className="mdd-toolbar"><button className={section==='spending'?'active':''} onClick={()=>setSection('spending')}>Spending explorer</button><button className={section==='loans'?'active':''} onClick={()=>setSection('loans')}>Loan payoff lab</button><button className="mdd-clear" onClick={()=>{if(window.confirm('Clear private snapshot from this browser?')){localStorage.removeItem(STORE);setSnapshot(null)}}}>Clear imported data</button></div>
  {section==='spending'&&<>
    <div className="mdd-controls"><label>Month <select value={period} onChange={e=>{setPeriod(e.target.value);setSelected(null);setDay('')}}>{allMonths.map(m=><option key={m} value={m}>{m==='all'?'Oct + Nov combined':new Date(m+'-01T12:00:00').toLocaleString('en-US',{month:'long',year:'numeric'})}</option>)}</select></label><label><input type="checkbox" checked={excluded} onChange={e=>{setExcluded(e.target.checked);setSelected(null)}}/> Hide rent, loans, internet & utilities</label><label>Search transactions<input value={search} placeholder="Merchant, date, category..." onChange={e=>setSearch(e.target.value)}/></label></div>
    <div className="mdd-stats"><div><span>Visible net spending</span><strong>{USD(total)}</strong><small>{period==='all'?'Oct 1 – Nov 22, 2026':period} · posted and reconciled</small></div><div><span>Recorded entries</span><strong>{eligible.length}</strong><small>Refunds lower spending</small></div><div><span>Selected category</span><strong>{selected||'All categories'}</strong><small>Click a slice, or choose a category below</small></div></div>
    <div className="mdd-chart-grid"><div className="mdd-panel"><h4>Where it went</h4><div className="mdd-pie"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={groups} dataKey="value" nameKey="name" innerRadius={75} outerRadius={119} paddingAngle={2} onClick={v=>{setSelected(s=>s===v.name?null:v.name);setDay('')}}>{groups.map((x,i)=><Cell key={x.name} fill={COLORS[i%COLORS.length]} stroke={selected===x.name?'#344b55':'#fff'} strokeWidth={selected===x.name?4:2}/>)}</Pie><Tooltip formatter={v=>USD(v)}/></PieChart></ResponsiveContainer></div><div className="mdd-legend">{groups.map((x,i)=><button className={selected===x.name?'active':''} key={x.name} onClick={()=>{setSelected(v=>v===x.name?null:x.name);setDay('')}}><i style={{background:COLORS[i%COLORS.length]}}/ ><span>{x.name} <small>{x.count} entries</small></span><strong>{USD(x.value)}</strong></button>)}</div></div>
    <div className="mdd-panel"><h4>Daily spending · click any bar</h4><div style={{width:'100%',height:330}}><ResponsiveContainer><BarChart data={daily} margin={{top:10,right:5,bottom:65,left:4}}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" interval={Math.max(0,Math.floor(daily.length/11))} angle={-40} textAnchor="end" height={80} tick={{fontSize:11}}/><YAxis tickFormatter={v=>'$'+v} width={65}/><Tooltip formatter={v=>USD(v)}/><Bar dataKey="total" fill="#88a9a3" radius={[5,5,0,0]} onClick={v=>setDay(current=>current===v.full?'':v.full)}/></BarChart></ResponsiveContainer></div>{day&&<button className="mdd-reset" onClick={()=>setDay('')}>Showing {pretty(day)} · clear day filter ×</button>}<div className="mdd-help">A purchase's posting date may differ from the day you made it. November only covers the supplied records through November 22.</div></div></div>
    <div className="mdd-panel"><div className="mdd-ledger-head"><div><h4>Every transaction, by date</h4><p>{drill.length} matching entries. Click the pie or a daily bar to filter; change a category in its row to correct merchant labels.</p></div><button onClick={()=>{setSelected(null);setDay('');setSearch('')}}>Clear filters</button></div><div className="mdd-table-scroll"><table><thead><tr><th>Date</th><th>Merchant / payee</th><th>Category</th><th>Account</th><th className="mdd-number">Amount</th></tr></thead><tbody>{drill.map(x=><tr key={x.id}><td>{pretty(x.date)}</td><td>{x.merchant}{x.note&&<small>{x.note}</small>}</td><td><select aria-label={'Category for '+x.merchant+' '+x.date} value={x.category} onChange={e=>setOverrides(old=>({...old,[x.id]:e.target.value}))}>{[...new Set([...DEFAULT_CATS,x.category])].map(v=><option key={v}>{v}</option>)}</select></td><td>{x.account}</td><td className="mdd-number">{USD(x.amount)}</td></tr>)}</tbody></table></div>{!drill.length&&<p>No matching entries.</p>}</div>
    <div className="mdd-help">Totals include the transactions in your imported private snapshot only. They do not automatically refresh. The separate $178.58 CRI electronic transactions are not included because their funding source is unverified. Do not count card payments or transfers twice.</div>
  </>}
  {section==='loans'&&<>
   <div className="mdd-loan-warning">Loan calculations are illustrations, not official payoff quotes. CRI shows <strong>$907.65 regular + $1,268.94 extra = $2,176.59 Auto Debit on the 2nd</strong>. The additional $178.58 electronic payment is not assumed recurring unless you explicitly enable it. Amounts and APRs are editable.</div>
   <div className="mdd-panel"><h4>Loan groups and interest rates</h4><div className="mdd-table-scroll"><table><thead><tr><th>Loan</th><th>Balance</th><th>APR (%)</th><th>Required monthly</th></tr></thead><tbody>{loans.map(x=><tr key={x.id}><td><strong>{x.name}</strong><small>{x.note}</small></td><td><input aria-label={x.name+' balance'} type="number" min="0" step=".01" value={x.balance??''} onChange={e=>changeLoan(x.id,'balance',e.target.value)}/></td><td><input aria-label={x.name+' APR'} type="number" min="0" max="35" step=".01" placeholder="Enter rate" value={x.apr??''} onChange={e=>changeLoan(x.id,'apr',e.target.value)}/></td><td><input aria-label={x.name+' minimum'} type="number" min="0" step=".01" value={x.minimum??''} onChange={e=>changeLoan(x.id,'minimum',e.target.value)}/></td></tr>)}</tbody></table></div><p className="mdd-help">Aidvantage includes seven loans with potentially different rates. Entering one rate models the seven as a blended hypothetical. For a precise result, they would need to be separated and their individual APRs entered.</p></div>
   <div className="mdd-controls mdd-loan-controls"><label>Extra monthly principal, above CRI's $907.65<select value={allocation} onChange={e=>setAllocation(e.target.value)}>{loans.map(x=><option value={x.id} key={x.id}>{x.name} first</option>)}</select></label><label className="mdd-wide">Extra CRI payment: <b>{USD(activeExtra)}</b><input type="range" min="0" max="2400" step="25" value={activeExtra} onChange={e=>setCriExtra(+e.target.value)}/><input type="number" min="0" step=".01" value={activeExtra} onChange={e=>setCriExtra(n(e.target.value))}/></label><label>Other extra per month<input type="number" min="0" step="10" value={otherExtra} onChange={e=>setOtherExtra(n(e.target.value))}/></label><label className="mdd-electronic"><input type="checkbox" checked={electronic} onChange={e=>setElectronic(e.target.checked)}/> Include separate {USD(snapshot.monthlyElectronic)} electronic CRI payment? (not confirmed recurring)</label></div>
   <div className="mdd-stats"><div><span>Required combined monthly</span><strong>{USD(loans.reduce((s,x)=>s+n(x.minimum),0))}</strong><small>CRI + Aidvantage</small></div><div><span>Modeled total monthly</span><strong>{USD(loans.reduce((s,x)=>s+n(x.minimum),0)+activeExtra+otherExtra+(electronic?n(snapshot.monthlyElectronic):0))}</strong><small>Until payoff; then roll freed payments forward</small></div><div><span>Estimated paid off</span><strong>{result.invalid?'Need APRs':result.unpaid?'Over 50 years':dateAfter(result.months)}</strong><small>Simple monthly interest model</small></div></div>
   {result.invalid?<div className="mdd-empty"><h4>CRI estimate: {!criOnly.invalid&&!criOnly.unpaid?dateAfter(criOnly.months):'Enter CRI APRs'}</h4><p>{result.reason} The CRI-only illustration uses the two known CRI groups, their minimums and the extra amount above. {!criOnly.invalid?'Modeled interest remaining on CRI: '+USD(criOnly.interest)+'.':''} Enter the Aidvantage rates to estimate the full combined payoff.</p></div>:<><div className="mdd-chart-grid"><div className="mdd-panel"><h4>Estimated balances over time</h4><div style={{height:300}}><ResponsiveContainer><BarChart data={result.history.filter((x,i)=>i%3===0||i===result.history.length-1)}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month" tick={{fontSize:11}}/><YAxis tickFormatter={v=>'$'+Math.round(v/1000)+'k'}/><Tooltip formatter={v=>USD(v)}/><Bar dataKey="balance" name="Remaining balance" fill="#7ea99f"/></BarChart></ResponsiveContainer></div></div><div className="mdd-panel"><h4>Payoff estimates by loan</h4>{result.loans.map(x=><div className="mdd-payoff" key={x.id}><strong>{x.name}</strong><span>{x.paidAt?dateAfter(x.paidAt):'Over 50 years'}</span><small>Modeled interest {USD(x.interest)}</small></div>)}<hr/><p>Total modeled remaining interest: <strong>{USD(result.interest)}</strong></p>{!standard.invalid&&!standard.unpaid&&<p>Compared with minimum-only payments, the current modeled plan saves about <strong>{USD(standard.interest-result.interest)}</strong> in interest, subject to the model assumptions.</p>}</div></div></>}
   <div className="mdd-help">This simplified avalanche model treats balances as today’s starting amounts, applies APR/12 monthly, pays each loan's minimum then targets extra money at the selected loan and next-highest APR, and rolls freed minimums into the remaining loans. Real daily interest, statement timing, borrower benefits, and servicer allocation rules can change results. Confirm the employer match and emergency savings before increasing payments.</div>
  </>}
  </>}
 </div>;
}
