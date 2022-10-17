//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "./Ownable.sol";

contract CrdFunding is Ownable {
    constructor(
        address _beneficiary,
        string memory _description,
        uint256 _sumGoal,
        uint256 _endDate
    ) {
        transferOwnership(_beneficiary);
        projectDescription = _description;
        goal = _sumGoal;
        endDate = _endDate;
    }

    receive() external payable {
        S_Donation memory newDonation = S_Donation(
            msg.value,
            "_rankName",
            false
        );
        Total += msg.value;
        Donations[msg.sender].donations.push(newDonation);
        Donations[msg.sender].total += msg.value;
    }

    uint256 private goal;
    event goalModified(uint256 _newGoal);

    uint256 private Total;
    event donationReceived(uint256 _donationAmount, uint256 _newTotal);

    uint256 private endDate;
    event endDateModified(uint256 _newEndDate);

    string private projectDescription;
    event projectDescriptionModified(string _newProjectDescription);

    struct Rank {
        string description;
        uint256 minimumInvestment;
        bool active;
    }

    mapping(string => Rank) private Ranks;

    string[] private ActiveRanks;

    struct S_Donation {
        uint256 amount;
        string rankName;
        bool claimReward;
    }

    struct MyDonations {
        S_Donation[] donations;
        uint256 total;
    }

    mapping(address => MyDonations) public Donations;

    event RanksModification(string _name, Rank _rank, string _action);

    event RanksActivation(string _name, string _action);

    function createRank(
        string memory _name,
        bool _active,
        uint256 _minimumInvestment,
        string memory _description
    ) public onlyOwner {
        require(
            _minimumInvestment > 0,
            "Ranks should ask for non null participations"
        );
        require(Ranks[_name].minimumInvestment == 0, "Rank already exists");
        bool valid = !isStringInTable(_name, ActiveRanks);
        require(valid, "This rank is already saved as active");
        if (_active) {
            ActiveRanks.push(_name);
        }
        Rank memory newRank = Rank(_description, _minimumInvestment, _active);
        Ranks[_name] = newRank;
        emit RanksModification(_name, newRank, "ADD");
    }

    function editRank(
        string memory _name,
        uint256 _minimumInvestment,
        string memory _description
    ) public onlyOwner {
        require(
            _minimumInvestment > 0,
            "Ranks should ask for non null participations"
        );
        require(Ranks[_name].minimumInvestment > 0, "Rank does not exist");

        Rank memory editedRank = Rank(
            _description,
            _minimumInvestment,
            Ranks[_name].active
        );
        Ranks[_name] = editedRank;
        emit RanksModification(_name, editedRank, "EDIT");
    }

    function getAllActiveRanks() public view returns (string[] memory) {
        return ActiveRanks;
    }

    function getRankInfo(string memory _name)
        public
        view
        returns (Rank memory)
    {
        return Ranks[_name];
    }

    function deactivateRank(string calldata _name) public onlyOwner {
        require(isStringInTable(_name, ActiveRanks), "No such active ranks");
        Ranks[_name].active = false;
        int256 index = findStringIndex(_name, ActiveRanks);
        assert(index >= 0);
        ActiveRanks[uint256(index)] = ActiveRanks[ActiveRanks.length - 1];
        ActiveRanks.pop();
        emit RanksActivation(_name, "DEACTIVATE");
    }

    function activateRank(string calldata _name) public onlyOwner {
        require(
            !isStringInTable(_name, ActiveRanks),
            "This rank is already active"
        );
        ActiveRanks.push(_name);
        Ranks[_name].active = true;
        emit RanksActivation(_name, "ACTIVATE");
    }

    function setGoal(uint256 _newGoal) public onlyOwner {
        goal = _newGoal;
        emit goalModified(_newGoal);
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

    function setEndDate(uint256 _newEndDate) public onlyOwner {
        endDate = _newEndDate;
        emit endDateModified(_newEndDate);
    }

    function getEndDate() public view returns (uint256) {
        return endDate;
    }

    function getTotal() public view returns (uint256) {
        return Total;
    }

    function sendDonation(string memory _rankName, bool _claimReward)
        public
        payable
    {
        require(
            Ranks[_rankName].active || areStringsEquals(_rankName, "_noRank"),
            "No rank active with this name"
        );
        require(block.timestamp < endDate, "Funding ended");
        require(
            msg.value >= Ranks[_rankName].minimumInvestment,
            "Not enough funding for that rank"
        );
        S_Donation memory newDonation = S_Donation(
            msg.value,
            _rankName,
            _claimReward
        );
        Total += msg.value;
        Donations[msg.sender].donations.push(newDonation);
        Donations[msg.sender].total += msg.value;
    }

    event fundingRetrieved(uint256 _total);

    function retrieveFunding() public onlyOwner {
        require(block.timestamp >= endDate, "Funding not ended");
        require(Total >= goal, "Goal not achieved");
        payable(owner()).transfer(Total);
        emit fundingRetrieved(Total);
    }

    function requestRefundGoalNotCompleted() public {
        require(block.timestamp >= endDate, "Funding not ended");
        require(Total < goal, "Goal achieved");
        require(
            Donations[msg.sender].total > 0,
            "You didn't fund this project"
        );
        payable(msg.sender).transfer(Donations[msg.sender].total);
    }

    function getMyParticipation() public view returns (MyDonations memory) {
        return Donations[msg.sender];
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
