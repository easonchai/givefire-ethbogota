import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractReceipt } from "ethers";

describe("GiveFire", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  function getEvent(receipt: ContractReceipt, eventName: string) {
    const filteredEvent = receipt.events?.filter(
      (event) => event.event === eventName
    )[0];

    return filteredEvent;
  }

  async function deployFixture() {
    const [userA, userB] = await ethers.getSigners();

    const USDC = await ethers.getContractFactory("USDC");
    const usdc = await USDC.deploy();

    await usdc.deployed();

    const GiveFire = await ethers.getContractFactory("GiveFire");
    const giveFire = await GiveFire.deploy(usdc.address);

    return { giveFire, userA, userB };
  }

  async function groupFixture() {
    const signers = await ethers.getSigners();
    const [userA, userB, userC, userD, userE, benefactor, notBenefactor] =
      signers;
    const addresses = await signers.map((signer) => signer.address);

    const USDC = await ethers.getContractFactory("USDC");
    const usdc = await USDC.deploy();

    await usdc.deployed();

    const GiveFire = await ethers.getContractFactory("GiveFire");
    const giveFire = await GiveFire.deploy(usdc.address);

    // Create a group
    const tx = await giveFire.createGroup();
    const receipt = await tx.wait();
    const groupCreatedEvent = getEvent(receipt, "GroupCreated");

    const groupId = groupCreatedEvent?.args ? groupCreatedEvent?.args[0] : null;

    // Send the funds to other people & also add them to group
    // Start from 1 because first address is ownself
    for (let i = 1; i < 5; i++) {
      await usdc.transfer(addresses[i], ethers.utils.parseEther("50.0")); // Transferring $50 DAI
      await giveFire.addToGroup(groupId, addresses[i]);
    }

    // Need to add a benefactor first
    await giveFire.addTrustedBenefactor(benefactor.address);

    return {
      giveFire,
      usdc,
      userA,
      userB,
      userC,
      userD,
      userE,
      groupId,
      benefactor,
      notBenefactor,
    };
  }

  describe("Groups", function () {
    it("Should create a group and show the address is a member of the group", async function () {
      const { giveFire, userA, userB } = await loadFixture(deployFixture);

      const tx = await giveFire.createGroup();
      const receipt = await tx.wait();
      const groupCreatedEvent = getEvent(receipt, "GroupCreated");

      const groupId = groupCreatedEvent?.args
        ? groupCreatedEvent?.args[0]
        : null;
      expect(groupId).to.exist;

      expect(await giveFire.isGroupMember(groupId, userA.address)).to.equal(
        true
      );
      expect(await giveFire.isGroupMember(groupId, userB.address)).to.equal(
        false
      );
    });

    it("Should allow adding members to group", async function () {
      const { giveFire } = await loadFixture(deployFixture);

      const signers = await ethers.getSigners();
      const addresses = await signers.map((signer) => signer.address);

      const tx = await giveFire.createGroup();
      const receipt = await tx.wait();
      const groupCreatedEvent = getEvent(receipt, "GroupCreated");

      const groupId = groupCreatedEvent?.args
        ? groupCreatedEvent?.args[0]
        : null;
      expect(groupId).to.exist;

      // Send the funds to other people & also add them to group
      // Start from 1 because first address is ownself
      for (let i = 1; i < 5; i++) {
        await giveFire.addToGroup(groupId, addresses[i]);
      }
    });

    it("Should fail adding more than 5 members to group", async function () {
      const { giveFire } = await loadFixture(deployFixture);

      const signers = await ethers.getSigners();
      const addresses = await signers.map((signer) => signer.address);

      const tx = await giveFire.createGroup();
      const receipt = await tx.wait();
      const groupCreatedEvent = getEvent(receipt, "GroupCreated");

      const groupId = groupCreatedEvent?.args
        ? groupCreatedEvent?.args[0]
        : null;
      expect(groupId).to.exist;

      // Send the funds to other people & also add them to group
      // Start from 1 because first address is ownself
      for (let i = 1; i < 5; i++) {
        await giveFire.addToGroup(groupId, addresses[i]);
      }

      await expect(
        giveFire.addToGroup(groupId, addresses[5])
      ).to.be.revertedWith("Group is full");
    });
  });

  describe("Proposals", function () {
    it("Should create a proposal", async function () {
      const { giveFire, groupId, userA, userB, benefactor } = await loadFixture(
        groupFixture
      );

      await giveFire.createProposal(benefactor.address, groupId);
    });

    it("Should fail to create a proposal for an address that is not a benefactor", async function () {
      const { giveFire, groupId, userA, userB, notBenefactor } =
        await loadFixture(groupFixture);

      await expect(
        giveFire.createProposal(notBenefactor.address, groupId)
      ).to.be.revertedWith("Not a trusted benefactor");
    });

    it("Should pass a proposal (donate)", async function () {
      const {
        giveFire,
        groupId,
        userA,
        userB,
        userC,
        userD,
        userE,
        benefactor,
        usdc,
      } = await loadFixture(groupFixture);

      const tx = await giveFire.createProposal(benefactor.address, groupId);
      const receipt = await tx.wait();
      const proposalCreated = getEvent(receipt, "ProposalCreated");

      if (proposalCreated && proposalCreated.args) {
        const [proposalId, groupId, proposer, benefactor] =
          proposalCreated.args;

        await usdc
          .connect(userA)
          .approve(giveFire.address, ethers.utils.parseEther("10.0"));
        await usdc
          .connect(userB)
          .approve(giveFire.address, ethers.utils.parseEther("10.0"));
        await usdc
          .connect(userC)
          .approve(giveFire.address, ethers.utils.parseEther("2.0"));
        await usdc
          .connect(userD)
          .approve(giveFire.address, ethers.utils.parseEther("10.0"));
        await usdc
          .connect(userE)
          .approve(giveFire.address, ethers.utils.parseEther("10.0"));
        await giveFire.donate(proposalId);

        expect(await usdc.balanceOf(benefactor)).to.be.equal(
          ethers.utils.parseEther("42.0")
        );
      }
      expect(proposalCreated).to.exist;
      expect(proposalCreated?.args).to.exist;
    });
  });
});
