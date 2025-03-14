const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SigmaTwo Test", function () {
 
  it("Deployment:", async function () {
    const [owner,a1,a2,a3,a4] = await ethers.getSigners();
    const Sigma = await ethers.getContractFactory("SigmaV3");
    const sigma = await Sigma.deploy();

  });

});
