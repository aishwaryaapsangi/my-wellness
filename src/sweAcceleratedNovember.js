import {addStudyDays} from './sweStudyLogic.js';
// Accelerated November first-pass: covers the full DSA & algorithm map BEFORE December's
// heavier spaced retrieval. Meeting a topic is not evidence of mastery.
export const NOVEMBER_DAILY={
  "2026-11-16": {
    "title": "Java baseline + arrays",
    "dsa": "Compress Java syntax: primitives/references, array vs ArrayList, loops, indexing, Big-O, equals vs ==. Trace write-pointer memory.",
    "engineering": "Java OOP / equality",
    "engineeringExercise": "Create 2 minimal classes: constructor, override equals/hashCode, ArrayList vs int[] tests.",
    "project": "Decide the flagship CityCircle feature or a better personally meaningful problem; note users and pain.",
    "proof": "Make a 5-row competency baseline with GREEN/YELLOW/RED and keep weak spots visible.",
    "problemIds": [
      27,
      1920
    ],
    "sqlIds": [],
    "pages": [
      17,
      23,
      31
    ]
  },
  "2026-11-17": {
    "title": "HashMap / HashSet + pointer fundamentals",
    "dsa": "HashMap put/getOrDefault/containsKey, HashSet add/contains; use two pointers to remove in-place. Compare O(n) vs O(n²).",
    "engineering": "SQL WHERE / SELECT",
    "engineeringExercise": "Write 3 filters using SELECT, WHERE, ORDER BY, NULL semantics; LeetCode SQL #584.",
    "project": "Draft project user stories + 1 wireframe sketch (paper or Figma).",
    "proof": "Compare brute force vs HashMap for Two Sum; describe key/value and collision concept.",
    "problemIds": [
      217,
      1
    ],
    "sqlIds": [
      584
    ],
    "pages": [
      25,
      39,
      63
    ]
  },
  "2026-11-18": {
    "title": "Strings + two pointers + sliding windows",
    "dsa": "String vs char[], StringBuilder, opposite/end pointer movement, fixed vs variable window and window invariant.",
    "engineering": "SQL JOIN / relational keys",
    "engineeringExercise": "Draw PK/FK and implement INNER/LEFT JOIN with 2 demo tables; solve SQL #175.",
    "project": "Create project README: who needs it, MVP scope, what will NOT be built.",
    "proof": "Write pointer template and a window template from memory; explain left<=right.",
    "problemIds": [
      125,
      643
    ],
    "sqlIds": [
      175
    ],
    "pages": [
      21,
      39,
      41,
      63
    ]
  },
  "2026-11-19": {
    "title": "Linked lists + stacks + queues",
    "dsa": "Draw Node.next pointers and fast/slow; implement stack/queue with ArrayDeque; practice push/pop/peek/remove guards.",
    "engineering": "OOP + Java collections",
    "engineeringExercise": "Interface vs class, generics, Set/List/Deque; build a tiny BrowserHistory simulation with tests.",
    "project": "Sketch data model entities: users, events, RSVPs and their relationships.",
    "proof": "Explain LIFO vs FIFO, head pointer and null safety with one diagram.",
    "problemIds": [
      206,
      20
    ],
    "sqlIds": [
      181
    ],
    "pages": [
      27,
      31,
      45,
      46
    ]
  },
  "2026-11-20": {
    "title": "Binary search + sorting + monotonic structure",
    "dsa": "Know loop boundaries (low<=high), mid calculation, sorted precondition, stable sort and comparator; stack monotonic use case.",
    "engineering": "Testing & Git foundations",
    "engineeringExercise": "Write a JUnit-style table of edge cases; review branch/PR/CI workflow.",
    "project": "Initialize project repo / branch; README, issue board and first milestone.",
    "proof": "Contrast search of sorted input vs scanning, and worst-case complexity.",
    "problemIds": [
      704,
      35
    ],
    "sqlIds": [
      596
    ],
    "pages": [
      43,
      44,
      70
    ]
  },
  "2026-11-21": {
    "title": "Trees + BST + heaps",
    "dsa": "Know node/root/leaf, preorder/inorder/postorder, BFS vs DFS, BST ordering, PriorityQueue and heap vs tree.",
    "engineering": "Spring Boot quick architecture",
    "engineeringExercise": "Controller → service → repository → DTO, validation and endpoint lifecycle.",
    "project": "Build project wireframes for home + create-event; create repository if not already done.",
    "proof": "Implement a tiny tree node and heap push/pop in Java; compare DFS stack and BFS queue.",
    "problemIds": [
      104,
      215
    ],
    "sqlIds": [
      1068
    ],
    "pages": [
      48,
      50,
      68
    ]
  },
  "2026-11-22": {
    "title": "Graphs + grids + BFS/DFS",
    "dsa": "Draw adjacency list and visited set, identify directed/weighted edges, grid neighbors, queue BFS and recursion DFS.",
    "engineering": "SQL GROUP BY and HAVING",
    "engineeringExercise": "Use SQL #182 / #596 and explain COUNT, GROUP BY, HAVING vs WHERE.",
    "project": "Write 1 page project data flow, including API routes and how frontend talks to backend.",
    "proof": "Run one grid traversal by hand; explain when visited is marked.",
    "problemIds": [
      200,
      994
    ],
    "sqlIds": [
      182,
      596
    ],
    "pages": [
      51,
      53,
      63
    ]
  },
  "2026-11-23": {
    "title": "Recursion + backtracking + tries",
    "dsa": "Base case, recursive stack, choose→explore→undo, prefix Trie node/children and why prefixes help.",
    "engineering": "Java OOP revisit + JUnit",
    "engineeringExercise": "Interface vs inheritance, composition, exceptions and one isolated unit-test suite.",
    "project": "Draft project controller interface and first 2 fake API responses.",
    "proof": "Identify recursion depth and show how to undo one state change.",
    "problemIds": [
      78,
      208
    ],
    "sqlIds": [
      620
    ],
    "pages": [
      55,
      50,
      31
    ]
  },
  "2026-11-24": {
    "title": "Greedy + intervals + union-find",
    "dsa": "Sort intervals, choose local criterion, prove greedy choice; disjoint-set find/union and path compression.",
    "engineering": "SQL JOIN practice",
    "engineeringExercise": "Solve SQL #183 and #1581 with LEFT JOIN / IS NULL; compare NOT EXISTS.",
    "project": "Implement an initial project database schema or SQL migration.",
    "proof": "Give a counterexample to a bad greedy decision, then justify correct strategy.",
    "problemIds": [
      435,
      684
    ],
    "sqlIds": [
      183,
      1581
    ],
    "pages": [
      57,
      53,
      63
    ]
  },
  "2026-11-25": {
    "title": "Dynamic programming / memoization",
    "dsa": "Identify overlapping subproblems, define state, write recurrence and base cases, table vs cache, 1D vs 2D.",
    "engineering": "SQL aggregate / window intro",
    "engineeringExercise": "Practice #1193 conditional SUM and #178 DENSE_RANK; compare GROUP BY and window functions.",
    "project": "Implement one endpoint stub with request/response types.",
    "proof": "Sketch DP table for House Robber and Coin Change; differentiate greedy.",
    "problemIds": [
      198,
      322
    ],
    "sqlIds": [
      1193,
      178
    ],
    "pages": [
      58,
      63,
      68
    ]
  },
  "2026-11-26": {
    "title": "Advanced graphs + bit tricks",
    "dsa": "Topological ordering/DAG, Dijkstra vs BFS, when union-find applies, XOR parity; complete the whole topic survey.",
    "engineering": "Networking / HTTP / TLS",
    "engineeringExercise": "Trace DNS→TCP→TLS→HTTP→backend→DB; identify common 4xx/5xx failures.",
    "project": "Optional light holiday build: tidy wireframes or write one test; prioritize time off.",
    "proof": "Write a one-page cheat map of ALL DSA structures; mark weak families honestly.",
    "problemIds": [
      207,
      136
    ],
    "sqlIds": [
      197
    ],
    "pages": [
      53,
      60,
      64
    ]
  },
  "2026-11-27": {
    "title": "Full coverage checkpoint + mixed unseen",
    "dsa": "Quick-switch challenge: array, hash, stack, graph, tree, recursion, DP. Identify pattern before coding; code one independently.",
    "engineering": "SQL challenge: join + group",
    "engineeringExercise": "Solve SQL #1251 and #1731, describe join keys and aggregation.",
    "project": "Review a genuine Google SWE II posting and write 2 truthful fit/gap bullets.",
    "proof": "Make a YELLOW/RED backlog from problems that weren't independent.",
    "problemIds": [
      56,
      875
    ],
    "sqlIds": [
      1251,
      1731
    ],
    "pages": [
      33,
      63,
      73
    ]
  },
  "2026-11-28": {
    "title": "Mixed problem set + deeper portfolio build",
    "dsa": "Two separate problems from different families: one familiar Easy and one unfamiliar Medium; timebox each and log outcome.",
    "engineering": "Backend + engineering quality",
    "engineeringExercise": "Create a Spring Boot skeleton or Postgres data schema; add basic tests/validation.",
    "project": "Commit a tangible MVP skeleton with API contract and README screenshots.",
    "proof": "Document time/space for both attempts and what you need to revisit in December.",
    "problemIds": [
      230,
      45
    ],
    "sqlIds": [
      177
    ],
    "pages": [
      68,
      70,
      65
    ]
  },
  "2026-11-29": {
    "title": "Explain-every-family audit",
    "dsa": "Without notes: describe Arrays/Map/Set/List/Stack/Queue/LinkedList/Tree/Heap/Graph/Trie + sorting/search/backtracking/greedy/DP. Mark unknown honestly.",
    "engineering": "OS + system-design fundamentals",
    "engineeringExercise": "Process/thread, memory, caching, latency; sketch one REST service diagram and its failure modes.",
    "project": "Review demo architecture and test coverage; choose your next concrete deliverable.",
    "proof": "Choose 4 weakest DSA families and 2 SQL/OOP gaps to become December's SRS priorities.",
    "problemIds": [
      347,
      139
    ],
    "sqlIds": [
      178
    ],
    "pages": [
      62,
      65,
      70
    ]
  },
  "2026-11-30": {
    "title": "November proof / December activation",
    "dsa": "Complete diagnostic: one array/hash, one tree/graph and one DP/greedy question. Explain assumptions, tests and Big-O.",
    "engineering": "SQL + Java mixed review",
    "engineeringExercise": "Write from memory a SQL JOIN+GROUP BY query and Java map/stack snippet; note syntax gaps.",
    "project": "Commit project milestone, write brief scope and December implementation plan.",
    "proof": "Start formal 1/3/7/14-day independent re-solves in December; Nov coverage ≠ mastery.",
    "problemIds": [
      560,
      200
    ],
    "sqlIds": [
      175
    ],
    "pages": [
      33,
      63,
      77
    ]
  }
};
const LESSON_PAGES={
 '2026-11-16':[17,31],'2026-11-17':[25,63],'2026-11-18':[39,63],
 '2026-11-19':[46,31],'2026-11-20':[43,70],'2026-11-21':[48,68],
 '2026-11-22':[51,63],'2026-11-23':[55,31],'2026-11-24':[57,63],
 '2026-11-25':[58,63],'2026-11-26':[53,64],'2026-11-27':[33,63],
 '2026-11-28':[33,68],'2026-11-29':[33,62],'2026-11-30':[33,63]
};
const CLEAN=(date,type,label,detail,minutes,extra={})=>({id:date+':'+type,type,label,detail,minutes,...extra});
export function novemberTasks(date,{light=false,sprintOverride={}}={}){
 const d=NOVEMBER_DAILY[date];if(!d)return null;
 const holiday=date==='2026-11-26';const weekend=[0,6].includes(new Date(date+'T12:00:00').getDay());
 const focused=weekend?45:30;const lcMinutes=weekend?48:36;
 const tasks=[
  CLEAN(date,'fast-foundation','DSA sprint · '+d.title,d.dsa,focused,{category:'dsa',sectionPage:LESSON_PAGES[date][0]}),
  CLEAN(date,'java-leetcode','Java coding · #'+d.problemIds[0], 'Open LeetCode #'+d.problemIds[0]+'. First write the brute force, then independent Java code with 3 edge cases, time/space; log the actual grade and date.',lcMinutes,{category:'leetcode',problemId:d.problemIds[0]}),
  CLEAN(date,'engineering-lab',sprintOverride.engineering||d.engineering,(sprintOverride.engineeringExercise||d.engineeringExercise),weekend?35:25,{category:'engineering',sectionPage:LESSON_PAGES[date][1]}),
  CLEAN(date,'project-build','Portfolio / personal engineering artifact',sprintOverride.project||d.project,weekend?55:20,{category:'project'}),
  CLEAN(date,'proof-log','Proof + error log',d.proof,12,{category:'review',proof:true})
 ];
 if(d.problemIds[1])tasks.splice(2,0,CLEAN(date,'stretch-leetcode','Stretch / second DSA family · #'+d.problemIds[1], 'Problem #'+d.problemIds[1]+' · second pattern of the day. Target independent solution; if blocked, record YELLOW/RED and continue.',weekend?35:23,{category:'leetcode',problemId:d.problemIds[1],optional:!weekend}));
 if(d.sqlIds.length)tasks.splice(4,0,CLEAN(date,'sql-practice','LeetCode SQL · #'+d.sqlIds[0], 'Solve SQL problem #'+d.sqlIds[0]+' in the SQL dojo. Save the query and describe what tables/joins/aggregates it uses.',weekend?32:22,{category:'leetcode',problemId:d.sqlIds[0],optional:date==='2026-11-26'}));
 if(light){const keep=[tasks[0],tasks.find(t=>t.type==='java-leetcode')].filter(Boolean).map(t=>({...t,minutes:Math.min(15,t.minutes)}));return [...keep,CLEAN(date,'light-note','5-minute sprint marker', 'A lighter day still counts. Note the key idea of '+d.title+'; move unfinished lessons to your backlog.',5,{category:'optional',optional:true})]}
 if(holiday)return tasks.filter(t=>['fast-foundation','java-leetcode','engineering-lab','proof-log'].includes(t.type)).map(t=>({...t,minutes:Math.min(t.minutes,20),optional:t.type!=='fast-foundation'})).concat([CLEAN(date,'holiday-space','Permission to take the holiday off','Try just the 15-minute overview; project and extra problems remain optional.',3,{category:'optional',optional:true})]);
 return tasks;
}
export const NOVEMBER_DSA_FAMILIES=[
 'Java arrays + ArrayList + Big-O','HashSet / HashMap','Strings / two pointers / windows','Linked lists / stacks / queues','Sorting / binary search','Trees / BST / heaps','Graphs + grid BFS/DFS','Recursion / backtracking / trie','Greedy / intervals / union-find','Dynamic programming','Topological / weighted graphs / bit operations'];
const DECEMBER_ROTATION=[
 ['Arrays + in-place patterns',27,26],['HashMap / HashSet',1,49],['Two pointers / strings',125,11],
 ['Sliding window',3,424],['Prefix sum / ranges',560,238],['Binary search / sorting',704,33],
 ['Stack / queue / monotonic',739,155],['Linked list',206,19],['Tree / BST',104,230],
 ['Heap / Trie',215,208],['Graph BFS/DFS',200,133],['Backtracking',78,39],
 ['Greedy / intervals',56,435],['DP recurrence',198,322]
];
const DEC_TECH=[
 ['SQL joins / filters',63,175],['Java OOP and equality',31,null],['HTTP / REST / auth',64,null],
 ['SQL GROUP BY / aggregation',63,596],['Spring Boot controllers + DTO',68,null],['JUnit and CI',70,null],
 ['SQL window functions',63,178],['Angular / TypeScript',67,null],['Network + OS',62,null],['System design tradeoffs',65,null]
];
export function decemberTasks(date,{dueProblems=[],dueSkills=[],light=false,sprintOverride={}}={}){
 if(!date.startsWith('2026-12'))return null;
 const day=Number(date.slice(-2));const rev=DECEMBER_ROTATION[(day-1)%DECEMBER_ROTATION.length];const tech=DEC_TECH[(day-1)%DEC_TECH.length];
 const weekend=[0,6].includes(new Date(date+'T12:00:00').getDay());const recall=dueProblems.slice(0,2).map(p=>'#'+p.id).join(', ')||'#'+rev[1];
 const study=dueSkills.slice(0,1).map(s=>s.text).join(' · ')||rev[0]+' (draw the invariant and Big-O)';
 const project=day<=8?'Scaffold CityCircle data model, screens and tests':day<=16?'Build the first CRUD API and React/Angular prototype':day<=24?'Connect frontend to API, test error states': 'Deploy a demonstrable slice and document decisions';
 const tasks=[
  CLEAN(date,'recall','Spaced recall · '+rev[0],'Blank editor review: '+recall+'; '+study+'. Record RED/YELLOW/GREEN honestly. Revisit after 1/3/7/14/30 days rather than treating one solve as mastery.',20,{category:'review',problemId:dueProblems[0]?.id||rev[1],skillId:dueSkills[0]?.id}),
  CLEAN(date,'solve','Solve new variation · #'+rev[2],'Recommended #'+rev[2]+' to transfer the old pattern to a different problem. Three test cases, independent Java and complexity.',weekend?45:35,{category:'leetcode',problemId:rev[2]}),
  CLEAN(date,'engineer',sprintOverride.engineering||tech[0],sprintOverride.engineeringExercise||('Experiment in a sandbox with '+tech[0]+'; write a query, tiny program or request trace. Explain why it works.'),weekend?35:25,{category:'engineering',sectionPage:tech[1]}),
  CLEAN(date,'project','Project shipping · 1 small artifact',sprintOverride.project||project,weekend?70:25,{category:'project'}),
  CLEAN(date,'reflection','Reflect + repair weak areas','Name what you can solve again without help; mark RED/YELLOW as revisit targets. Every other Sunday, re-solve a problem from 14 days earlier.',10,{category:'review'})
 ];
 if(tech[2])tasks.splice(3,0,CLEAN(date,'sql-drill','SQL LeetCode · #'+tech[2],'Open SQL #'+tech[2]+'; save SELECT/JOIN/aggregate query and explain it without notes.',weekend?30:20,{category:'leetcode',problemId:tech[2],optional:!weekend}));
 if(light)return [ {...tasks[0],minutes:12}, {...tasks[1],minutes:12}, CLEAN(date,'light-note','Light-day momentum','Quickly write the key invariant or one SQL/OOP fact. Rest is allowed.',5,{category:'optional',optional:true}) ];
 return tasks;
}
export function acceleratedWeekProblemIds(sprint){const ids=[];for(let i=0;i<7;i++){const day=addStudyDays(sprint.monday,i),row=NOVEMBER_DAILY[day];if(!row)continue;for(const id of [...row.problemIds,...row.sqlIds])if(!ids.includes(id))ids.push(id)}return ids}
