# Next MVP Build Sequence

## Current Strategic Direction

EngineeringOS is now positioned as a Career Transformation Operating System for Engineers.

The next build work should optimize the core transformation loop, not add unrelated features.

## Strategy Anchor

- Persona: 5-15 YOE engineers moving from Software/Senior/Lead roles toward Senior, Staff, Principal, Architect, Engineering Manager, product/GCC, or FAANG-level outcomes.
- First-customer outcome: help the founder/user reach Solution Architect, Staff-level, Engineering Manager, FAANG-level readiness, and a 70-80+ LPA product/GCC outcome.
- MVP beta scope: one complete founder path before broad role expansion.
- Data model: Master Syllabus -> Capability Graph -> Roadmap Projection -> Daily Mission -> Readiness Scores.
- Scoring model: Knowledge, Practice, Interview, and Implementation scores roll into capability readiness while interview readiness and offer readiness stay separate.

## Sequence

1. Documentation strategy reset.
   - Update product docs with the revised strategy.
   - Mark older course/dashboard-first assumptions as superseded.

2. Content and model audit.
   - Audit current data against the Master Syllabus model.
   - Identify duplicated course/roadmap structures.
   - Identify the first beta path coverage gaps.

3. Content ingestion planning.
   - Complete `docs/CONTENT_INGESTION_AND_SOURCE_MODEL.md`.
   - Lock final ingestion decisions in `docs/CONTENT_INGESTION_DECISIONS.md`.
   - Use source priority tiers, confidence gates, Sarwan review, source/content separation, Sources Navbar, and topic-driven discovery as prerequisites for beta path design.

4. First beta path model.
   - Create `docs/FIRST_BETA_PATH_MODEL.md`.
   - Define the Senior/Lead Backend -> AWS Solution Architect / Staff-ready Backend path.
   - Pick required capabilities, skills, syllabus topics, source coverage, tasks, proof artifacts, readiness thresholds, and Daily Mission inputs.

5. Canonical model alignment.
   - Align data types to Master Syllabus, Capability Graph, Roadmap Projection, Daily Mission, and Readiness Scoring.
   - Preserve existing working routes while improving model clarity.

6. Topic readiness implementation.
   - Add Knowledge, Practice, Interview, and Implementation scores.
   - Keep learning progress separate from readiness.

7. Today's Mission logic.
   - Make the first screen mission-first.
   - Select missions from target role, roadmap, readiness gaps, and time budget.

8. Interview readiness separation.
   - Add role-specific interview readiness categories.
   - Track mock interview performance separately from topic study.

9. Offer readiness separation.
   - Track resume, LinkedIn, portfolio, referrals, target companies, applications, compensation target, and follow-ups.

10. Beta content completion.
   - Deepen the highest-ROI beta path topics.
   - Add proof tasks and rubrics before expanding breadth.

11. Founder manual beta.
   - Run the system daily for 2-4 weeks.
   - Record friction, readiness changes, missed missions, and content gaps.

## Do Not Build Yet

- New public SaaS features.
- Billing.
- Community features.
- Large role expansion.
- More UI redesigns before the mission/readiness loop is credible.
- AI generation as a dependency for core content quality.
- LeetCode sync as a central product pillar.

## Recommended Next Codex Task

Create `docs/FIRST_BETA_PATH_MODEL.md` using the locked ingestion decisions. Define the Senior/Lead Backend -> AWS Solution Architect / Staff-ready Backend founder beta path before implementing code changes.
