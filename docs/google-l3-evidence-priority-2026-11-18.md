# Google SWE II / L3: evidence-based study priorities (18 November 2026)

This note explains the priority labels used in the live Google SWE planner and LeetCode Dojo. **There is no verified public Google question-frequency database.** We do not treat anecdotes, LinkedIn profiles, company-tagged LeetCode lists or generic "Google asked" compilations as validated probabilities.

## Source hierarchy

1. **Official recruiting/interview guidance**: Google's 2025 technical-interview recruiter post explicitly mentions data structures/algorithms, core CS, writing code in a language you know, testing edge cases, and time/space complexity:
   https://www.linkedin.com/posts/google_how-to-prepare-for-technical-interviews-activity-7319057159177097217-lnuR

2. **Current role description**: Software Engineer II, Early Career lists 1 year industry software development, web/software systems experience, AI productivity tools, and design/test/deploy/maintain responsibilities. Specific job window is time-sensitive:
   https://www.google.com/about/careers/applications/jobs/results/109116638069957318-software-engineer-ii-early-career

3. **User's uploaded 99-page SWE Glow-Up handbook** (research date Nov 4, 2026): pp. 5–9 explain limits/rounds; p. 12 outlines microlearning and review; pp. 13–60 break down Java/DSA; pp. 63–70 cover databases/API/Angular/testing; pp. 82–84 provide a prerequisite-based LeetCode ladder; p. 94 states readiness diagnostics. The book itself explicitly warns that tagged question collections and Reddit reports are not verified company frequency data.

4. **Candidate experiences (anecdotal, not representative)**:
   - Apr 2026 L3 NYC candidate: graph, intervals, graph with follow-ups, plus leadership:
     https://www.reddit.com/r/leetcode/comments/1sngeta/google_l3_swe_interview_experience/
   - L3 offer interview retrospect: bit manipulation/HashMap, BFS/PriorityQueue, implementation despite expecting graph/DP/backtracking:
     https://www.reddit.com/r/leetcode/comments/1hl5wr1/got_google_l3_heres_my_experience/
   - Oct 2026 L3 timeline: multiple technical interviews and G&L/team matching, no reliable topic-frequency statistics:
     https://www.reddit.com/r/FAANGrecruiting/comments/1wz68eu/google_l3_swe_interview_experience/
   - 2024 L3 experience includes DP/two pointers and graph:
     https://www.reddit.com/r/leetcode/comments/1gmc1yu

5. **Public LinkedIn profile previews**, pp. 10–11 and pp. 97–98 of the uploaded handbook: the profiles illustrate how engineers present projects, impact, and systems thinking, **not** what questions Google asks. Several previews were limited or unavailable; do not infer private details or hiring causality.

## Priority design for this early-career general SWE target

**Allocate study effort roughly 60% DSA/LeetCode + coding interviews, 15% Java/OOP fluency, 15% backend/SQL/CS, 10% Angular, flagship project and application preparation.** This is a suggested weekly balance, *not a Google rubric*. Increase project work when nearing a deliverable; switch to more timed mocks when interview invitations arrive.

- **P0 core**: arrays/strings, hashing, two pointers, sliding windows, prefix sums, binary search, sorting, stacks/queues, linked traversal, trees/BST, graph BFS/DFS, recursion, dynamic-programming fundamentals, intervals, Java syntax, complexity proofs and edge-case testing. These foundational skills enable many variations, including multi-stage follow-ups.
- **P1 next**: heaps/PriorityQueue, greedy, backtracking, union-find, tries, bit operations, advanced graph/DP variations, and practical Spring/API, SQL queries/transactions, testing, debugging, and system/network fundamentals. These absolutely can appear in interviews; "P1" means learn after prerequisites, NOT "never asked."
- **P2 supporting/specialist**: deep Angular framework internals, optional Java convenience APIs, niche distributed systems, obscure advanced algorithms unless a specific posting/interview asks for them.

### Daily work in the app

1. **Dojo first**: prioritize RED, YELLOW, self-rated STRUGGLED, and overdue reattempts. Only an actual logged Dojo attempt recalculates the problem's date. Use a blank editor; give yourself credit only for what you could independently do.
2. **Next new problem**: add one carefully chosen P0/P1 variation appropriate to prerequisites. Difficulty (LeetCode Easy/Medium/Hard) is separate from **effort** (struggled/normal/easy). A problem labeled Hard is not automatically more valuable than a solid foundational Medium.
3. **Atomic skill to-do**: a tiny Java, OOP, DSA, API, DB, or Angular concept; check the to-do after studying it, not after reading a question card.
4. **Recall to-do**: just the title and date; self-review in your own way. Checking it saves a reminder event and schedules a future review without falsely grading GREEN.
5. **Optional portfolio / career evidence**: weekly actual work product, testing, technical writing and role checks.

### LeetCode targeted first-practice examples (not predicted Google questions)

- Early: #1 Two Sum, #217 Contains Duplicate, #242 Valid Anagram, #125 Valid Palindrome, #27 Remove Element, #238 Product of Array Except Self, #3 Longest Substring, #56 Merge Intervals, #704 Binary Search.
- Intermediate: #739 Daily Temperatures, #206 Reverse Linked List, #102 Level Order, #104 Maximum Depth, #200 Number of Islands, #994 Rotting Oranges, #215 Kth Largest, #207 Course Schedule, #78 Subsets, #198 House Robber, #322 Coin Change.
- Later: #743 Network Delay Time, #684 Redundant Connection, #51 N-Queens, #1143 Longest Common Subsequence, #72 Edit Distance, plus mixed unseen variants.

No numerical problem quota guarantees interview success. Prioritize correct independent reasoning, implementation, edge cases, time/space analysis, and communication over familiarity with famous solutions.

## Review mechanics

- **LeetCode**: RED starts at tomorrow; YELLOW starts about 3 days; GREEN/MOCK follow a progressive ladder, modified by your *personal* effort. Struggle brings the attempt back sooner; an easy independent solve spreads farther. Each logged attempt and due date are per problem.
- **Atomic skill self-review**: the calendar uses **plain checkboxes**, not question-and-answer cards. A checked review creates a future reminder and does not assert mastery. The optional separate concept library remains available for deeper explanations.
- **Continuity**: active recall continues after December 2026 and beyond September 2027 until you secure your target offer, with weak topics recurring sooner and strong topics spaced farther apart.
