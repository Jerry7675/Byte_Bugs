-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "boostCost" INTEGER,
ADD COLUMN     "boostExpiresAt" TIMESTAMP(3),
ADD COLUMN     "boostedAt" TIMESTAMP(3),
ADD COLUMN     "isBoosted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Post_isBoosted_boostExpiresAt_idx" ON "Post"("isBoosted", "boostExpiresAt");
