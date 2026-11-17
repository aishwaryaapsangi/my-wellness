// Daily scheduled sync. Protected by an independently configured secret.
// Never expose the cron secret in public code, environment variables prefixed VITE_, or client headers.
import {admin,cors,json,syncItem} from "../_shared/bank.ts";

function safeEqual(a:string,b:string){
 if(a.length!==b.length)return false;
 let result=0;for(let i=0;i<a.length;i++)result|=a.charCodeAt(i)^b.charCodeAt(i);
 return result===0;
}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors(req)});
 if(req.method!=="POST")return json(req,{error:"Method not allowed"},405);
 const authorized=req.headers.get("x-cron-secret")||"",expected=Deno.env.get("MONEY_GARDEN_CRON_SECRET")||"";
 if(!expected||!safeEqual(authorized,expected))return json(req,{error:"Unauthorized"},401);
 try{
  const db=admin(),{data:items,error}=await db.from("money_bank_items").select("id,user_id,encrypted_access_token,cursor").limit(100);
  if(error)throw error;
  let count=0,failures=0;
  for(const item of items||[]){
   try{count+=await syncItem(item)}
   catch(e){failures++;console.error("Bank item sync failed",item.id,e instanceof Error?e.message:"unknown error")}
  }
  return json(req,{ok:failures===0,accounts:(items||[]).length,updated_transactions:count,failures});
 }catch(e){return json(req,{error:e instanceof Error?e.message:"Unable to sync"},500)}
});
