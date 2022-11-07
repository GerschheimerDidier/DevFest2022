import React, { useState } from "react";
import Web3 from "web3";

const SharedWalletCreationForm = () => {

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
            const result = await factory.methods.createSharedWallet(walletName).send({ from: account[0] });

            console.log('wallet created');
            console.log(result);
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
            </label>
            <button type="button" onClick={createSharedWallet}>Create wallet</button>
        </form>
    );
}

export default SharedWalletCreationForm;
