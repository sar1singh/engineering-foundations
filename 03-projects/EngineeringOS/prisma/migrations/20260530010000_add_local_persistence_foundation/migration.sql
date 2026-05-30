-- CreateTable
CREATE TABLE "UserTopicProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserTopicProgress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserTaskProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserTaskProgress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "PracticeTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExplainBackAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "taskId" TEXT,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExplainBackAttempt_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExplainBackAttempt_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "PracticeTask" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIEvaluationResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "topicId" TEXT,
    "taskId" TEXT,
    "explainBackId" TEXT,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "improvements" TEXT NOT NULL,
    "evaluationSource" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIEvaluationResult_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AIEvaluationResult_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "PracticeTask" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RevisionQueueItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "revisionPromptId" TEXT,
    "status" TEXT NOT NULL,
    "nextReviewAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RevisionQueueItem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RevisionQueueItem_revisionPromptId_fkey" FOREIGN KEY ("revisionPromptId") REFERENCES "RevisionPrompt" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserWeakArea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserWeakArea_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserTopicProgress_topicId_idx" ON "UserTopicProgress"("topicId");

-- CreateIndex
CREATE INDEX "UserTopicProgress_userId_idx" ON "UserTopicProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTopicProgress_userId_topicId_key" ON "UserTopicProgress"("userId", "topicId");

-- CreateIndex
CREATE INDEX "UserTaskProgress_taskId_idx" ON "UserTaskProgress"("taskId");

-- CreateIndex
CREATE INDEX "UserTaskProgress_userId_idx" ON "UserTaskProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTaskProgress_userId_taskId_key" ON "UserTaskProgress"("userId", "taskId");

-- CreateIndex
CREATE INDEX "ExplainBackAttempt_userId_idx" ON "ExplainBackAttempt"("userId");

-- CreateIndex
CREATE INDEX "ExplainBackAttempt_topicId_idx" ON "ExplainBackAttempt"("topicId");

-- CreateIndex
CREATE INDEX "ExplainBackAttempt_taskId_idx" ON "ExplainBackAttempt"("taskId");

-- CreateIndex
CREATE INDEX "AIEvaluationResult_userId_idx" ON "AIEvaluationResult"("userId");

-- CreateIndex
CREATE INDEX "AIEvaluationResult_topicId_idx" ON "AIEvaluationResult"("topicId");

-- CreateIndex
CREATE INDEX "AIEvaluationResult_taskId_idx" ON "AIEvaluationResult"("taskId");

-- CreateIndex
CREATE INDEX "AIEvaluationResult_explainBackId_idx" ON "AIEvaluationResult"("explainBackId");

-- CreateIndex
CREATE INDEX "RevisionQueueItem_userId_idx" ON "RevisionQueueItem"("userId");

-- CreateIndex
CREATE INDEX "RevisionQueueItem_topicId_idx" ON "RevisionQueueItem"("topicId");

-- CreateIndex
CREATE INDEX "RevisionQueueItem_revisionPromptId_idx" ON "RevisionQueueItem"("revisionPromptId");

-- CreateIndex
CREATE INDEX "UserWeakArea_topicId_idx" ON "UserWeakArea"("topicId");

-- CreateIndex
CREATE INDEX "UserWeakArea_userId_idx" ON "UserWeakArea"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWeakArea_userId_topicId_source_key" ON "UserWeakArea"("userId", "topicId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_key" ON "UserProgress"("userId");
