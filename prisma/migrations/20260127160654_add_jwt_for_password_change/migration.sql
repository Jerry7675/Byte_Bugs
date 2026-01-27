-- AlterTable
ALTER TABLE "User" ADD COLUMN     "JWtToken" TEXT,
ADD COLUMN     "JwtIssuedAt" TIMESTAMP(3);
