export const EARLIER_PRACTICE=[
 {id:1732,title:"Find the Highest Altitude",pattern:"running sum / max"},
 {id:1470,title:"Shuffle the Array",pattern:"index mapping"},
 {id:27,title:"Remove Element",pattern:"read/write pointer"},
 {id:485,title:"Max Consecutive Ones",pattern:"running streak"},
 {id:1389,title:"Create Target Array in the Given Order",pattern:"ArrayList insert"},
 {id:118,title:"Pascal's Triangle",pattern:"2D lists"},
 {id:989,title:"Add to Array-Form of Integer",pattern:"digit carry"},
 {id:1295,title:"Find Numbers with Even Number of Digits",pattern:"digit loops"},
 {id:1051,title:"Height Checker",pattern:"sort and compare"},
 {id:1920,title:"Build Array from Permutation",pattern:"array mapping"},
 {id:88,title:"Merge Sorted Array",pattern:"two-pointer from end"},
 {id:414,title:"Third Maximum Number",pattern:"running distinct best"},
 {id:66,title:"Plus One",pattern:"carry from end"},
 {id:682,title:"Baseball Game",pattern:"ArrayList / stack simulation"}
];
// These are known prior *attempts*, never auto-marked Green or solved independently.
export const ROADMAP=[
 {id:"nov26",label:"November 2026",phase:"01 • Plant the basics",themes:["Java syntax and types","1D / 2D arrays","ArrayList, equality and references","Easy problem explanations"],proof:"Solve an unseen array Easy from scratch; narrate a trace",hours:"5–7 h/week",topics:["Java fundamentals","Arrays / strings"],kind:"foundation"},
 {id:"dec26",label:"December 2026",phase:"02 • Build the patterns",themes:["Strings and HashMap","Two pointers and prefix sums","Sliding window basics","Binary search and stack introduction"],proof:"30–40 curated attempts/re-attempts logged, including RED/YELLOW recovery",hours:"7–9 h/week",topics:["Hashing","Two pointers","Sliding windows"],kind:"foundation"},
 {id:"jan27",label:"January 2027",phase:"03 • Connect structures",themes:["Linked lists","Recursion and trees","Basic heaps","Spring Boot schema foundations"],proof:"Explain familiar-pattern Mediums and a database schema",hours:"6–8 h/week",topics:["Linked lists","Trees, BSTs & traversals"],kind:"build"},
 {id:"feb27",label:"February 2027",phase:"04 • Explore the graph",themes:["BST and tree BFS/DFS","Graphs and visited-state","Backtracking","Working full-stack MVP"],proof:"Complete a demo-worthy MVP and some unseen Mediums",hours:"6–8 h/week",topics:["Graphs & grids","Recursion & backtracking"],kind:"build"},
 {id:"mar27",label:"March 2027",phase:"05 • Develop depth",themes:["Greedy and intervals","Union-find and shortest path","DP foundations","OS, SQL, networks, deployment"],proof:"One timed mock weekly + deployed project",hours:"7–9 h/week",topics:["Greedy & intervals","Dynamic programming"],kind:"depth"},
 {id:"apr27",label:"April 2027",phase:"06 • Practice under pressure",themes:["DP extensions","Mixed unseen Mediums","STAR stories and recruiting","Portfolio quality and accessible UI"],proof:"2–3 realistic mocks, portfolio and resume ready",hours:"7–9 h/week",topics:["Dynamic programming","Behavioral"],kind:"practice"},
 {id:"may27",label:"May 2027",phase:"07 • Readiness gate",themes:["Blind 45-minute mocks","Weak-pattern repair","Code comprehension + AI verification","Eight-pillar readiness review"],proof:"Independent mock evidence by May 31; adjust if needed",hours:"7–9 h/week",topics:["Algorithms & data structures","Engineering practice"],kind:"practice"},
 {id:"jun27",label:"June–September 2027",phase:"08 • Apply thoughtfully",themes:["Verify live SWE II / L3 requisitions","Referrals based on genuine relationships","Coding rounds and hiring process","Continue engineering growth"],proof:"Track role fit and applications, adapt to actual results",hours:"Flexible",topics:["Career & networking"],kind:"apply"}
];
export const WEEKLY_RHYTHM=[
 {day:"Mon",focus:"Concept garden",minutes:"30–45 min",tasks:["One tiny Java concept","Two syntax drills","Sketch a memory diagram"]},
 {day:"Tue",focus:"Pattern practice",minutes:"35–45 min",tasks:["One targeted LeetCode question","Debug first wrong attempt","Record RED / YELLOW / GREEN"]},
 {day:"Wed",focus:"Recall day",minutes:"25–40 min",tasks:["Spaced review queue","Re-solve without notes","Explain invariant aloud"]},
 {day:"Thu",focus:"Apply + API",minutes:"35–45 min",tasks:["Another pattern variation","10-minute Java API recall","Big-O explanation"]},
 {day:"Fri",focus:"Gentle reset",minutes:"Optional 15–25 min",tasks:["Review error log","Plan the next weak concept","Rest if work is heavy"]},
 {day:"Sat",focus:"Deep-focus studio",minutes:"75–120 min",tasks:["New challenge","Independent redo","Write 3 edge tests"]},
 {day:"Sun",focus:"Engineer hour",minutes:"60–90 min",tasks:["Full-stack project / CS","Career evidence journal","Adjust next week's plan"]}
];
export const PROJECT_PLAN=[
 {id:"scope",month:"Nov–Dec 2026",title:"CityCircle: scope and architecture",deliverables:["User stories + wireframes","Minimum feature list and boundaries","Repo skeleton and architecture sketch"]},
 {id:"backend",month:"Jan 2027",title:"Backend and data ownership",deliverables:["Spring Boot REST endpoints and DTO validation","PostgreSQL schema + migrations","Authentication design, unit tests"]},
 {id:"mvp",month:"Feb 2027",title:"Working full-stack MVP",deliverables:["Angular responsive UI","Event create/edit/filter and RSVP","Backend integration and local setup"]},
 {id:"quality",month:"Mar 2027",title:"Deployment and reliability",deliverables:["CI checks + API integration tests","Deployment with secrets kept private","Logs, errors and a live demo"]},
 {id:"depth",month:"Apr 2027",title:"Technical depth and accessibility",deliverables:["Accessibility and keyboard audit","One measured performance improvement","Architecture / tradeoff write-up"]},
 {id:"package",month:"May 2027",title:"Portfolio-ready proof",deliverables:["README, diagrams, setup and screenshots","2-minute demo walkthrough","Resume-safe personal contributions and lessons"]}
];
export const READINESS=[
 {id:"java",name:"Java from memory",test:"Use common array, List, String, Map, heap and graph syntax without copying."},
 {id:"patterns",name:"Algorithm patterns",test:"Explain at least one novel variation from each major DSA family."},
 {id:"unseen",name:"Unseen coding",test:"Solve fresh Easies and a meaningful share of unseen Mediums independently."},
 {id:"talk",name:"Interview communication",test:"Clarify, baseline, optimize, code, test, Big-O, then adapt to follow-ups."},
 {id:"mocks",name:"Timed coding mocks",test:"Record at least four realistic mocks and review the mistakes."},
 {id:"systems",name:"CS + practical design",test:"Explain OS, SQL, HTTP, APIs and one coherent service with tradeoffs."},
 {id:"engineering",name:"Shipped engineering",test:"Explain a genuine work feature and a deployed personal app with test evidence."},
 {id:"career",name:"Career preparedness",test:"Truthful resume, 8–10 STAR stories, networking and role-fit checks."}
];
export const LESSON_LOOP=[
 "Explain the idea in two plain-English sentences",
 "Write the exact Java syntax from memory",
 "Trace a tiny example on paper",
 "Name one compile bug and one logic bug",
 "Solve a small drill before LeetCode",
 "Attempt a targeted problem without copying",
 "Test normal + boundary + adversarial cases",
 "Explain time and auxiliary-space complexity",
 "Schedule recall after 1, 3, 7, 14, 30 and 60 days"
];
