const Allowance = artifacts.require("Allowance");

module.exports = function(deployer) {
  deployer.deploy(Allowance);
}
