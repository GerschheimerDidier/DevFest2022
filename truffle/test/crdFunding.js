const Crowdfunding = artifacts.require("Crdfunding");




contract('Crdfunding', (accounts) => {

  const deployer = accounts[0]; // By default, account used is 0 so the contract has been deployed by 0 since we didnt specify a sender in deploy_crowdFunding.js
  const owner = accounts[1];    // Defined on deployment at .\..\migrations\2_deploy_crowdFunding.js
  const funder = accounts[3];

  const secondsSinceEpochPlusHour = Math.round(Date.now() / 1000 + 3600);
  const secondsSinceEpochMinusHour = Math.round(Date.now() / 1000 - 3600);
  const secondsSinceEpochPlus3Sec = Math.round(Date.now() / 1000 + 3600);

  const newCrowdfundingInstanceGoalReachedEndReached = async(value) => {
    const crowdfundingInstance = await Crowdfunding.new(
      accounts[1],
      "NOOOO",
      0,
      secondsSinceEpochMinusHour,
      {value: value});
      return crowdfundingInstance;
  }

  const newCrowdfundingInstanceGoalReachedEndNotReached = async(value) => {
    
    const crowdfundingInstance = await Crowdfunding.new(
      accounts[1],
      "NOOOO",
      0,
      secondsSinceEpochPlusHour,
      {value: value});
      return crowdfundingInstance;
  }

  const newCrowdfundingInstanceGoalNotReachedEndReached = async(value) => {
    const crowdfundingInstance = await Crowdfunding.new(
      accounts[1],
      "NOOOO",
      web3.utils.toWei("3", "ether"),
      secondsSinceEpochMinusHour,
      {value: value});
      return crowdfundingInstance;
  }

  const newCrowdfundingInstanceGoalNotReachedEndNotReached = async(value) => {
    const crowdfundingInstance = await Crowdfunding.new(
      accounts[1],
      "NOOOO",
      web3.utils.toWei("3", "ether"),
      secondsSinceEpochPlusHour,
      {value: value});
      return crowdfundingInstance;
  }

  const newCrowdfundingInstanceGoalReachedEndin3Sec = async(value) => {
    const crowdfundingInstance = await Crowdfunding.new(
      accounts[1],
      "NOOOO",
      0,
      secondsSinceEpochPlus3Sec,
      {value: value});
      return crowdfundingInstance;
  }

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

  it('should read the initial deployement endDate', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    var value = (await crowdfundingInstance.getEndDate.call());
    assert.equal(value, 1665570954, "endDate not at 1665570954, endDate not initialized");

  });

  it('should read the initial Total', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    var value = (await crowdfundingInstance.getTotal.call());
    assert.equal(value, 0, "Total not at 0, Total not initialized at 0");

  });

  it('should read the initial Donation from deployer (account[0]) as 0', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    var value = (await crowdfundingInstance.getMyParticipation.call());
    assert.equal(value.totalClaimable, 0, "accounts[0] participation not initialized at 0");

  });

  it('should read the initial Active Ranks', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 1, "ActiveRanks not initialized with '_noRank'");

  });

  it('should create a new active rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    // ID 1
    await crowdfundingInstance.createRank(
      'testRankActive',
      100,
      "_description",
      -1,
      {from: owner}
    );
    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 2, "ActiveRanks not updated with a second active Rank (_noRank is always active)");
    assert.strictEqual(value[1].rankName, "testRankActive", "Active Rank added is not the provided 'testRankActive'");
    
    var rankInfo = (await crowdfundingInstance.getRankInfo(1));
    assert.strictEqual(rankInfo.name, "testRankActive", "testRankActive name expected 'testRankActive' is '" + rankInfo.name + "'");
    assert.equal(rankInfo.minimumInvestment, 100, "testRankActive minimumInvestment is not 100");
    assert.strictEqual(rankInfo.description, "_description", "testRankActive description expected '_description' is '" + rankInfo.description + "'");
    assert.ok(Number(rankInfo.usesLeft) != 0, "testRankActive has no available/unlimited spots");

  });

  it('should create a new unactive rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    // ID 2
    await crowdfundingInstance.createRank(
      "testRankUnactive",
      100,
      "_description",
      0,
      {from: owner}
    );

    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 2, "ActiveRanks should contain 2 Rank : testRankActive and _noRank from previous test");
    assert.strictEqual(value[1].rankName, "testRankActive", "Active Rank is not 'testRankActive' from previous test");

    var rankInfo = (await crowdfundingInstance.getRankInfo(2));
    assert.strictEqual(rankInfo.name, "testRankUnactive", "testRankUnactive name expected 'testRankUnactive' is '" + rankInfo.name + "'");
    assert.equal(rankInfo.minimumInvestment, 100, "testRankUnactive minimumInvestment is not 100")
    assert.strictEqual(rankInfo.description, "_description", "testRankUnactive description expected '_description' is '" + rankInfo.description + "'")
    assert.ok(Number(rankInfo.usesLeft) == 0, "testRankUnactive has available/unlimited spots");

  });

  it('should deactivate a created active rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    // ID 3
    await crowdfundingInstance.createRank(
      "testRankToDeactivate",
      100,
      "_description",
      -1,
      {from: owner}
    );

    await crowdfundingInstance.deactivateRank(3, {from: owner})

    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 2, "ActiveRanks should contain 2 Rank : testRankActive and _noRank from previous test");
    assert.strictEqual(value[1].rankName, "testRankActive", "Active Rank is not 'testRankActive' from previous test");
    
    var rankInfo = (await crowdfundingInstance.getRankInfo(3));
    assert.strictEqual(rankInfo.name, "testRankToDeactivate", "testRankToDeactivate name expected 'testRankToDeactivate' is '" + rankInfo.name + "'");
    assert.equal(rankInfo.minimumInvestment, 100, "testRankToDeactivate minimumInvestment is not 100")
    assert.strictEqual(rankInfo.description, "_description", "testRankToDeactivate description expected '_description' is '" + rankInfo.description + "'")
    assert.ok(Number(rankInfo.usesLeft) == 0, "testRankToDeactivate has available/unlimited spots");

  });

  it('should activate a created unactive rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    // ID 4
    await crowdfundingInstance.createRank(
      "testRankToActivate",
      100,
      "_description",
      0,
      {from: owner}
    );

    await crowdfundingInstance.activateRank(4, {from: owner});

    var value = (await crowdfundingInstance.getAllActiveRanks.call());
    assert.equal(value.length, 3, "ActiveRanks should contain 2 Ranks (one from previous test and _noRank)");
    assert.strictEqual(value[2].rankName, "testRankToActivate", "Active Rank is not 'testRankToActivate' from previous test");
    
    var rankInfo = (await crowdfundingInstance.getRankInfo(4));
    assert.strictEqual(rankInfo.name, "testRankToActivate", "testRankToActivate name expected 'testRankToActivate' is '" + rankInfo.name + "'");
    assert.equal(rankInfo.minimumInvestment, 100, "testRankToActivate minimumInvestment is not 100");
    assert.strictEqual(rankInfo.description, "_description", "testRankToActivate description expected '_description' is '" + rankInfo.description + "'");
    assert.ok(Number(rankInfo.usesLeft) != 0, "testRankToActivate has no available/unlimited spots");

  });

  it('should edit a created rank', async() => {

    const crowdfundingInstance = await Crowdfunding.deployed();
    
    // ID 5
    await crowdfundingInstance.createRank(
      "testRankToEdit",
      100,
      "_description",
      25,
      {from: owner}
    );

    await crowdfundingInstance.editRank(
      5,
      500,
      "_description_edited",
      50,
      {from: owner}
    );

    var rankInfo = (await crowdfundingInstance.getRankInfo(5));
    assert.strictEqual(rankInfo.name, "testRankToEdit", "testRankToEdit name expected 'testRankToEdit' is '" + rankInfo.name + "'");
    assert.equal(rankInfo.minimumInvestment, 500, "testRankToEdit minimumInvestment is not 100");
    assert.strictEqual(rankInfo.description, "_description_edited", "testRankToEdit description expected '_description' is '" + rankInfo.description + "'");
    assert.ok(Number(rankInfo.usesLeft) == 50, "testRankToEdit has not 50 available spots");

  });


  

  it('should send a donation from owner', async() => {

    const crowdfundingInstance = await newCrowdfundingInstanceGoalNotReachedEndNotReached(0);

    await crowdfundingInstance.sendDonation(0, false, {from: owner, value: 100})

    var value = (await crowdfundingInstance.getMyParticipation.call({from: owner}));
    assert.equal(value.totalClaimable, 100, "owner participation not updated to 100");

    var fundingTotal = (await crowdfundingInstance.getTotal.call({from: owner}));
    assert.equal(fundingTotal, 100, "crowdfunding total not updated to 100");

    var contractBalance = (await web3.eth.getBalance(crowdfundingInstance.address));
    assert.equal(contractBalance, 100, "crowdfunding contract balance not updated to 100");

  });

  it('should send a donation from funder', async() => {

    const crowdfundingInstance = await newCrowdfundingInstanceGoalNotReachedEndNotReached(0);
    
    await crowdfundingInstance.sendDonation(0, false, {from: funder, value: 100000000});

    var value = (await crowdfundingInstance.getMyParticipation.call({from: funder}));
    assert.equal(value.totalClaimable, 100000000, "funder participation not updated to 100000000");

    var fundingTotal = (await crowdfundingInstance.getTotal.call({from: funder}));

    assert.equal(fundingTotal, 100000000, "crowdfunding total not updated to 100000000");

    var contractBalance = (await web3.eth.getBalance(crowdfundingInstance.address));
    assert.equal(contractBalance, 100000000, "crowdfunding contract balance not updated to 100000000");

  });

  it('should refuse a donation from funder => funding ended', async() => {

    const crowdfundingInstance = await newCrowdfundingInstanceGoalNotReachedEndReached(0);

    try {
      await crowdfundingInstance.sendDonation(0, false, {from: funder, value: 100000000});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "Funding ended", "The error message should contain 'Funding ended'");
    }

  });

  it('should refuse funding retrival => funding not ended and goal not achieved', async() => {

    const crowdfundingInstance = await newCrowdfundingInstanceGoalNotReachedEndNotReached(0);
    
    try {
      await crowdfundingInstance.retrieveFunding.call({from : owner});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert", "The error message should contain 'revert'");
    }

  });

  it('should refuse funding retrival => funding not ended', async() => {

    const crowdfundingInstance = await newCrowdfundingInstanceGoalReachedEndNotReached(0);
    
    try {
      await crowdfundingInstance.retrieveFunding.call({from : owner});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert Funding not ended", "The error message should contain 'revert Funding not ended'");
    }

  });

  it('should refuse funding retrival => goal not achieved', async() => {

    //const crowdfundingInstance = await Crowdfunding.deployed();

    const crowdfundingInstance = await newCrowdfundingInstanceGoalNotReachedEndReached(0);
    
    try {
      await crowdfundingInstance.retrieveFunding.call({from : owner});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert Goal not achieved", "The error message should contain 'revert Goal not achieved'");
    }

  });



  it('should have owner retrieve crowdfunding funds', async() => {

    const crowdfundingInstance = await newCrowdfundingInstanceGoalReachedEndReached(web3.utils.toWei("3", "ether"));

    const ownerBalanceBeforeRetrieve = Number(await web3.eth.getBalance(owner));

    (await crowdfundingInstance.retrieveFunding({from : owner}));

    const ownerNewBalance = Number(await web3.eth.getBalance(owner));

    const contractBalance = Number(await web3.eth.getBalance(crowdfundingInstance.address));

    assert.equal(contractBalance, 0, "crowdfunding contract left balance should be 0");
    assert.ok(ownerBalanceBeforeRetrieve < ownerNewBalance, "Owner didn't retrieve the funding");
  });


  it('should refuse request refund goal not completed => funding not ended', async() => {

    const crowdfundingInstance = await newCrowdfundingInstanceGoalNotReachedEndNotReached();
    
    try {
      await crowdfundingInstance.requestRefundGoalNotCompleted.call({from : funder});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert Funding not ended", "The error message should contain 'revert Funding not ended'");
    }

  });

  it('should refuse request refund goal not completed => Goal achieved', async() => {

    const crowdfundingInstance = await newCrowdfundingInstanceGoalReachedEndReached();
    
    try {
      await crowdfundingInstance.requestRefundGoalNotCompleted.call({from : owner});
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
      assert.include(err.message, "revert Goal achieved", "The error message should contain 'revert Goal achieved'");
    }

  });

  it('deployer should have its funds back', async() => {

    const crowdfundingInstance = await newCrowdfundingInstanceGoalNotReachedEndReached(web3.utils.toWei("2", "ether"));

    const deployerBalanceBeforeRetrieve = Number(await web3.eth.getBalance(deployer));


    (await crowdfundingInstance.requestRefundGoalNotCompleted({from : deployer}));

    

    const deployerNewBalance = Number(await web3.eth.getBalance(deployer));


    const contractBalance = Number(await web3.eth.getBalance(crowdfundingInstance.address));

    var value = (await crowdfundingInstance.getMyParticipation.call({from: deployer}));

    assert.equal(0, value.totalClaimable, "crowdfunding contract left balance should be 0");
    assert.ok(deployerBalanceBeforeRetrieve < deployerNewBalance, "deployer didn't retrieve the funding");
  });


  





  

});