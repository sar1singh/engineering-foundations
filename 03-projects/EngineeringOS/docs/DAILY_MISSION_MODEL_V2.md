# Daily Mission Model V2

Date: 2026-06-04

## Purpose

This document defines the Daily Mission Engine for EngineeringOS.

EngineeringOS is not a course platform. The primary user experience is:

```txt
Today's Mission
```

The user should never need to manually decide what to learn next. The system should guide execution.

The Daily Mission Engine converts:

```txt
Roadmap Projection
  + Current Readiness
  + Weak Areas
  + Available Time
  + Pending Work
  -> Today's Mission
```

Founder beta defaults:

- Default roadmap: Solution Architect.
- Timeline: 16 weeks.
- Weekly availability: 10 hours/week.
- Primary outcome: Offer Readiness.
- EM scope: EM-aware support only.

## 1. What Is A Daily Mission?

A Mission is a focused execution unit that moves the user measurably closer to readiness.

A Mission Queue is the ranked list of candidate missions generated from the roadmap, readiness gaps, dependencies, weak areas, pending proof work, and available time.

A Mission Lifecycle:

```txt
Generated
  -> Selected
  -> Started
  -> Submitted
  -> Evaluated
  -> Readiness Updated
  -> Completed / Rework / Revision Queued
```

Mission Completion means the user produced required evidence. It is not a checkbox.

Mission Readiness Impact is the update a mission makes to topic, capability, role, interview, or offer readiness.

Missions are the primary execution unit because EngineeringOS is an accountability and transformation system, not a passive content library.

## 2. Daily Mission Philosophy

EngineeringOS should optimize for:

```txt
Execution
```

not:

```txt
Content Consumption
```

The founder is already a working senior/lead backend engineer with limited time. The app must reduce decision fatigue, select the next highest-leverage action, and turn preparation into proof.

Reading is useful only when it changes readiness. A mission should usually end in an answer, design, code artifact, review, case study, behavioral story, resume update, or other evidence.

## 3. Mission Selection Inputs

## User State

Mission generation should consider:

- Roadmap.
- Target role.
- Current role.
- Available time.
- Weak areas.
- Existing skills.
- Timeline.
- Target compensation.

Example:

```txt
Target: Solution Architect
Available time: 1 hour
Weak area: AWS
Mission: Explain Multi-AZ tradeoffs and draft a small failover design
```

## Readiness

Mission generation should consider:

- Topic readiness.
- Capability readiness.
- Role readiness.
- Interview readiness.
- Offer readiness.

Example:

```txt
Knowledge high, Interview low
  -> select Interview mission
```

```txt
Implementation low, Architect gate below threshold
  -> select Architecture Case Study or AWS Design mission
```

## Roadmap State

Mission generation should consider:

- Current position.
- Incomplete topics.
- Skipped topics.
- Dependency chains.
- Pending proof tasks.
- Deferred topics.

## Time Constraints

Supported time windows:

| Time Window | Mission Shape |
| --- | --- |
| 30 minutes | Revise, short interview drill, focused explanation, resume bullet edit. |
| 1 hour | Learn + answer, small practice set, behavioral story draft, AWS tradeoff note. |
| 2 hours | HLD/LLD exercise, implementation task, mock interview, case-study section. |
| Weekend deep work | Full case study, architecture review, portfolio update, multi-topic proof. |

## 4. Mission Types

## Learn

Purpose:

- Build knowledge for a high-priority topic.

Output:

- Explanation, concept answer, notes, or short quiz result.

## Practice

Purpose:

- Build repetition and pattern fluency.

Output:

- Solved problem, design exercise, or practice answer.

## Implement

Purpose:

- Prove the user can apply a topic in code, design, architecture, or operational work.

Output:

- Code solution, implementation sketch, API contract, config, runbook, or design artifact.

## Interview

Purpose:

- Convert knowledge into interview performance.

Output:

- Recorded/spoken answer, written answer, mock result, follow-up answers, or evaluation.

## Behavioral

Purpose:

- Convert real experience into credible senior-level stories.

Output:

- STAR/CAR story, follow-up responses, leadership narrative, conflict story, or incident story.

## Career Asset

Purpose:

- Improve offer-readiness assets.

Output:

- Resume update, LinkedIn update, GitHub profile update, portfolio update, application tracker, or referral outreach draft.

## Revision

Purpose:

- Retain readiness and repair stale or weak topics.

Output:

- Revised answer, refreshed proof, corrected solution, or reattempt.

## Weak Area Repair

Purpose:

- Target a blocker detected from readiness, skipped topics, failed missions, or self-assessment.

Output:

- Focused repair evidence and updated readiness.

## Architecture Case Study

Purpose:

- Convert founder work and hypothetical production-scale designs into proof.

Output:

- HLD, LLD, tradeoff analysis, architecture review, presentation, or behavioral narrative.

## 5. Mission Structure

Every mission should define:

```txt
missionId
missionType
objective
capability
topic
estimatedTime
prerequisites
tasks
proofRequirements
readinessImpact
```

Example: AWS mission

| Field | Value |
| --- | --- |
| missionId | `mission-aws-multi-az-design-001` |
| missionType | Implement |
| objective | Design a multi-AZ backend API and explain reliability tradeoffs. |
| capability | `cap-aws-cloud-architecture` |
| topic | `topic-aws-multi-az-architecture` |
| estimatedTime | 90 minutes |
| prerequisites | VPC basics, load balancing, RTO/RPO |
| tasks | Draw architecture, list failure modes, define RTO/RPO, explain cost/security tradeoffs. |
| proofRequirements | AWS Design + Architecture Review |
| readinessImpact | AWS Readiness, System Design Readiness, Architect Readiness |

Example: Behavioral mission

| Field | Value |
| --- | --- |
| missionId | `mission-behavioral-ownership-001` |
| missionType | Behavioral |
| objective | Convert a real ownership experience into an interview-ready story. |
| capability | `cap-behavioral-interviews` |
| topic | `topic-behavioral-ownership-story` |
| estimatedTime | 45 minutes |
| prerequisites | Experience mining |
| tasks | Draft STAR story, add metrics, add follow-up answers. |
| proofRequirements | Behavioral Answer |
| readinessImpact | Behavioral Readiness, Communication Readiness, Interview Readiness |

## 6. Mission Generation Logic

Mission generation flow:

```txt
Current State
  -> Readiness Analysis
  -> Dependency Check
  -> Priority Calculation
  -> Mission Selection
```

Step 1: Current State

- Read roadmap, target role, timeline, weak areas, available time, readiness, and pending work.

Step 2: Readiness Analysis

- Find hard gates below threshold.
- Find capability gaps.
- Find topic readiness dimension gaps.
- Find offer-readiness gaps.

Step 3: Dependency Check

- Do not select a mission if required prerequisites are missing unless the mission is a prerequisite repair.

Step 4: Priority Calculation

- Score candidates using hard-gate status, roadmap criticality, weak-area severity, proof need, interview urgency, and time fit.

Step 5: Mission Selection

- Select one primary mission for today.
- Optionally select 0-2 secondary missions if time allows.

Daily experience:

```txt
Today's Primary Mission
Optional:
  - Revision
  - Weak Area Repair
```

Reason:

- Execution paralysis is a real problem.
- Too many choices reduce execution.
- The default day should make the next action obvious.

Example:

```txt
AWS Readiness: 55
Available time: 2 hours
Roadmap: Architect Track
Pending proof: EngineeringOS Architecture review
Selected mission: Create AWS reliability review for EngineeringOS Architecture
```

## 7. Resume Previous Topic Logic

If a topic is unfinished, the system should decide whether to resume, defer, replace, or revise.

Resume when:

- The topic is on the roadmap critical path.
- The topic is a prerequisite for a blocked capability.
- The topic has recent progress and can be completed with available time.
- The topic affects a hard gate.

Defer when:

- The topic is not currently on the critical path.
- A higher-priority hard gate is below threshold.
- The topic is low confidence or not allowed in the current roadmap type.
- Available time is too short and a smaller useful mission exists.

Replace when:

- The topic no longer matches the selected target role or timeline.
- Readiness data shows a different blocker is more urgent.
- The user manually changes target role, weak areas, or roadmap type.

Revise when:

- The topic was previously completed but readiness decayed.
- A mock/interview exposed weakness.
- The user failed a related mission.
- The topic is needed before a case study, mock, or application step.

Rule:

```txt
Unfinished does not always mean next.
Highest readiness impact means next.
```

## 8. Mission Priority Model

Priority order:

1. Hard blockers.
2. Readiness gaps.
3. Roadmap critical path.
4. Weak areas.
5. Revision.
6. Optional enrichment.

Rationale:

- Hard blockers prevent application readiness.
- Readiness gaps reveal what is not yet provable.
- Critical path keeps the roadmap coherent.
- Weak areas need active repair before they become repeated failures.
- Revision protects retention.
- Optional enrichment should never displace offer-critical work.

## 9. Mission Completion

Mission completion must not be checkbox based.

Completion requires proof appropriate to mission type:

| Mission Type | Completion Proof |
| --- | --- |
| Learn | Explanation, concept answer, or short quiz result. |
| Practice | Solved exercise, design answer, or reviewed attempt. |
| Implement | Code solution, design artifact, API contract, or implementation note. |
| Interview | Mock answer, timed response, follow-up handling, or evaluated result. |
| Behavioral | STAR/CAR story, metrics, follow-up answers, and reflection. |
| Career Asset | Resume update, LinkedIn edit, GitHub update, portfolio asset, application/referral artifact. |
| Revision | Corrected answer, reattempt, or confidence-restoring review. |
| Weak Area Repair | Focused repair artifact and updated readiness score. |
| Architecture Case Study | HLD, LLD, tradeoff memo, architecture review, or presentation section. |

The detailed case-study completion rubric should be finalized in the Readiness Engine phase.

Every proof should use this scoring rubric:

| Score | Meaning |
| ---: | --- |
| 0 | Not Attempted |
| 1 | Attempted |
| 2 | Partial |
| 3 | Acceptable |
| 4 | Strong |
| 5 | Interview Ready |

## 10. Mission Readiness Impact

Mission results should affect:

- Topic Readiness.
- Capability Readiness.
- Role Readiness.
- Interview Readiness.
- Offer Readiness.

Examples:

| Mission Result | Readiness Impact |
| --- | --- |
| Correctly explains Multi-AZ tradeoffs | Improves Knowledge and Interview readiness for AWS topic. |
| Produces AWS architecture review | Improves Implementation, AWS, Architect, and case-study readiness. |
| Completes HLD mock | Improves System Design and Interview readiness. |
| Drafts ownership story with metrics | Improves Behavioral and Communication readiness. |
| Updates resume with architect positioning | Improves Resume Readiness and Offer Readiness. |
| Sends referral outreach | Updates referral outreach tracking, but does not by itself improve Offer Readiness. |

Referral outreach before hard gates is allowed, but it must be tracked separately from Offer Readiness. It should not mark the user as application-ready or offer-ready.

## 11. Revision Queue

The Revision Queue automatically schedules review missions.

Inputs:

- Low readiness.
- Skipped topics.
- Failed missions.
- Time decay.
- Upcoming interview.
- Weak-area recurrence.

Behavior:

- Failed mission creates repair or revision mission.
- Skipped hard-gate topic returns soon.
- Stale interview-critical topic returns before mocks/interviews.
- Repeated weak-area failures increase priority.
- Revision missions should be short unless the gap requires deeper repair.
- Failure is not a penalty. Failure means a readiness gap was discovered.
- Failed missions should inject a repair mission, add a revision task, and reduce readiness confidence.

Example:

```txt
Failed HLD mock: unclear bottlenecks and scaling path
Revision Queue:
  -> revise HLD answer structure
  -> practice bottleneck identification
  -> reattempt shorter HLD drill
```

## 12. Weak Area Repair System

Weak areas can come from:

- Onboarding self-assessment.
- Diagnostic questions.
- Failed missions.
- Low readiness scores.
- Mock interview feedback.
- Manual user marking.

Repair behavior:

- Identify the weak area.
- Map it to capabilities, topics, and mission types.
- Inject repair missions above optional roadmap items.
- Require proof before marking repaired.

Examples:

| Weak Area | Repair Mission |
| --- | --- |
| AWS service selection | Compare ECS, Lambda, and EC2 for EngineeringOS deployment. |
| HLD structure | Redo design answer using requirements, APIs, data, scaling, failure modes. |
| Communication | Record or write a concise architecture tradeoff explanation. |
| Behavioral stories | Convert a real incident into STAR format with follow-ups. |
| Resume positioning | Rewrite summary and top bullets for Solution Architect target. |

## 13. Architecture Case Study Missions

Initial case studies:

1. EngineeringOS.
2. Agent-OS.
3. Large Scale Learning Platform.

Mission examples:

| Case Study | Mission | Proof |
| --- | --- | --- |
| EngineeringOS | Create HLD for Career Transformation OS. | HLD |
| EngineeringOS | Review capability graph, roadmap projection, and readiness tradeoffs. | Architecture Review |
| Agent-OS | Design multi-agent ingestion and quality-review orchestration. | HLD + Tradeoff Analysis |
| Agent-OS | Model agent task routing and failure handling. | LLD |
| Large Scale Learning Platform | Design multi-tenant content delivery and progress tracking. | HLD |
| Large Scale Learning Platform | Present scaling, caching, data, and observability tradeoffs. | Presentation |

These missions should contribute to:

- Architect Readiness.
- System Design Readiness.
- AWS Readiness when cloud design is included.
- Communication Readiness.
- Behavioral Readiness.
- Resume/GitHub/Portfolio readiness.

## 14. Behavioral Mission System

Behavioral mission types:

- STAR stories.
- Conflict stories.
- Leadership stories.
- Stakeholder stories.
- Production incidents.
- Mentoring stories.
- Tradeoff decision stories.
- Failure and recovery stories.

Behavioral missions improve readiness by:

- Mining real experience.
- Making personal contribution explicit.
- Adding metrics and business impact.
- Preparing follow-up answers.
- Improving concise communication.
- Connecting case studies to interview narratives.

Example:

```txt
Mission: Draft production incident story
Tasks:
  -> context
  -> personal role
  -> impact
  -> action
  -> tradeoff
  -> result
  -> prevention
  -> follow-ups
```

## 15. Career Asset Missions

Career asset mission types:

- Resume.
- LinkedIn.
- GitHub.
- Portfolio.
- Applications.
- Referrals.

Readiness impact:

| Asset | Impact |
| --- | --- |
| Resume | Improves Resume Readiness and application quality. |
| LinkedIn | Improves target-role positioning and recruiter conversion. |
| GitHub | Improves proof-of-work visibility. |
| Portfolio | Improves case-study and architecture proof. |
| Applications | Tracks role targeting and pipeline movement. |
| Referrals | Tracks outreach activity separately from Offer Readiness until hard gates pass. |

Applications should not be recommended while hard gates are below threshold. Referral outreach can happen earlier as pipeline warming, but it should not count as offer-ready status.

## 16. Mission Streaks & Lightweight Gamification

Keep MVP simple.

Allowed:

- Mission streaks.
- Readiness milestones.
- Capability badges.
- Roadmap progress.

Avoid:

- Coins.
- XP economies.
- Leaderboards.
- Social competition.
- Cosmetic reward systems that distract from readiness.

Rationale:

- The founder beta needs accountability, not entertainment.
- Lightweight progress signals are useful only when they reinforce execution and readiness.

## Mission Modes

Daily Mission should support two execution modes:

| Mode | Time Window | Best For |
| --- | --- | --- |
| Weekday | 30-90 minutes | Focused learn/practice/interview/revision/repair missions. |
| Weekend | 2-6 hours | Case studies, HLD, LLD, projects, behavioral story workshops, resume reviews. |

Weekend missions can be larger proof blocks. They should still have clear proof requirements and readiness impact.

## 17. Future Data Structure

Recommended future locations:

```txt
src/data/missions/
src/data/mission-rules/
src/data/revision-queue/
src/data/readiness-impact/
```

Possible future groups:

```txt
src/data/missions/mission-types.ts
src/data/missions/founder-beta-missions.ts
src/data/mission-rules/selection-rules.ts
src/data/mission-rules/priority-rules.ts
src/data/revision-queue/revision-rules.ts
src/data/readiness-impact/impact-rules.ts
src/data/readiness-impact/proof-requirements.ts
```

Do not create these files until implementation is explicitly requested.

## 18. Anti Patterns

Avoid:

- Mission spam.
- Too many daily tasks.
- Checkbox completion.
- Roadmap bypassing.
- Content overload.
- Missions that do not update readiness.
- Learning missions with no proof output.
- Optional enrichment displacing hard gates.
- Referral/application missions pretending hard gates are passed.

## 19. Recommended Next Planning Artifact

Recommended next document:

```txt
docs/READINESS_ENGINE_MODEL_V2.md
```

Why:

- Daily Missions define execution.
- The Readiness Engine must define how mission proof changes scores, gates, role readiness, interview readiness, and offer readiness.
- Without Readiness Engine V2, mission completion can drift back into checkbox progress.

Do not implement mission logic before the readiness scoring contract is defined.

## Risks

- Mission selection can become noisy if too many candidates are shown.
- Proof requirements can feel heavy if every small mission demands large artifacts.
- Weak readiness data can choose the wrong mission.
- Referral outreach may create false confidence if not separated from Offer Readiness.
- Case-study completion needs a clear rubric in the Readiness Engine phase.
- Overuse of revision can stall forward roadmap movement.

## Open Questions

- What exact scoring rubric should evaluate HLD, LLD, architecture review, and behavioral proof?
- Should weekend deep-work missions be scheduled automatically, manually selected, or suggested on Friday?
- How should failed missions distinguish between low effort, unclear prompt, and true readiness gap without becoming punitive?

## V2 Foundation Audit Addendum

Date: 2026-06-06

### Planning Status

This document is the canonical Daily Mission V2 model. The planning model is complete enough to guide implementation.

### Implementation Status

Current implementation is partial:

- `src/data/founder-beta/daily-missions.ts` contains 7 sample missions.
- `src/lib/services/founder-beta-mission-selection-service.ts` selects a Primary Mission and 0-2 optional missions deterministically.
- selection considers hard blockers, incomplete previous work, readiness gaps, roadmap critical path, weak areas, revision, optional enrichment, and time budget.

Current implementation is not yet the full Daily Mission Engine:

- no generated mission queue from the full Capability Graph and Master Syllabus
- no proof submission lifecycle
- no mission result evaluation
- no revision queue persistence
- no failed mission classification
- no case-study completion rubric
- no weekday/weekend schedule intelligence beyond static mission mode and minutes

### Gaps Versus Original Strategy

Missing:

- generated mission candidates from roadmap items
- mission lifecycle state
- mission proof capture
- mission readiness impact updates
- repair/revision queue
- weekend deep-work planning
- mission explanations tied to capability/readiness/source gaps

### Canonical V2 Data Structures

Required implementation structures:

```txt
MissionCandidate
  missionId
  missionType
  capabilityId
  skillId
  topicId
  sourceIds
  estimatedMinutes
  proofType
  readinessImpact
  selectionReason

MissionSelectionInput
  roadmapProjection
  readinessSnapshot
  weakAreas
  completedWork
  availableMinutes
  dayMode

MissionResult
  missionId
  status
  proofScore
  proofArtifactRef
  readinessSignals
  revisionNeeded

RevisionQueueItem
  topicId
  capabilityId
  reason
  dueWindow
  priority
```

### Required Relationships

```txt
Mission -> Capability
Mission -> Skill
Mission -> Topic
Mission -> Source
Mission -> Proof
Mission -> Readiness Impact
Mission -> Roadmap Item
```

### Founder Architect Path Requirement

The first complete mission set must support:

- AWS/cloud architecture missions
- HLD missions
- LLD/backend missions
- database/distributed systems missions
- behavioral/communication missions
- resume/career asset missions
- 3 architecture case-study mission chains
- revision and weak-area repair missions

### Implementation Order After V2 Finalization

1. Expand mission seed data for the full Founder Architect P0 path.
2. Add mission candidate generation from roadmap items.
3. Add mission lifecycle contracts.
4. Add proof score input flow later.
5. Add revision queue and failed-mission rules after proof scoring exists.
