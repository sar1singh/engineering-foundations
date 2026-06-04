# Capability Graph Model

## Purpose

The Capability Graph is the core engine of EngineeringOS.

It models what an engineer must be able to do for a target role. Courses, lessons, practice tasks, and interview drills are delivery surfaces over the graph, not the product core.

## Strategy Anchor

- Product: Career Transformation Operating System for Engineers.
- Persona: 5-15 YOE engineers moving from Software/Senior/Lead roles toward Senior, Staff, Principal, Architect, or Engineering Manager outcomes.
- First-customer outcome: help the founder/user reach Solution Architect, Staff-level, Engineering Manager, FAANG-level readiness, and a 70-80+ LPA product/GCC outcome.
- MVP beta scope: one complete founder path before broad role expansion.
- Build sequence: define graph schema, map first beta path, connect graph gaps to daily missions and readiness scoring.
- Do not build yet: generic course catalogs, broad incomplete graphs, or UI-only graph views.

## Graph Shape

```txt
Target Role
  -> Capability
    -> Skill
      -> Topic
        -> Task
          -> Proof of Competency
```

## Core Entities

- `TargetRole`: The desired outcome, such as Staff Engineer, Solution Architect, Engineering Manager, or Senior Backend Engineer.
- `Capability`: A role-level ability, such as design scalable systems, lead architecture reviews, solve DSA patterns, or operate AWS workloads.
- `Skill`: A concrete sub-ability needed for a capability.
- `Topic`: A teachable unit from the Master Syllabus.
- `Task`: A practice, implementation, design, interview, or artifact task.
- `ProofOfCompetency`: Evidence that the learner can perform, explain, and apply the topic under role-realistic conditions.

## Relationship Types

- `requires`: Prerequisite dependency.
- `supports`: Topic or skill contributes to a capability.
- `blocks`: A missing topic prevents readiness for a higher-level capability.
- `reinforces`: Practice strengthens an already introduced topic.
- `proves`: Task or artifact demonstrates competency.

## Capability Status

Each capability should expose:

- Current readiness.
- Blocking skills.
- Weak topics.
- Required proof tasks.
- Interview exposure.
- Implementation exposure.
- Next mission candidate.

## Data Requirements

Each capability should include:

- Stable ID and slug.
- Target roles served.
- Seniority level.
- Required skills.
- Required topics.
- Required proof tasks.
- Interview relevance.
- Offer relevance.
- Weight for target role readiness.

## Non-Goals

The graph should not become:

- A visual-only roadmap.
- A course catalog.
- A huge unweighted topic dump.
- A generic dependency graph without target-role weights.

## MVP Rule

For beta, model fewer capabilities deeply. The first beta path should have enough graph quality to drive daily missions and readiness decisions.
