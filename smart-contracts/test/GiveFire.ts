import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("GiveFire", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const [userA, userB] = await ethers.getSigners();

    const TestDAI = await ethers.getContractFactory("TestDAI");
    const testDAI = await TestDAI.deploy();

    await testDAI.deployed();

    const GiveFire = await ethers.getContractFactory("GiveFire");
    const giveFire = await GiveFire.deploy(testDAI.address);

    return { giveFire, userA, userB };
  }

  describe("Groups", function () {
    it("Should create a group and show the address is a member of the group", async function () {
      const { giveFire, userA, userB } = await loadFixture(deployFixture);

      const tx = await giveFire.createGroup();
      const receipt = await tx.wait();
      const groupCreatedEvent = receipt.events?.filter(
        (event) => event.event === "GroupCreated"
      )[0];

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
  });
});
