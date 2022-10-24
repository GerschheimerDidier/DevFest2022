const Allowance = artifacts.require("Allowance");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Allowance, { from: accounts[4]});
}
