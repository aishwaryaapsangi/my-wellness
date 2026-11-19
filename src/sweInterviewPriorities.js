// Evidence-informed planning weights, not a proprietary Google question-frequency table.
// Sources: Google's public technical-interview advice, November 2026 user's 99-page
// SWE Glow-Up handbook (P0/P1/P2 and pp. 82–84), and 2024–2026 self-reported L3 rounds.
// Candidate experiences vary; official LeetCode problem frequencies are NOT published.
import {conceptsForProblem} from './leetcodeStudyModel.js';
import {isLeetCodeDue,leetCodeDueDate} from './leetcodeStudyModel.js';
export const INTERVIEW_PRIORITIES=[
 {tier:'P0',title:'Core coding & Java reasoning',topics:['Arrays','HashMap / HashSet','Strings','Two Pointers','Sliding Window','Prefix Sum','Binary Search','Trees / BST','Graphs','Stack','Queue / Deque','Recursion','Sorting','Intervals','Dynamic Programming'],why:'Algorithms, implementation, complexity and test cases are central to Google technical guidance.'},
 {tier:'P1',title:'Important coding extensions',topics:['Heap / Priority Queue','Backtracking','Greedy','Linked List','Union Find','Trie','Bit Manipulation','2D Arrays / Matrix'],why:'Reported L3 interviews include graph, heap, bit, interval and implementation variations; learn these after foundations, not as rare trivia.'},
 {tier:'P2',title:'Role- or project-specific depth',topics:['Advanced system design','Niche Angular internals','Optional Java/SQL API conveniences'],why:'Useful in day-to-day engineering, but less important than independent interview coding for the general SWE II goal.'}
];
const CORE=new Set(INTERVIEW_PRIORITIES[0].topics);
const NEXT=new Set(INTERVIEW_PRIORITIES[1].topics);
export function priorityForProblem(problem,record={}){
 const tags=conceptsForProblem(problem,record);
 return tags.some(x=>CORE.has(x))?'P0':tags.some(x=>NEXT.has(x))?'P1':'P1';
}
export function prioritizeDueProblems(problems,records={},date){
 return problems.filter(p=>isLeetCodeDue(records[p.id],date)).sort((a,b)=>{
  const ra=records[a.id]||{},rb=records[b.id]||{};
  const effort=x=>x.history?.at(-1)?.effort||'normal';
  const score=(p,r)=>{
   const risk=r.grade==='red'?120:r.grade==='yellow'?85:r.grade==='mock'?0:15;
   const struggle=effort(r)==='struggled'?45:effort(r)==='easy'?-15:0;
   const overdue=Math.max(0,Math.min(20,Math.floor((Date.parse(date+'T12:00:00Z')-Date.parse(leetCodeDueDate(r)+'T12:00:00Z'))/86400000)));
   return risk+struggle+overdue+(priorityForProblem(p,r)==='P0'?12:0);
  };
  return score(b,rb)-score(a,ra)||(leetCodeDueDate(ra)||'').localeCompare(leetCodeDueDate(rb)||'');
 });
}
export const RESEARCH_NOTES={
 asOf:'2026-11-18',
 official:'https://www.linkedin.com/posts/google_how-to-prepare-for-technical-interviews-activity-7319057159177097217-lnuR',
 posting:'https://www.google.com/about/careers/applications/jobs/results/109116638069957318-software-engineer-ii-early-career',
 candidateGraphIntervals:'https://www.reddit.com/r/leetcode/comments/1sngeta/google_l3_swe_interview_experience/',
 candidateVariation:'https://www.reddit.com/r/leetcode/comments/1hl5wr1/got_google_l3_heres_my_experience/',
 caveat:'No candidate report, LinkedIn profile, or company-tag list proves real question frequency.'
};
