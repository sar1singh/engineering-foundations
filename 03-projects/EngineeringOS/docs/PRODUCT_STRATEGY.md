# EngineeringOS Product Strategy

## Product Definition

EngineeringOS is a Career Transformation Operating System for Engineers.

It is not just a course app, roadmap app, notes app, dashboard app, or LeetCode clone. It is a guided execution system that converts a working engineer's current state into a target-role readiness plan, daily missions, competency evidence, interview readiness, and offer readiness.

The core product loop is:

```txt
Current State
  -> Target Role
  -> Capability Graph
  -> Roadmap Projection
  -> Daily Missions
  -> Topic Readiness
  -> Interview Readiness
  -> Offer Readiness
```

## Target Persona

Primary persona:

- 5-15 YOE software engineers.
- Current role: Software Engineer, Senior Engineer, or Lead Engineer.
- Target role: Senior, Staff, Principal, Solution Architect, or Engineering Manager.
- Goal: high-paying product company, GCC, or FAANG-level readiness.
- Constraint: limited time, already employed, and needs guided execution, accountability, and practical roadmap quality.

## First Customer

The first customer is the founder/user.

The first-customer success outcome is whether EngineeringOS helps the founder move from current Senior/Lead backend engineer level toward Solution Architect, Engineering Manager, Staff-level, FAANG-level readiness, and a 70-80+ LPA product/GCC outcome.

Founder success is measured by real readiness gains, not feature count.

## Strategic Decisions

1. Capability Graph is the core engine, not courses.
2. Master Syllabus is the canonical source of truth.
3. Role-based roadmaps are projections from the Master Syllabus.
4. Roadmap structure is: Target Role -> Capabilities -> Skills -> Topics -> Tasks -> Proof of Competency.
5. Daily UX starts from Today's Mission, not a generic dashboard.
6. Topic completion requires Knowledge Score, Practice Score, Interview Score, and Implementation Score.
7. Learning progress and interview/offer readiness are separate.
8. MVP priority is content, guided journey, syllabus, and roadmap quality.
9. One complete beta path is better than a huge incomplete syllabus.
10. UI polish comes after the core learning/readiness loop works.

## MVP Beta Scope

The beta MVP should prove one complete transformation path before broadening.

Recommended first beta path:

```txt
Senior/Lead Backend Engineer
  -> AWS Solution Architect / Staff-ready Backend Engineer
  -> Product/GCC/FAANG-level interview readiness
```

The path must include:

- Current-state profile.
- Target-role selection.
- Capability graph.
- Master syllabus mapping.
- Roadmap projection.
- Today's Mission.
- Topic readiness scoring.
- Interview readiness tracking.
- Offer-readiness artifacts.
- Proof-of-competency tasks.

## Data And Content Model

- Master Syllabus is the canonical content source.
- Capability Graph maps target roles to capabilities, skills, topics, tasks, and proof.
- Roadmap Projection creates target-role paths from the Master Syllabus.
- Daily Mission uses roadmap position, weak areas, time budget, and readiness gaps.
- Readiness scoring separates topic, capability, interview, and offer readiness.

## Build Sequence

1. Lock product strategy and model docs.
2. Audit existing data and routes against the revised model.
3. Complete the first beta path.
4. Implement four-part topic readiness.
5. Make Today's Mission the primary daily workflow.
6. Separate interview readiness and offer readiness.
7. Run founder manual beta before broadening.

## Non-Goals

Do not prioritize these before the core loop works:

- Large course marketplace.
- Generic note-taking.
- Generic dashboard analytics.
- Social/community features.
- Billing.
- Public SaaS admin workflows.
- AI-generated content without reviewed syllabus quality.
- LeetCode sync as a primary value proposition.
- UI redesigns that do not improve the learning/readiness loop.

## What Should Not Be Built Yet

- More role paths before one beta path is complete.
- More syllabus breadth before high-ROI topics have deep tasks, rubrics, and proof.
- Generic course cards that do not map to capabilities.
- Interview readiness as a single blended progress percentage.
- Offer readiness mixed into topic completion.
- Public multi-user SaaS workflows before founder validation.
