const Wallet = artifacts.require("Wallet");

contract('Wallet', (accounts) => {
  //******** ACCOUNT ********//
  const owner = accounts[4];
  const beneficiary = accounts[5];
  const externalUser = accounts[6];

  before(async () => {
    this.walletInstance = await Wallet.new({ from: owner });
  })

  describe("Receive method", () => {
    it('should add money to the smart contract', async () => {
      await this.walletInstance.sendTransaction({
        from: owner,
        value: 50000000000000000, // 0.05 ETHER
      })
    });
    it('should verify if 0.05 ether has been on contract', async () => {
      const balanceContract = await web3.eth.getBalance(this.walletInstance.address);
      assert.equal(web3.utils.fromWei(String(balanceContract), 'ether'), 0.05, "All money has been receive by contract");
    });
  })

  describe("Allowance", () => {
    it('should add allowance to the wallet', async () => {
      await this.walletInstance.defineAllowance(
        beneficiary,
        web3.utils.toWei('3', 'ether'),
        { from: owner }
      )
      const allowanceMapping = await this.walletInstance.accountBeneficiary(beneficiary);
      assert.equal(web3.utils.fromWei(String(allowanceMapping), 'ether'), 3, "This allowance has not been noted");
    });
    it('should update allowance of beneficiary account', async () => {
      await this.walletInstance.defineAllowance(
        beneficiary,
        web3.utils.toWei('1', 'ether'),
        { from: owner }
      )
      const allowanceMapping = await this.walletInstance.accountBeneficiary(beneficiary);
      assert.equal(web3.utils.fromWei(String(allowanceMapping), 'ether'), 1, "This allowance has been updated and noted");
    });
  })

  describe("Withdraw Allowance", () => {
    it('should withdraw the money allowed to this account', async () => {
      await this.walletInstance.withdrawMoney(
        web3.utils.toWei('0.04', 'ether'),
        { from: beneficiary }
      )
    });
  })

})
