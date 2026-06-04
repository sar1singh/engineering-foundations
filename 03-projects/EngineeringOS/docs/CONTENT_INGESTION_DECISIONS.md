# Content Ingestion Decisions

Date: 2026-06-04

## Purpose

This document locks the final decisions from `docs/CONTENT_INGESTION_AND_SOURCE_MODEL.md`.

It is a short handoff for future planning sessions before `docs/FIRST_BETA_PATH_MODEL.md`.

## 1. Source Priority Tiers

Founder beta source priority is locked as:

- Tier 1 - Official / high-trust: AWS Well-Architected Framework, AWS official docs, MDN JavaScript / Web docs, Node.js official docs, PostgreSQL docs, Redis docs, Google SRE book. Kubernetes docs are later, not P0.
- Tier 2 - Market / roadmap validation: roadmap.sh backend roadmap, roadmap.sh system design / DevOps / AWS roadmaps, current job descriptions for Solution Architect, Staff Engineer, Lead Backend, and Engineering Manager.
- Tier 3 - Interview / practical prep: System Design Primer, ByteByteGo system design resources, Awesome System Design Resources, NeetCode / LeetCode topic lists, company engineering blogs.
- Tier 4 - Staff / EM / leadership: StaffEng, Staff Engineer's Path, Will Larson / Irrational Exuberance, engineering management frameworks.

## 2. Confidence Scoring Rules

A topic may enter the Master Syllabus if:

- It appears in at least 2 independent credible sources, or
- It appears in 1 official/high-trust source, or
- It appears repeatedly in current job descriptions for target roles.

Confidence bands:

- `>= 0.75`: approved.
- `0.50-0.74`: candidate / needs review.
- `< 0.50`: rejected or parked.

Scoring:

- Official docs / canonical book: `+0.40`.
- Recognized roadmap or repository: `+0.25`.
- Job description signal: `+0.25`.
- Interview-prep source: `+0.20`.
- Engineering blog: `+0.15`.
- Single weak source only: blocked unless manually approved by Sarwan.

## 3. Human Reviewer Rule

Sarwan is the human reviewer for beta-critical source mappings and founder beta path syllabus decisions.

AI/Codex can propose source-topic mappings, topic candidates, confidence scores, ranking reasons, and coverage reports. Beta-critical mappings are not final until Sarwan approves them.

## 4. Source Metadata Separation Rule

Source metadata must be stored separately from authored EngineeringOS content.

Sources are used for discovery, validation, topic extraction, coverage analysis, references, confidence scoring, and gap detection. EngineeringOS authored content remains original and must not copy source prose, proprietary problem statements, diagrams, editorials, or paywalled content.

## 5. Sources Navbar Rule

Every topic page must support a Sources Navbar.

The navbar should list mapped sources, reliability, source type, usage reason, priority, and exact links. Clicking a source should open the exact page, URL, repository path, docs page, article, video timestamp, roadmap page, or interview guide used for ingestion or validation.

## 6. Topic-Driven Resource Discovery Rule

Ingestion must not rely only on manually provided sources.

For every role, capability, skill, topic, weak area, and interview round, EngineeringOS must be able to perform topic-driven discovery before final topic extraction:

```txt
Role / Capability / Topic
  -> Generate search queries
  -> Search web/GitHub
  -> Collect candidate sources
  -> Rank sources
  -> Add to Source Catalog
  -> Extract topics
  -> Map topics to Master Syllabus
  -> Review
  -> Approve for beta or park for later
```

## 7. Resource Discovery Agent Responsibilities

The Resource Discovery Agent is responsible for discovering high-quality resources from role, capability, skill, topic, weak-area, or interview-round context.

Responsibilities:

- Search for top GitHub repositories.
- Search for official documentation.
- Search for public roadmaps.
- Search for engineering blogs.
- Search for interview guides.
- Search for books and canonical references.
- Search for videos/channels when relevant.
- Search for job market signals.
- Rank discovered sources.
- Add approved or candidate sources into the Source Catalog.
- Preserve exact URLs and repository paths.
- Mark source status as approved, candidate, rejected, or parked.
- Route beta-critical mappings to Sarwan for approval.

## 8. Seed GitHub / Source Examples

Initial candidate sources:

- `https://github.com/leonardomso/33-js-concepts`: JavaScript fundamentals and interview preparation.
- `https://github.com/denysdovhan/wtfjs`: JavaScript edge cases and tricky interview concepts.
- `https://github.com/goldbergyoni/nodebestpractices`: Node.js backend mastery, security, testing, architecture, and reliability.
- `https://github.com/ashishps1/awesome-system-design-resources`: HLD, distributed systems, and architecture interview preparation.
- `https://github.com/NikAshanin/Solution-Architect-Road-Map`: cloud architecture and Solution Architect readiness.

These are candidates, not automatic beta approvals.

## 9. Mock-File-To-DB Migration Principle

The MVP may remain file-based, but every source, topic-source mapping, ingestion run, capability mapping, and coverage report should be designed as if it will later migrate to Postgres.

Future file areas may include:

- `src/data/sources/`
- `src/data/ingestion/`
- `src/data/capabilities/`
- `src/data/readiness/`
- `src/data/roadmaps/projections/`

Do not create these files until implementation is explicitly requested.

## 10. Intentionally Deferred

Deferred until later:

- Application code implementation.
- UI changes.
- Scraping or crawling.
- Ingestion scripts.
- Database migrations.
- Automated source refresh.
- Public SaaS source-management workflows.
- AI-authored syllabus ingestion without Sarwan review.
- Kubernetes as P0 for the founder beta source set.
- Treating candidate GitHub sources as beta-approved without review.

## Next Planning Artifact

The next planning document is:

```txt
docs/FIRST_BETA_PATH_MODEL.md
```

It should define the Senior/Lead Backend -> AWS Solution Architect / Staff-ready Backend founder beta path using these ingestion decisions.
