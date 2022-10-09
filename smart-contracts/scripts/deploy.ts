import { ContractReceipt } from "ethers";
import { ethers, network } from "hardhat";

function getEvent(receipt: ContractReceipt, eventName: string) {
  const filteredEvent = receipt.events?.filter(
    (event) => event.event === eventName
  )[0];

  return filteredEvent;
}

async function main() {
  /**
   * There are a few things we would like to do.
   * Firstly, we should setup a beneficiary.
   * Then, we should setup a group.
   * After that, we create a proposal.
   * Finally, we vote and execute it! (leaving this for the backend!)
   */

  const signers = await ethers.getSigners();

  const wallets = [];
  const num = 5;
  for (let i = 0; i < num; i++) {
    const wallet = ethers.Wallet.fromMnemonic(
      process.env.MNEMONIC || "",
      `m/44'/60'/0'/0/${i}`
    );
    wallets.push(wallet.connect(ethers.provider));
  }

  const USDC = await ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy();

  console.log(`Signers...`);
  console.log("Owner: ", signers[0].address);
  wallets.forEach((signer, index) => {
    if (index > 5) {
      return;
    }
    console.log(signer.address, signer._isSigner);
  });
  console.log("\n\n");

  await usdc.deployed();

  console.log(`💰 USDC Deployed:  ${usdc.address}`);

  const GiveFire = await ethers.getContractFactory("GiveFire");
  const giveFire = await GiveFire.deploy(usdc.address);

  await giveFire.deployed();

  console.log(`🔥 GiveFire Deployed:  ${giveFire.address}`);

  // Need to add a benefactor first
  await giveFire.addTrustedBenefactor(wallets[0].address);

  console.log(`🔐 Trusted Benefactor Added: ${wallets[0].address}`);

  // Create a group
  const tx = await giveFire.createGroup();
  const receipt = await tx.wait();
  const groupCreatedEvent = getEvent(receipt, "GroupCreated");

  const groupId = groupCreatedEvent?.args ? groupCreatedEvent?.args[0] : null;

  // Send the funds to other people & also add them to group
  // Start from 1 because first address is benefactor
  for (let i = 1; i < 5; i++) {
    await usdc.transfer(wallets[i].address, ethers.utils.parseEther("100.0")); // Transferring $50 USDC
    await giveFire.addToGroup(groupId, wallets[i].address);
  }

  console.log(`🎁 Test USDC transferred & group created: Group ID #${groupId}`);

  // Once a group is added, we can create a proposal
  const proposalTx = await giveFire.createProposal(wallets[0].address, groupId);
  const proposalReceipt = await proposalTx.wait();
  const proposalCreated = getEvent(proposalReceipt, "ProposalCreated");

  if (proposalCreated && proposalCreated.args) {
    const [proposalId, groupId, proposer, benefactor] = proposalCreated.args;

    // We need to seed these accounts with gas first
    for (let i = 1; i < 5; i++) {
      const tx = {
        to: wallets[i].address,
        value: ethers.utils.parseEther("0.005"),
      };
      const sendGas = await signers[0].sendTransaction(tx);
      await sendGas.wait();
      await usdc
        .connect(wallets[i])
        .approve(giveFire.address, ethers.utils.parseEther("10.0"));
    }

    console.log(
      `📄 Proposal & approvals completed: `,
      JSON.stringify(
        {
          proposalId,
          groupId,
          proposer,
          benefactor,
        },
        null,
        2
      )
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
