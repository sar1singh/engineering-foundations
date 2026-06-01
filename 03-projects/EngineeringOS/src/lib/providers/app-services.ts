import { mockAiService } from "@/lib/ai";
import { mockAuthService } from "@/lib/auth";
import { appConfig } from "@/lib/config";
import { mockDbClient } from "@/lib/db";
import { mockEvaluationService } from "@/lib/evaluation";
import { mockPracticeRepository } from "@/lib/repositories/mock-practice-repository";
import { mockLearnerPreferencesRepository } from "@/lib/repositories/mock-learner-preferences-repository";
import { mockProblemRepository } from "@/lib/repositories/mock-problem-repository";
import { mockReferenceRepository } from "@/lib/repositories/mock-reference-repository";
import { mockRoadmapRepository } from "@/lib/repositories/mock-roadmap-repository";
import {
  mockEvaluationRubricRepository,
  mockEvaluationResultRepository,
  mockExplainBackRepository,
  mockInterviewQuestionRepository,
  mockProgressRepository,
  mockRevisionQueueRepository,
  mockRevisionPromptRepository,
  mockSubtopicRepository
} from "@/lib/repositories/mock-support-repositories";
import { mockTopicRepository } from "@/lib/repositories/mock-topic-repository";
import type { EvaluationResultRepository } from "@/lib/repositories/evaluation-result-repository";
import type { EvaluationRubricRepository } from "@/lib/repositories/evaluation-rubric-repository";
import type { ExplainBackRepository } from "@/lib/repositories/explain-back-repository";
import type { InterviewQuestionRepository } from "@/lib/repositories/interview-question-repository";
import type { LearnerPreferencesRepository } from "@/lib/repositories/learner-preferences-repository";
import type { PracticeRepository } from "@/lib/repositories/practice-repository";
import type { ProblemRepository } from "@/lib/repositories/problem-repository";
import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { ReferenceRepository } from "@/lib/repositories/reference-repository";
import type { RevisionQueueRepository } from "@/lib/repositories/revision-queue-repository";
import type { RevisionPromptRepository } from "@/lib/repositories/revision-prompt-repository";
import type { RoadmapRepository } from "@/lib/repositories/roadmap-repository";
import type { SubtopicRepository } from "@/lib/repositories/subtopic-repository";
import type { TopicRepository } from "@/lib/repositories/topic-repository";
import { DashboardService } from "@/lib/services/dashboard-service";
import { PracticeContentService } from "@/lib/services/practice-content-service";
import { ProgressSummaryService } from "@/lib/services/progress-summary-service";
import { ReadinessScoreService } from "@/lib/services/readiness-score-service";
import { RevisionService } from "@/lib/services/revision-service";
import { RoadmapTreeService } from "@/lib/services/roadmap-tree-service";
import { SearchService } from "@/lib/services/search-service";
import { LearnerStateService } from "@/lib/services/learner-state-service";
import { syllabusService } from "@/lib/services/syllabus-service";
import { TopicContentService } from "@/lib/services/topic-content-service";
import { mockStorageService } from "@/lib/storage";

const mockRepositories = {
  roadmapRepository: mockRoadmapRepository,
  topicRepository: mockTopicRepository,
  practiceRepository: mockPracticeRepository,
  problemRepository: mockProblemRepository,
  referenceRepository: mockReferenceRepository,
  subtopicRepository: mockSubtopicRepository,
  interviewQuestionRepository: mockInterviewQuestionRepository,
  revisionPromptRepository: mockRevisionPromptRepository,
  evaluationRubricRepository: mockEvaluationRubricRepository,
  progressRepository: mockProgressRepository,
  explainBackRepository: mockExplainBackRepository,
  evaluationResultRepository: mockEvaluationResultRepository,
  revisionQueueRepository: mockRevisionQueueRepository,
  learnerPreferencesRepository: mockLearnerPreferencesRepository
};

type ReadRepositories = {
  roadmapRepository: RoadmapRepository;
  topicRepository: TopicRepository;
  practiceRepository: PracticeRepository;
  problemRepository: ProblemRepository;
  referenceRepository: ReferenceRepository;
  subtopicRepository: SubtopicRepository;
  interviewQuestionRepository: InterviewQuestionRepository;
  revisionPromptRepository: RevisionPromptRepository;
  evaluationRubricRepository: EvaluationRubricRepository;
  progressRepository: ProgressRepository;
  explainBackRepository: ExplainBackRepository;
  evaluationResultRepository: EvaluationResultRepository;
  revisionQueueRepository: RevisionQueueRepository;
  learnerPreferencesRepository: LearnerPreferencesRepository;
};

function withReadFallback<TRepository extends object>(
  label: string,
  repository: TRepository,
  fallbackByMethod: Partial<Record<keyof TRepository, unknown>>
): TRepository {
  return new Proxy(repository, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);

      if (typeof value !== "function") {
        return value;
      }

      return async (...args: unknown[]) => {
        try {
          return await value.apply(target, args);
        } catch (error) {
          console.error(`[EngineeringOS] Prisma read failed in ${label}.${String(property)}`, error);
          return fallbackByMethod[property as keyof TRepository];
        }
      };
    }
  });
}

function createPrismaRepositories(): ReadRepositories {
  const roadmapRepository: RoadmapRepository = {
    async getAllRoadmaps() {
      return (await import("@/lib/repositories/prisma-roadmap-repository")).prismaRoadmapRepository.getAllRoadmaps();
    },
    async getActiveRoadmap() {
      return (await import("@/lib/repositories/prisma-roadmap-repository")).prismaRoadmapRepository.getActiveRoadmap();
    },
    async getRoadmapById(id) {
      return (await import("@/lib/repositories/prisma-roadmap-repository")).prismaRoadmapRepository.getRoadmapById(id);
    },
    async getRoadmapTree(id) {
      return (await import("@/lib/repositories/prisma-roadmap-repository")).prismaRoadmapRepository.getRoadmapTree(id);
    }
  };

  const topicRepository: TopicRepository = {
    async getAllTopics() {
      return (await import("@/lib/repositories/prisma-topic-repository")).prismaTopicRepository.getAllTopics();
    },
    async getTopicById(id) {
      return (await import("@/lib/repositories/prisma-topic-repository")).prismaTopicRepository.getTopicById(id);
    },
    async getTopicBySlug(slug) {
      return (await import("@/lib/repositories/prisma-topic-repository")).prismaTopicRepository.getTopicBySlug(slug);
    },
    async getTopicsByModuleId(moduleId) {
      return (await import("@/lib/repositories/prisma-topic-repository")).prismaTopicRepository.getTopicsByModuleId(moduleId);
    },
    async searchTopics(query) {
      return (await import("@/lib/repositories/prisma-topic-repository")).prismaTopicRepository.searchTopics(query);
    }
  };

  const practiceRepository: PracticeRepository = {
    async getAllTasks() {
      return (await import("@/lib/repositories/prisma-practice-repository")).prismaPracticeRepository.getAllTasks();
    },
    async getTaskById(id) {
      return (await import("@/lib/repositories/prisma-practice-repository")).prismaPracticeRepository.getTaskById(id);
    },
    async getTaskBySlug(slug) {
      return (await import("@/lib/repositories/prisma-practice-repository")).prismaPracticeRepository.getTaskBySlug(slug);
    },
    async getTasksByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-practice-repository")).prismaPracticeRepository.getTasksByTopicId(topicId);
    },
    async getTasksBySubtopicId(subtopicId) {
      return (await import("@/lib/repositories/prisma-practice-repository")).prismaPracticeRepository.getTasksBySubtopicId(subtopicId);
    }
  };

  const problemRepository: ProblemRepository = {
    async getProblemById(id) {
      return (await import("@/lib/repositories/prisma-problem-repository")).prismaProblemRepository.getProblemById(id);
    },
    async getProblemsByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-problem-repository")).prismaProblemRepository.getProblemsByTopicId(topicId);
    },
    async getProblemsByDifficulty(difficulty) {
      return (await import("@/lib/repositories/prisma-problem-repository")).prismaProblemRepository.getProblemsByDifficulty(difficulty);
    }
  };

  const referenceRepository: ReferenceRepository = {
    async getAllReferences() {
      return (await import("@/lib/repositories/prisma-reference-repository")).prismaReferenceRepository.getAllReferences();
    },
    async getReferencesByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-reference-repository")).prismaReferenceRepository.getReferencesByTopicId(topicId);
    },
    async getPrimaryReferencesByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-reference-repository")).prismaReferenceRepository.getPrimaryReferencesByTopicId(topicId);
    }
  };

  const subtopicRepository: SubtopicRepository = {
    async getAllSubtopics() {
      return (await import("@/lib/repositories/prisma-subtopic-repository")).prismaSubtopicRepository.getAllSubtopics();
    },
    async getSubtopicById(id) {
      return (await import("@/lib/repositories/prisma-subtopic-repository")).prismaSubtopicRepository.getSubtopicById(id);
    },
    async getSubtopicsByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-subtopic-repository")).prismaSubtopicRepository.getSubtopicsByTopicId(topicId);
    }
  };

  const interviewQuestionRepository: InterviewQuestionRepository = {
    async getQuestionsByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-interview-question-repository")).prismaInterviewQuestionRepository.getQuestionsByTopicId(topicId);
    }
  };

  const revisionPromptRepository: RevisionPromptRepository = {
    async getPromptsByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-revision-prompt-repository")).prismaRevisionPromptRepository.getPromptsByTopicId(topicId);
    },
    async getPromptsForTopics(topicIds) {
      return (await import("@/lib/repositories/prisma-revision-prompt-repository")).prismaRevisionPromptRepository.getPromptsForTopics(topicIds);
    }
  };

  const evaluationRubricRepository: EvaluationRubricRepository = {
    async getRubricById(id) {
      return (await import("@/lib/repositories/prisma-evaluation-rubric-repository")).prismaEvaluationRubricRepository.getRubricById(id);
    },
    async getRubricByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-evaluation-rubric-repository")).prismaEvaluationRubricRepository.getRubricByTopicId(topicId);
    },
    async getRubricByTaskId(taskId) {
      return (await import("@/lib/repositories/prisma-evaluation-rubric-repository")).prismaEvaluationRubricRepository.getRubricByTaskId(taskId);
    }
  };

  const progressRepository: ProgressRepository = {
    async getCurrentProgress() {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.getCurrentProgress();
    },
    async getProgress() {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.getProgress();
    },
    async getCompletedTopicIds() {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.getCompletedTopicIds();
    },
    async getCompletedTaskIds() {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.getCompletedTaskIds();
    },
    async getWeakAreas() {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.getWeakAreas();
    },
    async markTopicComplete(topicId) {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.markTopicComplete(topicId);
    },
    async markTaskComplete(taskId) {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.markTaskComplete(taskId);
    },
    async updateWeakAreas(weakAreas) {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.updateWeakAreas(weakAreas);
    },
    async updateRevisionQueue(items) {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.updateRevisionQueue(items);
    },
    async resetLocalProgress() {
      return (await import("@/lib/repositories/prisma-progress-repository")).prismaProgressRepository.resetLocalProgress();
    }
  };

  const explainBackRepository: ExplainBackRepository = {
    async saveExplainBackAttempt(input) {
      return (await import("@/lib/repositories/prisma-explain-back-repository")).prismaExplainBackRepository.saveExplainBackAttempt(input);
    },
    async getExplainBackAttemptsByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-explain-back-repository")).prismaExplainBackRepository.getExplainBackAttemptsByTopicId(topicId);
    },
    async getLatestExplainBackAttempt(topicId) {
      return (await import("@/lib/repositories/prisma-explain-back-repository")).prismaExplainBackRepository.getLatestExplainBackAttempt(topicId);
    }
  };

  const evaluationResultRepository: EvaluationResultRepository = {
    async saveEvaluationResult(input) {
      return (await import("@/lib/repositories/prisma-evaluation-result-repository")).prismaEvaluationResultRepository.saveEvaluationResult(input);
    },
    async getEvaluationResultsByTopicId(topicId) {
      return (await import("@/lib/repositories/prisma-evaluation-result-repository")).prismaEvaluationResultRepository.getEvaluationResultsByTopicId(topicId);
    },
    async getEvaluationResultsByTaskId(taskId) {
      return (await import("@/lib/repositories/prisma-evaluation-result-repository")).prismaEvaluationResultRepository.getEvaluationResultsByTaskId(taskId);
    }
  };

  const revisionQueueRepository: RevisionQueueRepository = {
    async getRevisionQueue() {
      return (await import("@/lib/repositories/prisma-revision-queue-repository")).prismaRevisionQueueRepository.getRevisionQueue();
    },
    async updateRevisionQueue(items) {
      return (await import("@/lib/repositories/prisma-revision-queue-repository")).prismaRevisionQueueRepository.updateRevisionQueue(items);
    },
    async markRevisionItemComplete(itemId) {
      return (await import("@/lib/repositories/prisma-revision-queue-repository")).prismaRevisionQueueRepository.markRevisionItemComplete(itemId);
    },
    async deferRevisionItem(itemId, nextReviewAt) {
      return (await import("@/lib/repositories/prisma-revision-queue-repository")).prismaRevisionQueueRepository.deferRevisionItem(itemId, nextReviewAt);
    }
  };

  return {
    roadmapRepository: withReadFallback("roadmapRepository", roadmapRepository, {
    getAllRoadmaps: [],
    getActiveRoadmap: null,
    getRoadmapById: null,
    getRoadmapTree: null
    }),
    topicRepository: withReadFallback("topicRepository", topicRepository, {
    getAllTopics: [],
    getTopicById: null,
    getTopicBySlug: null,
    getTopicsByModuleId: [],
    searchTopics: []
    }),
    practiceRepository: withReadFallback("practiceRepository", practiceRepository, {
    getAllTasks: [],
    getTaskById: null,
    getTaskBySlug: null,
    getTasksByTopicId: [],
    getTasksBySubtopicId: []
    }),
    problemRepository: withReadFallback("problemRepository", problemRepository, {
    getProblemById: null,
    getProblemsByTopicId: [],
    getProblemsByDifficulty: []
    }),
    referenceRepository: withReadFallback("referenceRepository", referenceRepository, {
    getAllReferences: [],
    getReferencesByTopicId: [],
    getPrimaryReferencesByTopicId: []
    }),
    subtopicRepository: withReadFallback("subtopicRepository", subtopicRepository, {
    getAllSubtopics: [],
    getSubtopicById: null,
    getSubtopicsByTopicId: []
    }),
    interviewQuestionRepository: withReadFallback("interviewQuestionRepository", interviewQuestionRepository, {
    getQuestionsByTopicId: []
    }),
    revisionPromptRepository: withReadFallback("revisionPromptRepository", revisionPromptRepository, {
    getPromptsByTopicId: [],
    getPromptsForTopics: []
    }),
    evaluationRubricRepository: withReadFallback("evaluationRubricRepository", evaluationRubricRepository, {
    getRubricById: null,
    getRubricByTopicId: null,
    getRubricByTaskId: null
    }),
    progressRepository: withReadFallback("progressRepository", progressRepository, {
    getCurrentProgress: mockProgressRepository.getCurrentProgress(),
    getProgress: mockProgressRepository.getProgress(),
    getCompletedTopicIds: [],
    getCompletedTaskIds: [],
    getWeakAreas: []
    }),
    explainBackRepository,
    evaluationResultRepository,
    revisionQueueRepository,
    learnerPreferencesRepository: {
      async getPreferences(userId) {
        return (await import("@/lib/repositories/prisma-learner-preferences-repository")).prismaLearnerPreferencesRepository.getPreferences(userId);
      },
      async savePreferences(userId, preferences) {
        return (await import("@/lib/repositories/prisma-learner-preferences-repository")).prismaLearnerPreferencesRepository.savePreferences(userId, preferences);
      }
    }
  };
}

const repositories: ReadRepositories = appConfig.dataSource === "prisma" ? createPrismaRepositories() : mockRepositories;

const roadmapTreeService = new RoadmapTreeService(repositories.roadmapRepository);
const revisionService = new RevisionService(
  repositories.revisionPromptRepository,
  repositories.progressRepository,
  repositories.revisionQueueRepository
);
const readinessScoreService = new ReadinessScoreService(repositories.progressRepository);

export const appServices = {
  config: appConfig,
  authService: mockAuthService,
  aiService: mockAiService,
  dbClient: mockDbClient,
  storageService: mockStorageService,
  evaluationService: mockEvaluationService,
  repositories,
  learnerStateService: new LearnerStateService(mockAuthService, repositories.learnerPreferencesRepository),
  roadmapTreeService,
  revisionService,
  readinessScoreService,
  dashboardService: new DashboardService(
    roadmapTreeService,
    repositories.topicRepository,
    repositories.practiceRepository,
    repositories.progressRepository,
    revisionService,
    readinessScoreService
  ),
  topicContentService: new TopicContentService(
    repositories.topicRepository,
    repositories.subtopicRepository,
    repositories.practiceRepository,
    repositories.problemRepository,
    repositories.interviewQuestionRepository,
    repositories.referenceRepository,
    repositories.revisionPromptRepository,
    repositories.evaluationRubricRepository,
    repositories.progressRepository,
    repositories.explainBackRepository,
    repositories.evaluationResultRepository
  ),
  practiceContentService: new PracticeContentService(
    repositories.practiceRepository,
    repositories.topicRepository,
    repositories.problemRepository,
    repositories.evaluationRubricRepository,
    repositories.progressRepository,
    repositories.evaluationResultRepository
  ),
  progressSummaryService: new ProgressSummaryService(
    repositories.progressRepository,
    repositories.topicRepository,
    repositories.practiceRepository
  ),
  searchService: new SearchService(
    repositories.roadmapRepository,
    repositories.topicRepository,
    repositories.practiceRepository,
    repositories.referenceRepository
  ),
  syllabusService
};

export type AppServices = typeof appServices;
