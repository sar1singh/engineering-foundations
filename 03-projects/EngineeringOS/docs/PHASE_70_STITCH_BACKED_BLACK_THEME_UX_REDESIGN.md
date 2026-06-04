# Phase 70: Stitch-Backed Black Theme UX Redesign

## Intent

Phase 70 replaces the light/glass hybrid feel with a black, cyber-noir EngineeringOS interface based on the Stitch design set.

The product modes are:

- Mission Control: dashboard, daily protocol, resume course, readiness telemetry, weak-area repair.
- Blueprint Roadmap: courses, role paths, graph canvas, stage clusters, progress states.
- Focus Engine: topic learning, practice, code runner, interview review, source references.

## Stitch Screens Used

- `mission_control_dashboard`
- `blueprint_roadmap_overview`
- `cluster_detail_drawer`
- `focus_engine_dsa_workspace`
- `focus_engine_hld_workspace`
- `source_references_panel`
- `readiness_cockpit`

## Implementation Checklist

- Make the black theme the default product surface.
- Add reusable command, blueprint, focus, telemetry, source, and repair-state UI classes.
- Replace the large sidebar with a compact OS rail and grouped route matrix.
- Convert the header into a black command bar.
- Move dashboard first viewport toward Mission Control.
- Move graph and course journeys toward Blueprint Roadmap.
- Move topic/practice pages toward Focus Engine.
- Add reusable source references panel with clickable public referral links.
- Keep existing data contracts, local/mock auth, AWS-first scope, and browser-only code runner safety.

## Validation

Required commands:

- `npm run typecheck`
- `npm run lint`
- `npm run test -- src/lib/quality src/components/practice`
- `npm run build`
- `npm run smoke:mock`
- `npm run smoke:prisma`
- `npm run test:e2e`

## Completion Notes

Phase 70 is complete as an implementation phase.

Completed:

- Default black cyber-noir visual system.
- Minimal OS rail and command-bar shell.
- Mission Control dashboard first viewport.
- Blueprint Roadmap graph and course journey treatment.
- Focus Engine topic and practice surfaces.
- Source reference drawer/cards with clickable external referrals.
- Phase 70 quality and Playwright coverage.

Product success still depends on founder manual testing after the redesigned screens are used in a real learning week.
