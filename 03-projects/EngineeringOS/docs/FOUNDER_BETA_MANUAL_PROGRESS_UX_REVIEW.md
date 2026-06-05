# Founder Beta Manual Progress UX Review

Date: 2026-06-05

## Purpose

Review whether the `/founder-beta` local manual progress panel is usable enough before adding persistence.

Verdict:

```txt
Usable enough for internal validation.
Not ready for persistence yet.
```

## 1. Is The Manual Panel Understandable?

Partially yes.

The panel has a clear purpose: change local draft inputs and watch the Today Plan update. The `Manual Progress Draft` heading and `Local input sandbox` copy help frame it as an internal validation tool.

Remaining issue:

- The panel is still data-model oriented. Fields like completed mission IDs and weak-area capability IDs make sense to the builder, but not yet to a normal user.
- Mission labels are long because they use mission objectives directly.

Before persistence, the controls should be made more human-readable without changing the underlying adapter/facade model.

## 2. Is "Local Draft Only" Clear?

Yes for internal validation.

The `Local draft only` badge and copy saying "Changes update this page only. Nothing is saved." are enough to prevent accidental assumptions during internal testing.

Before persistence, keep this label visible. After persistence exists, it should be replaced with explicit save/sync state, but not before.

## 3. Are Controls Minimal Enough?

Mostly yes.

Current controls are limited to:

- Available minutes.
- Day mode.
- Architect Readiness.
- AWS Readiness.
- Behavioral Readiness.
- Resume Readiness.
- Weak-area capabilities.
- Completed missions.

This is small enough to validate the input shape without building a full progress product.

Possible improvement before persistence:

- Add Communication Readiness because it is a hard gate.
- Keep topic-level weak areas out unless needed for validation.
- Keep proof scores out until proof rubrics are visible.

## 4. Does It Avoid Fake Authority Around Readiness Scores?

Partially.

The local draft framing helps, but readiness numbers still look precise. A user could interpret `72%` or `58%` as a real assessment rather than a manual test value.

Before persistence:

- Label readiness inputs as manual estimates.
- Keep hard-gate explanations visible.
- Avoid storing or promoting these values as real readiness until they are backed by proof, mission history, or reviewed artifacts.

Do not call these scores "final", "verified", or "application ready" yet.

## 5. Does It Still Support The Today Mission Workflow?

Yes.

The panel recalculates the visible Primary Mission, optional missions, readiness snapshot, hard-gate status, and next actions through the existing facade. That preserves the intended model:

```txt
manual progress input
→ adapter
→ facade
→ Today Plan
```

The page still starts from the plan outcome rather than becoming a generic settings page. This is important.

Risk:

- If the manual panel grows too large, it can distract from Today's Mission. Keep it compact and validation-focused.

## 6. What Should Be Improved Before Persistence?

Recommended improvements:

- Add Communication Readiness to the manual readiness controls because it is one of the hard gates.
- Improve labels for completed missions so the list is easier to scan.
- Add short helper text that readiness scores are manual estimates.
- Show validation warnings near the panel as well as near the output.
- Consider grouping controls into:
  - Time.
  - Readiness estimates.
  - Weak areas.
  - Completed missions.

Do not add persistence until these improvements are reviewed in actual use.

## 7. What Should Not Be Built Yet?

Do not build:

- Prisma persistence.
- Save buttons.
- POST routes.
- Server actions.
- Auth/user ownership.
- AI evaluation.
- Scraping/source refresh.
- Proof submission workflows.
- Offer pipeline tracker.
- `/today` migration.
- Full dashboard redesign.
- Complex form builder.

Persistence should come only after the founder confirms that the local input fields are the right ones.

## Recommended Next Implementation Task

Add one small local-only UX refinement:

```txt
Add Communication Readiness to FounderBetaManualProgressPanel and add helper copy that readiness values are manual estimates.
```

Keep scope:

- No persistence.
- No POST.
- No Prisma.
- No server actions.
- No redesign.
