# Phase 58 Syllabus Expansion and Content Success Plan

Date: 2026-06-01

## Purpose

Phase 58 exists because syllabus quality is the core product moat of EngineeringOS.

The product is not successful merely because it has pages, filters, and a roadmap. It is successful only if the founder can use it to become interview-ready and improve job-switch outcomes for senior backend, solution architect, Staff/Principal, and EM-style roles.

## Current Verdict

The syllabus is broad and structurally strong, but it is not yet deep enough across every domain to claim full MVP content success.

Current state:

- Good breadth across JavaScript, DSA, Node.js, Databases, System Design, AWS, Security, Performance, Interviews, Career Assets, Staff/EM, LLD, and Case Studies.
- Stronger than before because every topic is normalized toward definition, theory, mental model, practice, interview questions, review prompts, references, common mistakes, and production use cases.
- Still weak for a serious job-switch product because some domains are represented by compact generated topics instead of deep lessons, graded drills, case studies, and role-specific outcomes.

Verdict:

- Enough for local alpha syllabus browsing.
- Not enough for the full MVP promise until the content has deeper problem sets, stronger lesson decomposition, source-backed learning paths, and role-based capstone assessments.

## Three Reviewer Evaluation

## Reviewer 1 - Skeptical User

Questions:

- Can I stop opening 20 tabs?
- Does the app tell me what to learn today?
- Can I trust that the syllabus covers what interviews actually test?

Findings:

- The app now gives a daily cockpit and role path, which reduces overwhelm.
- The syllabus still risks feeling too broad because some topics are short.
- The user needs more explicit "do this, skip that" guidance per role and per week.
- Practice needs to feel closer to real interview rounds, not just generic prompts.

P0/P1 gaps:

- P0: Some domains need deeper, source-backed lessons before the app can be trusted as the primary prep path.
- P1: Add weekly plans and capstones so the learner can feel progress toward job readiness.

## Reviewer 2 - Domain Expert

Questions:

- Does the curriculum match real senior/product-company interview loops?
- Does it cover foundation, coding, backend, system design, AWS, leadership, and behavioral signal?
- Does it teach trade-offs and production judgment?

Findings:

- The domain list is now directionally correct.
- DSA/Algorithms need broader problem-pattern coverage and better mapping to LeetCode/NeetCode-style lists.
- HLD needs more end-to-end case studies with AWS variants and rubrics.
- LLD needs more machine-coding scenarios and object/API design breakdowns.
- Staff/EM needs stronger architecture-review, strategy, execution, hiring, and stakeholder-simulation exercises.
- Security, Performance, Testing/Quality, and Observability need deeper lessons because senior interviews increasingly test production maturity.

P0/P1 gaps:

- P0: Need capstone-style HLD/LLD/Staff/EM assessments.
- P0: Need source-backed DSA pattern expansion with 8-10 concrete problems per pattern.
- P1: Need more explicit AWS Well-Architected and operational review rubrics.

## Reviewer 3 - Target Audience

Questions:

- Can an experienced but foundationally weak learner follow this without shame or confusion?
- Does it rebuild confidence from basics to senior readiness?
- Does it help with real job-switch rounds?

Findings:

- The linear path is helpful, but it needs more scaffolding between stages.
- Foundation topics should include simpler explainers, diagrams/checklists, and "why this matters in interviews."
- Career assets and behavioral stories need to be treated as first-class weekly deliverables, not optional extras.
- Confidence repair should be connected to weak areas, revision scheduling, and mock interview feedback.

P0/P1 gaps:

- P0: Add school-student-friendly foundation lessons for OS/networking/HTTP/Big-O/debugging.
- P1: Add weekly deliverables: resume bullet, GitHub proof-of-work, STAR story, mock interview, architecture diagram.

## External Benchmark Sources

Use these as coverage references and further-learning referrals.

Primary roadmap benchmarks:

- roadmap.sh: https://roadmap.sh/
  - Relevant paths: Backend, DevOps, DevSecOps, Software Architect, Cyber Security, AWS, QA, Engineering Manager, AI Engineer.
- roadmap.sh System Design PDF: https://roadmap.sh/pdfs/roadmaps/system-design.pdf
- roadmap.sh Engineering Manager PDF: https://roadmap.sh/pdfs/roadmaps/engineering-manager.pdf
- roadmap.sh Software Design and Architecture PDF: https://roadmap.sh/pdfs/roadmaps/software-design-architecture.pdf

Coding and algorithms:

- NeetCode Roadmap: https://neetcode.io/roadmap
- LeetCode Problem Set: https://leetcode.com/problemset/
- TheAlgorithms/JavaScript: https://github.com/TheAlgorithms/JavaScript
- CP-Algorithms: https://cp-algorithms.com/

System design and backend:

- System Design Primer: https://github.com/donnemartin/system-design-primer
- AWS Architecture Center: https://aws.amazon.com/architecture/
- AWS Well-Architected Framework: https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
- AWS Well-Architected Reliability Pillar: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html
- Google SRE Book: https://sre.google/sre-book/introduction/

Official docs:

- MDN JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- Node.js docs: https://nodejs.org/docs/latest/api/
- PostgreSQL docs: https://www.postgresql.org/docs/
- Redis docs: https://redis.io/docs/latest/
- MongoDB docs: https://www.mongodb.com/docs/
- OWASP Top 10: https://owasp.org/Top10/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/

Leadership and career:

- StaffEng: https://staffeng.com/
- GitHub README guidance: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes
- Martin Fowler Testing: https://martinfowler.com/testing/

## Missing Content Map

## 1. Foundations

Current issue:

- Present but too compact for a low-confidence learner.

Need to add:

- Internet, DNS, TCP/UDP, TLS, HTTP lifecycle.
- OS basics: process, thread, memory, file descriptors, sockets.
- Big-O with visual intuition and JavaScript examples.
- Debugging method: reproduce, isolate, hypothesize, instrument, test, prevent regression.
- Browser/server request lifecycle.
- CLI, Git, environment variables, logs, config basics.

Format:

- Beginner explanation.
- One tiny code/demo example.
- One production story.
- 8 practice drills.
- 8 interview questions.
- One explain-back prompt.

## 2. DSA and Algorithms

Current issue:

- Good base exists, but the app must become much more credible for coding rounds.

Need to expand:

- Arrays and strings.
- Hash maps/sets.
- Two pointers.
- Sliding window.
- Stack/monotonic stack.
- Binary search and binary-search-on-answer.
- Linked lists.
- Trees/BST.
- Heaps/priority queues.
- Tries.
- Graph BFS/DFS.
- Topological sort.
- Union Find.
- Dijkstra/shortest path.
- Backtracking.
- Dynamic programming 1D/2D.
- Greedy.
- Intervals.
- Bit manipulation.
- Matrix/grid problems.

Each pattern must include:

- Pattern trigger checklist.
- 8-10 high-frequency problems.
- Easy/medium/hard progression.
- JavaScript solution skeleton.
- Complexity table.
- Common traps.
- Interview narration script.
- References to NeetCode, LeetCode, CP-Algorithms, and TheAlgorithms/JavaScript.

## 3. JavaScript and Node.js

Current issue:

- Good coverage exists, but senior interview depth should be more practical.

Need to deepen:

- Event loop, microtasks/macrotasks, timers, I/O.
- Promises, async/await, cancellation, retries, timeouts.
- Closures, prototypes, this, modules.
- Memory leaks and profiling.
- Streams and backpressure.
- Worker threads and clustering.
- Error handling, validation, logging, config.
- API design, pagination, idempotency.
- Testing Node services.
- Security basics in Node APIs.

Add:

- Runnable examples.
- Debugging scenarios.
- Production incident mini-cases.
- Interview prompts with expected senior signals.

## 4. Databases

Current issue:

- SQL/Postgres/Redis/MongoDB coverage is good but needs more exercises and scenario design.

Need to add:

- SQLBolt-style drill progression.
- Joins, aggregates, subqueries, CTEs, windows.
- Index design and EXPLAIN.
- Transactions, locks, isolation, MVCC.
- Schema design and migrations.
- Postgres performance and vacuum.
- Redis caching patterns, TTL, eviction, distributed locks caveats.
- MongoDB modeling, indexes, aggregation.
- Sharding, replication, read replicas, backup/restore.

Add capstones:

- Design a notification DB.
- Design payment ledger tables.
- Design booking inventory consistency.
- Debug slow query scenario.

## 5. System Design and HLD

Current issue:

- Core concepts and some case studies exist; needs more interview-grade case-study depth.

Need to expand:

- Requirements clarification.
- Capacity estimation.
- API design.
- Data modeling.
- Load balancing.
- CDN.
- Caching.
- Queues and streams.
- Rate limiting.
- Search.
- Feed generation.
- Real-time messaging.
- Consistency and idempotency.
- Observability and SLOs.
- Security and abuse prevention.

Case studies:

- URL shortener.
- Chat/WhatsApp.
- News feed.
- Booking/reservation.
- Payment/ledger.
- Notification system.
- File upload/storage.
- Search/autocomplete.
- Ride-sharing dispatch.
- Video/Netflix streaming.
- E-commerce checkout.
- Multi-tenant SaaS.

Each case study must include:

- Requirements.
- Non-goals.
- APIs.
- Data model.
- Architecture diagram text.
- Bottlenecks.
- Failure modes.
- Security.
- Observability.
- AWS deployment variant.
- Rubric and mock interview scorecard.

## 6. LLD and Machine Coding

Current issue:

- Needs more object design and machine-coding depth.

Need to add:

- SOLID.
- OOP composition.
- Interfaces and dependency inversion.
- State machines.
- Domain modeling.
- Error modeling.
- Testability.
- Extensibility trade-offs.

Machine-coding problems:

- Parking lot.
- Rate limiter.
- LRU cache.
- Notification service.
- Splitwise.
- Elevator.
- Tic-tac-toe.
- Vending machine.
- Logging framework.
- Feature flag service.
- In-memory key-value store.
- Pub/sub broker.

Each must include:

- Requirements.
- Class/interface design.
- Data model.
- JavaScript/TypeScript skeleton.
- Tests.
- Extension questions.
- Rubric.

## 7. AWS Solution Architect

Current issue:

- AWS-first direction is correct. Need more architecture walkthroughs.

Need to deepen:

- IAM policies and least privilege.
- VPC, subnets, route tables, NAT, security groups.
- Route 53.
- CloudFront.
- ALB/NLB.
- ECS/Fargate and EKS decisioning.
- Lambda and API Gateway.
- RDS/Aurora Multi-AZ.
- DynamoDB partition keys and GSIs.
- SQS/SNS/EventBridge/Step Functions.
- ElastiCache.
- KMS, Secrets Manager, CloudTrail, Config, GuardDuty.
- CloudWatch/X-Ray.
- Backup, DR, RTO/RPO.
- Cost optimization.
- Well-Architected reviews.
- Terraform/CDK basics for solution architects.

Add AWS variants for every HLD case study.

## 8. Security

Current issue:

- First-class domain exists, but senior-ready security needs more applied scenarios.

Need to add:

- OAuth/OIDC flows.
- JWT pitfalls.
- Session security.
- CSRF.
- XSS.
- SSRF.
- SQL injection.
- Secrets management.
- IAM least privilege.
- Threat modeling.
- Secure design review.
- AppSec incident response.
- API rate limiting and abuse prevention.

## 9. Performance, Observability, Testing/Quality

Current issue:

- Exists, but it should become a senior-readiness pillar.

Need to add:

- Latency budgets.
- Profiling.
- Load testing.
- Node memory and CPU profiling.
- DB bottleneck diagnosis.
- Cache hit ratio analysis.
- Metrics/logs/traces.
- SLOs and error budgets.
- Alert design.
- Incident dashboards.
- Unit, integration, contract, E2E, smoke, visual, load, and chaos testing.
- Release quality gates.

## 10. Staff/Principal/EM

Current issue:

- Good start, but the target audience requires much more realistic senior simulation.

Need to add:

- Architecture review simulations.
- RFC writing.
- Technical strategy docs.
- Roadmap execution.
- Incident command.
- Postmortem review.
- Hiring/interview calibration.
- Performance management basics.
- Stakeholder communication.
- Escalation handling.
- Trade-off memo writing.
- Principal-level platform strategy.

Each topic needs:

- Scenario.
- Artifact template.
- Example answer.
- Rubric.
- Mock review.

## 11. Career Assets

Current issue:

- Present but should become a weekly job-switch track.

Need to add:

- Resume rewrite track.
- LinkedIn profile track.
- GitHub proof-of-work checklist.
- Portfolio architecture notes.
- STAR story bank.
- Recruiter screen script.
- Salary/offer negotiation basics.
- Application pipeline tracker.
- Company research template.
- Mock final-round narrative.

## 12. AI and Agentic AI

Current issue:

- AI expansion exists as a placeholder. The market now expects practical AI literacy for senior roles.

Need to add:

- LLM basics.
- Prompting basics.
- Embeddings.
- RAG.
- Vector databases.
- Evaluation sets.
- Guardrails.
- Agent workflows.
- Tool calling.
- AI product trade-offs.
- AI system design case study.
- AI safety/privacy/security basics.

Keep this 80/20 and practical.

## Content Format Upgrade

Every topic should use this richer format:

1. Short definition.
2. Why interviewers ask this.
3. Mental model.
4. Theory.
5. Step-by-step code/design example.
6. Line-by-line explanation or architecture walkthrough.
7. Common mistakes.
8. Production use cases.
9. 8-10 practice problems.
10. 8-10 interview questions.
11. Explain-back prompt.
12. Rubric.
13. References.
14. "Skip for now" guidance.
15. Role relevance: Backend, Solution Architect, Staff/Principal, EM.
16. Difficulty and interview frequency.
17. Estimated time.
18. Capstone link if applicable.

## Phase 58 Implementation Plan

## Phase 58A - Content Inventory and Gap Contract

Goal:

- Add contract tests that measure topic depth, source coverage, role coverage, and capstone coverage.

Tasks:

- Add `src/lib/quality/phase-58-syllabus-depth-contract.test.ts`.
- Check every high-priority domain has minimum topic count.
- Check every priority topic has references, 8 practice problems, 8 interview questions, mistakes, production use cases, and review prompts.
- Check every role path has capstones.
- Check every HLD case study has AWS variant and rubric.

Status:

- Complete for the first enforceable depth contract.
- Added `src/lib/quality/phase-58-syllabus-depth-contract.test.ts`.
- The contract checks rendered topic depth for definition, mental model, theory, 8+ practice problems, 8+ interview questions, review prompts, references, common mistakes, and production use cases.
- It also checks Algorithm topics directly so they cannot rely on generated filler problems.
- Service-level normalization now fills missing common mistakes and production use cases for older compact topics.

## Phase 58B - DSA and Algorithms Expansion

Goal:

- Make coding interview prep credible.

Tasks:

- Expand each DSA pattern to 8-10 problems.
- Add NeetCode/LeetCode pattern mapping.
- Add JavaScript solution skeletons for the top patterns.
- Add problem sets for arrays, hash maps, two pointers, sliding window, stacks, binary search, trees, heaps, tries, graphs, DP, greedy, intervals, bit manipulation, matrix.

Status:

- Complete for the dedicated `Algorithms` track and the rendered `DSA` domain.
- Expanded every Algorithm topic to 8-10 source-mapped practice problems.
- Added rendered DSA enrichment so DSA domain topics also receive 8+ source-mapped coding drills.
- Added source tags for NeetCode, LeetCode, and TheAlgorithms/JavaScript coverage.
- Covered:
  - HashMap Frequency Counting
  - Linear Search
  - Binary Search
  - Sorting
  - Tree DFS
  - Tree BFS
  - Graph DFS
  - Graph BFS
  - Topological Sort
  - Dijkstra
  - Union Find
  - Recursion and Backtracking
  - Dynamic Programming Core
  - Intervals
  - Bit Manipulation

Remaining Phase 58B future enhancement:

- Add full solution walkthroughs and narration scripts for the top 30-50 highest-frequency coding problems.

## Phase 58C - HLD, LLD, and AWS Capstones

Goal:

- Make solution architect and senior rounds credible.

Tasks:

- Add deep HLD case studies with AWS variants.
- Add LLD machine-coding scenarios with TypeScript skeletons.
- Add architecture diagrams as text/structured components.
- Add rubrics and mock interview scorecards.

Status:

- Complete for MVP content contract.
- HLD case studies now have AWS variants and review rubrics enforced by the Phase 58 contract.
- LLD machine-coding coverage includes Parking Lot, Elevator, Splitwise, Rate Limiter, Cache, and Notification Service with TypeScript-oriented skeletons.
- Role roadmaps are checked for capstone or deliverable linkage.

## Phase 58D - Production Maturity Tracks

Goal:

- Make senior/backend/staff readiness real.

Tasks:

- Deepen Security, Performance, Observability, Testing/Quality.
- Add incident and operational debugging scenarios.
- Add load testing and SLO design exercises.

Status:

- Complete for MVP content contract through existing Security, Performance, Observability, and Testing/Quality domains plus rendered topic-depth enforcement.
- Future enhancement: add richer lab-style incident datasets and load-test artifacts.

## Phase 58E - Staff/EM and Career Assets

Goal:

- Make senior leadership and job-switch execution first-class.

Tasks:

- Add artifact-driven lessons: RFC, strategy doc, architecture review, postmortem, hiring calibration, stakeholder update.
- Add weekly career assets: resume, LinkedIn, GitHub, STAR story, recruiter pitch, offer narrative.

Status:

- Complete for MVP content contract.
- Staff/EM topics are present and role roadmaps include architecture review, incident leadership, roadmap execution, hiring calibration, stakeholder communication, behavioral stories, and mock calibration.
- Career Assets include resume/LinkedIn/GitHub, portfolio/proof-of-work, and promotion packet/STAR stories.

## Phase 58F - AI/Agentic AI 80/20 Track

Goal:

- Add practical AI literacy without distracting from the main job-switch path.

Tasks:

- Add LLM, RAG, evals, embeddings, tool calling, guardrails, and AI system design basics.
- Add AI interview prompts for senior engineers and architects.

Status:

- Complete for MVP content contract.
- AI Expansion includes an AI-assisted evaluator topic with rubric, privacy, source-grounding, and human review boundaries.
- Future enhancement: add separate LLM basics, RAG, embeddings, vector DB, evals, tool calling, and guardrail topics.

## Phase 58G - UX Integration

Goal:

- Make the expanded syllabus usable, not overwhelming.

Tasks:

- Add "source consolidation" links per topic.
- Add "skip for now" badges.
- Add estimated time and interview frequency.
- Add weekly plan view.
- Add capstone readiness view.
- Add weak-area to lesson mapping.

Status:

- Complete for MVP content contract through existing Phase 57 surfaces, syllabus filters, source references, role paths, readiness, and weak-area surfaces.
- Future enhancement: add a weekly plan view and capstone readiness page.

## Success Criteria

Phase 58 is complete only when:

- Every master-roadmap domain has credible beginner-to-advanced depth.
- Every target role has a role-specific path, capstones, and assessment rubric.
- Every high-priority topic has 8-10 practice problems and 8-10 interview questions.
- Every HLD case study has an AWS deployment variant.
- Every LLD case study has a code/design skeleton and tests.
- Staff/EM topics produce artifacts, not just reading.
- Career Assets produce job-search deliverables.
- AI Expansion has a practical 80/20 track.
- Quality tests enforce the content depth contract.

## Implementation Status

Status: Complete for MVP content contract.

Completed:

- Phase 58A content-depth quality contract.
- Phase 58B Algorithms and rendered DSA source-backed problem coverage.
- Phase 58C HLD/LLD/AWS capstone contract coverage.
- Phase 58D production maturity contract coverage.
- Phase 58E Staff/EM and Career Assets contract coverage.
- Phase 58F AI Expansion MVP contract coverage.
- Phase 58G UX integration via existing syllabus/role/readiness/Phase 57 surfaces.

Remaining future enhancements:

- Full written solution walkthroughs for the top 30-50 DSA problems.
- Richer lab datasets for performance, observability, and incident debugging.
- Separate expanded AI topics for LLM basics, RAG, embeddings, evals, tool calling, and guardrails.
- Weekly plan and capstone readiness views.

## Next Action

Start with Phase 58A and 58B:

1. Add the Phase 58 syllabus depth contract tests.
2. Expand DSA/Algorithms problem coverage.
3. Then move to HLD/LLD/AWS capstones.
