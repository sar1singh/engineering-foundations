import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const staffReferences = [
  { id: "reference-staff-manager-path", title: "The Manager's Path", url: "https://www.oreilly.com/library/view/the-managers-path/9781491973882/", sourceType: "article" as const, usage: "Leadership progression reference for engineering management responsibilities." },
  { id: "reference-staff-staffeng", title: "StaffEng", url: "https://staffeng.com/", sourceType: "article" as const, usage: "Public reference for staff engineer archetypes, stories, and scope." },
  { id: "reference-staff-google-sre", title: "Google SRE Book", url: "https://sre.google/sre-book/introduction/", sourceType: "docs" as const, usage: "Reference for reliability leadership, incidents, and operational excellence." },
  { id: "reference-staff-aws-well-architected", title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/en_us/wellarchitected/latest/framework/welcome.html", sourceType: "docs" as const, usage: "Architecture-review reference for senior/staff/principal engineer decision-making." }
];

function staffProblems(slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    { id: `problem-staff-${slug}-easy`, title: `${title} brief`, difficulty: "easy", tags: ["staff", "em", slug], prompt: `Write a one-page brief for ${title}: context, decision, risks, and next step.`, expectedSignals: ["Clear context", "Decision", "Risks", "Next step"] },
    { id: `problem-staff-${slug}-medium`, title: `${title} operating plan`, difficulty: "medium", tags: ["staff", "principal", slug], prompt: `Create an operating plan for ${title} across engineering, product, and operations.`, expectedSignals: ["Stakeholders", "Milestones", "Trade-offs", "Metrics"] },
    { id: `problem-staff-${slug}-hard`, title: `${title} executive review`, difficulty: "hard", tags: ["em", "principal", slug], prompt: `Prepare an executive/staff review for ${title}. Include business impact, technical options, recommendation, and rollout risk.`, expectedSignals: ["Business impact", "Options", "Recommendation", "Risk plan"] }
  ];
}

function staffTopic(order: number, slug: string, title: string, definition: string, mentalModel: string, theory: string): SyllabusTopic {
  return {
    id: `syllabus-staff-em-${slug}`,
    slug,
    title,
    order,
    sourcePath: "00-control/master-roadmap/13-senior-skills/INDEX.md",
    definition,
    whyItMatters: `${title} is required for senior engineer, staff/principal engineer, solution architect, and EM readiness.`,
    mentalModel,
    theory: `${theory}\n\nVisual model: context -> options -> decision -> alignment -> execution -> learning.`,
    codeExamples: [{ id: `example-staff-${slug}`, title: `${title} template`, language: "text", code: `Context:\nDecision needed:\nOptions:\nTrade-offs:\nRecommendation:\nRisks:\nMetrics:\nOwner/date:`, explanation: `Reusable leadership/design template for ${title}.`, runnable: false }],
    practiceProblems: staffProblems(slug, title),
    interviewQuestions: [`Tell me about a time you handled ${title}.`, `How do you balance technical and business trade-offs?`, `How do you create alignment without authority?`],
    commonMistakes: ["Only giving technical detail", "No stakeholder framing", "No measurable outcome", "No risk/rollback plan"],
    productionUseCases: ["Architecture reviews", "Incident leadership", "Roadmap planning", "Hiring loops", "Executive communication"],
    revisionPrompts: [`Write one STAR story for ${title}.`, `Name one metric for ${title}.`, `Explain ${title} to a non-engineering stakeholder.`],
    reviewPrompts: [{ id: `review-staff-${slug}-mentor`, reviewerRole: "mentor", prompt: `Review ${title} like a staff/principal/EM interview answer.`, rubric: ["Business context", "Technical judgment", "Leadership behavior", "Measurable result"] }],
    references: [...staffReferences, { id: `reference-staff-${slug}-local-roadmap`, title: "EngineeringOS Senior Skills master roadmap", url: "00-control/master-roadmap/13-senior-skills/INDEX.md", sourceType: "roadmap", usage: "Local placeholder for senior-skill source detail; public sources fill current gap." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const staffPrincipalEmTopics: SyllabusTopic[] = [
  staffTopic(1, "architecture-review", "Architecture Review", "Architecture review evaluates whether a design meets requirements, constraints, and operational standards.", "Review the decision, not the diagram alone.", "Strong reviews cover requirements, alternatives, failure modes, security, cost, migration, and observability."),
  staffTopic(2, "technical-strategy", "Technical Strategy", "Technical strategy turns business goals and technical constraints into a sequenced engineering direction.", "Strategy is a set of choices and non-choices.", "Staff/principal engineers connect product goals, platform health, team capacity, risk, and sequencing."),
  staffTopic(3, "incident-leadership", "Incident Leadership", "Incident leadership coordinates diagnosis, mitigation, communication, and learning during production failure.", "Stabilize first, then understand, then prevent recurrence.", "Good incident leaders assign roles, reduce ambiguity, communicate status, make reversible decisions, and drive postmortems."),
  staffTopic(4, "roadmap-execution", "Roadmap Execution", "Roadmap execution turns strategy into milestones, owners, dependencies, and measurable delivery.", "Plans are alignment tools, not wish lists.", "EM/staff readiness requires breaking ambiguous goals into phases, managing dependencies, and adjusting as evidence changes."),
  staffTopic(5, "hiring-interview-calibration", "Hiring and Interview Calibration", "Hiring calibration aligns interviewers on role expectations, signal quality, rubrics, and fair evaluation.", "Hire for consistent signal, not interviewer vibes.", "Senior leaders design loops, train interviewers, calibrate bars, and separate evidence from opinion."),
  staffTopic(6, "stakeholder-communication", "Stakeholder Communication", "Stakeholder communication keeps product, leadership, customers, and engineering aligned on decisions and trade-offs.", "Translate technical reality into decision-ready language.", "Strong communication names impact, options, recommendation, risk, timeline, and asks.")
];
