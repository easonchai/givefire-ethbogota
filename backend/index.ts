import { PrismaClient } from './node_modules/.prisma/client/index';
import express from 'express';
const { cron } = require('node-cron');

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

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
app.post('/createDonor', async (req, res) => {
    const { nickname, walletAddress, groupId } = req.body
    if (!nickname || !walletAddress) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
    const donor = await prisma.donor.create({
        data: {
            donorNickname: nickname,
            donorWalletAddress:walletAddress,
            donorGroupId: groupId
        }
    })
    res.json(donor)
    }
})


/**
 * Get Donor by Wallet Address
 * 
 * @param {string} walletAddress
 */
app.get('/getDonor/:walletAddress', async (req, res) => {
    //if there is no walletAddress in the request, return error
    if (!req.params.walletAddress) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const donor = await prisma.donor.findUnique({
            where: {
                donorWalletAddress: req.params.walletAddress
            }
        })
        res.json(donor)
    }
})

/**
 * Get All Donors
 */
app.get('/donors', async (req, res) => {
    const donors = await prisma.donor.findMany()
    res.json(donors)
})

/**
 * Get All Donors by Group
 * 
 * @param {string} groupId
 */
app.get('/donors/:groupId', async (req, res) => {
    const donors = await prisma.donor.findMany({
        where: {
            donorGroupId: req.params.groupId
        }
    })
    res.json(donors)
})

/**
 * Update Donor by Wallet Address
 * 
 * @param {string} walletAddress
 * @param {string} newData
 */
app.put('/updateDonor/:walletAddress', async (req, res) => {
    const { newData } = req.body
    if (!req.params.walletAddress || !newData) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const donor = await prisma.donor.update({
            where: {
                donorWalletAddress: req.params.walletAddress
            },
            data: {
                donorNickname: newData.nickname,
                donorWalletAddress: newData.walletAddress,
                donorGroupId: newData.groupId
            }
        })
        res.json(donor)
    }
})

/**
 * Delete Donor by Wallet Address
 * 
 * @param {string} walletAddress
 */
app.delete('/deleteDonor/:walletAddress', async (req, res) => {
    if (!req.params.walletAddress) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const donor = await prisma.donor.delete({
            where: {
                donorWalletAddress: req.params.walletAddress
            }
        })
        res.json(donor)
    }
})

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
app.post('/createGroup', async (req, res) => {
    const { donorId, groupName } = req.body
    if (!donorId) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const group = await prisma.group.create({
            data: {
                donors: donorId,
                groupName: groupName
            }
        })
        res.json(group)
        }
    })

/**
 * Get Group by Group ID
 * 
 * @param {string} groupId
 */
 app.get('/groups/:groupId', async (req, res) => {
    const group = await prisma.group.findUnique({
        where: {
            groupId: req.params.groupId
        }
    })
    res.json(group)
})


/**
 * Get All Groups
 */
 app.get('/groups', async (req, res) => {
    const groups = await prisma.group.findMany()
    res.json(groups)
})

/**
 * Add Donor to Group
 * 
 * @param {string} donorId
 * @param {string} groupId
 */
app.put('/addDonorToGroup/:groupId', async (req, res) => {
    const { donorId } = req.body
    if (!donorId) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else if (await prisma.group.count({
        where: {
            groupId: req.params.groupId
        }
    }) == 5) {
        res.status(400).json({ error: 'Group is full' })
        return
    } else {
        const group = await prisma.group.update({   
            where: {
                groupId: req.params.groupId
            },
            data: {
                donors: {
                    connect: {
                        donorId: donorId
                    }
                }
            }
        })
        res.json(group)
    }
})

/**
 * Remove Donor from Group
 * 
 * @param {string} donorId
 * @param {string} groupId
 */
app.put('/removeDonorFromGroup/:groupId', async (req, res) => {
    const { donorId } = req.body
    if (!donorId) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const group = await prisma.group.update({
            where: {
                groupId: req.params.groupId
            },
            data: {
                donors: {
                    disconnect: {
                        donorId: donorId
                    }
                }
            }
        })
        res.json(group)
    }
})

/**
 * Add Proposal to Group
 * 
 * @param {string} proposalId
 * @param {string} groupId
 */
app.put('/addProposalToGroup/:groupId', async (req, res) => {
    const { proposalId } = req.body
    if (!proposalId) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const group = await prisma.group.update({
            where: {
                groupId: req.params.groupId
            },
            data: {
                proposals: {
                    connect: {
                        proposalId: proposalId
                    }
                }
            }
        })
        res.json(group)
    }
})

/**
 * Remove Proposal from Group
 *  
 * @param {string} proposalId
 * @param {string} groupId
 */
app.put('/removeProposalFromGroup/:groupId', async (req, res) => {
    const { proposalId } = req.body
    if (!proposalId) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const group = await prisma.group.update({
            where: {
                groupId: req.params.groupId
            },
            data: {
                proposals: {
                    disconnect: {
                        proposalId: proposalId
                    }
                }
            }
        })
        res.json(group)
    }
})

/** 
 * Get One Group from One Donor ID
 * 
 * @param {string} donorId
 */
app.get('/getGroupFromDonor/:donorId', async (req, res) => {
    const group = await prisma.group.findFirst({
        where: {
            donors: {
                some: {
                    donorId: req.params.donorId
                }
            }
        }
    })
    res.json(group)
})

/**
 * Delete Group by Group ID
 * 
 * @param {string} groupId
 */
app.delete('/deleteGroup/:groupId', async (req, res) => {
    if (!req.params.groupId) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const group = await prisma.group.delete({
            where: {
                groupId: req.params.groupId
            }
        })
        res.json(group)
    }
})

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
 * Cron Job every 7 days to check in every group and see if there is any active proposals by comapring the current date to the proposal's end date. If no longer active, then a new proposal will be created.
 */
cron.schedule('0 0 * * *', async () => {
    const groups = await prisma.group.findMany()
    groups.forEach(async (group) => {
        const proposals = await prisma.proposal.findMany({
            where: {
                groupId: group.groupId
            }
        })
        proposals.forEach(async (proposal) => {
            if (proposal.endDate < new Date()) {
                const newProposal = await prisma.proposal.create({
                    data: {
                        beneficiaryId: proposal.beneficiaryId,
                        groupId: group.groupId,
                        startDate: new Date(),
                        endDate: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
                    }
                })
            }
        })
    })
})

/**
 * Get All Proposals
 */
app.get('/proposals', async (req, res) => {
    const proposals = await prisma.proposal.findMany()
    res.json(proposals)
})

/**
 * Get Proposal by Proposal ID
 * 
 * @param {string} proposalId
 */
app.get('/getProposal/:proposalId', async (req, res) => {
    const proposal = await prisma.proposal.findFirst({
        where: {
            proposalId: req.params.proposalId
        }
    })
    res.json(proposal)
})

/**
 * Get All Proposals by Group ID
 * 
 * @param {string} groupId
 */
app.get('/getProposalsFromGroup/:groupId', async (req, res) => {
    const proposals = await prisma.proposal.findMany({
        where: {
            groupId: req.params.groupId
        }
    })
    res.json(proposals)
})

/**
 * Get All Proposals by Beneficiary ID
 * 
 * @param {string} beneficiaryId
 */
app.get('/getProposalsFromBeneficiary/:beneficiaryId', async (req, res) => {
    const proposals = await prisma.proposal.findMany({
        where: {
            beneficiaryId: req.params.beneficiaryId
        }
    })
    res.json(proposals)
})

/**
 * Update Proposal Votes
 * 
 * @param {string} proposalId
 * @param {object} votes
 */
app.put('/updateProposalVotes/:proposalId', async (req, res) => {
    const { votes } = req.body.votes
    if (!votes) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else if //if current votes is 5, error
    
    }
})

/**
 * Add Funders to Proposal
 * 
 * @param {string} proposalId
 * @param {string} donorId
 * @param {number} amount
 */
app.put('/addFundersToProposal/:proposalId', async (req, res) => {
    const { donorId, amount } = req.body
    if (!donorId || !amount) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        //create new data in the funders table
        const funder = await prisma.funders.create({
            data: {
                donorId: donorId,
                funderAmount: amount
            }
        })
        //connect the new data to the proposal
        const proposal = await prisma.proposal.update({
            where: {
                proposalId: req.params.proposalId
            },
            data: {
                funders: {
                    connect: {
                        funderId: funder.funderId
                    }
                }
            }
        })
        res.json(proposal)
    }
})





/**
 * Get All Proposals
 */

/** 
 * API Declarations for Funders
 * 
 * 1. Create Funder
 * 2. Get All Funders by Proposal ID
 * 3. Get Funder by Funder ID
 * 4. Update Funder Amount
*/
app.post('/createFunder', async (req, res) => {
    const { funderAmount, proposalId, donorId } = req.body
    if (!funderAmount || !proposalId || !donorId) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const funder = await prisma.funders.create({
            data: {
                funderAmount: funderAmount,
                proposalId: proposalId,
                donorId: donorId
            }
        })
        res.json(funder)
    }
})


/**
 * Get All Funders by Proposal ID
 * 
 * @param {string} proposalId
 */
app.get('/getFundersFromProposal/:proposalId', async (req, res) => {
    const funders = await prisma.funders.findMany({
        where: {
            proposalId: req.params.proposalId
        }
    })
    res.json(funders)
})

/**
 * Get Funder by Funder ID
 * 
 * @param {string} funderId
 */
app.get('/getFunder/:funderId', async (req, res) => {
    const funder = await prisma.funders.findFirst({
        where: {
            funderId: req.params.funderId
        }
    })
    res.json(funder)
})

/**
 * Update Funder Amount
 * 
 * @param {string} funderId
 * @param {string} funderAmounts
 */
app.put('/updateFunderAmount/:funderId', async (req, res) => {
    const { funderAmount } = req.body
    if (!funderAmount) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const funder = await prisma.funders.update({
            where: {
                funderId: req.params.funderId
            },
            data: {
                funderAmount: funderAmount
            }
        })
        res.json(funder)
    }
})




/**
 * API Declarations for Beneficiaries
 * 
 * 1. Create Beneficiary
 * 2. Update Beneficiary Details
 * 3. Set donators to Beneficiary   
 * 4. Set Proposal
 */
app.post('/createBeneficiary', async (req, res) => {
    const { fundingTarget, fundingReceived, startDate, endDate } = req.body 
    if (!fundingTarget || !fundingReceived || !startDate || !endDate) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const beneficiary = await prisma.beneficiary.create({
            data: {
                fundingTarget: fundingTarget,
                fundingReceived: fundingReceived,
                startDate: startDate,
                endDate: endDate
            }
        })
        res.json(beneficiary)
    }
})

/** Set Donators to Beneficiary
 * 
 * @param {string} beneficiaryId
 * @param {string} donationId
*/
app.put('/setDonatorsToBeneficiary/:beneficiaryId', async (req, res) => {
    //Create new data in the donators table
    const donator = await prisma.donations.create({
        data: {
            //get current timestamp
            donationTimestamp: new Date().toISOString(),
            donationAmount: req.body.donationAmount,
            proposalId: req.body.proposalId,            
        }
    })
    //Connect the new data to the beneficiary
    const beneficiary = await prisma.beneficiary.update({
        where: {
            beneficiaryId: req.params.beneficiaryId
        },
        data: {
            donations: {
                connect: {
                    donationId: donator.donationId
                }
            }
        }
    })
    res.json(beneficiary)
})



/**
 * API Declarations for Donations
 * 
 * 1. Create Donation
 */
app.post('/createDonation', async (req, res) => {
    const { beneficiaryId, proposalId, donationTimestamp, donationAmount } = req.body
    if (!beneficiaryId || !proposalId || !donationTimestamp || !donationAmount) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    } else {
        const donation = await prisma.donations.create({
            data: {
                beneficiaryId: beneficiaryId,
                proposalId: proposalId,
                donationTimestamp: donationTimestamp,
                donationAmount: donationAmount
            }
        })
        res.json(donation)
    }
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})
