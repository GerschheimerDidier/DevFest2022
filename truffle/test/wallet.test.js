const Wallet = artifacts.require("Wallet");

contract('Wallet', (accounts) => {
  //******** ACCOUNT ********//
  const owner = accounts[4];
  const beneficiary = accounts[5];
  const externalUser = accounts[6];

  before(async () => {
    this.walletInstance = await Wallet.new(owner, "0x0000000000000000000000000000000000000000", 0, { from: owner });
  })

  describe("Receive method", () => {
    it('should add money to the smart contract', async () => {
      await this.walletInstance.sendMoneyOnWallet({
        from: owner,
        value: 500000000000000000, // 0.5 ETHER
      })
    });
    it('should verify if 0.05 ether has been on contract', async () => {
      const balanceContract = await web3.eth.getBalance(this.walletInstance.address);
      assert.equal(web3.utils.fromWei(String(balanceContract), 'ether'), 0.5, "All money has been receive by contract");
    });
  })

  describe("Allowance", () => {
    it('should add allowance to the wallet', async () => {
      await this.walletInstance.defineAllowance(
        beneficiary,
        web3.utils.toWei('0.03', 'ether'),
        { from: owner }
      )
      const allowanceMapping = await this.walletInstance.accountBeneficiary(beneficiary);
      assert.equal(web3.utils.fromWei(String(allowanceMapping), 'ether'), 0.03, "This allowance has not been noted");
    });
    it('should impossible to add allowance on the wallet with external user', async () => {
      try {
        await this.walletInstance.defineAllowance(
          beneficiary,
          web3.utils.toWei('0.03', 'ether'),
          { from: externalUser }
        )
        assert.fail("This allowance cannot be possible and should have thrown an error");
      }
      catch (err) {
        assert.include(err.message, "You are not the owner", "The error message should contain 'You are not the owner'");
      }
    });
    it('should update allowance of beneficiary account', async () => {
      await this.walletInstance.defineAllowance(
        beneficiary,
        web3.utils.toWei('0.02', 'ether'),
        { from: owner }
      )
      const allowanceMapping = await this.walletInstance.accountBeneficiary(beneficiary);
      assert.equal(web3.utils.fromWei(String(allowanceMapping), 'ether'), 0.02, "This allowance has been updated and noted");
    });
  })

  describe("Withdraw Allowance", () => {
    it('should be impossible to withdraw more money to contain the allowance', async () => {
      try {
        await this.walletInstance.withdrawMoney(
          web3.utils.toWei('0.03', 'ether'),
          { from: beneficiary }
        )
        assert.fail("This withdraw cannot be possible and should have thrown an error");
      }
      catch (err) {
        assert.include(err.message, "not enough funds has been allowed for your account", "The error message should contain 'not enough funds has been allowed for your account'");
      }
    });

    it('should be impossible to withdraw more money to contain the smart contract', async () => {
      try {
        await this.walletInstance.withdrawMoney(
          web3.utils.toWei('20', 'ether'),
          { from: beneficiary }
        )
        assert.fail("This withdraw cannot be possible and should have thrown an error");
      }
      catch (err) {
        assert.include(err.message, "not enough funds hab been added on smart contract", "The error message should contain 'revert not enough funds hab been added on smart contract'");
      }
    });

    it('should withdraw the money allowed to this account', async () => {
      await this.walletInstance.withdrawMoney(
        web3.utils.toWei('0.01', 'ether'),
        { from: beneficiary }
      )
    });
  })
})
