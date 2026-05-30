import { PrismaClient } from "@prisma/client";
import { categories } from "../src/data/categories";
import { domains } from "../src/data/domains";
import { evaluationRubrics } from "../src/data/evaluation-rubrics";
import { interviewQuestions } from "../src/data/interview-questions";
import { topicRelations } from "../src/data/learning-graph";
import { modules } from "../src/data/modules";
import { practiceTasks } from "../src/data/practice-tasks";
import { problemStatements } from "../src/data/problem-statements";
import { userProgress } from "../src/data/progress";
import { referenceLinks } from "../src/data/reference-links";
import { revisionPrompts } from "../src/data/revision-prompts";
import { roadmaps } from "../src/data/roadmaps";
import { subtopics } from "../src/data/subtopics";
import { topics } from "../src/data/topics";

const prisma = new PrismaClient();
const json = (value: unknown) => JSON.stringify(value);

async function main() {
  for (const roadmap of roadmaps) {
    await prisma.roadmap.upsert({
      where: { id: roadmap.id },
      update: {
        title: roadmap.title,
        slug: roadmap.slug,
        description: roadmap.description,
        targetRoles: json(roadmap.targetRole),
        targetLevels: json(roadmap.targetLevel),
        targetCompanyTypes: json(roadmap.targetCompanyTypes),
        estimatedWeeks: roadmap.estimatedWeeks,
        isActive: roadmap.isActive,
        createdAt: new Date(roadmap.createdAt),
        updatedAt: new Date(roadmap.updatedAt)
      },
      create: {
        id: roadmap.id,
        title: roadmap.title,
        slug: roadmap.slug,
        description: roadmap.description,
        targetRoles: json(roadmap.targetRole),
        targetLevels: json(roadmap.targetLevel),
        targetCompanyTypes: json(roadmap.targetCompanyTypes),
        estimatedWeeks: roadmap.estimatedWeeks,
        isActive: roadmap.isActive,
        createdAt: new Date(roadmap.createdAt),
        updatedAt: new Date(roadmap.updatedAt)
      }
    });
  }

  for (const domain of domains) {
    await prisma.domain.upsert({
      where: { id: domain.id },
      update: {
        roadmapId: domain.roadmapId,
        title: domain.title,
        slug: domain.slug,
        description: domain.description,
        order: domain.order
      },
      create: {
        id: domain.id,
        roadmapId: domain.roadmapId,
        title: domain.title,
        slug: domain.slug,
        description: domain.description,
        order: domain.order
      }
    });
  }

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        domainId: category.domainId,
        title: category.title,
        slug: category.slug,
        description: category.description,
        order: category.order
      },
      create: {
        id: category.id,
        domainId: category.domainId,
        title: category.title,
        slug: category.slug,
        description: category.description,
        order: category.order
      }
    });
  }

  for (const learningModule of modules) {
    await prisma.learningModule.upsert({
      where: { id: learningModule.id },
      update: {
        categoryId: learningModule.categoryId,
        title: learningModule.title,
        slug: learningModule.slug,
        description: learningModule.description,
        order: learningModule.order
      },
      create: {
        id: learningModule.id,
        categoryId: learningModule.categoryId,
        title: learningModule.title,
        slug: learningModule.slug,
        description: learningModule.description,
        order: learningModule.order
      }
    });
  }

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: {
        moduleId: topic.moduleId,
        title: topic.title,
        slug: topic.slug,
        summary: topic.summary,
        whyItMatters: topic.whyItMatters,
        difficulty: topic.difficulty,
        estimatedMinutes: topic.estimatedMinutes,
        tags: json(topic.tags),
        prerequisites: json(topic.prerequisites),
        relatedTopics: json(topic.relatedTopics),
        advancedTopics: json(topic.advancedTopics),
        roleRelevance: json(topic.roleRelevance),
        companyRelevance: json(topic.companyRelevance),
        interviewRelevance: topic.interviewRelevance,
        learningModes: json(topic.learningModes),
        theory: topic.theory,
        mentalModel: topic.mentalModel,
        codeExamples: json(topic.codeExamples),
        productionUseCases: json(topic.productionUseCases),
        commonMistakes: json(topic.commonMistakes),
        explainBackPrompt: topic.explainBackPrompt,
        completionCriteria: json(topic.completionCriteria),
        createdAt: new Date(topic.createdAt),
        updatedAt: new Date(topic.updatedAt)
      },
      create: {
        id: topic.id,
        moduleId: topic.moduleId,
        title: topic.title,
        slug: topic.slug,
        summary: topic.summary,
        whyItMatters: topic.whyItMatters,
        difficulty: topic.difficulty,
        estimatedMinutes: topic.estimatedMinutes,
        tags: json(topic.tags),
        prerequisites: json(topic.prerequisites),
        relatedTopics: json(topic.relatedTopics),
        advancedTopics: json(topic.advancedTopics),
        roleRelevance: json(topic.roleRelevance),
        companyRelevance: json(topic.companyRelevance),
        interviewRelevance: topic.interviewRelevance,
        learningModes: json(topic.learningModes),
        theory: topic.theory,
        mentalModel: topic.mentalModel,
        codeExamples: json(topic.codeExamples),
        productionUseCases: json(topic.productionUseCases),
        commonMistakes: json(topic.commonMistakes),
        explainBackPrompt: topic.explainBackPrompt,
        completionCriteria: json(topic.completionCriteria),
        createdAt: new Date(topic.createdAt),
        updatedAt: new Date(topic.updatedAt)
      }
    });
  }

  for (const relation of topicRelations) {
    await prisma.topicRelation.upsert({
      where: { id: relation.id },
      update: relation,
      create: relation
    });
  }

  for (const subtopic of subtopics) {
    await prisma.subtopic.upsert({
      where: { id: subtopic.id },
      update: {
        topicId: subtopic.topicId,
        title: subtopic.title,
        slug: subtopic.slug,
        summary: subtopic.summary,
        order: subtopic.order,
        theory: subtopic.theory,
        examples: json(subtopic.examples),
        completionCriteria: json(subtopic.completionCriteria)
      },
      create: {
        id: subtopic.id,
        topicId: subtopic.topicId,
        title: subtopic.title,
        slug: subtopic.slug,
        summary: subtopic.summary,
        order: subtopic.order,
        theory: subtopic.theory,
        examples: json(subtopic.examples),
        completionCriteria: json(subtopic.completionCriteria)
      }
    });
  }

  for (const problem of problemStatements) {
    await prisma.problemStatement.upsert({
      where: { id: problem.id },
      update: {
        title: problem.title,
        slug: problem.slug,
        source: problem.source,
        externalUrl: problem.externalUrl,
        difficulty: problem.difficulty,
        topicIds: json(problem.topicIds),
        statement: problem.statement,
        constraints: json(problem.constraints),
        expectedOutput: problem.expectedOutput
      },
      create: {
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        source: problem.source,
        externalUrl: problem.externalUrl,
        difficulty: problem.difficulty,
        topicIds: json(problem.topicIds),
        statement: problem.statement,
        constraints: json(problem.constraints),
        expectedOutput: problem.expectedOutput
      }
    });

    for (const [index, example] of problem.examples.entries()) {
      await prisma.problemExample.upsert({
        where: { id: `example-${problem.id}-${index + 1}` },
        update: { ...example, problemStatementId: problem.id },
        create: { id: `example-${problem.id}-${index + 1}`, problemStatementId: problem.id, ...example }
      });
    }

    for (const [index, testCase] of problem.testCases.entries()) {
      await prisma.testCase.upsert({
        where: { id: `test-${problem.id}-${index + 1}` },
        update: { ...testCase, problemStatementId: problem.id },
        create: { id: `test-${problem.id}-${index + 1}`, problemStatementId: problem.id, ...testCase }
      });
    }
  }

  for (const task of practiceTasks) {
    await prisma.practiceTask.upsert({
      where: { id: task.id },
      update: {
        topicId: task.topicId,
        subtopicId: task.subtopicId,
        title: task.title,
        slug: task.slug,
        difficulty: task.difficulty,
        estimatedMinutes: task.estimatedMinutes,
        taskType: task.taskType,
        statement: task.statement,
        starterCode: task.starterCode,
        solutionApproach: task.solutionApproach,
        hints: json(task.hints),
        edgeCases: json(task.edgeCases),
        completionCriteria: json(task.completionCriteria),
        problemStatementId: task.problemStatementId
      },
      create: {
        id: task.id,
        topicId: task.topicId,
        subtopicId: task.subtopicId,
        title: task.title,
        slug: task.slug,
        difficulty: task.difficulty,
        estimatedMinutes: task.estimatedMinutes,
        taskType: task.taskType,
        statement: task.statement,
        starterCode: task.starterCode,
        solutionApproach: task.solutionApproach,
        hints: json(task.hints),
        edgeCases: json(task.edgeCases),
        completionCriteria: json(task.completionCriteria),
        problemStatementId: task.problemStatementId
      }
    });

    for (const subtask of task.subtasks) {
      await prisma.practiceSubtask.upsert({
        where: { id: subtask.id },
        update: {
          practiceTaskId: task.id,
          title: subtask.title,
          description: subtask.description,
          order: subtask.order,
          isRequired: subtask.isRequired
        },
        create: {
          id: subtask.id,
          practiceTaskId: task.id,
          title: subtask.title,
          description: subtask.description,
          order: subtask.order,
          isRequired: subtask.isRequired
        }
      });
    }
  }

  for (const question of interviewQuestions) {
    await prisma.interviewQuestion.upsert({
      where: { id: question.id },
      update: question,
      create: question
    });
  }

  for (const reference of referenceLinks) {
    for (const topicId of reference.topicIds) {
      const id = reference.topicIds.length === 1 ? reference.id : `${reference.id}-${topicId}`;
      await prisma.referenceLink.upsert({
        where: { id },
        update: {
          topicId,
          title: reference.title,
          url: reference.url,
          sourceType: reference.sourceType,
          priority: reference.priority
        },
        create: {
          id,
          topicId,
          title: reference.title,
          url: reference.url,
          sourceType: reference.sourceType,
          priority: reference.priority
        }
      });
    }
  }

  for (const prompt of revisionPrompts) {
    await prisma.revisionPrompt.upsert({
      where: { id: prompt.id },
      update: prompt,
      create: prompt
    });
  }

  for (const rubric of evaluationRubrics) {
    await prisma.evaluationRubric.upsert({
      where: { id: rubric.id },
      update: {
        topicId: rubric.topicId,
        taskId: rubric.taskId
      },
      create: {
        id: rubric.id,
        topicId: rubric.topicId,
        taskId: rubric.taskId
      }
    });

    for (const criterion of rubric.criteria) {
      await prisma.evaluationCriterion.upsert({
        where: { id: criterion.id },
        update: {
          rubricId: rubric.id,
          title: criterion.title,
          description: criterion.description,
          maxScore: criterion.maxScore
        },
        create: {
          id: criterion.id,
          rubricId: rubric.id,
          title: criterion.title,
          description: criterion.description,
          maxScore: criterion.maxScore
        }
      });
    }
  }

  await prisma.userProgress.upsert({
    where: { id: userProgress.id },
    update: {
      userId: userProgress.userId,
      completedTopicIds: json(userProgress.completedTopicIds),
      completedTaskIds: json(userProgress.completedTaskIds),
      weakAreas: json(userProgress.weakAreas),
      streakCount: userProgress.streakCount,
      lastActiveDate: userProgress.lastActiveDate ? new Date(userProgress.lastActiveDate) : null,
      readinessScore: userProgress.readinessScore,
      interviewReadinessPercent: userProgress.interviewReadinessPercent,
      createdAt: new Date(userProgress.createdAt),
      updatedAt: new Date(userProgress.updatedAt)
    },
    create: {
      id: userProgress.id,
      userId: userProgress.userId,
      completedTopicIds: json(userProgress.completedTopicIds),
      completedTaskIds: json(userProgress.completedTaskIds),
      weakAreas: json(userProgress.weakAreas),
      streakCount: userProgress.streakCount,
      lastActiveDate: userProgress.lastActiveDate ? new Date(userProgress.lastActiveDate) : null,
      readinessScore: userProgress.readinessScore,
      interviewReadinessPercent: userProgress.interviewReadinessPercent,
      createdAt: new Date(userProgress.createdAt),
      updatedAt: new Date(userProgress.updatedAt)
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
