const CommonPot = artifacts.require("CommonPot");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(CommonPot, "_name", accounts[4], accounts[0], 2);
}