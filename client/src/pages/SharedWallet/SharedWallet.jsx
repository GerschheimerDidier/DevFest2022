import { useEth } from "../../contexts/EthContext";
import React, { useEffect, useState} from "react";
import './SharedWallet.css';
import web3 from "web3";
import Button from "@mui/material/Button";
import {InputAdornment, TextField} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SharedWallet = () => {
    const navigate = useNavigate();

    //*********** USE STATE ***********//
    const [allowanceAddr, setAllowanceAddr] = useState(0);
    const [amountAllowance, setAmountAllowance] = useState(0);
    const [addrAllowance, setAddrAllowance] = useState("");
    const [amountSendContract, setAmountSendContract] = useState(0);
    const [amountGetMoney, setAmountGetMoney] = useState(0);
    const [owner, setOwner] = useState(0);
    const [accountConnected, setAccountConnected] = useState(0);

    /*
    ***************     USE ETHEREUM PROVIDER   ***************
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { account, contract } = useEth();

    useEffect(() => {
        if (!contract || !account) return;
        getOwner();
        getMyAllowance();
    }, [contract, account, useEth])

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

    async function getOwner() {
        try {
            setOwner(
                await contract.methods.owner().call(),
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

    function back() {
        navigate(`/`);
    }

    return (
        <div className={"shared-wallet"}>
            <Button variant={"outlined"} onClick={back}>Retour</Button>

            <section className={"header-wallet"}>
                <h2>Vous êtes sur un portefeuille partagé</h2>
            </section>

            <section className={"section-allowance"}>
                <h4>Votre solde disponible : { allowanceAddr } ETH</h4>
                <div className={"button"}>
                    <Button variant="contained" onClick={getMyAllowance} >Rafraichir</Button>
                </div>
            </section>

            {
                owner == account &&

                <section className={"section-add-allowance"}>
                    <form onSubmit={handleAddAllowance}>
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
                        <div className={"button"}>
                            <Button variant="contained" type="submit" >Ajout d'un bénéficiaire avec son montant disponible sur le portefeuille</Button>
                        </div>

                    </form>
                </section>
            }

            <section className={"section-send-money-contract"}>
                <form onSubmit={handleAddMoneyToContract}>
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
                    <div className={"button"}>
                        <Button variant="contained" type="submit" >Ajout d'argent sur le portefeuile</Button>
                    </div>
                </form>
            </section>


            <section className={"section-get-money"}>
                <form onSubmit={handleGetMyMoney}>
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
                    <div className={"button"}>
                        <Button variant="contained" type="submit" >Récupération de mon argent disponible</Button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default SharedWallet;
