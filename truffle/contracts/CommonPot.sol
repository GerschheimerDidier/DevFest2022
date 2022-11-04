// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./Allowance.sol";

contract CommonPot is Allowance {

    address payable[] private contributors ;
    mapping(address => uint) private balances;
    // The total balance of the contract. It sum up the individual balance of each participant
    uint private totalBalance = 0;
    uint private totalReceive = 0;

    event Deposit(address sender, uint amount);
    event Withdrawal(address receiver, uint256 amount);

    function addMoneyToContract() external payable {
        require(msg.value > 0, "No money sent");
        balances[msg.sender] += msg.value;
        totalBalance = totalBalance + msg.value;
        totalReceive = totalReceive + msg.value;
        if (!contributorsPresent(msg.sender)) {
            contributors.push(payable(msg.sender));
        }
        emit Deposit(msg.sender, msg.value);
    }

    function sendMoney(address to, uint value) private {
        address payable receiver = payable(to);
        receiver.transfer(value);
    }

    function withdraw() public {
        //prevent someone who has no interest from emptying contract's balance
        require(balances[msg.sender] > 0, "Insufficient funds");
        uint256 result;
        for (uint i = 0; i < contributors.length; i++) {
            result = balances[contributors[i]] / totalReceive * totalBalance;
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
        for(uint i = 0; i < contributors.length; i++){
            contributors.pop();
        }
    }

    function payWithPot(address to, uint amount) public {
        require(totalBalance > amount, "Insufficient funds");
        require(isOwner(), "You do not have enough right");
        totalBalance -= amount;
        payable(to).transfer(amount);
    }

    function contributorsPresent(address adr) private view returns (bool) {
        for (uint i = 0; i < contributors.length; i++) {
            if (contributors[i] == adr) {
                return true;
            }
        }
        return false;
    }

    function getCurrentGlobalBalance() public view returns (uint) {
        return totalBalance;
    }
}
