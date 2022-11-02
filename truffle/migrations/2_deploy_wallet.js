const Wallet = artifacts.require("Wallet");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Wallet, "_name", accounts[4], accounts[0], 0);
}
