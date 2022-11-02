import { useEth } from "../../contexts/EthContext";
import web3 from "web3"
import React, { useState } from "react";
import './SharedWallet.css';
import FormAllowance from './FormAddAllowance';

const SharedWallet = () => {

    //*********** USE STATE ***********//
    const [allowanceAddr, setAllowanceAddr] = useState(0);
    const [addFormLog, setAddFormLog] = useState();

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { contract, account, address } = useEth();

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
                "0xE1fc08B3a333dcAf366D5122B1af9a1b46d00eD3",
                web3.utils.toWei('1', 'ether'),
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
            contract.methods.sendMoneyOnWallet().send({
                from: account[0],
                // to: "0x4074CdC70951bEf1489c13A9Bca035C221cAdeE5",
                value: web3.utils.toWei('2', 'ether'),
            });
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

            <br/>
            <br/>
            <section className={"section-add-allowance"}>
                {/*<FormAllowance addFormLog={setAddFormLog(addFormLog)}/>*/}

                {/*<button onClick={ addAllowance() } type={"button"}>Add Allowance</button>*/}

            </section>

            <br/>
            <br/>
            <button onClick={ addAllowance }>addAllowance</button>
            <button onClick={ sendMoney } type={"button"}>Send Money on contract</button>
            <button onClick={ giveMyMoney } type={"button"}>Withdraw my money</button>
        </div>


    );
}

export default SharedWallet;
