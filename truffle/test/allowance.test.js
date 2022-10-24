const Allowance = artifacts.require("Allowance");

contract('Allowance', (accounts) => {
  //******** ACCOUNT ********//
  const owner = accounts[4];
  const beneficiary = accounts[5];
  const externalUser = accounts[6];
  let smAddress;

  before(async () => {
    this.allowanceInstance = await Allowance.new({ from: accounts[4] });
    smAddress = this.allowanceInstance.address;
  })

  describe("Add Allowance", () => {
    it('should add allowance to the wallet', async () => {
      console.log('owner', await this.allowanceInstance.owner.call());
      console.log('allowance', await this.allowanceInstance.allowance.call(0));

      await this.allowanceInstance.setAllowance(
        beneficiary,
        web3.utils.toWei('3', 'ether'),
        { from: owner }
      )
      const allowanceMapping = await this.allowanceInstance.accountBeneficiary(beneficiary);
      assert.equal(web3.utils.fromWei(String(allowanceMapping), 'ether'), 3, "This allowance has not been noted");
    });
  })


  describe("Update Allowance", () => {
    it('should update allowance of beneficiary account', async () => {
      await this.allowanceInstance.updateAllowance(
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
      await this.allowanceInstance.updateAllowance(
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
