import { useEth } from "../../contexts/EthContext";
import "./CommonPot.css"
import {useState} from "react";
import web3 from "web3";
import Button from '@mui/material/Button';
import {InputAdornment, TextField} from "@mui/material";

function CommonPot() {

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { contract, account, address } = useEth();

    const [balance, setBalance] = useState(-1);
    const [deposit, setDeposit] = useState(0);
    const [payment, setPayment] = useState(0);
    const [addressPayment, setAddressPayment] = useState("");


    const handleDepositSubmit = (evt) => {
        evt.preventDefault();
        try
        {
            contract.methods.addMoneyToContract().send({from: account[0], value: web3.utils.toWei(deposit, 'ether')});
        }
        catch (err)
        {
            console.log(err)
        }
    }

    const handlePayingSubmit = (evt) => {
        evt.preventDefault();
        try
        {
            console.log("Paying..")
            console.log(addressPayment)
            contract.methods.payWithPot(addressPayment, payment).send({from: account[0]});

        }
        catch (err)
        {
            console.log(err)
        }
    }

    const handleWithdraw = (evt) => {
        evt.preventDefault();
        try
        {
            console.log("withdrawing")
            contract.methods.withdraw().send({from: account[0], gas: 5000});
        }
        catch (err)
        {
            console.log(err)
        }
    }

    async function getContractBalance() {
        try
        {
            setBalance(await contract.methods.getCurrentGlobalBalance().call({from: account[0]}));
        }
        catch (err)
        {
            console.log(err)
        }
    }

    return (
        <div className={"common-pot"}>

            <h2>Your common pot : {contract._address} </h2>
            <article>
                <Button variant="contained" onClick={getContractBalance}>Refresh account balance: </Button>
                <TextField id="outlined-basicTextField " value={balance} variant="standard"
                           InputProps={{
                               startAdornment: <InputAdornment position="start">WEI</InputAdornment>,
                               style: {
                                   marginLeft: 20
                               }
                           }}
                />
            </article>
            <article>
                <form onSubmit={handleDepositSubmit}>
                    <Button variant="contained" type="submit" value="">Deposit fund on the pot:</Button>

                    <TextField id="outlined-basicTextField " value={deposit} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                                   style: {
                                       marginLeft: 20
                                   }
                               }}
                               type="number"
                               onChange={e => setDeposit(e.target.value)}
                    />
                </form>
            </article>

            <article>
                <form onSubmit={handlePayingSubmit}>
                    <Button variant="contained" type="submit" value="Pay an address with the pot:">Pay an address with the pot:</Button>

                    <TextField id="outlined-basicTextField " value={payment} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">WEI</InputAdornment>,
                                   style: {
                                       marginLeft: 20,
                                   }
                               }}
                               type="number"
                               onChange={e => setPayment(e.target.value)}
                    />

                    <TextField id="outlined-basicTextField " value={addressPayment} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">Address</InputAdornment>,
                                   style: {
                                       marginLeft: 20,
                                       width: 350
                                   }
                               }}
                               onChange={e => setAddressPayment(e.target.value)}
                    />
                </form>
            </article>

            <article>
                <form onSubmit={handleWithdraw}>
                    <Button type="submit" variant="contained" value="Withdraw fund on the pot:">Withdraw fund on the pot:</Button>
                </form>
            </article>



        </div>

    );
}
export default CommonPot;
