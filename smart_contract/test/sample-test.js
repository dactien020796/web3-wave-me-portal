const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WavePortal", function () {
  const initialBalance = "0.1";
  const rewardAmount = "0.01";
  let wavePortal;
  beforeEach(async () => {
    const WavePortal = await ethers.getContractFactory("WavePortal");
    wavePortal = await WavePortal.deploy({ value: ethers.utils.parseEther(initialBalance) });
    await wavePortal.deployed();
  });

  it("Should return correct balance after deploy", async function () {
    expect(await wavePortal.getContractBalance()).to.equal(ethers.utils.parseEther(initialBalance));
  });

  it("Should wave successfully", async function () {
    console.log(ethers.utils.parseEther(initialBalance));
    await wavePortal.wave("Hello world");
    expect(await wavePortal.getTotalWaves()).to.equal(1);
    expect(await wavePortal.getContractBalance()).to.equal((
      ethers.utils.parseEther(initialBalance) - ethers.utils.parseEther(rewardAmount)
    ).toString());
  });

  it("Should wave unsuccessfully if there is no money left in contract", async function () {
    for (let index = 0; index < 10; index++) {
      await wavePortal.wave("Hello world");
    }

    expect(await wavePortal.getTotalWaves()).to.equal(10);
    expect(await wavePortal.getContractBalance()).to.equal(0);
    expect(wavePortal.wave("abc")).to.be.revertedWith("Trying to withdraw more money than the contract has.")
  });

  it("Should get all waves", async function () {
    for (let index = 0; index < 10; index++) {
      await wavePortal.wave("Hello world");
    }
    let waves = await wavePortal.getAllWaves();
    expect(waves.length).to.equal(10);
  });
});
