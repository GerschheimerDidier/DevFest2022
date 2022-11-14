import React, { useState } from "react";
import Web3 from "web3";
import {Button} from "@mui/material";

const CommonPotCreationForm = ({notifyWalletCreated}) => {

    // State
    const [walletName, setWalletName] = useState("");

    async function createSharedWallet() {

        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const account = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();

        const artifact = require("../../contracts/WalletFactory.json");
        const { abi } = artifact;
        let address;
        try {
            address = artifact.networks[networkID].address;

            const factory = new web3.eth.Contract(abi, address);

            console.log('Creating wallet...');
            const result = await factory.methods.createCommonPot().send({ from: account[0] });

            console.log('wallet created');
            console.log(result);

            notifyWalletCreated();

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form>
            <Button variant={"contained"}  type="button" onClick={createSharedWallet} style={{"marginTop": "20px"}}>Create Common Pot Wallet</Button>
        </form>
    );
}

export default CommonPotCreationForm;
