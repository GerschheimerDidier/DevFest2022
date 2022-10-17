// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../contracts/CrdFunding.sol";
// These files are dynamically created at test time
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

contract CrdFundingTest {
    function testInitContractOwnership() public {
        CrdFunding crowdFunding = new CrdFunding(
            address(this),
            "desccc",
            10,
            1665570954
        );
        Assert.equal(
            crowdFunding.owner(),
            address(this),
            "Contract should have deployer (contract CrdFundingTest) as owner"
        );
    }
}
