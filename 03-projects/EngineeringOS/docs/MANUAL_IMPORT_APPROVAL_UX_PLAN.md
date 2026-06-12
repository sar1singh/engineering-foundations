# Manual Import Approval UX Plan

Date: 2026-06-09

## Purpose

Define the future interactive manual approval UX for EngineeringOS content ingestion — what a curator sees, what actions they can take, and how the static simulation preview (Phase 7D) evolves into a working approve/reject workflow (Phase 7F+). This is a **planning and UI-contract document only** — no implementation work is done here.

## Current State (Phase 7D)

- **Static ingestion preview** at `/founder-beta/ingestion-preview` renders 5 mock scenarios as read-only candidate cards with lifecycle bars
- **No interactivity**: no approve/reject buttons, no review forms, no publish action, no decision state mutation
- **No persistence**: all results are re-derived from mock data via `simulateAllCandidates` — nothing is saved
- **Contract helpers exist**: `determineApprovalReadiness`, `evaluateContentQuality`, `validateContentCandidate`, etc. are pure functions in `content-ingestion-contracts.ts`
- **Simulator layer exists**: `content-ingestion-simulator.ts` wraps contract helpers with lifecycle-step generation

## Future Manual Approval UX

### 1. Candidate Review View

A detail-oriented screen for reviewing a single candidate before deciding its fate. The current `IngestionPreview` component has expandable detail sections; this evolves into a dedicated review page (or overlay) with:

**Header section:**
- Candidate title, source URL (clickable), source type, tier, category
- Discovered-by badge, discovery method, timestamp
- Overall final-status badge (published / rejected / pending)

**Validation result section:**
- Inline display of `validateContentCandidate` output — errors in red, warnings in yellow, green checkmark if clean
- Quick action: "Edit candidate fields" for structural fixes (if the candidate was manually entered)

**Topic mapping section:**
- List of proposed topic mappings with per-mapping validation status (valid / warning / invalid)
- For each mapping: topic name, capability IDs, skill IDs, relevance score, mapped-by
- Quick action: "Override mapping" for curator to fix invalid capability/skill references, or "Add topic mapping"

**Source mapping section:**
- List of proposed source mappings with per-mapping validation status
- For each mapping: source title, source ID, catalog-warning (if source not yet in catalog)
- Quick action: "Add source catalog entry" → creates a minimal source reference with tier/reliability defaults, or "Override source mapping"

**Quality review section:**
- Score card with 4 dimension scores (freshness, accuracy, relevance, authority) and overall score
- Visual threshold indicator: shows overall score vs 0.6 minimum, per-dimension min/max ranges
- Issues list and recommendations list
- Quick action: "Edit review scores" for re-scoring, or "Reject — quality below threshold"

**Approval readiness section:**
- `determineApprovalReadiness` output displayed as a checklist:
  - [x] Quality review passed
  - [x] Overall score >= 0.6
  - [ ] At least one topic mapping
  - [x] At least one source mapping
  - [x] All topic mappings valid
  - [x] All source mappings valid
- Red blockers shown inline for unmet conditions

**Decision section:**
- Two clearly visible buttons: **Approve** (teal/green) and **Reject** (red)
- Approval requires all readiness gates green; otherwise Approve is disabled with a tooltip explaining the blocker
- Reject is always available with a required reason text field
- Both actions produce a `ContentApprovalDecision` record
- After decision, the candidate's lifecycle bar updates to show the new terminal state

### 2. Quality Review Input

For candidates without a pre-computed review, the reviewer needs a form to create one:

- **URL reachability toggle**: was the URL accessible?
- **4 score sliders or number inputs**: contentFreshnessScore (0-1), technicalAccuracyScore (0-1), relevanceScore (0-1), authorityScore (0-1) — with visual 0-1 range bar
- **Overall score**: auto-computed as weighted average, but editable
- **Issues**: free-text list (add/remove)
- **Recommendations**: free-text list (add/remove)
- **Pass/fail toggle**: explicit boolean decision
- **Save review** button → produces `ContentQualityReview` record

### 3. Topic Mapping Input / Override

For candidates missing or with invalid topic mappings:

- **Topic search/select**: type-ahead search against `founderBetaMasterTopics` (and `dsaProblemBank`)
- **Capability selector**: multi-select from `founderBetaCapabilities`
- **Skill selector**: multi-select from `founderBetaSkills` (filtered by selected capabilities)
- **Relevance score**: slider 0-1
- **Notes**: free text
- **Add mapping** button → produces new `TopicMappingCandidate`
- Reruns `validateTopicMappingCandidate` and `determineApprovalReadiness`

### 4. Source Mapping Input / Override

For candidates missing or with invalid source mappings:

- **Source search/select**: type-ahead search against `founderBetaSourceCatalog`
- **Quick-add source**: if the source is not yet in the catalog, a minimal inline form to create one (id, title, url, sourceType, category, tier, reliability)
- **Notes**: free text
- **Add mapping** button → produces new `SourceMappingCandidate`
- Reruns `validateSourceMappingCandidate` and `determineApprovalReadiness`

### 5. Approve / Reject Flow

**Approve flow:**
1. All readiness gates pass (or reviewer chooses to override)
2. Reviewer clicks **Approve**
3. Optional: approve-with-warning if warnings exist (e.g., duplicate-risk, low relevance mappings)
4. Required: reason text
5. Creates `ContentApprovalDecision` with `decision: "approved"`, `nextStatus: "published"`
6. `validateTransition` confirms `reviewed → approved` is legal
7. Lifecycle bar updates: candidate shows approved step as passed, published step as pending → then transitions to published
8. Published candidate now eligible for ingestion into the content registry

**Reject flow:**
1. Reviewer clicks **Reject**
2. Required: reason text explaining why
3. Optional: severity (low / medium / high / critical)
4. Creates `ContentApprovalDecision` with `decision: "rejected"`, `nextStatus: "rejected"`
5. Creates one or more `ContentIngestionError` records describing the reason
6. Lifecycle bar updates: candidate shows rejected terminal state
7. Rejected candidate is archived — can be revisited but not auto-approved

**Rejection categories (for UX grouping):**
- Structural: missing fields, invalid URL, no id
- Quality: below score threshold, low authority, low accuracy
- Mapping: no topic/source mappings, invalid capability/skill refs
- Duplicate: content overlaps with existing registered content beyond tolerance
- Irrelevant: content does not align with any supported role or capability

### 6. Publish Preview

Before the final publish step, a preview confirms what will enter the content registry:

- **Candidate info**: title, URL, source type, tier, category, tags, confidence
- **Normalized item**: id, checksum, normalized title/URL
- **Topic mappings**: validated and resolved — shows final topic IDs, capability IDs, skill IDs
- **Source mappings**: validated and resolved — shows final source catalog entry
- **Registry integration**: what capability/skill/topic this content will enrich
- **Confirm publish** button → transitions to `published` status
- Publish creates a simulated registry entry (content is "available" but not actually stored in a database)

### 7. Batch View

A dashboard showing all candidates in the system with:

- **Summary counters**: total candidates, pending review, approved today, rejected today
- **Pending queue**: candidates awaiting review, sorted by discovery time (oldest first)
- **Recently decided**: last 10 decisions with approver, timestamp, and outcome
- **Filterable list**: by status (discovered, normalized, mapped, reviewed, approved, published, rejected), by label/scenario, by reviewer
- **Bulk action**: select multiple candidates and approve or reject in batch (with confirmation)
- **Search**: search candidates by title, URL, source type

## Static vs Persisted Delineation

### Stays Static / Derived (Phase 7E and Phase 7F)

| Aspect | Approach |
|--------|----------|
| Candidate data | Static mock candidates from `ingestion-mock-candidates.ts` |
| Contract validation | Pure `content-ingestion-contracts.ts` helpers — no DB |
| Lifecycle computation | Derived via `content-ingestion-simulator.ts` — no persistence |
| UX state | React `useState` for expanded/selected/filter states — no DB reads |
| Approval readiness | Derived each time from current mappings + review — not saved |
| Lifecycle steps | Re-derived from mock data on every render |
| Decision actions | Client-side state mutation that resets on page reload |

### Becomes Interactive (Phase 7F+)

| Aspect | Approach |
|--------|----------|
| Approve/Reject buttons | Client-side action producing a decision record; saved in-memory for session, eventually persisted |
| Quality review form | Creates `ContentQualityReview`; stored alongside candidate for the session |
| Mapping overrides | Creates/updates `TopicMappingCandidate`/`SourceMappingCandidate`; stored in session state |
| Candidate state | Mutated through decision actions; lifecycle recalculated from updated state |
| Session-scoped decisions | Decisions survive page interactions within a session but not page reloads (until persistence is added) |

### Requires Persistence (Future Phase 8+)

| Aspect | When |
|--------|------|
| Candidate queue survives reload | After file-backed or in-memory session persistence |
| Decision history with timestamps | After persistence layer exists for ingestion |
| Audit trail (who approved/rejected what) | After user identity / multi-user system |
| Registry of published content | After content registry persistence (Phase 8B or later) |
| Batch-level status tracking | After batch persistence |
| Duplicate detection across sessions | After cross-session content index exists |

## Minimum Implementation Before Real Ingestion

Before real (agent-driven or scraped) ingestion can begin, the following must be in place:

### Must Have (Phase 7F — Interactive Review UI)

1. **Candidate detail review page** — a route or modal where the reviewer sees all validation, quality, and mapping data for one candidate at a time
2. **Approve button** — triggers decision creation, updates lifecycle, shows success state
3. **Reject button** — requires reason text, creates decision + error records, updates lifecycle
4. **Quality review form** — score inputs (4 dimensions + overall), pass/fail toggle, issues/recommendations, save
5. **Topic mapping form** — topic search, capability/skill selectors, relevance score, add/remove
6. **Source mapping form** — source search, quick-add catalog entry, add/remove
7. **Session-scoped state** — decisions and edits survive client-side navigation and tab switches within a session
8. **Pending queue** — a list view showing candidates awaiting review, sorted by priority/time

### Should Have (Phase 7G — Batch and Polish)

9. **Batch approve/reject** — multi-select from queue, apply same decision to all selected
10. **Publish preview** — final confirmation before a candidate goes published
11. **Candidate search on ingestion page** — search by title, URL, source type
12. **Rejection categories** — structured reason tags for analytics
13. **Filter/sort for pending queue** — by discovery time, priority, source type, confidence

### Nice to Have (Phase 7H or later)

14. **Audit log** — history of all decisions with timestamps and reviewer identity
15. **Duplicate detection UI** — inline warning when a new candidate overlaps with existing published content
16. **Confidence scoring override** — allow reviewer to adjust estimatedConfidence during review
17. **URL reachability check** — attempt HTTP HEAD/GET and report status in the review screen
18. **Live preview** — inline preview of the candidate's URL content (iframe or fetch)

## Deferred (Phase 8+)

- Runtime ingestion agents / scraping
- Discovery agents producing candidates autonomously
- AI evaluation of content quality
- Multi-user reviewer roles and permissions
- Persistence of ingestion decisions beyond in-memory or session scope
- Integration with the content registry to make published content queryable alongside seed data
- Cross-session duplicate detection with persistent content index

## Component Tree (Proposed)

```
/ingestion-preview                    (existing, Phase 7D landing page)
  → SummaryStats                      (reusable: total, pending, approved, rejected counts)
  → IngestionPreview                  (existing, Phase 7D read-only card list)
  → ReviewQueue                       (new: pending-candidates list with sort/filter)
    → QueueCard                        (new: compact candidate card for list view)
  → CandidateReviewPage               (new: full review at /ingestion-preview/review/[id])
    → ReviewHeader                     (new: title, source, badge, timestamps)
    → ValidationSection                (new: validateContentCandidate output with inline edit)
    → TopicMappingSection              (new: list + add/override form)
    → SourceMappingSection             (new: list + add/override form)
    → QualityReviewSection            (new: score card + inline edit form)
      → ScoreInput                     (reusable: 0-1 slider/number input)
    → ApprovalReadinessSection         (new: checklist of readiness gates)
    → DecisionSection                  (new: approve + reject buttons, reason input)
      → ApproveButton                  (new: green, disabled if gates not met)
      → RejectButton                   (new: red, always enabled, requires reason)
    → PublishPreviewModal             (new: confirmation before publish)
      → RegistryPreview                (new: shows what registry entry would look like)
```

## Data Flow (Proposed)

```
MockIngestionScenario          (static data in ingestion-mock-candidates.ts)
  → simulateIngestion()         (Phase 7D: derives lifecycle + validation results)
    → SimulationResult           (read-only snapshot)
      → CandidateReviewPage      (Phase 7F: interactive review)
        → User edits mappings    → client state update
        → User submits review    → client state creates ContentQualityReview
        → User approves/rejects  → client state creates ContentApprovalDecision
        → Rerun determination    → client calls determineApprovalReadiness again
        → Update lifecycle       → client recalculates buildLifecycle
        → Show final status      → client renders updated SimulationResult
```

## Existing Helpers Inventory

These pure functions from `content-ingestion-contracts.ts` are sufficient to power the interactive UX:

| Helper | Used For |
|--------|----------|
| `validateContentCandidate` | Validation section display |
| `validateTopicMappingCandidate` | Per-mapping validation in topic mapping section |
| `validateSourceMappingCandidate` | Per-mapping validation in source mapping section |
| `evaluateContentQuality` | Quality review form validation |
| `determineApprovalReadiness` | Approval readiness checklist + gate check |
| `canTransition` | Decision button enablement (only legal transitions) |
| `validateTransition` | Final step before decision confirmation |
| `createNormalizedItem` | Publish preview section |

## File Impact Summary

### New Files (Phase 7F)

- `src/components/founder-beta/ingestion/CandidateReviewPage.tsx` — full review view
- `src/components/founder-beta/ingestion/ReviewQueue.tsx` — pending queue
- `src/components/founder-beta/ingestion/QueueCard.tsx` — compact queue item
- `src/components/founder-beta/ingestion/ReviewHeader.tsx` — header section
- `src/components/founder-beta/ingestion/ValidationSection.tsx` — validation display
- `src/components/founder-beta/ingestion/TopicMappingSection.tsx` — topic mappings with override
- `src/components/founder-beta/ingestion/SourceMappingSection.tsx` — source mappings with override
- `src/components/founder-beta/ingestion/QualityReviewSection.tsx` — score card + edit form
- `src/components/founder-beta/ingestion/ApprovalReadinessSection.tsx` — readiness checklist
- `src/components/founder-beta/ingestion/DecisionSection.tsx` — approve/reject buttons
- `src/components/founder-beta/ingestion/PublishPreviewModal.tsx` — publish confirmation
- `src/components/founder-beta/ingestion/ScoreInput.tsx` — reusable 0-1 input
- `src/components/founder-beta/ingestion/SummaryStats.tsx` — counter badges
- `src/lib/services/content-ingestion-session-service.ts` — client-side session state management for decisions/reviews

### Modified Files (Phase 7F)

- `src/app/founder-beta/ingestion-preview/page.tsx` — add queue and stats; link to review page
- `src/components/founder-beta/IngestionPreview.tsx` — minor: card links to review page
- `tests/e2e/founder-beta.spec.ts` — add E2E tests for approve/reject flow
- `src/lib/services/content-ingestion-simulator.test.ts` — add tests for session-modified lifecycles

## Phasing Summary

| Phase | Focus | Output |
|-------|-------|--------|
| **7D** *(done)* | Static preview | Read-only lifecycle visualization |
| **7E** *(this document)* | UX planning | This plan document, canonical doc updates |
| **7F** *(next)* | Interactive review | Approve/reject buttons, review forms, session state |
| **7G** *(future)* | Batch + polish | Queue view, bulk actions, search, filter |
| **7H** *(future)* | Persistence prep | File-backed or session-backed decision persistence |
| **8+** *(deferred)* | Real ingestion | Agents, scraping, registry integration |
