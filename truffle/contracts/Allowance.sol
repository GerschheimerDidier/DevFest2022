// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "./Subscribable.sol";

abstract contract Allowance is Subscribable {
    address[] public allowance;
    address public owner;

    event AllowanceChanged(
        address indexed _forWho,
        address indexed _byWhom,
        uint256 _oldAmount,
        uint256 _newAmount
    );

    mapping(address => uint256) public accountBeneficiary;

    constructor(
        address _owner,
        address _factoryAddress,
        uint8 _walletType
    ) Subscribable(_factoryAddress, _walletType) {
        owner = _owner;
    }

    modifier isOwner() {
        require(owner == msg.sender, "You are not the owner");
        _;
    }

    modifier hasFundOnWallet(address _who) {
        require(
            accountBeneficiary[_who] >= 0,
            "You haven't allowance on this wallet"
        );
        _;
    }

    // Create and modify the allowance for the user by owner
    function defineAllowance(address _who, uint256 _newAmount) public isOwner {
        if (accountBeneficiary[_who] == 0) {
            allowance.push(_who);
            if (getFactoryAddress() != address(0x0)) {
                subscribe(_who);
            }
        }
        uint256 oldAmount = accountBeneficiary[_who];

        // - If new amount is 0 so the beneficiary can be deleted
        if (_newAmount == 0) {
            delete accountBeneficiary[_who];
            uint256 index = findIndexAllowance(_who);
            delete allowance[index];
            if (getFactoryAddress() != address(0x0)) {
                unsubscribe(_who);
            }
        } else {
            accountBeneficiary[_who] = _newAmount;
        }
        emit AllowanceChanged(
            _who,
            msg.sender,
            oldAmount,
            accountBeneficiary[_who]
        );
    }

    // - Allow to update allowance of this user after he withdraws his money
    function updateMyAllowanceWithdrawn(uint256 _newAmount)
        internal
        hasFundOnWallet(msg.sender)
    {
        uint256 oldAmount = accountBeneficiary[msg.sender];

        // - If new amount is 0 so the beneficiary can be deleted
        if (_newAmount == 0) {
            delete accountBeneficiary[msg.sender];
            uint256 index = findIndexAllowance(msg.sender);
            delete allowance[index];
        } else {
            accountBeneficiary[msg.sender] = _newAmount;
        }
        emit AllowanceChanged(
            msg.sender,
            msg.sender,
            oldAmount,
            accountBeneficiary[msg.sender]
        );
    }

    // - Allow to find the index of allowed address
    function findIndexAllowance(address _who) private view returns (uint256) {
        for (uint256 i = 0; i < allowance.length; i++) {
            if (allowance[i] == _who) {
                return i;
            }
        }
        revert("Not found");
    }
}
