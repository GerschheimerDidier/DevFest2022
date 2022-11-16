import React, { useState} from "react";
import {Button} from "@mui/material";
import {useEth} from "../../contexts/EthContext";
import web3 from "web3";

const CrowdfundingCreationForm = ({notifyWalletCreated}) => {

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { account, contract } = useEth();

    // State
    const [description, setDescription] = useState("");
    const [goal, setGoal] = useState(0);
    const [endDate, setEndDate] = useState(Date.now);
    const [endDateEpoch, setEndDateEpoch] = useState((Date.now).valueOf()/1000);

    async function createCrowdfunding() {
        try {
            console.log('Creating crowdfunding wallet...');
            const result = await contract.methods.createCrowdfunding(
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
                    onChange={(e) => {const d = e.target.value.split("-"); 
                                        const epoch = (new Date(d[0], d[1] - 1, d[2])).valueOf()/1000;
                                        setEndDate(e.target.value);
                                        setEndDateEpoch(epoch)}}
                />
            </label><br />

            <Button variant={"contained"} type="button" onClick={createCrowdfunding}>Create CrowdFunding Wallet</Button>
        </form>
    );
}

export default CrowdfundingCreationForm;
