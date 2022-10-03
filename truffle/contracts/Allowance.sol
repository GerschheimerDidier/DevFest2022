// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

contract Allowance {
    address[] public allowance;
    address public owner;

    mapping(address => int64) public accountBeneficiary;

    constructor() {
        owner = msg.sender;
    }

    receive () external payable isOwner {}

    modifier isAlreadyBeneficiary()  {
        require(!(accountBeneficiary[msg.sender] > 0), "You are already on this wallet but you can modifier your allowance");
        _;
    }

    modifier isOwner{
        require(owner == msg.sender, "You are not the owner of this wallet");
        _;
    }

    function addAllowance(address _who, int64 _amount) public isOwner {
        allowance.push(_who);
        accountBeneficiary[_who] = _amount;
    }

    function updateAllowance(address _who, int64 _newAmount) public isOwner {
        accountBeneficiary[_who] = _newAmount;
    }

    function removeAllowance(address _who) public isOwner {
        delete accountBeneficiary[_who];
    }
}
