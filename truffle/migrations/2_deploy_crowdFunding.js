const CrdFunding = artifacts.require("CrdFunding");

module.exports = function (deployer, network, accounts) {
  //console.log("ACCOUNTS : ", accounts)
  deployer.deploy(CrdFunding,
  accounts[1],
  "NOOOO",
  10,
  1665570954,
  accounts[0],
  0);
};