# Founder Beta Manual Progress UI Plan

Date: 2026-06-05

## 1. Purpose

Plan the smallest local-only manual-progress draft UI for `/founder-beta`.

The goal is to let the founder adjust a few progress inputs in the browser and immediately see the Today Plan change through the existing founder beta facade.

This is not a persistence phase.

## 2. UX Scope

Add a compact manual input panel to `/founder-beta`.

The panel should:

- Be clearly labeled as local draft input.
- Live near the existing read-only plan, without redesigning the page.
- Update the rendered Today Plan immediately from local client state.
- Show validation warnings returned by the progress adapter.
- Preserve the existing default, demo, and weak-area query-param modes.

The page should still feel like a validation surface, not a finished product workflow.

## 3. Inputs Allowed

Only allow the smallest useful subset:

- Completed mission IDs.
- Completed topic IDs.
- Weak-area capability IDs.
- Weak-area topic IDs.
- Architect Readiness.
- AWS Readiness.
- Behavioral Readiness.
- Communication Readiness.
- Resume Readiness.
- Available minutes.
- Day mode: `weekday` or `weekend`.

Optional if still simple:

- Current mission ID.
- Manual proof score for one or two visible proof IDs.

## 4. What Must Stay Read-Only/Static

These remain read-only:

- Founder beta path.
- Capability graph.
- Master topics.
- Roadmap projection.
- Mission definitions.
- Readiness rules.
- Hard-gate thresholds.
- Proof score labels.
- Source catalog.
- Offer-readiness signals.
- Demo fixtures.

The UI may select IDs from these static objects, but it must not mutate them.

## 5. What Must Not Be Built Yet

Do not add:

- Prisma.
- Persistence.
- POST routes.
- Server actions.
- Save buttons.
- Auth or user ownership.
- AI evaluation.
- Scraping.
- Public beta workflows.
- `/today` migration.
- Full form-builder abstractions.
- Broad UI redesign.

## 6. Component Plan

Recommended components:

- `FounderBetaManualProgressPanel`
  - Client component.
  - Owns local draft progress input state.
  - Emits normalized/facade output to the page container or renders the derived plan locally.

- `FounderBetaPlanView`
  - Read-only presentational component extracted from the current `/founder-beta` page if needed.
  - Receives facade output.
  - Renders path, mission, readiness, hard gates, next actions, and warnings.

- `FounderBetaReadinessInputs`
  - Small grouped number inputs/sliders for the five hard-gate readiness scores.

- `FounderBetaProgressSelectors`
  - Simple checkbox groups for completed missions, completed topics, weak capabilities, and weak topics.

Keep extraction minimal. If the current page can stay readable with one client panel plus one read-only plan component, avoid deeper decomposition.

## 7. State Management Plan

Use local React state only.

Flow:

```txt
Initial fixture/query mode
→ local FounderBetaProgressInput state
→ founderBetaFacadeService.getFounderBetaPlanFromProgress(input)
→ render derived Today Plan
```

Rules:

- No localStorage.
- No cookies.
- No server state.
- No URL mutation after initial load.
- No debounce needed unless inputs become noisy.
- Keep the facade as the only plan-generation boundary.

Because the facade is deterministic and static-data only, it can be used from the client only if imports remain browser-safe. If any server-only import appears, add a small pure client-compatible projection helper instead of adding API writes.

## 8. Validation Behavior

Use the existing progress adapter behavior:

- Clamp proof scores to `0-5`.
- Clamp readiness scores to `0-100`.
- Deduplicate ID arrays.
- Ignore unknown IDs safely.
- Return validation warnings.

UI behavior:

- Show validation warnings in the existing warning area.
- Do not block rendering if warnings exist.
- Do not show success/save states.
- Make it clear that values are draft/local only.

## 9. Test Plan

Targeted tests only:

- Existing facade and contract tests should continue to pass.
- Add or update Playwright coverage for `/founder-beta`:
  - default mode still renders.
  - `?demo=1` still renders.
  - `?demo=weak-area` still renders.
  - changing one readiness input updates visible readiness/mission output if practical.
  - no save/post behavior appears.

Run:

```txt
npm run typecheck
npm run lint
npm run test -- src/lib/services/founder-beta-facade-service.test.ts src/lib/services/founder-beta-contract.test.ts
npm run test:e2e -- tests/e2e/founder-beta.spec.ts
```

## 10. Recommended Implementation Task

Recommended next task:

```txt
Add a minimal local-only FounderBetaManualProgressPanel to /founder-beta.
```

Implementation scope:

- Use `FounderBetaProgressInput`.
- Initialize from default/demo/weak-area modes.
- Use existing facade output as the rendered plan.
- Add only local client state.
- No persistence.
- No POST.
- No Prisma.
- No server actions.
- No redesign.

Success criterion:

Changing a small set of local manual inputs changes the Today Plan and readiness display in the browser, while refresh resets back to the selected query-param fixture.
