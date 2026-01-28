-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('FUNDING_REQUEST', 'INVESTMENT_OFFER', 'UPDATE', 'ANNOUNCEMENT', 'MILESTONE', 'OTHER');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "postType" "PostType" NOT NULL DEFAULT 'UPDATE',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_category_idx" ON "Post"("category");

-- CreateIndex
CREATE INDEX "Post_postType_idx" ON "Post"("postType");
