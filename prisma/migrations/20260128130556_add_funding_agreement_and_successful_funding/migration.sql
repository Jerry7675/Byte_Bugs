-- CreateEnum
CREATE TYPE "FundingAgreementStatus" AS ENUM ('PENDING_INVESTOR', 'PENDING_STARTUP', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "FundingCategory" AS ENUM ('SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'BRIDGE', 'VENTURE_DEBT', 'ANGEL', 'STRATEGIC', 'OTHER');

-- CreateTable
CREATE TABLE "FundingAgreement" (
    "id" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "counterpartyId" TEXT NOT NULL,
    "category" "FundingCategory" NOT NULL,
    "fundingAmount" DECIMAL(15,2) NOT NULL,
    "platformCommissionRate" DECIMAL(5,2) NOT NULL DEFAULT 5.0,
    "platformCommission" DECIMAL(15,2) NOT NULL,
    "netAmount" DECIMAL(15,2) NOT NULL,
    "termsVersion" TEXT NOT NULL,
    "termsAcceptedByInitiator" BOOLEAN NOT NULL DEFAULT false,
    "termsAcceptedByCounterparty" BOOLEAN NOT NULL DEFAULT false,
    "initiatorAcceptedAt" TIMESTAMP(3),
    "counterpartyAcceptedAt" TIMESTAMP(3),
    "status" "FundingAgreementStatus" NOT NULL DEFAULT 'PENDING_INVESTOR',
    "rejectedBy" TEXT,
    "rejectionReason" TEXT,
    "cancelledBy" TEXT,
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "FundingAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuccessfulFunding" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "category" "FundingCategory" NOT NULL,
    "fundingAmount" DECIMAL(15,2) NOT NULL,
    "platformCommission" DECIMAL(15,2) NOT NULL,
    "netAmount" DECIMAL(15,2) NOT NULL,
    "termsVersion" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuccessfulFunding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FundingAgreement_initiatorId_idx" ON "FundingAgreement"("initiatorId");

-- CreateIndex
CREATE INDEX "FundingAgreement_counterpartyId_idx" ON "FundingAgreement"("counterpartyId");

-- CreateIndex
CREATE INDEX "FundingAgreement_status_idx" ON "FundingAgreement"("status");

-- CreateIndex
CREATE INDEX "FundingAgreement_createdAt_idx" ON "FundingAgreement"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SuccessfulFunding_agreementId_key" ON "SuccessfulFunding"("agreementId");

-- CreateIndex
CREATE INDEX "SuccessfulFunding_investorId_completedAt_idx" ON "SuccessfulFunding"("investorId", "completedAt");

-- CreateIndex
CREATE INDEX "SuccessfulFunding_startupId_completedAt_idx" ON "SuccessfulFunding"("startupId", "completedAt");

-- CreateIndex
CREATE INDEX "SuccessfulFunding_completedAt_idx" ON "SuccessfulFunding"("completedAt");

-- AddForeignKey
ALTER TABLE "FundingAgreement" ADD CONSTRAINT "FundingAgreement_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingAgreement" ADD CONSTRAINT "FundingAgreement_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuccessfulFunding" ADD CONSTRAINT "SuccessfulFunding_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "FundingAgreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuccessfulFunding" ADD CONSTRAINT "SuccessfulFunding_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuccessfulFunding" ADD CONSTRAINT "SuccessfulFunding_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
