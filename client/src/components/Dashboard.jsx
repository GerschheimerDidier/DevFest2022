import React, { useState, useEffect } from "react";
import WalletTile from "./WalletTile";
import Web3 from "web3";
import SharedWalletCreationForm from "./CreationForms/SharedWalletCreationForm";
import CrowdfundingCreationForm from "./CreationForms/CrowdfundingCreationForm";

const Dashboard = () => {

    // State
    const [subscriptions, onReceiveSubscriptions] = useState([]);

    useEffect(() => {
        // Fetch subscribed wallets from factory
        retrieveWallets();
    }, [])

    async function createWallet() {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const account = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();


        const artifact = require("../contracts/WalletFactory.json");
        const { abi } = artifact;
        let address;
        try {
            address = artifact.networks[networkID].address;
            const factory = new web3.eth.Contract(abi, address);

            console.log('Creating wallet...');
            const result = await factory.methods.createSharedWallet('Test').send({ from: account[0] });

            console.log('wallet created');
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }

    async function createCrowdfunding() {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const account = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();


        const artifact = require("../contracts/WalletFactory.json");
        const { abi } = artifact;
        let address;
        try {
            address = artifact.networks[networkID].address;
            const factory = new web3.eth.Contract(abi, address);

            console.log('Creating crowdfunding...');
            const result = await factory.methods.createCrowdfunding('Test',10,0).send({ from: account[0] });

            console.log('crowdfunding created');
        } catch (err) {
            console.error(err);
        }
    }

    // Retrieve subscribed wallets from factory
    async function retrieveWallets() {

        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const account = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();

        const artifact = require("../contracts/WalletFactory.json");
        const { abi } = artifact;
        let address, contract;
        try {
            address = artifact.networks[networkID].address;
            const factory = new web3.eth.Contract(abi, address);

            console.log('Retrieving subscriptions...');
            const result = await factory.methods.getSubscriptions().call({from : account[0]});
            onReceiveSubscriptions(result);
            console.log(subscriptions)

        } catch (err) {
            console.error(err);
        }
    }

    // // Called when we receive subscriptions from contract
    // function onReceiveWallets(error, result) {
    //     console.log('Subscription retrieved');
    //     console.log(error);
    //     console.log(result);
    //
    //     this.setState({ wallets: error });
    // }

    return (
        <div>
            <button onClick={createWallet}>Create a Wallet</button>
            <button onClick={createCrowdfunding}>Create a Crowdfunding</button>

            <SharedWalletCreationForm />
            <CrowdfundingCreationForm />
            

            {
                // Ensure user has wallets to display
                subscriptions.length > 0 &&

                <div>
                    <br />
                    <h2>My Wallets ({subscriptions.length})</h2>
                    <div>
                        {
                            // For each wallet
                            subscriptions.map((wallet) => (
                                <WalletTile walletInfo={wallet} />
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default Dashboard;
