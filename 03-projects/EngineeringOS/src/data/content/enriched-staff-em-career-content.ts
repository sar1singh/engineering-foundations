import type { EnrichedDesignCapstone, EnrichedTopicContent } from "@/types/enriched-content";

function capstone(input: EnrichedDesignCapstone): EnrichedDesignCapstone {
  return input;
}

const architectureReview = capstone({
  id: "capstone-staff-architecture-review",
  prompt: "Run an architecture review for a proposed multi-tenant SaaS feature before it reaches production.",
  sourceRefs: ["tech-interview-handbook", "awesome-scalability", "system-design-primer"],
  requirements: ["Validate requirements and constraints", "Identify alternatives", "Review security, privacy, cost, reliability, and migration", "Decide with explicit follow-ups"],
  approach: ["Start with business outcome", "List non-negotiable constraints", "Ask for alternatives rejected", "Probe failure modes and ownership", "End with decision, risks, and next checkpoints"],
  designBreakdown: ["Problem statement", "Architecture diagram review", "Data ownership", "API contracts", "Operational readiness", "Migration and rollback", "Decision record"],
  tradeoffs: ["Blocking review improves safety but can slow teams", "Lightweight ADRs scale better than meetings for every decision", "Standards help consistency but must allow justified exceptions"],
  failureModes: ["Review becomes personal criticism", "Security reviewed too late", "No owner for risks", "Decision not written down", "Migration plan missing"],
  security: ["Threat model tenant boundaries", "PII handling", "IAM/service permissions", "Auditability", "Abuse and rate limits"],
  observability: ["Launch SLOs", "Dashboards before rollout", "Alert ownership", "Experiment guardrails", "Rollback signal"],
  awsVariant: ["Review IAM policies, VPC boundaries, KMS use, CloudTrail, CloudWatch alarms, RDS/DynamoDB scaling, and cost allocation tags"],
  rubric: ["Business alignment", "Alternatives considered", "Failure/security/cost covered", "Clear decision log", "Actionable follow-ups"],
  expectedSeniorSignals: ["Calm challenge", "Decision quality", "Cross-functional clarity", "Risk ownership", "Pragmatism"]
});

const technicalStrategy = capstone({
  id: "capstone-principal-technical-strategy",
  prompt: "Create a six-month technical strategy for reducing platform delivery drag while the business expands into enterprise customers.",
  sourceRefs: ["roadmap-sh", "awesome-scalability", "tech-interview-handbook"],
  requirements: ["Business goal and non-goals", "Current-state diagnosis", "Strategic bets", "Sequenced roadmap", "Success metrics", "Explicit trade-offs"],
  approach: ["Anchor on business outcomes", "Name the constraints and debt that change delivery speed", "Compare two or three strategic options", "Choose a small number of bets", "Define milestones, owners, metrics, and review cadence"],
  designBreakdown: ["North-star outcome", "Current constraints", "Option set", "Recommended strategy", "Non-goals", "Investment sequence", "Decision log"],
  tradeoffs: ["Platform investment slows feature delivery before it improves throughput", "Standardization reduces local autonomy but lowers support cost", "A narrower strategy is easier to execute but may leave visible gaps"],
  failureModes: ["Strategy becomes a wish list", "No capacity model", "No stakeholder disagreement recorded", "Metrics measure activity instead of outcomes", "Teams cannot explain what changed"],
  security: ["Include enterprise security readiness", "Define data-handling boundaries", "Track risk exceptions", "Plan audit evidence collection"],
  observability: ["Lead time", "Change failure rate", "Adoption by team", "Support ticket trend", "Enterprise deal blockers removed"],
  awsVariant: ["Map strategy to Well-Architected gaps, account structure, identity, networking, observability, reliability, and cost governance"],
  rubric: ["Business-linked choices", "Clear non-goals", "Real sequencing", "Metrics that can move", "Named owners and review cadence"],
  expectedSeniorSignals: ["Strategic restraint", "Systems thinking", "Executive clarity", "Trade-off ownership", "Measurable execution"]
});

const incidentLeadership = capstone({
  id: "capstone-em-incident-leadership",
  prompt: "Lead a sev-1 incident where checkout errors spike after a deployment and customer support is escalating.",
  sourceRefs: ["tech-interview-handbook", "awesome-scalability"],
  requirements: ["Restore service safely", "Coordinate roles", "Communicate status", "Preserve evidence", "Run blameless follow-up"],
  approach: ["Declare severity and incident commander", "Stabilize with rollback or mitigation", "Split investigation from communication", "Track timeline and decisions", "Close with customer and internal updates"],
  designBreakdown: ["Incident commander", "Tech lead", "Comms owner", "Scribe", "Mitigation path", "Post-incident review", "Action-item tracking"],
  tradeoffs: ["Rollback may restore service before root cause is known", "Detailed updates improve trust but distract engineers if unmanaged", "Fast mitigation can create cleanup debt"],
  failureModes: ["Too many people changing production", "No single commander", "Silent stakeholder channel", "Skipping postmortem", "Action items never land"],
  security: ["Avoid sharing sensitive logs broadly", "Protect incident credentials", "Audit emergency access", "Review customer-impact messaging"],
  observability: ["Error budget burn", "Checkout success rate", "Deployment markers", "Provider latency", "Rollback completion"],
  awsVariant: ["Use CloudWatch dashboards, deployment rollback, CloudTrail audit, feature flags, Route 53/ALB health checks, and support runbooks"],
  rubric: ["Restores service", "Keeps communication clear", "Avoids blame", "Captures evidence", "Creates durable fixes"],
  expectedSeniorSignals: ["Calm prioritization", "Role clarity", "Customer empathy", "Learning culture", "Operational discipline"]
});

const roadmapExecution = capstone({
  id: "capstone-em-roadmap-execution-plan",
  prompt: "Turn an ambiguous reliability-and-growth goal into a quarterly roadmap with milestones, dependencies, and operating cadence.",
  sourceRefs: ["roadmap-sh", "tech-interview-handbook", "awesome-scalability"],
  requirements: ["Outcome metric", "Milestones", "Dependency map", "Resourcing assumptions", "Risk register", "Weekly execution rhythm"],
  approach: ["Define the outcome and deadline", "Break work into reversible milestones", "Identify dependency owners", "Choose leading indicators", "Run weekly risk review and replan from evidence"],
  designBreakdown: ["Outcome brief", "Workstream map", "RACI", "Milestone plan", "Dependency board", "Risk register", "Exec update"],
  tradeoffs: ["Detailed planning improves coordination but can create false certainty", "Parallel work speeds delivery but raises integration risk", "Scope cuts protect dates but may reduce business value"],
  failureModes: ["No single accountable owner", "Hidden cross-team dependency", "Milestones describe tasks not outcomes", "Risk escalates too late", "Status reports hide decision needs"],
  security: ["Gate security-sensitive launch items", "Assign owner for privacy review", "Track access and data-migration approvals", "Include rollback criteria for risky releases"],
  observability: ["Milestone burndown", "Blocked dependency age", "Launch readiness score", "Defect escape rate", "Decision latency"],
  awsVariant: ["Plan infra quotas, deployment windows, environment promotion, rollback automation, cost guardrails, and production readiness reviews"],
  rubric: ["Clear outcome", "Executable milestones", "Dependency realism", "Risk escalation", "Evidence-based replanning"],
  expectedSeniorSignals: ["Execution discipline", "Prioritization", "Cross-team alignment", "Risk transparency", "Adaptability"]
});

const hiringCalibration = capstone({
  id: "capstone-em-hiring-interview-calibration",
  prompt: "Design and calibrate a hiring loop for Senior Backend, Staff Engineer, or EM candidates with consistent evidence standards.",
  sourceRefs: ["tech-interview-handbook", "roadmap-sh"],
  requirements: ["Role scorecard", "Interview loop", "Question bank", "Evidence rubric", "Debrief protocol", "Bias checks"],
  approach: ["Define role outcomes first", "Map each round to distinct signals", "Train interviewers on evidence capture", "Calibrate borderline examples", "Review pass-through and false-negative patterns"],
  designBreakdown: ["Role expectations", "Round matrix", "Rubric anchors", "Interviewer guide", "Debrief packet", "Calibration examples", "Process health dashboard"],
  tradeoffs: ["A structured loop improves fairness but takes interviewer training", "Harder rubrics reduce false positives but can reject coachable candidates", "More rounds add signal but increase candidate fatigue"],
  failureModes: ["Interviewers duplicate signals", "Feedback uses vibes instead of evidence", "Bar differs by interviewer", "Candidate experience is ignored", "No loop retrospectives"],
  security: ["Keep candidate notes private", "Avoid collecting irrelevant sensitive attributes", "Control access to debrief documents", "Use compliant retention policies"],
  observability: ["Pass-through rate by stage", "Interviewer disagreement rate", "Offer acceptance", "Candidate satisfaction", "New-hire ramp signal"],
  rubric: ["Role-linked signals", "Fair evidence capture", "Consistent calibration", "Candidate respect", "Process improvement loop"],
  expectedSeniorSignals: ["Judgment calibration", "Fairness", "Role clarity", "Coaching interviewers", "Hiring bar ownership"]
});

const stakeholderCommunication = capstone({
  id: "capstone-staff-stakeholder-communication",
  prompt: "Write a decision-ready stakeholder update for a delayed launch with technical risk, customer impact, and options.",
  sourceRefs: ["tech-interview-handbook", "awesome-scalability", "roadmap-sh"],
  requirements: ["Audience-specific summary", "Impact", "Options", "Recommendation", "Timeline", "Clear ask"],
  approach: ["Lead with decision needed", "Translate technical risk into business impact", "Offer options with consequences", "Recommend one path", "Name owner, date, and communication channel"],
  designBreakdown: ["Executive summary", "Customer impact", "Technical facts", "Options table", "Recommendation", "Risks", "Next update cadence"],
  tradeoffs: ["Concise updates omit detail but improve decision speed", "Escalating early can feel uncomfortable but prevents surprises", "One recommendation creates clarity but must still show alternatives"],
  failureModes: ["Too much implementation detail", "No explicit ask", "Optimistic timeline without risk", "Stakeholders learn late", "Disagreement stays private until launch"],
  security: ["Limit sensitive incident details", "Avoid customer-identifying data", "Use approved external messaging", "Keep legal/compliance stakeholders in required paths"],
  observability: ["Decision turnaround time", "Stakeholder acknowledgement", "Open risks closed", "Launch confidence trend", "Escalation recurrence"],
  rubric: ["Decision-ready", "Business impact clear", "Options and recommendation", "Risk honesty", "Cadence and ownership"],
  expectedSeniorSignals: ["Clarity under pressure", "Audience empathy", "Influence without authority", "Executive presence", "Trust building"]
});

const managementBasics = capstone({
  id: "capstone-em-performance-mentoring-conflict",
  prompt: "Handle a quarter where a strong engineer is missing commitments, mentoring load is uneven, and product pressure is creating conflict.",
  sourceRefs: ["tech-interview-handbook", "roadmap-sh"],
  requirements: ["Performance facts", "Coaching plan", "Mentoring structure", "Conflict diagnosis", "Follow-up cadence", "Fair escalation path"],
  approach: ["Separate observable behavior from interpretation", "Clarify expectations and support", "Create a short feedback loop", "Redistribute mentoring load intentionally", "Resolve conflict around shared goals and decision rights"],
  designBreakdown: ["Expectation document", "One-on-one plan", "Mentoring map", "Conflict brief", "Decision-rights agreement", "Performance checkpoint", "Escalation notes"],
  tradeoffs: ["Direct feedback can feel tense but prevents ambiguity", "Protecting one engineer may overload others", "Fast escalation creates clarity but can reduce psychological safety if mishandled"],
  failureModes: ["Feedback is too vague", "Manager delays hard conversations", "Mentoring becomes invisible work", "Conflict is personalized", "No written expectations"],
  security: ["Keep performance notes need-to-know", "Avoid sharing private HR details", "Use approved people-process channels", "Document only behavior and business impact"],
  observability: ["Commitment reliability", "Feedback loop completion", "Mentoring distribution", "Conflict recurrence", "Team health pulse"],
  rubric: ["Specific behavior", "Support plus accountability", "Fair mentoring load", "Conflict de-escalation", "Documented follow-through"],
  expectedSeniorSignals: ["Kind directness", "Fairness", "Coaching skill", "Team-system awareness", "Accountability"]
});

const careerAssets = capstone({
  id: "capstone-career-assets-faang-ready",
  prompt: "Create a role-targeted career asset pack for Senior Engineer, Staff Engineer, Solution Architect, or EM interviews.",
  sourceRefs: ["tech-interview-handbook", "roadmap-sh"],
  requirements: ["Target role narrative", "Impact-based resume bullets", "LinkedIn alignment", "GitHub proof-of-work", "STAR stories", "System-design portfolio"],
  approach: ["Pick one target role", "Map evidence to interview rounds", "Rewrite bullets with scope, action, and outcome", "Create proof-of-work artifacts", "Practice explain-back stories"],
  designBreakdown: ["Resume", "LinkedIn headline/about", "GitHub README", "Architecture case-study doc", "Behavioral story bank", "Mock interview scorecard"],
  tradeoffs: ["Broad positioning reaches more roles but feels generic", "Narrow positioning improves conversion but needs company targeting", "Public proof-of-work helps credibility but needs polish"],
  failureModes: ["Resume lists tasks instead of outcomes", "GitHub project lacks README/tests", "Stories are too long", "Claims cannot be defended in interview"],
  security: ["Remove employer secrets", "Anonymize production metrics", "Do not publish proprietary diagrams or customer data"],
  observability: ["Application response rate", "Recruiter reply rate", "Mock score trend", "Weak-round tracker"],
  rubric: ["Clear target role", "Quantified impact", "Evidence for each interview round", "No confidential data", "Mock-ready stories"],
  expectedSeniorSignals: ["Executive narrative", "Proof over claims", "Self-awareness", "Role fit", "Communication clarity"]
});

const starStories = capstone({
  id: "capstone-career-star-story-bank",
  prompt: "Build a STAR+learning story bank for conflict, failure, mentoring, incident leadership, stakeholder influence, and technical strategy.",
  sourceRefs: ["tech-interview-handbook", "roadmap-sh"],
  requirements: ["Six story outlines", "Measurable results", "Personal actions", "Learning", "Role-signal mapping", "Concise spoken version"],
  approach: ["Inventory real projects", "Choose stories with decision pressure", "Write situation/task/action/result/learning", "Add metrics and trade-offs", "Practice two-minute and five-minute versions"],
  designBreakdown: ["Story index", "STAR+L template", "Metric evidence", "Senior signal tag", "Follow-up questions", "Redaction checklist", "Practice notes"],
  tradeoffs: ["Detailed stories prove depth but can ramble", "Polished delivery helps clarity but must stay authentic", "Some sensitive wins need anonymized framing"],
  failureModes: ["Team-only credit", "No measurable result", "Blaming other groups", "No reflection", "Same story reused for every prompt"],
  security: ["Redact customer names", "Round confidential metrics", "Avoid proprietary architecture", "Do not disclose HR-sensitive conflict details"],
  observability: ["Mock score per story", "Follow-up answer quality", "Filler-word count", "Time-to-answer", "Interviewer concern themes"],
  rubric: ["Specific ownership", "Clear conflict or constraint", "Measurable outcome", "Learning included", "Target role signal"],
  expectedSeniorSignals: ["Self-awareness", "Influence", "Ownership", "Learning agility", "Business impact"]
});

const mockCalibration = capstone({
  id: "capstone-career-mock-interview-calibration",
  prompt: "Run a mock interview calibration cycle that turns practice recordings into role-specific next drills.",
  sourceRefs: ["tech-interview-handbook", "roadmap-sh"],
  requirements: ["Round rubric", "Timed prompt", "Evidence notes", "Score", "Gap diagnosis", "Retest plan"],
  approach: ["Pick one target round", "Record or observe the answer", "Score only observable evidence", "Identify the highest-leverage gap", "Schedule a retest with a narrower drill"],
  designBreakdown: ["Prompt", "Target role", "Rubric", "Transcript notes", "Evidence table", "Score decision", "Next drill backlog"],
  tradeoffs: ["Strict scoring can feel harsh but improves readiness", "Frequent mocks help fluency but need focused remediation", "Self-calibration is convenient but benefits from external reviewers"],
  failureModes: ["Feedback is generic", "Score ignores target role", "No retest date", "Practice avoids weak areas", "Rubric changes every session"],
  security: ["Do not upload confidential work examples", "Get consent before sharing recordings", "Remove candidate/private interviewer notes", "Store feedback with limited access"],
  observability: ["Score trend", "Retest pass rate", "Weak-signal recurrence", "Time management", "Confidence calibration"],
  rubric: ["Evidence-based scoring", "Role-specific bar", "Actionable next drill", "Retest scheduled", "Trend visible"],
  expectedSeniorSignals: ["Coachability", "Calibration honesty", "Structured reflection", "Deliberate practice", "Readiness judgment"]
});

export const enrichedStaffEmCareerContent = [
  {
    topicSlug: "architecture-review",
    sourceRefs: architectureReview.sourceRefs,
    beginnerExplanation: "Architecture review is a structured way to improve a design before production risk becomes real.",
    deepExplanation: "Staff-level review is not about showing superiority. It is about surfacing tradeoffs, making risks explicit, and helping the team make a durable decision.",
    whyInterviewersAsk: "Senior/staff interviews test judgment, influence, risk framing, and communication under ambiguity.",
    prerequisites: ["System design basics", "Security basics", "Operational metrics"],
    skipForNow: ["Formal enterprise architecture frameworks"],
    roleRelevance: ["Staff engineer", "Principal engineer", "EM", "Solution architect"],
    estimatedTimeMinutes: 140,
    interviewFrequency: "high",
    enrichedProblems: [],
    designCapstones: [architectureReview]
  },
  {
    topicSlug: "technical-strategy",
    sourceRefs: technicalStrategy.sourceRefs,
    beginnerExplanation: "Technical strategy explains which engineering bets matter, which do not, and how those choices support the business.",
    deepExplanation: "At Staff/Principal level, strategy is an operating artifact: it ties product goals, architecture constraints, team capacity, risk, sequencing, and measurable outcomes into choices people can execute.",
    whyInterviewersAsk: "It tests whether you can move beyond local design decisions into durable direction, alignment, and prioritization.",
    prerequisites: ["Architecture review", "Roadmap basics", "Product metrics"],
    skipForNow: ["Multi-year enterprise portfolio planning"],
    roleRelevance: ["Principal engineer", "Staff engineer", "EM", "Solution architect"],
    estimatedTimeMinutes: 180,
    interviewFrequency: "high",
    enrichedProblems: [],
    designCapstones: [technicalStrategy]
  },
  {
    topicSlug: "incident-leadership",
    sourceRefs: incidentLeadership.sourceRefs,
    beginnerExplanation: "Incident leadership is the practice of restoring service while keeping people aligned and customers informed.",
    deepExplanation: "The best incident leaders reduce chaos: one commander, clear roles, reversible mitigations, honest communication, and follow-through after the incident.",
    whyInterviewersAsk: "It reveals maturity, prioritization, communication, and production ownership.",
    prerequisites: ["Monitoring", "Deployments", "SLO basics"],
    skipForNow: ["Regulated incident reporting detail"],
    roleRelevance: ["EM", "Staff engineer", "Senior engineer", "Solution architect"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "medium",
    enrichedProblems: [],
    designCapstones: [incidentLeadership]
  },
  {
    topicSlug: "roadmap-execution",
    sourceRefs: roadmapExecution.sourceRefs,
    beginnerExplanation: "Roadmap execution turns an intent into milestones, owners, dependencies, risks, and a cadence for learning.",
    deepExplanation: "Strong execution planning makes uncertainty visible. It defines what will be true at each milestone, which dependencies can break the plan, and when leaders must make decisions.",
    whyInterviewersAsk: "Staff/EM loops look for candidates who can deliver through ambiguity without hiding risk or confusing activity with outcomes.",
    prerequisites: ["Technical strategy", "Stakeholder communication", "Delivery metrics"],
    skipForNow: ["Enterprise PMO tooling"],
    roleRelevance: ["EM", "Staff engineer", "Principal engineer", "Tech lead"],
    estimatedTimeMinutes: 160,
    interviewFrequency: "high",
    enrichedProblems: [],
    designCapstones: [roadmapExecution]
  },
  {
    topicSlug: "hiring-interview-calibration",
    sourceRefs: hiringCalibration.sourceRefs,
    beginnerExplanation: "Hiring calibration creates a consistent bar by mapping each interview round to evidence, rubrics, and role expectations.",
    deepExplanation: "Senior hiring work is a system: define role outcomes, design distinct signal-gathering rounds, train interviewers, separate evidence from opinion, and improve the loop from observed outcomes.",
    whyInterviewersAsk: "EM and Staff candidates are expected to raise the hiring bar without relying on vibes, favoritism, or duplicated interviews.",
    prerequisites: ["Role expectations", "Rubric design", "Behavioral interviewing"],
    skipForNow: ["Legal policy design"],
    roleRelevance: ["EM", "Staff engineer", "Principal engineer", "Hiring manager"],
    estimatedTimeMinutes: 150,
    interviewFrequency: "medium",
    enrichedProblems: [],
    designCapstones: [hiringCalibration]
  },
  {
    topicSlug: "stakeholder-communication",
    sourceRefs: stakeholderCommunication.sourceRefs,
    beginnerExplanation: "Stakeholder communication translates technical reality into decision-ready language for product, leadership, support, customers, and engineering.",
    deepExplanation: "The senior move is to make the decision easy to see: impact, options, recommendation, risk, timeline, owner, and the specific ask.",
    whyInterviewersAsk: "It tests whether you can create alignment and trust when technical details, business pressure, and uncertainty collide.",
    prerequisites: ["Technical strategy", "Incident leadership", "Product context"],
    skipForNow: ["Public relations crisis management"],
    roleRelevance: ["Staff engineer", "Principal engineer", "EM", "Solution architect"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "high",
    enrichedProblems: [],
    designCapstones: [stakeholderCommunication]
  },
  {
    topicSlug: "performance-management-basics",
    sourceRefs: managementBasics.sourceRefs,
    beginnerExplanation: "Performance management basics mean setting expectations, giving timely feedback, offering support, and documenting follow-through fairly.",
    deepExplanation: "For EM readiness, performance, mentoring, and conflict handling are connected systems. The manager clarifies expectations, protects fairness, creates feedback loops, and keeps conflict focused on goals and behavior.",
    whyInterviewersAsk: "People-leadership interviews look for kind directness, accountability, fairness, and conflict de-escalation.",
    prerequisites: ["One-on-one basics", "Feedback framing", "Team delivery context"],
    skipForNow: ["Company-specific HR procedures"],
    roleRelevance: ["EM", "Tech lead", "Staff engineer mentor"],
    estimatedTimeMinutes: 150,
    interviewFrequency: "medium",
    enrichedProblems: [],
    designCapstones: [managementBasics]
  },
  {
    topicSlug: "resume-linkedin-github",
    sourceRefs: careerAssets.sourceRefs,
    beginnerExplanation: "Career assets translate your experience into evidence recruiters and interviewers can quickly trust.",
    deepExplanation: "For a job-switch outcome, every claim should map to an interview round: coding, system design, leadership, delivery, or communication.",
    whyInterviewersAsk: "The asset pack shapes whether you get interviews and whether your stories sound senior enough.",
    prerequisites: ["Target role selection", "Project history", "Impact metrics"],
    skipForNow: ["Personal branding theater"],
    roleRelevance: ["Senior engineer", "Staff engineer", "Solution architect", "EM"],
    estimatedTimeMinutes: 180,
    interviewFrequency: "very-high",
    enrichedProblems: [],
    designCapstones: [careerAssets]
  },
  {
    topicSlug: "behavioral-star-stories",
    sourceRefs: starStories.sourceRefs,
    beginnerExplanation: "STAR stories turn real work into concise evidence of ownership, judgment, influence, and learning.",
    deepExplanation: "Senior stories need more than chronology. They should show the constraint, your personal decision, the trade-off, the measurable result, and what changed afterward.",
    whyInterviewersAsk: "Behavioral rounds are how interviewers test leadership maturity, collaboration, conflict handling, and self-awareness.",
    prerequisites: ["Project inventory", "Impact metrics", "Target role expectations"],
    skipForNow: ["Memorized scripts"],
    roleRelevance: ["Senior engineer", "Staff engineer", "Principal engineer", "EM"],
    estimatedTimeMinutes: 140,
    interviewFrequency: "very-high",
    enrichedProblems: [],
    designCapstones: [starStories]
  },
  {
    topicSlug: "mock-interview-calibration",
    sourceRefs: mockCalibration.sourceRefs,
    beginnerExplanation: "Mock interview calibration converts practice into evidence-based feedback, targeted drills, and a retest plan.",
    deepExplanation: "A calibrated mock separates what happened from how it felt. It captures observable evidence, scores it against a role-specific bar, and turns the weakest signal into the next drill.",
    whyInterviewersAsk: "Readiness depends on honest self-assessment, deliberate practice, and the ability to close gaps before the real loop.",
    prerequisites: ["Round rubrics", "Practice recordings", "Feedback discipline"],
    skipForNow: ["Over-optimizing for one interviewer style"],
    roleRelevance: ["All interview tracks", "Mentors", "Hiring interviewers"],
    estimatedTimeMinutes: 120,
    interviewFrequency: "very-high",
    enrichedProblems: [],
    designCapstones: [mockCalibration]
  }
] satisfies EnrichedTopicContent[];
