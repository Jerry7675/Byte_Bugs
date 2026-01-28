-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('IDENTITY', 'ROLE', 'ACTIVITY', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "VerificationStageStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VerificationActor" AS ENUM ('USER', 'ADMIN', 'SYSTEM');

-- CreateTable
CREATE TABLE "VerificationStage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "status" "VerificationStageStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "submittedBy" "VerificationActor" NOT NULL DEFAULT 'USER',
    "reviewedBy" "VerificationActor",
    "reviewerId" TEXT,
    "reviewNote" TEXT,
    "expiresAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityMetric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationsStarted" INTEGER NOT NULL DEFAULT 0,
    "conversationsReceived" INTEGER NOT NULL DEFAULT 0,
    "messagesExchanged" INTEGER NOT NULL DEFAULT 0,
    "postsCreated" INTEGER NOT NULL DEFAULT 0,
    "reviewsGiven" INTEGER NOT NULL DEFAULT 0,
    "reviewsReceived" INTEGER NOT NULL DEFAULT 0,
    "dealsInitiated" INTEGER NOT NULL DEFAULT 0,
    "dealsCompleted" INTEGER NOT NULL DEFAULT 0,
    "activityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityMetric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "verifiedReviews" INTEGER NOT NULL DEFAULT 0,
    "endorsementCount" INTEGER NOT NULL DEFAULT 0,
    "endorsedByVerified" INTEGER NOT NULL DEFAULT 0,
    "responseRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageResponseTime" INTEGER,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VerificationStage_userId_type_idx" ON "VerificationStage"("userId", "type");

-- CreateIndex
CREATE INDEX "VerificationStage_status_idx" ON "VerificationStage"("status");

-- CreateIndex
CREATE INDEX "VerificationStage_type_idx" ON "VerificationStage"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityMetric_userId_key" ON "ActivityMetric"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityMetric_userId_key" ON "CommunityMetric"("userId");

-- AddForeignKey
ALTER TABLE "VerificationStage" ADD CONSTRAINT "VerificationStage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationStage" ADD CONSTRAINT "VerificationStage_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityMetric" ADD CONSTRAINT "ActivityMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMetric" ADD CONSTRAINT "CommunityMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
