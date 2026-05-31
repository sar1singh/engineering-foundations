import type { SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

const interviewReferences = [
  {
    id: "reference-js-interview-mdn-expressions",
    title: "MDN JavaScript expressions and operators",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators",
    sourceType: "docs" as const,
    usage: "Reference for operator behavior, expression evaluation, and output-prediction fundamentals."
  },
  {
    id: "reference-js-interview-mdn-debugger",
    title: "MDN debugger statement",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger",
    sourceType: "docs" as const,
    usage: "Reference for debugger breakpoints and runtime inspection behavior."
  },
  {
    id: "reference-js-interview-javascript-info-debugging",
    title: "javascript.info Debugging in the browser",
    url: "https://javascript.info/debugging-chrome",
    sourceType: "article" as const,
    usage: "Practice reference for stepping through JavaScript, inspecting variables, and debugging control flow."
  },
  {
    id: "reference-js-interview-javascript-info-event-loop",
    title: "javascript.info Event loop",
    url: "https://javascript.info/event-loop",
    sourceType: "article" as const,
    usage: "Reference for output-prediction questions involving microtasks, macrotasks, and timers."
  }
];

function makeInterviewProblems(slug: string, topicTitle: string): SyllabusPracticeProblem[] {
  return [
    {
      id: `problem-${slug}-easy-trace`,
      title: `${topicTitle} basic trace`,
      difficulty: "easy",
      tags: [slug, "javascript", "output-prediction", "local-js-files"],
      prompt: `Predict the output of a short ${topicTitle} snippet. Explain each line using scope, hoisting, this, promises, or event-loop rules as needed.`,
      starterCode:
        "console.log('A');\n" +
        "Promise.resolve().then(() => console.log('B'));\n" +
        "setTimeout(() => console.log('C'), 0);\n" +
        "console.log('D');\n",
      expectedSignals: ["Gives exact output order", "Names the rule behind each output"]
    },
    {
      id: `problem-${slug}-medium-explain`,
      title: `${topicTitle} explain the surprise`,
      difficulty: "medium",
      tags: [slug, "debugging", "interview", "javascript"],
      prompt: `Given a surprising JavaScript result, explain the root cause and rewrite the snippet so the behavior is easier to reason about.`,
      starterCode:
        "for (var i = 0; i < 3; i += 1) {\n" +
        "  setTimeout(() => console.log(i), 0);\n" +
        "}\n",
      expectedSignals: ["Identifies the underlying runtime rule", "Provides a clearer rewrite", "Explains why the rewrite works"]
    },
    {
      id: `problem-${slug}-hard-debug-plan`,
      title: `${topicTitle} interview debugging drill`,
      difficulty: "hard",
      tags: [slug, "debugging-scenarios", "senior", "local-js-files"],
      prompt: `Create a debugging plan for a failing JavaScript snippet. Include reproduction steps, breakpoints or logs, hypotheses, a minimal fix, and verification cases.`,
      expectedSignals: ["Uses systematic debugging", "Avoids random edits", "Defines verification cases"]
    }
  ];
}

function makeInterviewTopic(input: {
  order: number;
  slug: string;
  title: string;
  definition: string;
  mentalModel: string;
  theory: string;
  visual: string;
  code: string;
  interviewQuestions: string[];
  commonMistakes: string[];
  productionUseCases: string[];
}): SyllabusTopic {
  return {
    id: `syllabus-js-${input.slug}`,
    slug: input.slug,
    title: input.title,
    order: input.order,
    sourcePath: "00-control/master-roadmap/02-javascript/INDEX.md",
    definition: input.definition,
    whyItMatters:
      `${input.title} is part of JavaScript Phase 4 Interview. It turns the earlier concept work into fast, interview-grade reasoning under pressure.`,
    mentalModel: input.mentalModel,
    theory: `${input.theory}\n\nVisual model: ${input.visual}`,
    codeExamples: [
      {
        id: `example-js-${input.slug}-core`,
        title: `${input.title} local JS drill`,
        language: "javascript",
        code: input.code,
        explanation: `Run this in a local JS file, predict the result first, then verify and explain the runtime rule.`,
        runnable: true
      }
    ],
    practiceProblems: makeInterviewProblems(input.slug, input.title),
    interviewQuestions: input.interviewQuestions,
    commonMistakes: input.commonMistakes,
    productionUseCases: input.productionUseCases,
    revisionPrompts: [
      `Solve one ${input.title} drill without running it, then verify in a local JS file.`,
      `Explain the exact runtime rule behind a wrong prediction you made.`,
      `Write one new ${input.title} snippet that combines at least two JavaScript concepts.`
    ],
    reviewPrompts: [
      {
        id: `review-js-${input.slug}-self`,
        reviewerRole: "self",
        prompt: `Review your ${input.title} answer for exact output, rule names, edge cases, and clarity under interview pressure.`,
        rubric: ["Output is exact", "Rule explanation is precise", "Debugging steps are systematic", "Verification is included"]
      },
      {
        id: `review-js-${input.slug}-mentor`,
        reviewerRole: "mentor",
        prompt: `Review the learner's ${input.title} response like a JavaScript deep-dive interviewer.`,
        rubric: ["Reasoning is step-by-step", "No hand-wavy runtime claims", "Fix preserves behavior", "Follow-up question is answered"]
      }
    ],
    references: [
      ...interviewReferences,
      {
        id: `reference-js-${input.slug}-local-roadmap`,
        title: "EngineeringOS JavaScript master roadmap",
        url: "00-control/master-roadmap/02-javascript/INDEX.md",
        sourceType: "roadmap",
        usage: "Local source of truth for JavaScript Phase 4 ordering, practice platforms, and pass criteria."
      }
    ],
    progressSignals: [
      "read_definition",
      "read_theory",
      "studied_code_example",
      "ran_code_example",
      "solved_easy_problem",
      "solved_medium_problem",
      "solved_hard_problem",
      "submitted_explain_back",
      "completed_mock_review",
      "scheduled_revision"
    ]
  };
}

export const jsPhaseFourInterviewTopics: SyllabusTopic[] = [
  makeInterviewTopic({
    order: 14,
    slug: "output-prediction",
    title: "Output Prediction",
    definition: "Output prediction is the interview skill of tracing JavaScript execution and stating the exact logs, return values, or errors before running the code.",
    mentalModel: "Trace in layers: creation phase, synchronous execution, queued microtasks, queued macrotasks, then final output.",
    visual: "read snippet -> mark declarations/bindings -> run stack -> drain microtasks -> run timers/events -> compare output.",
    theory:
      "Output prediction combines scope, hoisting, closures, this binding, prototype lookup, coercion, promises, and event-loop ordering. The goal is not memorizing tricks; it is building a deterministic trace and naming the rule at each step.",
    code:
      "console.log('start');\n" +
      "setTimeout(() => console.log('timer'), 0);\n" +
      "Promise.resolve()\n" +
      "  .then(() => console.log('promise 1'))\n" +
      "  .then(() => console.log('promise 2'));\n" +
      "console.log('end');\n",
    interviewQuestions: [
      "How do you approach an output-prediction question before answering?",
      "Why do promise callbacks run before zero-delay timers?",
      "How do hoisting and closure rules affect output?"
    ],
    commonMistakes: ["Answering from memory instead of tracing", "Skipping the creation phase", "Mixing up microtask and timer order"],
    productionUseCases: ["Debugging async log order", "Reviewing tricky callbacks", "Explaining runtime behavior in code reviews"]
  }),
  makeInterviewTopic({
    order: 15,
    slug: "debugging-scenarios",
    title: "Debugging Scenarios",
    definition: "Debugging scenarios test how systematically you reproduce, inspect, explain, fix, and verify JavaScript behavior.",
    mentalModel: "Treat a bug as a hypothesis loop: reproduce, observe, narrow, change one thing, verify.",
    visual: "symptom -> reproduction -> instrumentation -> hypothesis -> fix -> regression case.",
    theory:
      "Strong debugging answers show method. Start with the failing behavior, reduce the case, inspect state with breakpoints or logs, connect the symptom to a runtime rule, make the smallest safe fix, and add a verification case. Interviewers look for calm reasoning more than instant guesses.",
    code:
      "function createHandlers(items) {\n" +
      "  const handlers = [];\n" +
      "  for (let i = 0; i < items.length; i += 1) {\n" +
      "    handlers.push(() => items[i]);\n" +
      "  }\n" +
      "  return handlers;\n" +
      "}\n",
    interviewQuestions: [
      "How would you debug a callback that sees stale state?",
      "What logs or breakpoints would you add first?",
      "How do you prove your fix did not change unrelated behavior?"
    ],
    commonMistakes: ["Changing several things at once", "Not reproducing the bug first", "Stopping after a fix without verification"],
    productionUseCases: ["Async callback bugs", "State lifecycle issues", "Unexpected logs", "Regression investigation"]
  })
];
