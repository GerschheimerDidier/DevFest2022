import { useEth } from "../../contexts/EthContext";
import "./CommonPot.css"
import {useState} from "react";

function CommonPot() {

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { contract, account } = useEth();

    const [balance, setBalance] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [payment, setPayment] = useState(0);
    const [addressPayment, setAddressPayment] = useState("");


    const handleDepositSubmit = (evt) => {
        evt.preventDefault();
        alert(`Submitting deposit ${deposit}`)
    }

    const handlePayingSubmit = (evt) => {
        evt.preventDefault();
        alert(`Submitting payment ${payment} to ${addressPayment}`)
    }

    const handleWithdraw = (evt) => {
        evt.preventDefault();
        alert(`Submitting withdraw`)
    }

    async function getContractBalance() {
        try
        {
            setBalance(await contract.methods.getCurrentGlobalBalance().call())
        }
        catch (err)
        {
            console.log(err)
        }
    }

    return (
        <div className={"common-pot"}>

            <h2>Your common pot : "common pot addr"</h2>
            <div>
                <button onClick={getContractBalance}>Refresh account balance: </button>
                <label>{balance} ETH</label>
            </div>
            <div>
                <form onSubmit={handleDepositSubmit}>
                    <input type="submit" value="Deposit fund on the pot:" />

                    <label>
                        <input  type="number"
                                value={deposit}
                                onChange={e => setDeposit(e.target.value)} />
                    </label>
                    <label>ETH</label>
                </form>
            </div>

            <div>
                <form onSubmit={handlePayingSubmit}>
                    <input type="submit" value="Pay an address with the pot:" />

                    <label>
                        <input  type="number"
                                value={payment}
                                onChange={e => setPayment(e.target.value)} />
                    </label>
                    <label>ETH</label>
                    <label>
                        <input  type="text"
                                value={addressPayment}
                                onChange={e => setAddressPayment(e.target.value)} />
                        the address to pay to.
                    </label>
                </form>
            </div>

            <div>
                <form onSubmit={handleWithdraw}>
                    <input type="submit" value="Withdraw fund on the pot:" />
                </form>
            </div>



        </div>

    );
}
export default CommonPot;
