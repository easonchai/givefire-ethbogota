import { PrismaClient } from "@prisma/client";
import express from "express";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import GiveFire from "./GiveFire";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

/**
 * APIs for 6 Different Models
 *
 * 1. Donor
 * 2. Group
 * 3. Proposal
 * 4. Funders
 * 5. Donations
 * 6. Beneficiary
 */

/**
 * API Declarations for Donor
 *
 * 1. Create Donor
 * 2. Get Donor by Wallet Address
 * 3. Get All Donors
 * 4. Update Donor by Wallet Address
 * 5. Delete Donor by Wallet Address
 * 6. Get All Donors by Group
 */

/**
 * Create Donor
 *
 * @param {string} nickname
 * @param {string} walletAddress
 * @param {string} groupId @optional
 */
app.post("/createDonor", async (req, res) => {
  const { nickname, walletAddress, groupId } = req.body;
  if (!nickname || !walletAddress) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  } else {
    const donor = await prisma.donor.create({
      data: {
        donorNickname: nickname,
        donorWalletAddress: walletAddress,
        donorGroupId: groupId,
      },
    });
    res.json(donor);
  }

  /**
   * Get Donor by Wallet Address
   *
   * @param {string} walletAddress
   */
  app.get("/getDonor/:walletAddress", async (req, res) => {
    //if there is no walletAddress in the request, return error
    if (!req.params.walletAddress) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    } else {
      const donor = await prisma.donor.findUnique({
        where: {
          donorWalletAddress: req.params.walletAddress,
        },
      });
      res.json(donor);
    }
  });

  /**
   * Get All Donors
   */
  app.get("/donors", async (req, res) => {
    const donors = await prisma.donor.findMany();
    console.log(donors);
    res.json(donors);
  });

  /**
   * Get All Donors by Group
   *
   * @param {string} groupId
   */
  app.get("/donors/:groupId", async (req, res) => {
    const donors = await prisma.donor.findMany({
      where: {
        donorGroupId: Number(req.params.groupId),
      },
    });
    res.json(donors);
  });

  /**
   * Update Donor by Wallet Address
   *
   * @param {string} walletAddress
   * @param {string} newData
   */
  app.put("/updateDonor/:walletAddress", async (req, res) => {
    const { newData } = req.body;
    if (!req.params.walletAddress || !newData) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    } else {
      const donor = await prisma.donor.update({
        where: {
          donorWalletAddress: req.params.walletAddress,
        },
        data: {
          donorNickname: newData.nickname,
          donorWalletAddress: newData.walletAddress,
          donorGroupId: newData.groupId,
        },
      });
      res.json(donor);
    }
  });

  /**
   * Delete Donor by Wallet Address
   *
   * @param {string} walletAddress
   */
  app.delete("/deleteDonor/:walletAddress", async (req, res) => {
    if (!req.params.walletAddress) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    } else {
      const donor = await prisma.donor.delete({
        where: {
          donorWalletAddress: req.params.walletAddress,
        },
      });
      res.json(donor);
    }
  });

  /**
   * API Declarations for Group
   *
   * 1. Create Group
   * 2. Get Group by Group ID
   * 3. Get All Groups
   * 4. Add Donor to Group
   * 5. Remove Donor from Group
   * 6. Add Proposal to Group
   * 7. Remove Proposal from Group
   * 8. Get Group from Donor ID
   * 9. Delete Group by Group ID
   *  */

  /**
   * Create Group
   *
   * @param {string} donorId
   * @param {string} groupName
   */
  app.post("/createGroup", async (req, res) => {
    const { donorId, groupName } = req.body;
    if (!donorId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    } else {
      const group = await prisma.group.create({
        data: {
          donors: donorId,
          groupName: groupName,
        },
      });
      res.json(group);
    }
  });
});

/**
 * Get Group by Group ID
 *
 * @param {string} groupId
 */
app.get("/groups/:groupId", async (req, res) => {
  const group = await prisma.group.findUnique({
    where: {
      groupId: Number(req.params.groupId),
    },
  });
  res.json(group);
});

/**
 * Get All Groups
 */
app.get("/groups", async (req, res) => {
  const groups = await prisma.group.findMany();
  res.json(groups);
});

/**
 * Add Donor to Group
 *
 * @param {string} donorId
 * @param {string} groupId
 */
app.put("/addDonorToGroup/:groupId", async (req, res) => {
  const { donorId } = req.body;
  if (!donorId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  } else if (
    (await prisma.group.count({
      where: {
        groupId: Number(req.params.groupId),
      },
    })) == 5
  ) {
    res.status(400).json({ error: "Group is full" });
    return;
  } else {
    const group = await prisma.group.update({
      where: {
        groupId: Number(req.params.groupId),
      },
      data: {
        donors: {
          connect: {
            donorId: donorId,
          },
        },
      },
    });
    res.json(group);
  }
});

/**
 * Remove Donor from Group
 *
 * @param {string} donorId
 * @param {string} groupId
 */
app.put("/removeDonorFromGroup/:groupId", async (req, res) => {
  const { donorId } = req.body;
  if (!donorId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  } else {
    const group = await prisma.group.update({
      where: {
        groupId: Number(req.params.groupId),
      },
      data: {
        donors: {
          disconnect: {
            donorId: donorId,
          },
        },
      },
    });
    res.json(group);
  }
});

/**
 * Add Proposal to Group
 *
 * @param {string} proposalId
 * @param {string} groupId
 */
// app.put('/addProposalToGroup/:groupId', async (req, res) => {
//     const { proposalId } = req.body
//     if (!proposalId) {
//         res.status(400).json({ error: 'Missing required fields' })
//         return
//     } else {
//         const group = await prisma.group.update({
//             where: {
//                 groupId: req.params.groupId
//             },
//             data: {
//                 proposals: {
//                     connect: {
//                         proposalId: proposalId
//                     }
//                 }
//             }
//         })
//         res.json(group)
//     }
// })

/**
 * Remove Proposal from Group
 *
 * @param {string} proposalId
 * @param {string} groupId
 */
app.put("/removeProposalFromGroup/:groupId", async (req, res) => {
  const { proposalId } = req.body;
  if (!proposalId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  } else {
    const group = await prisma.group.update({
      where: {
        groupId: Number(req.params.groupId),
      },
      data: {
        proposals: {
          disconnect: {
            proposalId: proposalId,
          },
        },
      },
    });
    res.json(group);
  }
});

/**
 * Get One Group from One Donor ID
 *
 * @param {string} donorId
 */
app.get("/getGroupFromDonor/:donorId", async (req, res) => {
  const group = await prisma.group.findFirst({
    where: {
      donors: {
        some: {
          donorId: Number(req.params.donorId),
        },
      },
    },
  });
  res.json(group);
});

/**
 * Delete Group by Group ID
 *
 * @param {string} groupId
 */
app.delete("/deleteGroup/:groupId", async (req, res) => {
  if (!req.params.groupId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  } else {
    const group = await prisma.group.delete({
      where: {
        groupId: Number(req.params.groupId),
      },
    });
    res.json(group);
  }
});

/**
 * API Declarations for Proposal
 *
 * 1. Create Proposal
 * 2. Get All Proposals
 * 3. Get Proposal by Proposal ID
 * 4. Get All Proposals by Group ID
 * 5. Get All Proposals by Beneficiary ID
 * 6. Update Proposal Votes
 * 7. Add Funders to Proposal
 * 8. Add Beneficiary to Proposal
 */

/**
 * Create Proposal
 *
 * A cron job will be used to create a proposal every 7 days, the end date will be 12 hours after the start date. Based on the previous proposal's start date, the next time a proposal is created is 7 days after this start date. \
 * Send a notification to all donors in the group that a new proposal has been created.
 */

//Check for existing proposal by group ID. If there is no proposal, create a new proposal. If there is a proposal, check if the proposal has ended. If the proposal has ended, create a new proposal. If the proposal has not ended, return an error. Check this every 7 days.
// cron.schedule('0 0 * * *', async () => {
//     const groups = await prisma.group.findMany()
//     groups.forEach(async (group) => {
//         const proposal = await prisma.proposal.findFirst({
//             where: {
//                 groupId: group.groupId
//             }
//         })
//         proposals.forEach(async (proposal) => {
//             if (proposal.endDate < new Date()) {
//                 const newProposal = await prisma.proposal.create({
//                     data: {
//                         beneficiaryId: proposal.beneficiaryId,
//                         groupId: group.groupId,
//                         startDate: new Date(),
//                         endDate: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
//                     }
//                 })
//             }
//         })
//     })
// })

/**
 * Get All Proposals
 */
app.get("/proposals", async (req, res) => {
  const proposals = await prisma.proposal.findMany();
  res.json(proposals);
});

/**
 * Get Proposal by Proposal ID
 *
 * @param {string} proposalId
 */
app.get("/getProposal/:proposalId", async (req, res) => {
  const proposal = await prisma.proposal.findFirst({
    where: {
      proposalId: Number(req.params.proposalId),
    },
  });
  res.json(proposal);
});

/**
 * Get All Proposals by Group ID
 *
 * @param {string} groupId
 */
app.get("/getProposalsFromGroup/:groupId", async (req, res) => {
  const proposals = await prisma.proposal.findMany({
    where: {
      groupId: Number(req.params.groupId),
    },
  });
  res.json(proposals);
});

/**
 * Get All Proposals by Beneficiary ID
 *
 * @param {string} beneficiaryId
 */
app.get("/getProposalsFromBeneficiary/:beneficiaryId", async (req, res) => {
  const proposals = await prisma.proposal.findMany({
    where: {
      beneficiaryId: Number(req.params.beneficiaryId),
    },
  });
  res.json(proposals);
});

/**
 * Update Proposal Votes
 *
 * @param {string} proposalId
 * @param {object} votes
 */
app.put("/updateProposalVotes/:proposalId", async (req, res) => {
  const { votes } = req.body.votes;
  if (!votes) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Trigger a donation sweep
  return await optimismContract.donate(Number(req.params.proposalId));
  //   return await ethContract.donate(Number(req.params.proposalId));
});

/**
 * Add Funders to Proposal
 *
 * @param {string} proposalId
 * @param {string} funderId
 */
app.put("/addFunderToProposal/:proposalId", async (req, res) => {
  const { funderId } = req.body;
  if (!funderId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  } else {
    const proposal = await prisma.proposal.update({
      where: {
        proposalId: Number(req.params.proposalId),
      },
      data: {
        funders: {
          connect: {
            funderId: funderId,
          },
        },
      },
    });
    res.json(proposal);
  }
});

/**
 * Add Beneficiary to Proposal
 *
 * @param {string} proposalId
 * @param {string} beneficiaryId
 */
app.put("/addBeneficiaryToProposal/:proposalId", async (req, res) => {
  const { beneficiaryId } = req.body;
  if (!beneficiaryId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  } else {
    const proposal = await prisma.proposal.update({
      where: {
        proposalId: Number(req.params.proposalId),
      },
      data: {
        beneficiaryId: beneficiaryId,
      },
    });
    res.json(proposal);
  }
});

/**
 * Delete Proposal by Proposal ID
 *
 * @param {string} proposalId
 */
app.delete("/deleteProposal/:proposalId", async (req, res) => {
  if (!req.params.proposalId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  } else {
    const proposal = await prisma.proposal.delete({
      where: {
        proposalId: Number(req.params.proposalId),
      },
    });
    res.json(proposal);
  }
});

/**
 * API Declarations for Funder
 * 
 * 1. Create F

/**
 * Add Funders to Proposal
 * 
 * @param {string} proposalId
 * @param {string} donorId
 * @param {number} amount
 */
app.put("/addFundersToProposal/:proposalId", async (req, res) => {
  const { donorId, amount } = req.body;
  if (!donorId || !amount) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  } else {
    //create new data in the funders table
    const funder = await prisma.funders.create({
      data: {
        donorId: donorId,
        funderAmount: amount,
      },
    });
    //connect the new data to the proposal
    const proposal = await prisma.proposal.update({
      where: {
        proposalId: Number(req.params.proposalId),
      },
      data: {
        funders: {
          connect: {
            funderId: funder.funderId,
          },
        },
      },
    });
    res.json(proposal);
  }
});

/**
 * Get All Proposals
 */

/**
 * API Declarations for Funders
 *
 * 1. Create Funder
 * 2. Get All Funders by Proposal ID
 * 3.
 */

/**
 * API Declarations for Beneficiary
 *
 * 1. Create Beneficiary
 * 2. Send Notification
 */

const optimismProvider = new ethers.providers.AlchemyProvider(
  {
    name: "optimismGoerli",
    chainId: 420,
  },
  process.env.ALCHEMY_KEY
);
const ethProvider = new ethers.providers.AlchemyProvider(
  "goerli",
  process.env.ALCHEMY_KEY
);
const optimismSigner = new ethers.Wallet(
  process.env.PRIVATE_KEY || "",
  optimismProvider
);
const ethSigner = new ethers.Wallet(process.env.PRIVATE_KEY || "", ethProvider);

const optimismContract = new ethers.Contract(
  "0x18874B584adC9fDc00649512AE60eC5074467AE3",
  GiveFire.abi,
  optimismSigner
);

const ethContract = new ethers.Contract(
  "0x60410A463CaBE01d37B92C1083d377Fe979681e4",
  GiveFire.abi,
  ethSigner
);

/**
 * Send notification to benefactor
 *
 * @param {string} beneficiaryId
 * @param {string} notificationTitle
 * @param {string} notificationBody
 * @param {string} payloadTitle
 * @param {string} payloadBody
 * @param {int} notificationType
 *
 */
app.get("/sendNotification/:beneficiaryId", async (req, res) => {
  // const { notificationTitle, notificationBody, payloadTitle, payloadBody, notificationType } = req.body
  // if (!notificationTitle || !notificationBody || !payloadTitle || !payloadBody || !notificationType) {
  //     res.status(400).json({ error: 'Missing required fields' })
  //     return
  // } else {
  //     const beneficiary = await prisma.beneficiary.findUnique({
  //         where: {
  //             beneficiaryId: req.params.beneficiaryId
  //         },
  //         //From chosen beneficiary, get the donations made to the beneficiary and the proposal id to eventually get the funders's address
  //         include: {
  //             donations: {
  //                 include: {
  //                     Proposal: {
  //                         include: {
  //                             funders: true
  //     })
  //     //get the list of donors
  //     const donorList = beneficiary.proposals[0].funders.map(funder => funder.donor)

  // //From the beneficiaryId, get the donators field details. Then, in the donators field, get the proposalId, then from the proposalId, get the funders field details. Then, in the funders field, get all the donorId, then from the donorId, get the donorAddress field details. If there are no funders, then return an error. If there is only one funder, notification type is 3. If there are more than one funders, notification type is 4.
  const apiResponse = await PushAPI.payloads.sendNotification({
    signer,
    type: 3, // subset
    identityType: 2, // direct payload
    notification: {
      title: `[SDK-TEST] notification TITLE:`,
      body: `[sdk-test] notifica  tion BODY`,
    },
    payload: {
      title: `[sdk-test] payload title`,
      body: `sample msg body`,
      cta: "",
      img: "",
    },
    recipients: "eip155:5:0x66263b35bae43592b4A46F4Fca4D8613987610d4", // recipients addresses
    channel: "eip155:5:0x07e96f02d57A1F0EACe103028D0b26fd2D5f283E", // your channel address
    env: "staging",
  });
});

// //From the beneficiaryId, get the donators field details. Then, in the donators field, get the proposalId, then from the proposalId, get the funders field details. Then, in the funders field, get all the donorId, then from the donorId, get the donorAddress field details. If there are no funders, then return an error. If there is only one funder, notification type is 3. If there are more than one funders, notification type is 4.
// const apiResponse = await PushAPI.payloads.sendNotification({
//     signer,
//     type: 3, // subset
//     identityType: 2, // direct payload
//     notification: {
//     title: `[SDK-TEST] notification TITLE:`,
//     body: `[sdk-test] notifica  tion BODY`
//     },
//     payload: {
//     title: `[sdk-test] payload title`,
//     body: `sample msg body`,
//     cta: '',
//     img: ''
//     },
//     recipients: 'eip155:5:0x66263b35bae43592b4A46F4Fca4D8613987610d4', // recipients addresses
//     channel: 'eip155:5:0x07e96f02d57A1F0EACe103028D0b26fd2D5f283E', // your channel address
//     env: 'staging'
// });

const server = app.listen(process.env.BACKEND_PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${process.env.BACKEND_PORT}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
