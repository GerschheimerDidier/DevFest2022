// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10 < 0.9.0;

import "./Allowance.sol";

contract Wallet is Allowance {
    event MoneyWithdrawn(address indexed _beneficiary, uint _amount);
    event MoneyDeposited(address indexed _from, uint _amount);

    // TODO Faire que la personne ne peut que withdraw pour elle
    function withdrawMoney(uint _amount) public hasFundOnWallet(msg.sender)  {
        require(address(this).balance >= _amount, "not enough funds hab been added on smart contract");
        require(accountBeneficiary[msg.sender] >= _amount, "not enough funds has been allowed for your account");
        uint newAmount = accountBeneficiary[msg.sender] - _amount;

        updateMyAllowanceWithdrawn(newAmount);

        payable(msg.sender).transfer(_amount);
        emit MoneyWithdrawn(msg.sender, _amount);
    }

    receive () external payable {
        emit MoneyDeposited(msg.sender, msg.value);
    }
}
