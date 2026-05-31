# Phase 44-45 Implementation Plan

## Purpose

Phase 44 and Phase 45 move EngineeringOS from a syllabus browser into a SaaS-style learning operating system for Senior Engineers, Solution Architects, Staff/Principal Engineers, and Engineering Managers.

- Phase 44: SaaS Learning UX Upgrade.
- Phase 45: Assessment and Evaluation Layer.

The goal is to make the app guide a learner through role selection, 80/20 prioritization, daily learning, topic mastery, mock assessment, and product-quality auditing.

## Phase 44 - SaaS Learning UX Upgrade

Status: complete for local/mock MVP, with production hardening still pending.

Delivered scope:

- Role onboarding entry points on `/dashboard`.
- Saved onboarding wizard on `/onboarding`.
- Local cookie-backed preferences for target role, current level, hours per week, deadline, weak areas, and learning mode.
- Dashboard readiness v2 with role/domain readiness and weighted assessment readiness.
- Dashboard "Start today's lesson" flow based on selected role and 80/20 path.
- `/syllabus` command center with search, table/card view, role focus, 80/20 focus, domain, difficulty, source-platform, and interview-frequency filters.
- `/syllabus/[topicId]` learning format with section anchors, sticky checklist, response forms, saved responses, rubric panels, mock interview, references, and runnable examples.
- `/quality` Product QA dashboard for quality-contract health, missing router domains, thin role paths, shallow topic watchlist, and strategic content coverage.
- Sidebar navigation for Onboarding and Product QA.

Primary files:

- `src/app/dashboard/page.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/syllabus/page.tsx`
- `src/app/syllabus/[topicId]/page.tsx`
- `src/app/quality/page.tsx`
- `src/components/onboarding/OnboardingWizardForm.tsx`
- `src/components/app-shell/Sidebar.tsx`
- `src/lib/services/onboarding-service.ts`
- `src/lib/services/product-quality-service.ts`
- `src/lib/services/assessment-readiness-service.ts`
- `src/types/learning-preferences.ts`

Remaining production hardening:

- Move preferences from cookie-only local state to authenticated database-backed profiles.
- Add saved filter presets and explicit sort controls.
- Add visual regression coverage for desktop and mobile layouts.
- Add stronger progress trend history instead of only current local/mock state.

## Phase 45 - Assessment and Evaluation Layer

Status: complete for local/mock MVP, with production hardening still pending.

Delivered scope:

- Automatic mock rubric scoring for syllabus responses.
- Evaluation history on syllabus topic pages.
- Timed mock interview sessions on syllabus topic pages.
- Local browser-side JavaScript runner for runnable syllabus examples and practice starter code.
- Weighted assessment readiness using role-path completion, core-domain balance, product QA health, and saved learning pace.
- Practice and syllabus pages now support a tighter learn, attempt, review, and improve loop.

Primary files:

- `src/lib/services/mock-assessment-service.ts`
- `src/lib/services/assessment-readiness-service.ts`
- `src/lib/actions/progress-actions.ts`
- `src/components/interview/TimedMockInterview.tsx`
- `src/components/practice/LocalCodeRunner.tsx`
- `src/app/syllabus/[topicId]/page.tsx`
- `src/app/practice/[taskId]/page.tsx`

Remaining production hardening:

- Replace heuristic mock scoring with calibrated rubric scoring and later AI-assisted evaluation.
- Persist full mock interview session reports, not only topic-level evaluation notes.
- Add evaluator confidence, score trends, and retry recommendations.
- Harden code execution with a safer sandbox before any production use.
- Add richer rubric dimensions per role: DSA correctness, HLD tradeoffs, AWS reliability/security/cost, LLD extensibility, Staff/EM communication.

## Acceptance Criteria

Phase 44 is accepted when:

- `/onboarding` saves learner preferences.
- `/dashboard` uses saved preferences to choose the active role path.
- `/dashboard` shows role readiness, domain readiness, product QA health, and weighted assessment readiness.
- `/syllabus` behaves like a command center, not a plain list.
- `/quality` gives a product/CEO/CTO-level view of roadmap and content health.

Phase 45 is accepted when:

- Syllabus responses are scored through the mock evaluator.
- Evaluation history appears on topic pages.
- Topic pages include rubric review and timed mock interview flows.
- Runnable JavaScript examples and practice starter code can be executed locally in the browser.
- Assessment readiness reflects learning progress and product-quality signals.

## Verification Commands

Run these commands after Phase 44/45 changes:

```txt
npm run test -- src/lib/quality src/lib/services/syllabus-service.test.ts src/lib/services/role-readiness-service.test.ts
npm run typecheck
npm run lint
npm run build
```

## Known Limitations

- This is still a local/mock implementation, not a production SaaS backend.
- Preferences are cookie-backed and are not user-account scoped.
- The local JavaScript runner is browser-side only and should be treated as a learning MVP, not a hardened execution sandbox.
- The mock evaluator is heuristic. It is useful for fast feedback but is not a substitute for calibrated human or AI assessment.
- Full interview reports, longitudinal scoring, and analytics-grade progress trends remain future work.

## Next Phase Recommendation

Phase 46 should be a final audit and hardening phase:

- Run a strict UI/UX audit across dashboard, onboarding, syllabus, topic, practice, and quality pages.
- Add Playwright or route smoke coverage for the new SaaS learning flows.
- Audit mobile responsiveness and text overflow.
- Re-run executive QA contracts and syllabus depth checks.
- Create the production-hardening backlog for auth, DB persistence, evaluator calibration, and safe code execution.
