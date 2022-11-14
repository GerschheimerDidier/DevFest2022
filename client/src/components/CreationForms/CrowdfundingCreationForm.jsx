import React, { useState, useEffect } from "react";
import Web3 from "web3";

const CrowdfundingCreationForm = ({notifyWalletCreated}) => {

    // State
    const [description, setDescription] = useState("");
    const [goal, setGoal] = useState(0);
    const [endDate, setEndDate] = useState(Date.now);

    async function createCrowdfunding() {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const account = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();

        const artifact = require("../../contracts/WalletFactory.json");
        const { abi } = artifact;
        let address;
        try {
            address = artifact.networks[networkID].address;
            const factory = new web3.eth.Contract(abi, address);

            console.log('Creating crowdfunding wallet...');
            const result = await factory.methods.createCrowdfunding(
                description,
                web3.utils.toWei(goal, 'ether'),
                new Date(endDate).getTime()
            ).send({ from: account[0] });

            console.log('wallet created');
            console.log(result);

            notifyWalletCreated();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form>
            <label>
                Description:
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label><br />

            <label>
                Goal:
                <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                />
                ETH
            </label><br />

            <label>
                End date:
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </label><br />

            <button type="button" onClick={createCrowdfunding}>Create CrowdFunding Wallet</button>
        </form>
    );
}

export default CrowdfundingCreationForm;
