const Wallet = artifacts.require("Wallet");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Wallet, "_name", accounts[4], "0x0000000000000000000000000000000000000000", 0);
}
