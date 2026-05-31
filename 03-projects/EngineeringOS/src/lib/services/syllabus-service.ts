import { mockSyllabusCatalog } from "@/data/mock-syllabus";
import { topicDepthOverrides } from "@/data/syllabus/topic-depth-overrides";
import type { MockSyllabusCatalog, SyllabusDomain, SyllabusPracticeProblem, SyllabusTopic } from "@/types/syllabus";

export class SyllabusService {
  getCatalog(): MockSyllabusCatalog {
    return {
      ...mockSyllabusCatalog,
      domains: this.getDomains()
    };
  }

  getDomains(): SyllabusDomain[] {
    return mockSyllabusCatalog.domains.map((domain) => ({
      ...domain,
      modules: domain.modules.map((syllabusModule) => ({
        ...syllabusModule,
        topics: syllabusModule.topics.map((topic) => enrichTopicForLearning(topic))
      }))
    }));
  }

  getTopicBySlug(slug: string): SyllabusTopic | null {
    for (const domain of this.getDomains()) {
      for (const syllabusModule of domain.modules) {
        const topic = syllabusModule.topics.find((item) => item.slug === slug || item.id === slug);

        if (topic) {
          return topic;
        }
      }
    }

    return null;
  }

  getPracticeProblemsByTopicSlug(slug: string): SyllabusPracticeProblem[] {
    return this.getTopicBySlug(slug)?.practiceProblems ?? [];
  }

  getPracticeProblemsByDifficulty(difficulty: SyllabusPracticeProblem["difficulty"]): SyllabusPracticeProblem[] {
    return this.getDomains().flatMap((domain) =>
      domain.modules.flatMap((syllabusModule) =>
        syllabusModule.topics.flatMap((topic) => topic.practiceProblems.filter((problem) => problem.difficulty === difficulty))
      )
    );
  }
}

export const syllabusService = new SyllabusService();

const minimumPracticeProblemCount = 8;
const minimumInterviewQuestionCount = 8;

function enrichTopicForLearning(topic: SyllabusTopic): SyllabusTopic {
  const topicWithDepthOverride = applyTopicDepthOverride(topic);

  return {
    ...topicWithDepthOverride,
    practiceProblems: ensurePracticeProblemDepth(topicWithDepthOverride),
    interviewQuestions: ensureInterviewQuestionDepth(topicWithDepthOverride)
  };
}

function applyTopicDepthOverride(topic: SyllabusTopic): SyllabusTopic {
  const override = topicDepthOverrides[topic.slug];

  if (!override) {
    return topic;
  }

  return {
    ...topic,
    theory: `${topic.theory}\n\n${override.theoryAppendix}`,
    codeExamples: mergeById(topic.codeExamples, override.codeExamples ?? []),
    practiceProblems: mergeById(topic.practiceProblems, override.practiceProblems ?? []),
    interviewQuestions: mergeUnique(topic.interviewQuestions, override.interviewQuestions ?? []),
    reviewPrompts: mergeById(topic.reviewPrompts, override.reviewPrompts ?? []),
    references: mergeById(topic.references, override.references ?? [])
  };
}

function mergeById<T extends { id: string }>(base: T[], additions: T[]): T[] {
  const existingIds = new Set(base.map((item) => item.id));
  return [...base, ...additions.filter((item) => !existingIds.has(item.id))];
}

function mergeUnique(base: string[], additions: string[]): string[] {
  return Array.from(new Set([...base, ...additions]));
}

function ensurePracticeProblemDepth(topic: SyllabusTopic): SyllabusPracticeProblem[] {
  if (topic.practiceProblems.length >= minimumPracticeProblemCount) {
    return topic.practiceProblems;
  }

  const generatedProblems: SyllabusPracticeProblem[] = [
    {
      id: `generated-${topic.slug}-definition-drill`,
      title: `${topic.title} definition drill`,
      difficulty: "easy",
      tags: [topic.slug, "definition", "80-20"],
      prompt: `Explain ${topic.title} in your own words, then name one real backend or interview scenario where it matters.`,
      expectedSignals: ["Clear definition", "Concrete use case", "No memorized jargon"]
    },
    {
      id: `generated-${topic.slug}-trace-code`,
      title: `${topic.title} code or design trace`,
      difficulty: "easy",
      tags: [topic.slug, "trace", "practice"],
      prompt: `Trace the provided ${topic.title} code or design example step by step. Identify the key state changes and final result.`,
      expectedSignals: ["Step-by-step trace", "Important state identified", "Final output or decision is correct"]
    },
    {
      id: `generated-${topic.slug}-edge-cases`,
      title: `${topic.title} edge cases`,
      difficulty: "medium",
      tags: [topic.slug, "edge-cases", "interview"],
      prompt: `List five edge cases for ${topic.title}. For each one, explain how your implementation or design should behave.`,
      expectedSignals: ["Five edge cases", "Expected behavior", "Failure mode awareness"]
    },
    {
      id: `generated-${topic.slug}-implementation`,
      title: `${topic.title} implementation task`,
      difficulty: "medium",
      tags: [topic.slug, "implementation", "hands-on"],
      prompt: `Implement or sketch the smallest working version of ${topic.title}. Include inputs, outputs, and one validation step.`,
      expectedSignals: ["Runnable or reviewable solution", "Input/output contract", "Validation step"]
    },
    {
      id: `generated-${topic.slug}-tradeoff`,
      title: `${topic.title} trade-off analysis`,
      difficulty: "medium",
      tags: [topic.slug, "tradeoffs", "senior"],
      prompt: `Compare ${topic.title} with one alternative. Explain when each option wins and what cost or risk it introduces.`,
      expectedSignals: ["Alternative named", "Decision criteria", "Cost or risk explained"]
    },
    {
      id: `generated-${topic.slug}-debugging`,
      title: `${topic.title} debugging scenario`,
      difficulty: "hard",
      tags: [topic.slug, "debugging", "production"],
      prompt: `A production issue is suspected to involve ${topic.title}. Write the investigation plan, evidence to collect, safest fix, and verification signal.`,
      expectedSignals: ["Investigation plan", "Evidence before fix", "Verification signal"]
    },
    {
      id: `generated-${topic.slug}-system-design`,
      title: `${topic.title} system design application`,
      difficulty: "hard",
      tags: [topic.slug, "system-design", "architecture"],
      prompt: `Apply ${topic.title} inside a realistic system design. Describe where it fits, how it scales, and how it fails.`,
      expectedSignals: ["Placement in design", "Scale implication", "Failure handling"]
    },
    {
      id: `generated-${topic.slug}-interview-mock`,
      title: `${topic.title} interview mock`,
      difficulty: "hard",
      tags: [topic.slug, "mock-interview", "explain-back"],
      prompt: `Answer a mock interview question on ${topic.title}. Include definition, example, complexity or trade-off, and follow-up risk.`,
      expectedSignals: ["Structured answer", "Example included", "Trade-off or complexity", "Follow-up risk"]
    }
  ];

  const existingIds = new Set(topic.practiceProblems.map((problem) => problem.id));
  const additions = generatedProblems.filter((problem) => !existingIds.has(problem.id));
  return [...topic.practiceProblems, ...additions].slice(0, Math.max(minimumPracticeProblemCount, topic.practiceProblems.length));
}

function ensureInterviewQuestionDepth(topic: SyllabusTopic): string[] {
  if (topic.interviewQuestions.length >= minimumInterviewQuestionCount) {
    return topic.interviewQuestions;
  }

  const generatedQuestions = [
    `Explain ${topic.title} from first principles.`,
    `What problem does ${topic.title} solve?`,
    `Show a practical example of ${topic.title}.`,
    `What are the most common mistakes with ${topic.title}?`,
    `How would you debug a failure involving ${topic.title}?`,
    `What trade-off does ${topic.title} introduce?`,
    `How does ${topic.title} behave at scale or under edge cases?`,
    `How would you teach ${topic.title} to a junior engineer?`,
    `What follow-up question would you expect after explaining ${topic.title}?`
  ];

  return Array.from(new Set([...topic.interviewQuestions, ...generatedQuestions])).slice(
    0,
    Math.max(minimumInterviewQuestionCount, topic.interviewQuestions.length)
  );
}
