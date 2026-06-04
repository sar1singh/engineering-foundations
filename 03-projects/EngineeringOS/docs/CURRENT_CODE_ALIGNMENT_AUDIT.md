# Current Code Alignment Audit

Date: 2026-06-04

## Purpose

This audit compares the current EngineeringOS codebase against the revised MVP strategy docs:

- `docs/PRODUCT_STRATEGY.md`
- `docs/BETA_MVP_STRATEGY.md`
- `docs/CAPABILITY_GRAPH_MODEL.md`
- `docs/MASTER_SYLLABUS_MODEL.md`
- `docs/ROADMAP_PROJECTION_MODEL.md`
- `docs/DAILY_MISSION_JOURNEY.md`
- `docs/READINESS_SCORING_MODEL.md`
- `docs/NEXT_MVP_BUILD_SEQUENCE.md`

No implementation changes were made for this audit.

## Executive Summary

EngineeringOS already has a substantial foundation for the revised product direction. It has local-first data, a broad Master Syllabus-like catalog, role-based roadmap projections, onboarding preferences, mission-oriented dashboard surfaces, interview-round pages, answer builders, weak-area repair pages, and enriched content for DSA, HLD, LLD, AWS, Staff/EM, and career assets.

The main gap is that these pieces are not yet unified under the revised canonical model. The app currently behaves like a strong learning/interview cockpit with course-style journeys and completion-based readiness. It does not yet have a first-class Capability Graph, model-driven Daily Mission selection, four-part topic readiness, separate offer-readiness state, or proof-of-competency tracking as the core engine.

## What Already Exists

## Product Shell And Routes

Existing surfaces that align with the revised strategy:

- `/today`: mission-oriented cockpit with daily action cards.
- `/dashboard`: mission control surface with today's protocol, role readiness, weak areas, assessment readiness, current path, and next steps.
- `/onboarding`: captures target role, current level, hours per week, deadline, weak areas, and learning mode.
- `/syllabus`: browses the imported syllabus catalog.
- `/syllabus/[topicId]`: topic learning, practice, interview, references, response submission, and scoring-related UI.
- `/graph`: role-aware roadmap/graph visualization.
- `/courses` and `/courses/[courseSlug]`: guided role journeys derived from role roadmap data.
- `/interview-rounds`: round-wise interview readiness display.
- `/answer-builders`: structured HLD, LLD, AWS, behavioral, Staff/EM, and incident answer frameworks.
- `/weak-areas`: weak-area repair workflow.
- `/sources` and `/roadmap-source`: source/reference support.
- `/progress`, `/profile`, `/quality`, and `/settings`: supporting progress, profile, QA, and configuration surfaces.

Assessment:

- Strong alignment with guided execution and founder beta usability.
- The existence of `/today` is directionally correct for "Today's Mission first".
- The continued prominence of `/dashboard` and `/courses` creates some strategy tension unless they become projections over the core model rather than product centers.

## Local-First Architecture

Existing architecture aligns well with the earlier and revised MVP constraints:

- Repository/service layering exists under `src/lib/repositories` and `src/lib/services`.
- `appServices` centralizes service wiring.
- Mock/local data exists under `src/data`.
- Prisma schema and repositories exist for local persistence.
- API adapters exist for health, learner profile, progress summary, readiness, and quality status.

Assessment:

- This is a strong foundation for model alignment.
- The revised work should reuse these layers rather than bypass them.

## Master Syllabus Foundation

Existing files:

- `src/types/syllabus.ts`
- `src/data/mock-syllabus.ts`
- `src/data/syllabus/*`
- `src/data/content/*`
- `src/lib/services/syllabus-service.ts`

What exists:

- Domains, modules, topics, source paths, definitions, theory, mental models, code examples, practice problems, interview questions, common mistakes, production use cases, revision prompts, review prompts, references, progress signals, and enriched content.
- Broad coverage across JavaScript, Node.js, DSA, Algorithms, Databases, System Design, AWS, LLD, Security, Performance, Interviews, Staff/EM, Career Assets, and AI.
- Enriched content for high-ROI DSA, HLD, LLD, AWS, Staff/EM, and career topics.

Assessment:

- The app already has the strongest piece of the revised strategy: a Master Syllabus-like content base.
- It needs schema alignment with the revised `MASTER_SYLLABUS_MODEL.md`, especially target-role links, capability links, explicit proof tasks, and four readiness dimensions.

## Role Roadmap Projection

Existing files:

- `src/data/syllabus/role-learning-roadmaps.ts`
- `src/data/guided-courses.ts`
- `src/app/courses/page.tsx`
- `src/app/courses/[courseSlug]/page.tsx`
- `src/app/graph/page.tsx`

What exists:

- Role roadmaps for Senior Backend Engineer, AWS Solution Architect, Staff/Principal Engineer, and Engineering Manager.
- Each roadmap has audience, outcome, topic slugs, and focus groups.
- Guided courses are generated from role roadmaps through `fromRole`.
- Course journeys render role stages and topic links.

Assessment:

- This partially implements roadmap projection from syllabus topics.
- The projection is currently topic-slug based, not capability/skill/proof based.
- There is no explicit "Current State -> Target Role -> Capability -> Skill -> Topic -> Task -> Proof" object model.

## Current State And Target Role

Existing files:

- `src/types/learning-preferences.ts`
- `src/components/onboarding/OnboardingWizardForm.tsx`
- `src/lib/services/onboarding-service.ts`
- `src/lib/services/learner-state-service.ts`
- `prisma/schema.prisma` model `LearnerProfile`

What exists:

- Target role.
- Current level.
- Hours per week.
- Deadline in weeks.
- Weak areas.
- Learning mode.
- Local and Prisma-backed persistence paths.

Assessment:

- Good MVP foundation.
- Missing: current compensation target, company target, desired role family priority, interview deadline date, offer target, and explicit first-customer success metrics.

## Interview Readiness

Existing files:

- `src/data/founder-success-experience.ts`
- `src/app/interview-rounds/page.tsx`
- `src/app/answer-builders/page.tsx`
- `src/data/syllabus/interview-topics.ts`
- `src/lib/services/readiness-score-service.ts`

What exists:

- Round-wise interview list with scores, pass thresholds, tested signals, actions, and prompts.
- Answer builders for HLD, LLD, AWS, behavioral, Staff/EM, and incident responses.
- Syllabus topics for coding, system design, behavioral, mock calibration, and hiring calibration.
- `UserProgress.interviewReadinessPercent` exists as a persisted field.

Assessment:

- Interview readiness exists as UI and static data.
- It is not yet calculated from real performance across interview rounds.
- It is not yet cleanly separated as a durable readiness model with round attempts, mock history, and score dimensions.

## Offer Readiness And Career Assets

Existing files:

- `src/data/syllabus/strategic-roadmap-topics.ts`
- `src/data/content/enriched-staff-em-career-content.ts`
- `src/app/answer-builders/page.tsx`

What exists:

- Resume, LinkedIn, GitHub, portfolio, proof-of-work, promotion packet, STAR story, and interview calibration topics.
- Enriched content covers role narrative, impact bullets, LinkedIn alignment, GitHub proof-of-work, STAR stories, and system-design portfolio.
- Answer builders include recruiter/closing loop and behavioral/story support.

Assessment:

- Offer-readiness content exists.
- Offer-readiness workflow/state does not exist yet.
- There is no tracker for resume status, LinkedIn status, proof-of-work status, target companies, referrals, applications, compensation target, interview pipeline, or follow-ups.

## Weak-Area Repair

Existing files:

- `src/data/founder-success-experience.ts`
- `/weak-areas`
- `src/types/progress.ts`
- `src/lib/services/readiness-score-service.ts`

What exists:

- Static weak-area repair examples.
- Persisted/manual weak-area model: `UserWeakArea`.
- Dashboard shows weak-area counts and remediation links.

Assessment:

- Directionally aligned.
- Not yet tied into capability blockers, four-part topic readiness, or Daily Mission selection.

## What Conflicts With Revised MVP Strategy

## Course-Centric Surfaces Are Still Prominent

Conflicting files:

- `src/data/guided-courses.ts`
- `src/app/courses/page.tsx`
- `src/app/courses/[courseSlug]/page.tsx`
- `src/components/app-shell/Sidebar.tsx`
- `src/components/app-shell/Header.tsx`

Conflict:

- Revised strategy says Capability Graph is core, not courses.
- Current UI still has "Courses", "Resume Course", course cards, course journeys, and course-first graph links.

Nuance:

- `guidedCourses` are derived from `roleLearningRoadmaps`, so they can be kept if renamed/reframed as "role projections" or "mission paths".
- The conflict is not the implementation itself; the conflict is product framing and whether courses become the center.

## Readiness Is Completion-Based

Conflicting files:

- `src/lib/services/role-readiness-service.ts`
- `src/lib/services/assessment-readiness-service.ts`
- `src/lib/services/readiness-score-service.ts`
- `src/types/progress.ts`
- `prisma/schema.prisma`

Conflict:

- Revised docs require Knowledge Score, Practice Score, Interview Score, and Implementation Score per topic.
- Current role and domain readiness use completed topic counts.
- `AssessmentReadiness` blends role completion, domain completion, QA health, and study pace into one score.
- `UserProgress` stores `readinessScore` and `interviewReadinessPercent`, but not the required score dimensions.

Impact:

- The app can display readiness, but it cannot yet prove readiness.
- Current scores risk becoming vanity percentages unless backed by task/interview/implementation evidence.

## Daily Mission Is Not Yet Model-Driven

Conflicting files:

- `src/app/today/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/lib/services/dashboard-service.ts`

Conflict:

- Revised strategy requires Daily Mission to use roadmap position, weak areas, time budget, and readiness gaps.
- `/today` is mostly static and hardcoded to Graph BFS, static interview rounds, and static weak-area data.
- `DashboardService.getDashboard()` chooses current topic by first incomplete topic and first practice task.
- Dashboard copy says "Today's Protocol", but the selection logic is not yet a true mission engine.

Impact:

- The UX is mission-shaped, but the product model is not yet mission-driven.

## Capability Graph Is Missing As A First-Class Model

Current related files:

- `src/data/learning-graph.ts`
- `src/data/syllabus/role-learning-roadmaps.ts`
- `src/app/graph/page.tsx`
- `src/lib/services/roadmap-tree-service.ts`

Conflict:

- Revised strategy says Capability Graph is the core engine.
- Current graph/roadmap data is organized around roadmap/domain/category/module/topic and role topic lists.
- There are no first-class `Capability`, `Skill`, `ProofOfCompetency`, capability weights, capability blockers, or capability-to-topic relationships.

Impact:

- Current role roadmaps can guide study, but they cannot yet explain capability gaps or select missions from capability blockers.

## Master Syllabus Exists But Is Not Fully Canonical

Current files:

- `src/types/syllabus.ts`
- `src/data/mock-syllabus.ts`
- `src/data/syllabus/*`
- legacy files such as `src/data/topics.ts`, `src/data/roadmaps.ts`, `src/data/practice-tasks.ts`

Conflict:

- Revised strategy requires Master Syllabus as canonical source of truth.
- Current app has both the syllabus catalog and older roadmap/topic/practice data paths.
- Topic Studio under `/topics/[topicId]` and syllabus pages under `/syllabus/[topicId]` appear to be parallel product surfaces.

Impact:

- Future work may accidentally add content to the wrong model.
- The app should decide whether the syllabus catalog is canonical and then treat legacy roadmap/topic/practice data as projections, compatibility data, or migration targets.

## Public SaaS/Auth/Beta Infrastructure Is Ahead Of Founder Validation

Current files:

- API routes under `src/app/api/*`
- auth placeholder pages `/signin` and `/signup`
- beta/prod runtime guard docs and services
- deployment and production readiness services

Conflict:

- Revised MVP says public multi-user SaaS workflows come after founder validation.

Nuance:

- Most of this infrastructure already exists and should not be removed.
- Future work should avoid expanding public SaaS features until the founder beta loop is proven.

## UI Polish Has Advanced Faster Than Core Model

Current evidence:

- Multiple UI redesign phases are documented.
- Dashboard/graph/course/topic/practice surfaces are polished and themed.

Conflict:

- Revised docs say UI polish comes after the core learning/readiness loop works.

Nuance:

- Existing polish is not harmful by itself.
- The risk is continuing visual work before capability graph, readiness scoring, and mission selection are credible.

## What Is Missing

## P0 Missing: Canonical Capability Graph

Needed:

- `Capability` model.
- `Skill` model.
- `ProofOfCompetency` model.
- Target-role capability weights.
- Capability-to-topic mapping.
- Capability blockers.
- Capability readiness rollup.

Why it matters:

- This is the revised core engine.
- Without it, role paths remain topic lists rather than transformation paths.

## P0 Missing: Four-Part Topic Readiness

Needed per topic/user:

- Knowledge Score.
- Practice Score.
- Interview Score.
- Implementation Score.
- Evidence and timestamp for each score.
- Rubric source for each score.

Current substitute:

- `completedTopicIds`, `completedTaskIds`, `SavedEvaluationResult.score`, `readinessScore`, and `interviewReadinessPercent`.

Why it matters:

- Completion does not equal readiness.
- The app cannot identify whether a user knows a topic but cannot implement it, or can solve practice but cannot answer interviews.

## P0 Missing: Model-Driven Daily Mission Engine

Needed:

- Daily mission service.
- Mission inputs from target role, current state, weak areas, readiness scores, time budget, deadline, roadmap stage, and revision queue.
- Mission types: learn, practice, implement, interview, repair, offer artifact, revise.
- Mission completion updates readiness dimensions.

Current substitute:

- `/today` static mission cockpit.
- `DashboardService` first-incomplete-topic logic.

Why it matters:

- Today's Mission is supposed to be the daily start point and accountability loop.

## P0 Missing: First Beta Path Definition As A Single Complete Path

Needed:

- Explicit "Senior/Lead Backend -> AWS Solution Architect / Staff-ready Backend" beta path.
- Required capabilities.
- Required skills.
- Required topics.
- Required tasks.
- Proof artifacts.
- Readiness thresholds.

Current substitute:

- Separate Senior Backend, AWS Solution Architect, Staff/Principal, and EM role roadmaps.
- Guided courses and bootcamps.

Why it matters:

- The current app is broad. Revised strategy wants one complete path before broadening.

## P1 Missing: Offer Readiness Workflow And State

Needed:

- Resume status.
- LinkedIn status.
- GitHub/portfolio proof status.
- Target company list.
- Referral/networking pipeline.
- Application tracker.
- Compensation target.
- Interview stage and follow-up tracker.

Current substitute:

- Career asset syllabus topics and answer builders.

Why it matters:

- The first-customer outcome includes a real 70-80+ LPA product/GCC outcome, not only learning.

## P1 Missing: Interview Attempt History And Round Scoring

Needed:

- Mock interview attempts by round.
- Score by round dimension.
- Feedback and improvement history.
- Pass threshold logic based on attempts.

Current substitute:

- Static interview round scores in `founder-success-experience.ts`.
- Topic-level saved evaluations.

Why it matters:

- Interview readiness must be separate from learning progress and based on performance evidence.

## P1 Missing: Proof-Of-Competency Tracking

Needed:

- Proof tasks attached to capabilities and topics.
- Proof status.
- Review rubric.
- Evidence artifact link or saved response.
- Reviewer/self-assessment status.

Current substitute:

- Review prompts, rubrics, explain-back attempts, enriched content capstones, and practice tasks.

Why it matters:

- The product promise is career transformation, not content consumption.

## P2 Missing: Canonical Model Cleanup

Needed:

- Decide canonical source for topic content.
- Reconcile legacy `/topics/[topicId]` and `/syllabus/[topicId]`.
- Reframe or rename course surfaces if they remain.
- Ensure all future features project from Master Syllabus and Capability Graph.

Current risk:

- New work could be added to `roadmaps.ts`, `topics.ts`, `guided-courses.ts`, or syllabus files inconsistently.

## Alignment Matrix

| Revised MVP Requirement | Current Status | Evidence | Gap |
| --- | --- | --- | --- |
| Current state profile | Partial | onboarding preferences and learner profile | Missing company/compensation/outcome fields |
| Target role selection | Exists | onboarding target role | Needs first beta path priority |
| Capability Graph | Missing | only role topic lists and learning graph | No capability/skill/proof model |
| Master Syllabus | Strong partial | `src/types/syllabus.ts`, `src/data/mock-syllabus.ts` | Needs capability/proof/readiness links |
| Roadmap Projection | Partial | `role-learning-roadmaps.ts`, `guided-courses.ts` | Topic-list projection, not capability projection |
| Today's Mission | Partial | `/today`, dashboard protocol | Static or first-incomplete-topic logic |
| Topic Readiness | Missing | completion and evaluation scores exist | No Knowledge/Practice/Interview/Implementation scores |
| Interview Readiness | Partial | `/interview-rounds`, answer builders | Static scores, no attempt model |
| Offer Readiness | Content only | career asset topics | No workflow/state/tracker |
| Proof of Competency | Partial | rubrics, capstones, explain-back | Not first-class or tied to capabilities |
| One complete beta path | Partial | several role paths | Needs one explicit complete founder path |
| Non-goals respected | Mixed | no billing/community; SaaS infra exists | Avoid further SaaS/UI expansion before core loop |

## Recommended Next Steps

1. Define the first beta path as a canonical data object.
   - Senior/Lead Backend -> AWS Solution Architect / Staff-ready Backend.
   - Include capabilities, skills, topics, tasks, proof, weights, and thresholds.

2. Add a Capability Graph model before more UI work.
   - Start with static TypeScript data.
   - Map existing syllabus topics to capabilities.

3. Add four-part topic readiness model.
   - Knowledge, Practice, Interview, Implementation.
   - Keep existing completion fields for compatibility.

4. Build a Daily Mission service.
   - Use target role, readiness gaps, weak areas, deadline, time budget, and revision queue.
   - Replace static `/today` recommendations with service output.

5. Separate readiness models.
   - Learning progress.
   - Topic readiness.
   - Capability readiness.
   - Interview readiness.
   - Offer readiness.

6. Reframe courses as projections.
   - Keep implementation if useful.
   - Avoid making courses the conceptual center.

7. Add offer-readiness state after topic/capability/interview readiness foundations.
   - Resume, LinkedIn, portfolio, target companies, referrals, applications, compensation, and follow-ups.

## What Should Not Be Built Next

- More UI redesigns.
- More broad role paths.
- More standalone course features.
- Billing, public SaaS admin, or community features.
- LeetCode sync.
- AI generation as a dependency for core content.
- More syllabus breadth before the first beta path is complete and proof-backed.

## Recommended Next Codex Task

Create a no-code data-model design doc for the first beta path:

```txt
docs/FIRST_BETA_PATH_MODEL.md
```

It should define the Senior/Lead Backend -> AWS Solution Architect / Staff-ready Backend path with capabilities, skills, syllabus topic mappings, task types, proof-of-competency artifacts, readiness thresholds, and Daily Mission input requirements.
