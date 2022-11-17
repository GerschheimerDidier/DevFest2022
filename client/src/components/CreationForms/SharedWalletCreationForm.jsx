import React from "react";
import {Button} from "@mui/material";
import {useEth} from "../../contexts/EthContext";

const SharedWalletCreationForm = ({notifyWalletCreated}) => {

    const { account, contract } = useEth();

    async function createSharedWallet() {
        try {
            console.log('Creating wallet...');
            const result = await contract.methods.createSharedWallet().send({ from: account[0] });

            console.log('wallet created');
            console.log(result);

            notifyWalletCreated();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form>
            <Button variant={"contained"} type="button" onClick={createSharedWallet}>Create Shared Wallet</Button>
        </form>
    );
}

export default SharedWalletCreationForm;
