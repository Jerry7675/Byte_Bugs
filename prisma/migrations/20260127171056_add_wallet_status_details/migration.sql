-- AlterTable
ALTER TABLE "PointsTransaction" ADD COLUMN     "balanceAfter" INTEGER,
ADD COLUMN     "balanceBefore" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
