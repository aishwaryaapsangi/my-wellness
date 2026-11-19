// Learning-first curriculum, NOT a claim that these questions will appear at Google.
// Advanced bank sourced from the user's Nov 2026 "Top Google Questions" screenshot/list.
// These remain LOCKED as new assignments until their prerequisite topic is introduced.
export const TOP_GOOGLE_50=[
[1293,'Shortest Path in a Grid with Obstacles Elimination','Hard','Graphs','2027-01-25'],
[528,'Random Pick with Weight','Medium','Prefix Sum','2026-12-22'],
[1937,'Maximum Number of Points with Cost','Medium','Dynamic Programming','2027-02-01'],
[777,'Swap Adjacent in LR String','Medium','Two Pointers','2027-01-04'],
[778,'Swim in Rising Water','Hard','Graphs','2027-02-01'],
[539,'Minimum Time Difference','Medium','Sorting','2026-12-22'],
[1055,'Shortest Way to Form String','Medium','Strings','2027-01-04'],
[2101,'Detonate the Maximum Bombs','Medium','Graphs','2027-01-25'],
[1554,'Strings Differ by One Character','Medium','HashMap / HashSet','2027-01-11'],
[418,'Sentence Screen Fitting','Medium','Strings','2027-01-04'],
[419,'Battleships in a Board','Medium','2D Arrays / Matrix','2026-12-15'],
[552,'Student Attendance Record II','Hard','Dynamic Programming','2027-02-15'],
[792,'Number of Matching Subsequences','Medium','Strings','2027-01-04'],
[900,'RLE Iterator','Medium','Arrays','2026-12-15'],
[2096,'Step-By-Step Directions From a Binary Tree Node to Another','Medium','Trees / BST','2027-01-18'],
[1105,'Filling Bookcase Shelves','Medium','Dynamic Programming','2027-02-08'],
[2115,'Find All Possible Recipes from Given Supplies','Medium','Graphs','2027-01-25'],
[1606,'Find Servers That Handled Most Number of Requests','Hard','Heap / Priority Queue','2027-02-15'],
[2402,'Meeting Rooms III','Hard','Heap / Priority Queue','2027-02-15'],
[2242,'Maximum Score of a Node Sequence','Hard','Graphs','2027-02-15'],
[562,'Longest Line of Consecutive One in Matrix','Medium','2D Arrays / Matrix','2027-01-04'],
[1101,'The Earliest Moment When Everyone Become Friends','Medium','Union Find','2027-01-25'],
[2416,'Sum of Prefix Scores of Strings','Hard','Trie','2027-02-15'],
[68,'Text Justification','Hard','Strings','2027-02-15'],
[818,'Race Car','Hard','Dynamic Programming','2027-03-01'],
[1610,'Maximum Number of Visible Points','Hard','Math / Digits','2027-03-01'],
[329,'Longest Increasing Path in a Matrix','Hard','Graphs','2027-02-15'],
[2421,'Number of Good Paths','Hard','Union Find','2027-03-01'],
[715,'Range Module','Hard','Intervals','2027-03-01'],
[1996,'The Number of Weak Characters in the Game','Medium','Sorting','2027-01-11'],
[1387,'Sort Integers by The Power Value','Medium','Sorting','2027-01-04'],
[2135,'Count Words Obtained After Adding a Letter','Medium','HashMap / HashSet','2027-01-11'],
[729,'My Calendar I','Medium','Intervals','2027-01-18'],
[2162,'Minimum Cost to Set Cooking Time','Medium','Math / Digits','2027-01-11'],
[2013,'Detect Squares','Medium','HashMap / HashSet','2027-01-11'],
[2128,'Remove All Ones With Row and Column Flips','Medium','2D Arrays / Matrix','2027-01-18'],
[833,'Find And Replace in String','Medium','Strings','2027-01-11'],
[489,'Robot Room Cleaner','Hard','Backtracking','2027-03-01'],
[1146,'Snapshot Array','Medium','Binary Search','2027-01-18'],
[2018,'Check if Word Can Be Placed In Crossword','Medium','2D Arrays / Matrix','2027-01-11'],
[839,'Similar String Groups','Hard','Union Find','2027-02-15'],
[359,'Logger Rate Limiter','Easy','HashMap / HashSet','2026-12-10'],
[2178,'Maximum Split of Positive Even Integers','Medium','Greedy','2027-01-18'],
[843,'Guess the Word','Hard','Greedy','2027-03-01'],
[1048,'Longest String Chain','Medium','Dynamic Programming','2027-02-01'],
[366,'Find Leaves of Binary Tree','Medium','Trees / BST','2027-01-18'],
[2034,'Stock Price Fluctuation','Medium','Heap / Priority Queue','2027-01-25'],
[2172,'Maximum AND Sum of Array','Hard','Dynamic Programming','2027-03-01'],
[2158,'Amount of New Area Painted Each Day','Hard','Intervals','2027-02-15'],
[253,'Meeting Rooms II','Medium','Heap / Priority Queue','2027-01-25']
];
export const GOOGLE_TOP_50_PROBLEMS=TOP_GOOGLE_50.map(([id,title,difficulty,tag,unlocks])=>({id,title,difficulty,phase:'GOOGLE50',pattern:tag,concepts:[tag],language:'Java',unlocks,source:'user-provided Top Google Questions list; advanced practice, not interview prediction'}));
// Hand-selected beginner-to-intermediate scaffold. Introduce harder questions as readiness grows.
const FOUNDATION=[
 ['2026-11-16','2026-11-25','Arrays',[26,283,1929,1480,88,977,169,189,238,121,53,724,560]],
 ['2026-11-26','2026-12-03','Strings / HashMap',[217,1,242,125,1768,14,49,3,1365,347]],
 ['2026-12-04','2026-12-10','Two pointers / windows',[167,11,643,209,424,567,438,15]],
 ['2026-12-11','2026-12-17','Linked lists / stacks',[206,21,141,20,155,739,150]],
 ['2026-12-18','2026-12-24','Binary search / sorting',[704,35,33,153,34,56,435]],
 ['2026-12-25','2027-01-07','Trees / BFS / heaps',[104,102,98,235,215,347,200,994]],
 ['2027-01-08','2027-01-21','Graphs / backtracking',[207,684,78,46,79,39]],
 ['2027-01-22','2027-02-04','Greedy / DP',[55,198,70,322,300,1143]],
 ['2027-02-05','2099-12-31','Mixed interview',[72,743,51,875,76,42]]
];
export const LEETCODE_PHASES=FOUNDATION.map(([starts,ends,title,ids])=>({starts,ends,title,ids}));
const EARLY_UNLOCK=new Map(FOUNDATION.flatMap(([starts,,title,ids])=>ids.map((id,index)=>[id,{date:starts,phase:title,order:index}])));
export function isNewProblemEligible(problem,date,records={}){
 if(!problem||problem.language==='SQL')return false;
 if(records[problem.id]?.history?.length)return false;
 const early=EARLY_UNLOCK.get(Number(problem.id));
 if(early)return early.date<=date;
 const top=TOP_GOOGLE_50.find(x=>x[0]===Number(problem.id));
 if(top)return date>=top[4];
 // Other catalog questions can be studied voluntarily in Dojo but aren't
 // auto-assigned until the mixed interview chapter.
 return date>='2027-03-08';
}
export function selectNewLeetCode(date,problems=[],records={},excludeIds=[]){
 const current=FOUNDATION.find(([start,end])=>date>=start&&date<=end)||FOUNDATION.at(-1);
 const excluded=new Set(excludeIds.map(Number));
 const eligible=problems.filter(p=>!excluded.has(Number(p.id))&&isNewProblemEligible(p,date,records));
 // Finish fresh work in the CURRENT family first; no early linked-list surprise.
 const phaseIds=current[3];
 const currentEligible=eligible.filter(p=>phaseIds.includes(Number(p.id)));
 const candidates=currentEligible.length?currentEligible:eligible;
 if(!candidates.length)return null;
 const rank=p=>{
  const id=Number(p.id),index=phaseIds.indexOf(id);
  const easyBonus=p.difficulty==='Easy'?0:p.difficulty==='Medium'?3:8;
  const earlier=EARLY_UNLOCK.get(id);
  const familiarity=phaseIds.filter(x=>records[x]?.history?.some(h=>['green','mock'].includes(h.grade))).length;
  // When confidence builds, prefer Mediums, but Hard remains gated until later stages.
  const diffPenalty=easyBonus+(date<'2027-01-01'&&p.difficulty==='Hard'?25:0)+(familiarity<3&&p.difficulty==='Medium'?5:0);
  return (index<0?50:index*1.5)+diffPenalty+(earlier?0:20);
 };
 return [...candidates].sort((a,b)=>rank(a)-rank(b)||Number(a.id)-Number(b.id))[0];
}
