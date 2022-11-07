const CommonPot = artifacts.require("CommonPot");




contract('CommonPot', (accounts) => {

    const owner = accounts[7];

    const participant = accounts[8];

    const receiver = accounts[9];

    before(async () => {
        this.commonPotInstance = await CommonPot.deployed();
      })

    it('should have totalBalance initialized at 0', async() => {
    
        var value = (await this.commonPotInstance.getCurrentGlobalBalance.call());

        console.log("VAL : ", value);
        assert.strictEqual(0, Number(value),  "totalBalance not at 0");
    });

    it('should have totalReceived initialized at 0', async() => {
    
        var value = (await this.commonPotInstance.getCurrentTotalReceived.call());

        console.log("VAL : ", value);
        assert.strictEqual(0, Number(value),  "totalReceived not at 0");
    });

    it('should have contributors initialized empty', async() => {
    
        var value = (await this.commonPotInstance.getCurrentContributors.call());

        console.log("VAL : ", value);
        assert.strictEqual(0, value.length,  "Contributors not empty");
    });

    it('should have participant send money to CommonPot', async() => {

        await this.commonPotInstance.addMoneyToContract({from : participant, value : web3.utils.toWei("3", "ether")})
    
        var value = (await this.commonPotInstance.getCurrentTotalReceived.call());

        console.log("VAL : ", value);
        assert.strictEqual(Number(web3.utils.toWei("3", "ether")), Number(value),  "Money not received");


        value = (await this.commonPotInstance.getCurrentGlobalBalance.call());
        assert.strictEqual(Number(web3.utils.toWei("3", "ether")), Number(value),  "Money not received");
    });



    it('should have CommonPot send money to Receiver', async() => {

        const receiverBalanceBeforeRetrieve = Number(await web3.eth.getBalance(receiver));
    
        (await this.commonPotInstance.payWithPot(receiver, web3.utils.toWei("2", "ether"), {from : owner}));

        const receiverBalanceAfterRetrieve = Number(await web3.eth.getBalance(receiver));

        value = (await this.commonPotInstance.getCurrentGlobalBalance.call());

        console.log("VAL : ", value);
        assert.strictEqual(Number(web3.utils.toWei("1", "ether")), Number(value),  "Money not send");

        assert.ok(receiverBalanceAfterRetrieve > receiverBalanceBeforeRetrieve,  "receiver didn't get its money");
    });


    it('should have Participant withdraw money', async() => {

        const receiverBalanceBeforeWithdraw = Number(await web3.eth.getBalance(participant));
    
        (await this.commonPotInstance.withdraw({from : participant}));

        const receiverBalanceAfterWithdraw = Number(await web3.eth.getBalance(participant));

        var value = (await this.commonPotInstance.getCurrentGlobalBalance.call());

        console.log("VAL : ", value);
        assert.strictEqual(Number(web3.utils.toWei("0", "ether")), Number(value),  "Money not send");

        assert.ok(receiverBalanceAfterWithdraw > receiverBalanceBeforeWithdraw,  "participant didn't get its withdrawn money");

        value = (await this.commonPotInstance.getCurrentGlobalBalance.call());

        console.log("VAL : ", value);
        assert.strictEqual(0, Number(value),  "totalBalance not at 0");

        value = (await this.commonPotInstance.getCurrentTotalReceived.call());

        console.log("VAL : ", value);
        assert.strictEqual(0, Number(value),  "totalReceived not at 0");

        value = (await this.commonPotInstance.getCurrentContributors.call());

        console.log("VAL : ", value);
        assert.strictEqual(0, value.length,  "Contributors not empty");
    });

});