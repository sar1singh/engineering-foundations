# Master Syllabus Model V2

Date: 2026-06-04

## Purpose

This document defines the canonical Master Syllabus architecture for EngineeringOS.

EngineeringOS is not a course platform, syllabus viewer, or roadmap repository. The Master Syllabus is the canonical source of truth. Everything else is projected from it:

```txt
Master Syllabus
  -> Capability Graph
  -> Role Roadmaps
  -> Daily Missions
  -> Readiness Scoring
  -> Interview Preparation
  -> Offer Readiness
```

The goal is to support multiple roles, roadmaps, timelines, experience levels, learning paths, weak areas, and compensation targets without duplicating content.

## 1. What Is The Master Syllabus?

The Master Syllabus is the canonical library of EngineeringOS topics, skills, relationships, assets, source mappings, readiness hooks, and proof hooks.

Purpose:

- Store reusable topic definitions.
- Preserve source traceability.
- Support capability and role projections.
- Power Daily Missions without duplicating topic data.
- Feed readiness scoring across learning, interview, and offer systems.
- Prevent roadmap-owned content and role-specific duplicate topics.

Scope:

- Technical topics.
- Leadership topics.
- Behavioral and communication topics.
- Career asset topics.
- Offer readiness topics.
- Topic relationships.
- Topic-source mappings.
- Topic-to-capability mappings.
- Topic assets and proof types.

Ownership:

- The Master Syllabus owns canonical topic identity and metadata.
- The Capability Graph owns role capability requirements and weights.
- Roadmaps are projections, not owners of content.
- Daily Missions are scheduled actions against syllabus topics, assets, and proof.
- Sarwan must approve beta-critical source-topic mappings.

The Master Syllabus is canonical because the same topic must be reusable across Solution Architect, EM-aware support, Lead Backend, Principal, and Staff projections without content drift.

## 2. Canonical Hierarchy

Recommended hierarchy:

```txt
Domain
  -> Capability
    -> Skill
      -> Topic
        -> Subtopic
          -> Learning Asset
```

Alternative considered:

```txt
Domain -> Module -> Topic -> Lesson
```

This is too course-like and does not express role readiness, proof, or capability dependency.

Alternative considered:

```txt
Role -> Roadmap -> Module -> Topic
```

This creates role-specific duplication and makes the roadmap the owner of content.

Final structure justification:

- Domains organize the syllabus.
- Capabilities connect the syllabus to role readiness.
- Skills define applied ability within a capability.
- Topics remain reusable units.
- Subtopics allow detail without creating duplicate top-level topics.
- Learning Assets provide explanations, tasks, interviews, implementation work, and proof.

## 3. Domain Model

## Technical Domains

| Domain | Why It Exists |
| --- | --- |
| JavaScript | Runtime and language fluency for backend interviews and Node.js work. |
| TypeScript | Typed backend API, data, and implementation design. |
| Backend Engineering | API design, service structure, reliability, testing, and production patterns. |
| Databases | SQL, NoSQL, indexing, transactions, schema design, and performance. |
| System Design | HLD interviews, architecture tradeoffs, and case-study proof. |
| Distributed Systems | Consistency, queues, retries, scaling, failure modes, and senior architecture depth. |
| AWS / Cloud | Primary Solution Architect readiness domain. |
| Security | Auth, access control, threat modeling, secrets, and secure architecture. |
| Observability | Logs, metrics, traces, dashboards, and diagnostic workflows. |
| DevOps | Deployment, CI/CD, containers, infra awareness, and operational maturity. |
| DSA | Coding interview gate and problem-solving fluency. |

## Leadership

Leadership exists to support Lead Backend, Principal, Staff, Architect, and EM-aware readiness.

It includes:

- Technical leadership.
- Mentoring.
- Stakeholder management.
- Decision making.
- Ownership.

## Behavioral & Communication

Behavioral and communication is a separate domain because experienced candidates often fail final loops due to weak articulation, shallow stories, or unclear ownership.

It includes:

- Communication.
- Storytelling.
- Behavioral interviews.
- Conflict resolution.
- Influence without authority.
- Architecture reviews.
- Presentation skills.
- Cross-team communication.

## Career Assets

Career Assets exist because offer readiness requires visible proof, not only learning.

It includes:

- Resume.
- LinkedIn.
- GitHub.
- Portfolio.
- Architecture case studies.

## Offer Readiness

Offer Readiness exists as a separate domain because applications, referrals, pipeline, compensation, and negotiation should not be hidden inside learning progress.

It includes:

- Applications.
- Referrals.
- Interview pipeline.
- Compensation target.
- Negotiation awareness.

## 4. Topic Model

Every topic should use this canonical structure:

```txt
topicId
topicName
domainId
capabilityIds
skillIds
sourceIds
prerequisiteTopics
relatedTopics
successorTopics
alternativeTopics
interviewImportance
roadmapPriority
estimatedStudyTime
estimatedPracticeTime
proofTypes
readinessMetrics
```

Example: AWS Multi-AZ Architecture

| Field | Value |
| --- | --- |
| topicId | `topic-aws-multi-az-architecture` |
| topicName | AWS Multi-AZ Architecture |
| domainId | `domain-aws-cloud` |
| capabilityIds | `cap-aws-cloud-architecture`, `cap-system-design-hld`, `cap-observability-reliability` |
| skillIds | `skill-failover-design`, `skill-dr-tradeoffs`, `skill-cloud-availability-modeling` |
| sourceIds | `aws-docs`, `aws-well-architected`, `aws-architecture-center` |
| prerequisiteTopics | `topic-aws-vpc-basics`, `topic-load-balancing`, `topic-rto-rpo` |
| relatedTopics | `topic-backup-dr`, `topic-route-53`, `topic-rds-ha` |
| successorTopics | `topic-multi-region-architecture`, `topic-well-architected-review` |
| alternativeTopics | `topic-cloud-neutral-ha-patterns` |
| interviewImportance | High |
| roadmapPriority | P0 for Solution Architect |
| estimatedStudyTime | 90 minutes |
| estimatedPracticeTime | 180 minutes |
| proofTypes | AWS Design, HLD, Architecture Review |
| readinessMetrics | Knowledge, Practice, Interview, Implementation |

Example: Behavioral Ownership Story

| Field | Value |
| --- | --- |
| topicId | `topic-behavioral-ownership-story` |
| topicName | Ownership Story |
| domainId | `domain-behavioral-communication` |
| capabilityIds | `cap-behavioral-interviews`, `cap-ownership`, `cap-storytelling` |
| skillIds | `skill-star-framing`, `skill-impact-articulation` |
| sourceIds | `beh-tech-handbook`, `beh-amazon-lp`, `beh-mit-star` |
| prerequisiteTopics | `topic-experience-mining` |
| relatedTopics | `topic-conflict-story`, `topic-incident-story` |
| successorTopics | `topic-follow-up-handling` |
| alternativeTopics | none |
| interviewImportance | High |
| roadmapPriority | P0 for all senior loops |
| estimatedStudyTime | 45 minutes |
| estimatedPracticeTime | 120 minutes |
| proofTypes | Behavioral Answer, Case Study |
| readinessMetrics | Knowledge, Interview, Implementation |

## 5. Topic Relationships

Topic relationships must be explicit so roadmaps and missions can be generated safely.

| Relationship | Meaning | Example |
| --- | --- | --- |
| Prerequisite | Must be understood before the topic. | Transactions before distributed consistency. |
| Dependency | Required for capability readiness. | HLD depends on databases and backend. |
| Related Topic | Useful adjacent concept. | Caching relates to Redis and CDN. |
| Successor Topic | Natural next topic after readiness. | Single-region HA -> multi-region DR. |
| Alternative Topic | Different route to similar skill. | ECS vs EKS for container orchestration awareness. |

Examples:

```txt
PostgreSQL Indexing
  -> prerequisite: SQL query basics
  -> related: query planning
  -> successor: database performance review
```

```txt
System Design: Notification System
  -> prerequisite: queues, rate limiting, idempotency
  -> related: push/email/SMS delivery
  -> successor: architecture case study
```

## 6. Topic Metadata

Metadata required for roadmap generation:

| Field | Purpose |
| --- | --- |
| difficulty | Beginner, intermediate, advanced, expert. |
| importanceScore | General importance across the beta path. |
| interviewFrequency | How often the topic appears in target interviews. |
| marketDemand | Job-description and market signal strength. |
| roleRelevance | Role-specific relevance for Architect, EM-aware, Lead, Principal, Staff. |
| capabilityRelevance | Strength of mapping to capabilities. |
| effortScore | Time and difficulty cost. |
| confidenceScore | Source-backed confidence from ingestion rules. |
| sourceReliability | High, medium, or low confidence in mapped sources. |
| proofRequired | Whether topic blocks readiness without proof. |
| weakAreaTags | Tags used for repair missions. |
| missionTypes | Learn, Practice, Implement, Interview, Revise, Weak Area Repair, Behavioral, Career Asset. |
| recencyWindow | How often revision should occur. |

Metadata enables roadmaps to prioritize high-signal, low-waste execution instead of showing every possible topic.

## 7. Content Asset Model

Learning Assets live under topics. They are not separate syllabus topics unless they introduce distinct reusable concepts.

Allowed asset types:

- Explanation.
- Example.
- Mental model.
- Practice task.
- Coding problem.
- HLD exercise.
- LLD exercise.
- Interview questions.
- Behavioral questions.
- Architecture review.
- Case study.
- Implementation task.
- Revision prompt.
- Readiness rubric.
- References.

Example:

```txt
Topic: AWS Multi-AZ Architecture
  -> Explanation: what Multi-AZ means and does not mean
  -> Example: backend API with ALB, ECS, RDS Multi-AZ
  -> HLD Exercise: design failover for high-scale learning platform
  -> Interview Questions: RTO/RPO, failover, cost tradeoffs
  -> Proof: architecture review document
  -> References: AWS Well-Architected, AWS docs, AWS Architecture Center
```

## 8. Source Integration

Every topic must support source traceability.

Topics connect to:

- Source Catalog.
- Source IDs.
- Source categories.
- Exact source references.
- Source reliability.
- Source confidence.
- Topic-source mapping reason.
- Sources Navbar.

Rules:

- Source metadata stays separate from authored EngineeringOS content.
- EngineeringOS content remains original.
- Every P0 beta topic must have at least one high-trust source or two credible independent sources.
- Source IDs from `docs/SOURCE_CATALOG_SEED_V1.md` should be used as seed mappings.
- Beta-critical topic-source mappings require Sarwan review.

The Sources Navbar should show:

- Source title.
- Source type.
- Reliability.
- Usage reason.
- Exact URL.
- Review status.

## 9. Projection Rules

The Master Syllabus must support projections by role, capability, experience, timeline, target compensation, weak areas, interview focus, and roadmap type.

## Role Projection

Supported roles:

- Solution Architect.
- Engineering Manager-aware support.
- Lead Backend.
- Principal Engineer.
- Staff Engineer.

Role projection selects topics by:

- Role relevance.
- Capability weights.
- Required proof.
- Interview importance.
- Market demand.
- Current readiness gap.

## Capability Projection

Capability projection selects all topics, assets, and proofs needed for one capability.

Example:

```txt
Capability: AWS / Cloud Architecture
  -> topics: IAM, VPC, load balancing, RDS, DynamoDB, S3, SQS/SNS, Route 53, CloudFront, CloudWatch, DR
  -> proof: Well-Architected review, multi-AZ design, cost/security tradeoff
```

## Experience Projection

Experience projection adjusts depth and proof expectations.

For 10+ YOE:

- Skip beginner repetition where readiness is already high.
- Emphasize tradeoffs, architecture reviews, production incidents, leadership stories, and proof.
- Require stronger communication and business-impact framing.

## Timeline Projection

Supported timelines:

- 4 weeks: interview sprint.
- 8 weeks: focused repair and readiness path.
- 16 weeks: founder beta default.
- 24 weeks: comprehensive transformation path.

Timeline labels are locked:

- 4 weeks: Interview Sprint.
- 8 weeks: Accelerated.
- 16 weeks: Founder Beta Default.
- 24 weeks: Comprehensive.

Shorter timelines reduce breadth but must not remove hard gates.

## Target Compensation Projection

Supported targets:

- 40 -> 60 LPA: floor readiness.
- 40 -> 80 LPA: target readiness.
- 40 -> 100+ LPA: stretch readiness.

Higher targets require stronger proof, case studies, communication, architecture depth, and offer execution.

## Weak Area Projection

Weak area projection increases priority for blocking topics and mission types.

Example:

```txt
Weak area: AWS
  -> prioritize AWS Learn, Implement, Interview, Revise missions
  -> block Application Recommended until AWS Readiness clears threshold
```

## Interview Focus Projection

Interview focus projection selects topic assets by round:

- Coding.
- HLD.
- LLD.
- AWS.
- Behavioral.
- Leadership.
- Architecture Review.
- Communication.

## Roadmap Type Projection

Roadmap types:

- Fast Track: minimum high-ROI path.
- Comprehensive: broader coverage map.
- Interview Sprint: near-term interview readiness.
- Architect Track: Solution Architect capability and proof focus.

## 10. Roadmap Compatibility

The Roadmap Projection Engine should operate from the Master Syllabus and Capability Graph.

Compatibility requirements:

- Topics must have role relevance.
- Topics must map to capabilities and skills.
- Topics must expose prerequisites and successors.
- Topics must include mission types.
- Topics must include estimated study/practice time.
- Topics must include proof types.
- Topics must include source confidence and review status.
- Topics must include readiness metrics.

The roadmap must not own topic content. It should only order and filter canonical syllabus topics.

## 11. Daily Mission Compatibility

Daily Missions should be generated from syllabus topics without duplicating data.

Topic fields required for missions:

- Mission types.
- Estimated time.
- Readiness metrics.
- Weak area tags.
- Asset availability.
- Proof types.
- Interview prompts.
- Revision window.
- Prerequisite status.

Example:

```txt
Topic: AWS Multi-AZ Architecture
Low score: Implementation
Available time: 90 minutes
Mission: Implement an architecture note for a multi-AZ backend API
Proof: AWS Design + Architecture Review
```

## 12. Readiness Compatibility

Topics feed:

```txt
Topic Readiness
  -> Capability Readiness
  -> Role Readiness
  -> Interview Readiness
  -> Offer Readiness
```

Topic Readiness:

- Knowledge Score.
- Practice Score.
- Interview Score.
- Implementation Score.

Capability Readiness:

- Weighted rollup from topic readiness, proof, interview performance, and recency.

Role Readiness:

- Weighted rollup from capability readiness and hard gates.

Interview Readiness:

- Round-specific readiness from topic interview assets, mock performance, and communication quality.

Offer Readiness:

- Resume, LinkedIn, GitHub, portfolio, case studies, applications, referrals, compensation, and negotiation state.

Application recommendation hard gates:

- Architect Readiness `>= 75`.
- AWS Readiness `>= 70`.
- Behavioral Readiness `>= 70`.
- Communication Readiness `>= 70`.
- Resume Readiness `>= 80`.
- At least 3 completed Architecture Case Studies.

If any hard gate is below threshold:

```txt
Application Not Recommended
```

## 13. Content Coverage Rules

EngineeringOS should support:

```txt
100% Coverage Map
```

while generating:

```txt
80/20 Execution Roadmaps
```

How both coexist:

- The Master Syllabus can contain broad validated coverage.
- Roadmaps select only the highest-leverage subset for a role, timeline, and goal.
- Daily Missions select the next best action, not the next topic in a giant list.
- Parked topics can exist for future expansion without entering beta execution.
- Comprehensive coverage is for map integrity; execution roadmaps are for transformation.

Rule:

```txt
The syllabus may be broad.
The beta path must be narrow, deep, proof-backed, and offer-oriented.
```

## 14. Expansion Rules

Future Resource Discovery Agents may add sources, topics, skills, and capabilities without breaking the syllabus.

Constraints:

- New source enters Source Catalog first.
- New topic must map to at least one domain and one capability.
- New topic must include source IDs and confidence status.
- New topic must define prerequisites or explicitly state none.
- New topic must define readiness metrics.
- New topic must define mission types.
- New topic must define whether proof is required.
- Topics with confidence below `0.75` can exist in the Master Syllabus, but they cannot enter the Architect Fast Track roadmap.
- New skill must map to a parent capability.
- New capability must be added through the Capability Graph, not directly as a syllabus-only concept.
- Beta-critical changes require Sarwan review.
- Duplicate topics should be merged through aliases, not copied.

## 15. Future Data Structure

Recommended future locations:

```txt
src/data/syllabus/
src/data/topics/
src/data/topic-relationships/
src/data/content-assets/
src/data/projections/
```

Possible future groups:

```txt
src/data/syllabus/domains/
src/data/syllabus/capability-topic-map/
src/data/topics/canonical-topics/
src/data/topic-relationships/prerequisites/
src/data/topic-relationships/related-topics/
src/data/content-assets/explanations/
src/data/content-assets/practice/
src/data/content-assets/interview/
src/data/content-assets/proof/
src/data/projections/role-projections/
src/data/projections/timeline-projections/
```

Do not create these files until implementation is explicitly requested.

## 16. Anti-Patterns

Do not allow:

- Duplicate topics for each role.
- Role-specific content duplication.
- Multiple copies of the same roadmap topic.
- Roadmap-owned content.
- Course-owned content.
- Syllabus fragmentation across old and new models.
- Topic pages without source traceability.
- Topics without capability mappings.
- Topics without readiness metrics.
- Topics without mission compatibility.
- A huge syllabus that cannot produce a focused daily path.
- Offer readiness mixed into topic completion.

## 17. Recommended Next Planning Artifact

Recommended next document:

```txt
docs/ROADMAP_PROJECTION_MODEL_V2.md
```

Why:

- The Master Syllabus defines canonical reusable topic data.
- The Capability Graph defines role capability requirements and weights.
- Roadmap Projection V2 must define how to convert both into focused paths for Solution Architect, EM-aware support, Lead Backend, Principal, and Staff readiness across 4, 8, 16, and 24 week timelines.

Do not implement roadmaps before the projection model is defined.

## Risks

- Existing code has parallel syllabus/topic/roadmap paths; future implementation must avoid adding content to the wrong model.
- A broad syllabus can create false progress unless roadmaps and missions stay 80/20.
- Source mappings can become noisy unless exact source IDs and review status are mandatory.
- EM-aware support can drift into a full EM roadmap before evidence is ready.
- Compensation-target projections may need current market data and manual review.

## Open Questions

- Should 4-week and 8-week projections exclude all non-P0 topics by default?
- Which topic IDs should be locked first for the 3 architecture case studies?
- Should confidence below `0.75` also block other Fast Track roadmaps, or only Architect Fast Track for now?
