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

## Executive QA Contract Tests

Added intentional red QA tests in `src/lib/quality/` to protect product ambition, not only implementation correctness.

These contracts cover:

- CEO/Product objective alignment.
- CTO master-roadmap coverage.
- Curriculum/content quality.
- Role-readiness credibility.
- SaaS learning UX surfaces.

Current red findings:

- Resolved: first-class Security, Performance, and Interviews domains are now present.
- Resolved: current priority-domain coverage now includes DSA, JavaScript, Node.js, Databases, System Design, Interviews, AWS, Security, and Performance.
- Resolved: Engineering Manager path now meets the minimum role-depth contract.
- Resolved: Backend Senior Engineer capability wording now explicitly covers JavaScript, Node, DSA, database, system design, and API ownership.
- Resolved: `recursion-backtracking` mental model is now strong enough for the topic-quality contract.
- Resolved: first-class router domains now include foundations, tradeoffs, case-studies, senior-skills, career-assets, and AI expansion.
- Resolved: Career Assets strategic coverage now includes resume, LinkedIn, GitHub, portfolio, proof-of-work, promotion packet, and STAR stories.
- Resolved: Testing and Quality coverage now includes unit-test, integration-test, contract-test, QA, and release-quality strategy.
- Current status: executive quality contracts pass. Phase 44 SaaS Learning UX Upgrade and Phase 45 Assessment/Evaluation Layer have a complete local/mock MVP. The detailed implementation plan and remaining hardening backlog are tracked in `docs/PHASE_44_45_IMPLEMENTATION_PLAN.md`.
- Resolved in local/mock form: saved onboarding wizard, rubric scoring history, interactive timed mock interviews, local code execution, mock evaluator scoring, and a weighted assessment readiness model.
- Remaining production-hardening work: database-backed preferences/evaluations, safer sandboxed code execution, richer rubric calibration, full mock interview session reports, confidence tracking, and readiness trends over time.

## Product Gaps Found

### Learning Roadmap

- Present: linear junior to Staff/Principal/EM path.
- Present: role paths for Senior Backend Engineer, AWS Solution Architect, Staff/Principal Engineer, and Engineering Manager.
- Present: 80/20 core, depth, and expert filtering.
- Present in local/mock form: role onboarding wizard that asks target role, current level, available hours, weak areas, learning mode, and deadline.
- Missing: estimated duration per role path and per module.
- Missing: lockstep "next lesson" progression with prerequisites and unlock logic.

### Filtering and Search

- Present: role filter.
- Present: 80/20 focus filter.
- Present: search on `/syllabus`.
- Present: cards/table view toggle.
- Present: domain, difficulty, and source-platform filters.
- Missing: saved filter presets.
- Missing: sorting by priority, difficulty, estimated effort, and interview frequency.

### SaaS Dashboard UX

- Present: dashboard, progress page, syllabus page, topic detail pages.
- Present: role-readiness dashboard.
- Missing: progress by role path.
- Missing: weak-area heatmap.
- Present: "today's recommended lesson" from the selected role roadmap.
- Present: interview-readiness score broken down by core role domains.

### Topic Detail Quality

- Present: topic definition, theory, mental model, code example, practice problems, interview questions, references, progress signals, and response forms.
- Improved: service now normalizes every rendered topic to at least 8 practice problems and 8 interview questions.
- Missing: many topics still have short 80/20 theory rather than full lesson breakdowns.
- Missing: code walkthrough sections are not structured into line-by-line explanations yet.
- Missing: explicit quizzes, flashcards, and spaced repetition scheduling per topic.
- Present in local/mock form: runnable JavaScript execution and automated mock answer review.

### Assessment

- Present: response submission forms and saved response history.
- Missing: problem submissions with structured answer review per problem.
- Missing: rubric-based scoring per role path.
- Present in local/mock form: timed mock interview mode.
- Present in local/mock form: heuristic mock evaluator integration.

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

1. Phase 48 Auth and Persistent Learner State: real user profile model, database-backed preferences/progress/evaluations, and mock fallback behavior.
2. Add Playwright smoke journeys and visual/mobile QA for dashboard, onboarding, syllabus, topic, practice, quality, and progress flows.
3. Calibrate evaluator rubrics for DSA, HLD, LLD, AWS, Staff/EM, and behavioral interviews.
4. Decide whether public beta disables the browser code runner or replaces it with a hardened isolated execution service.
5. Continue topic-depth passes for AWS Solution Architect, graph algorithms, HLD case studies, LLD machine coding, and Staff/EM leadership.
