# Readiness Engine Model V2

Date: 2026-06-05

## Purpose

This document defines the Readiness Engine for EngineeringOS.

EngineeringOS optimizes for:

```txt
Offer Readiness
```

not:

- Topic completion.
- Course completion.
- Hours studied.
- Checkbox progress.

The Readiness Engine is the primary measurement system of the product.

It measures:

```txt
Current State
  -> Capability Growth
  -> Interview Readiness
  -> Role Readiness
  -> Offer Readiness
```

## 1. What Is Readiness?

Readiness is evidence-backed confidence that the user can perform, explain, apply, and prove a capability at target-role level.

Definitions:

| Term | Meaning |
| --- | --- |
| Readiness | A measured state of ability for a topic, capability, role, interview round, or offer workflow. |
| Confidence | How trustworthy the readiness score is based on evidence quality, recency, and evaluation depth. |
| Proof | A submitted artifact or performance signal such as code, HLD, LLD, answer, review, resume update, or case study. |
| Competency | Demonstrated ability to perform a skill at the expected target-role bar. |
| Completion | Activity state showing something was attempted or finished; useful, but not equal to readiness. |

Difference:

- Completion says "the user did something."
- Proof says "the user produced evidence."
- Competency says "the evidence meets the bar."
- Readiness says "the user is likely prepared for the target scenario."
- Confidence says "we trust or distrust that readiness estimate."

## 2. Readiness Hierarchy

Readiness rolls upward from proof:

```txt
Proof
  -> Topic Readiness
  -> Capability Readiness
  -> Role Readiness
  -> Interview Readiness
  -> Offer Readiness
```

Why:

- Proof is the smallest trustworthy evidence unit.
- Topic Readiness measures whether a topic is usable.
- Capability Readiness measures whether the user can perform role-relevant abilities.
- Role Readiness measures fit for a target role.
- Interview Readiness measures performance under interview conditions.
- Offer Readiness measures whether the user has the assets, pipeline, confidence, and evidence to pursue offers.

Learning progress may inform readiness, but it must not replace proof.

## 3. Proof Scoring Model

Every proof uses this locked rubric:

| Score | Meaning | Usage |
| ---: | --- | --- |
| 0 | Not Attempted | No evidence exists. |
| 1 | Attempted | User tried, but evidence is incomplete or weak. |
| 2 | Partial | Some correct signal exists, but gaps remain. |
| 3 | Acceptable | Meets minimum expected bar for the mission. |
| 4 | Strong | Good target-role signal with clear reasoning and execution. |
| 5 | Interview Ready | Strong enough for interview use or portfolio/offer-readiness evidence. |

Usage:

- `0-2` should usually trigger repair or revision.
- `3` can satisfy basic mission completion.
- `4` can contribute positively to capability readiness.
- `5` can count toward interview readiness, case-study readiness, or offer-readiness proof.

Proof scoring should be type-aware. A code solution, HLD, LLD, architecture review, behavioral answer, and resume update all use the same 0-5 scale, but their rubrics differ.

## 4. Topic Readiness

Topic Readiness uses four dimensions:

| Dimension | Weight | Meaning |
| --- | ---: | --- |
| Knowledge | 20% | Can explain the concept accurately. |
| Practice | 25% | Can solve relevant exercises or structured practice. |
| Interview | 25% | Can answer under interview-like conditions. |
| Implementation | 30% | Can apply the topic in code, design, architecture, or artifact work. |

Calculation:

```txt
Topic Readiness =
  Knowledge * 0.20
  + Practice * 0.25
  + Interview * 0.25
  + Implementation * 0.30
```

Scores can be represented on either a 0-5 proof scale or normalized to 0-100 for UI and gates.

Example:

```txt
Topic: AWS Multi-AZ Architecture
Knowledge: 4/5
Practice: 3/5
Interview: 2/5
Implementation: 2/5
Weighted: 2.65/5 = 53/100
Result: not ready; implementation and interview missions required
```

Example:

```txt
Topic: Behavioral Ownership Story
Knowledge: 4/5
Practice: 3/5
Interview: 4/5
Implementation: 5/5
Weighted: 4.05/5 = 81/100
Result: strong behavioral asset; revise before interviews
```

## 5. Capability Readiness

Capability Readiness rolls up from topic readiness and proof.

Inputs:

- Required topic readiness.
- Required proof scores.
- Skill coverage.
- Interview performance.
- Implementation evidence.
- Source confidence for mapped topics.
- Recency and revision health.
- Weak-area blockers.

Suggested calculation:

```txt
Capability Readiness =
  50% required topic readiness
  + 25% proof readiness
  + 15% capability interview readiness
  + 10% recency / revision health
  - blocker penalties
```

Examples:

```txt
Capability: AWS / Cloud Architecture
Topics: IAM, VPC, Multi-AZ, RDS HA, DR, Well-Architected
Proof: Multi-AZ design, Well-Architected review
Blocker: no architecture review proof
Result: cannot exceed 70 until proof exists
```

```txt
Capability: Behavioral Interviews
Topics: ownership story, conflict story, incident story
Proof: 3 interview-ready stories
Result: capability ready if stories score 4-5 and follow-ups are acceptable
```

## 6. Role Readiness

Role Readiness is a weighted capability rollup.

Supported roles:

- Solution Architect.
- Engineering Manager-aware support.
- Lead Backend.
- Principal Engineer.
- Staff Engineer.

Solution Architect weights are highest for:

- AWS / Cloud Architecture.
- System Design.
- Distributed Systems.
- Reliability / Observability.
- Security.
- Communication.
- Architecture Case Studies.

Engineering Manager-aware support weights are highest for:

- Behavioral.
- Communication.
- Stakeholder management.
- Ownership.
- Incident communication.

Lead Backend weights are highest for:

- Backend Engineering.
- Node.js / TypeScript.
- Databases.
- LLD.
- Reliability.
- Technical leadership.

Principal and Staff weights are highest for:

- System design.
- Distributed systems.
- Architecture reviews.
- Technical leadership.
- Influence.
- Communication.

Role Readiness must remain separate from Interview Readiness. A user can be technically role-ready but still interview-weak.

## 7. Interview Readiness

Interview Readiness is separate from learning progress.

Interview dimensions:

- Coding.
- HLD.
- LLD.
- AWS.
- Behavioral.
- Leadership.
- Communication.

Calculation should consider:

- Relevant topic readiness.
- Mock or timed answer scores.
- Proof quality.
- Follow-up handling.
- Communication clarity.
- Recency.
- Failure patterns.

Example:

```txt
HLD Readiness =
  40% HLD proof scores
  + 25% system design topic readiness
  + 20% mock interview performance
  + 15% communication clarity
```

Example:

```txt
AWS Interview Readiness =
  35% AWS topic readiness
  + 30% AWS design proof
  + 20% mock answers
  + 15% service-selection/tradeoff clarity
```

Interview Readiness should answer:

```txt
Can the user perform in a real interview loop?
```

not:

```txt
Did the user study the topic?
```

## 8. Offer Readiness

Offer Readiness is the product north star.

Offer Readiness areas:

| Area | What It Measures |
| --- | --- |
| Resume Readiness | Target-role positioning, impact bullets, senior scope, ATS clarity. |
| LinkedIn Readiness | Recruiter-visible positioning and consistency with resume. |
| GitHub Readiness | Proof-of-work visibility and professional project presentation. |
| Portfolio Readiness | Case studies, architecture notes, tradeoffs, and proof artifacts. |
| Behavioral Readiness | Interview-ready real stories with follow-ups. |
| Interview Readiness | Coding, HLD, LLD, AWS, behavioral, leadership, communication. |
| Architecture Case Studies | At least 3 completed proof-backed case studies. |
| Application Readiness | Target company list, role fit, application tracker, resume variants. |
| Referral Readiness | Outreach activity and warm pipeline, tracked separately before gates. |
| Compensation Readiness | Floor, target, stretch, market evidence, negotiation awareness. |

Scoring:

- Each area can be scored 0-100.
- Proof-based subareas should derive from the 0-5 proof rubric.
- Offer Readiness should not become `Ready` if hard gates fail.

Referral outreach rule:

- Referral outreach before gates is allowed.
- It is tracked separately from Offer Readiness.
- It does not make the user application-ready or offer-ready.

## 9. Confidence Model

Readiness Score and Confidence Score are different.

Readiness Score:

- Estimates current ability.
- Derived from proof, topic scores, mocks, artifacts, and role weights.

Confidence Score:

- Estimates how trustworthy the readiness score is.
- Derived from evidence quantity, evidence quality, recency, source confidence, and evaluator quality.

Examples:

| Scenario | Meaning | System Behavior |
| --- | --- | --- |
| High readiness, high confidence | Strong evidence supports readiness. | Maintain, revise periodically, proceed if gates pass. |
| High readiness, low confidence | Score looks good but evidence is thin or stale. | Add validation mission or mock. |
| Low readiness, high confidence | Clear gap exists. | Inject repair mission and roadmap priority. |
| Low readiness, low confidence | Not enough data and likely weak. | Run diagnostic or starter mission. |

Failed missions should reduce confidence because the previous readiness estimate was less trustworthy than expected.

## 10. Readiness Decay

Readiness can decrease when evidence becomes stale.

Decay triggers:

- Long inactivity.
- Skipped revisions.
- Failed missions.
- Repeated weak-area signals.
- Interview feedback contradicts prior readiness.
- Major source or role expectation changes.

Avoid harsh penalties:

- Decay should lower confidence first.
- Readiness should drop gradually unless a direct failure exposes a serious gap.
- The system should respond with repair and revision, not shame or punishment.

Example:

```txt
Topic: Graph BFS
No practice for 30 days
Action: lower confidence, add short revision mission
```

## 11. Failed Mission Impact

Locked rule:

```txt
Failure is a readiness signal.
Failure is not punishment.
```

Failure means a readiness gap was discovered.

System behavior:

- Inject repair mission.
- Add revision task.
- Reduce readiness confidence.
- Identify whether the gap is knowledge, practice, interview, implementation, communication, or effort-related.
- Preserve progress history without negative streak shaming.

Examples:

```txt
Failed HLD mission
  -> add HLD structure repair
  -> add follow-up mock
  -> lower HLD confidence
```

```txt
Failed behavioral mission
  -> add story mining mission
  -> add STAR rewrite task
  -> lower Behavioral Readiness confidence
```

## 12. Weak Area Detection

Weak areas should be detected automatically.

Signals:

- Repeated low scores.
- Repeated failed missions.
- Skipped dependencies.
- Behavioral weaknesses.
- Communication weaknesses.
- Low confidence despite high self-assessment.
- Mock interview feedback.
- Stale high-priority topics.

Examples:

| Signal | Weak Area |
| --- | --- |
| Repeated AWS tradeoff errors | AWS service selection. |
| HLD misses bottlenecks repeatedly | System design structure. |
| Behavioral answers lack personal contribution | Storytelling / ownership. |
| Resume bullets lack impact | Resume readiness. |
| Coding misses graph traversal basics | DSA graph repair. |

Detected weak areas should inject missions into the roadmap above optional enrichment.

## 13. Hard Gates

Locked hard gates:

| Gate | Threshold |
| --- | ---: |
| Architect Readiness | `>= 75` |
| AWS Readiness | `>= 70` |
| Behavioral Readiness | `>= 70` |
| Communication Readiness | `>= 70` |
| Resume Readiness | `>= 80` |
| Architecture Case Studies | Minimum 3 completed |

If any gate is below threshold:

```txt
Application Not Recommended
```

Rationale:

- Architect roles require credible system design, AWS reasoning, and communication.
- Senior interview loops require behavioral evidence and ownership stories.
- Weak resume positioning wastes application opportunities.
- Three completed architecture case studies create reusable proof for HLD, LLD, tradeoffs, architecture reviews, behavioral stories, portfolio, and resume.

## 14. Readiness Milestones

Recommended milestones:

| Milestone | Meaning |
| --- | --- |
| Topic Ready | Topic readiness is above threshold and required proof is acceptable. |
| Capability Ready | Required topics and proof meet capability threshold. |
| Architect Ready | Architect Readiness `>= 75` and hard gates are passed. |
| Interview Ready | Interview dimensions meet round-specific thresholds with recent proof. |
| Offer Ready | Hard gates passed, assets ready, case studies complete, and pipeline strategy exists. |

Milestones should be evidence-backed and reversible if readiness decays or new failures appear.

## 15. Readiness UX Principles

No UI design is defined here. Principles only:

- Show readiness as evidence-backed status, not vanity completion.
- Separate learning progress from interview readiness and offer readiness.
- Show why a score is blocked.
- Show next mission that improves the score.
- Show confidence separately where useful.
- Avoid shame-based language for failures.
- Make hard gates explicit before application recommendations.
- Keep the daily view action-oriented.
- Preserve traceability from score to proof.

## 16. Future Data Structure

Recommended future locations:

```txt
src/data/readiness/
src/data/readiness-rules/
src/data/readiness-decay/
src/data/readiness-milestones/
```

Possible future groups:

```txt
src/data/readiness/topic-readiness.ts
src/data/readiness/capability-readiness.ts
src/data/readiness/role-readiness.ts
src/data/readiness/interview-readiness.ts
src/data/readiness/offer-readiness.ts
src/data/readiness-rules/proof-scoring.ts
src/data/readiness-rules/hard-gates.ts
src/data/readiness-decay/decay-rules.ts
src/data/readiness-milestones/milestones.ts
```

Do not create these files until implementation is explicitly requested.

## 17. Anti Patterns

Avoid:

- Completion percentages.
- Checkbox progress.
- Vanity metrics.
- Time-spent metrics as success.
- Blending learning progress with interview readiness.
- Blending referral outreach with Offer Readiness.
- Punishing failed missions.
- Declaring readiness without proof.
- Treating course completion as competency.

Why:

- These metrics can make the user feel productive without becoming interview-ready or offer-ready.
- EngineeringOS must measure transformation, not activity.

## 18. Recommended Next Planning Artifact

Recommended next document:

```txt
docs/IMPLEMENTATION_READINESS_REVIEW.md
```

Why:

- The core planning model now has Product Strategy, Source/Ingestion, Source Catalog, First Beta Path, Capability Graph, Master Syllabus, Roadmap Projection, Daily Mission, and Readiness Engine.
- Before implementing code, EngineeringOS needs a readiness review that compares current code and data against these V2 planning docs.
- The review should decide what to implement first and what to leave untouched.

Do not implement readiness logic before this review.

## Risks

- Readiness can become overcomplicated if too many dimensions are scored too early.
- Confidence can confuse users if not explained clearly.
- Proof scoring can feel subjective without rubrics for HLD, LLD, architecture review, behavioral stories, and resume assets.
- Hard gates can feel discouraging unless paired with clear repair missions.
- Offer Readiness can become too broad unless the founder beta keeps Architect readiness as the primary path.
- Readiness decay can feel punitive if it drops scores too aggressively.

## Open Questions

- What exact rubrics define scores `1-5` for HLD, LLD, AWS design, behavioral answer, resume, and case study proof?
- What readiness and confidence thresholds should trigger automatic roadmap regeneration?
- Should hard gates use weighted rolling scores or latest proof scores?
- Who reviews proof during founder beta: self-evaluation only, Sarwan manual review, or later AI-assisted review?

## V2 Foundation Audit Addendum

Date: 2026-06-06

### Planning Status

This document is the canonical Readiness Engine V2 model. The planning model is complete enough to guide implementation.

### Implementation Status

Current implementation is partial:

- `src/data/founder-beta/readiness-rules.ts` defines topic weights, proof score labels, hard gates, and offer signals.
- `src/lib/services/founder-beta-readiness-service.ts` calculates topic, capability, role, hard-gate, and offer readiness from typed inputs.
- `/founder-beta` treats readiness values as manual draft estimates.

Current implementation is not yet the full Readiness Engine:

- no persisted proof attempts
- no evaluated proof scoring UX
- no topic readiness state by topic/user
- no skill readiness
- no confidence model beyond input/output fields
- no readiness decay
- no automatic weak-area detection
- no case-study completion rubric
- no evidence-backed offer readiness

### Gaps Versus Original Strategy

Missing:

- proof-first readiness state
- topic readiness by Knowledge, Practice, Interview, Implementation per topic
- skill readiness rollup
- capability readiness with blockers
- role readiness generated from full capability weights
- interview readiness by round
- offer readiness by assets/pipeline/compensation
- confidence and decay rules
- hard-gate explanations based on proof evidence

### Canonical V2 Data Structures

Required implementation structures:

```txt
ProofAttempt
  id
  missionId
  topicId
  capabilityId
  proofType
  score
  rationale
  artifactRef
  createdAt

TopicReadiness
  topicId
  knowledge
  practice
  interview
  implementation
  confidence
  evidenceRefs

CapabilityReadiness
  capabilityId
  score
  confidence
  blockerIds
  evidenceRefs

ReadinessSnapshot
  topicReadiness
  capabilityReadiness
  roleReadiness
  interviewReadiness
  offerReadiness
  hardGateStatus
```

### Required Relationships

```txt
Readiness -> Proof
Readiness -> Topic
Readiness -> Skill
Readiness -> Capability
Readiness -> Role
Readiness -> Mission Result
Readiness -> Offer Signal
Readiness -> Roadmap Regeneration
```

### Founder Architect Path Requirement

The first evaluated readiness path must support:

- Architect Readiness
- AWS Readiness
- System Design Readiness
- Behavioral Readiness
- Communication Readiness
- Resume Readiness
- Architecture Case Study Readiness
- senior backend DSA interview readiness

Hard gates remain:

- Architect Readiness `>= 75`
- AWS Readiness `>= 70`
- Behavioral Readiness `>= 70`
- Communication Readiness `>= 70`
- Resume Readiness `>= 80`
- at least 3 completed architecture case studies

### Implementation Order After V2 Finalization

1. Add proof attempt contracts and static rubrics.
2. Add topic readiness state shape.
3. Add skill and capability readiness rollups.
4. Add hard-gate explanation output.
5. Add proof scoring UX only after the model is ready.
6. Keep manual readiness estimates separate until evaluated readiness is evidence-backed.
