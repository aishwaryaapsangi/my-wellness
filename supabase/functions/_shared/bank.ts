import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const getEnv=(name:string)=>{const val=Deno.env.get(name);if(!val)throw new Error("Missing server secret: "+name);return val};
export const admin=()=>createClient(getEnv("SUPABASE_URL"),getEnv("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false,autoRefreshToken:false}});
export const origin=()=>getEnv("MONEY_GARDEN_ORIGIN");
export function cors(req:Request){
 const allowed=origin(),caller=req.headers.get("origin")||"";
 return {"Access-Control-Allow-Origin":caller===allowed?caller:allowed,"Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"authorization,apikey,x-client-info,content-type,x-cron-secret","Vary":"Origin","Content-Type":"application/json"};
}
export function json(req:Request,data:unknown,status=200){return new Response(JSON.stringify(data),{status,headers:cors(req)})}
export async function userFromRequest(req:Request){
 const token=(req.headers.get("authorization")||"").replace(/^Bearer\s+/i,"");
 if(!token)throw new Error("Please sign in first");
 const client=createClient(getEnv("SUPABASE_URL"),getEnv("SUPABASE_ANON_KEY"),{auth:{persistSession:false}});
 const {data,error}=await client.auth.getUser(token);
 if(error||!data.user)throw new Error("Invalid or expired login. Please sign in again.");
 const allowed=getEnv("MONEY_GARDEN_ALLOWED_EMAIL").toLowerCase();
 if((data.user.email||"").toLowerCase()!==allowed)throw new Error("This private Money Garden is limited to its owner.");
 return data.user;
}
export async function plaid(endpoint:string,body:Record<string,unknown>){
 const environment=getEnv("PLAID_ENV");
 if(!["production","sandbox"].includes(environment))throw Error("PLAID_ENV must be production or sandbox.");
 const base=environment==="production"?"https://production.plaid.com":"https://sandbox.plaid.com";
 const response=await fetch(base+"/"+endpoint.replace(/^\//,""),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...body,client_id:getEnv("PLAID_CLIENT_ID"),secret:getEnv("PLAID_SECRET")})});
 const result=await response.json();
 if(!response.ok)throw new Error("Plaid "+endpoint+": "+String(result.error_message||result.error_code||"request failed"));
 return result;
}
const b64=(bytes:Uint8Array)=>btoa(Array.from(bytes,x=>String.fromCharCode(x)).join(""));
const unb64=(text:string)=>Uint8Array.from(atob(text),x=>x.charCodeAt(0));
async function encryptionKey(){
 const bytes=unb64(getEnv("MONEY_GARDEN_TOKEN_KEY"));
 if(bytes.byteLength!==32)throw Error("MONEY_GARDEN_TOKEN_KEY must be 32 random bytes encoded as base64");
 return await crypto.subtle.importKey("raw",bytes,"AES-GCM",false,["encrypt","decrypt"]);
}
export async function protect(token:string){
 const iv=crypto.getRandomValues(new Uint8Array(12)),key=await encryptionKey();
 const cipher=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},key,new TextEncoder().encode(token)));
 return b64(iv)+"."+b64(cipher);
}
export async function unprotect(data:string){
 const [nonce,encrypted]=data.split(".");
 if(!nonce||!encrypted)throw Error("Invalid encrypted token");
 const key=await encryptionKey();
 return new TextDecoder().decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(nonce)},key,unb64(encrypted)));
}
export async function refreshAccounts(item:any,token:string){
 const {accounts}=await plaid("accounts/get",{access_token:token});
 const rows=(accounts||[]).map((a:any)=>({id:a.account_id,user_id:item.user_id,item_id:item.id,name:a.name||a.official_name||"Bank account",mask:a.mask||null,kind:a.type||null,current_balance:a.balances?.current??null,available_balance:a.balances?.available??null,updated_at:new Date().toISOString()}));
 if(rows.length){const {error}=await admin().from("money_bank_accounts").upsert(rows,{onConflict:"id"});if(error)throw error}
}
export async function syncItem(item:any){
 const db=admin(),access_token=await unprotect(item.encrypted_access_token);
 let cursor=item.cursor||null,more=true,pages=0,updated=0;
 while(more){
  if(++pages>80)throw Error("Too many transaction pages; retry later");
  const batch=await plaid("transactions/sync",{access_token,cursor,count:500});
  const rows=[...(batch.added||[]),...(batch.modified||[])].map((t:any)=>({
   id:t.transaction_id,user_id:item.user_id,item_id:item.id,account_id:t.account_id,
   date:t.date,merchant:t.merchant_name||t.name||"Unlabeled",description:t.name||null,amount:t.amount,
   category_primary:t.personal_finance_category?.primary||null,category_detailed:t.personal_finance_category?.detailed||null,
   pending:!!t.pending,updated_at:new Date().toISOString()
  }));
  if(rows.length){const {error}=await db.from("money_bank_transactions").upsert(rows,{onConflict:"id"});if(error)throw error}
  const removed=(batch.removed||[]).map((t:any)=>t.transaction_id).filter(Boolean);
  if(removed.length){const {error}=await db.from("money_bank_transactions").delete().eq("user_id",item.user_id).in("id",removed);if(error)throw error}
  updated+=rows.length;cursor=batch.next_cursor;more=!!batch.has_more;
  // Save the cursor only after the page's updates succeed.
  const {error:cursorErr}=await db.from("money_bank_items").update({cursor,last_synced_at:new Date().toISOString()}).eq("id",item.id);
  if(cursorErr)throw cursorErr;
 }
 await refreshAccounts(item,access_token);
 return updated;
}
