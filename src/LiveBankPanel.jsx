import React,{useCallback,useEffect,useRef,useState} from 'react';
import {createClient} from '@supabase/supabase-js';
import './live-bank.css';

const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const client=url&&key?createClient(url,key,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}}):null;
const STORAGE='money-garden-plaid-link-token';

const importPlaid=()=>new Promise((resolve,reject)=>{
 if(window.Plaid?.create)return resolve(window.Plaid);
 const existing=document.getElementById('mg-plaid-sdk');
 if(existing){existing.addEventListener('load',()=>resolve(window.Plaid),{once:true});existing.addEventListener('error',()=>reject(Error('Unable to load Plaid Link')),{once:true});return}
 const script=document.createElement('script');script.id='mg-plaid-sdk';script.src='https://cdn.plaid.com/link/v2/stable/link-initialize.js';script.async=true;
 script.onload=()=>resolve(window.Plaid);script.onerror=()=>reject(Error('Unable to load Plaid Link'));document.head.appendChild(script);
});
async function fetchBankRows(userId){
 if(!client||!userId)return {accounts:[],transactions:[]};
 const [{data:accounts,error:accError},{data:transactions,error:txError}]=await Promise.all([
   client.from('money_bank_accounts').select('id,name,mask,kind,current_balance,available_balance,updated_at').order('name'),
   client.from('money_bank_transactions').select('id,account_id,date,merchant,description,amount,category_primary,category_detailed,pending,updated_at').order('date',{ascending:false}).limit(1000)
 ]);
 if(accError)throw accError;if(txError)throw txError;
 return {accounts:accounts||[],transactions:transactions||[]};
}
export default function LiveBankPanel({onChange}){
 const [user,setUser]=useState(null);
 const [email,setEmail]=useState('');
 const [status,setStatus]=useState('');
 const [working,setWorking]=useState(false);
 const [accounts,setAccounts]=useState([]);
 const busy=useRef(false);
 const load=useCallback(async(u)=>{
  if(!client||!u){setAccounts([]);onChange({connected:false,transactions:[],accounts:[],syncedAt:null});return}
  const rows=await fetchBankRows(u.id);
  setAccounts(rows.accounts);
  const syncedAt=rows.accounts.reduce((latest,a)=>a.updated_at>latest?a.updated_at:latest,'');
  onChange({connected:rows.accounts.length>0,transactions:rows.transactions,accounts:rows.accounts,syncedAt});
 },[onChange]);
 useEffect(()=>{
  if(!client){onChange({connected:false,transactions:[],accounts:[],syncedAt:null});return}
  let live=true;
  client.auth.getUser().then(async({data})=>{if(!live)return;setUser(data.user||null);try{await load(data.user||null)}catch(e){if(live)setStatus(e.message)}}).catch(e=>{if(live)setStatus(e.message)});
  const {data:subscription}=client.auth.onAuthStateChange((_event,session)=>{if(!live)return;setUser(session?.user||null);setTimeout(()=>{if(live)load(session?.user||null).catch(e=>setStatus(e.message))},0)});
  return ()=>{live=false;subscription.subscription.unsubscribe()};
 },[load]);
 const emailSignIn=async(e)=>{e.preventDefault();if(!client)return;setWorking(true);setStatus('');try{
   const {error}=await client.auth.signInWithOtp({email,emailRedirectTo:window.location.origin+window.location.pathname});if(error)throw error;
   setStatus('Check your email for a secure sign-in link. You will return to Money Garden once signed in.');
 }catch(err){setStatus(err.message)}finally{setWorking(false)}};
 const refresh=async()=>{if(!client||!user||busy.current)return;busy.current=true;setWorking(true);try{
  const {data,error}=await client.functions.invoke('bank-api',{body:{action:'sync'}});if(error)throw error;
  if(data?.error)throw Error(data.error);
  await load(user);setStatus('Bank data refreshed. Your changes will also sync on the server schedule after the backend is configured.');
 }catch(e){setStatus('Refresh failed: '+e.message)}finally{busy.current=false;setWorking(false)}};
 const exchange=async(token)=>{const {data,error}=await client.functions.invoke('bank-api',{body:{action:'exchange',public_token:token}});if(error)throw error;if(data?.error)throw Error(data.error);return data};
 const connect=async()=>{
  if(!client||!user||busy.current)return;busy.current=true;setWorking(true);setStatus('');
  try{
   await importPlaid();
   const {data,error}=await client.functions.invoke('bank-api',{body:{action:'link'}});
   if(error)throw error;if(!data?.link_token)throw Error(data?.error||'Unable to start a secure bank connection');
   sessionStorage.setItem(STORAGE,data.link_token);
   const handler=window.Plaid.create({token:data.link_token,onSuccess:async(publicToken)=>{
    try{setWorking(true);const result=await exchange(publicToken);sessionStorage.removeItem(STORAGE);await load(user);setStatus(result?.sync_pending?'Bank account linked. Plaid is preparing the initial transaction history; use Refresh to check when it becomes available.':'Bank accounts linked. The available posted transactions are displayed below.')}
    catch(e){setStatus('Linking failed: '+e.message)}
    finally{busy.current=false;setWorking(false)}
   },onExit:(err)=>{if(err)setStatus('Bank authorization stopped: '+(err.display_message||err.error_message||'Please retry'));busy.current=false;setWorking(false)}});
   handler.open();setWorking(false);
  }catch(e){setStatus(e.message);busy.current=false;setWorking(false)}
 };
 // Complete Plaid OAuth redirect on desktop/mobile when Plaid brings the user back.
 useEffect(()=>{
  if(!client||!user||!window.location.search.includes('oauth_state_id='))return;
  const token=sessionStorage.getItem(STORAGE);if(!token)return;
  let cancelled=false;
  importPlaid().then(()=>{if(cancelled)return;const handler=window.Plaid.create({token,receivedRedirectUri:window.location.href,onSuccess:async(publicToken)=>{try{await exchange(publicToken);sessionStorage.removeItem(STORAGE);await load(user);setStatus('Bank account connected.')}catch(e){setStatus(e.message)}}});handler.open()}).catch(e=>setStatus(e.message));
  return ()=>{cancelled=true};
 },[user,load]);
 if(!client)return <div className="mg-live-setup"><strong><span aria-hidden="true">🔒</span> Automatic bank sync: setup required</strong><p>This website is public, so it cannot reuse the private Bank of America connection in ChatGPT. A protected Supabase backend and a separately authorized Plaid connection are needed before live transactions can appear here. No bank credentials are stored in GitHub.</p><a href="https://chatgpt.com/finances" target="_blank" rel="noreferrer">View your already connected bank data in Finances ↗</a></div>;
 return <div className="mg-live-panel">
   <div className="mg-live-head"><div><strong>✿ Private bank connection</strong><p>Authenticated data · provided by Plaid · no CSV imports needed once linked</p></div>{user&&<button className="mg-live-signout" onClick={async()=>{await client.auth.signOut();setStatus('Signed out');}}>Sign out</button>}</div>
   {!user?<form className="mg-live-auth" onSubmit={emailSignIn}><label htmlFor="mg-live-email">Email for your private Money Garden login</label><input id="mg-live-email" type="email" required autoComplete="email" value={email} placeholder="Your private email" onChange={e=>setEmail(e.target.value)}/><button className="mg-btn" disabled={working} type="submit">Email me a secure sign-in link</button></form>:
    <div className="mg-live-actions">
     <span>Signed in · {accounts.length?accounts.map(a=>a.name+(a.mask?' ••'+a.mask:'')).join(', '):'no bank accounts linked'}</span>
     <button className="mg-btn" type="button" disabled={working} onClick={connect}>{working?'Working…':accounts.length?'Link another bank':'Securely connect Bank of America'}</button>
     {accounts.length>0&&<button className="mg-btn mg-outline" type="button" disabled={working} onClick={refresh}>Refresh transactions</button>}
    </div>}
   {status&&<div className="mg-live-status" role="status">{status}</div>}
   <p className="mg-live-fine">The website can read only your own authenticated transactions. Bank access tokens remain encrypted on the server. Transactions sync daily once the scheduled backend job is configured. Direct bank linking requires a separate authorization from ChatGPT Finances.</p>
  </div>
}
