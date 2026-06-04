# Content Ingestion And Source Model

Date: 2026-06-04

## Purpose

This document defines the foundational content ingestion and source architecture for EngineeringOS.

It must be completed before Beta Path design, Capability Graph design, and Master Syllabus implementation because every later model depends on trustworthy, traceable, source-backed topic discovery.

EngineeringOS is a Career Transformation Operating System for Engineers. Its core engine is:

```txt
Current State
  -> Target Role
  -> Capability Graph
  -> Roadmap Projection
  -> Daily Missions
  -> Topic Readiness
  -> Interview Readiness
  -> Offer Readiness
```

The first customer is the founder. The target outcome is:

```txt
Senior/Lead Backend Engineer
  -> Solution Architect / Staff-ready Backend / Engineering Manager readiness
  -> 70-80+ LPA product company / GCC / FAANG-level outcome
```

EngineeringOS must eventually support Senior Backend, Lead Backend, Staff Engineer, Principal Engineer, Solution Architect, and Engineering Manager paths. The Master Syllabus must become the canonical source of truth, and role-specific roadmaps must later derive from it.

## 1. Ingestion Philosophy

## Why Ingestion Exists

Ingestion exists to make the Master Syllabus complete, current, source-backed, and maintainable without manually inventing every topic from scratch.

The engineering career market changes quickly. A useful 2026 syllabus must reflect:

- Hiring expectations from product companies, GCCs, and FAANG-style loops.
- Modern backend, cloud, architecture, AI, security, observability, and leadership expectations.
- Publicly visible roadmaps, official docs, interview guides, repositories, and engineering practices.
- Gaps between what engineers study and what interviews/jobs actually test.

Ingestion is not the final learning experience. It is the research and validation layer that feeds original EngineeringOS content.

## Discovery vs Authored Content

EngineeringOS stores source metadata separately from authored EngineeringOS content.

Source material is used for:

- Discovery.
- Validation.
- Topic extraction.
- Coverage analysis.
- Reference links.
- Confidence scoring.
- Gap detection.

Source material is not copied into EngineeringOS as final authored content.

EngineeringOS content remains original:

- Original explanations.
- Original sequencing.
- Original examples where possible.
- Original practice variants.
- Original rubrics.
- Original proof-of-competency tasks.
- Source references and attribution links.

## Coverage Goals

The ingestion system must eventually cover:

- JavaScript.
- TypeScript.
- Node.js.
- Backend Engineering.
- Databases.
- System Design.
- Distributed Systems.
- AWS.
- DevOps.
- Security.
- Observability.
- Staff Engineering.
- Engineering Management.
- Career Assets.
- Interview Preparation.

Coverage is role-driven, not encyclopedia-driven. The goal is not to ingest everything on the internet. The goal is to discover enough high-quality source signal to build role-ready capability paths.

## Quality Goals

Every high-ROI topic should have:

- Multiple traceable source references where possible.
- At least one primary or high-confidence validation source.
- Clear role relevance.
- Clear capability relevance.
- Practical learning value.
- Interview relevance when applicable.
- Implementation or proof potential.
- Current enough source context for 2026 expectations.

## Ownership Model

The ingestion system proposes and validates. EngineeringOS owns the final authored content.

Recommended ownership boundaries:

- Ingestion agents discover, extract, map, and score source signal.
- Content authoring agents draft original EngineeringOS content from topic briefs and references.
- Quality review agents validate coverage, accuracy, originality, and role usefulness.
- Sarwan is the human reviewer for beta-critical source mappings and canonical syllabus changes on the founder beta path.
- AI/Codex may propose source-topic mappings, confidence scores, topic candidates, and coverage reports, but Sarwan must approve beta-critical mappings before they enter the founder beta path.

## 2. Source Types

EngineeringOS should support these source categories.

| Source Type | Purpose | Examples |
| --- | --- | --- |
| `official-docs` | Primary technical truth | MDN, Node.js docs, PostgreSQL docs, AWS docs, Redis docs |
| `aws-docs` | AWS service and architecture validation | AWS Documentation, Well-Architected Framework, AWS Architecture Center |
| `github-repository` | Code, roadmaps, examples, curated lists | System Design Primer, Tech Interview Handbook, TheAlgorithms |
| `engineering-blog` | Production practice and case studies | Netflix, Uber, Meta, Amazon, Stripe, Cloudflare engineering blogs |
| `company-engineering-blog` | Real production architecture signal | AWS Builders Library, Google SRE, Shopify engineering |
| `article` | Focused explanations and references | Deep technical blog posts, architecture articles |
| `roadmap` | Topic sequencing and role coverage | roadmap.sh, public backend/cloud/system design roadmaps |
| `book` | Durable conceptual foundation | Designing Data-Intensive Applications, Staff Engineer, Accelerate |
| `interview-guide` | Round structure and prep expectations | Tech Interview Handbook, company interview guides |
| `practice-platform` | Problem discovery and pattern mapping | LeetCode, NeetCode, HackerRank, Educative references |
| `youtube-channel` | Visual explanation and current prep signal | AWS official, Gaurav Sen, ByteByteGo, conference talks |
| `podcast` | Staff/EM/career judgment | Engineering leadership podcasts, StaffEng conversations |
| `job-description` | Hiring-market requirements | Product/GCC/FAANG job posts for target roles |
| `career-framework` | Seniority expectations | StaffEng, company engineering ladders, manager rubrics |
| `staff-engineering-resource` | Staff/principal growth | StaffEng, Will Larson, technical strategy references |
| `architecture-reference` | Design patterns and tradeoffs | AWS Architecture Center, Google SRE, microservices references |
| `standard-or-spec` | Protocol/API correctness | HTTP specs, OAuth/OIDC specs, OpenAPI |
| `conference-talk` | Modern production practice | QCon, re:Invent, Strange Loop, KubeCon |
| `course-or-training` | Topic discovery only | Public course outlines, certification guides |

The source taxonomy should remain extensible. Every source type should still map into the same canonical `Source` model.

## Founder Beta Source Priority

The founder beta path should approve sources in this order.

## Tier 1 - Official / High-Trust

Use these first for validation and canonical technical truth:

- AWS Well-Architected Framework.
- AWS official docs.
- MDN JavaScript / Web docs.
- Node.js official docs.
- PostgreSQL docs.
- Redis docs.
- Google SRE book.
- Kubernetes docs later, not P0.

## Tier 2 - Market / Roadmap Validation

Use these to validate modern role expectations, sequencing, and coverage:

- roadmap.sh backend roadmap.
- roadmap.sh system design, DevOps, and AWS-related roadmaps.
- Current job descriptions for Solution Architect, Staff Engineer, Lead Backend, and Engineering Manager.

## Tier 3 - Interview / Practical Prep

Use these to validate interview patterns, practical prep sequencing, and high-frequency practice:

- System Design Primer.
- ByteByteGo system design resources.
- Awesome System Design Resources.
- NeetCode / LeetCode topic lists.
- Company engineering blogs.

## Tier 4 - Staff / EM / Leadership

Use these to validate seniority, leadership, Staff, Principal, and EM readiness:

- StaffEng.
- Staff Engineer's Path.
- Will Larson / Irrational Exuberance.
- Engineering management frameworks.

Tier 1 sources can approve or validate a topic by themselves when the topic is directly covered. Tier 2-4 sources are strongest when they reinforce each other or validate role demand.

## Topic-Driven Resource Discovery

The ingestion model must not only start from known sources.

It must also support topic-driven discovery. For every role, capability, skill, topic, weak area, and interview round, the system should be able to search the internet for the best available learning and interview resources.

Topic-driven discovery should happen before final topic extraction. The system should not rely only on manually provided sources. It should expand from seed examples using search queries, GitHub discovery, official docs, job descriptions, engineering blogs, interview guides, and roadmap searches.

Topic-driven discovery applies when EngineeringOS needs to answer questions like:

- What are the best current resources for Graph BFS interview readiness?
- Which repositories are most useful for Node.js production best practices?
- What official docs validate this AWS architecture topic?
- What public roadmaps support the Solution Architect path?
- What current job descriptions repeatedly mention this capability?
- Which Staff/EM resources validate this leadership topic?

Discovery flow:

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

## Search Query Patterns

Recommended query templates:

- `top github resources for <topic>`
- `must have github repositories for <topic>`
- `best github repositories for <topic>`
- `github roadmap for <role>`
- `github interview resources for <topic>`
- `github learning path for <topic>`
- `official documentation for <topic>`
- `best engineering blogs for <topic>`
- `<role> interview preparation github`
- `<topic> system design interview github`
- `<topic> roadmap github`
- `<topic> best practices github`
- `<topic> production best practices`

Search queries should be generated from the role/capability/topic context and then reviewed. Query generation is allowed to be broad; Source Catalog approval must remain selective.

## Initial Useful GitHub Sources

These are seed examples and candidates for the Source Catalog. They are not automatically approved for beta-critical mappings until reviewed.

| Source | Primary Use | Candidate Mapping |
| --- | --- | --- |
| `https://github.com/leonardomso/33-js-concepts` | JavaScript concepts | JS fundamentals and interview preparation |
| `https://github.com/denysdovhan/wtfjs` | JavaScript edge cases | Deep JS understanding and tricky interview concepts |
| `https://github.com/goldbergyoni/nodebestpractices` | Node.js production best practices | Backend mastery, security, testing, architecture, reliability |
| `https://github.com/ashishps1/awesome-system-design-resources` | System design resources | HLD, distributed systems, architecture interview preparation |
| `https://github.com/NikAshanin/Solution-Architect-Road-Map` | Solution Architect roadmap | Cloud architecture and Solution Architect readiness |

Each candidate source must still receive:

- Source metadata.
- Reliability rating.
- License/usage note.
- Exact reference links where possible.
- Topic-source mappings.
- Confidence score.
- Sarwan approval if used for beta-critical mappings.

## 3. Source Reliability Model

Source reliability tells EngineeringOS how much confidence to place in a source for topic discovery, validation, and coverage decisions.

## High Reliability

High-reliability sources are primary, official, durable, or widely validated.

Examples:

- Official documentation.
- Standards and specifications.
- AWS docs and Well-Architected Framework.
- Mature open-source repositories with clear license and broad adoption.
- Books or papers with strong industry consensus.
- Company engineering blogs describing real production systems.
- Public career frameworks from credible engineering organizations.

Use high-reliability sources for:

- Fact validation.
- Technical constraints.
- Official behavior.
- Required topic confirmation.
- Architecture best practices.

## Medium Reliability

Medium-reliability sources are useful but require cross-checking.

Examples:

- Curated awesome lists.
- Individual engineering blog posts.
- YouTube explainers.
- Public interview guides.
- Roadmaps from known platforms.
- Conference talks without official docs backing every detail.

Use medium-reliability sources for:

- Discovery.
- Sequencing hints.
- Interview trend signal.
- Alternate explanations.
- Coverage gap detection.

## Low Reliability

Low-reliability sources can suggest ideas but should not drive canonical content alone.

Examples:

- Unverified social posts.
- Forum answers.
- Outdated tutorials.
- SEO content farms.
- AI-generated pages.
- Unsourced interview question dumps.
- Repositories with unclear ownership, stale content, or no license clarity.

Use low-reliability sources only for:

- Weak discovery signal.
- Market noise detection.
- Candidate topic ideas that must be verified elsewhere.

## Evaluation Criteria

Each source should be evaluated by:

- Authority: official, expert, company, community, unknown.
- Recency: publication and last updated date.
- Specificity: exact topic coverage vs broad generic content.
- Accuracy: cross-check against primary sources.
- Adoption: stars, citations, references, industry usage, or repeated mention.
- License and reuse policy.
- Depth: shallow overview vs implementation-grade detail.
- Role relevance.
- Interview relevance.
- Production relevance.
- Bias or commercial incentive.

## Topic Confidence Gate

A topic can enter the Master Syllabus if at least one of these is true:

- It appears in at least 2 independent credible sources.
- It appears in 1 official or high-trust source.
- It appears repeatedly in current job descriptions for target roles.

Confidence bands:

- `>= 0.75`: approved.
- `0.50-0.74`: candidate / needs review.
- `< 0.50`: rejected or parked.

Suggested scoring:

- Official docs / canonical book: `+0.40`.
- Recognized roadmap or repository: `+0.25`.
- Job description signal: `+0.25`.
- Interview-prep source: `+0.20`.
- Engineering blog: `+0.15`.
- Single weak source only: blocked unless manually approved by Sarwan.

Example:

```txt
Topic: Multi-AZ failover
AWS docs: +0.40
AWS Well-Architected: +0.40
Job descriptions: +0.25
Total capped confidence: 1.00 -> approved
```

```txt
Topic: New framework-specific trick
Single weak article: blocked
Total confidence: <0.50 -> rejected or parked unless Sarwan manually approves
```

## 4. Source Catalog Model

The Source Catalog stores source metadata. It does not store copied source content.

Canonical fields:

- `id`: Stable source identifier.
- `title`: Human-readable source title.
- `url`: Original source URL.
- `canonicalUrl`: Preferred normalized URL.
- `sourceType`: Source category.
- `domains`: EngineeringOS domains touched.
- `author`: Person, company, organization, or repository owner.
- `publisher`: Optional publisher/platform.
- `publicationDate`: Original publication date if known.
- `lastUpdatedAt`: Last verified or observed source update.
- `retrievedAt`: When EngineeringOS last checked it.
- `reliability`: `high`, `medium`, or `low`.
- `confidenceScore`: Numeric 0-100 confidence.
- `ingestionStatus`: Discovery and review status.
- `license`: Known license or usage note.
- `usagePolicy`: What EngineeringOS may do with it.
- `mappedTopics`: Topic slugs or IDs mapped to this source.
- `mappedCapabilities`: Future capability IDs mapped to this source.
- `exactReferences`: Exact pages, anchors, files, or timestamps.
- `notes`: Internal review notes.
- `risks`: Copyright, outdatedness, bias, or quality risks.
- `tags`: Searchable metadata.

Recommended TypeScript-style model:

```ts
export type SourceReliability = "high" | "medium" | "low";

export type SourceType =
  | "official-docs"
  | "aws-docs"
  | "github-repository"
  | "engineering-blog"
  | "company-engineering-blog"
  | "article"
  | "roadmap"
  | "book"
  | "interview-guide"
  | "practice-platform"
  | "youtube-channel"
  | "podcast"
  | "job-description"
  | "career-framework"
  | "staff-engineering-resource"
  | "architecture-reference"
  | "standard-or-spec"
  | "conference-talk"
  | "course-or-training";

export type IngestionStatus =
  | "discovered"
  | "queued"
  | "ingested"
  | "mapped"
  | "reviewed"
  | "rejected"
  | "deprecated";

export type SourceUsagePolicy = {
  reuse:
    | "reference-only"
    | "open-source-reference"
    | "public-practice-reference"
    | "official-doc-validation"
    | "link-only";
  attributionRequired: boolean;
  copyAllowed: false;
  note: string;
};

export type ExactSourceReference = {
  id: string;
  label: string;
  url: string;
  canonicalUrl?: string;
  anchor?: string;
  repositoryPath?: string;
  commitSha?: string;
  videoTimestampSeconds?: number;
  pageTitle?: string;
  usage: "discovery" | "validation" | "topic-extraction" | "coverage-analysis" | "reference";
};

export type SourceCatalogEntry = {
  id: string;
  title: string;
  url: string;
  canonicalUrl: string;
  sourceType: SourceType;
  domains: string[];
  author?: string;
  publisher?: string;
  publicationDate?: string;
  lastUpdatedAt?: string;
  retrievedAt: string;
  reliability: SourceReliability;
  confidenceScore: number;
  ingestionStatus: IngestionStatus;
  license?: string;
  usagePolicy: SourceUsagePolicy;
  mappedTopics: string[];
  mappedCapabilities: string[];
  exactReferences: ExactSourceReference[];
  notes: string[];
  risks: string[];
  tags: string[];
};
```

Example:

```ts
export const awsWellArchitectedSource: SourceCatalogEntry = {
  id: "aws-well-architected-framework",
  title: "AWS Well-Architected Framework",
  url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
  canonicalUrl: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
  sourceType: "aws-docs",
  domains: ["aws", "system-design", "staff-engineering"],
  author: "Amazon Web Services",
  publisher: "AWS",
  publicationDate: undefined,
  lastUpdatedAt: undefined,
  retrievedAt: "2026-06-04",
  reliability: "high",
  confidenceScore: 95,
  ingestionStatus: "reviewed",
  license: "Official AWS documentation; link and validate only.",
  usagePolicy: {
    reuse: "official-doc-validation",
    attributionRequired: true,
    copyAllowed: false,
    note: "Use for validation, terminology, architecture review lenses, and exact source navigation."
  },
  mappedTopics: ["aws-well-architected", "multi-az", "backup-dr", "cost-optimization"],
  mappedCapabilities: ["cap-design-reliable-aws-systems", "cap-architecture-tradeoff-review"],
  exactReferences: [
    {
      id: "aws-wa-overview",
      label: "Framework overview",
      url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
      usage: "validation"
    }
  ],
  notes: ["Primary source for AWS architecture review dimensions."],
  risks: ["AWS-specific framing; cross-check cloud-neutral principles when needed."],
  tags: ["aws", "architecture", "reliability", "security", "cost"]
};
```

## 5. Topic Source Mapping Model

Topic-source mapping records why a source is connected to a topic. It is separate from both the `Source` and the authored `Topic`.

The relationship is many-to-many:

```txt
Topic <-> TopicSource <-> Source
```

Recommended fields:

- `id`: Stable mapping ID.
- `topicId` or `topicSlug`.
- `sourceId`.
- `exactReferenceIds`: Specific references within the source.
- `mappingType`: Discovery, validation, extraction, practice, interview, implementation, proof, or further reading.
- `priority`: Primary, supporting, verification, optional.
- `relevanceScore`: 0-100.
- `coverageNotes`: What the source contributes.
- `sourceCoverage`: Concepts, tasks, examples, constraints, interview prompts, role signal.
- `reviewStatus`: Pending, accepted, rejected, stale.
- `reviewedBy`.
- `reviewedAt`.
- `approvedBy`: Human approval owner for beta-critical mappings.
- `approvedAt`: Human approval timestamp for beta-critical mappings.

TypeScript-style model:

```ts
export type TopicSourceMappingType =
  | "discovery"
  | "validation"
  | "topic-extraction"
  | "practice-reference"
  | "interview-reference"
  | "implementation-reference"
  | "proof-reference"
  | "further-reading";

export type TopicSourcePriority = "primary" | "supporting" | "verification" | "optional";

export type TopicSourceMapping = {
  id: string;
  topicSlug: string;
  sourceId: string;
  exactReferenceIds: string[];
  mappingType: TopicSourceMappingType[];
  priority: TopicSourcePriority;
  reliabilityAtMapping: SourceReliability;
  relevanceScore: number;
  coverageNotes: string;
  sourceCoverage: {
    concepts: string[];
    tasks: string[];
    interviewSignals: string[];
    implementationSignals: string[];
    roleSignals: string[];
  };
  reviewStatus: "pending" | "accepted" | "rejected" | "stale";
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: "Sarwan";
  approvedAt?: string;
};
```

Example:

```ts
export const graphBfsSourceMappings: TopicSourceMapping[] = [
  {
    id: "topic-source-graph-bfs-neetcode",
    topicSlug: "graph-bfs",
    sourceId: "neetcode-roadmap",
    exactReferenceIds: ["neetcode-graphs-bfs-node"],
    mappingType: ["discovery", "practice-reference", "interview-reference"],
    priority: "primary",
    reliabilityAtMapping: "medium",
    relevanceScore: 88,
    coverageNotes: "Validates BFS as a high-frequency coding interview pattern.",
    sourceCoverage: {
      concepts: ["breadth-first traversal", "visited state", "queue traversal"],
      tasks: ["shortest path in unweighted graphs"],
      interviewSignals: ["pattern recognition", "edge-case handling", "complexity explanation"],
      implementationSignals: ["queue implementation", "visited timing"],
      roleSignals: ["DSA round readiness"]
    },
    reviewStatus: "accepted",
    reviewedBy: "founder",
    reviewedAt: "2026-06-04",
    approvedBy: "Sarwan",
    approvedAt: "2026-06-04"
  }
];
```

Beta-critical topic-source mappings must not be treated as final until `approvedBy: "Sarwan"` is present.

## 6. Sources Navbar Behaviour

Every topic page must support a Sources Navbar.

## Purpose

The Sources Navbar lets the learner and reviewer inspect the exact source references that contributed to a topic without mixing source content into EngineeringOS authored content.

## Required Behaviour

For every topic:

- List all mapped sources.
- Show source title.
- Show source type.
- Show reliability rating.
- Show usage reason: discovery, validation, practice reference, interview reference, implementation reference, proof reference, further reading.
- Show priority: primary, supporting, verification, optional.
- Open the exact URL, page, repository path, article, docs page, roadmap page, video timestamp, or interview guide.
- Support filtering by source type.
- Support filtering by reliability.
- Support filtering by usage reason.
- Prefer exact references over broad homepages.
- Avoid showing long copied source excerpts.

## Expected UX

Recommended display:

```txt
Sources
[All] [Official Docs] [GitHub] [Roadmaps] [Practice] [Videos] [High Reliability]

Primary
- AWS Well-Architected Framework · Official Docs · High · Validation
  Open exact page

Verification
- AWS Architecture Center · Official Docs · High · Architecture reference
  Open exact page

Practice
- NeetCode Roadmap · Practice Platform · Medium · Pattern sequencing
  Open exact page
```

Each source item should include:

- Icon or source-type label.
- Reliability badge.
- Usage badge.
- Short EngineeringOS-authored note explaining why the source is linked.
- External-link action.

Do not:

- Render copied source content as the learning body.
- Hide source links behind generic "References".
- Link only to a domain homepage when an exact page is known.
- Treat low-reliability sources as canonical.

## 7. Agent Architecture

The ingestion system should be multi-agent in responsibility, even if early MVP execution is manual or script-assisted.

## Market Research Agent

Purpose:

- Research current 2026 hiring expectations for product companies, GCCs, and FAANG-style roles.

Inputs:

- Role list.
- Target geography and compensation band.
- Public hiring trends.
- Interview reports and role descriptions.

Outputs:

- Role expectation summaries.
- High-frequency capability list.
- Emerging topic signals.
- Market gaps.

Responsibilities:

- Identify what Senior Backend, Lead Backend, Staff, Principal, Solution Architect, and EM roles now expect.
- Separate must-have skills from nice-to-have trends.
- Flag outdated syllabus assumptions.

## Job Market Agent

Purpose:

- Analyze modern role requirements from job descriptions.

Inputs:

- Job descriptions.
- Company type filters.
- Role level filters.
- Geography and compensation target.

Outputs:

- Skill frequency report.
- Capability frequency report.
- Company-type differences.
- Required vs preferred matrix.

Responsibilities:

- Extract skills, tools, systems, cloud expectations, leadership expectations, and interview signals.
- Map JD language into EngineeringOS domains and future capabilities.

## Roadmap Discovery Agent

Purpose:

- Find public roadmaps and role paths.

Inputs:

- Target domains and roles.
- Known roadmap sources.
- Search queries.

Outputs:

- Candidate roadmap sources.
- Sequencing suggestions.
- Topic coverage comparisons.
- Gaps against EngineeringOS syllabus.

Responsibilities:

- Discover roadmap.sh-style paths, backend roadmaps, AWS roadmaps, system design roadmaps, and Staff/EM growth maps.
- Avoid copying roadmap content; use as structure validation only.

## GitHub Discovery Agent

Purpose:

- Find relevant repositories for topic discovery, practice references, implementation references, and coverage validation.

Inputs:

- Domain list.
- Topic candidates.
- Repository search queries.
- License filters.

Outputs:

- Source catalog candidates.
- Repository metadata.
- License notes.
- Exact file/path references where useful.

Responsibilities:

- Discover curated lists, algorithm implementations, interview guides, system design repositories, LLD prompts, and architecture examples.
- Flag license uncertainty.

## Documentation Discovery Agent

Purpose:

- Find official documentation for technical truth.

Inputs:

- Topic candidates.
- Technology list.
- Official documentation roots.

Outputs:

- Official source catalog entries.
- Exact page mappings.
- Validation references.

Responsibilities:

- Prioritize MDN, Node.js, TypeScript, PostgreSQL, MongoDB, Redis, AWS, OpenAPI, OAuth/OIDC, Kubernetes, Docker, and observability docs.
- Prefer official pages for fact validation.

## Resource Discovery Agent

Purpose:

- Given a role, capability, skill, topic, weak area, or interview round, discover high-quality resources from the internet.

Inputs:

- `roleId`.
- `capabilityId`.
- `skillId`.
- `topicId`.
- `searchIntent`.
- `priority`.

Outputs:

- `discoveredSources[]`.
- `searchQueries[]`.
- `rankingReason`.
- `suggestedTopicMappings[]`.
- `confidenceScore`.
- `reviewerStatus`.

Responsibilities:

- Search for top GitHub repositories.
- Search for official documentation.
- Search for public roadmaps.
- Search for engineering blogs.
- Search for interview guides.
- Search for books and canonical references.
- Search for videos/channels if relevant.
- Search for job market signals.
- Rank discovered sources.
- Add approved or candidate sources into the Source Catalog.
- Preserve exact URLs and repository paths wherever possible.
- Mark whether a source is approved, candidate, rejected, or parked.
- Route beta-critical mappings to Sarwan for approval.

The Resource Discovery Agent is different from source ingestion. It finds and ranks candidate sources before final topic extraction. Topic Extraction should run after the best candidate sources have been discovered, filtered, and entered into the Source Catalog.

## Topic Extraction Agent

Purpose:

- Extract candidate topics, subtopics, concepts, tasks, and interview signals from sources.

Inputs:

- Source catalog entries.
- Exact references.
- Target role context.

Outputs:

- Candidate topics.
- Candidate subtopics.
- Concept list.
- Practice/task suggestions.
- Interview signal suggestions.
- Source-to-topic mapping proposals.

Responsibilities:

- Produce structured topic candidates, not final authored lessons.
- Preserve traceability to source IDs and exact references.
- Mark confidence and reliability.

## Deduplication Agent

Purpose:

- Merge duplicate and overlapping topic candidates.

Inputs:

- Candidate topics.
- Existing Master Syllabus topics.
- Synonym dictionaries.

Outputs:

- Canonical topic proposals.
- Duplicate mapping report.
- Alias list.
- Merge decisions.

Responsibilities:

- Merge "message queue", "queues", "SQS", and "async messaging" only when appropriate.
- Preserve distinct topics when level or role context differs.
- Avoid over-merging AWS service topics with general architecture concepts.

## Capability Mapping Agent

Purpose:

- Map topics to future capabilities and role outcomes.

Inputs:

- Candidate topics.
- Target roles.
- Market/job research output.
- Existing role roadmaps.

Outputs:

- Topic-to-capability mappings.
- Capability gap report.
- Role relevance weights.
- Readiness dimension suggestions.

Responsibilities:

- Prepare data for the future Capability Graph.
- Identify which topics support Senior Backend, Solution Architect, Staff, Principal, and EM readiness.

## Content Authoring Agent

Purpose:

- Generate original EngineeringOS content from accepted topic briefs and source mappings.

Inputs:

- Accepted topic brief.
- Source mapping.
- Role/capability context.
- Quality bar.

Outputs:

- Original topic explanation.
- Original examples.
- Original practice tasks.
- Interview prompts.
- Implementation tasks.
- Proof-of-competency rubrics.
- Source reference links.

Responsibilities:

- Never copy source prose, diagrams, code, or proprietary problem statements.
- Use sources for validation and reference only.
- Preserve EngineeringOS voice and career-transformation framing.

## Quality Review Agent

Purpose:

- Validate coverage, correctness, originality, and role usefulness.

Inputs:

- Draft EngineeringOS content.
- Source mappings.
- Role/capability expectations.
- Coverage criteria.

Outputs:

- Approval or rejection.
- Gap list.
- Risk list.
- Required edits.
- Coverage score.

Responsibilities:

- Check copyright safety.
- Check source traceability.
- Check role alignment.
- Check readiness scoring support.
- Check whether topic can power Daily Missions and proof tasks.

## 8. Ingestion Pipeline

The end-to-end workflow:

```txt
Source Discovery
  -> Source Catalog
  -> Topic Extraction
  -> Deduplication
  -> Capability Mapping
  -> Topic Creation
  -> Source Mapping
  -> Quality Review
  -> Master Syllabus
```

## Pipeline Steps

1. Source Discovery
   - Agents discover candidate sources from docs, repositories, roadmaps, job descriptions, blogs, videos, books, and interview guides.
   - Topic-driven discovery expands beyond manually provided sources using generated search queries and resource ranking.

2. Source Catalog
   - Store source metadata, reliability, usage policy, exact references, and ingestion status.

3. Topic Extraction
   - Extract candidate topics, subtopics, tasks, interview signals, and implementation signals.

4. Deduplication
   - Merge duplicates, attach aliases, and avoid parallel topic drift.

5. Capability Mapping
   - Map topics to future role capabilities and skills.

6. Topic Creation
   - Create or update canonical Master Syllabus topic records.

7. Source Mapping
   - Create `TopicSource` relationships with exact references and usage reasons.

8. Quality Review
   - Validate completeness, originality, reliability, and role relevance.

9. Master Syllabus
   - Accepted topics become canonical syllabus entries.

## Example Flow

```txt
AWS Well-Architected Framework
  -> Source Catalog entry: high reliability, official docs
  -> Extract pillars: reliability, security, cost, performance, operations
  -> Deduplicate with existing AWS/system-design topics
  -> Map to capabilities:
       - Design reliable AWS systems
       - Review architecture tradeoffs
       - Explain cost/security/operations decisions
  -> Create/update topics:
       - AWS Well-Architected
       - Multi-AZ
       - Backup and DR
       - Cost Optimization
  -> Map exact docs pages as source references
  -> Review for originality and role fit
  -> Publish to Master Syllabus
```

## Topic-Driven Discovery Flow

Example:

```txt
Topic: Node.js production best practices
  -> Generate queries:
       - top github resources for Node.js production best practices
       - Node.js production best practices github
       - official documentation for Node.js security testing reliability
       - Node.js backend interview preparation github
  -> Search web/GitHub
  -> Collect candidate sources:
       - Node.js official docs
       - goldbergyoni/nodebestpractices
       - company engineering blogs
       - current backend job descriptions
  -> Rank sources by reliability, relevance, recency, adoption, and role fit
  -> Add accepted/candidate sources to Source Catalog
  -> Extract candidate topics:
       - error handling
       - security headers
       - configuration management
       - logging
       - testing strategy
       - production reliability
  -> Map topics to Master Syllabus and future backend capabilities
  -> Review
  -> Sarwan approves beta-critical mappings or parks them for later
```

## 9. Coverage Validation

Coverage validation answers: "Do we have enough source-backed content for this role?"

## Role Coverage Dimensions

For each target role, EngineeringOS should measure:

- Required capability coverage.
- Required skill coverage.
- Required topic coverage.
- Source confidence coverage.
- Practice coverage.
- Interview coverage.
- Implementation coverage.
- Proof-of-competency coverage.
- Offer/career asset coverage where relevant.

## Coverage Thresholds

Suggested beta thresholds:

- 100% of founder beta path P0 topics satisfy the topic confidence gate.
- 90% of P0 capabilities mapped.
- 80% of P0 topics have at least one high-reliability or two medium-reliability sources.
- 100% of high-ROI topics have source mappings.
- 80% of high-ROI topics have practice or implementation tasks.
- 80% of high-ROI topics have interview prompts.
- 70% of high-ROI topics have proof-of-competency rubrics.
- 100% of AWS service behavior topics have official AWS docs references.
- 100% of career/offer topics have at least one credible career/interview source and original artifact guidance.
- 100% of beta-critical topic-source mappings are approved by Sarwan.

## Example: Solution Architect Coverage

Solution Architect is sufficiently covered when:

- Core AWS services are covered: IAM, VPC, EC2/ECS/EKS, Lambda, API Gateway, S3, RDS, DynamoDB, SQS/SNS/EventBridge, Route 53, CloudFront, CloudWatch, CloudTrail, KMS.
- Architecture capabilities are covered: reliability, availability, security, cost, performance, operations, DR, scaling, observability.
- HLD case studies have AWS variants.
- Every AWS service topic maps to official AWS docs.
- Every architecture review topic maps to AWS Well-Architected or equivalent high-confidence architecture references.
- There are implementation or lab tasks for key cloud capabilities.
- There are interview prompts for AWS tradeoffs, failure modes, and service selection.
- There are proof tasks such as architecture review, DR plan, cost review, and secure deployment plan.

## Coverage Report Shape

```ts
export type RoleCoverageReport = {
  roleSlug: string;
  requiredCapabilities: number;
  coveredCapabilities: number;
  requiredTopics: number;
  coveredTopics: number;
  highReliabilitySourceCoveragePercent: number;
  practiceCoveragePercent: number;
  interviewCoveragePercent: number;
  implementationCoveragePercent: number;
  proofCoveragePercent: number;
  gaps: Array<{
    type: "capability" | "skill" | "topic" | "source" | "practice" | "interview" | "proof";
    severity: "p0" | "p1" | "p2";
    label: string;
    recommendedAction: string;
  }>;
};
```

## 10. Master Syllabus Compatibility

The ingestion model must support all downstream EngineeringOS systems.

## Capability Graph

Ingestion must produce topic-to-capability mapping candidates:

- Topic supports capability.
- Topic blocks capability.
- Topic proves capability.
- Topic reinforces capability.
- Topic maps to role weight.

## Roadmap Projection

Ingestion must preserve:

- Prerequisites.
- Seniority level.
- Role relevance.
- Interview frequency.
- Implementation relevance.
- Time estimate.
- Confidence.
- Source-backed priority.

Roadmap projection later uses these fields to order topics for each target role.

## Daily Missions

Daily Missions require:

- Topic readiness dimensions.
- Mission type candidates.
- Time estimate.
- Weak-area tags.
- Proof tasks.
- Interview prompts.
- Implementation tasks.
- Revision triggers.

Ingestion should mark which topics can produce learn, practice, interview, implementation, repair, proof, or offer missions.

## Readiness Scoring

Ingestion must support four-part topic readiness:

- Knowledge Score.
- Practice Score.
- Interview Score.
- Implementation Score.

Each topic should know which tasks and prompts can generate evidence for each score.

## 11. Mock File Structure

MVP should support file-based content while staying DB-ready.

Recommended future structure:

```txt
src/data/
  syllabus/
    domains/
      backend.ts
      dsa.ts
      system-design.ts
      aws.ts
      lld.ts
      staff-em.ts
      career-assets.ts
    topics/
      backend/
      dsa/
      system-design/
      aws/
      lld/
      staff-em/
      career-assets/
    index.ts

  capabilities/
    roles/
      senior-backend.ts
      lead-backend.ts
      staff-engineer.ts
      principal-engineer.ts
      solution-architect.ts
      engineering-manager.ts
    capabilities.ts
    skills.ts
    proof-of-competency.ts
    topic-capability-map.ts
    index.ts

  roadmaps/
    projections/
      senior-backend.ts
      solution-architect.ts
      staff-ready-backend.ts
      engineering-manager.ts
    first-beta-path.ts
    index.ts

  readiness/
    topic-readiness-dimensions.ts
    interview-rounds.ts
    offer-readiness.ts
    scoring-rubrics.ts
    index.ts

  sources/
    source-catalog.ts
    source-types.ts
    source-reliability.ts
    exact-source-references.ts
    topic-source-map.ts
    capability-source-map.ts
    index.ts

  ingestion/
    ingestion-runs.ts
    discovered-sources.ts
    discovery-patterns.ts
    seed-resource-queries.ts
    extracted-topic-candidates.ts
    dedupe-decisions.ts
    coverage-reports.ts
    quality-review-results.ts
    index.ts
```

Near-term compatibility with the current repo:

- Current `src/data/content/source-catalog.ts` can evolve into `src/data/sources/source-catalog.ts`.
- Current `src/data/content/source-topic-map.ts` can evolve into `src/data/sources/topic-source-map.ts`.
- Current `src/types/enriched-content.ts` source types should be split into source-specific types and enriched-content-specific types.
- Current syllabus files can remain while new structure is phased in.

Future implementation can later add:

- `src/data/ingestion/discovery-patterns.ts`
- `src/data/ingestion/seed-resource-queries.ts`
- `src/data/sources/seed-github-sources.ts`

Do not create these files until implementation is explicitly requested.

## 12. Future Database Model

No migration should be implemented yet. This is the target model.

## Source Table

Fields:

- `id`
- `title`
- `url`
- `canonicalUrl`
- `sourceType`
- `domains`
- `author`
- `publisher`
- `publicationDate`
- `lastUpdatedAt`
- `retrievedAt`
- `reliability`
- `confidenceScore`
- `ingestionStatus`
- `license`
- `usagePolicy`
- `notes`
- `risks`
- `tags`
- `createdAt`
- `updatedAt`

## Topic Table

Fields:

- `id`
- `slug`
- `title`
- `domainId`
- `moduleId`
- `summary`
- `whyItMatters`
- `difficulty`
- `seniorityLevel`
- `targetRoles`
- `prerequisites`
- `estimatedMinutes`
- `authoredContent`
- `status`
- `version`
- `createdAt`
- `updatedAt`

## TopicSource Table

Fields:

- `id`
- `topicId`
- `sourceId`
- `exactReferenceId`
- `mappingTypes`
- `priority`
- `reliabilityAtMapping`
- `relevanceScore`
- `coverageNotes`
- `reviewStatus`
- `reviewedBy`
- `reviewedAt`
- `createdAt`
- `updatedAt`

## Capability Table

Fields:

- `id`
- `slug`
- `title`
- `description`
- `targetRoles`
- `seniorityLevel`
- `weight`
- `status`
- `createdAt`
- `updatedAt`

## Skill Table

Fields:

- `id`
- `capabilityId`
- `slug`
- `title`
- `description`
- `requiredTopicIds`
- `proofTaskIds`
- `createdAt`
- `updatedAt`

## Roadmap Table

Fields:

- `id`
- `slug`
- `title`
- `targetRole`
- `currentStateProfile`
- `capabilityIds`
- `topicSequence`
- `requiredProofIds`
- `readinessThresholds`
- `version`
- `status`
- `createdAt`
- `updatedAt`

## IngestionRun Table

Fields:

- `id`
- `runType`
- `status`
- `startedAt`
- `completedAt`
- `triggeredBy`
- `sourceIds`
- `agentVersions`
- `discoveredCount`
- `extractedTopicCount`
- `acceptedTopicCount`
- `rejectedTopicCount`
- `coverageReportId`
- `notes`
- `createdAt`

Additional future tables:

- `ExactSourceReference`
- `ExtractedTopicCandidate`
- `DedupeDecision`
- `CapabilitySource`
- `QualityReview`
- `CoverageReport`
- `SyllabusVersion`
- `SourceSnapshot`

## 13. Versioning Strategy

## Source Updates

Sources should be rechecked on a schedule or when a source is known to change.

Track:

- Last retrieved date.
- Last reviewed date.
- Last modified date if available.
- Status changes.
- URL changes.
- Reliability changes.
- Deprecation notes.

## Syllabus Updates

Every canonical syllabus topic should have:

- Version.
- Changelog.
- Source mapping version.
- Review status.
- Last reviewer.
- Reason for update.

## Ingestion Reruns

Reruns should be reproducible.

Track:

- Agent versions.
- Input source set.
- Extraction rules.
- Deduplication decisions.
- Accepted and rejected candidates.
- Coverage deltas.

## Deprecations

Deprecate a source or topic when:

- URL is gone.
- Content is outdated.
- Reliability drops.
- Better source replaces it.
- Topic no longer matters for target roles.
- Topic is merged into another canonical topic.

Do not delete immediately. Mark as deprecated and preserve mapping history.

## 14. Copyright And Attribution Rules

## What Can Be Stored

EngineeringOS may store:

- Source metadata.
- Source URLs.
- Canonical URLs.
- Repository paths.
- Video timestamps.
- Short internal notes.
- Topic extraction metadata.
- Original EngineeringOS summaries.
- Original examples.
- Original practice tasks.
- Original rubrics.
- Original proof tasks.
- Links and attribution labels.

## What Cannot Be Stored

EngineeringOS should not store:

- Long copied passages from articles, books, docs, or guides.
- Proprietary problem statements.
- Proprietary editorials or solutions.
- Copied diagrams.
- Copied course transcripts.
- Large copied code blocks unless license explicitly permits and the product intentionally tracks license compliance.
- Paywalled content.
- Source content in a way that substitutes for visiting the source.

## How References Work

References should:

- Link to exact source pages.
- Explain why the source is useful.
- Show reliability and source type.
- Distinguish validation sources from practice sources.
- Preserve attribution.
- Avoid presenting source content as EngineeringOS-authored content.

## Authored Content vs Source Content

Source content:

- External.
- Linked.
- Used for discovery and validation.
- Not copied into the product.

EngineeringOS content:

- Original.
- Role-focused.
- Mapped to capabilities.
- Designed for daily missions.
- Scored for readiness.
- Connected to proof-of-competency tasks.

## 15. Recommended Next Phase

After this document, the next planning artifact should be:

```txt
docs/FIRST_BETA_PATH_MODEL.md
```

It should define the first complete founder beta path:

```txt
Senior/Lead Backend Engineer
  -> AWS Solution Architect / Staff-ready Backend
  -> Product/GCC/FAANG-level readiness
```

Required contents:

- Target role definition.
- Current-state assumptions.
- Required capabilities.
- Required skills.
- Required Master Syllabus topics.
- Required source coverage.
- Required practice tasks.
- Required interview tasks.
- Required implementation tasks.
- Proof-of-competency artifacts.
- Readiness thresholds.
- Daily Mission inputs.
- Offer-readiness artifacts.

Do not implement ingestion, database changes, or app code before this planning artifact is complete.
