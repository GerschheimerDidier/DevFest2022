const Factory = artifacts.require("WalletFactory");




contract('Factory', (accounts) => {

    const owner = accounts[0];

    const owner2 = accounts[9];

    const secondsSinceEpochPlusHour = Math.round(Date.now() / 1000 + 3600);

    before(async () => {
        this.factoryInstance = await Factory.deployed();
      })

    it('should get initial balance', async() => {
    
        var value = (await web3.eth.getBalance(this.factoryInstance.address));
        assert.ok(value >= 0, "NOOOO", "NOOOO wasn't the initial descritpion value");
    });

    it('should create a new shared wallet for owner', async() => {
    
        await this.factoryInstance.createSharedWallet({from : owner});
        let subscriptions = await this.factoryInstance.getSubscriptions.call({from : owner})

        assert.strictEqual(1, subscriptions.length, "owner should have 1 subscription");

        assert.strictEqual(0, Number(subscriptions[0].walletType), "wallet type should be 0 => shared wallet");
        
    });

    it('should create a new crowdfunding for owner', async() => {
    
        await this.factoryInstance.createCrowdfunding("_descCRDFNDNG", 9000000000, secondsSinceEpochPlusHour, {from : owner, value : 0});
        let subscriptions = await this.factoryInstance.getSubscriptions.call({from : owner})

        assert.strictEqual(2, subscriptions.length, "owner should have 2 subscription");

        assert.strictEqual(1, Number(subscriptions[1].walletType), "wallet type should be 1 => crowdfunding");
        
    });

    it('should create a new common pot for owner', async() => {
    
        await this.factoryInstance.createCommonPot({from : owner});
        let subscriptions = await this.factoryInstance.getSubscriptions.call({from : owner})

        assert.strictEqual(3, subscriptions.length, "owner should have 3 subscription");

        assert.strictEqual(2, Number(subscriptions[2].walletType), "wallet type should be 2 => common pot");
        
    });

    it('should create a new common pot for owner2', async() => {
    
        await this.factoryInstance.createCommonPot({from : owner2});
        let subscriptions = await this.factoryInstance.getSubscriptions.call({from : owner2})

        assert.strictEqual(1, subscriptions.length, "owner2 should have 1 subscription");

        assert.strictEqual(2, Number(subscriptions[0].walletType), "wallet type should be 2 => common pot");
        
    });

    
    it('should not allow to add wallet subscription by non factory-deployed contracts', async() => {

        try {
            await this.factoryInstance.addWalletToSubscription(owner, 1, {from: owner});
            assert.fail("The transaction should have thrown an error");
          }
          catch (err) {
            assert.include(err.message, "Can only be called by a deployed wallet", "The error message should contain 'Can only be called by a deployed wallet'");
          }
        
    });

    it('should not allow to remove wallet from subscription by non factory-deployed contracts', async() => {

        try {
            await this.factoryInstance.removeWalletFromSubscription(owner, {from: owner});
            assert.fail("The transaction should have thrown an error");
          }
          catch (err) {
            assert.include(err.message, "Can only be called by a deployed wallet", "The error message should contain 'Can only be called by a deployed wallet'");
          }
        
    });



});


