// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10 < 0.9.0;

contract Allowance {
    string public walletName;
    address[] public allowance;
    address private owner;

    event AllowanceChanged(address indexed _forWho, address indexed _byWhom, uint _oldAmount, uint _newAmount);

    mapping(address => uint) public accountBeneficiary;

    constructor(string memory _walletName, address _owner) {
        walletName = _walletName;
        owner = _owner;
    }

    modifier isOwner {
        require(owner == msg.sender, "You are not the owner");
        _;
    }

    modifier hasFundOnWallet(address _who) {
        require(accountBeneficiary[_who] >= 0, "You haven't allowance on this wallet");
        _;
    }

    // Create and modify the allowance for the user by owner
    function defineAllowance(address _who, uint _newAmount) public isOwner {
        if(accountBeneficiary[_who] == 0) {
            allowance.push(_who);
        }
        uint oldAmount = accountBeneficiary[_who];

        // - If new amount is 0 so the beneficiary can be deleted
        if(_newAmount == 0) {
            delete accountBeneficiary[_who];
            uint index = findIndexAllowance(_who);
            delete allowance[index];
        }
        else {
            accountBeneficiary[_who] = _newAmount;
        }
        emit AllowanceChanged(_who, msg.sender, oldAmount, accountBeneficiary[_who]);
    }

    // - Allow to update allowance of this user after he withdraws his money
    function updateMyAllowanceWithdrawn(uint _newAmount) internal hasFundOnWallet(msg.sender) {
        uint oldAmount = accountBeneficiary[msg.sender];

        // - If new amount is 0 so the beneficiary can be deleted
        if(_newAmount == 0) {
            delete accountBeneficiary[msg.sender];
            uint index = findIndexAllowance(msg.sender);
            delete allowance[index];
        }
        else {
            accountBeneficiary[msg.sender] = _newAmount;
        }
        emit AllowanceChanged(msg.sender, msg.sender, oldAmount, accountBeneficiary[msg.sender]);
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
