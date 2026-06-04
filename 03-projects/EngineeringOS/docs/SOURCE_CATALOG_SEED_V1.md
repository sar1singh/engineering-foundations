# Source Catalog Seed V1

Date: 2026-06-04

## Purpose

This document defines the initial source universe for the EngineeringOS founder beta.

EngineeringOS is optimizing the first beta path for:

```txt
Senior / Lead Backend Engineer
-> Solution Architect readiness
-> EM-aware Lead Backend / Principal-ready range
-> 70-80+ LPA Product / GCC / FAANG-level readiness
```

The source catalog feeds:

- Master Syllabus topic discovery and validation.
- Capability Graph design.
- Role roadmap projections.
- Daily Mission selection.
- Topic Sources Navbar references.
- Interview preparation.
- Offer readiness and career artifacts.

This is not final syllabus content. EngineeringOS content remains original. Sources are used for discovery, validation, mapping, reference, market signal, and coverage checks.

## Source Selection Rules

Sources enter this seed catalog when they satisfy at least one rule:

- They are official, canonical, or high-trust documentation.
- They are widely used roadmap, interview, or engineering-practice references.
- They are relevant to Solution Architect, Lead Backend, Staff/Principal, or EM-aware readiness.
- They provide useful job-market, compensation, or interview-signal validation.
- They are strong candidates for topic-driven discovery and later Sarwan review.

Confidence and approval follow `docs/CONTENT_INGESTION_DECISIONS.md`:

- A topic can enter the Master Syllabus if it appears in at least 2 independent credible sources, appears in 1 official/high-trust source, or appears repeatedly in current job descriptions for target roles.
- `>= 0.75`: approved.
- `0.50-0.74`: candidate / needs review.
- `< 0.50`: rejected or parked.
- Sarwan must approve beta-critical source-topic mappings.

Topic-driven discovery must happen before final topic extraction. The system should expand from seed examples using search queries, GitHub discovery, official docs, job descriptions, roadmap searches, and company engineering blogs.

Recommended query patterns:

- `top github resources for <topic>`
- `must have github repositories for <topic>`
- `best github repositories for <topic>`
- `github roadmap for <role>`
- `github interview resources for <topic>`
- `github learning path for <topic>`
- `official documentation for <topic>`
- `best engineering blogs for <topic>`
- `<role> interview preparation github`
- `<topic> system design interview github`
- `<topic> roadmap github`
- `<topic> best practices github`
- `<topic> production best practices`

## Category Coverage Map

| Category | Minimum Seed Count | Current Count | Beta Priority |
| --- | ---: | ---: | --- |
| JavaScript | 5 | 5 | P1 |
| TypeScript | 5 | 5 | P1 |
| Node.js | 5 | 5 | P0 |
| Backend Engineering | 5 | 5 | P0 |
| Databases | 5 | 5 | P0 |
| System Design / HLD | 5 | 5 | P0 |
| LLD / Design Patterns | 5 | 5 | P0 |
| AWS / Cloud Architecture | 5 | 5 | P0 |
| Distributed Systems | 5 | 5 | P0 |
| Security | 5 | 5 | P1 |
| Observability / Reliability | 5 | 5 | P1 |
| DevOps / Containers / Kubernetes | 5 | 5 | P1 |
| DSA / Problem Solving | 5 | 5 | P1 |
| Solution Architect | 5 | 5 | P0 |
| Engineering Manager | 5 | 5 | P2 |
| Lead / Principal / Staff Engineering | 5 | 5 | P1 |
| Behavioral Interviews | 5 | 5 | P0 |
| Resume / LinkedIn / GitHub / Portfolio | 5 | 5 | P0 |
| Product Company / GCC Interview Prep | 5 | 5 | P0 |
| Career Strategy / Compensation / Applications | 5 | 9 | P0 |

Total seed count: 104 sources.

## Initial Source Catalog

Required fields are included for every source:

`id`, `title`, `url`, `sourceType`, `category`, `tier`, `reliability`, `founderBetaRelevance`, `mappedCapabilities`, `mappedTopics`, `whyIncluded`, `ingestionStatus`, `reviewerStatus`, `notes`.

| id | title | url | sourceType | category | tier | reliability | founderBetaRelevance | mappedCapabilities | mappedTopics | whyIncluded | ingestionStatus | reviewerStatus | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| js-mdn-guide | MDN JavaScript Guide | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide | official docs | JavaScript | Tier 1 | high | Core language refresh for backend interviews | JS/TS Foundations | JS fundamentals, scope, async, modules | Canonical JS learning/reference source | approved | sarwan_review_required | Map high-value topics only |
| js-mdn-reference | MDN JavaScript Reference | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference | official docs | JavaScript | Tier 1 | high | Precise reference for tricky JS concepts | JS/TS Foundations | objects, promises, collections, runtime APIs | Official reference for language behavior | approved | sarwan_review_required | Use for definitions and edge cases |
| js-33-concepts | 33 JS Concepts | https://github.com/leonardomso/33-js-concepts | GitHub repo | JavaScript | Tier 2 | medium | Interview-focused JS concept checklist | JS/TS Foundations | closures, event loop, prototypes, coercion | Strong topic discovery seed | candidate | sarwan_review_required | Community source; validate against MDN |
| js-wtfjs | wtfjs | https://github.com/denysdovhan/wtfjs | GitHub repo | JavaScript | Tier 3 | medium | Deep JS edge-case preparation | JS/TS Foundations | coercion, equality, edge cases | Useful for tricky interviews | candidate | sarwan_review_required | Supporting source, not canonical |
| js-javascript-info | The Modern JavaScript Tutorial | https://javascript.info/ | tutorial | JavaScript | Tier 2 | medium | Structured JS review path | JS/TS Foundations | async, classes, objects, browser concepts | Good guided explanations | candidate | sarwan_review_required | Validate advanced claims |
| ts-official-docs | TypeScript Docs | https://www.typescriptlang.org/docs/ | official docs | TypeScript | Tier 1 | high | Required for backend TS fluency | JS/TS Foundations | types, narrowing, generics, config | Canonical TS source | approved | sarwan_review_required | Prioritize backend-relevant TS |
| ts-handbook | TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/intro.html | official docs | TypeScript | Tier 1 | high | Interview and production TS grounding | JS/TS Foundations | interfaces, unions, generics, utility types | Official conceptual handbook | approved | sarwan_review_required | Canonical for syllabus definitions |
| ts-release-notes | TypeScript Release Notes | https://www.typescriptlang.org/docs/handbook/release-notes/overview.html | official docs | TypeScript | Tier 1 | high | Keeps modern TS topics current | JS/TS Foundations | language evolution, new features | Useful for current market alignment | candidate | sarwan_review_required | Use sparingly for beta path |
| ts-type-challenges | Type Challenges | https://github.com/type-challenges/type-challenges | GitHub repo | TypeScript | Tier 2 | medium | Advanced TS practice | JS/TS Foundations | generic constraints, mapped types | Useful implementation practice source | candidate | sarwan_review_required | Not P0 unless TS weak area |
| ts-total-typescript | Total TypeScript | https://www.totaltypescript.com/ | learning resource | TypeScript | Tier 3 | medium | Practical TS explanations | JS/TS Foundations | inference, generics, application patterns | Good supporting resource | candidate | sarwan_review_required | Check free/public availability per topic |
| node-docs | Node.js API Docs | https://nodejs.org/docs/latest/api/ | official docs | Node.js | Tier 1 | high | Core backend runtime reference | Node Backend | event loop, streams, fs, http, worker threads | Canonical Node source | approved | sarwan_review_required | P0 for backend path |
| node-learn | Node.js Learn | https://nodejs.org/en/learn | official docs | Node.js | Tier 1 | high | Structured official learning path | Node Backend | async flow, diagnostics, security, testing | Official applied learning source | approved | sarwan_review_required | Use for missions and topic pages |
| nodebestpractices | Node.js Best Practices | https://github.com/goldbergyoni/nodebestpractices | GitHub repo | Node.js | Tier 2 | high | Production backend mastery | Node Backend, Security, Reliability | architecture, testing, security, performance | Strong practical source for senior backend | candidate | sarwan_review_required | Validate against official docs where needed |
| node-design-patterns | Node.js Design Patterns | https://www.nodejsdesignpatterns.com/ | book | Node.js | Tier 2 | medium | Architecture and async design patterns | Node Backend, LLD | streams, async patterns, modules | Useful canonical book candidate | candidate | sarwan_review_required | Commercial source; cite as reference only |
| express-docs | Express Docs | https://expressjs.com/ | official docs | Node.js | Tier 1 | high | Common Node backend framework | Node Backend | routing, middleware, error handling | Official framework source | candidate | sarwan_review_required | Include if Express remains in beta stack |
| backend-roadmap | roadmap.sh Backend Roadmap | https://roadmap.sh/backend | roadmap | Backend Engineering | Tier 2 | medium | Market-aligned backend topic coverage | Backend Engineering | APIs, caching, auth, databases, scaling | Strong topic discovery and gap check | candidate | sarwan_review_required | Roadmap validation, not canonical |
| backend-12factor | The Twelve-Factor App | https://12factor.net/ | canonical guide | Backend Engineering | Tier 1 | high | Backend deployment and operations basics | Backend Engineering, DevOps | config, logs, processes, dependencies | Canonical operational principles | approved | sarwan_review_required | Good proof rubric reference |
| backend-ms-api-guidelines | Microsoft REST API Guidelines | https://github.com/microsoft/api-guidelines | GitHub repo | Backend Engineering | Tier 2 | high | API design competency | Backend Engineering, System Design | REST, versioning, errors, pagination | Practical API design reference | candidate | sarwan_review_required | Compare with Zalando guidance |
| backend-zalando-api-guidelines | Zalando RESTful API Guidelines | https://opensource.zalando.com/restful-api-guidelines/ | engineering guide | Backend Engineering | Tier 2 | high | Production API design maturity | Backend Engineering, System Design | API contracts, naming, compatibility | Strong real-world API standards | candidate | sarwan_review_required | Useful for architecture reviews |
| backend-martin-fowler | Martin Fowler Articles | https://martinfowler.com/ | engineering blog | Backend Engineering | Tier 2 | high | Architecture vocabulary and tradeoffs | Backend Engineering, LLD, Leadership | architecture, refactoring, microservices | High-signal architecture reference | candidate | sarwan_review_required | Select specific articles later |
| db-postgres-docs | PostgreSQL Docs | https://www.postgresql.org/docs/ | official docs | Databases | Tier 1 | high | Required backend/database fluency | Databases | indexing, transactions, query planning | Canonical PostgreSQL source | approved | sarwan_review_required | P0 for backend/architect path |
| db-redis-docs | Redis Docs | https://redis.io/docs/latest/ | official docs | Databases | Tier 1 | high | Caching and distributed state readiness | Databases, Distributed Systems | caching, data structures, persistence | Canonical Redis source | approved | sarwan_review_required | P0 for system design |
| db-mongodb-docs | MongoDB Docs | https://www.mongodb.com/docs/ | official docs | Databases | Tier 1 | high | NoSQL architecture tradeoffs | Databases | document modeling, indexing, replication | Official NoSQL source | candidate | sarwan_review_required | Useful but not central if beta is SQL-heavy |
| db-use-index-luke | Use The Index, Luke | https://use-the-index-luke.com/ | book/site | Databases | Tier 2 | high | SQL indexing and performance | Databases | indexes, query optimization | Excellent practical database performance source | candidate | sarwan_review_required | Map to DB proof tasks |
| db-ddia | Designing Data-Intensive Applications | https://dataintensive.net/ | book | Databases | Tier 1 | high | Distributed data systems foundation | Databases, Distributed Systems | storage, replication, consistency | Canonical senior/staff engineering source | candidate | sarwan_review_required | Commercial book; use as reference metadata |
| hld-system-design-primer | System Design Primer | https://github.com/donnemartin/system-design-primer | GitHub repo | System Design / HLD | Tier 2 | high | HLD interview preparation | System Design | scalability, caching, load balancing | Must-have interview source | candidate | sarwan_review_required | Validate against official docs |
| hld-bytebytego | ByteByteGo | https://bytebytego.com/ | learning resource | System Design / HLD | Tier 3 | medium | Practical system design explanations | System Design | common architectures, diagrams, tradeoffs | Strong practical prep source | candidate | sarwan_review_required | Avoid copying content |
| hld-awesome-system-design | Awesome System Design Resources | https://github.com/ashishps1/awesome-system-design-resources | GitHub repo | System Design / HLD | Tier 2 | medium | Discovery index for system design | System Design | HLD resources, architecture patterns | Required seed discovery source | candidate | sarwan_review_required | Use to discover, not as direct truth |
| hld-roadmap-system-design | roadmap.sh System Design Roadmap | https://roadmap.sh/system-design | roadmap | System Design / HLD | Tier 2 | medium | Market validation for HLD topics | System Design | distributed systems, design process | Helps sequence roadmap projection | candidate | sarwan_review_required | Validate topics before syllabus entry |
| hld-design-gurus | Grokking System Design Interview | https://www.designgurus.io/course/grokking-the-system-design-interview | course | System Design / HLD | Tier 3 | medium | Common interview framing | System Design, Interview Readiness | HLD patterns, interview flow | Useful market benchmark | parked | sarwan_review_required | Commercial; do not depend on it |
| lld-refactoring-guru | Refactoring Guru Design Patterns | https://refactoring.guru/design-patterns | learning resource | LLD / Design Patterns | Tier 2 | medium | Design patterns review | LLD | creational, structural, behavioral patterns | Clear design-pattern explanations | candidate | sarwan_review_required | Support only; validate with practice |
| lld-sourcemaking | SourceMaking Design Patterns | https://sourcemaking.com/design_patterns | learning resource | LLD / Design Patterns | Tier 3 | medium | Pattern reference | LLD | design patterns, anti-patterns | Useful supplementary source | candidate | sarwan_review_required | Supporting source |
| lld-primer | Low Level Design Primer | https://github.com/prasadgujar/low-level-design-primer | GitHub repo | LLD / Design Patterns | Tier 2 | medium | LLD interview practice | LLD, Interview Readiness | machine coding, OOD, examples | Practical LLD discovery source | candidate | sarwan_review_required | Validate examples |
| lld-awesome-low-level-design | Awesome Low Level Design | https://github.com/ashishps1/awesome-low-level-design | GitHub repo | LLD / Design Patterns | Tier 2 | medium | LLD resource index | LLD | OOD, design questions, examples | Useful candidate source list | candidate | sarwan_review_required | Discovery index |
| lld-oodesign | OODesign | https://www.oodesign.com/ | learning resource | LLD / Design Patterns | Tier 3 | medium | OOP design basics | LLD | OOD principles, patterns | Supports OOP refresh | candidate | sarwan_review_required | Check freshness |
| aws-docs | AWS Documentation | https://docs.aws.amazon.com/ | official docs | AWS / Cloud Architecture | Tier 1 | high | Core cloud architecture source | AWS / Cloud | AWS services, architecture, operations | Canonical AWS source | approved | sarwan_review_required | P0 |
| aws-well-architected | AWS Well-Architected Framework | https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html | official docs | AWS / Cloud Architecture | Tier 1 | high | Solution Architect core rubric | AWS / Cloud, System Design | reliability, security, cost, operations | Primary architect-readiness source | approved | sarwan_review_required | P0 proof rubric |
| aws-architecture-center | AWS Architecture Center | https://aws.amazon.com/architecture/ | official docs | AWS / Cloud Architecture | Tier 1 | high | Reference architectures | AWS / Cloud, System Design | architecture patterns, diagrams | Strong case-study inspiration | approved | sarwan_review_required | Use for architecture reviews |
| aws-builders-library | Amazon Builders' Library | https://aws.amazon.com/builders-library/ | engineering blog | AWS / Cloud Architecture | Tier 1 | high | Deep production tradeoffs | AWS / Cloud, Distributed Systems | retries, timeouts, operations | Excellent senior/staff source | candidate | sarwan_review_required | Select articles later |
| aws-solution-architect-roadmap | Solution Architect Road Map | https://github.com/NikAshanin/Solution-Architect-Road-Map | GitHub repo | AWS / Cloud Architecture | Tier 2 | medium | Architect role coverage seed | AWS / Cloud, Solution Architect | cloud, networking, security, architecture | Required GitHub seed source | candidate | sarwan_review_required | Validate against AWS docs |
| dist-google-sre-book | Google SRE Book | https://sre.google/sre-book/table-of-contents/ | canonical book | Distributed Systems | Tier 1 | high | Reliability and distributed operations | Distributed Systems, Reliability | SLOs, toil, incidents, reliability | Canonical reliability source | approved | sarwan_review_required | P0/P1 depending path stage |
| dist-raft-paper | Raft Consensus Paper | https://raft.github.io/raft.pdf | paper | Distributed Systems | Tier 1 | high | Consensus fundamentals | Distributed Systems | consensus, leader election, replication | Canonical distributed systems source | candidate | sarwan_review_required | Advanced; include selectively |
| dist-patterns | Patterns of Distributed Systems | https://martinfowler.com/articles/patterns-of-distributed-systems/ | engineering guide | Distributed Systems | Tier 2 | high | Practical distributed patterns | Distributed Systems | clocks, quorum, replication, coordination | Strong mapping source | candidate | sarwan_review_required | Good for capability extraction |
| dist-jepsen | Jepsen Analyses | https://jepsen.io/analyses | engineering analysis | Distributed Systems | Tier 2 | high | Real-world consistency lessons | Distributed Systems, Databases | consistency, partitions, testing | Deepens architecture tradeoffs | candidate | sarwan_review_required | Advanced supporting source |
| dist-kafka-docs | Apache Kafka Docs | https://kafka.apache.org/documentation/ | official docs | Distributed Systems | Tier 1 | high | Messaging and streaming architecture | Distributed Systems | topics, partitions, consumer groups | Canonical event-streaming source | candidate | sarwan_review_required | Include if event systems are P0 |
| sec-owasp-cheatsheets | OWASP Cheat Sheet Series | https://cheatsheetseries.owasp.org/ | security guide | Security | Tier 1 | high | Backend security practices | Security | auth, validation, secrets, API security | High-trust security guidance | approved | sarwan_review_required | P1 but architect-critical |
| sec-owasp-top10 | OWASP Top 10 | https://owasp.org/www-project-top-ten/ | security guide | Security | Tier 1 | high | Common web risk model | Security | injection, auth, misconfig, SSRF | Canonical web security source | approved | sarwan_review_required | Map to security readiness |
| sec-oauth-rfc | OAuth 2.0 RFC 6749 | https://www.rfc-editor.org/rfc/rfc6749 | standard | Security | Tier 1 | high | Auth architecture grounding | Security, System Design | OAuth flows, tokens, clients | Canonical auth standard | candidate | sarwan_review_required | Use with practical docs |
| sec-openid-connect | OpenID Connect Overview | https://openid.net/developers/how-connect-works/ | standard docs | Security | Tier 1 | high | Identity architecture | Security | OIDC, identity, claims | Important for architect interviews | candidate | sarwan_review_required | Pair with OAuth |
| sec-portswigger | PortSwigger Web Security Academy | https://portswigger.net/web-security | learning resource | Security | Tier 2 | high | Practical security training | Security | vulnerabilities, exploitation, defense | Strong hands-on security source | candidate | sarwan_review_required | Practice optional for beta |
| obs-opentelemetry | OpenTelemetry Docs | https://opentelemetry.io/docs/ | official docs | Observability / Reliability | Tier 1 | high | Modern observability standard | Observability, Reliability | traces, metrics, logs, instrumentation | Canonical observability source | approved | sarwan_review_required | P1 |
| obs-prometheus | Prometheus Docs | https://prometheus.io/docs/introduction/overview/ | official docs | Observability / Reliability | Tier 1 | high | Metrics and alerting basics | Observability, Reliability | metrics, alerting, PromQL | Canonical monitoring source | candidate | sarwan_review_required | Pair with SLOs |
| obs-grafana | Grafana Docs | https://grafana.com/docs/ | official docs | Observability / Reliability | Tier 1 | high | Dashboards and observability UX | Observability | dashboards, visualization, alerts | Practical ops reference | candidate | sarwan_review_required | Supporting |
| obs-sre-workbook | Google SRE Workbook | https://sre.google/workbook/table-of-contents/ | canonical book | Observability / Reliability | Tier 1 | high | SRE implementation patterns | Reliability, Leadership | SLOs, incident response, alerting | Strong proof-task source | candidate | sarwan_review_required | P1 |
| obs-sloth | Sloth SLO Generator | https://sloth.dev/ | tool docs | Observability / Reliability | Tier 3 | medium | Practical SLO modeling | Reliability | SLOs, error budgets | Useful for implementation proof | candidate | sarwan_review_required | Optional |
| devops-kubernetes | Kubernetes Docs | https://kubernetes.io/docs/ | official docs | DevOps / Containers / Kubernetes | Tier 1 | high | Cloud platform literacy | DevOps, AWS / Cloud | pods, deployments, services | Official K8s source | parked | sarwan_review_required | Later, not P0 |
| devops-docker | Docker Docs | https://docs.docker.com/ | official docs | DevOps / Containers / Kubernetes | Tier 1 | high | Container fundamentals | DevOps | images, compose, networking | Practical backend deployment source | candidate | sarwan_review_required | P1 |
| devops-github-actions | GitHub Actions Docs | https://docs.github.com/en/actions | official docs | DevOps / Containers / Kubernetes | Tier 1 | high | CI/CD workflow literacy | DevOps | workflows, runners, deployments | Useful for proof projects | candidate | sarwan_review_required | P1 |
| devops-terraform | Terraform Docs | https://developer.hashicorp.com/terraform/docs | official docs | DevOps / Containers / Kubernetes | Tier 1 | high | Infrastructure-as-code literacy | DevOps, AWS / Cloud | IaC, providers, state | Architect-adjacent skill | candidate | sarwan_review_required | P1/P2 |
| devops-helm | Helm Docs | https://helm.sh/docs/ | official docs | DevOps / Containers / Kubernetes | Tier 1 | high | Kubernetes packaging awareness | DevOps | charts, releases, values | Supporting K8s source | parked | sarwan_review_required | Later, not P0 |
| dsa-neetcode | NeetCode Roadmap | https://neetcode.io/roadmap | interview roadmap | DSA / Problem Solving | Tier 2 | medium | Coding interview topic map | DSA, Interview Readiness | arrays, trees, graphs, DP | Required interview prep seed | candidate | sarwan_review_required | Validate scope for limited time |
| dsa-leetcode | LeetCode Problemset | https://leetcode.com/problemset/ | interview practice | DSA / Problem Solving | Tier 2 | medium | Coding practice source | DSA | problem solving, patterns | Market-standard coding prep | candidate | sarwan_review_required | Do not clone LeetCode |
| dsa-algorithms-js | The Algorithms JavaScript | https://github.com/TheAlgorithms/JavaScript | GitHub repo | DSA / Problem Solving | Tier 2 | medium | JS implementation examples | DSA, JS/TS Foundations | algorithms, data structures | Useful for implementation practice | candidate | sarwan_review_required | Validate solution quality |
| dsa-tech-interview-handbook | Tech Interview Handbook | https://github.com/yangshun/tech-interview-handbook | GitHub repo | DSA / Problem Solving | Tier 2 | high | Interview preparation system | DSA, Behavioral, Offer Readiness | coding, behavioral, negotiation | Broad interview-prep source | candidate | sarwan_review_required | Useful across categories |
| dsa-coding-interview-university | Coding Interview University | https://github.com/jwasham/coding-interview-university | GitHub repo | DSA / Problem Solving | Tier 2 | medium | CS and interview roadmap | DSA | CS fundamentals, algorithms | Broad discovery source | parked | sarwan_review_required | Too broad for beta unless filtered |
| sa-roadmap-aws | roadmap.sh AWS Roadmap | https://roadmap.sh/aws | roadmap | Solution Architect | Tier 2 | medium | AWS learning sequence | Solution Architect, AWS / Cloud | AWS services, cloud architecture | Market-aligned cloud roadmap | candidate | sarwan_review_required | Validate against AWS docs |
| sa-aws-associate | AWS Solutions Architect Associate | https://aws.amazon.com/certification/certified-solutions-architect-associate/ | certification docs | Solution Architect | Tier 1 | high | Architect baseline signal | Solution Architect, AWS / Cloud | architecture, AWS services | Official role-aligned exam blueprint source | candidate | sarwan_review_required | Not necessarily certification-first |
| sa-aws-professional | AWS Solutions Architect Professional | https://aws.amazon.com/certification/certified-solutions-architect-professional/ | certification docs | Solution Architect | Tier 1 | high | Advanced architect readiness | Solution Architect, AWS / Cloud | multi-account, migration, governance | Official advanced architecture signal | candidate | sarwan_review_required | Use for stretch topics |
| sa-prescriptive-guidance | AWS Prescriptive Guidance | https://docs.aws.amazon.com/prescriptive-guidance/ | official docs | Solution Architect | Tier 1 | high | Real architecture migration patterns | Solution Architect | migration, modernization, resilience | Strong practical architect source | approved | sarwan_review_required | P0/P1 |
| sa-aws-samples | AWS Samples | https://github.com/aws-samples | GitHub org | Solution Architect | Tier 2 | medium | Implementation proof references | Solution Architect, AWS / Cloud | reference implementations, demos | Useful for proof-of-competency ideas | candidate | sarwan_review_required | Select repos later |
| em-leaddev | LeadDev | https://leaddev.com/ | publication | Engineering Manager | Tier 2 | medium | EM-aware leadership growth | Leadership | management, tech leadership, delivery | Useful for tertiary EM readiness | candidate | sarwan_review_required | Not P0 |
| em-engineering-management | Engineering Management Resources | https://github.com/charlax/engineering-management | GitHub repo | Engineering Manager | Tier 2 | medium | EM discovery source | Leadership | management, hiring, feedback | Broad source index | candidate | sarwan_review_required | Needs filtering |
| em-managers-playbook | Manager's Playbook | https://github.com/ksindi/managers-playbook | GitHub repo | Engineering Manager | Tier 3 | medium | Practical management concepts | Leadership | 1:1s, feedback, performance | Supporting EM source | candidate | sarwan_review_required | Tertiary only |
| em-rands | Rands in Repose | https://randsinrepose.com/ | blog | Engineering Manager | Tier 2 | medium | Engineering leadership thinking | Leadership | management, communication, teams | Strong leadership essays | candidate | sarwan_review_required | Select relevant posts later |
| em-lara-hogan | Lara Hogan | https://larahogan.me/blog/ | blog | Engineering Manager | Tier 2 | medium | Management and coaching practices | Leadership | feedback, coaching, teams | Practical EM source | candidate | sarwan_review_required | Tertiary only |
| staff-staffeng | StaffEng | https://staffeng.com/ | canonical site | Lead / Principal / Staff Engineering | Tier 1 | high | Staff/principal role clarity | Leadership, Staff Readiness | archetypes, influence, scope | Required Staff source | approved | sarwan_review_required | P1 |
| staff-engineers-path | The Staff Engineer's Path | https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/ | book | Lead / Principal / Staff Engineering | Tier 1 | high | Staff-level operating model | Leadership, Staff Readiness | influence, technical strategy, execution | Required canonical book | candidate | sarwan_review_required | Commercial book metadata only |
| staff-will-larson | Irrational Exuberance / Will Larson | https://lethain.com/ | blog/book site | Lead / Principal / Staff Engineering | Tier 1 | high | Engineering leadership and Staff growth | Leadership, Staff Readiness | strategy, execution, org design | Required leadership source | approved | sarwan_review_required | Select articles later |
| staff-plus-plus | StaffPlus | https://leaddev.com/staffplus | conference/resource | Lead / Principal / Staff Engineering | Tier 2 | medium | Staff+ role expectations | Leadership, Staff Readiness | scope, influence, technical leadership | Good role-signal source | candidate | sarwan_review_required | Supporting |
| staff-tech-leadership-path | Thriving on the Technical Leadership Path | https://keavy.com/work/thriving-on-the-technical-leadership-path/ | article | Lead / Principal / Staff Engineering | Tier 2 | medium | Technical leadership framing | Leadership | influence, communication, leverage | Useful Staff/Lead framing | candidate | sarwan_review_required | Validate and map selectively |
| beh-tech-handbook | Tech Interview Handbook Behavioral | https://www.techinterviewhandbook.org/behavioral-interview/ | interview guide | Behavioral Interviews | Tier 2 | high | Behavioral interview readiness | Behavioral, Offer Readiness | STAR, common questions, stories | Practical behavioral prep source | candidate | sarwan_review_required | Map to story bank |
| beh-amazon-lp | Amazon Leadership Principles | https://www.amazon.jobs/content/en/our-workplace/leadership-principles | company hiring docs | Behavioral Interviews | Tier 1 | high | FAANG-style behavioral signal | Behavioral, Leadership | ownership, dive deep, bias for action | Canonical company signal | approved | sarwan_review_required | Useful for story rubrics |
| beh-google-hiring | Google How We Hire | https://careers.google.com/how-we-hire/interview/ | company hiring docs | Behavioral Interviews | Tier 1 | high | Big-tech interview expectations | Behavioral, Interview Readiness | interview process, assessment | Strong market signal | candidate | sarwan_review_required | Company-specific |
| beh-mit-star | MIT STAR Method | https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/ | career guide | Behavioral Interviews | Tier 2 | high | Story structure | Behavioral | STAR, examples, reflection | Clean behavioral story framework | candidate | sarwan_review_required | Use as structure only |
| beh-levels | Levels.fyi Behavioral Questions | https://www.levels.fyi/blog/behavioral-interview-questions.html | career guide | Behavioral Interviews | Tier 3 | medium | Interview question discovery | Behavioral | behavioral questions, story prompts | Useful supporting question bank | candidate | sarwan_review_required | Validate against stronger sources |
| profile-tech-handbook-resume | Tech Interview Handbook Resume | https://www.techinterviewhandbook.org/resume/ | career guide | Resume / LinkedIn / GitHub / Portfolio | Tier 2 | high | Resume readiness | Offer Readiness | resume bullets, impact, structure | Practical senior interview resume guidance | candidate | sarwan_review_required | Map to offer readiness |
| profile-github-profile | GitHub Profile README Docs | https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/about-your-profile | official docs | Resume / LinkedIn / GitHub / Portfolio | Tier 1 | high | GitHub proof-of-work polish | Offer Readiness | profile README, GitHub presence | Official GitHub profile reference | candidate | sarwan_review_required | Useful for portfolio mission |
| profile-linkedin-help | LinkedIn Profile Help | https://www.linkedin.com/help/linkedin/answer/a507508 | official docs | Resume / LinkedIn / GitHub / Portfolio | Tier 1 | high | LinkedIn profile completeness | Offer Readiness | profile sections, visibility | Official LinkedIn profile reference | candidate | sarwan_review_required | Needs practical strategy source too |
| profile-google-resume | Google Resume Tips | https://careers.google.com/how-we-hire/resume/ | company hiring docs | Resume / LinkedIn / GitHub / Portfolio | Tier 1 | high | Big-tech resume signal | Offer Readiness | resume review, impact framing | Company hiring guidance | candidate | sarwan_review_required | Good for resume rubric |
| profile-github-readme-awesome | Awesome GitHub Profile README | https://github.com/abhisheknaiidu/awesome-github-profile-readme | GitHub repo | Resume / LinkedIn / GitHub / Portfolio | Tier 3 | medium | Portfolio inspiration | Offer Readiness | profile examples, presentation | Useful examples for GitHub polish | candidate | sarwan_review_required | Avoid copying examples |
| pgcc-grind75 | Grind 75 | https://www.techinterviewhandbook.org/grind75 | interview roadmap | Product Company / GCC Interview Prep | Tier 2 | medium | Coding interview prioritization | DSA, Interview Readiness | curated coding practice | Helps focus limited-time prep | candidate | sarwan_review_required | Use only relevant subset |
| pgcc-interviewing-io | interviewing.io Blog | https://interviewing.io/blog | interview blog | Product Company / GCC Interview Prep | Tier 2 | medium | Interview market insights | Interview Readiness | coding, mock interviews, hiring | Practical interview signal source | candidate | sarwan_review_required | Select data-backed posts |
| pgcc-pramp | Pramp | https://www.pramp.com/ | mock interview platform | Product Company / GCC Interview Prep | Tier 3 | medium | Mock interview practice option | Interview Readiness | mocks, feedback | Useful external practice path | candidate | sarwan_review_required | Not required dependency |
| pgcc-educative-system-design | Educative System Design | https://www.educative.io/courses/grokking-the-system-design-interview | course | Product Company / GCC Interview Prep | Tier 3 | medium | Common paid interview-prep benchmark | System Design, Interview Readiness | system design interviews | Useful market benchmark | parked | sarwan_review_required | Commercial; do not depend on it |
| pgcc-levels-blog | Levels.fyi Blog | https://www.levels.fyi/blog/ | career blog | Product Company / GCC Interview Prep | Tier 3 | medium | Hiring and compensation context | Offer Readiness | interviewing, compensation, career | Useful market signal | candidate | sarwan_review_required | Needs India/GCC-specific sources later |
| career-levels | Levels.fyi | https://www.levels.fyi/ | compensation database | Career Strategy / Compensation / Applications | Tier 2 | medium | Compensation calibration | Offer Readiness | compensation, levels, negotiation | Useful for stretch-package thinking | candidate | sarwan_review_required | India/GCC coverage may vary |
| career-ambitionbox | AmbitionBox Salaries | https://www.ambitionbox.com/salaries | compensation database | Career Strategy / Compensation / Applications | Tier 2 | medium | India compensation signal | Offer Readiness | salaries, company research | Useful India market source | candidate | sarwan_review_required | Validate current data manually |
| career-haseeb-negotiation | Ten Rules for Negotiating a Job Offer | https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/ | career guide | Career Strategy / Compensation / Applications | Tier 2 | medium | Offer negotiation strategy | Offer Readiness | negotiation, offers, leverage | Strong practical negotiation source | candidate | sarwan_review_required | Adapt to India/GCC context |
| career-linkedin-solution-architect-jobs | LinkedIn Solution Architect Jobs | https://www.linkedin.com/jobs/search/?keywords=Solution%20Architect | job descriptions | Career Strategy / Compensation / Applications | Tier 2 | medium | Current target-role market signal | Solution Architect, Offer Readiness | job requirements, cloud, architecture | Required JD source class | candidate | sarwan_review_required | Dynamic search; review manually |
| career-linkedin-staff-engineer-jobs | LinkedIn Staff Engineer Jobs | https://www.linkedin.com/jobs/search/?keywords=Staff%20Engineer | job descriptions | Career Strategy / Compensation / Applications | Tier 2 | medium | Staff readiness market signal | Staff Readiness, Offer Readiness | technical leadership, scope | Required JD source class | candidate | sarwan_review_required | Dynamic search; review manually |
| career-linkedin-lead-backend-jobs | LinkedIn Lead Backend Engineer Jobs | https://www.linkedin.com/jobs/search/?keywords=Lead%20Backend%20Engineer | job descriptions | Career Strategy / Compensation / Applications | Tier 2 | medium | Lead Backend market signal | Backend Engineering, Offer Readiness | backend leadership, scale, APIs | Required JD source class | candidate | sarwan_review_required | Dynamic search; review manually |
| career-linkedin-em-jobs | LinkedIn Engineering Manager Jobs | https://www.linkedin.com/jobs/search/?keywords=Engineering%20Manager | job descriptions | Career Strategy / Compensation / Applications | Tier 2 | medium | EM-aware capability signal | Leadership, Offer Readiness | people management, delivery, hiring | Required JD source class | candidate | sarwan_review_required | EM is tertiary for beta |
| career-payscale-sa-india | PayScale India Solution Architect Salary | https://www.payscale.com/research/IN/Job=Solutions_Architect/Salary | compensation database | Career Strategy / Compensation / Applications | Tier 3 | medium | India compensation benchmark | Offer Readiness | salary, market bands | Additional India salary signal | candidate | sarwan_review_required | Validate recency manually |

## Capability Coverage Mapping

| Capability Area | Primary Seed Sources |
| --- | --- |
| JS/TS Foundations | MDN JavaScript Guide, MDN Reference, TypeScript Docs, TypeScript Handbook, 33 JS Concepts |
| Node Backend | Node.js API Docs, Node.js Learn, Node.js Best Practices, Express Docs |
| Backend Engineering | roadmap.sh Backend, Twelve-Factor App, Microsoft API Guidelines, Zalando API Guidelines, Martin Fowler |
| Databases | PostgreSQL Docs, Redis Docs, MongoDB Docs, Use The Index Luke, DDIA |
| System Design / HLD | System Design Primer, ByteByteGo, Awesome System Design Resources, roadmap.sh System Design, AWS Architecture Center |
| LLD | Refactoring Guru, Low Level Design Primer, Awesome Low Level Design, OODesign |
| Distributed Systems | Google SRE Book, Raft, Patterns of Distributed Systems, Jepsen, Kafka Docs |
| AWS / Cloud | AWS Docs, AWS Well-Architected, AWS Architecture Center, AWS Builders' Library, AWS Prescriptive Guidance |
| Security | OWASP Cheat Sheets, OWASP Top 10, OAuth RFC, OpenID Connect, PortSwigger |
| Observability / Reliability | OpenTelemetry, Prometheus, Grafana, SRE Workbook, Sloth |
| DevOps | Docker, GitHub Actions, Terraform, Kubernetes, Helm |
| DSA | NeetCode, LeetCode, The Algorithms JS, Tech Interview Handbook, Coding Interview University |
| Behavioral | Tech Interview Handbook Behavioral, Amazon Leadership Principles, Google How We Hire, MIT STAR |
| Leadership / Staff / EM | StaffEng, Staff Engineer's Path, Will Larson, LeadDev, Rands, Lara Hogan |
| Offer Readiness | Tech Interview Handbook Resume, Google Resume Tips, LinkedIn Jobs, Levels.fyi, AmbitionBox, Haseeb negotiation |

## Source Quality Rules

- Prefer official documentation and canonical books for definitions and core truth.
- Use GitHub repositories and roadmaps for discovery, sequencing, and practical checklists.
- Use interview-prep sources for question patterns and readiness rubrics, not as sole technical authority.
- Use company blogs for real-world tradeoffs and case-study inspiration.
- Use job descriptions for market validation and target-role capability extraction.
- Keep source metadata separate from EngineeringOS syllabus content.
- Do not copy source content into EngineeringOS. Summarize, cite, map, and create original explanations and tasks.
- Beta-critical mappings require Sarwan approval.
- Dynamic sources such as LinkedIn job searches require manual recency checks before final use.

## Source Gaps

Known gaps to close during topic-driven discovery:

- EM interview prep sources with strong, current, senior-level signal.
- India/GCC compensation, hiring, and role-expectation sources beyond AmbitionBox, PayScale, LinkedIn, and Levels.fyi.
- Principal Engineer role expectations across Product and GCC contexts.
- Behavioral story frameworks for architect-level ownership, ambiguity, conflict, and influence.
- Architecture case-study references for:
  - EngineeringOS Architecture.
  - Large Scale Learning Platform.
  - Career Operating System.
  - Agent-OS Multi-Agent Platform.
  - High Scale Notification System.
  - Distributed Content Delivery Platform.
  - Large Scale Interview Platform.
- More company engineering blogs from product/GCC-like companies.
- Current India-specific Solution Architect, Lead Backend, Staff Engineer, and EM job descriptions.

## Future Data Structure

Implementation can later add:

```txt
src/data/sources/source-catalog.ts
src/data/sources/source-topic-map.ts
src/data/ingestion/discovery-patterns.ts
src/data/ingestion/source-quality-rules.ts
src/data/ingestion/seed-resource-queries.ts
```

Do not create these files until the source catalog and capability graph are reviewed.

## Next Planning Artifact

Create:

```txt
docs/CAPABILITY_GRAPH_MODEL_V2.md
```

It should convert the founder beta path into a concrete capability graph for:

```txt
Primary: Solution Architect
Secondary: Lead Backend
Tertiary: Engineering Manager awareness
```

The next doc should define capability IDs, weights, prerequisite links, proof artifacts, source mappings, and readiness thresholds.
