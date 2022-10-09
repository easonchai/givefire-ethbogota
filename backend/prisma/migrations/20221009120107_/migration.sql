-- CreateTable
CREATE TABLE "Donor" (
    "donorId" SERIAL NOT NULL,
    "donorNickname" TEXT NOT NULL,
    "donorGroupId" INTEGER,
    "donorWalletAddress" TEXT NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("donorId")
);

-- CreateTable
CREATE TABLE "Group" (
    "groupId" SERIAL NOT NULL,
    "groupName" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("groupId")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "proposalId" SERIAL NOT NULL,
    "beneficiaryId" INTEGER,
    "groupId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "votes" TEXT[],
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("proposalId")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "beneficiaryId" SERIAL NOT NULL,
    "fundingTarget" DOUBLE PRECISION NOT NULL,
    "fundingReceived" DOUBLE PRECISION NOT NULL,
    "worldcoinHash" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("beneficiaryId")
);

-- CreateTable
CREATE TABLE "Donations" (
    "donationId" SERIAL NOT NULL,
    "beneficiaryId" INTEGER NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "donationTimestamp" TIMESTAMP(3) NOT NULL,
    "donationAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Donations_pkey" PRIMARY KEY ("donationId")
);

-- CreateTable
CREATE TABLE "Funders" (
    "funderId" SERIAL NOT NULL,
    "proposalId" INTEGER NOT NULL,
    "donorId" INTEGER NOT NULL,
    "funderAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Funders_pkey" PRIMARY KEY ("funderId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donor_donorId_key" ON "Donor"("donorId");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_donorNickname_key" ON "Donor"("donorNickname");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_donorWalletAddress_key" ON "Donor"("donorWalletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Group_groupId_key" ON "Group"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_proposalId_key" ON "Proposal"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_beneficiaryId_key" ON "Beneficiary"("beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "Donations_donationId_key" ON "Donations"("donationId");

-- CreateIndex
CREATE UNIQUE INDEX "Funders_funderId_key" ON "Funders"("funderId");

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_donorGroupId_fkey" FOREIGN KEY ("donorGroupId") REFERENCES "Group"("groupId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("beneficiaryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donations" ADD CONSTRAINT "Donations_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("beneficiaryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donations" ADD CONSTRAINT "Donations_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("proposalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funders" ADD CONSTRAINT "Funders_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("proposalId") ON DELETE RESTRICT ON UPDATE CASCADE;
