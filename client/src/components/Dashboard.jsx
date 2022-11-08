import React, {useState, useEffect, useCallback} from "react";
import WalletTile from "./WalletTile";
import {useEth} from "../contexts/EthContext";

const Dashboard = () => {

    // State
    // const factoryAddress = 0xa6F768a34Db1164540645113b443B227E5561570;
    const [subscriptions, onReceiveSubscriptions] = useState([]);

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { contract, account, address } = useEth();

    useEffect(() => {
        // Fetch subscribed wallets from factory
        retrieveWallets();
    }, [useEth()])

    async function createWallet() {
        try {
            console.log('Creating wallet...');
            const result = await contract.methods.createSharedWallet('Test').send({ from: account[0] });
            onReceiveSubscriptions(result);
            console.log('wallet created');

        } catch (err) {
            console.error(err);
        }
    }

    async function createCrowdfunding() {
        try {
            console.log('Creating crowdfunding...');
            const result = await contract.methods.createCrowdfunding('Test',10,0).send({ from: account[0] });
            onReceiveSubscriptions(result);
            console.log('crowdfunding created');

        } catch (err) {
            console.error(err);
        }
    }

    // Retrieve subscribed wallets from factory
    async function retrieveWallets() {
        try {
            console.log('Retrieving subscriptions...');
            const result = await contract.methods.getSubscriptions().call({from : account[0]});
            onReceiveSubscriptions(result);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <button onClick={createWallet}>Create a Wallet</button>
            <button onClick={createCrowdfunding}>Create a Crowdfunding</button>

            {   // Ensure user has wallets to display
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
