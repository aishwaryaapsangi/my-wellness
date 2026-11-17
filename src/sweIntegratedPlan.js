import {addStudyDays,reviewDue} from './sweStudyLogic.js';
import {novemberTasks,decemberTasks,acceleratedWeekProblemIds} from './sweAcceleratedNovember.js';

// An editable plan, not an official Google interview syllabus or hiring forecast.
// Week 1 begins Monday November 16, 2026. Some weeks are intentionally retrieval-heavy.
export const PLAN_START='2026-11-16';
export const OFFICIAL_SWE_II={
 title:'Software Engineer II, Early Career',
 url:'https://www.google.com/about/careers/applications/jobs/results/109116638069957318-software-engineer-ii-early-career',
 locations:'Includes New York, NY',
 asOf:'2026-11-16',
 closesAtLeast:'2026-11-27',
 notes:'Official listing observed November 16, 2026; “open until at least Nov 27” is not a guaranteed close date. Recheck live posting and eligibility.'
};
export const APPLICATION_RULES=[
 'Look at the live Google Careers listings every Friday starting NOW; SWE II roles can open outside a fixed new-grad season.',
 'Check minimum qualifications, NYC location, role level, degree/grad-year restrictions, work authorization and team fit.',
 'Current Google Careers limit: at most 3 applications in a rolling 30-day window; 90 days before re-applying to the SAME job.',
 'Save the job URL, date viewed, job ID, application date, next action, status and why you fit.',
 'A referral is optional; build authentic relationships starting now rather than mass messaging strangers.',
 'May 31, 2027 is your own mock-readiness assessment, not a Google application opening date.'
];
export const MONTH_FOCUS=[
 {key:'2026-11',title:'November · complete DSA first-pass',stage:'Accelerated foundations',dsa:'Across 15 days: arrays, lists, hashing, strings, two pointers, windows, stacks, queues, linked lists, search, sorting, trees, heaps, graphs, tries, recursion, backtracking, greedy, union-find, DP and bit tricks',java:'Fast Java baseline, Big-O, OOP and collections; test concepts with independent problems',eng:'SQL SELECT/JOIN/GROUP BY/window functions + OOP, HTTP, Spring Boot, testing and Git',project:'Define an original project, draw wireframes, create repo and README, implement data model + first API stub',career:'Verify live Google SWE II openings, build truthful resume story and identify skill gaps',proof:'Broad topic map + DSA diagnostic; independently code across several families. Coverage is NOT mastery.'},
 {key:'2026-12',title:'December · recall + strengthen everything',stage:'Spaced practice + build',dsa:'Cycle ALL November families every 14 days; scheduled RED/YELLOW/1-3-7-14-day recalls plus unseen Easy/Medium variations',java:'Java syntax re-solves from memory: OOP, collections, recursion, heaps/trees/graphs and invariants',eng:'Rotating SQL JOIN, aggregates, windows, OOP, Spring, HTTP, testing, networking and system design',project:'Build first CRUD API and frontend prototype, connect them and test critical failures',career:'Review active NYC roles each week; GitHub/LinkedIn proof and authentic networking',proof:'Independent re-solves across all DSA topics + SQL queries + tangible project changes'},
 {key:'2027-01',title:'January · transfer patterns + backend depth',stage:'Unseen medium + engineering',dsa:'Interleave arrays, hashing, recursion, trees, heaps, graphs and DP; spend more time on unseen Medium variants',java:'Generics, interfaces, collections, complexity proofs and independently clean implementations',eng:'Spring Boot, SQL transactions/indexes, Angular, APIs and testing',project:'Hardening CRUD, PostgreSQL migrations, validation and deployed beta API',career:'STAR stories and informational conversations',proof:'Unseen Medium walkthroughs, tested API changes and database schema'},
 {key:'2027-02',title:'February · ship an MVP',stage:'Build',dsa:'Trees/BST, graph BFS/DFS, backtracking',java:'Graph traversal syntax, recursion state and stack frames',eng:'Angular/TypeScript, RxJS, API auth/security',project:'Working Angular + Spring Boot app with CRUD and tests',career:'Check live role fit every week; refine introduction',proof:'Working MVP and unseen Medium attempts without copying'},
 {key:'2027-03',title:'March · engineering depth',stage:'Engineering + mocks',dsa:'Greedy, weighted graphs, DP intro, mixed reviews',java:'Unit tests, Java debugging and safe collections',eng:'CI/CD, indexes, concurrency basics, caching, networking',project:'Deploy, add integration tests, errors and observability',career:'Start selective fit-based applications and recruiter prep',proof:'Deployed app and one timed mock per week'},
 {key:'2027-04',title:'April · evidence and interviews',stage:'Mocks + portfolio',dsa:'DP variations, mixed unseen Mediums, re-solves',java:'Code from memory, Big-O and verbal explanations',eng:'SQL EXPLAIN, accessibility, scalable API design',project:'Performance improvement, accessibility and architecture write-up',career:'Resume V2, STAR stories, networking follow-ups, live role applications',proof:'At least 2–3 realistic mocks and complete portfolio draft'},
 {key:'2027-05',title:'May · prove readiness',stage:'Readiness gate',dsa:'Blind coding mocks and weak-pattern repair',java:'Java core API recall and error log',eng:'System design and code review / engineering judgment',project:'Architecture README, demo, test report and portfolio proof',career:'Apply selectively if eligible; formal review on May 31',proof:'Readiness evidence across eight pillars (not an official score)'},
 {key:'2027-06',title:'June · application ramp',stage:'Applications + continued study',dsa:'Mixed unseen Mediums + 14/30/60-day recall',java:'Interview-safe implementation under pressure',eng:'Systems tradeoffs and team-specific technical reading',project:'Maintain flagship app and fix actual issues',career:'Broader targeted applications if ready; referrals and tracking',proof:'Thoughtful applications and practice not stopped'},
 {key:'2027-07',title:'July · adjust from signals',stage:'Recruiting',dsa:'Reattempt weakest families and timed review',java:'Memory-based coding fluency',eng:'System tradeoffs, observability, distributed systems',project:'Reliability and feature refinement',career:'Recruiter screens, feedback notes and ongoing role checks',proof:'Specific improvements from screening/mock performance'},
 {key:'2027-08',title:'August · keep momentum',stage:'Recruiting',dsa:'Mixed intervals, graphs, DP and practice mocks',java:'DSA memory drills',eng:'OOP, SQL, API security, testing recaps',project:'Maintenance and clear ownership evidence',career:'Track live opportunities; revisit resume and genuine connections',proof:'High-quality continued applications and retained skills'},
 {key:'2027-09',title:'September · review and adapt',stage:'Adjust course',dsa:'Cumulative full-pattern retrieval and interview rehearsals',java:'Java foundations kept fresh',eng:'One selected skill gap per sprint',project:'Fix rough edges and document learnings',career:'Audit feedback, role fit and next hiring opportunities',proof:'A fresh 90-day improvement plan if needed'}
];
const raw=[
 // dsa theme | recurring engineering deep dive | book page | exact engineering proof | portfolio deliverable | career action | recommended LeetCode
 ['Accelerated DSA first pass A: arrays, hashing, strings, pointers, stacks, trees, graphs','Java OOP + SQL joins / filters',31,'Write Java equals/hashCode plus SQL joins with test cases','Choose project problem, wireframes, repo, README and data model','Review live NYC SWE II roles and identify qualification gaps',[27,217,104]],
 ['Accelerated DSA first pass B: recursion, backtracking, trie, greedy, DP, graph algorithms','SQL aggregation, Java OOP, HTTP, Spring and tests',63,'Solve SQL JOIN + GROUP BY, draw API requests and test edge cases','Develop database design, first endpoint and source-controlled project','Track current role fit and record one nonconfidential work story',[78,198,207]],
 ['November diagnostics → December active recall of ALL structures','SQL windows / API testing',63,'Re-solve old Java question and SQL JOIN from memory','Ship first API stub and choose December MVP slices','Prepare December weekly role-watch routine',[560,27,104]],
 ['DECEMBER SPACED REVIEW: all DSA families, graph + DP included','Java OOP revisit + API design',31,'Blank-file Java and OOP / SQL retrieval','Advance project schema and CRUD prototype','Review live applications and December priorities',[27,200,198]],
 ['Strings and StringBuilder','SQL joins + primary/foreign keys',63,'Create tables and JOIN demo data','Draw ERD and define unique constraints','Clean portfolio homepage links',[1768,125,14]],
 ['Two pointers + sorting','Java Collections & streams',29,'Convert List<Integer> ↔ int[] by memory','Project scaffold + README decisions','Two authentic outreach contacts max',[167,977,15]],
 ['Sliding window basics','REST status codes + error contracts',64,'Write example 200/400/401/404 response contracts','Implement first tiny endpoint and tests','Review any eligible live role',[643,3,209]],
 ['MONTHLY RETRIEVAL: mixed easy patterns','JUnit + testing pyramid',70,'Write 3 edge-case JUnit assertions','Run tests and refactor API setup','Refresh resume bullets for year-end',[121,217,27]],
 ['Prefix sums + hash counts','SQL GROUP BY, HAVING, normalization',63,'Create grouped aggregate query + one index','Write Postgres schema + migrations','Record January skills, career notes',[724,560,49]],
 ['Binary search + bounds','Spring Boot DTO + validation',68,'Validate request input and map a response','Implement CRUD controllers + DTOs','Read one relevant SWE II job spec',[704,35,875]],
 ['Linked lists and pointer updates','Angular + TypeScript foundations',67,'Type an API payload, component and error state','Begin frontend screens and routing','Practice 45-sec concise intro',[206,21,141]],
 ['MONTHLY RETRIEVAL: search, list, trees','Operating systems + concurrency intro',62,'Trace thread vs process; one simple race','Backend and frontend integration checkpoint','Reconnect with an alumni contact',[704,206,104]],
 ['Tree recursion / BST','SQL transactions + indexes',63,'Explain isolation and EXPLAIN plan on sample table','Design authentication and privacy boundaries','Build a verified 2-role shortlist',[104,98,235]],
 ['Graph BFS/DFS + grids','RxJS, async calls and interceptors',67,'Draw observable request + cancellation + errors','Build create/list/filter front-end + API','Shortlist team questions for an info chat',[200,994,102]],
 ['Backtracking, state undo','Web auth, validation and security',64,'Model auth vs authorization; 3 threat cases','Implement login and RSVP flow','Mock behavioral ownership story',[78,46,79]],
 ['MONTHLY RETRIEVAL: tree/graph/backtrack','System design: one service end to end',65,'Draw a service design with data flow and tradeoffs','Present complete MVP to yourself; fix blockers','Check live roles and update readiness gaps',[200,102,78]],
 ['Intervals + greedy choices','CI/CD + test strategy',70,'Make a test matrix for API changes','CI with unit/integration test gates','Conduct first 45-minute full mock',[56,435,55]],
 ['Weighted graphs, topo sort','SQL indexes, pagination and joins',63,'Explain index vs full scan and pagination tradeoff','Implement server pagination and test it','Review all active role requirements',[207,743,684]],
 ['Dynamic programming introduction','Networking + caching / latency',64,'Explain DNS/TLS, cache vs DB and failures','Deploy real app; verify logs and errors','Write one technical project update',[198,322,1143]],
 ['MONTHLY RETRIEVAL: mixed problem families','Testing/debugging + incident analysis',70,'Root-cause one nonconfidential bug with hypotheses','Harden deployed app and fix integration failures','Refine resume from real evidence',[56,207,198]],
 ['Dynamic programming next steps','OOP design: interfaces/composition revisit',31,'Refactor an example to use composition','Accessible forms, keyboard UX and tests','Draft 3 additional STAR stories',[300,72,1143]],
 ['Mixed unseen Medium practice','SQL EXPLAIN and query optimization',63,'Compare query plans before/after an index','Measure one improvement and document numbers','Apply to appropriate open roles if ready',[560,15,347]],
 ['Timed coding communication','System design: scaling and data modeling',65,'Design an API with cache/rate limit/failure plan','Write architecture tradeoff document','Ask one genuine referral/contact follow-up',[200,207,875]],
 ['MONTHLY RETRIEVAL: unseen + old','Observability and deployment review',70,'Practice rollback, logs and alert diagnosis','Ship app v2 and give a two-minute demo','Prep your final resume and outreach materials',[322,200,56]],
 ['Mixed patterns + Java memory','Threads, locks and deadlocks',62,'Explain a race and safe alternatives','README architecture and tests','Audit NYC role fit and preferences',[1,98,72]],
 ['DP + graph revisit','Distributed systems: consistency basics',65,'Explain idempotency, retries and eventual consistency','Record 2-minute demo and technical narrative','Prepare mock recruiter call',[322,207,200]],
 ['Weak-pattern interventions','Code review/refactoring discipline',70,'Refactor a function, test edge cases','Portfolio screenshots and final README','Run 2 blind mocks this week',[206,875,1143]],
 ['MONTHLY RETRIEVAL + readiness audit','OOP+SQL+HTTP cumulative recall',63,'Quiz yourself on joins, transactions and identity','Validate project and portfolio links','May 31 self-assessment; adapt if not ready',[1,198,200]],
 ['Readiness decision + mixed Medium','System design tradeoff review',65,'Verbal walk-through of full-stack request','Close documentation gaps','Selective Google SWE II applications when fit',[56,322,49]],
 ['Mixed patterns + review debt','API contracts, testing and security',68,'End-to-end smoke test and failure handling','Fix one real user-facing issue','Weekly live job scan + track deadlines',[200,347,435]],
 ['Unseen 45-minute mock','SQL + indexes revisit',63,'Design tables and an optimized query','Measure performance after fix','Refine resume based on response signals',[743,560,875]],
 ['MONTHLY RETRIEVAL + interview','Debugging, incident response',70,'Hypothesis-driven diagnosis of a simulated failure','Maintain tests and deployment','Review applications, set next actions',[15,1143,98]],
 ['Graph and DP mixed rounds','Software architecture, modularity',65,'Tradeoff monolith vs services at early-career scale','Polish error reporting and documentation','Meaningful networking follow-up',[207,300,200]],
 ['Java coding clean-room practice','OOP and Collections reprise',31,'Write equals/hashCode and map practice from memory','Improve accessibility based on audit','Verify live role fit and eligibility',[1,206,78]],
 ['Tree, graph and heap recall','Observability + SLO fundamentals',70,'Explain latency, errors and realistic alert checks','Add diagnostics or error boundaries','Run recruiter/STAR interview practice',[104,215,347]],
 ['MONTHLY RETRIEVAL + error log','SQL and relational data modeling',63,'Write a join + transaction with rollback in sandbox','Audit architecture and tests','Review 30-day application limit',[560,200,322]],
 ['Mixed timed coding','Network troubleshooting basics',64,'Trace DNS→HTTP→service failure','Fix one documented reliability issue','Keep role/app history complete',[3,875,200]],
 ['Unseen pattern mixes','Java concurrency revision',62,'Explain synchronized and race conditions','Do test coverage cleanup','Mock screening + behavioral story',[56,207,198]],
 ['Recursion + iterative comparison','Spring Boot security & validation',68,'Review rejected invalid requests and auth boundary','Security scan and dependency check','Check any newly opened role',[78,46,104]],
 ['MONTHLY RETRIEVAL: all foundations','Accessible frontend + component design',67,'Keyboard and screen-reader feature check','Small user-experience polish','Review contacts & next steps',[27,724,200]],
 ['Graph/DP review and mock','Database transactions / locks',63,'Explain SQL isolation with a counterexample','One meaningful production-like refactor','Record hiring signals and learning gaps',[743,72,322]],
 ['Java & algorithm pattern recall','Cloud deployment and secrets',70,'Diagram secure configuration across environments','Audit tests, release path and logs','Continue early-career role watch',[21,49,207]],
 ['Unseen coding + live explanation','System design recap',65,'Explain system from request to data to deploy','Update portfolio demos','Review plan based on responses',[875,55,200]],
 ['MONTHLY RETRIEVAL + next 90 days','Deepest weakness from mocks',70,'Pick one failing mock criterion and remediate','Write next quarter engineering milestone','Write 90-day role-search adaptation plan',[1,98,560]]
];
export const WEEKLY_SPRINTS=raw.map((r,i)=>({
 id:'week-'+(i+1),index:i+1,monday:addStudyDays(PLAN_START,i*7),ends:addStudyDays(PLAN_START,i*7+6),
 dsa:r[0],engineering:r[1],engineeringPage:r[2],engineeringExercise:r[3],
 project:r[4],career:r[5],problemIds:r[6],
 java:i<10?'Java fluency and collections':i<23?'Java collections, recursion and design': 'Java implementation, APIs and review',
 revisionWeek:(i+1)%4===0,biweekly:(i+1)%2===0
}));
export function weekIndexFor(date){const difference=Math.floor((Date.parse(date+'T12:00:00Z')-Date.parse(PLAN_START+'T12:00:00Z'))/86400000);return Math.max(0,Math.min(WEEKLY_SPRINTS.length-1,Math.floor(difference/7)))}
export function sprintForDate(date){return WEEKLY_SPRINTS[weekIndexFor(date)]}
export function monthForDate(date){return MONTH_FOCUS.find(m=>m.key===date.slice(0,7))||MONTH_FOCUS[MONTH_FOCUS.length-1]}
export function sprintDates(sprint){return Array.from({length:7},(_,i)=>addStudyDays(sprint.monday,i))}
export const DAY_NAMES=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export const DAY_ROLE=[
 ['Foundation + syntax','25–45 min · concept first'],
 ['LeetCode practice','35–45 min · code, test, explain'],
 ['Technology deep dive','30–50 min · rotate engineering skills'],
 ['DSA variation + Java','35–50 min · build transfer'],
 ['Revision + career','10–30 min · flexible evening'],
 ['Project build + coding','75–120 min · concrete artifact'],
 ['Review + plan','50–85 min · long-term retention']
];
export function getDailyTasks(date,options={}){
 const accelerated=novemberTasks(date,options)||decemberTasks(date,options);
 if(accelerated)return accelerated;
 const sprint={...sprintForDate(date),...(options.sprintOverride||{})},weekday=Math.round((Date.parse(date+'T12:00:00Z')-Date.parse(sprint.monday+'T12:00:00Z'))/86400000);
 const ids=sprint.problemIds,primary=ids[Math.min(ids.length-1,weekday===3?1:weekday===5?2:0)],second=ids[1]||ids[0];
 const clean=(type,label,detail,minutes,extra={})=>({id:date+':'+type,type,label,detail,minutes,...extra});
 const dueLeet=(options.dueProblems||[]).slice(0,2),dueSkills=(options.dueSkills||[]).slice(0,2);
 const dueText=dueLeet.length?dueLeet.map(p=>'#'+p.id+' '+p.title).join(', '):'Last RED/YELLOW problem or the weakest old array pattern';
 const skillText=dueSkills.length?dueSkills.map(s=>s.text).join(' / '):'One earlier Java syntax or CS note from memory';
 const baseReview=clean('recall','Active recall before new material',dueText+' · plus '+skillText+'. Attempt without opening the solution, then grade the result in the dojo / skills tab.',12,{category:'review',problemId:dueLeet[0]?.id||null,skillId:dueSkills[0]?.id||null});
 const reviewHeavy=sprint.revisionWeek;
 const problemDetail='Recommended: #'+primary+'. State brute force → optimized invariant → code Java → test three edge cases → complexity.';
 const tasks={
 0:[baseReview,clean('concept','Learn this week’s DSA family',sprint.dsa+' · 2-minute definition + index/pointer/state sketch and one tiny Java drill.',28,{category:'dsa',sectionHint:sprint.dsa}),clean('engineering-warmup','Preview the engineering question',sprint.engineering+' · write a question your Wednesday experiment should answer.',12,{category:'engineering',sectionPage:sprint.engineeringPage})],
 1:[baseReview,clean('solve','New LeetCode attempt',reviewHeavy?'Review-focused week: solve from a blank editor and explain your most recent mistake. '+problemDetail:problemDetail,40,{category:'leetcode',problemId:primary}),clean('error-log','Document the logic and test cases','Write one invariant, one syntax trap, Big-O and what you will recall after 1/3/7/14 days.',10,{category:'review'})],
 2:[baseReview,clean('deep-dive','Engineering lab · weekly rotating technology',sprint.engineering+' · '+sprint.engineeringExercise+'. Use a small standalone example, not confidential employer code.',40,{category:'engineering',sectionPage:sprint.engineeringPage}),clean('transfer','Connect this to your SWE job','Draw where this concept appears in a UI → API → DB → deployment workflow.',10,{category:'engineering'})],
 3:[baseReview,clean('variation','LeetCode variation or re-solve',reviewHeavy?'Blank-file redo, no hints · '+dueText:'Recommended #'+second+'; compare approaches and explain the pointer/state update.',35,{category:'leetcode',problemId:dueLeet[0]?.id||second}),clean('java-recall','Java coding memory check',sprint.java+' · write a related snippet from memory (arrays, maps, lists, equals or recursion).',15,{category:'java'})],
 4:[baseReview,clean('retrospective','Light reflection + career watch','Write one engineering accomplishment safely; '+sprint.career+'.',18,{category:'career'}),clean('choice','Flexible evening or catch-up','Optional: repair one red concept, review an application or take the evening off.',10,{category:'optional',optional:true})],
 5:[baseReview,clean('project','Build something real in your flagship project',sprint.project+' · commit/test one visible artifact, not a tutorial-only session.',75,{category:'project'}),clean('independent','Independently solve a pattern problem','Recommended #'+ids[2]+'; if hints are used, grade YELLOW. Document 3 edge tests.',35,{category:'leetcode',problemId:ids[2]})],
 6:[baseReview,clean('two-week-review','Two-week LeetCode + concept reattempt',sprint.biweekly?'MANDATORY 14-day retrieval: pick two problems first learned approximately two weeks ago; re-solve them from blank files. Check Java and engineering notes too.':'Recall a problem from last week and a concept from at least seven days ago.',25,{category:'review',problemId:dueLeet[0]?.id||ids[0]}),clean('weekly-review','Sunday engineering and learning review','What did I learn, build, debug, test and explain? Which RED/YELLOW items move to next week?',25,{category:'review'}),clean('career','Portfolio + job strategy check',sprint.career+' · make a tiny next step. Always verify live posting dates.',20,{category:'career'})]
 };
 const list=tasks[weekday]||tasks[0];
 if(options.light) return list.filter(t=>['review','leetcode'].includes(t.category)).slice(0,2).map(t=>({...t,minutes:Math.min(t.minutes,12)})).concat([clean('light-note','Light-day win',sprint.engineering+' or '+sprint.dsa+': say one takeaway out loud and move on.',5,{category:'optional',optional:true})]);
 return list;
}
export function dueCounts(records,asOf){
 return Object.values(records||{}).filter(item=>reviewDue(item,asOf)).length;
}
export function planProgress(checks,sprint,lightDays={},dueForDate=()=>({})){
 const days=sprintDates(sprint);let total=0,completed=0;
 for(const date of days){const tasks=getDailyTasks(date,{...dueForDate(date),light:!!lightDays[date]});total+=tasks.filter(t=>!t.optional).length;completed+=tasks.filter(t=>!t.optional&&!!checks[t.id]).length}
 return {total,completed,pct:total?Math.round(completed/total*100):0};
}
