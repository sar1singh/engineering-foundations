CREATE TABLE "LearnerProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "email" TEXT,
    "targetRole" TEXT NOT NULL,
    "currentLevel" TEXT NOT NULL,
    "hoursPerWeek" INTEGER NOT NULL,
    "deadlineWeeks" INTEGER NOT NULL,
    "weakAreas" TEXT NOT NULL,
    "learningMode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "LearnerProfile_userId_key" ON "LearnerProfile"("userId");
CREATE INDEX "LearnerProfile_userId_idx" ON "LearnerProfile"("userId");
