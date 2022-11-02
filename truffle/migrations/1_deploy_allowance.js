const Allowance = artifacts.require("Allowance");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Allowance, "_name", accounts[3]);
}
