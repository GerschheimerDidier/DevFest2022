import React, { useState } from "react";
import Web3 from "web3";
import {Button} from "@mui/material";
import {useEth} from "../../contexts/EthContext";

const SharedWalletCreationForm = ({notifyWalletCreated}) => {

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
            const result = await contract.methods.createSharedWallet(walletName).send({ from: account[0] });

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
                Wallet name:
                <input
                    type="text"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                />
            </label><br />
            <Button variant={"contained"} type="button" onClick={createSharedWallet}>Create Shared Wallet</Button>
        </form>
    );
}

export default SharedWalletCreationForm;
