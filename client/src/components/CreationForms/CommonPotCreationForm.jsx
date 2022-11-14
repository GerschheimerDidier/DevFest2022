import React, { useState } from "react";
import Web3 from "web3";
import commonPot from "../../pages/CommonPot/CommonPot";

const CommonPotCreationForm = () => {

    // State
    const [potName, setPotName] = useState("");

    async function createCommonPot() {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const account = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();

        const artifact = require("../../contracts/WalletFactory.json");
        const { abi } = artifact;
        let address;
        try {
            address = artifact.networks[networkID].address;
            console.log(address)
            const factory = new web3.eth.Contract(abi, address);

            console.log('Creating common pot...');
            console.log(factory)
            const result = await factory.methods.createCommonPot().send({ from: account[0] });

            console.log('common pot created');
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form>
            <label>
                Common pot name:
                <input
                    type="text"
                    value={potName}
                    onChange={(e) => setPotName(e.target.value)}
                />
            </label>
            <button type="button" onClick={createCommonPot}>Create common pot</button>
        </form>
    );
}

export default CommonPotCreationForm;
