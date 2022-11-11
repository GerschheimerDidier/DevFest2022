import React, {useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import SharedWalletCreationForm from "../../components/CreationForms/SharedWalletCreationForm";
import CrowdfundingCreationForm from "../../components/CreationForms/CrowdfundingCreationForm";
import WalletTile from "../../components/WalletTile";
import { useLocation } from "react-router-dom";

const Dashboard = () => {

    const location = useLocation();

    // State
    const [subscriptions, onReceiveSubscriptions] = useState([]);
    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { account, contract, address } = useEth();

    useEffect(() => {
        // Fetch subscribed wallets from factory
        if (!contract) return;
        console.log(contract);
        retrieveWallets();
    }, [contract])

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
                            subscriptions.map((wallet, index) => (
                                <WalletTile walletInfo={wallet} key={index}/>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default Dashboard;
