# Capability Graph Model V2

Date: 2026-06-04

## Purpose

This document defines the core engine of EngineeringOS.

Everything else is derived from this model:

- Master Syllabus.
- Roadmap Projection.
- Daily Missions.
- Readiness Engine.
- Topic Readiness.
- Interview Readiness.
- Offer Readiness.
- Progress Tracking.

EngineeringOS is not course-centric. EngineeringOS is capability-centric.

The core model is:

```txt
Current State
  -> Target Role
  -> Capability Graph
  -> Roadmap Projection
  -> Daily Missions
  -> Readiness
  -> Offer Readiness
```

## Founder Beta Context

Founder beta target priority:

1. Solution Architect.
2. Engineering Manager-aware support.
3. Lead Backend Engineer.
4. Principal Engineer.
5. Staff Engineer.

Primary outcome:

```txt
70-80+ LPA Product / GCC / FAANG-level readiness
```

Timeline:

```txt
16 weeks
10 hours/week
160 total planned hours
```

Current profile:

- 10+ years backend experience.
- Current compensation: approximately 40 LPA.
- Compensation floor: 60 LPA.
- Compensation target: 70-80 LPA.
- Stretch target: 90+ LPA.

Architect remains the highest-priority optimization because it has the strongest alignment with backend experience, the highest transferable capability graph, and strong Product/GCC compensation potential. EM is support only for the founder beta. EngineeringOS should build EM-aware stories, stakeholder communication, mentoring evidence, incident communication, and leadership judgment, but it should not treat EM as a full beta roadmap until stronger people-management evidence exists.

## 1. What Is A Capability Graph?

A Capability Graph is a role-readiness engine that models what the founder must be able to do, prove, explain, and apply for target roles.

Definitions:

| Model | Meaning | Example |
| --- | --- | --- |
| Capability | A measurable ability needed for a target role. | Design reliable AWS-backed systems. |
| Skill | A smaller applied ability inside a capability. | Choose RDS vs DynamoDB for a workload. |
| Topic | A learnable unit from the Master Syllabus. | DynamoDB partition keys. |
| Task | A concrete action that builds or tests readiness. | Design a high-scale notification data model. |
| Proof Of Competency | Evidence that the user can apply the capability at target level. | HLD + tradeoff review + interview answer. |

Capabilities are more important than courses because a course only says what was consumed. A capability says what the user can actually do. EngineeringOS must optimize for evidence-backed transformation, not content completion.

## 2. Canonical Hierarchy

EngineeringOS must use this hierarchy:

```txt
Role
  -> Capability
    -> Skill
      -> Topic
        -> Task
          -> Proof Of Competency
```

Example: Solution Architect

```txt
Role: Solution Architect
  -> Capability: Design reliable AWS-backed systems
    -> Skill: Model availability, failover, and disaster recovery tradeoffs
      -> Topic: Multi-AZ architecture
        -> Task: Design a multi-AZ backend API with RTO/RPO targets
          -> Proof: Architecture review with failure modes, cost, security, and rollback plan
```

Example: Engineering Manager

```txt
Role: Engineering Manager-aware support
  -> Capability: Communicate delivery risk
    -> Skill: Align stakeholders around scope, tradeoffs, and timeline
      -> Topic: Delivery delay communication
        -> Task: Write a stakeholder update for a delayed critical release
          -> Proof: Behavioral answer with context, action, tradeoff, result, and learning
```

Example: Lead Backend

```txt
Role: Lead Backend Engineer
  -> Capability: Own production backend reliability
    -> Skill: Design idempotent APIs and failure handling
      -> Topic: Idempotency keys
        -> Task: Design payment retry behavior
          -> Proof: API contract + failure-mode analysis + incident prevention checklist
```

## 3. Founder Beta Capability Categories

The founder beta graph has 5 capability groups and 35 initial capabilities.

## Technical

| capabilityId | Capability |
| --- | --- |
| `cap-js-foundations` | JavaScript |
| `cap-ts-backend-types` | TypeScript |
| `cap-node-backend` | Node.js Backend |
| `cap-databases` | Databases |
| `cap-distributed-systems` | Distributed Systems |
| `cap-system-design-hld` | System Design (HLD) |
| `cap-low-level-design` | Low Level Design |
| `cap-aws-cloud-architecture` | AWS / Cloud Architecture |
| `cap-security` | Security |
| `cap-observability-reliability` | Observability / Reliability |
| `cap-devops-awareness` | DevOps Awareness |
| `cap-dsa-problem-solving` | DSA / Problem Solving |

## Leadership

| capabilityId | Capability |
| --- | --- |
| `cap-technical-leadership` | Technical Leadership |
| `cap-mentoring` | Mentoring |
| `cap-stakeholder-management` | Stakeholder Management |
| `cap-decision-making` | Decision Making |
| `cap-ownership` | Ownership |

## Behavioral & Communication

Behavioral and communication capabilities are separate because senior hiring often fails on articulation, evidence, judgment, and influence even when technical knowledge exists.

| capabilityId | Capability |
| --- | --- |
| `cap-communication` | Communication |
| `cap-storytelling` | Storytelling |
| `cap-behavioral-interviews` | Behavioral Interviews |
| `cap-conflict-resolution` | Conflict Resolution |
| `cap-influence-without-authority` | Influence Without Authority |
| `cap-architecture-reviews` | Architecture Reviews |
| `cap-presentation-skills` | Presentation Skills |
| `cap-cross-team-communication` | Cross-team Communication |

## Career Assets

| capabilityId | Capability |
| --- | --- |
| `cap-resume` | Resume |
| `cap-linkedin` | LinkedIn |
| `cap-github-profile` | GitHub |
| `cap-portfolio` | Portfolio |
| `cap-architecture-case-studies` | Architecture Case Studies |

## Offer Readiness

| capabilityId | Capability |
| --- | --- |
| `cap-applications` | Applications |
| `cap-referrals` | Referrals |
| `cap-interview-pipeline` | Interview Pipeline |
| `cap-compensation-target` | Compensation Target |
| `cap-negotiation-awareness` | Negotiation Awareness |

## 4. Capability Definition Model

Every capability should be defined with this shape:

```txt
capabilityId
capabilityName
capabilityCategory
whyItMatters
targetRoles
priorityWeight
readinessThreshold
sourceCategories
sourceIds
roadmapDependencies
missionTypes
proofTypes
```

Example: AWS / Cloud Architecture

| Field | Value |
| --- | --- |
| capabilityId | `cap-aws-cloud-architecture` |
| capabilityName | AWS / Cloud Architecture |
| capabilityCategory | Technical |
| whyItMatters | Core evidence for Solution Architect readiness and cloud-heavy Product/GCC roles. |
| targetRoles | Solution Architect, Lead Backend, Principal Engineer, Staff Engineer, Engineering Manager |
| priorityWeight | Architect: 18, EM: 7, Lead Backend: 10, Principal: 13, Staff: 11 |
| readinessThreshold | 3.5/4 for Architect beta readiness |
| sourceCategories | AWS official docs, AWS architecture, roadmap, job descriptions, company engineering blogs |
| sourceIds | `aws-docs`, `aws-well-architected`, `aws-architecture-center`, `aws-builders-library`, `sa-prescriptive-guidance` |
| roadmapDependencies | `cap-system-design-hld`, `cap-security`, `cap-observability-reliability`, `cap-devops-awareness` |
| missionTypes | Learn, Implement, Interview, Revise, Weak Area Repair |
| proofTypes | AWS Design, HLD, Architecture Review, Incident Analysis |

Example: Behavioral Interviews

| Field | Value |
| --- | --- |
| capabilityId | `cap-behavioral-interviews` |
| capabilityName | Behavioral Interviews |
| capabilityCategory | Behavioral & Communication |
| whyItMatters | Experienced candidates must prove ownership, conflict handling, influence, and reflection. |
| targetRoles | Solution Architect, Engineering Manager, Lead Backend, Principal Engineer, Staff Engineer |
| priorityWeight | Architect: 9, EM: 16, Lead Backend: 9, Principal: 12, Staff: 12 |
| readinessThreshold | 3.25/4 for active interview readiness |
| sourceCategories | interview guides, company hiring docs, career frameworks |
| sourceIds | `beh-tech-handbook`, `beh-amazon-lp`, `beh-google-hiring`, `beh-mit-star` |
| roadmapDependencies | `cap-storytelling`, `cap-communication`, `cap-ownership` |
| missionTypes | Behavioral, Interview, Revise, Career Asset |
| proofTypes | Behavioral Answer, Case Study, Architecture Review Narrative |

Example: Architecture Case Studies

| Field | Value |
| --- | --- |
| capabilityId | `cap-architecture-case-studies` |
| capabilityName | Architecture Case Studies |
| capabilityCategory | Career Assets |
| whyItMatters | Converts real work into reusable HLD, LLD, tradeoff, review, and behavioral proof. |
| targetRoles | Solution Architect, Engineering Manager, Lead Backend, Principal Engineer, Staff Engineer |
| priorityWeight | Architect: 14, EM: 10, Lead Backend: 10, Principal: 15, Staff: 14 |
| readinessThreshold | 3.5/4 for at least 3 polished case studies |
| sourceCategories | AWS architecture, system design, company blogs, Staff/EM resources |
| sourceIds | `aws-architecture-center`, `aws-well-architected`, `hld-system-design-primer`, `staff-staffeng` |
| roadmapDependencies | `cap-system-design-hld`, `cap-architecture-reviews`, `cap-storytelling` |
| missionTypes | Implement, Interview, Behavioral, Career Asset, Revise |
| proofTypes | HLD, LLD, Architecture Review, Behavioral Answer, Portfolio Case Study |

## 5. Capability Dependencies

Capabilities form a graph, not a flat list.

Model:

```txt
Capability
  -> Prerequisite Capabilities
```

Dependency examples:

| Capability | Depends On | Why |
| --- | --- | --- |
| `cap-distributed-systems` | `cap-databases`, `cap-node-backend`, `cap-system-design-hld` | Distributed tradeoffs require backend and data-system grounding. |
| `cap-aws-cloud-architecture` | `cap-system-design-hld`, `cap-security`, `cap-observability-reliability`, `cap-devops-awareness` | Cloud architecture requires design, security, operations, and deployment awareness. |
| `cap-system-design-hld` | `cap-node-backend`, `cap-databases`, `cap-observability-reliability` | HLD quality depends on real backend, data, and operational understanding. |
| `cap-low-level-design` | `cap-ts-backend-types`, `cap-node-backend`, `cap-dsa-problem-solving` | LLD needs typed modeling, APIs, algorithms, and clean implementation judgment. |
| `cap-architecture-reviews` | `cap-system-design-hld`, `cap-aws-cloud-architecture`, `cap-decision-making`, `cap-communication` | Reviews require technical judgment and clear communication. |
| `cap-behavioral-interviews` | `cap-storytelling`, `cap-ownership`, `cap-communication` | Behavioral readiness needs structured real stories. |
| `cap-negotiation-awareness` | `cap-compensation-target`, `cap-interview-pipeline`, `cap-resume` | Negotiation depends on market clarity, pipeline leverage, and positioning. |

Major beta dependency chains:

```txt
Node.js Backend
  -> Databases
  -> Distributed Systems
  -> System Design (HLD)
  -> AWS / Cloud Architecture
  -> Architecture Reviews
  -> Solution Architect Readiness
```

```txt
Ownership
  -> Communication
  -> Storytelling
  -> Behavioral Interviews
  -> EM / Architect / Lead Final Round Readiness
```

```txt
Architecture Case Studies
  -> Portfolio
  -> Resume / LinkedIn / GitHub
  -> Applications / Referrals
  -> Offer Readiness
```

## 6. Capability Readiness

Capability readiness is calculated from evidence, not completion percentages.

Rollup:

```txt
Topic Readiness
  -> Skill Readiness
  -> Capability Readiness
```

Topic readiness uses four dimensions:

- Knowledge Score.
- Practice Score.
- Interview Score.
- Implementation Score.

Capability readiness should consider:

- Weighted readiness of required topics.
- Required skill coverage.
- Proof-of-competency status.
- Interview performance.
- Implementation evidence.
- Weak-area blockers.
- Source confidence for mapped topics.
- Recency of practice or revision.

Suggested capability readiness formula:

```txt
Capability Readiness =
  50% weighted topic readiness
  + 25% proof-of-competency readiness
  + 15% interview readiness for this capability
  + 10% recency / revision health
  - blocker penalties
```

Blocker penalties:

- Missing required proof: capability cannot exceed 2.5/4.
- Interview score below 2/4 for interview-critical capability: capability cannot exceed 3/4.
- Implementation score below 2/4 for architect/backend capability: capability cannot exceed 3/4.
- Source confidence below approved threshold for P0 topic: topic remains candidate and should not be treated as beta-ready.

Do not use raw completion percentages as readiness. Completion can inform activity history, but readiness must show what the user can explain, practice, interview, implement, and prove.

## 7. Role Readiness Mapping

Role readiness is a weighted rollup from capability readiness.

The founder beta should support all target roles, but the role weights differ.

| Capability | Solution Architect | Engineering Manager | Lead Backend | Principal Engineer | Staff Engineer |
| --- | ---: | ---: | ---: | ---: | ---: |
| AWS / Cloud Architecture | 18 | 7 | 10 | 13 | 11 |
| System Design (HLD) | 16 | 9 | 13 | 16 | 15 |
| Node.js Backend | 8 | 4 | 14 | 8 | 8 |
| Databases | 9 | 4 | 11 | 10 | 9 |
| Distributed Systems | 11 | 5 | 10 | 13 | 12 |
| Security | 8 | 4 | 7 | 8 | 8 |
| Observability / Reliability | 9 | 6 | 10 | 10 | 10 |
| LLD | 5 | 2 | 8 | 6 | 6 |
| DSA / Problem Solving | 5 | 1 | 6 | 4 | 4 |
| Technical Leadership | 5 | 12 | 7 | 10 | 11 |
| Stakeholder Management | 4 | 14 | 4 | 7 | 7 |
| Behavioral & Communication | 7 | 18 | 7 | 9 | 10 |
| Career Assets / Offer Readiness | 8 | 10 | 8 | 8 | 8 |

Why Architect has highest priority:

- It matches the founder's 10+ years backend foundation.
- It rewards system design, cloud architecture, tradeoffs, reliability, and communication.
- It has high transferability into Lead Backend, Principal, Staff, and EM-adjacent loops.
- It supports the strongest path toward 70-80+ LPA Product/GCC outcomes without requiring a full people-management track first.

## 8. Mission Mapping

Every capability must map to mission types.

Mission types:

- Learn.
- Practice.
- Implement.
- Interview.
- Revise.
- Weak Area Repair.
- Behavioral.
- Career Asset.

Examples:

| Capability | Mission Types | Example Mission |
| --- | --- | --- |
| `cap-aws-cloud-architecture` | Learn, Implement, Interview, Revise, Weak Area Repair | Design a multi-AZ API deployment and explain reliability/cost/security tradeoffs. |
| `cap-system-design-hld` | Learn, Practice, Interview, Revise, Implement | Run a 45-minute HLD mock for a notification system. |
| `cap-low-level-design` | Practice, Implement, Interview, Revise | Design a rate limiter API and class model with extension points. |
| `cap-databases` | Learn, Practice, Implement, Interview, Revise | Review a schema/index design and explain transaction tradeoffs. |
| `cap-behavioral-interviews` | Behavioral, Interview, Revise | Convert a production incident into a STAR story with follow-up answers. |
| `cap-architecture-case-studies` | Implement, Behavioral, Career Asset, Interview, Revise | Produce an HLD and tradeoff memo for EngineeringOS Architecture. |
| `cap-resume` | Career Asset, Revise | Rewrite resume bullets for Solution Architect positioning. |
| `cap-compensation-target` | Career Asset, Revise | Define floor, target, and stretch compensation assumptions with supporting market evidence. |

Daily Mission selection should prioritize high-weight capabilities with low readiness, missing proof, stale revision, or active interview/offer urgency.

## 9. Source Mapping

The Capability Graph must integrate with the Source Catalog. It should not exist independently.

Every capability must map to:

- Source categories.
- Source IDs.
- Discovery queries.

Examples:

| Capability | Source Categories | Source IDs | Discovery Queries |
| --- | --- | --- | --- |
| `cap-js-foundations` | official docs, GitHub repo, interview guide | `js-mdn-guide`, `js-mdn-reference`, `js-33-concepts`, `js-wtfjs` | `top github resources for JavaScript interview concepts`; `official documentation for JavaScript promises` |
| `cap-node-backend` | official docs, GitHub repo, book, framework docs | `node-docs`, `node-learn`, `nodebestpractices`, `express-docs` | `Node.js production best practices github`; `official documentation for Node.js streams` |
| `cap-system-design-hld` | GitHub repo, roadmap, learning resource | `hld-system-design-primer`, `hld-bytebytego`, `hld-awesome-system-design`, `hld-roadmap-system-design` | `system design interview github`; `best engineering blogs for system design tradeoffs` |
| `cap-aws-cloud-architecture` | AWS docs, architecture reference, roadmap, JD | `aws-docs`, `aws-well-architected`, `aws-architecture-center`, `aws-builders-library`, `sa-roadmap-aws` | `official documentation for AWS multi AZ architecture`; `Solution Architect roadmap github` |
| `cap-behavioral-interviews` | interview guide, company hiring docs, career guide | `beh-tech-handbook`, `beh-amazon-lp`, `beh-google-hiring`, `beh-mit-star` | `Engineering Manager behavioral interview preparation`; `architect behavioral interview stories` |
| `cap-compensation-target` | compensation database, job descriptions, negotiation guide | `career-levels`, `career-ambitionbox`, `career-linkedin-solution-architect-jobs`, `career-haseeb-negotiation` | `Solution Architect GCC salary India`; `Lead Backend Engineer compensation GCC India` |

Source mapping rules:

- Source metadata stays separate from authored content.
- Capability-source mappings can be AI-proposed.
- Beta-critical mappings require Sarwan review.
- Official docs and canonical books can validate capability topics directly.
- Community and interview sources require cross-checking before approval.
- Job descriptions validate role demand, not technical truth.

## 10. Proof Of Competency

Every capability needs acceptable proof. A topic or skill is not beta-ready until it can produce evidence.

Proof types:

- Coding Solution.
- HLD.
- LLD.
- Architecture Review.
- AWS Design.
- Incident Analysis.
- Behavioral Answer.
- Resume Review.
- GitHub Project.
- Case Study.

Examples:

| Capability | Acceptable Proof |
| --- | --- |
| JavaScript | Explain tricky runtime behavior, solve output questions, refactor async code. |
| TypeScript | Model typed API boundaries, use generics safely, explain inference/tradeoffs. |
| Node.js Backend | Build or review service structure, error handling, config, logging, tests. |
| Databases | Schema/index review, transaction decision, query performance explanation. |
| Distributed Systems | Consistency tradeoff memo, queue/retry design, idempotency design. |
| HLD | Full design for notification, interview, learning, content delivery, or career platform. |
| LLD | Class/API design for rate limiter, cache, workflow engine, scheduler, or evaluation system. |
| AWS / Cloud | Multi-AZ architecture, DR plan, Well-Architected review, cost/security tradeoff. |
| Security | Threat model, auth/session design, secrets and access-control review. |
| Observability / Reliability | SLO plan, tracing/logging design, incident analysis, runbook. |
| DevOps Awareness | Deployment plan, CI/CD flow, containerization explanation, rollback strategy. |
| DSA | Pattern-based coding solution with complexity and verbal explanation. |
| Technical Leadership | Architecture decision record, tradeoff memo, mentoring plan. |
| Behavioral Interviews | Real story with context, personal action, result, metrics, learning, follow-ups. |
| Architecture Case Studies | HLD, LLD where relevant, tradeoffs, architecture review, interview narrative. |
| Career Assets | Resume review, LinkedIn review, GitHub profile, portfolio case study. |
| Offer Readiness | Application tracker, referral plan, compensation range, negotiation plan. |

Founder beta case studies should be converted into proof.

Locked first case-study set:

1. EngineeringOS Architecture.
2. Agent-OS Architecture.
3. Large Scale Learning Platform, modeled as a hypothetical production-scale system.

These become HLD, LLD, tradeoffs, architecture reviews, and behavioral stories.

## 11. Graph Expansion Rules

Future Resource Discovery Agents should be able to discover new sources, topics, and skills without breaking the capability model.

Expansion rules:

- New sources enter the Source Catalog before they influence the graph.
- New topics map to existing capabilities first; create a new capability only when the topic cluster represents a distinct role-level ability.
- New skills must have at least one parent capability and at least one measurable proof path.
- New capabilities must define target roles, priority weights, readiness thresholds, source mappings, mission types, and proof types.
- No beta-critical capability or mapping becomes approved without Sarwan review.
- A capability cannot be approved if its P0 topics fail the confidence gate.
- Discovery should preserve exact source URLs, source type, reliability, and why the source was included.
- Deprecated topics and sources should be parked, not deleted, so mapping history remains explainable.
- Role-specific roadmaps should project from the graph rather than creating separate disconnected paths.

## 12. Non Goals

The Capability Graph is not:

- A course catalog.
- A checklist.
- A syllabus dump.
- A topic tree.
- A visual graph feature.
- A replacement for the Master Syllabus.
- A generic skill matrix.

It is a capability engine that connects target roles to measurable evidence, readiness, missions, sources, and offer outcomes.

## 13. Future Data Structure

Recommended future locations:

```txt
src/data/capabilities/
src/data/capability-graph/
src/data/capability-dependencies/
src/data/capability-role-mapping/
```

Possible future file groups:

```txt
src/data/capabilities/capabilities.ts
src/data/capabilities/skills.ts
src/data/capabilities/proof-types.ts
src/data/capability-graph/founder-beta-graph.ts
src/data/capability-dependencies/dependencies.ts
src/data/capability-role-mapping/role-weights.ts
src/data/capability-role-mapping/readiness-thresholds.ts
```

Do not create these files until implementation is explicitly requested.

## 14. Relationship To Other Models

Capability Graph -> Master Syllabus:

- The graph defines which capabilities matter for roles.
- The Master Syllabus stores canonical topics that support those capabilities.
- Topics do not become important just because they exist; they become important when they support capability readiness.

Capability Graph -> Roadmap Projection:

- Roadmaps are role-specific projections from the graph.
- The projection orders capabilities, skills, topics, tasks, and proof based on target role, current state, readiness gaps, and dependencies.

Capability Graph -> Daily Mission Engine:

- Daily Missions select the next best action from capability gaps, topic readiness, weak areas, available time, interview deadlines, and offer urgency.
- Missions should never be generic course steps.

Capability Graph -> Readiness Engine:

- Readiness rolls up from topic readiness to skill readiness to capability readiness to role readiness.
- Completion percentages are activity data, not readiness proof.

Capability Graph -> Offer Readiness:

- Offer readiness depends on capability proof, interview readiness, behavioral stories, resume/LinkedIn/GitHub/portfolio assets, applications, referrals, pipeline status, and compensation strategy.
- Career assets and offer workflows must remain separate from learning progress.

## 15. Recommended Next Planning Artifact

Recommended next document:

```txt
docs/MASTER_SYLLABUS_MODEL_V2.md
```

Why:

- The Capability Graph defines what must be proven.
- The Master Syllabus V2 must define the canonical topics, tasks, source mappings, readiness dimensions, and proof hooks that feed those capabilities.
- Without Master Syllabus V2, implementation risks adding topics without capability alignment or source-backed readiness.

Do not implement code before the Master Syllabus V2 planning contract exists.

## Diagnostic Entry Model

Initial readiness should be set through a self-assessment diagnostic.

Diagnostic inputs:

- Experience.
- Target Role.
- Weak Areas.

After the basic self-assessment, EngineeringOS should ask 10-20 diagnostic questions. These questions should identify current readiness and blockers across the founder beta's high-priority capability areas.

Diagnostic output areas:

- System Design Readiness.
- AWS Readiness.
- Communication Readiness.
- Behavioral Readiness.
- Resume Readiness.
- Architecture Case Study Readiness.

If any hard-gate area is below threshold, EngineeringOS should mark:

```txt
Application Not Recommended
```

This should not block learning. It should block premature application pushes until the missing readiness area has a repair path and proof.

## Application Hard Gates

Before recommending active Solution Architect applications, EngineeringOS must check:

| Hard Gate | Why It Matters | Below Threshold Result |
| --- | --- | --- |
| System Design Readiness | Architect interviews require structured HLD and tradeoff judgment. | Application Not Recommended |
| AWS Readiness | Solution Architect roles require credible cloud architecture reasoning. | Application Not Recommended |
| Communication Readiness | Architect roles depend on clear tradeoff explanation and stakeholder communication. | Application Not Recommended |
| Behavioral Readiness | Senior roles require evidence of ownership, conflict handling, and impact. | Application Not Recommended |
| Resume Readiness | Applications should not start with weak positioning or unclear senior impact. | Application Not Recommended |
| Architecture Case Study Readiness | The founder needs proof artifacts for HLD, LLD, architecture reviews, and behavioral stories. | Application Not Recommended |

## Risks

- Target-role overlap can blur the beta path unless Solution Architect remains the primary optimization.
- EM must remain support-only in the founder beta; a full EM path would require stronger people-management evidence.
- Capability weights can become subjective unless validated by job descriptions and interview outcomes.
- A graph with too many low-priority topics can recreate the same course/syllabus bloat the strategy is avoiding.
- Proof artifacts may lag behind learning if Daily Missions over-select reading and under-select implementation/interview work.
- Source mappings can drift unless Source Catalog IDs remain mandatory.

## Open Questions

- What threshold score should each hard gate use: 3.0/4, 3.25/4, or capability-specific thresholds?
- Should the 10-20 diagnostic questions be role-specific from day one or shared across Architect/Lead/EM-aware support?
- Which exact artifacts are required before each of the 3 locked case studies is considered interview-ready?
