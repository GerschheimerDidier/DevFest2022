const Crowdfunding = artifacts.require("Crdfunding");


contract('Crdfunding', (accounts) => {

  const deployer = accounts[0]; // By default, account used is 0 so the contract has been deployed by 0 since we didnt specify a sender in deploy_crowdFunding.js
  const owner = accounts[1];    // Defined on deployment at .\..\migrations\2_deploy_crowdFunding.js
  const funder = accounts[3];

  it('should read initial description', async() => {
    const crowdfundingInstance = await Crowdfunding.deployed();

    var value = (await crowdfundingInstance.getDescription.call());
    assert.strictEqual(value, "NOOOO", "NOOOO wasn't the initial descritpion value");
  });

  it('should read updated description', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();

    await crowdfundingInstance.setDescription("YESSSSS", {from: owner});
    var value = (await crowdfundingInstance.getDescription.call());
    assert.strictEqual(value, "YESSSSS", "YESSSSS isn't the descritpion, not updated");

  });

  it('should read the initial deployement goal', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();

    var value = (await crowdfundingInstance.getGoal.call());
    assert.equal(value, 10, "goal not at 10 Wei, contract not correctly initialized");
  });

  it('should read the updated goal', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();

    await crowdfundingInstance.setGoal(1000, {from: owner});
    var value = (await crowdfundingInstance.getGoal.call());
    assert.equal(value, 1000, "goal not at 1000 Wei, goal not updated");

  });

  it('should read the initial deployement endDate', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    var value = (await crowdfundingInstance.getEndDate.call());
    assert.equal(value, 1665570954, "endDate not at 1665570954, endDate not initialized");

  });

  it('should read the updated endDate', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();

    const secondsSinceEpochPlusHour = Math.round(Date.now() / 1000 + 3600)
    
    await crowdfundingInstance.setEndDate(secondsSinceEpochPlusHour, {from: owner});
    var value = (await crowdfundingInstance.getEndDate.call());
    assert.equal(value, secondsSinceEpochPlusHour, "endDate not at 1665591954, endDate not updated");

  });

  it('should read the initial Total', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    var value = (await crowdfundingInstance.getTotal.call());
    assert.equal(value, 0, "Total not at 0, Total not initialized at 0");

  });

  it('should read the initial Donation from deployer (account[0])', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    var value = (await crowdfundingInstance.getMyParticipation.call());
    assert.equal(value.total, 0, "accounts[0] participation not initialized at 0");

  });

  it('should read the initial Active Ranks', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 0, "ActiveRanks not initialized as empty");

  });

  it('should create a new active rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    await crowdfundingInstance.createRank(
      'testRankActive',
      true,
      100,
      "_description",
      {from: owner}
    );
    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 1, "ActiveRanks not updated with one active Rank");
    assert.strictEqual(value[0], "testRankActive", "Active Rank added is not the provided 'testRankActive'");
    
    var rankInfo = (await crowdfundingInstance.getRankInfo("testRankActive"));
    assert.equal(rankInfo.minimumInvestment, 100, "testRankActive minimumInvestment is not 100");
    assert.strictEqual(rankInfo.description, "_description", "testRankActive description expected '_description' is '" + rankInfo.description + "'");
    assert.ok(rankInfo.active, "testRankActive active status expected true, is false");

  });

  it('should create a new unactive rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    await crowdfundingInstance.createRank(
      "testRankUnactive",
      false,
      100,
      "_description",
      {from: owner}
    );

    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 1, "ActiveRanks should contain 1 Rank : testRankActive from previous test");
    assert.strictEqual(value[0], "testRankActive", "Active Rank is not 'testRankActive' from previous test");

    var rankInfo = (await crowdfundingInstance.getRankInfo("testRankUnactive"));
    assert.equal(rankInfo.minimumInvestment, 100, "testRankUnactive minimumInvestment is not 100")
    assert.strictEqual(rankInfo.description, "_description", "testRankUnactive description expected '_description' is '" + rankInfo.description + "'")
    assert.ok(!rankInfo.active, "testRankUnactive active status expected false, is true")

  });

  it('should deactivate a created active rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    await crowdfundingInstance.createRank(
      "testRankToDeactivate",
      true,
      100,
      "_description",
      {from: owner}
    );

    await crowdfundingInstance.deactivateRank("testRankToDeactivate", {from: owner})

    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 1, "ActiveRanks should contain 1 Rank : testRankActive from previous test");
    assert.strictEqual(value[0], "testRankActive", "Active Rank is not 'testRankActive' from previous test");
    
    var rankInfo = (await crowdfundingInstance.getRankInfo("testRankToDeactivate"));
    assert.equal(rankInfo.minimumInvestment, 100, "testRankToDeactivate minimumInvestment is not 100")
    assert.strictEqual(rankInfo.description, "_description", "testRankToDeactivate description expected '_description' is '" + rankInfo.description + "'")
    assert.ok(!rankInfo.active, "testRankToDeactivate active status expected false, is true")

  });

  it('should activate a created unactive rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    await crowdfundingInstance.createRank(
      "testRankToActivate",
      false,
      100,
      "_description",
      {from: owner}
    );

    await crowdfundingInstance.activateRank("testRankToActivate", {from: owner});

    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 2, "ActiveRanks should contain 2 Ranks (one from previous test)");
    assert.strictEqual(value[1], "testRankToActivate", "Active Rank is not 'testRankToActivate' from previous test");
    
    var rankInfo = (await crowdfundingInstance.getRankInfo("testRankToActivate"));
    assert.equal(rankInfo.minimumInvestment, 100, "testRankToActivate minimumInvestment is not 100");
    assert.strictEqual(rankInfo.description, "_description", "testRankToActivate description expected '_description' is '" + rankInfo.description + "'");
    assert.ok(rankInfo.active, "testRankToActivate active status expected false, is true");

  });

  it('should edit a created rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    await crowdfundingInstance.createRank(
      "testRankToEdit",
      false,
      100,
      "_description",
      {from: owner}
    );

    await crowdfundingInstance.editRank(
      "testRankToEdit",
      500,
      "_description_edited",
      {from: owner}
    );

    var rankInfo = (await crowdfundingInstance.getRankInfo("testRankToEdit"));
    assert.equal(rankInfo.minimumInvestment, 500, "testRankToEdit minimumInvestment is not 100");
    assert.strictEqual(rankInfo.description, "_description_edited", "testRankToEdit description expected '_description' is '" + rankInfo.description + "'");
    assert.ok(!rankInfo.active, "testRankToEdit active status expected false, is true");

  });


  

  it('should send a donation from owner', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    await crowdfundingInstance.sendDonation("_noRank", false, {from: owner, value: 100})

    var value = (await crowdfundingInstance.getMyParticipation.call({from: owner}));
    assert.equal(value.total, 100, "owner participation not updated to 100");

    var fundingTotal = (await crowdfundingInstance.getTotal.call({from: owner}));
    assert.equal(fundingTotal, 100, "crowdfunding total not updated to 100");

    var contractBalance = (await web3.eth.getBalance(crowdfundingInstance.address));
    assert.equal(contractBalance, 100, "crowdfunding contract balance not updated to 100");

  });

  it('should send a donation from funder', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    await crowdfundingInstance.sendDonation("_noRank", false, {from: funder, value: 100000000});

    var value = (await crowdfundingInstance.getMyParticipation.call({from: funder}));
    assert.equal(value.total, 100000000, "funder participation not updated to 100");

    var fundingTotal = (await crowdfundingInstance.getTotal.call({from: funder}));
    console.log("funnding total", fundingTotal);
    assert.equal(fundingTotal, 100000100, "crowdfunding total not updated to 200");

    var contractBalance = (await web3.eth.getBalance(crowdfundingInstance.address));
    assert.equal(contractBalance, 100000100, "crowdfunding contract balance not updated to 200");

  });

  it('should refuse funding retrival => funding not ended and goal not achieved', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    try {
      await crowdfundingInstance.retrieveFunding.call({from : owner});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

  });

  it('should refuse funding retrival => funding not ended', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    await crowdfundingInstance.setGoal(100, {from : owner});
    
    try {
      await crowdfundingInstance.retrieveFunding.call({from : owner});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert Funding not ended", "The error message should contain 'revert Funding not ended'");
    }

  });

  it('should refuse funding retrival => goal not achieved', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();

    await crowdfundingInstance.setGoal(10000000000, {from : owner});

    const secondsSinceEpochMinusHour = Math.round(Date.now() / 1000 - 3600)
    await crowdfundingInstance.setEndDate(secondsSinceEpochMinusHour, {from: owner});
    
    try {
      await crowdfundingInstance.retrieveFunding.call({from : owner});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert Goal not achieved", "The error message should contain 'revert Goal not achieved'");
    }

  });



  it('should have owner retrieve crowdfunding funds', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();

    const secondsSinceEpochPlusHour = Math.round(Date.now() / 1000 + 3600)
    await crowdfundingInstance.setEndDate(secondsSinceEpochPlusHour, {from: owner});

    (await crowdfundingInstance.sendDonation("_noRank", false, {from: funder, value: web3.utils.toWei('10', 'ether')}));

    await crowdfundingInstance.setGoal(100, {from : owner});

    const secondsSinceEpochMinusHour = Math.round(Date.now() / 1000 - 3600)
    await crowdfundingInstance.setEndDate(secondsSinceEpochMinusHour, {from: owner});

    const ownerBalanceBeforeRetrieve = Number(await web3.eth.getBalance(owner));

    const totalFunded = Number(await crowdfundingInstance.getTotal.call({from : owner}));

    const estimatedGasCost = Number(await crowdfundingInstance.retrieveFunding.estimateGas({from : owner}));
    const totalGain = totalFunded - estimatedGasCost;
    const expectedNewOwnerBalance = ownerBalanceBeforeRetrieve + totalGain;



    (await crowdfundingInstance.retrieveFunding({from : owner}));

    

    const ownerNewBalance = Number(await web3.eth.getBalance(owner));

    const deployerBalance = Number(await web3.eth.getBalance(deployer));


    console.log("DEPLOYER : ", deployerBalance);

    console.log("ESTIMATED GAS COST : ", estimatedGasCost);
    console.log("TOTAL FUNDED : ", totalFunded);
    console.log("OLD OWNER BALANCE : ", ownerBalanceBeforeRetrieve);

    console.log("EXPECTED : ", expectedNewOwnerBalance);
    console.log("ACTUAL : ", ownerNewBalance);

    console.log("DIFFERENCE OLD NEW: ", ownerNewBalance - ownerBalanceBeforeRetrieve);

    console.log("GAS USED : ", totalFunded - (ownerNewBalance - ownerBalanceBeforeRetrieve));

    const contractBalance = Number(await web3.eth.getBalance(crowdfundingInstance.address));
    console.log("CONTRACT BALANCE : ", contractBalance);

    assert.equal(contractBalance, 0, "crowdfunding contract left balance should be 0");
    assert.ok(ownerBalanceBeforeRetrieve < ownerNewBalance, "Owner didn't retrieve the funding");
  });












  it('should refuse request refund goal not completed => funding not ended', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();

    await crowdfundingInstance.setGoal(10000000000, {from : owner});

    const secondsSinceEpochPlusHour = Math.round(Date.now() / 1000 + 3600)
    await crowdfundingInstance.setEndDate(secondsSinceEpochPlusHour, {from: owner});
    
    try {
      await crowdfundingInstance.requestRefundGoalNotCompleted.call({from : funder});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert Funding not ended", "The error message should contain 'revert Funding not ended'");
    }

  });

  it('should refuse request refund goal not completed => Goal achieved', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();

    await crowdfundingInstance.setGoal(100, {from : owner});

    const secondsSinceEpochMinusHour = Math.round(Date.now() / 1000 - 3600)
    await crowdfundingInstance.setEndDate(secondsSinceEpochMinusHour, {from: owner});
    
    try {
      await crowdfundingInstance.requestRefundGoalNotCompleted.call({from : owner});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert Goal achieved", "The error message should contain 'revert Goal achieved'");
    }

  });





  

});