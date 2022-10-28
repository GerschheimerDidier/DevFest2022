// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10 < 0.9.0;

import "./Wallet.sol";

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


    function addContractToSubscription(address _who, EWalletType _type) external calledFromDeployedWallet() {

    }

    function removeFromSubscription() external calledFromDeployedWallet() {

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