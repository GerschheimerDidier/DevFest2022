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
            1665570954
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
            1665570954
        );

        string memory newdesc = "newdesccc";

        crowdFunding.setDescription(newdesc);

        Assert.equal(
            crowdFunding.getDescription(),
            newdesc,
            "should have newdesc ('newdesccc') as description"
        );
    }

    /*
    function testCreateRank() public {
        CrdFunding crowdFunding = new CrdFunding(
            address(this),
            "desccc",
            300,
            1665570954
        );

        crowdFunding.createRank{gas: 100000}(
            "newRank",
            true,
            100,
            "first new rank"
        );
        string[] memory activeRanks = crowdFunding.getAllActiveRanks();

        bool rankInfo_active = crowdFunding
        .getRankInfo{gas: 100000}("newRank").active;

        uint256 rankInfo_minimumInvestment = crowdFunding
        .getRankInfo{gas: 100000}("newRank").minimumInvestment;

        string memory rankInfo_description = crowdFunding
        .getRankInfo{gas: 100000}("newRank").description;

        Assert.equal(
            activeRanks.length,
            1,
            "Contract should have 1 active rank"
        );
        Assert.equal(
            activeRanks[0],
            "newRank",
            "Contract's active rank name should be 'newRank'"
        );
        Assert.equal(rankInfo_active, true, "newRank shoud be active");
        Assert.equal(
            rankInfo_minimumInvestment,
            100,
            "newRank's minimum investment shoud be 100"
        );
        Assert.equal(
            rankInfo_description,
            "first new rank",
            "newRank's description shoud be 'first new rank'"
        );
    }
    /*
    function testEditRank() public {
        CrdFunding crowdFunding = new CrdFunding(
            address(this),
            "desccc",
            300,
            1665570954
        );

        crowdFunding.createRank("rankToEdit", true, 100, "rank to edit");

        crowdFunding.editRank("rankToEdit", 150, "rank edited");

        bool rankInfo_active = crowdFunding.getRankInfo("rankToEdit").active;

        uint256 rankInfo_minimumInvestment = crowdFunding
            .getRankInfo("rankToEdit")
            .minimumInvestment;

        string memory rankInfo_description = crowdFunding
            .getRankInfo("rankToEdit")
            .description;

        Assert.equal(rankInfo_active, true, "rankToEdit shoud be active");
        Assert.equal(
            rankInfo_minimumInvestment,
            150,
            "rankToEdit's minimum investment shoud be 150"
        );
        Assert.equal(
            rankInfo_description,
            "rank edited",
            "rankToEdit's description shoud be 'rank edited'"
        );
    }*/
}
