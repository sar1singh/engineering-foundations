# Founder Beta Founder Validation Checklist

## Instructions

Run through this checklist with a founder (or yourself acting as the founder). Each item has a pass/fail verdict. Record results and notable observations.

---

## Day 1 — First Contact & Surface Assessment

### 1.1 Navigate to `/founder-beta`
- [ ] Page loads without error
- [ ] Title reads "Founder Beta Solution Architect Path"
- [ ] Demo badge is NOT shown by default
- [ ] "Local draft only" / "Saved locally" labels are visible
- [ ] Onboarding initialization preview is visible
- [ ] Interview Simulator card is visible with "Open Interview Simulator" link
- [ ] Manual progress panel renders all sections (Session Settings, Manual Readiness Estimates, Weak Areas, Completed Work, Readiness Snapshot, Hard Gate Status, Next Actions)

### 1.2 Default Today Plan
- [ ] Primary Mission heading is visible*
- [ ] Readiness Snapshot bar shows all-zero scores
- [ ] Hard Gate Status is visible
- [ ] Next Actions lists actionable items
- [ ] Validation warnings are visible (if any)

### 1.3 Edit & Save
- [ ] Can change Available minutes (expect UI to update)
- [ ] Can change Day Mode (weekday/weekend)
- [ ] Can type a readiness score for a capability
- [ ] Can add a weak area
- [ ] Can add a completed mission/topic
- [ ] "Save local progress" button is enabled
- [ ] After save, "Local progress saved" confirmation appears
- [ ] After save, Primary Mission and Readiness Snapshot reflect the new input
- [ ] After page reload, saved values persist
- [ ] "Reset local progress" clears all values back to defaults

### 1.4 Onboarding Preview
- [ ] "Save onboarding progress" button saves to the same store
- [ ] "Overwrite onboarding progress" shows confirmation dialog
- [ ] "Keep saved progress" cancels the overwrite
- [ ] "Confirm overwrite" replaces saved progress

### 1.5 Demo Modes
- [ ] `?demo=1` renders non-zero progress with "Demo progress active" badge
- [ ] `?demo=weak-area` renders weak-area progress with "Weak-area demo active" badge

---

## Day 3 — Interview Pipeline & Readiness Rollup

### 3.1 Navigate to Interview Simulator
- [ ] Can reach `/founder-beta/interview` from the card link on `/founder-beta`
- [ ] Page title reads "Interview Simulation"
- [ ] Badge reads "Local only — no persistence"
- [ ] Description mentions sample rubric scores

### 3.2 Session Type Selection
- [ ] All 5 session types visible as selectable cards: DSA, LLD, HLD, Behavioral, Mixed-Architect
- [ ] Each card shows question count and time limit
- [ ] Selected card highlights with teal border
- [ ] "Start" button shows the selected session type name

### 3.3 Session In-Progress
- [ ] Question prompt is displayed with category and difficulty tags
- [ ] Context is displayed (if present in question data)
- [ ] "Your response" textarea accepts input
- [ ] "Time spent" input defaults to 120 seconds
- [ ] Progress indicator shows "Question X of Y"
- [ ] "Submit & Next Question" button is disabled when response is empty
- [ ] Can advance through all questions
- [ ] "Complete session" ends the session early
- [ ] "Timeout session" simulates a timeout

### 3.4 Session Completion
- [ ] Session completed view shows "Session Completed" badge
- [ ] Overall Score percentage is displayed
- [ ] Proof Score /5 is displayed
- [ ] Readiness Impact /100 is displayed
- [ ] Proof Record shows type, state, and score
- [ ] Offer Readiness Impact shows overall score and band
- [ ] Strengths, Weaknesses, and Improvement Areas lists render
- [ ] Category Breakdown shows progress bars for each category
- [ ] "Start New Session" button resets to type selection

### 3.5 Pipeline Integration Signals
- [ ] Evaluation result shows sample rubric scores (always 3/5 per criterion)
- [ ] Proof score reflects deterministic calculation
- [ ] Readiness impact reflects rollup from proof record
- [ ] Offer readiness impact reflects interview readiness from evaluation

### 3.6 Score Decay (Manual Verification)
- [ ] Compute weighted average with decay factor 0.85: older scores weighted less
- [ ] Verify weighted averages by session type
- [ ] Verify all weighted averages combined
- [ ] Verify decay multiplier decreases over index

### 3.7 Analytics (Manual Verification)
- [ ] `computeSummary` returns correct mean, median, min, max, count
- [ ] `computeCategoryBreakdown` groups scores by category with per-category average
- [ ] `computeAverageScore` returns simple average

---

## Day 7 — Full Pipeline, Edge Cases & Exit Criteria

### 7.1 Integration Chain
- [ ] Simulation → Evaluation → Proof → Readiness Rollup → Offer Readiness produces valid results for all 5 session types
- [ ] DSA session routes to dsa-interview proof type
- [ ] LLD session routes to lld-interview proof type
- [ ] HLD session routes to hld-interview proof type
- [ ] Behavioral session routes to behavioral-interview proof type
- [ ] Mixed-Architect session routes to mixed-architect-interview proof type

### 7.2 Edge Cases
- [ ] Empty response submission is blocked (button disabled)
- [ ] Session with 0 responses and "Complete session" still produces evaluation
- [ ] Session with 0 responses and "Timeout session" still produces evaluation
- [ ] Rapidly clicking "Start New Session" doesn't cause stale state
- [ ] Navigating away and back during in-progress session loses state (expected — no persistence)
- [ ] Tab/Window close during session loses state (expected — no persistence)

### 7.3 Demo Data Integrity
- [ ] `?demo=1` always produces same deterministic output
- [ ] `?demo=weak-area` always produces same deterministic output
- [ ] Default empty mode always shows zero readiness scores
- [ ] After save → reload → reset → reload, values return to defaults

### 7.4 Persistence Boundaries
- [ ] Derived outputs (Today Plan, readiness snapshot, hard gates, roadmap, missions) are NOT persisted
- [ ] Normalized progress input IS persisted across reloads
- [ ] Interview session state is NOT persisted across reloads

### 7.5 Navigation
- [ ] Header mobile nav includes "Founder Beta" → `/founder-beta`
- [ ] Sidebar includes "Founder Beta" → `/founder-beta`
- [ ] `/founder-beta` card links to `/founder-beta/interview`

### 7.6 Exit Criteria (Validation Complete)
- [ ] All Day 1 items pass
- [ ] All Day 3 items pass
- [ ] All Day 7 items pass
- [ ] No unexpected console errors during any test
- [ ] No regressions in existing test suite

---

## Verdict

- **Pass**: Founder Beta is validated and ready for the next phase of development.
- **Fail**: Log all failures, prioritize by severity, and retest before proceeding.

## Notes

- Score decay and analytics are verified via unit tests, not UI. The helpers are deterministic and tested; UI integration is deferred.
- Rubric scoring uses sample scores (always 3/5). Real evaluation will require manual rubric input.
- Analytics/decay UI wiring is the single largest gap for post-validation iteration.
