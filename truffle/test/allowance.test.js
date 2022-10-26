const Allowance = artifacts.require("Allowance");

contract('Allowance', (accounts) => {
  //******** ACCOUNT ********//
  const owner = accounts[4];
  const beneficiary = accounts[5];
  const externalUser = accounts[6];

  before(async () => {
    this.allowanceInstance = await Allowance.new({ from: owner });
  })

  describe("Add Allowance", () => {
    it('should add allowance to the wallet', async () => {
      await this.allowanceInstance.defineAllowance(
        beneficiary,
        web3.utils.toWei('3', 'ether'),
        { from: owner }
      )
      const allowanceMapping = await this.allowanceInstance.accountBeneficiary(beneficiary);
      assert.equal(web3.utils.fromWei(String(allowanceMapping), 'ether'), 3, "This allowance has not been noted");
    });

    it('should be impossible to add allowance on the wallet with external user', async () => {
      try {
        await this.allowanceInstance.defineAllowance(
          beneficiary,
          web3.utils.toWei('3', 'ether'),
          { from: externalUser }
        )
        assert.fail("This allowance cannot be possible and should have thrown an error");
      }
      catch (err) {
        assert.include(err.message, "You are not the owner", "The error message should contain 'You are not the owner'");
      }
    });
  })


  describe("Update Allowance", () => {
    it('should update allowance of beneficiary account', async () => {
      await this.allowanceInstance.defineAllowance(
        beneficiary,
        web3.utils.toWei('1', 'ether'),
        { from: owner }
      )
      const allowanceMapping = await this.allowanceInstance.accountBeneficiary(beneficiary);
      assert.equal(web3.utils.fromWei(String(allowanceMapping), 'ether'), 1, "This allowance has been updated and noted");
    });
  })

  describe("Remove Allowance", () => {
    it('should remove allowance of beneficiary account', async () => {
      await this.allowanceInstance.defineAllowance(
        beneficiary,
        web3.utils.toWei('0', 'ether'),
        { from: owner }
      )
      const allowanceMapping = await this.allowanceInstance.accountBeneficiary(beneficiary);
      assert.equal(web3.utils.fromWei(String(allowanceMapping), 'ether'), 0, "This allowance has been removed");
      const allowance = await this.allowanceInstance.allowance.call(0);
      assert.equal(allowance, 0x0, "This allowance has been removed");
    });
  })
})
