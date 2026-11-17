// Authorized user endpoints: start Plaid Link, exchange a newly authorized
// public token, and request an immediate bank refresh.
// Never expose PLAID_SECRET or the encrypted access token to the browser.
import {admin,cors,json,plaid,protect,refreshAccounts,syncItem,userFromRequest} from "../_shared/bank.ts";

Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors(req)});
 if(req.method!=="POST")return json(req,{error:"Method not allowed"},405);
 try{
  const user=await userFromRequest(req),body=await req.json(),action=body?.action;
  if(action==="link"){
   const redirect_uri=Deno.env.get("PLAID_REDIRECT_URI");
   const payload:any={client_name:"Money Garden",language:"en",country_codes:["US"],products:["transactions"],user:{client_user_id:user.id}};
   if(redirect_uri)payload.redirect_uri=redirect_uri;
   const response=await plaid("link/token/create",payload);
   return json(req,{link_token:response.link_token,expiration:response.expiration});
  }
  if(action==="exchange"){
   if(typeof body.public_token!=="string"||!body.public_token.startsWith("public-"))return json(req,{error:"Missing authorized public token"},400);
   const exchanged=await plaid("item/public_token/exchange",{public_token:body.public_token});
   const db=admin();
   const {data:existing}=await db.from("money_bank_items").select("id,user_id").eq("plaid_item_id",exchanged.item_id).maybeSingle();
   if(existing&&existing.user_id!==user.id)return json(req,{error:"This bank connection already belongs to another user"},409);
   const encrypted_access_token=await protect(exchanged.access_token);
   const {data:item,error}=await db.from("money_bank_items").upsert({
     user_id:user.id,...(existing?.id?{id:existing.id}:{}),plaid_item_id:exchanged.item_id,
     encrypted_access_token,cursor:null
   },{onConflict:"plaid_item_id"}).select("id,user_id,encrypted_access_token,cursor").single();
   if(error)throw error;
   let count=0,sync_pending=false;
   try{count=await syncItem(item)}catch(e){
    if(e instanceof Error&&/PRODUCT_NOT_READY/i.test(e.message)){
     sync_pending=true;
     await refreshAccounts(item,exchanged.access_token);
    }else throw e;
   }
   return json(req,{ok:true,imported_count:count,sync_pending});
  }
  if(action==="sync"){
   const db=admin(),{data:items,error}=await db.from("money_bank_items").select("id,user_id,encrypted_access_token,cursor").eq("user_id",user.id).limit(20);
   if(error)throw error;
   const results=[];for(const item of items||[])results.push(await syncItem(item));
   return json(req,{ok:true,imported_count:results.reduce((a,b)=>a+b,0),connected_items:results.length});
  }
  return json(req,{error:"Unknown action"},400);
 }catch(error){return json(req,{error:error instanceof Error?error.message:"Bank connection error"},400)}
});
