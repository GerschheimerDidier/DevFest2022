// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10 < 0.9.0;

import "./Wallet.sol";

interface ISubscription {
    function addWalletToSubscription(address _who, uint8 _walletType) external;
    function removeWalletFromSubscription(address _who, uint8 _walletType) external;
}

contract WalletFactory {

    enum EWalletType { SHARED_WALLET, CROWDFUNDING, COMMON_POT }

    struct Subscription {
        address[] sharedWallets;
        address[] crowdFundings;
        address[] commonPots;
    }

    address[] private deployedWallets;
    mapping(address => Subscription) private subscriptions;

    function createSharedWallet(string memory _walletName) external {
        Wallet wallet = new Wallet(_walletName, msg.sender);
        address walletAddress = address(wallet);

        deployedWallets.push(walletAddress);
        Subscription storage sub = subscriptions[msg.sender];
        sub.sharedWallets.push(walletAddress);
    }

    function createCrowdfunding() external {
        
    }

    function createCommongPot() external {
        
    }

    function addWalletToSubscription(address _who, uint8 _walletType) external calledFromDeployedWallet() {
        Subscription storage sub = subscriptions[_who];
        
        if (_walletType == uint8(EWalletType.SHARED_WALLET)) sub.sharedWallets.push(msg.sender);
        else if (_walletType == uint8(EWalletType.SHARED_WALLET)) sub.sharedWallets.push(msg.sender);
        else if (_walletType == uint8(EWalletType.SHARED_WALLET)) sub.sharedWallets.push(msg.sender);
        else revert("Unknown wallet type");
    }

    function removeWalletFromSubscription(address _who, uint8 _walletType) external calledFromDeployedWallet() {
        Subscription storage sub = subscriptions[_who];
        
        if (_walletType == uint8(EWalletType.SHARED_WALLET)) sub.sharedWallets.push(msg.sender);
        else if (_walletType == uint8(EWalletType.SHARED_WALLET)) sub.sharedWallets.push(msg.sender);
        else if (_walletType == uint8(EWalletType.SHARED_WALLET)) sub.sharedWallets.push(msg.sender);
        else revert("Unknown wallet type");
    }

    function getSubscription() external view returns(Subscription memory) {
        return subscriptions[msg.sender];
    }

    function isDeployedWallet(address _addr) public view returns(bool) {
        for (uint i = 0; i < deployedWallets.length; i++) {
            if (deployedWallets[i] == _addr) {
                return true;
            }
        }
        return false;
    }

    modifier calledFromDeployedWallet() {
        require(isDeployedWallet(msg.sender), "Can only be called by a deployed wallet");
        _;
    }

}