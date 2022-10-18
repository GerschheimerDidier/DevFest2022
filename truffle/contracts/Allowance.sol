// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17 < 0.9.0;

contract Allowance {
    address[] public allowance;
    address private owner;

    event AllowanceChanged(address indexed _forWho, address indexed _byWhom, uint _oldAmount, uint _newAmount);

    mapping(address => uint) public accountBeneficiary;

    constructor() {
        owner = msg.sender;
    }

    modifier ownerOrAllowed(address _who)  {
        require(accountBeneficiary[_who] > 0, "This address is already on this wallet, please update it");
        _;
    }

    modifier isOwner {
        require(owner == msg.sender, "You are not the owner");
        _;
    }

    function addAllowance(address _who, uint _amount) public isOwner {
        allowance.push(_who);
        accountBeneficiary[_who] = _amount;
        emit AllowanceChanged(_who, msg.sender, accountBeneficiary[_who], _amount);
    }

    function updateAllowance(address _who, uint _newAmount) public isOwner {
        // - If new amount is 0 so the beneficiary can be deleted
        if(_newAmount == 0) {
            delete accountBeneficiary[_who];
            uint index = findIndexAllowance(_who);
            delete allowance[index];
        }
        else {
            accountBeneficiary[_who] = _newAmount;
        }

        emit AllowanceChanged(_who, msg.sender, accountBeneficiary[_who], _newAmount);
    }

    // - Allow to find the index of allowed address
    function findIndexAllowance(address _who) private view returns(uint) {
        for (uint i = 0; i < allowance.length; i++) {
            if (allowance[i] == _who) {
                return i;
            }
        }
        revert('Not found');
    }
}
