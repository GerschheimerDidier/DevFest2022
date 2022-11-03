// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

//import "./Factory.sol";

interface ISubscription {
    function addWalletToSubscription(address _who, uint8 _walletType) external;

    function removeWalletFromSubscription(address _who) external;
}

contract Subscribable {
    address private factoryAddress;
    uint8 private walletType;

    constructor(address _factoryAddress, uint8 _walletType) {
        factoryAddress = _factoryAddress;
        walletType = _walletType;
    }

    // Subscribe user to this wallet
    function subscribe(address _who) internal {
        ISubscription sub = ISubscription(factoryAddress);
        sub.addWalletToSubscription(_who, walletType);
    }

    // Unsubscribe user from this wallet
    function unsubscribe(address _who) internal {
        ISubscription sub = ISubscription(factoryAddress);
        sub.removeWalletFromSubscription(_who);
    }

    function getFactoryAddress() public view returns (address) {
        return factoryAddress;
    }

    function getWalletType() public view returns (uint8) {
        return walletType;
    }
}
