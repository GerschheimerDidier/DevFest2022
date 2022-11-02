// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "./Allowance.sol";
import "./Subscribable.sol";

contract CommonPot is Allowance, Subscribable {
    constructor(
        string memory _walletName,
        address _owner,
        address _factoryAddress,
        uint8 _walletType
    )
        Allowance(_walletName, _owner)
        Subscribable(_factoryAddress, _walletType)
    {}

    address[] private contributors;
    mapping(address => uint256) private balances;
    // The total balance of the contract. It sum up the individual balance of each participant
    uint256 private totalBalance = 0;

    event Deposit(address sender, uint256 amount);
    event Withdrawal(address receiver, uint256 amount);

    receive() external payable {
        require(msg.value > 0, "No money sent");
        balances[msg.sender] += msg.value;
        totalBalance += msg.value;
        if (!contributorsPresent(msg.sender)) {
            contributors.push(msg.sender);
            subscribe(msg.sender);
        }
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() public isOwner {
        //prevent someone who has no interest from emptying contract's balance
        require(balances[msg.sender] > 0, "Insufficient funds");
        uint256 result;
        for (uint256 i = 0; i < contributors.length; i++) {
            result = totalBalance / balances[contributors[i]];
            emit Withdrawal(contributors[i], result);
            balances[contributors[i]] = 0;
        }
        totalBalance = 0;
    }

    function payWithPot(address to, uint256 amount) public payable isOwner {
        require(totalBalance > amount, "Insufficient funds");
        totalBalance -= amount;
        payable(to).transfer(amount);
    }

    function contributorsPresent(address adr) private view returns (bool) {
        for (uint256 i = 0; i < contributors.length; i++) {
            if (contributors[i] == adr) {
                return true;
            }
        }
        return false;
    }

    function getCurrentGlobalBalance() public view returns (uint256) {
        return totalBalance;
    }
}
