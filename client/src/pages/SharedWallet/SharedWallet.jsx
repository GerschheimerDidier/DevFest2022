import { useEth } from "../../contexts/EthContext";
import React, { useEffect, useState} from "react";
import './SharedWallet.css';
import web3 from "web3";
import Button from "@mui/material/Button";
import {InputAdornment, TextField} from "@mui/material";

const SharedWallet = () => {

    //*********** USE STATE ***********//
    const [allowanceAddr, setAllowanceAddr] = useState(0);
    const [amountAllowance, setAmountAllowance] = useState(0);
    const [addrAllowance, setAddrAllowance] = useState("");
    const [amountSendContract, setAmountSendContract] = useState(0);
    const [amountGetMoney, setAmountGetMoney] = useState(0);

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { account, contract, state } = useEth();

    useEffect(() => {
        if (!contract || !account) return;
        getMyAllowance()
    }, [contract, account])

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

    const handleAddAllowance = (evt) => {
        evt.preventDefault();
        try
        {
            contract.methods.defineAllowance(
                addrAllowance,
                web3.utils.toWei(amountAllowance, 'ether'),
            ).send({
                from: account[0],
            });

        }
        catch (err)
        {
            console.log(err)
        }
    }

    const handleAddMoneyToContract = (evt) => {
        evt.preventDefault();
        try
        {
            contract.methods.sendMoneyOnWallet().send({
                from: account[0],
                value: web3.utils.toWei(amountSendContract, 'ether'),
            });
        }
        catch (err)
        {
            console.log(err)
        }
    }

    const handleGetMyMoney = (evt) => {
        evt.preventDefault();
        try
        {
            contract.methods.withdrawMoney(
                web3.utils.toWei(amountGetMoney, 'ether')
            )
            .send({
                from: account[0],
            });
        }
        catch (err)
        {
            console.log(err)
        }
    }

    return (
        <div className={"shared-wallet"}>

            <section className={"header-wallet"}>
                <h2>Vous êtes sur le portefeuille partagé entre différentes personnes</h2>
            </section>

            <section className={"section-your-allowance"}>
                <h4>Votre solde disponible => { allowanceAddr } ETH</h4>
            </section>

            <br/>
            <br/>
            <section className={"section-add-allowance"}>
                <form onSubmit={handleAddAllowance}  style={{border: "solid black 1px"}}>
                    <TextField id="outlined-basicTextField " value={amountAllowance} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                                   style: {
                                       margin: 20,
                                       width: 150,
                                   }
                               }}
                               type="number"
                               onChange={e => setAmountAllowance(e.target.value)}
                    />
                    <TextField id="outlined-basicTextField " value={addrAllowance} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">Address</InputAdornment>,
                                   style: {
                                       margin: 20,
                                       width: 300,
                                   }
                               }}
                               type="string"
                               onChange={e => setAddrAllowance(e.target.value)}
                    />
                    <br/>
                    <Button variant="contained" type="submit" >Ajout d'un bénéficiaire avec son montant disponible sur le portefeuille</Button>

                </form>
            </section>
            <br/>
            <br/>
            <section className={"section-send-money-contract"}>
                <form onSubmit={handleAddMoneyToContract}  style={{border: "solid black 1px"}}>
                    <TextField id="outlined-basicTextField " value={amountSendContract} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                                   style: {
                                       margin: 20,
                                       width: 150,
                                   }
                               }}
                               type="number"
                               onChange={e => setAmountSendContract(e.target.value)}
                    />
                    <br/>
                    <Button variant="contained" type="submit" >Ajout d'argent sur le portefeuile</Button>

                </form>
            </section>
            <br/>
            <br/>
            <section className={"section-get-money"}>
                <form onSubmit={handleGetMyMoney}  style={{border: "solid black 1px"}}>
                    <TextField id="outlined-basicTextField " value={amountGetMoney} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                                   style: {
                                       margin: 20,
                                       width: 150,
                                   }
                               }}
                               type="number"
                               onChange={e => setAmountGetMoney(e.target.value)}
                    />
                    <br/>
                    <Button variant="contained" type="submit" >Récupération de mon argent disponible</Button>

                </form>
            </section>
        </div>
    );
}

export default SharedWallet;
