import type {
  EvaluationCriterion as PrismaEvaluationCriterion,
  EvaluationRubric as PrismaEvaluationRubric,
  InterviewQuestion as PrismaInterviewQuestion,
  PracticeSubtask as PrismaPracticeSubtask,
  PracticeTask as PrismaPracticeTask,
  ProblemExample as PrismaProblemExample,
  ProblemStatement as PrismaProblemStatement,
  ReferenceLink as PrismaReferenceLink,
  RevisionPrompt as PrismaRevisionPrompt,
  Roadmap as PrismaRoadmap,
  TestCase as PrismaTestCase,
  Topic as PrismaTopic
} from "@prisma/client";
import type { EvaluationCriterion, EvaluationRubric } from "@/types/evaluation";
import type { PracticeSubtask, PracticeTask } from "@/types/practice";
import type { ProblemExample, ProblemStatement, TestCase } from "@/types/problem";
import type { ReferenceLink } from "@/types/reference";
import type { Roadmap } from "@/types/roadmap";
import type { CodeExample, Difficulty, InterviewQuestion, LearningModeContent, RevisionPrompt, Topic } from "@/types/topic";

type LearningModes = {
  fastTrack: LearningModeContent;
  deepMastery: LearningModeContent;
};

const emptyLearningModes: LearningModes = {
  fastTrack: {
    summary: "",
    mustKnow: [],
    skipForNow: [],
    practiceFocus: [],
    passCriteria: []
  },
  deepMastery: {
    summary: "",
    mustKnow: [],
    skipForNow: [],
    practiceFocus: [],
    passCriteria: []
  }
};

export function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function toRoadmap(record: PrismaRoadmap & { domains?: Array<{ id: string }> }): Roadmap {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    description: record.description,
    targetRole: parseJson<string[]>(record.targetRoles, []),
    targetLevel: parseJson<string[]>(record.targetLevels, []),
    targetCompanyTypes: parseJson<string[]>(record.targetCompanyTypes, []),
    estimatedWeeks: record.estimatedWeeks,
    domainIds: record.domains?.map((domain) => domain.id) ?? [],
    isActive: record.isActive,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

export function toTopic(record: PrismaTopic): Topic {
  return {
    id: record.id,
    moduleId: record.moduleId,
    title: record.title,
    slug: record.slug,
    summary: record.summary,
    whyItMatters: record.whyItMatters,
    difficulty: record.difficulty as Difficulty,
    estimatedMinutes: record.estimatedMinutes,
    tags: parseJson<string[]>(record.tags, []),
    prerequisites: parseJson<string[]>(record.prerequisites, []),
    relatedTopics: parseJson<string[]>(record.relatedTopics, []),
    advancedTopics: parseJson<string[]>(record.advancedTopics, []),
    roleRelevance: parseJson<string[]>(record.roleRelevance, []),
    companyRelevance: parseJson<string[]>(record.companyRelevance, []),
    interviewRelevance: record.interviewRelevance,
    learningModes: parseJson<LearningModes>(record.learningModes, emptyLearningModes),
    theory: record.theory,
    mentalModel: record.mentalModel,
    codeExamples: parseJson<CodeExample[]>(record.codeExamples, []),
    productionUseCases: parseJson<string[]>(record.productionUseCases, []),
    commonMistakes: parseJson<string[]>(record.commonMistakes, []),
    subtopicIds: [],
    practiceTaskIds: [],
    interviewQuestionIds: [],
    referenceLinkIds: [],
    revisionPromptIds: [],
    explainBackPrompt: record.explainBackPrompt,
    evaluationRubricId: "",
    completionCriteria: parseJson<string[]>(record.completionCriteria, []),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

export function toPracticeSubtask(record: PrismaPracticeSubtask): PracticeSubtask {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    order: record.order,
    isRequired: record.isRequired
  };
}

export function toPracticeTask(record: PrismaPracticeTask & { subtasks?: PrismaPracticeSubtask[] }): PracticeTask {
  return {
    id: record.id,
    topicId: record.topicId,
    subtopicId: record.subtopicId ?? undefined,
    title: record.title,
    slug: record.slug,
    difficulty: record.difficulty as "easy" | "medium" | "hard",
    estimatedMinutes: record.estimatedMinutes,
    taskType: record.taskType as PracticeTask["taskType"],
    statement: record.statement,
    subtasks: record.subtasks?.map(toPracticeSubtask) ?? [],
    problemStatementId: record.problemStatementId ?? undefined,
    starterCode: record.starterCode ?? undefined,
    solutionApproach: record.solutionApproach ?? undefined,
    hints: parseJson<string[]>(record.hints, []),
    edgeCases: parseJson<string[]>(record.edgeCases, []),
    completionCriteria: parseJson<string[]>(record.completionCriteria, [])
  };
}

export function toProblemExample(record: PrismaProblemExample): ProblemExample {
  return {
    input: record.input,
    output: record.output,
    explanation: record.explanation
  };
}

export function toTestCase(record: PrismaTestCase): TestCase {
  return {
    input: record.input,
    expectedOutput: record.expectedOutput,
    isHidden: record.isHidden
  };
}

export function toProblemStatement(
  record: PrismaProblemStatement & { examples?: PrismaProblemExample[]; testCases?: PrismaTestCase[] }
): ProblemStatement {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    source: record.source as ProblemStatement["source"],
    externalUrl: record.externalUrl ?? undefined,
    difficulty: record.difficulty as "easy" | "medium" | "hard",
    topicIds: parseJson<string[]>(record.topicIds, []),
    statement: record.statement,
    examples: record.examples?.map(toProblemExample) ?? [],
    constraints: parseJson<string[]>(record.constraints, []),
    expectedOutput: record.expectedOutput ?? undefined,
    testCases: record.testCases?.map(toTestCase) ?? []
  };
}

export function toReferenceLink(record: PrismaReferenceLink): ReferenceLink {
  return {
    id: record.id,
    title: record.title,
    url: record.url,
    sourceType: record.sourceType as ReferenceLink["sourceType"],
    topicIds: [record.topicId],
    priority: record.priority as ReferenceLink["priority"]
  };
}

export function toInterviewQuestion(record: PrismaInterviewQuestion): InterviewQuestion {
  return {
    id: record.id,
    topicId: record.topicId,
    question: record.question,
    answer: record.answer ?? undefined,
    level: record.level as InterviewQuestion["level"]
  };
}

export function toRevisionPrompt(record: PrismaRevisionPrompt): RevisionPrompt {
  return {
    id: record.id,
    topicId: record.topicId,
    prompt: record.prompt,
    frequency: record.frequency as RevisionPrompt["frequency"]
  };
}

export function toEvaluationCriterion(record: PrismaEvaluationCriterion): EvaluationCriterion {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    maxScore: record.maxScore
  };
}

export function toEvaluationRubric(
  record: PrismaEvaluationRubric & { criteria?: PrismaEvaluationCriterion[] }
): EvaluationRubric {
  return {
    id: record.id,
    topicId: record.topicId ?? undefined,
    taskId: record.taskId ?? undefined,
    criteria: record.criteria?.map(toEvaluationCriterion) ?? []
  };
}
