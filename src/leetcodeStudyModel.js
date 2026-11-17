// LeetCode attempt history, editable metadata and exact concept filtering.
// Study dates are local YYYY-MM-DD keys. No remote network or LeetCode syncing.
import {addStudyDays,REVIEW_GAPS,dateKey} from './sweStudyLogic.js';

export const DIFFICULTIES=['Unrated','Easy','Medium','Hard'];
export const CONCEPT_GROUPS={
 'Data structures':['Arrays','2D Arrays / Matrix','Strings','HashMap / HashSet','Linked List','Stack','Queue / Deque','Trees / BST','Heap / Priority Queue','Graphs','Trie'],
 'Algorithms & patterns':['Two Pointers','Sliding Window','Prefix Sum','Binary Search','Sorting','Recursion','Backtracking','Greedy','Dynamic Programming','Intervals','Union Find','Bit Manipulation','Math / Digits']
};
export const ALL_CONCEPTS=Object.values(CONCEPT_GROUPS).flat();
export const CONCEPT_IDS={
 'Arrays':[1480,1672,1431,1295,1,27,1920,1929,283,747,1365,1572,724,560,121,643,209,977,167,15,56,704,35,875,739,347,215,435,55,198,322,300,1732,1470,485,1389,118,989,1051,88,414,66],
 '2D Arrays / Matrix':[1672,1572,200,994,79,51,118],
 'Strings':[2114,1768,125,14,242,49,3,20,394,208,79,1143,72],
 'HashMap / HashSet':[217,1,242,49,560,3,347,1365],
 'Linked List':[206,21,141],
 'Stack':[20,739,394,682],
 'Queue / Deque':[102,994,200],
 'Trees / BST':[104,102,98,235],
 'Heap / Priority Queue':[215,347,743],
 'Graphs':[200,994,207,684,743],
 'Trie':[208],
 'Two Pointers':[27,283,125,977,167,15,206,21,141,88],
 'Sliding Window':[643,3,209],
 'Prefix Sum':[1480,724,560,1732],
 'Binary Search':[704,35,875,300],
 'Sorting':[977,15,56,435,1051,1365],
 'Recursion':[104,78,46,79,51,200,98,235,1143],
 'Backtracking':[78,46,79,51],
 'Greedy':[55,435,121],
 'Dynamic Programming':[198,322,1143,300,72],
 'Intervals':[56,435],
 'Union Find':[684],
 'Bit Manipulation':[136],
 'Math / Digits':[1295,989,66,1431,414]
};
const seeded=new Map();
for(const [concept,ids] of Object.entries(CONCEPT_IDS))for(const id of ids)seeded.set(id,[...(seeded.get(id)||[]),concept]);
export function conceptsForProblem(problem,record={}){
 if(Array.isArray(record.concepts))return [...new Set(record.concepts.filter(x=>ALL_CONCEPTS.includes(x)))];
 const id=Number(problem?.id);
 if(seeded.has(id))return [...seeded.get(id)];
 const words=(String(problem?.title||'')+' '+String(problem?.pattern||'')).toLowerCase();
 const guesses=[];
 for(const [test,tag] of [
  [/\b(matrix|grid|2d)\b/,'2D Arrays / Matrix'],[/\b(array|subarray|index|indices)\b/,'Arrays'],
  [/\b(string|substring|palindrome|anagram)\b/,'Strings'],[/\b(hash|frequency|duplicate)\b/,'HashMap / HashSet'],
  [/\b(linked list|node)\b/,'Linked List'],[/\bstack\b/,'Stack'],[/\bqueue\b/,'Queue / Deque'],
  [/\b(tree|bst)\b/,'Trees / BST'],[/\bheap\b/,'Heap / Priority Queue'],[/\b(graph|island)\b/,'Graphs'],
  [/\b(two.pointer|pointer)\b/,'Two Pointers'],[/\bsliding window\b/,'Sliding Window'],[/\b(prefix|cumulative)\b/,'Prefix Sum'],
  [/\bbinary search\b/,'Binary Search'],[/\bsort\b/,'Sorting'],[/\b(recursion|recursive)\b/,'Recursion'],
  [/\b(backtrack|undo state)\b/,'Backtracking'],[/\bgreedy\b/,'Greedy'],[/\b(dynamic programming|dp)\b/,'Dynamic Programming']
 ])if(test.test(words))guesses.push(tag);
 return [...new Set(guesses)];
}
export function attempted(record){return Array.isArray(record?.history)&&record.history.some(h=>h&&h.grade&&h.date);}
const validGrade=g=>['red','yellow','green','mock'].includes(g);
export function validStudyDate(date,today=dateKey()){
 if(typeof date!=='string'||!/^(\d{4})-(\d{2})-(\d{2})$/.test(date))return false;
 const parsed=new Date(date+'T12:00:00Z');
 return !Number.isNaN(parsed.getTime())&&parsed.toISOString().slice(0,10)===date&&date<=today;
}
function normalizedHistory(history=[]){
 if(!Array.isArray(history))return [];
 return history.filter(h=>h&&validGrade(h.grade)&&typeof h.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(h.date)).map((h,i)=>({
  ...h,id:h.id||'legacy-'+i+'-'+h.date+'-'+h.grade,
  code:typeof h.code==='string'?h.code:'',
  notes:typeof h.notes==='string'?h.notes:''
 }));
}
export function recalcProblem(record={}){
 const sorted=normalizedHistory(record.history).sort((a,b)=>a.date.localeCompare(b.date));
 let stage=-1,grade=null,review=null,due=null;
 for(const attempt of sorted){
  grade=attempt.grade;review=attempt.date;
  stage=grade==='red'?0:grade==='yellow'?Math.max(0,stage-1):Math.min(REVIEW_GAPS.length-1,stage+1);
  const gap=grade==='red'?1:grade==='yellow'?3:REVIEW_GAPS[stage];
  due=addStudyDays(review,gap);
 }
 return {...record,history:sorted,grade,stage,lastReviewed:review,dueDate:due,attempts:sorted.length};
}
export function logProblemAttempt(record={},grade,date,code='',notes='',id){
 if(!validGrade(grade))throw new Error('Choose RED, YELLOW, GREEN or MOCK');
 if(!validStudyDate(date))throw new Error('Select a valid attempt date on or before today');
 const history=normalizedHistory(record.history);
 // A double-click on the same grade/date/code is not two distinct attempts.
 const last=history.at(-1);
 if(last?.date===date&&last.grade===grade&&(last.code||'')===code&&(last.notes||'')===notes){
  return recalcProblem({...record,history});
 }
 const newId=id||'attempt-'+date+'-'+Math.random().toString(36).slice(2,10);
 return recalcProblem({...record,history:[...history,{id:newId,date,grade,code,notes}]});
}
export function editProblemAttempt(record={},attemptId,patch={}){
 const history=normalizedHistory(record.history);
 const found=history.find(x=>x.id===attemptId);
 if(!found)return record;
 if(patch.date!==undefined&&!validStudyDate(patch.date))throw new Error('Invalid or future attempt date');
 if(patch.grade!==undefined&&!validGrade(patch.grade))throw new Error('Invalid grade');
 return recalcProblem({...record,history:history.map(x=>x.id===attemptId?{...x,...patch}:x)});
}
export function deleteProblemAttempt(record={},attemptId){
 return recalcProblem({...record,history:normalizedHistory(record.history).filter(x=>x.id!==attemptId)});
}
export function filterLeetCodeProblems(list,records,{search='',phase='all',status='all',concept='all',difficulty='all',today='',firstAttempts=[]}={}){
 const first=new Set(firstAttempts.map(Number));
 const q=search.toLowerCase().trim();
 return list.filter(p=>{
  const r=records?.[p.id]||{},has=attempted(r),grade=has?r.grade:'new';
  const inPhase=phase==='all'||phase===p.phase||(phase==='PRIOR'&&p.prior);
  const inStatus=status==='all'||
   (status==='prior'&&has)||
   (status==='unattempted'&&!has)||
   (status==='due'&&((has&&!!r.dueDate&&r.dueDate<=today)||(!has&&first.has(Number(p.id)))))||
   (status===grade);
  const level=r.difficulty||'Unrated';
  const inDifficulty=difficulty==='all'||level===difficulty;
  const tags=conceptsForProblem(p,r);
  const inConcept=concept==='all'||tags.includes(concept);
  const inQuery=!q||String(p.id).includes(q)||p.title.toLowerCase().includes(q)||(p.pattern||'').toLowerCase().includes(q)||tags.some(tag=>tag.toLowerCase().includes(q));
  return inPhase&&inStatus&&inDifficulty&&inConcept&&inQuery;
 });
}
