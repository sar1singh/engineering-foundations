import { evaluationRubrics } from "@/data/evaluation-rubrics";
import { interviewQuestions } from "@/data/interview-questions";
import { userProgress } from "@/data/progress";
import { revisionPrompts } from "@/data/revision-prompts";
import { subtopics } from "@/data/subtopics";
import type { EvaluationRubricRepository } from "@/lib/repositories/evaluation-rubric-repository";
import type { InterviewQuestionRepository } from "@/lib/repositories/interview-question-repository";
import type { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { RevisionPromptRepository } from "@/lib/repositories/revision-prompt-repository";
import type { SubtopicRepository } from "@/lib/repositories/subtopic-repository";

export const mockSubtopicRepository: SubtopicRepository = {
  async getAllSubtopics() {
    return subtopics;
  },
  async getSubtopicById(id) {
    return subtopics.find((subtopic) => subtopic.id === id) ?? null;
  },
  async getSubtopicsByTopicId(topicId) {
    return subtopics.filter((subtopic) => subtopic.topicId === topicId);
  }
};

export const mockInterviewQuestionRepository: InterviewQuestionRepository = {
  async getQuestionsByTopicId(topicId) {
    return interviewQuestions.filter((question) => question.topicId === topicId);
  }
};

export const mockRevisionPromptRepository: RevisionPromptRepository = {
  async getPromptsByTopicId(topicId) {
    return revisionPrompts.filter((prompt) => prompt.topicId === topicId);
  },
  async getPromptsForTopics(topicIds) {
    return revisionPrompts.filter((prompt) => topicIds.includes(prompt.topicId));
  }
};

export const mockEvaluationRubricRepository: EvaluationRubricRepository = {
  async getRubricById(id) {
    return evaluationRubrics.find((rubric) => rubric.id === id) ?? null;
  },
  async getRubricByTopicId(topicId) {
    return evaluationRubrics.find((rubric) => rubric.topicId === topicId) ?? null;
  },
  async getRubricByTaskId(taskId) {
    return evaluationRubrics.find((rubric) => rubric.taskId === taskId) ?? null;
  }
};

export const mockProgressRepository: ProgressRepository = {
  async getCurrentProgress() {
    return userProgress;
  },
  async getCompletedTopicIds() {
    return userProgress.completedTopicIds;
  },
  async getCompletedTaskIds() {
    return userProgress.completedTaskIds;
  },
  async getWeakAreas() {
    return userProgress.weakAreas;
  }
};
