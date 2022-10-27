import { useEth } from "../../contexts/EthContext";
import {useEffect} from "react";

const SharedWallet = () => {

    // Permet de récupérer l'abi du smart contract
    // Permet de récupérer l'address du wallet de la personne
    const { contract, accounts } = useEth();
    console.log(contract)
    let allowanceNumber = "";

    function getAllowanceIndex() {
        allowanceNumber = contract.methods.allowance(0);
        console.log(allowanceNumber);
    }

    function addAllowance() {
        try {
            contract.methods.sendTransaction({
                to: accounts,
                from: "0x4fe493bE9D13C464329558487B951b1817ed9151",
                value: 50000000000000000, // 0.05 ETHER
            })
            // contract.methods.defineAllowance("0x32209DbC93Ad507174a68fa92C4C6C941f71c1F5", "10000000").send({ from : accounts });
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <h2>Le Shared wallet</h2>
            <p> Allowance price => { allowanceNumber }</p>
            <button onClick={ getAllowanceIndex }>getAllowanceZero</button>

            <button onClick={ addAllowance }>Ajout Allowance</button>
        </div>



    );
}

export default SharedWallet;
