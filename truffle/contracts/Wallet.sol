// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import "./Allowance.sol";
import "./Subscribable.sol";

contract Wallet is Allowance, Subscribable {
    event MoneyWithdrawn(address indexed _beneficiary, uint256 _amount);
    event MoneyDeposited(address indexed _from, uint256 _amount);

    constructor(
        string memory _walletName,
        address _owner,
        address _factoryAddress,
        uint8 _walletType
    )
        Allowance(_walletName, _owner)
        Subscribable(_factoryAddress, _walletType)
    {}


    function withdrawMoney(uint256 _amount) public hasFundOnWallet(msg.sender) {
        require(
            address(this).balance >= _amount,
            "not enough funds hab been added on smart contract"
        );
        require(
            accountBeneficiary[msg.sender] >= _amount,
            "not enough funds has been allowed for your account"
        );
        uint256 newAmount = accountBeneficiary[msg.sender] - _amount;


        updateMyAllowanceWithdrawn(newAmount);

        payable(msg.sender).transfer(_amount);
        emit MoneyWithdrawn(msg.sender, _amount);
    }

    function sendMoneyOnWallet() public payable {
        payable(address(this)).transfer(msg.value);
        emit MoneyDeposited(msg.sender, msg.value);
    }

    receive () external payable {
        emit MoneyDeposited(msg.sender, msg.value);
    }

    fallback() external payable {
        emit MoneyDeposited(msg.sender, msg.value);
    }

}
