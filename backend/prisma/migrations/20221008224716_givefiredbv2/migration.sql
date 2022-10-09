-- DropForeignKey
ALTER TABLE "Proposal" DROP CONSTRAINT "Proposal_beneficiaryId_fkey";

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "votes" JSONB,
ALTER COLUMN "beneficiaryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("beneficiaryId") ON DELETE SET NULL ON UPDATE CASCADE;
