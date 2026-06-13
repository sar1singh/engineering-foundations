# Autonomous Discovery Agent V1

Status: Pack 12A complete.

## Purpose

Allow EngineeringOS to discover content candidates without manual URL entry while preserving the existing human-review and no-write safety boundaries.

## Source Model

Discovery starts from deterministic static seeds:

- `src/data/discovery-seeds/system-design-seeds.ts`
- `src/data/discovery-seeds/aws-seeds.ts`
- `src/data/discovery-seeds/backend-seeds.ts`

Each seed includes:

- title
- URL
- source type
- category
- tags

No scraping, crawling, live search, or autonomous HTTP discovery is used.

## Service

File:

- `src/lib/services/autonomous-discovery-agent.ts`

Functions:

- `runAutonomousDiscovery()`
- `discoverCandidatesFromSeeds()`
- `deduplicateDiscoveryCandidates()`
- `buildDiscoverySummary()`

## Pipeline

Every selected seed flows through the existing Pack 11B pipeline:

```txt
Validation Agent
        |
Metadata Agent
        |
Candidate Agent
        |
Duplicate Agent
        |
Review Agent
```

The agent does not bypass validation, duplicate detection, or review.

## Output

The result contains reviewable candidates with:

- seed metadata
- duplicate status
- review-required status
- pipeline result
- full trace
- queue summary
- `graphWrites = 0`

## UI

Route:

- `/founder-beta/autonomous-discovery`

Component:

- `AutonomousDiscoveryPreview.tsx`

Capabilities:

- select categories
- run autonomous discovery
- view discovered candidates
- view duplicate status
- view review-required status
- view queue summary
- view trace

The UI states:

- "Autonomous discovery does not modify the graph."

No approval, apply, publish, or graph-write control exists.

## Safety

Pack 12A does not:

- mutate canonical graph files
- create approved imports
- apply patches
- publish content
- persist to a database
- use Prisma, auth, SaaS, deployment, scraping, crawling, or AI evaluation

## Next

Pack 12B: Multi-Source Discovery Agents.
