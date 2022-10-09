import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const benefactor = await prisma.beneficiary.upsert({
    where: {
      beneficiaryId: 0,
    },
    create: {
      fundingTarget: 100000,
      fundingReceived: 0,
      worldcoinHash: "worldcoinhash",
      startDate: new Date(),
      endDate: new Date(1665317577000),
    },
    update: {},
  });
  const group = await prisma.group.upsert({
    where: {
      groupId: 0,
    },
    create: {
      groupName: "Her DAO gives back  🌱",
      donors: {
        createMany: {
          data: [
            {
              donorNickname: "Emma",
              donorWalletAddress: "0xb0a2d1ab5E353749812A1aE47168C2f175d5277B",
            },
            {
              donorNickname: "vitalik.eth",
              donorWalletAddress: "0x023fF11EfAEbE09Dc0616C759AFFC1BeaE18dA89",
            },
            {
              donorNickname: "Jen",
              donorWalletAddress: "0x1aDe097d7E7cae465E69a7324D8DA6b04B4d841a",
            },
            {
              donorNickname: "Lou",
              donorWalletAddress: "0x51f6466CD123Db661bc244145758Ab31118d6507",
            },
            {
              donorNickname: "Gem",
              donorWalletAddress: "0x5158F0E689Fd5457E9DDE9575701816B2cF626B9",
            },
          ],
        },
      },
    },
    update: {},
  });
  const proposal = await prisma.proposal.upsert({
    where: {
      proposalId: 0,
    },
    create: {
      Beneficiary: {
        connect: {
          beneficiaryId: benefactor.beneficiaryId,
        },
      },
      Group: {
        connect: {
          groupId: group.groupId,
        },
      },
      startDate: new Date(),
      endDate: new Date(1665361269000),
    },
    update: {},
  });

  console.log({ benefactor, group, proposal });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
