// Learning scheduler for the SWE Glow-Up. Deliberately independent of React.
// Dates use ISO local calendar keys (YYYY-MM-DD), not timestamps.
export const REVIEW_GAPS=[1,3,7,14,30,60];
export const GRADES={red:"RED · stuck / saw solution",yellow:"YELLOW · hinted / slow",green:"GREEN · independent",mock:"MOCK · timed + explained"};
export function addStudyDays(iso,days){
 const [y,m,d]=iso.split("-").map(Number);
 const date=new Date(Date.UTC(y,m-1,d+days,12));
 return date.toISOString().slice(0,10);
}
export function gradeStudy(previous={},grade,date){
 if(!["red","yellow","green","mock"].includes(grade))throw Error("Unknown grade");
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error("Use YYYY-MM-DD");
 const stage=grade==="red"?0:grade==="yellow"?Math.max(0,(previous.stage||0)-1):Math.min((previous.stage??-1)+1,REVIEW_GAPS.length-1);
 const gap=grade==="red"?1:grade==="yellow"?3:REVIEW_GAPS[stage];
 const history=[...(previous.history||[]),{date,grade}];
 return {...previous,grade,stage,lastReviewed:date,dueDate:addStudyDays(date,gap),history,attempts:history.length};
}
export function reviewDue(item,date){
 return !!(item?.dueDate&&item.dueDate<=date);
}
export function reviewOverdue(item,date){
 if(!reviewDue(item,date))return 0;
 const a=new Date(item.dueDate+"T12:00:00Z"),b=new Date(date+"T12:00:00Z");
 return Math.max(0,Math.round((b-a)/86400000));
}
export function daysUntil(target,now){
 return Math.round((new Date(target+"T12:00:00Z")-new Date(now+"T12:00:00Z"))/86400000);
}
export function dateKey(value=new Date()){
 return [value.getFullYear(),String(value.getMonth()+1).padStart(2,"0"),String(value.getDate()).padStart(2,"0")].join("-");
}
export function dailyStreak(records,today){
 const days=new Set(records.flatMap(x=>(x.history||[]).map(h=>h.date)));
 let streak=0;
 let d=today;
 if(!days.has(d))d=addStudyDays(d,-1);
 while(days.has(d)){streak++;d=addStudyDays(d,-1)}
 return streak;
}
export function completionStats(sections,skills){
 const total=sections.reduce((n,s)=>n+s.skills.length,0);
 const mastered=sections.reduce((n,s)=>n+s.skills.filter(t=>(skills[t.id]?.level||0)>=3).length,0);
 const practiced=sections.reduce((n,s)=>n+s.skills.filter(t=>(skills[t.id]?.level||0)>=1).length,0);
 return {total,mastered,practiced,percent:total?Math.round(mastered/total*100):0};
}
export function statusFor(item){return item?.grade||"new"}
