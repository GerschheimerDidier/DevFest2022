import React, { useState } from "react";
import {Button} from "@mui/material";
import {useEth} from "../../contexts/EthContext";

const CommonPotCreationForm = ({notifyWalletCreated}) => {

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { account, contract } = useEth();

    // State
    const [walletName, setWalletName] = useState("");

    async function createSharedWallet() {
        try {
            console.log('Creating wallet...');
            const result = await contract.methods.createCommonPot().send({ from: account[0] });

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
