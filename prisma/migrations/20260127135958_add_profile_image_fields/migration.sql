-- AlterTable
ALTER TABLE "InvestorProfile" ADD COLUMN     "kycDocumentNumber" TEXT,
ADD COLUMN     "kycDocumentType" TEXT,
ADD COLUMN     "kycDocumentUrl" TEXT,
ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "StartupProfile" ADD COLUMN     "kycDocumentNumber" TEXT,
ADD COLUMN     "kycDocumentType" TEXT,
ADD COLUMN     "kycDocumentUrl" TEXT,
ADD COLUMN     "photo" TEXT;
