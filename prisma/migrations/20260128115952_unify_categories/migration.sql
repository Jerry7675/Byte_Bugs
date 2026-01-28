/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InvestorCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StartupCategories` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `category` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('FUNDING', 'TECHNOLOGY', 'MARKETING', 'OPERATIONS', 'GENERAL');

-- DropForeignKey
ALTER TABLE "_InvestorCategories" DROP CONSTRAINT "_InvestorCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_InvestorCategories" DROP CONSTRAINT "_InvestorCategories_B_fkey";

-- DropForeignKey
ALTER TABLE "_StartupCategories" DROP CONSTRAINT "_StartupCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_StartupCategories" DROP CONSTRAINT "_StartupCategories_B_fkey";

-- AlterTable
ALTER TABLE "InvestorProfile" ADD COLUMN     "categories" "CategoryType"[] DEFAULT ARRAY[]::"CategoryType"[];

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "category",
ADD COLUMN     "category" "CategoryType" NOT NULL;

-- AlterTable
ALTER TABLE "StartupProfile" ADD COLUMN     "categories" "CategoryType"[] DEFAULT ARRAY[]::"CategoryType"[];

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "_InvestorCategories";

-- DropTable
DROP TABLE "_StartupCategories";

-- DropEnum
DROP TYPE "PostCategory";

-- CreateIndex
CREATE INDEX "Post_category_idx" ON "Post"("category");
