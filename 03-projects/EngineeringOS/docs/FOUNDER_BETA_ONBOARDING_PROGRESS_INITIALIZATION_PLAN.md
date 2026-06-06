# Founder Beta Onboarding Progress Initialization Plan

Date: 2026-06-05

## Goal

Plan how founder onboarding initializes saved progress, readiness estimates, weak areas, available time, target role, and the derived Today Plan.

This is a planning document only. It does not implement UI, Prisma, server actions, AI evaluation, scraping, or source ingestion.

## 1. Onboarding Inputs

Founder Beta onboarding should collect the smallest set of inputs needed to initialize the persisted progress input and generate a useful Today Plan.

Required inputs:

- Current experience level.
- Current role.
- Target role.
- Primary target compensation band.
- Available hours per week.
- Typical weekday available minutes.
- Typical weekend available minutes.
- Weak capability areas.
- Weak topic areas, if known.
- Manual readiness estimates for:
  - Architect Readiness.
  - AWS Readiness.
  - Behavioral Readiness.
  - Communication Readiness.
  - Resume Readiness.
- Completed or familiar topics, if the founder wants to skip known material.
- Completed proof/case-study artifacts, if any.
- Preferred mission types, if needed for early calibration.

Optional later inputs:

- Application deadline.
- Target company types.
- Interview pipeline stage.
- Referral/outreach state.
- Resume/LinkedIn/GitHub/portfolio status.
- Diagnostic question answers.

## 2. Default Founder Profile

Default founder profile should be used when no saved progress exists.

Default profile:

- User identity: `founder-local`.
- Current experience: 10+ years backend experience.
- Current role: Senior/Lead Backend Engineer.
- Primary target role: Solution Architect.
- Secondary support: EM-aware Lead Backend.
- Tertiary support: Engineering Manager awareness only.
- Current compensation: approximately 40 LPA.
- Floor target: 60 LPA.
- Target outcome: 70-80 LPA.
- Stretch outcome: 90+ LPA.
- Default roadmap: `founder-architect-beta-16-week`.
- Default timeline: 16 weeks.
- Default hours per week: 10.
- Default day mode: weekday.
- Default available minutes: 60.

The default profile should not imply evaluated readiness. It only provides enough context to produce a first Today Plan.

## 3. Progress Initialization

Onboarding initializes normalized founder beta progress input, not derived outputs.

Safe fields to initialize:

- `completedMissionIds`
- `skippedMissionIds`
- `completedTopicIds`
- `weakAreaCapabilityIds`
- `weakAreaTopicIds`
- `manualReadinessScores`
- `proofScores`
- `availableMinutes`
- `dayMode`
- `preferredMissionTypes`

Initial progress should be conservative:

- Empty completed mission list unless the founder explicitly marks work complete.
- Empty skipped mission list.
- Completed topic IDs only from explicit founder input or diagnostic mapping.
- Weak areas from onboarding selections.
- Available minutes from onboarding schedule.
- Day mode from onboarding session context or default weekday.

The initialized progress object must be passed through the existing progress adapter before persistence or Today Plan generation.

## 4. Readiness Initialization

Readiness initialization should use manual draft estimates only.

Initial readiness inputs:

- Architect Readiness.
- AWS Readiness.
- Behavioral Readiness.
- Communication Readiness.
- Resume Readiness.

Rules:

- Clamp values to `0-100`.
- Treat missing values as unknown/default, not as evaluated failure.
- Clearly label these values as manual draft estimates.
- Do not present them as final readiness scores.
- Do not use onboarding estimates to bypass proof requirements or hard gates.

Future diagnostic answers may translate into initial readiness estimates, but that should remain explainable and reviewable.

## 5. Weak-Area Initialization

Weak areas should be initialized from:

- Founder self-assessment.
- Known target-role gaps.
- Optional diagnostic answers.
- Current path assumptions for Lead Backend -> Solution Architect transition.

Initial weak-area categories should focus on:

- System Design / HLD.
- AWS / Cloud Architecture.
- Behavioral & Communication.
- Resume/Career Assets.
- Architecture Case Studies.
- Database scaling and indexing, if selected.
- Node.js production architecture, if selected.

Weak areas should affect mission selection by increasing priority for repair, practice, implementation, and interview missions.

Weak-area initialization should not automatically reduce readiness unless the readiness service explicitly derives a gap from evidence.

## 6. Relationship To Persisted Progress

Persisted founder beta progress remains the source of manual progress input after onboarding.

Onboarding may create a first saved progress record only when no record exists for `founder-local`.

If a saved record already exists:

- Onboarding must load it.
- Onboarding must not overwrite it silently.
- Any reset/reinitialize action must be explicit.
- The user must be able to keep existing saved progress.

Persistence remains limited to normalized progress input. The existing repository/service boundary should remain responsible for save, load, update, and reset behavior.

## 7. What Remains Derived

These must remain derived from persisted progress plus static founder beta data:

- Today Plan.
- Readiness snapshot.
- Hard gate status.
- Roadmap summary.
- Primary mission.
- Optional missions.
- Next recommended actions.
- Offer readiness signals.
- Mission selection reasons.

Onboarding should never store these outputs as canonical state.

## 8. What Must Not Overwrite Saved Progress

Onboarding must not silently overwrite:

- Completed mission IDs.
- Completed topic IDs.
- Existing weak-area selections.
- Manual readiness scores.
- Proof scores.
- Preferred mission types.
- Available minutes and day mode, unless the founder confirms schedule update.
- Any future persisted diagnostic or profile fields.

Overwrite rules:

- First run with no saved progress: initialize defaults and save only after explicit confirmation.
- Existing saved progress: show existing values and allow explicit update.
- Reset/reinitialize: separate explicit action, not part of normal onboarding completion.

## 9. Future UI Plan

Smallest UI path:

1. Add an onboarding/internal setup surface for founder beta initialization.
2. Prefill the default founder profile.
3. Show target role and timeline as editable but preselected.
4. Collect available time and day mode.
5. Collect weak areas using friendly capability/topic labels.
6. Collect manual draft readiness estimates.
7. Preview the derived Today Plan before saving.
8. Save only normalized progress input.
9. Redirect or link to `/founder-beta`.

UI principles:

- Keep it short.
- Avoid fake precision.
- Use clear "manual draft" language.
- Preserve the existing local persistence contract.
- Do not redesign the product shell.

## 10. Implementation Phases

Phase 1: Planning and contract alignment.

- Confirm onboarding input fields map to existing progress adapter input.
- Identify any profile fields that are not yet represented in persisted progress.
- Decide whether profile fields stay static defaults or need a separate future profile record.

Phase 2: Read-only initialization preview.

- Build a no-save preview path that converts onboarding draft input into a derived Today Plan.
- Reuse the existing progress adapter and facade.

Phase 3: Explicit local save.

- Save normalized progress input only.
- Do not persist derived Today Plan outputs.
- Preserve existing saved progress unless the founder confirms overwrite.

Phase 4: Persisted-load integration.

- Load saved progress into onboarding when present.
- Show clear state: new setup, existing saved progress, or reset/reinitialize.

Phase 5: Diagnostics later.

- Add 10-20 diagnostic questions only after the simple onboarding flow is stable.
- Map diagnostic answers to weak areas, readiness estimates, and first mission recommendations.

Phase 6: Profile expansion later.

- Add target compensation, company type, application timeline, and offer-readiness profile fields only when they are needed by mission selection or readiness gating.

## Recommended Next Implementation Task

Implement Founder Beta onboarding initialization preview using local draft state only.

Scope:

- No Prisma.
- No new persistence fields unless required.
- No server actions at first.
- Reuse progress adapter and facade.
- Preview Today Plan before save.
