const CommonPot = artifacts.require("CommonPot");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(CommonPot, accounts[7], "0x0000000000000000000000000000000000000000", 2);
}