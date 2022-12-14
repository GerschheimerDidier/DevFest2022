// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "./Ownable.sol";
import "./Subscribable.sol";

contract CommonPot is Ownable, Subscribable {
    constructor(
        address _owner,
        address _factoryAddress,
        uint8 _walletType
    ) Subscribable(_factoryAddress, _walletType) {
        transferOwnership(_owner);
    }

    address payable[] private contributors;
    mapping(address => uint256) private balances;
    // The total balance of the contract. It sum up the individual balance of each participant
    uint256 private totalBalance = 0;
    uint256 private totalReceive = 0;

    event Deposit(address sender, uint256 amount);
    event Withdrawal(address receiver, uint256 amount);

    function addMoneyToContract() external payable {
        require(msg.value > 0, "No money sent");
        balances[msg.sender] += msg.value;
        totalBalance = totalBalance + msg.value;
        totalReceive = totalReceive + msg.value;
        if (!contributorsPresent(msg.sender)) {
            contributors.push(payable(msg.sender));
            if (getFactoryAddress() != address(0x0)) {
                subscribe(msg.sender);
            }
        }
        emit Deposit(msg.sender, msg.value);
    }

    function sendMoney(address to, uint256 value) private {
        address payable receiver = payable(to);
        receiver.transfer(value);
    }

    function withdraw() public {
        //prevent someone who has no interest from emptying contract's balance
        require(balances[msg.sender] > 0, "Insufficient funds");
        uint256 result;
        for (uint256 i = 0; i < contributors.length; i++) {
            result = (balances[contributors[i]] / totalReceive) * totalBalance;
            sendMoney(contributors[i], result);

            emit Withdrawal(contributors[i], result);
            balances[contributors[i]] = 0;
        }
        // We assume there will be some neglictable leftover after this operation.
        resetData();
    }

    function resetData() private {
        totalBalance = 0;
        totalReceive = 0;
        for (uint256 i = 0; i < contributors.length; i++) {
            if (getFactoryAddress() != address(0x0)) {
                unsubscribe(contributors[contributors.length - i]);
            }
            contributors.pop();
        }
    }

    function payWithPot(address to, uint256 amount) public onlyOwner {
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

    function getCurrentTotalReceived() public view returns (uint256) {
        return totalReceive;
    }

    function getCurrentContributors()
        public
        view
        returns (address payable[] memory)
    {
        return contributors;
    }
}
