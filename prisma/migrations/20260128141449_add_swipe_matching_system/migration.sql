-- CreateEnum
CREATE TYPE "SwipeAction" AS ENUM ('LIKE', 'DISLIKE', 'SKIP');

-- CreateTable
CREATE TABLE "SwipeInteraction" (
    "id" TEXT NOT NULL,
    "swiperId" TEXT NOT NULL,
    "swipedProfileId" TEXT NOT NULL,
    "action" "SwipeAction" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SwipeInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwipeQuota" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "swipesToday" INTEGER NOT NULL DEFAULT 0,
    "quotaDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSkippedProfileId" TEXT,
    "lastSkipTime" TIMESTAMP(3),
    "dailyFreeLimit" INTEGER NOT NULL DEFAULT 10,
    "pointsPerSwipe" INTEGER NOT NULL DEFAULT 5,
    "pointsPerUndo" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SwipeQuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileMatch" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "matchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SwipeInteraction_swiperId_createdAt_idx" ON "SwipeInteraction"("swiperId", "createdAt");

-- CreateIndex
CREATE INDEX "SwipeInteraction_swipedProfileId_idx" ON "SwipeInteraction"("swipedProfileId");

-- CreateIndex
CREATE INDEX "SwipeInteraction_swiperId_swipedProfileId_idx" ON "SwipeInteraction"("swiperId", "swipedProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "SwipeInteraction_swiperId_swipedProfileId_key" ON "SwipeInteraction"("swiperId", "swipedProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "SwipeQuota_userId_key" ON "SwipeQuota"("userId");

-- CreateIndex
CREATE INDEX "SwipeQuota_userId_quotaDate_idx" ON "SwipeQuota"("userId", "quotaDate");

-- CreateIndex
CREATE INDEX "ProfileMatch_user1Id_idx" ON "ProfileMatch"("user1Id");

-- CreateIndex
CREATE INDEX "ProfileMatch_user2Id_idx" ON "ProfileMatch"("user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileMatch_user1Id_user2Id_key" ON "ProfileMatch"("user1Id", "user2Id");

-- AddForeignKey
ALTER TABLE "SwipeInteraction" ADD CONSTRAINT "SwipeInteraction_swiperId_fkey" FOREIGN KEY ("swiperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwipeInteraction" ADD CONSTRAINT "SwipeInteraction_swipedProfileId_fkey" FOREIGN KEY ("swipedProfileId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwipeQuota" ADD CONSTRAINT "SwipeQuota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMatch" ADD CONSTRAINT "ProfileMatch_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMatch" ADD CONSTRAINT "ProfileMatch_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
