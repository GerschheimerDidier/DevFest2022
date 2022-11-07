const WalletFactory = artifacts.require("WalletFactory");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(WalletFactory);
}