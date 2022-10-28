// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10 < 0.9.0;

import "./Wallet.sol";

contract Subscribable {

    address private factoryAddress;
    uint8 private walletType;

    constructor(address _factoryAddress, uint8 _walletType) {

    }

}