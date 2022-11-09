import { useEth } from "../../contexts/EthContext";
import Web3 from "web3"
import React, { useEffect, useState} from "react";
import './SharedWallet.css';
import { useLocation } from "react-router-dom";

const SharedWallet = () => {

    //*********** USE STATE ***********//
    const [allowanceAddr, setAllowanceAddr] = useState(0);
    const [contract , setContract] = useState(null);
    const location = useLocation();

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { account, state } = useEth();
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

    useEffect(() => {
        const artifact = require("../../contracts/Wallet.json");
        setContract(new web3.eth.Contract(artifact.abi, location.state.address));  // set here address of contract deployed from factory

        getMyAllowance()
    }, [useEth()])

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
                <h2>Vous êtes sur le shared wallet</h2>
            </section>

            <section className={"section-your-allowance"}>
                <h4>Your allowance</h4>
                <p> { allowanceAddr } </p>
                <p>ETH</p>
            </section>

            <br/>
            <br/>
            <section className={"section-add-allowance"}>
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
