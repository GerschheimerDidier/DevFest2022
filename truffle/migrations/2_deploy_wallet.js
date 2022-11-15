const Wallet = artifacts.require("Wallet");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Wallet, accounts[4], "0x0000000000000000000000000000000000000000", 0);
}
