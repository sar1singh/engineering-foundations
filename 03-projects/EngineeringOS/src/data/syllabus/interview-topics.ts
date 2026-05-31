import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const interviewReferences = [
  { id: "reference-interview-neetcode", title: "NeetCode Roadmap", url: "https://neetcode.io/roadmap", sourceType: "practice" as const, usage: "Coding interview pattern sequence for 80/20 DSA preparation." },
  { id: "reference-interview-system-design-primer", title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", sourceType: "roadmap" as const, usage: "Public system design interview reference for HLD concepts and case-study practice." },
  { id: "reference-interview-roadmap", title: "roadmap.sh Backend Roadmap", url: "https://roadmap.sh/backend", sourceType: "roadmap" as const, usage: "Cross-check backend interview foundations and topic ordering." },
  { id: "reference-interview-staffeng", title: "StaffEng", url: "https://staffeng.com/", sourceType: "article" as const, usage: "Reference for Staff-plus stories, scope, and leadership expectations." }
];

function interviewProblems(slug: string, title: string): SyllabusPracticeProblem[] {
  return [
    { id: `problem-interview-${slug}-easy`, title: `${title} answer skeleton`, difficulty: "easy", tags: ["interviews", slug, "calibration"], prompt: `Write a structured answer skeleton for ${title}: clarify, solve, trade-off, verify, and follow-up.`, expectedSignals: ["Structure", "Signal", "Verification"] },
    { id: `problem-interview-${slug}-medium`, title: `${title} mock round`, difficulty: "medium", tags: ["interviews", slug, "mock-interview"], prompt: `Run a 30-minute mock-interview plan for ${title}. Include rubric, timing, expected signals, and feedback notes.`, expectedSignals: ["Timing", "Rubric", "Feedback"] },
    { id: `problem-interview-${slug}-hard`, title: `${title} calibration review`, difficulty: "hard", tags: ["interviews", slug, "calibration"], prompt: `Calibrate a borderline candidate or self-performance for ${title}. Separate evidence, concerns, hire/no-hire signal, and next practice action.`, expectedSignals: ["Evidence", "Concerns", "Decision signal", "Practice action"] }
  ];
}

function interviewTopic(input: {
  order: number;
  slug: string;
  title: string;
  definition: string;
  mentalModel: string;
  theory: string;
  example: string;
  interviewQuestions: string[];
  commonMistakes: string[];
  productionUseCases: string[];
}): SyllabusTopic {
  return {
    id: `syllabus-interviews-${input.slug}`,
    slug: input.slug,
    title: input.title,
    order: input.order,
    sourcePath: "00-control/master-roadmap/14-interviews/INDEX.md",
    definition: input.definition,
    whyItMatters: `${input.title} converts learning into interview performance, recruiter signal, and offer readiness.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nInterview loop: clarify -> solve -> explain trade-offs -> verify -> reflect -> schedule next targeted practice.`,
    codeExamples: [{ id: `example-interview-${input.slug}`, title: `${input.title} rubric template`, language: "text", code: input.example, explanation: `Reusable interview rubric/template for ${input.title}.`, runnable: false }],
    practiceProblems: interviewProblems(input.slug, input.title),
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [`Record one ${input.title} answer.`, `Score the answer with a rubric.`, `Write the next practice action.`],
    reviewPrompts: [{ id: `review-interview-${input.slug}`, reviewerRole: "mentor", prompt: `Review ${input.title} like an interviewer calibration packet.`, rubric: ["Evidence is specific", "Reasoning is audible", "Trade-offs are named", "Next action is targeted"] }],
    references: [...interviewReferences, { id: `reference-interview-${input.slug}-roadmap`, title: "EngineeringOS Interviews master roadmap", url: "00-control/master-roadmap/14-interviews/INDEX.md", sourceType: "roadmap", usage: "Local source path for first-class interview operations coverage." }],
    progressSignals: ["read_definition", "read_theory", "studied_code_example", "ran_code_example", "solved_easy_problem", "solved_medium_problem", "solved_hard_problem", "submitted_explain_back", "completed_mock_review", "scheduled_revision"]
  };
}

export const interviewPreparationTopics: SyllabusTopic[] = [
  interviewTopic({
    order: 1,
    slug: "coding-round-strategy",
    title: "Coding Round Strategy",
    definition: "Coding round strategy is the repeatable process for clarifying, choosing a pattern, coding, testing, and explaining complexity under time pressure.",
    mentalModel: "Interviews reward visible reasoning and correctness under constraints, not silent hero coding.",
    theory: "Use a fixed loop: restate problem, ask constraints, identify pattern, sketch examples, code small, test edges, explain complexity. For Senior Backend, prioritize arrays/hash maps, binary search, trees, graphs, DP basics, and clean communication.",
    example: "Rubric:\n- Clarifies input/output and constraints\n- States brute force and optimized idea\n- Codes readable solution\n- Tests happy path and edge cases\n- Explains time/space\n- Handles interviewer follow-up",
    interviewQuestions: ["How do you approach an unseen problem?", "When do you mention brute force?", "How do you recover after getting stuck?", "What makes a coding answer senior-level?"],
    commonMistakes: ["Coding before clarifying", "No edge tests", "Silent debugging", "Ignoring complexity", "Jumping patterns without proof"],
    productionUseCases: ["Coding interviews", "Mock interview mode", "DSA revision", "Recruiter preparation"]
  }),
  interviewTopic({
    order: 2,
    slug: "system-design-round-strategy",
    title: "System Design Round Strategy",
    definition: "System design round strategy is the structured method for turning vague product prompts into requirements, architecture, trade-offs, scale estimates, and failure handling.",
    mentalModel: "A system design interview is a decision-making conversation, not a diagram contest.",
    theory: "Use requirements, scale, APIs, data model, high-level components, deep dives, bottlenecks, reliability, security, observability, and cost. For AWS/HLD, connect components to concrete services only after requirements are clear.",
    example: "40-minute flow:\n0-5 clarify requirements\n5-10 capacity/API/data model\n10-20 high-level design\n20-30 deep dive bottleneck\n30-36 reliability/security/observability\n36-40 trade-offs and summary",
    interviewQuestions: ["How do you design a payment system?", "How do you estimate RPS?", "How do you choose SQL vs NoSQL?", "How do you handle failure and retries?"],
    commonMistakes: ["Starting with tools", "No requirements", "No data model", "No bottleneck deep dive", "No failure modes"],
    productionUseCases: ["HLD interviews", "Architecture reviews", "AWS Solution Architect prep", "Staff design reviews"]
  }),
  interviewTopic({
    order: 3,
    slug: "behavioral-star-stories",
    title: "Behavioral STAR Stories",
    definition: "Behavioral STAR stories communicate situation, task, action, and result with enough evidence to prove ownership, judgment, and impact.",
    mentalModel: "A story is evidence: context, choice, action, measurable result, and learning.",
    theory: "Prepare stories for conflict, failure, leadership, ambiguity, incident, mentoring, stakeholder management, and trade-off decisions. Staff/EM answers should show influence, business context, and durable organizational learning.",
    example: "STAR+L:\nSituation:\nTask:\nAction:\nResult:\nLearning:\nFollow-up metric:\nWhat I would do differently:",
    interviewQuestions: ["Tell me about a conflict.", "Tell me about a production incident.", "Tell me about influencing without authority.", "Tell me about a failed project."],
    commonMistakes: ["Vague team-level answers", "No measurable result", "Blaming others", "No learning", "Too much chronology"],
    productionUseCases: ["Behavioral interviews", "EM interviews", "Staff interviews", "Promotion packets"]
  }),
  interviewTopic({
    order: 4,
    slug: "mock-interview-calibration",
    title: "Mock Interview Calibration",
    definition: "Mock interview calibration turns practice answers into reliable signal by scoring against rubrics, identifying weak patterns, and scheduling targeted follow-up.",
    mentalModel: "Practice only compounds when feedback becomes a specific next drill.",
    theory: "A strong mock process separates the prompt, timing, answer, rubric, evidence, score, feedback, and next practice. Calibration prevents false confidence and keeps learning tied to role expectations.",
    example: "Calibration packet:\nPrompt:\nTarget role:\nRound type:\nTime used:\nEvidence observed:\nStrengths:\nConcerns:\nScore:\nNext drill:\nRetest date:",
    interviewQuestions: ["How do you know you are interview-ready?", "How should mock feedback be structured?", "What is a weak signal vs strong signal?", "How do you calibrate interview difficulty?"],
    commonMistakes: ["Only counting attempts", "No rubric", "No retest", "Feedback too generic", "Practicing favorite topics only"],
    productionUseCases: ["Mock interview mode", "Readiness dashboard", "Hiring calibration", "Mentor review"]
  })
];
