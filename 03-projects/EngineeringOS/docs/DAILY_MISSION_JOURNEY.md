# Daily Mission Journey

## Purpose

The daily UX starts from Today's Mission.

The product should answer: "Given my target role, weak areas, time available, and current readiness, what should I do today?"

## Strategy Anchor

- Product: Career Transformation Operating System for Engineers.
- Persona: 5-15 YOE engineers who are already working and need guided execution.
- First-customer outcome: help the founder/user make daily progress toward Solution Architect, Staff-level, Engineering Manager, FAANG-level readiness, and a 70-80+ LPA product/GCC outcome.
- MVP beta scope: reliable daily execution for one founder beta path.
- Build sequence: define mission inputs, choose deterministic mission rules, connect completion to readiness updates, then refine through manual testing.
- Do not build yet: generic dashboard analytics that do not decide the next action.

## Journey

```txt
Open EngineeringOS
  -> See Today's Mission
  -> Understand why this mission matters
  -> Execute learning/practice/interview/implementation task
  -> Submit proof or self-assessment
  -> Update readiness
  -> Receive next best action
```

## Mission Inputs

- Target role.
- Current level.
- Time available today.
- Roadmap stage.
- Capability blockers.
- Topic readiness scores.
- Revision needs.
- Interview deadlines.
- Offer-readiness gaps.
- Recent activity and streak.

## Mission Types

- Learn a high-priority topic.
- Practice a coding pattern.
- Implement a backend/design task.
- Run a mock interview drill.
- Repair a weak area.
- Build or update an offer-readiness artifact.
- Review and revise.

## Mission Card Requirements

Today's Mission should show:

- Mission title.
- Target capability.
- Reason this mission was selected.
- Estimated time.
- Required task.
- Completion criteria.
- Readiness dimension affected.
- Next action.

## Completion Feedback

Completing a mission should update:

- Topic readiness.
- Capability readiness.
- Interview readiness when relevant.
- Offer readiness when relevant.
- Revision queue.
- Next mission priority.

## Non-Goals

- A generic dashboard as the first experience.
- Dense analytics before the user knows what to do next.
- Mission suggestions that ignore target role.
- Daily tasks that cannot update readiness.

## MVP Rule

Today's Mission can start deterministic and rule-based. It does not need AI to be useful. Quality of mission selection matters more than visual polish.
