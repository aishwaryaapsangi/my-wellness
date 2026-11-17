# Google SWE: long-horizon mastery contract (living roadmap)
Updated: 2026-11-17. Owner goal: land a Google SWE role; prep does not stop in December or at an arbitrary calendar milestone.

## Non-negotiable principles
1. Cover **every DSA family and its atomic subskills**, not just Arrays/ArrayList/Hashing. Track `family > subtopic > atomic skill > recall prompt > code exercise > tagged LeetCode problems`.
2. On each study day, normally teach **one new atomic concept** and **one previously due concept** selected from across the entire curriculum; maintain separate, optional problem reattempts. If due backlog gets large, prioritize overdue RED, then YELLOW, then GREEN; never permanently discard.
3. Never equate "viewed", "checked off", "attempted", and "mastered." Require independent explanation, Java implementation, trace, boundary tests, and complexity analysis. Each skill and problem has its own record/history/due date.
4. Use a spaced-retrieval ladder: 1, 3, 7, 14, 30, 60 days as initial intervals. After 60-day success, schedule recurring **maintenance recalls** (e.g. 60–90 days, adjustable), including after May/September 2027, until an offer is accepted. RED resets to near-term, YELLOW shortens; GREEN advances only with evidence.
5. Personalize by capacity and evidence, not a rigid weekly ceiling. Keep a minimum sustainable day and an optional acceleration lane for faster coverage. Earlier exposure to graph/DP is fine; it is *not mastery*.
6. Application and interview prep operate **in parallel** from now on. Monitor live eligibility; never imply a public hiring timetable or a guaranteed timeline to an offer.
7. Track data reality: the current GitHub Pages app persists study records in browser localStorage (`bloom-google-swe-prep-v1`), with a manual export/import flow. GitHub repository source is NOT the user's live progress database. Cross-device account-based sync requires a separately designed authenticated backend/migration and should not put private study notes in a public repo.

## Complete DSA and Java micro-syllabus
Every semicolon-separated unit below is an independently teachable/reviewable *skill*, not a single daily lecture.

### 0. Java & computer-science fundamentals
Primitives/references/autoboxing; null and NPE; int overflow; array allocation/defaults/indexing; 2D arrays/jagged rows; ArrayList construction/get/set/add/remove/size; Arrays.copyOf/copyOfRange/fill/sort/binarySearch/equals/deepEquals; Collections.sort/reverse/frequency; String immutability/charAt/substring/equals; char and ASCII/Unicode basics; StringBuilder; loops/enhanced loops; generics; equals/hashCode contract; comparator/comparable; Map/Set/List/Deque interfaces; HashMap/HashSet operations and null behavior; TreeMap/TreeSet; PriorityQueue comparators; Stream mapToInt vs primitives; recursion syntax; custom classes/node definitions; Big-O and amortized analysis; space vs auxiliary space; common Java pitfalls.

### 1. Arrays and strings
Array traversal; running max/min; counters and frequency; index mapping; in-place write pointer; opposite-end two pointers; fast/slow distinct duplicates; array rotation/reversal; digit carry; prefix/suffix sums; prefix frequency map; difference array; Kadane; fixed and variable sliding window; monotonic deque/window max; subarray versus subsequence; sorting and comparator; string scanning; palindrome; anagram signature; StringBuilder transformations; substring indexing; matrix row/column traversal; boundary simulation; transpose/rotate; grid neighbors.

### 2. Hashing, counting and sets
HashMap get/put/containsKey/getOrDefault; HashSet add/contains/remove; duplicate checks; frequency counts; grouping anagrams; pair/complement lookup; prefix-sum counts; iteration/order caveats; key equality and hashing; collisions/load-factor intuition; map of sets/lists; sliding-window frequencies.

### 3. Linked lists
Node pointers; head/tail; traversal; insert/delete; dummy/sentinel; reverse iterative/recursive; merge sorted; fast/slow/middle; cycle detection; nth-from-end; split/merge; random pointer copy; doubly linked list; LRU-style map + list.

### 4. Stacks, queues, deques and monotonic structures
LIFO/FIFO; ArrayDeque APIs; balanced brackets; expression stack; monotonic increasing/decreasing stack; next greater/warmer; queue BFS; monotonic deque; queue using stacks; stack using queues; heap-vs-queue tradeoffs.

### 5. Search and sorting
Binary search exact/first/last/lower bound/upper bound; answer-space binary search; rotated sorted search; sorting comparator/stability; merge sort/quick sort concepts; partitioning; quickselect; counting/bucket sort; runtime tradeoffs.

### 6. Trees, BST and heaps
Tree vocabulary/node definitions; recursion stack; preorder/inorder/postorder; iterative DFS; BFS levels; maximum depth; diameter/path accumulation; BST invariant/validation; BST insert/search/delete idea; LCA; reconstruct tree; heap invariant; min/max PriorityQueue; top-k; k-way merge.

### 7. Graphs, grids, union-find and tries
Adjacency list/matrix; directed/undirected; weighted/unweighted; visited timing; DFS recursive/iterative; BFS shortest unweighted path; grid islands/multi-source BFS; connected components; cycle detection; bipartite; DAG/topological sort/Kahn; Dijkstra + priority queue; Bellman-Ford awareness; minimum spanning tree/Kruskal/Prim; union-find parent/rank/path compression; trie insert/search/startsWith; word-search with trie.

### 8. Recursion, backtracking and divide/conquer
Base case; state parameters; call-stack diagrams; choose/explore/undo; subsets; permutations; combinations; duplicate suppression; constraint pruning; word search; N-Queens; merge sort divide/conquer; tree recursion return contracts.

### 9. Greedy, intervals, bitwise and math
Interval sort/merge/insert; scheduling/overlap; greedy proof and counterexamples; jump reachability; two-pointer greedy; bitwise AND/OR/XOR/shifts; bit masks; popcount; modular arithmetic; gcd; overflow-safe calculations.

### 10. Dynamic programming
Overlapping subproblems; state and transitions; memoization vs tabulation; 1D climb/rob/coin; 0/1 and unbounded knapsack; subset/partition; grid paths; string segmentation; LCS/edit distance; LIS; interval DP intro; 2D state; memory optimization; reconstruct solution; recognizing when greedy fails.

### 11. Additional interview domains
SQL filtering/joins/aggregation/subqueries/CTEs/windows/index basics; Java OOP/design; REST/HTTP/transactions/testing; CS fundamentals (OS, networking, concurrency); API/system-design tradeoffs appropriate to level; coding explanation and interviewer collaboration; behavioral STAR; resume and recruiting.

## Daily atomic lesson contract
- 5 min: retrieve **one due skill** from a different or earlier topic from memory; grade RED/YELLOW/GREEN; independently persist outcome/due date.
- 10–20 min: learn **one atomic skill** with mental model, diagram, handwritten Java API syntax, one compiler pitfall and one logic pitfall.
- 10 min: predict/trace example, 2 edge cases, Big-O explanation.
- 20–45 min: one calibrated LeetCode attempt or relevant short drill; record code, time, hints, bugs, grade and associated atomic skill(s).
- Optional stretch: harder variation, extra problem, SQL, project or mock; never allow optional work to erase overdue recalls.

## Problem progression, not calendar cutoff
- Phase A: clean Easy implementations for each foundation (fast, independent, bug-free).
- Phase B: targeted Mediums by pattern, including all major structures and DP/graph exposure.
- Phase C: mixed unseen Mediums and spaced resubmissions (recognize pattern without labels).
- Phase D: 35–45-minute interview simulations, follow-ups, testing and complexity discussion.
- Phase E: recruiting/interviews: continue daily one-skill recall, weekly mixed problems, mock refresh based on feedback, and active applications **until offer accepted**.
Problem lists are adjustable: do not count attempted problems as solved unless proven independent.

## Roadmap checkpoints (flexible)
- Nov–Dec 2026: inventory prior skills; fix Java/array/List gaps; first exposure to entire DSA map; begin ongoing micro recall; establish interview baseline.
- Jan–Feb 2027: substantial depth across linked lists, stacks, search, trees, graphs, backtracking, DP; portfolio MVP, SQL and engineering rotations; early qualified applications remain possible.
- Mar–May 2027: varied unseen Mediums, mixed mocks, weak-point triage, deployed engineering proof, resume/behavioral preparedness; May 31 is an internal review, NOT a stop date.
- Jun–Sep 2027: applications, interviews, portfolio refinement, continuing skills and recurring reviews.
- Oct 2027 onward: generate an unbounded rolling 2–4-week plan based on overdue recalls, weak subskills, current interviews and new roles. No terminal date.
- End state: offer accepted, not "finished a month" or "solved N questions."

## App implementation backlog, ordered
1. Retain all existing records, status semantics, UI and tests.
2. Make curriculum stable-data-driven with unique IDs for *all* atomic skills and relations to problems.
3. Create a **unified due engine** covering micro-concepts, handbook skills and LeetCode reviews; show *one prioritized mandatory concept recall* per day, and clearly distinguish optional problem reattempts.
4. Extend review scheduling after the 60-day stage indefinitely, with periodic maintenance reviews. Tests for repeated GREEN, RED reset, YELLOW retry and old overdue dates.
5. Replace finite end-date date-picker/sprint logic with rolling virtual weeks that work for any future date, keeping historical weeks intact.
6. Add a long-horizon journey view with months beyond 2027, adjustable checkpoints, and a visible "until offer" banner.
7. Add a mastery/coverage dashboard by DSA family: unstarted/seen/RED/YELLOW/GREEN/mock-ready, weakest atomic skills, next review, no falsely completed groups.
8. Support user-controlled import/export and, if explicitly set up, optional authenticated cross-device Supabase persistence with RLS and safe migrations. Never assume the browser data is already synced.
9. Add tests: data completeness, no duplicate micro IDs, one-day-one-new-concept, cross-family recall, overdue prioritization, beyond-2027 navigation, old record compatibility and offline behavior.

## Current repo reference map
- `src/sweMicroConcepts.js`: substantial micro-content library and assigned dates.
- `src/sweStudyLogic.js`: grades and 1/3/7/14/30/60 review ladder.
- `src/leetcodeStudyModel.js`: question attempt history and due dates.
- `src/sweIntegratedPlan.js`: finite calendar/month-focus plan and daily tasks.
- `src/sweRoadmap.js`: narrative timeline, weekly cadence, readiness gates.
- `src/SWEMicroLab.jsx`, `src/SWEIntegratedPlanner.jsx`, `src/SWELeetCodeDojo.jsx`: presentation and interaction.
- `src/GoogleSWE.jsx`: browser-local prep state and export/import.
This document is the product/learning contract; it does not by itself change UI or backend behavior.
