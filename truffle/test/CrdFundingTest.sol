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
            1665570954,
            address(0x0000000000000000000000000000000000000000),
            1
        );
        Assert.equal(
            crowdFunding.owner(),
            address(this),
            "Contract should have deployer (contract CrdFundingTest) as owner"
        );
        Assert.equal(
            crowdFunding.getDescription(),
            "desccc",
            "Contract should have 'desccc' as description"
        );
        Assert.equal(
            crowdFunding.getGoal(),
            10,
            "Contract should have 10 as goal"
        );
        Assert.equal(
            crowdFunding.getEndDate(),
            1665570954,
            "Contract should have 1665570954 as endDate"
        );
        Assert.equal(
            crowdFunding.getTotal(),
            0,
            "Contract should have initial total at 0"
        );
    }

    function testTransferOwnership() public {
        CrdFunding crowdFunding = new CrdFunding(
            address(this),
            "desccc",
            10,
            1665570954,
            address(0x0000000000000000000000000000000000000000),
            1
        );

        address newowner = 0x414C43e91ed27ed643Eee3C1902dE70cb6d1618A;

        crowdFunding.transferOwnership(newowner);

        Assert.equal(
            crowdFunding.owner(),
            newowner,
            "should have newowner (0x414C43e91ed27ed643Eee3C1902dE70cb6d1618A) as owner"
        );
    }

    function testSetDescription() public {
        CrdFunding crowdFunding = new CrdFunding(
            address(this),
            "desccc",
            10,
            1665570954,
            address(0x0000000000000000000000000000000000000000),
            1
        );

        string memory newdesc = "newdesccc";

        crowdFunding.setDescription(newdesc);

        Assert.equal(
            crowdFunding.getDescription(),
            newdesc,
            "should have newdesc ('newdesccc') as description"
        );
    }
}
