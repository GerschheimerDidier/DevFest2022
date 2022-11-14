import "./Dashboard.css"
import React, {useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import BaseCreationForm from "../../components/CreationForms/BaseCreationForm";
import WalletTile from "../../components/WalletTile";
import { useLocation } from "react-router-dom";
import CommonPotCreationForm from "../../components/CreationForms/CommonPotCreationForm";

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
        if (!contract || !account) return;
        retrieveWallets();
    }, [contract, account])

    // Retrieve subscribed wallets from factory
    async function retrieveWallets() {
        try {
            console.log('Retrieving subscriptions...');
            const result = await contract.methods.getSubscriptions().call({from : account[0]});
            const subscriptions = result.map((s) => {
                return { addr: s[0], type: s[1], date: s[2] }
            }).sort((a, b) => {
                return a.date - b.date;
            });
            console.log(subscriptions);
            onReceiveSubscriptions(subscriptions);

        } catch (err) {
            console.error(err);
        }
    }

    async function onNotified() {
        console.log("notified wallet created");
        await retrieveWallets();
    }

    return (
        <div>
            <BaseCreationForm notifyWalletCreated={onNotified} />

            {
                // Ensure user has wallets to display
                subscriptions.length > 0 &&

                <div>
                    <br />
                    <h2>My Wallets ({subscriptions.length})</h2>
                    <div className="subscriptions-container">
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
