import { useEth } from "../../contexts/EthContext";
import web3 from "web3"
import { useState } from "react";
import './SharedWallet.css';

const SharedWallet = () => {

    //*********** USE STATE ***********//
    const [allowanceAddr, setAllowanceAddr] = useState(0);

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { contract, account } = useEth();

    async function getMyAllowance() {
        try {
            setAllowanceAddr(
                web3.utils.fromWei(
                    await contract.methods.accountBeneficiary(account[0]).call(),
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
        <div className={"shared-wallet"}>

            <section className={"header-wallet"}>
                <h2>Your Shared wallet</h2>
            </section>

            <section className={"section-your-allowance"}>
                <h4>Your allowance</h4>
                <p> { allowanceAddr } </p>
                <p>ETH</p>
                {/*TODO Retirer le bouton et le faire a la fin du chargement de la page avec la var account load*/}
                <button onClick={ getMyAllowance }>getAllowanceWithAddr</button>
            </section>

            <button onClick={ addAllowance } type={"button"}>Ajout Allowance</button>
            <button onClick={ sendMoney } type={"button"}>Send Money on contract</button>
            <button onClick={ giveMyMoney } type={"button"}>Withdraw my money</button>
        </div>



    );
}

export default SharedWallet;
