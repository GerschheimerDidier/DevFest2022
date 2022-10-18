// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17 < 0.9.0;

import "./Allowance.sol";

contract Wallet is Allowance {
    event MoneySpent(address indexed _beneficiary, uint _amount);
    event MoneyReceive(address indexed _from, uint _amount);

    function withdrawMoney(uint _amount) public ownerOrAllowed(msg.sender) {
        require(accountBeneficiary[msg.sender] >= _amount, "not enough funds has been allowed for your account");
        uint newAmount = accountBeneficiary[msg.sender] - _amount;

        updateAllowance(msg.sender, newAmount);

        payable(msg.sender).transfer(_amount);
        emit MoneySpent(msg.sender, _amount);
    }

    // - Only the owner can be send the ether on this smart contract
    receive () external payable {
        emit MoneyReceive(msg.sender, msg.value);
    }
}
