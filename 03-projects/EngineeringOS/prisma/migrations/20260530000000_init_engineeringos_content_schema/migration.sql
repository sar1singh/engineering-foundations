-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetRoles" TEXT NOT NULL,
    "targetLevels" TEXT NOT NULL,
    "targetCompanyTypes" TEXT NOT NULL,
    "estimatedWeeks" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roadmapId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Domain_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Category_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "LearningModule_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "whyItMatters" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "tags" TEXT NOT NULL,
    "prerequisites" TEXT NOT NULL,
    "relatedTopics" TEXT NOT NULL,
    "advancedTopics" TEXT NOT NULL,
    "roleRelevance" TEXT NOT NULL,
    "companyRelevance" TEXT NOT NULL,
    "interviewRelevance" INTEGER NOT NULL,
    "learningModes" TEXT NOT NULL,
    "theory" TEXT NOT NULL,
    "mentalModel" TEXT NOT NULL,
    "codeExamples" TEXT NOT NULL,
    "productionUseCases" TEXT NOT NULL,
    "commonMistakes" TEXT NOT NULL,
    "explainBackPrompt" TEXT NOT NULL,
    "completionCriteria" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Topic_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "LearningModule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TopicRelation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceTopicId" TEXT NOT NULL,
    "targetTopicId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    CONSTRAINT "TopicRelation_sourceTopicId_fkey" FOREIGN KEY ("sourceTopicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TopicRelation_targetTopicId_fkey" FOREIGN KEY ("targetTopicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subtopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "theory" TEXT NOT NULL,
    "examples" TEXT NOT NULL,
    "completionCriteria" TEXT NOT NULL,
    CONSTRAINT "Subtopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PracticeTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "subtopicId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "taskType" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "starterCode" TEXT,
    "solutionApproach" TEXT,
    "hints" TEXT NOT NULL,
    "edgeCases" TEXT NOT NULL,
    "completionCriteria" TEXT NOT NULL,
    "problemStatementId" TEXT,
    CONSTRAINT "PracticeTask_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PracticeTask_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "Subtopic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PracticeTask_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "ProblemStatement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PracticeSubtask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "practiceTaskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "PracticeSubtask_practiceTaskId_fkey" FOREIGN KEY ("practiceTaskId") REFERENCES "PracticeTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProblemStatement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalUrl" TEXT,
    "difficulty" TEXT NOT NULL,
    "topicIds" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "expectedOutput" TEXT
);

-- CreateTable
CREATE TABLE "ProblemExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemStatementId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    CONSTRAINT "ProblemExample_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "ProblemStatement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemStatementId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TestCase_problemStatementId_fkey" FOREIGN KEY ("problemStatementId") REFERENCES "ProblemStatement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "level" TEXT NOT NULL,
    CONSTRAINT "InterviewQuestion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReferenceLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    CONSTRAINT "ReferenceLink_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RevisionPrompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    CONSTRAINT "RevisionPrompt_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EvaluationRubric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT,
    "taskId" TEXT,
    CONSTRAINT "EvaluationRubric_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EvaluationRubric_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "PracticeTask" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EvaluationCriterion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rubricId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "maxScore" INTEGER NOT NULL,
    CONSTRAINT "EvaluationCriterion_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "EvaluationRubric" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "completedTopicIds" TEXT NOT NULL,
    "completedTaskIds" TEXT NOT NULL,
    "weakAreas" TEXT NOT NULL,
    "streakCount" INTEGER NOT NULL,
    "lastActiveDate" DATETIME,
    "readinessScore" INTEGER NOT NULL,
    "interviewReadinessPercent" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_slug_key" ON "Roadmap"("slug");

-- CreateIndex
CREATE INDEX "Domain_roadmapId_idx" ON "Domain"("roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_roadmapId_slug_key" ON "Domain"("roadmapId", "slug");

-- CreateIndex
CREATE INDEX "Category_domainId_idx" ON "Category"("domainId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_domainId_slug_key" ON "Category"("domainId", "slug");

-- CreateIndex
CREATE INDEX "LearningModule_categoryId_idx" ON "LearningModule"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningModule_categoryId_slug_key" ON "LearningModule"("categoryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- CreateIndex
CREATE INDEX "Topic_moduleId_idx" ON "Topic"("moduleId");

-- CreateIndex
CREATE INDEX "TopicRelation_sourceTopicId_idx" ON "TopicRelation"("sourceTopicId");

-- CreateIndex
CREATE INDEX "TopicRelation_targetTopicId_idx" ON "TopicRelation"("targetTopicId");

-- CreateIndex
CREATE INDEX "Subtopic_topicId_idx" ON "Subtopic"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Subtopic_topicId_slug_key" ON "Subtopic"("topicId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeTask_slug_key" ON "PracticeTask"("slug");

-- CreateIndex
CREATE INDEX "PracticeTask_topicId_idx" ON "PracticeTask"("topicId");

-- CreateIndex
CREATE INDEX "PracticeTask_subtopicId_idx" ON "PracticeTask"("subtopicId");

-- CreateIndex
CREATE INDEX "PracticeTask_problemStatementId_idx" ON "PracticeTask"("problemStatementId");

-- CreateIndex
CREATE INDEX "PracticeSubtask_practiceTaskId_idx" ON "PracticeSubtask"("practiceTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemStatement_slug_key" ON "ProblemStatement"("slug");

-- CreateIndex
CREATE INDEX "ProblemExample_problemStatementId_idx" ON "ProblemExample"("problemStatementId");

-- CreateIndex
CREATE INDEX "TestCase_problemStatementId_idx" ON "TestCase"("problemStatementId");

-- CreateIndex
CREATE INDEX "InterviewQuestion_topicId_idx" ON "InterviewQuestion"("topicId");

-- CreateIndex
CREATE INDEX "ReferenceLink_topicId_idx" ON "ReferenceLink"("topicId");

-- CreateIndex
CREATE INDEX "RevisionPrompt_topicId_idx" ON "RevisionPrompt"("topicId");

-- CreateIndex
CREATE INDEX "EvaluationRubric_topicId_idx" ON "EvaluationRubric"("topicId");

-- CreateIndex
CREATE INDEX "EvaluationRubric_taskId_idx" ON "EvaluationRubric"("taskId");

-- CreateIndex
CREATE INDEX "EvaluationCriterion_rubricId_idx" ON "EvaluationCriterion"("rubricId");

