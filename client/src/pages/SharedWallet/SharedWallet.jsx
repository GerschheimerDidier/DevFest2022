import { useEth } from "../../contexts/EthContext";
import web3 from "web3"

const SharedWallet = () => {

    // Permet de récupérer l'abi du smart contract
    // Permet de récupérer l'address du wallet de la personne
    const { contract, account } = useEth();
    // console.log("contracts => ",contract)
    let allowanceNumber = "";

    function getAllowanceIndex() {
        // const addr = "0x4fe493bE9D13C464329558487B951b1817ed9151";
        // allowanceNumber = contract.methods.accountBeneficiary(addr);
        // allowanceNumber.then((res) => {
        //     console.log(res.value);
        // });
    }

    function addAllowance() {
        try {
            contract.methods.defineAllowance(
                "0x4fe493bE9D13C464329558487B951b1817ed9151",
                web3.utils.toWei('2', 'ether'),
            ).send({
                from: account[0],
            });

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

            <button onClick={ addAllowance } type={"button"}>Ajout Allowance</button>
        </div>



    );
}

export default SharedWallet;
