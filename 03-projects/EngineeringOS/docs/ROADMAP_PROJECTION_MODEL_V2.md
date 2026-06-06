# Roadmap Projection Model V2

Date: 2026-06-04

## Purpose

This document defines the Roadmap Projection Engine for EngineeringOS.

Core principle:

```txt
Master Syllabus is canonical.
Roadmaps are projections.
Roadmaps must never own content.
```

Roadmaps only select, prioritize, reorder, and filter syllabus content based on the user's current state, target role, target compensation, timeline, weak areas, and readiness.

## 1. What Is A Roadmap Projection?

A roadmap is a personalized execution path toward a target outcome.

A projection is a filtered and ordered view of canonical Master Syllabus topics, Capability Graph requirements, proof tasks, and readiness targets.

Roadmap generation is the process of converting user context and system data into a sequence of capabilities, topics, tasks, missions, and proof artifacts.

Roadmap ownership rules:

- Master Syllabus owns canonical topic content.
- Capability Graph owns capability definitions, dependencies, and role weights.
- Roadmap Projection owns sequencing, prioritization, and filtering.
- Daily Mission owns day-level execution.
- Readiness Engine owns scoring and gates.

Roadmaps are projections rather than standalone content because the same topic must be reused across Solution Architect, EM-aware support, Lead Backend, Principal Engineer, Staff Engineer, interview sprints, and long-form tracks without duplication.

## 2. Inputs

## User Inputs

Required user inputs:

| Input | Purpose |
| --- | --- |
| YOE | Adjust depth, skip basics, and raise proof expectations. |
| Current Role | Establish baseline capabilities and likely strengths. |
| Target Role | Select role weights and hard gates. |
| Target Compensation | Increase proof, interview, and offer-readiness requirements. |
| Available Hours | Determine roadmap density and weekly mission load. |
| Weak Areas | Increase priority for blockers and repair missions. |
| Existing Skills | Avoid unnecessary repetition and accelerate known areas. |

Founder beta defaults:

- YOE: 10+.
- Current role: Senior / Lead Backend Engineer.
- Target role: Solution Architect.
- Target compensation: 70-80+ LPA.
- Available hours: 10 hours/week.
- Default timeline: 16 weeks.
- EM handling: EM-aware support only.

## System Inputs

Required system inputs:

| Input | Purpose |
| --- | --- |
| Capability Graph | Role capabilities, dependencies, weights, proof types, thresholds. |
| Master Syllabus | Canonical topics, assets, source mappings, readiness hooks. |
| Readiness Scores | Topic, capability, role, interview, and offer readiness. |
| Source Confidence | Blocks low-confidence topics from fast-track projections. |
| Topic Dependencies | Orders prerequisite topics before dependent topics. |

## 3. Projection Dimensions

The projection engine must support projection by:

## Role

- Solution Architect.
- Engineering Manager-aware support.
- Lead Backend.
- Principal Engineer.
- Staff Engineer.

## Timeline

- 4 weeks: Interview Sprint.
- 8 weeks: Accelerated.
- 16 weeks: Founder Beta Default.
- 24 weeks: Comprehensive.

## Capability

Example:

```txt
Project only AWS / Cloud Architecture + System Design + Communication
```

## Weak Areas

Example:

```txt
Weak area: AWS
  -> increase AWS topic priority
  -> add implementation and interview missions
  -> block application recommendation until AWS Readiness >= 70
```

## Interview Focus

Supported interview focuses:

- Coding.
- HLD.
- LLD.
- AWS.
- Behavioral.
- Leadership.
- Architecture Review.
- Communication.

## Compensation Goal

Supported compensation projections:

- 40 -> 60 LPA: floor readiness.
- 40 -> 80 LPA: target readiness.
- 40 -> 100+ LPA: stretch readiness.

Higher compensation targets require stronger evidence, more polished case studies, stronger communication, and more offer-readiness work.

## Roadmap Type

Supported roadmap types:

- Fast Track.
- Comprehensive.
- Interview Sprint.
- Architect Track.
- EM-Aware Architect Track.

Rule:

```txt
Confidence < 0.75
  -> cannot enter Architect Fast Track roadmap
  -> can still exist in Master Syllabus
```

## 4. Roadmap Generation Logic

Projection flow:

```txt
Current State
  -> Gap Analysis
  -> Capability Gaps
  -> Topic Selection
  -> Task / Proof Selection
  -> Mission Generation
  -> Roadmap View
```

Step 1: Current State

- Read YOE, current role, existing skills, weak areas, target role, target compensation, timeline, and available hours.

Step 2: Gap Analysis

- Compare current readiness against target role weights and hard gates.
- Identify missing proof, weak capabilities, interview blockers, offer blockers, and stale topics.

Step 3: Capability Gaps

- Prioritize capabilities by role weight, readiness gap, dependency position, and hard-gate status.

Step 4: Topic Selection

- Select canonical Master Syllabus topics mapped to the capability gaps.
- Include prerequisites when required.
- Exclude or defer low-confidence topics for fast tracks.

Step 5: Task / Proof Selection

- Attach tasks and proof types from syllabus assets.
- Prefer proof-backed work for senior, architect, and lead-level readiness.

Step 6: Mission Generation

- Convert selected topics and proof needs into Daily Mission candidates.

Example:

```txt
Current State: Senior Backend, AWS weak
Target: Solution Architect, 16 weeks, 70-80 LPA
Gap: AWS Readiness 45, Architect Readiness 58
Capability Gap: AWS / Cloud Architecture, System Design, Communication
Topic Selection: IAM, VPC, Multi-AZ, RDS HA, Well-Architected, DR
Proof: EngineeringOS Architecture AWS review
Mission: Design multi-AZ deployment and explain RTO/RPO tradeoffs
```

## 5. 100% vs 80/20

EngineeringOS supports:

```txt
100% Coverage Map
```

while generating:

```txt
80/20 Execution Roadmaps
```

100% Coverage Map:

- Broad canonical syllabus coverage.
- Source-backed topic universe.
- Future expansion readiness.
- Full capability and domain mapping.

80/20 Execution Roadmaps:

- Narrow, high-leverage topic selection.
- Role-weighted execution path.
- Hard-gate and interview-critical focus.
- Proof-backed tasks.
- Daily Mission compatibility.

What gets included:

- Hard blockers.
- Interview-critical topics.
- High-weight capability gaps.
- Weak-area repair topics.
- Required proof topics.
- Offer-readiness assets.

What gets deferred:

- Low-priority breadth.
- Nice-to-have topics.
- Low-confidence topics.
- Topics not relevant to current target role or timeline.
- Deep competitive programming.
- Full EM roadmap topics during Architect-first beta.

Deferred topics become visible when:

- Timeline expands.
- Weak area changes.
- Role target changes.
- Interview feedback exposes a gap.
- Source confidence improves.
- The user switches from Fast Track to Comprehensive.

## 6. Timeline Models

## 4 Week: Interview Sprint

Goal:

- Prepare for near-term interviews.
- This is Interview Sprint only, not full readiness.

Selection behavior:

- Only hard blockers and interview-critical topics.
- No broad learning.
- Heavy mock/interview missions.
- Resume and case-study polish included.
- Exclude topics with confidence below `0.75` for Architect Fast Track/Sprint use.

## 8 Week: Accelerated

Goal:

- Repair high-priority gaps and build interview readiness quickly.

Selection behavior:

- Include P0 and selected P1 topics.
- Include required prerequisites.
- Balance Learn, Practice, Interview, Implement, and Career Asset missions.
- Strong weekly proof cadence.

## 16 Week: Founder Beta Default

Goal:

- Build credible Solution Architect readiness with EM-aware support and offer readiness.

Selection behavior:

- Include full P0 path and important P1 topics.
- Build all hard gates.
- Complete at least 3 architecture case studies.
- Maintain DSA at senior backend interview level.
- Include weekly behavioral and communication work.

## 24 Week: Comprehensive

Goal:

- Broader transformation path with deeper coverage.

Selection behavior:

- Include P0, P1, and selected P2 topics.
- Add more Staff/Principal depth.
- Add broader leadership and EM-aware coverage.
- Add deeper AWS, distributed systems, security, observability, and portfolio work.

## 7. Roadmap Priority Rules

Priority order:

1. Hard blocker topics.
2. Interview-critical topics.
3. Capability gaps.
4. Weak areas.
5. Nice-to-have topics.

Examples:

| Situation | Priority Result |
| --- | --- |
| AWS Readiness below 70 | AWS topics and AWS proof missions outrank optional DSA breadth. |
| Resume Readiness below 80 | Resume repair enters roadmap before new applications. |
| Architect Readiness below 75 | HLD, AWS, communication, and case studies become top-level blockers. |
| Behavioral Readiness below 70 | Story mining and behavioral mocks enter weekly missions. |
| Graph DP weak but no near-term coding loop | Selective DP remains lower priority than Architect gates. |

## 8. Architect Projection

Default founder roadmap target:

```txt
Solution Architect
```

Primary capabilities:

- AWS / Cloud Architecture.
- System Design (HLD).
- Distributed Systems.
- Databases.
- Security.
- Observability / Reliability.
- Backend Engineering.
- Communication.
- Architecture Reviews.
- Behavioral Interviews.
- Architecture Case Studies.
- Resume / LinkedIn / Portfolio.

Suggested weighting:

| Area | Weight |
| --- | ---: |
| AWS / Cloud Architecture | 18 |
| System Design (HLD) | 16 |
| Distributed Systems | 11 |
| Databases | 9 |
| Observability / Reliability | 9 |
| Security | 8 |
| Backend Engineering / Node.js | 8 |
| Behavioral & Communication | 7 |
| Career Assets / Offer Readiness | 8 |
| DSA / Problem Solving | 5 |

Readiness targets:

- Architect Readiness `>= 75`.
- AWS Readiness `>= 70`.
- Behavioral Readiness `>= 70`.
- Communication Readiness `>= 70`.
- Resume Readiness `>= 80`.
- At least 3 completed Architecture Case Studies.

Mission mix for 16-week Founder Beta Default:

- 25% AWS / Cloud implementation and design.
- 20% System Design / HLD.
- 15% Backend, databases, and distributed systems.
- 10% Observability, reliability, and security.
- 10% Interview practice.
- 10% Behavioral and communication.
- 10% Career assets and case studies.

## 9. EM-Aware Projection

EM-aware projection is supporting coverage, not a full EM roadmap.

It should cover:

- Leadership communication.
- Stakeholder management.
- Mentoring stories.
- Delivery risk communication.
- Incident communication.
- Hiring and interview calibration awareness.
- Decision making and tradeoff narratives.

It should not require:

- Full people-management curriculum.
- Performance management depth.
- Org design depth.
- Manager-only roadmap expansion.
- EM readiness as the primary beta outcome.

EM-aware topics appear when they support:

- Behavioral interviews.
- Architect communication.
- Lead Backend credibility.
- Principal/Staff influence.
- Offer-readiness storytelling.

## 10. Readiness Integration

Roadmaps must react to:

- Topic readiness.
- Capability readiness.
- Role readiness.
- Interview readiness.
- Offer readiness.

Adaptive behavior examples:

| Signal | Roadmap Reaction |
| --- | --- |
| Topic Knowledge high, Interview low | Add interview missions, mocks, and verbal drills. |
| Implementation low for AWS topic | Add architecture design and implementation-proof mission. |
| Capability readiness blocked by missing proof | Add case study or architecture review task. |
| Resume readiness below 80 | Add resume repair before application missions. |
| Behavioral readiness below 70 | Add story mining, STAR framing, and mock follow-ups. |
| Weak area repaired | Reduce repair missions and return to next highest gap. |

Roadmaps should be recalculated after meaningful readiness updates, mock interviews, completed proof tasks, or target-role changes.

## 11. Hard Gates

Locked application recommendation gates:

| Gate | Threshold |
| --- | ---: |
| Architect Readiness | `>= 75` |
| AWS Readiness | `>= 70` |
| Behavioral Readiness | `>= 70` |
| Communication Readiness | `>= 70` |
| Resume Readiness | `>= 80` |
| Architecture Case Studies | At least 3 completed |

If any gate is below threshold:

```txt
Application Not Recommended
```

Referral outreach before gates is allowed, but it must be tracked separately from Offer Readiness. It should not mark the user as application-ready or offer-ready.

Why:

- Architect roles require credible HLD, AWS, and tradeoff judgment.
- Experienced candidates must communicate clearly and show leadership evidence.
- Weak resumes waste application opportunities.
- Case studies convert experience into proof for interviews, portfolio, and behavioral loops.

## 12. Case Study Integration

Initial case studies:

1. EngineeringOS.
2. Agent-OS.
3. Large Scale Learning Platform.

How they appear in roadmaps:

- As proof milestones, not optional extras.
- As HLD missions.
- As LLD missions where relevant.
- As architecture review missions.
- As behavioral story sources.
- As resume, LinkedIn, GitHub, and portfolio assets.

The detailed case-study completion rubric should be defined in the Daily Mission and Readiness Engine phases.

Example:

```txt
Case Study: EngineeringOS
  -> HLD: Career Transformation OS architecture
  -> LLD: Daily Mission / readiness service design
  -> Review: source ingestion and capability graph tradeoffs
  -> Behavioral: ownership, ambiguity, product thinking, execution
```

## 13. DSA Coverage

DSA is locked to:

```txt
Senior backend interview-focused DSA
```

It is not competitive programming.

Included:

- Arrays.
- Strings.
- Hashing.
- Two Pointers.
- Sliding Window.
- Trees.
- Graphs.
- Heap.
- Greedy.
- DP, selective only.

Rationale:

- Product/GCC/FAANG-style loops may still include coding screens.
- The founder beta should avoid over-investing in competitive programming.
- DSA should support interview confidence, problem-solving communication, and senior backend loops.
- DSA should not displace Architect hard gates, AWS readiness, HLD, communication, case studies, or resume readiness.

## 14. Future Data Structure

Recommended future locations:

```txt
src/data/roadmaps/
src/data/projections/
src/data/projection-rules/
src/data/gap-analysis/
```

Possible future groups:

```txt
src/data/roadmaps/founder-beta.ts
src/data/projections/role-projections.ts
src/data/projections/timeline-projections.ts
src/data/projections/compensation-projections.ts
src/data/projection-rules/priority-rules.ts
src/data/projection-rules/hard-gates.ts
src/data/gap-analysis/capability-gap-model.ts
src/data/gap-analysis/weak-area-rules.ts
```

Do not create these files until implementation is explicitly requested.

## 15. Anti Patterns

Avoid:

- Duplicated roadmap content.
- Roadmap-owned topics.
- Fixed static paths that ignore readiness.
- Role-specific content copies.
- Course-like roadmap modules that bypass capabilities.
- Roadmaps that ignore source confidence.
- Roadmaps that recommend applications despite failed hard gates.
- Over-expanding EM coverage during Architect-first beta.
- Competitive-programming-heavy DSA paths.

## 16. Recommended Next Planning Artifact

Recommended next document:

```txt
docs/DAILY_MISSION_MODEL_V2.md
```

Why:

- Roadmap Projection defines the path.
- Daily Mission V2 must define how the path becomes today's executable work.
- Without Daily Mission V2, the product risks becoming a static roadmap viewer instead of a guided execution system.

Do not implement roadmap logic before Daily Mission V2 defines the mission contract.

## Risks

- Projection logic can become too complex if every dimension is weighted from day one.
- Fast tracks may hide useful topics too aggressively if thresholds are too strict.
- Weak readiness data can produce misleading roadmap priorities.
- Architect and EM-aware coverage can blur unless EM remains support-only.
- DSA can expand beyond senior backend interview needs unless scope remains locked.
- Compensation projections need current market validation before being treated as exact.

## Open Questions

- What should be the exact data boundary between referral outreach tracking and Offer Readiness?
- How much new learning is acceptable inside a 4-week Interview Sprint when a hard blocker is discovered?
- Which Daily Mission proof requirements should count toward case-study completion?

## Regeneration Cadence

Roadmaps should regenerate when:

- Readiness changes.
- Onboarding inputs change.
- The user manually requests regeneration.

Roadmaps should not silently reshuffle on every page view. Regeneration should be explainable and preserve user trust.

## V2 Foundation Audit Addendum

Date: 2026-06-06

### Planning Status

This document is the canonical Roadmap Projection V2 model. The planning model is complete enough to guide implementation.

### Implementation Status

Current implementation is partial:

- `src/data/founder-beta/roadmap-projection.ts` contains one static 16-week Founder Architect projection.
- `src/lib/services/founder-beta-service.ts` can return that projection.
- mission selection uses the projection mission order as a deterministic input.

Current implementation is not yet a Roadmap Projection Engine:

- no projection generation from current state
- no gap-analysis service
- no timeline variants for 4/8/24 weeks
- no 100% coverage map versus 80/20 execution derivation
- no source-confidence filtering beyond static topic confidence values
- no roadmap regeneration mechanism
- no role/capability/weak-area/compensation projection variants

### Gaps Versus Original Strategy

Missing:

- projection rules as data
- role-specific projection weights
- timeline-specific topic selection
- capability gap analysis
- weak-area and readiness adaptation
- proof/case-study sequencing
- explanation of why a topic or mission is included/deferred

### Canonical V2 Data Structures

Required implementation structures:

```txt
RoadmapProjectionInput
  currentRole
  targetRole
  targetCompensation
  timelineWeeks
  availableHoursPerWeek
  weakAreaCapabilityIds
  weakAreaTopicIds
  readinessSnapshot

ProjectionRule
  id
  ruleType
  priority
  appliesWhen
  effect

RoadmapProjection
  id
  inputHash
  targetRole
  timeline
  capabilitySequence
  topicSequence
  proofMilestones
  missionCandidates
  deferredItems
  explanation

RoadmapItem
  capabilityId
  skillId
  topicId
  missionType
  proofType
  priority
  reason
```

### Required Relationships

```txt
Roadmap -> Capability
Roadmap -> Skill
Roadmap -> Topic
Roadmap -> Source Confidence
Roadmap -> Mission Candidate
Roadmap -> Readiness Gap
Roadmap -> Proof Milestone
```

### Founder Architect Path Requirement

The first fully-supported projection must be:

```txt
founder-architect-beta-16-week
```

It must project from the Capability Graph and Master Syllabus instead of owning content.

Required variants after the default:

- 4-week Interview Sprint
- 8-week Accelerated
- 24-week Comprehensive

### Implementation Order After V2 Finalization

1. Convert static projection into projection input + generated output shape.
2. Add projection rules for hard blockers, confidence, timeline, weak areas, and proof milestones.
3. Add gap-analysis service.
4. Generate Founder Architect 16-week projection from graph/syllabus data.
5. Add timeline variants.
6. Keep `/founder-beta` using stable static output until generated output matches tests.
