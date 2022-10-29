import { useEth } from "../../contexts/EthContext";
import web3 from "web3"
import {useState} from "react";

const SharedWallet = () => {

    //*********** USE STATE ***********//
    const [allowanceAddr, setAllowanceAddr] = useState(0);

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { contract, account } = useEth();


    async function getAllowanceWithAddr(){
        const addr = "0x4fe493bE9D13C464329558487B951b1817ed9151";
        try {
            setAllowanceAddr(
                web3.utils.fromWei(
                    await contract.methods.accountBeneficiary(addr).call(),
                    'ether'
                )
            );
        }
        catch (err) {
            console.log(err)
        }
    }

    function addAllowance() {
        try {
            contract.methods.defineAllowance(
                "0x4fe493bE9D13C464329558487B951b1817ed9151",
                web3.utils.toWei('0.002', 'ether'),
            ).send({
                from: account[0],
            });

        }
        catch (err) {
            console.log(err);
        }
    }

    function giveMyMoney() {
        try {
            contract.methods.withdrawMoney(web3.utils.toWei('0.002', 'ether'))
                .send({
                    from: account[0],
                });

        }
        catch (err) {
            console.log(err);
        }
    }

    function sendMoney() {
        try {
            contract.send(web3.utils.toWei('0.003', 'ether'))
            //     {
            //     from: account[0],
            //     value: web3.utils.toWei('2', 'ether')
            // });
        }
        catch (err) {
            console.log(err)
        }

    }

    return (
        <div>
            <h2 className={"text-3xl font-bold underline"}>Le Shared wallet</h2>
            <p> Allowance price => { allowanceAddr } ETH</p>
            <button onClick={ getAllowanceWithAddr }>getAllowanceWithAddr</button>

            <button onClick={ addAllowance } type={"button"}>Ajout Allowance</button>
            <button onClick={ sendMoney } type={"button"}>Send Money on contract</button>
            <button onClick={ giveMyMoney } type={"button"}>Withdraw my money</button>
        </div>



    );
}

export default SharedWallet;
