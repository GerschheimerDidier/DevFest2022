// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import "./Wallet.sol";
import "./CrdFunding.sol";
import "./CommonPot.sol";

contract WalletFactory is ISubscription {
    constructor() {}

    enum EWalletType {
        SHARED_WALLET,
        CROWDFUNDING,
        COMMON_POT
    }

    // Describes a wallet subscription
    struct Subscription {
        address walletAddress;
        EWalletType walletType;
        uint256 dateSubscribed;
    }

    address[] private deployedWallets;
    mapping(address => Subscription[]) private subscriptions;

    // Events
    event WalletCreated(
        address _who,
        address _walletAddress,
        EWalletType _walletType
    );
    event SubscribedToWallet(address _who, address _walletAddress);
    event UnsubscribedFromWallet(address _who, address _walletAddress);

    // Create a Shared Wallet on behalf of user
    function createSharedWallet() external {
        Wallet wallet = new Wallet(
            msg.sender,
            address(this),
            uint8(EWalletType.SHARED_WALLET)
        );
        address walletAddress = address(wallet);

        deployedWallets.push(walletAddress);
        emit WalletCreated(
            msg.sender,
            walletAddress,
            EWalletType.SHARED_WALLET
        );

        createSubscription(
            msg.sender,
            walletAddress,
            EWalletType.SHARED_WALLET
        );
    }

    // Create a Crowdfunding on behalf of user
    function createCrowdfunding(
        string memory _description,
        uint256 _sumGoal,
        uint256 _endDate
    ) external payable {
        CrdFunding crdfunding = new CrdFunding{value: msg.value}(
            msg.sender,
            _description,
            _sumGoal,
            _endDate,
            address(this),
            uint8(EWalletType.CROWDFUNDING)
        );
        address walletAddress = address(crdfunding);

        deployedWallets.push(walletAddress);
        emit WalletCreated(msg.sender, walletAddress, EWalletType.CROWDFUNDING);

        createSubscription(msg.sender, walletAddress, EWalletType.CROWDFUNDING);
    }

    // Create a Common Pot on behalf of user
    function createCommonPot() external {
        CommonPot commonPot = new CommonPot(
            msg.sender,
            address(this),
            uint8(EWalletType.COMMON_POT)
        );
        address walletAddress = address(commonPot);

        deployedWallets.push(walletAddress);
        emit WalletCreated(msg.sender, walletAddress, EWalletType.COMMON_POT);

        createSubscription(msg.sender, walletAddress, EWalletType.COMMON_POT);
    }

    // Subscribe user to wallet
    function addWalletToSubscription(address _who, uint8 _walletType)
        external
        calledFromDeployedWallet
    {
        // ensure user is not already subscribed
        (bool subscribed, ) = findSubscriptionIndex(_who, msg.sender);
        if (subscribed) return; // user already subscribed to this wallet, return

        createSubscription(_who, msg.sender, EWalletType(_walletType));
    }

    // Unsubscribe user from wallet
    function removeWalletFromSubscription(address _who)
        external
        calledFromDeployedWallet
    {
        // ensure user is subscribed
        (bool subscribed, uint256 index) = findSubscriptionIndex(
            _who,
            msg.sender
        );
        if (!subscribed)
            revert("Could not find wallet address in subscriptions");

        // Remove subscription
        Subscription[] storage subs = subscriptions[_who];
        subs[index] = subs[subs.length - 1];
        subs.pop();
    }

    // Create wallet subscription
    function createSubscription(
        address _who,
        address _walletAddress,
        EWalletType _walletType
    ) internal {
        Subscription[] storage subs = subscriptions[_who];
        subs.push(Subscription(_walletAddress, _walletType, block.timestamp));

        emit SubscribedToWallet(_who, _walletAddress);
    }

    // Get user subscriptions
    function getSubscriptions() external view returns (Subscription[] memory) {
        return subscriptions[msg.sender];
    }

    // Finds the index of a wallet user is subscribed to
    function findSubscriptionIndex(address _who, address _walletAddress)
        internal
        view
        returns (bool found, uint256 index)
    {
        Subscription[] memory subs = subscriptions[_who];

        for (uint256 i = 0; i < subs.length; i++) {
            if (subs[i].walletAddress == _walletAddress) {
                return (true, i);
            }
        }

        return (false, 0);
    }

    // Checks if the provided address is a deployed wallet
    function isDeployedWallet(address _addr) public view returns (bool) {
        for (uint256 i = 0; i < deployedWallets.length; i++) {
            if (deployedWallets[i] == _addr) {
                return true;
            }
        }
        return false;
    }

    // Ensure the function can only be called from deployed wallets
    modifier calledFromDeployedWallet() {
        require(
            isDeployedWallet(msg.sender),
            "Can only be called by a deployed wallet"
        );
        _;
    }
}
