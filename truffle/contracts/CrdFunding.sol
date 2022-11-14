//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "./Ownable.sol";
import "./Subscribable.sol";

contract CrdFunding is Subscribable, Ownable {
    constructor(
        address _beneficiary,
        string memory _description,
        uint256 _sumGoal,
        uint256 _endDate,
        address _factoryAddress,
        uint8 _walletType
    ) payable Subscribable(_factoryAddress, _walletType) {
        transferOwnership(_beneficiary);

        projectDescription = _description;
        goal = _sumGoal;
        endDate = _endDate;
        Rank memory noRank = Rank("_noRank", "no advantages", 0, -1);
        Ranks[rankIndex] = noRank;
        NameAndIdRanks.push(NameAndIdRank("_noRank", rankIndex));
        rankIndex = rankIndex + 1;
        if (msg.value > 0) {
            S_Donation memory newDonation = S_Donation(
                msg.value,
                "_noRank",
                false
            );
            Total += msg.value;
            Donations[msg.sender].totalClaimable += msg.value;
            Donations[msg.sender].donations.push(newDonation);
        }
    }

    receive() external payable {
        require(block.timestamp < endDate, "Funding ended");
        S_Donation memory newDonation = S_Donation(msg.value, "_noRank", false);
        Total += msg.value;
        Donations[msg.sender].totalClaimable += msg.value;
        Donations[msg.sender].donations.push(newDonation);

        if (getFactoryAddress() != address(0x0)) {
            subscribe(msg.sender);
        }
    }

    uint256 rankIndex;

    uint256 private goal;
    event goalModified(uint256 _newGoal);

    uint256 private Total;
    event donationReceived(uint256 _donationAmount, uint256 _newTotal);

    bool private retrieved;

    uint256 private endDate;
    event endDateModified(uint256 _newEndDate);

    string private projectDescription;
    event projectDescriptionModified(string _newProjectDescription);

    struct Rank {
        string name;
        string description;
        uint256 minimumInvestment;
        int256 usesLeft;
    }

    struct NameAndIdRank {
        string rankName;
        uint256 id;
    }

    mapping(uint256 => Rank) private Ranks;

    NameAndIdRank[] private NameAndIdRanks;

    struct S_Donation {
        uint256 amount;
        string rankName;
        bool claimReward;
    }

    struct MyDonations {
        S_Donation[] donations;
        uint256 totalClaimable;
    }

    mapping(address => MyDonations) public Donations;

    event RanksModification(string _name, Rank _rank, string _action);

    event RanksActivation(string _name, string _action);

    event GiveUpParticipation(address _who);

    event Refund(address _who, uint256 _value);

    function createRank(
        string memory _name,
        uint256 _minimumInvestment,
        string memory _description,
        int256 _usageNumber
    ) public onlyOwner {
        require(
            _minimumInvestment > 0,
            "Ranks should ask for non null participations"
        );
        require(Ranks[rankIndex].minimumInvestment == 0, "Rank already exists");
        require(
            !areStringsEquals(_name, "_noRank"),
            "not allowed to create '_noRank'"
        );

        NameAndIdRanks.push(NameAndIdRank(_name, rankIndex));

        Rank memory newRank = Rank(
            _name,
            _description,
            _minimumInvestment,
            _usageNumber
        );
        Ranks[rankIndex] = newRank;
        rankIndex = rankIndex + 1;
        emit RanksModification(_name, newRank, "ADD");
    }

    function editRank(
        uint256 _id,
        uint256 _minimumInvestment,
        string memory _description,
        int256 _uses
    ) public onlyOwner {
        require(
            _minimumInvestment > 0,
            "Ranks should ask for non null participations"
        );
        require(Ranks[_id].minimumInvestment > 0, "Rank does not exist");
        require(_id != 0, "not allowed to edit '_noRank'");

        Rank memory editedRank = Rank(
            Ranks[_id].name,
            _description,
            _minimumInvestment,
            _uses
        );
        Ranks[_id] = editedRank;
        emit RanksModification(Ranks[_id].name, editedRank, "EDIT");
    }

    function getAllActiveRanks() public view returns (NameAndIdRank[] memory) {
        uint256 activeRankSNumber;
        for (uint256 i; i < rankIndex; i++) {
            if (Ranks[i].usesLeft != 0) {
                activeRankSNumber++;
            }
        }
        NameAndIdRank[] memory ActiveRanks = new NameAndIdRank[](
            activeRankSNumber
        );
        uint256 index;
        for (uint256 i; i < rankIndex; i++) {
            if (Ranks[i].usesLeft != 0) {
                ActiveRanks[index] = NameAndIdRanks[i];
                index++;
            }
        }
        return ActiveRanks;
    }

    function getRankInfo(uint256 _id) public view returns (Rank memory) {
        return Ranks[_id];
    }

    function deactivateRank(uint256 _id) public onlyOwner {
        require(Ranks[_id].usesLeft != 0, "No such active ranks");
        require(_id != 0, "Can't deactivate _noRank");
        Ranks[_id].usesLeft = 0;
        emit RanksActivation(Ranks[_id].name, "DEACTIVATE");
    }

    function activateRank(uint256 _id) public onlyOwner {
        require(Ranks[_id].usesLeft == 0, "This rank is already active");
        Ranks[_id].usesLeft = -1;
        emit RanksActivation(Ranks[_id].name, "ACTIVATE");
    }

    function getGoal() public view returns (uint256) {
        return goal;
    }

    function setDescription(string memory _newProjectDescription)
        public
        onlyOwner
    {
        projectDescription = _newProjectDescription;
        emit projectDescriptionModified(_newProjectDescription);
    }

    function getDescription() public view returns (string memory) {
        return projectDescription;
    }

    function getEndDate() public view returns (uint256) {
        return endDate;
    }

    function getTotal() public view returns (uint256) {
        return Total;
    }

    function sendDonation(uint256 _rankId, bool _claimReward) public payable {
        int256 usage = Ranks[_rankId].usesLeft;
        require(usage != 0, "No available spots for this rank");
        require(block.timestamp < endDate, "Funding ended");
        require(
            msg.value >= Ranks[_rankId].minimumInvestment,
            "Not enough funding for that rank"
        );

        if (getFactoryAddress() != address(0x0)) {
            subscribe(msg.sender);
        }

        if (usage > 0) {
            Ranks[_rankId].usesLeft = usage - 1;
        }

        S_Donation memory newDonation = S_Donation(
            msg.value,
            Ranks[_rankId].name,
            _claimReward
        );
        Total += msg.value;
        Donations[msg.sender].donations.push(newDonation);
        Donations[msg.sender].totalClaimable += msg.value;
    }

    event fundingRetrieved(uint256 _total);

    function retrieveFunding() public onlyOwner {
        require(!retrieved, "Funds already retrieved");
        require(block.timestamp >= endDate, "Funding not ended");
        require(Total >= goal, "Goal not achieved");
        payable(owner()).transfer(address(this).balance);
        retrieved = true;
        if (getFactoryAddress() != address(0x0)) {
            unsubscribe(msg.sender);
        }
        emit fundingRetrieved(Total);
    }

    function requestRefundGoalNotCompleted() public {
        require(block.timestamp >= endDate, "Funding not ended");
        require(Total < goal, "Goal achieved");
        require(
            Donations[msg.sender].totalClaimable > 0,
            "You don't have money to claim back"
        );
        uint256 toSend = Donations[msg.sender].totalClaimable;
        Donations[msg.sender].totalClaimable = 0;
        payable(msg.sender).transfer(toSend);
        if (getFactoryAddress() != address(0x0)) {
            unsubscribe(msg.sender);
        }
        emit Refund(msg.sender, toSend);
    }

    function getMyParticipation() public view returns (MyDonations memory) {
        return Donations[msg.sender];
    }

    function giveUpBenefitsAndParticipation() external {
        require(
            msg.sender != owner(),
            "As the owner u cant give up this contract - transfer ownership then retry"
        );
        uint256 nbOfDonations = Donations[msg.sender].donations.length;
        for (uint256 i = 0; i < nbOfDonations; i++) {
            Donations[msg.sender].donations[i].claimReward = false;
        }
        if (getFactoryAddress() != address(0x0)) {
            unsubscribe(msg.sender);
        }
        emit GiveUpParticipation(msg.sender);
    }

    // utils
    function areStringsEquals(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function isStringInTable(string memory element, string[] memory table)
        private
        pure
        returns (bool)
    {
        for (uint256 i = 0; i < table.length; i++) {
            if (areStringsEquals(element, table[i])) {
                return true;
            }
        }
        return false;
    }

    function getTime() public view returns (uint256) {
        return block.timestamp;
    }

    function findStringIndex(string calldata element, string[] memory table)
        private
        pure
        returns (int256)
    {
        for (uint256 i; i < table.length; i++) {
            if (areStringsEquals(element, table[i])) {
                return int256(i);
            }
        }
        return -1;
    }
}
