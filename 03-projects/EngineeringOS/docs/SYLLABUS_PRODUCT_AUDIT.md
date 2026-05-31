# Syllabus Product Audit

## Current Verdict

EngineeringOS now has broad syllabus coverage and a usable role-filtered learning roadmap, but it is not yet a fully polished SaaS-grade learning product.

The product is strong enough for local MVP curriculum browsing. The next quality bar is richer lesson depth, assessment loops, and dashboard analytics.

Strict coverage verdict against `00-control/master-roadmap`: not fully covered. The interview-heavy backbone is present, but complete master-roadmap parity is not done until standalone Foundations, Tradeoffs, Security, Performance, Case Studies, Interview Ops, Career Assets, and AI Expansion become first-class syllabus domains instead of being partially represented inside other tracks.

## Master Roadmap Coverage

Covered well:

- JavaScript phases: fundamentals, async/event loop, senior topics, interview drills.
- DSA and Algorithms: arrays, strings, hashing, stacks, queues, core patterns, trees, graphs, search, DP, greedy, backtracking, intervals, bit manipulation.
- Node.js: runtime, backend engineering, scale, senior reliability.
- Databases: SQL, PostgreSQL, MongoDB, Redis, scaling patterns.
- System Design/HLD: foundations, building blocks, capacity math, common systems, advanced distributed topics, HLD case studies.
- AWS Solution Architect: core services plus Multi-AZ, autoscaling, Route 53, CloudFront, ElastiCache, API Gateway, Step Functions, ECS/EKS, KMS, CloudTrail, Backup/DR, cost optimization.
- LLD: externally guided because the local LLD roadmap index is empty.
- Staff/Principal/EM: externally guided leadership track for architecture review, technical strategy, incident leadership, roadmap execution, hiring calibration, and stakeholder communication.

Covered partially or still weak:

- `01-foundations`: no standalone computer-science/web/backend foundation domain yet.
- `08-tradeoffs`: tradeoffs appear inside topics, but there is no dedicated decision-making curriculum.
- `10-security`: security is referenced in Node/AWS/HLD, but OAuth/OIDC, JWT, sessions, CSRF, XSS, SSRF, secrets, IAM least privilege, threat modeling, and secure design reviews need first-class lessons.
- `11-performance`: performance exists in JavaScript/Node/DB, but no unified performance engineering track with profiling, caching, load testing, observability, and bottleneck diagnosis.
- `12-case-studies`: HLD mocks exist, but there is no separate end-to-end case-study progression with grading rubrics and variants.
- `14-interviews`: interview questions exist per topic, but mock interview orchestration and recruiter-style role calibration are still early.
- `15-career-assets`: no resume, portfolio, promotion packet, STAR stories, or leadership narrative track.
- `16-ai-expansion`: no AI-assisted learning/evaluator track yet.

Recent high-ROI fixes:

- Added service-level deep lesson overrides for graph algorithms, AWS Multi-AZ/DR, payment/booking HLD, architecture review, and incident leadership.
- Added rubric-based review panels to syllabus topic pages.
- Added a static mock interview mode on syllabus topic pages.
- Attached additional public references to deep overrides: CP-Algorithms, NeetCode, AWS Well-Architected Reliability, AWS Architecture Center, System Design Primer, Amazon Builders' Library, StaffEng, and Google SRE.

## Product Gaps Found

### Learning Roadmap

- Present: linear junior to Staff/Principal/EM path.
- Present: role paths for Senior Backend Engineer, AWS Solution Architect, Staff/Principal Engineer, and Engineering Manager.
- Present: 80/20 core, depth, and expert filtering.
- Missing: role onboarding wizard that asks target role, current level, available hours, and interview timeline.
- Missing: estimated duration per role path and per module.
- Missing: lockstep "next lesson" progression with prerequisites and unlock logic.

### Filtering and Search

- Present: role filter.
- Present: 80/20 focus filter.
- Present: search on `/syllabus`.
- Present: cards/table view toggle.
- Missing: domain, level, difficulty, and source-platform filters.
- Missing: saved filter presets.
- Missing: sorting by priority, difficulty, estimated effort, and interview frequency.

### SaaS Dashboard UX

- Present: dashboard, progress page, syllabus page, topic detail pages.
- Missing: role-readiness dashboard.
- Missing: progress by role path.
- Missing: weak-area heatmap.
- Missing: "today's recommended lesson" from the selected role roadmap.
- Missing: interview-readiness score broken down by DSA, HLD, LLD, AWS, system design, and leadership.

### Topic Detail Quality

- Present: topic definition, theory, mental model, code example, practice problems, interview questions, references, progress signals, and response forms.
- Improved: service now normalizes every rendered topic to at least 8 practice problems and 8 interview questions.
- Missing: many topics still have short 80/20 theory rather than full lesson breakdowns.
- Missing: code walkthrough sections are not structured into line-by-line explanations yet.
- Missing: explicit quizzes, flashcards, and spaced repetition scheduling per topic.
- Missing: runnable code execution and automated answer review.

### Assessment

- Present: response submission forms and saved response history.
- Missing: problem submissions with structured answer review per problem.
- Missing: rubric-based scoring per role path.
- Missing: mock interview mode.
- Missing: AI or mock evaluator integration.

## Pending Syllabus Content

Top-level coverage is broad. The remaining syllabus work is depth, not only new domains.

Highest-priority depth passes:

- Graph algorithms: Graph DFS, Graph BFS, Topological Sort, Dijkstra, Union Find.
- Dynamic Programming Core.
- AWS Solution Architect: IAM, VPC, RDS, Multi-AZ, Auto Scaling, Backup/DR, Cost Optimization.
- HLD case studies: Payment, Booking, Chat, Feed.
- LLD machine coding: Parking Lot, Rate Limiter, Cache, Notification Service.
- Staff/Principal/EM: Architecture Review, Incident Leadership, Technical Strategy, Stakeholder Communication.

Additional future domains to consider:

- Security deep dive: OAuth/OIDC, JWT, sessions, CSRF, XSS, SSRF, secrets, threat modeling.
- Performance and observability: profiling, tracing, metrics, logs, SLOs, incident dashboards.
- AWS advanced: ECS/EKS deep dive, EventBridge, CloudFormation/CDK/Terraform, WAF, Organizations, Control Tower.
- Engineering management: planning, delivery health, performance management, team topology, hiring loops.

## External Reference Strategy

Keep references attached to every topic.

Preferred reference sources:

- Official docs first: AWS, Node.js, PostgreSQL, MongoDB, Redis, MDN.
- Public guided paths: roadmap.sh, NeetCode, System Design Primer.
- Practice platforms: LeetCode, SQLBolt, CodeZym, local labs.
- Public repos: donnemartin/system-design-primer, TheAlgorithms/JavaScript, low-level-design-primer.
- Leadership references: StaffEng, Google SRE Book, AWS Well-Architected.

## Next Recommended Product Work

1. Add role-readiness dashboard cards.
2. Add domain/level/difficulty filters.
3. Add topic-depth pass for AWS Solution Architect 80/20 path.
4. Add topic-depth pass for Graph Algorithms.
5. Add rubric-based problem and interview answer review panels.
