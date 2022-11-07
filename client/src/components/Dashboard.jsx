import React, { useState, useEffect } from "react";
import WalletTile from "./WalletTile";
import Web3 from "web3";

const Dashboard = () => {

    // State
    const factoryAddress = 0x36b03F26aDB736e9829F6D9133FEbF6C49279A92;
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
        let address, contract;
        try {
            address = artifact.networks[networkID].address;
            const factory = new web3.eth.Contract(abi, address);

            console.log('Creating wallet...');
            const result = await factory.methods.createSharedWallet('Test').send({ from: account[0], gas: 30000 });

            console.log('wallet created');
            console.log(result);
            // onReceiveSubscriptions(result);


        } catch (err) {
            console.error(err);
        }
    }

    // Retrieve subscribed wallets from factory
    async function  retrieveWallets() {

        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const account = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();

        const artifact = require("../contracts/WalletFactory.json");
        const { abi } = artifact;
        let address, contract;
        try {
            address = artifact.networks[networkID].address;
            const factory = new web3.eth.Contract(abi, address);

            console.log('Retreiving subscriptions...');
            const result = await factory.methods.getSubscriptions().call();

            console.log(result);
            onReceiveSubscriptions(result);


        } catch (err) {
            console.error(err);
        }

        // // Mock
        // setTimeout(() => {
        //     this.onReceiveWallets([
        //         { address: "0x00", type: 0 },
        //         { address: "0x01", type: 2 },
        //         { address: "0x02", type: 1 },
        //     ]);
        // }, 2500);
    }

    // Called when we receive subscriptions from contract
    function onReceiveWallets(error, result) {
        console.log('Subscription retrieved');
        console.log(error);
        console.log(result);

        this.setState({ wallets: error });
    }

    return (
        <div>
            <button onClick={createWallet}>Create a Wallet</button>
            {
                // Ensure user has wallets to display
                subscriptions.length > 0 &&

                <div>
                    <br />
                    <h2>My Wallets ({subscriptions.length})</h2>
                    <div>
                        {
                            // For each wallet
                            this.state.wallets.map(wallet => {
                                return (< WalletTile wallet={wallet} />)
                            })
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default Dashboard;