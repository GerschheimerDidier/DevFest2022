import { useEth } from "../../contexts/EthContext";
import web3 from "web3";
import { useState, useEffect } from "react";
import './CrowdFunding.css';
import Button from '@mui/material/Button';
import {InputAdornment, TextField} from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useLocation } from "react-router-dom";



function CrowdFunding() {
    //*********** USE STATE ***********//
    const [contract , setContract] = useState(null);


    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { web3, account } = useEth();

    const location = useLocation();

    const instance = require("../../contracts/CrdFunding.json");

    //console.log("LOCATION ADD : ", location.state.address);

    

    const [crdfundingAddr, setCrdfundingAddr] = useState(0);


    const [description, refreshDescription] = useState(null);

    const [address, refreshAddress] = useState(null);

    const [fundsReceived, refreshFundsReceived] = useState(null);

    const [crowdFundingBalance, refreshCrowdFundingBalance] = useState(null);

    const [goal, refreshGoal] = useState(null);

    const [endDate, refreshEndDate] = useState(null);

    const [myParticipation, refreshMyParticipation] = useState(null);

    const [allActiveRanks, refreshAllActiveRanks] = useState(null);

    const [deposit, setDeposit] = useState(0);

    const [claimReward, setClaimReward] = useState(false);

    const [rankId, setRankId] = useState(0);

    useEffect(() => {
        refreshAddress(location.pathname.split("/").pop());
        console.log("ADDRESS 00 : ", address);
        setContract(new web3.eth.Contract(instance.abi, address));  // set here address of contract deployed from factory
        _getDescription();
        
        _getTotal();
        _getContractBalance();
        _getGoal();
        _getEndDate();
        _getAllActiveRanks();
    }, [useEth()])

    console.log("CONTRACT : ", contract)
    console.log("BALANCE 1 : ", crowdFundingBalance);

    console.log("ADDRESS 1 : ", address);

    async function _getGoal() {
        try {
            refreshGoal(
                    await contract.methods.getGoal().call({from : account[0]})
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _getAllActiveRanks() {
        try {
            refreshAllActiveRanks(await contract.methods.getAllActiveRanks().call({from : account[0]}));
            console.log("ALL ACTIVE RANKS : ", allActiveRanks);
        }
        catch (err) {
            console.log(err);
        }
    }
    async function _getDescription() {
        try {
                let value = await contract.methods.getDescription().call({from : account[0]});
                // console.log("Value : ", value) 
                refreshDescription(value);
                //console.log(description);
        }
        catch (err) {
            console.log(err);
        }
    }
    async function _getEndDate() {
        try {

            let epoch = (await contract.methods.getEndDate().call({from : account[0]}));

            var date = new Date(epoch * 1000);
            var iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)

            console.log("ISO : ", iso[1] + " | " + iso[2]);
            refreshEndDate(iso[1] + " | " + iso[2]);
        }
        catch (err) {
            console.log(err);
        }
    }
    async function _getMyParticipation() {
        try {
            console.log("MY PARTICIPATION --");
            refreshMyParticipation(await contract.getMyParticipation().call({from : account[0]}));
            console.log("MY PARTICIPATION : ", myParticipation);
        }
        catch (err) {
            console.log(err);
        }
    }
    async function _getRankInfo(id) {
        try {
            setCrdfundingAddr(
                    await contract.methods.getRankInfo()
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function _getTotal() {
        try {
            
                refreshFundsReceived(await contract.methods.getTotal().call({from : account[0]}));
                console.log("FUNDS RECEIVED : ", fundsReceived);
        }
        catch (err) {
            console.log(err);
        }
    }
    async function _getOwner() {
        try {
            setCrdfundingAddr(
                    await contract.methods.owner()
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function _isOwner() {
        try {
            setCrdfundingAddr(
                    await contract.methods.isOwner()
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _getContractBalance() {
        try {

            console.log("ADDRESS 2 : ", address);
            console.log("BALANCE : ", await web3.eth.getBalance(address));
            refreshCrowdFundingBalance(await web3.eth.getBalance(address));
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _createRank(_name, minInvestement, _description, usageNumber) {
        try {
            setCrdfundingAddr(
                    await contract.methods.createRank(_name, minInvestement, _description, usageNumber)
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _editRank(_id, _minimumInvestment, _description, _uses) {
        try {
            setCrdfundingAddr(
                    await contract.methods.editRank(
                        _id,
                        _minimumInvestment,
                        _description,
                        _uses
                    )
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _deactivateRank(_id) {
        try {
            setCrdfundingAddr(
                    await contract.methods.deactivateRank(
                        _id
                    )
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _activateRank(_id) {
        try {
            setCrdfundingAddr(
                    await contract.methods.activateRank(
                        _id
                    )
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _setDescription(_description) {
        try {
            setCrdfundingAddr(
                    await contract.methods.setDescription(
                        _description
                    )
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _sendDonation() {
        try {
            console.log("SEND DONATION : ", rankId, claimReward, account[0], deposit)
            await contract.methods.sendDonation(rankId, claimReward).send({ from : account[0], value : deposit});
            _getContractBalance();
            _getTotal();
            _getMyParticipation();
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _retrieveFunding() {
        try {
            setCrdfundingAddr(
                    await contract.methods.retrieveFunding()
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _requestRefundGoalNotCompleted() {
        try {
            setCrdfundingAddr(
                    await contract.methods.requestRefundGoalNotCompleted()
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _giveUpBenefitsAndParticipation() {
        try {
            setCrdfundingAddr(
                    await contract.methods.giveUpBenefitsAndParticipation()
            );
        }
        catch (err) {
            console.log(err);
        }
    }


    function handleChangeClaimReward(e){
        console.log("EE : ", e)
        if (e==="on" && !claimReward){
            setClaimReward(true);
        }
        else if (e==="off" && claimReward){
            setClaimReward(false);
        }
    }

    function handleChangeRankId (e){
        if(e != rankId){
            setRankId(e);
        }
    }

    function handleChangeDeposit(e){
        if(e != deposit){
            setDeposit(e);
        }
    }


    return (
        
        <div className={"crowdfunding"}>


            <section className={"header-wallet"}>
                <h2>Your CrowdFunding :</h2>
                <br/>
                <br/>
                <h4> Contract address : {address} </h4>
                <h4>Description :</h4>
                <br/>
                <p>  {description} </p>
                <br/>
                <h4> Goal : {goal} </h4>
                <br/>
                <h4> End Date : {endDate} </h4>
            </section>

            <section className="section-your-allowance">
                <h4>Total funds Received : {fundsReceived}</h4>
            </section>  

            <section className="section-your-allowance">
                <h4>Crowdfunding balance : {crowdFundingBalance}</h4>
            </section>     

            <section className="section-your-allowance">
                <h4>My participation : {myParticipation}</h4>
            </section>   

            <section className="section-your-allowance">
                <h4>All active donation ranks : {allActiveRanks}</h4>
            </section>  

            <section className="section-your-allowance">
                <article>
                    <form onSubmit={_sendDonation}>
                        
                        <button onClick={ _sendDonation } type={"button"}>Send Money on contract</button>

                        <TextField id="outlined-basicTextField " value={deposit} variant="standard"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Wei</InputAdornment>,
                                    style: {
                                        marginLeft: 20
                                    }
                                }}
                                type="number"
                                onChange={e => handleChangeDeposit(e.target.value)}
                        />

                        <FormControlLabel
                            control={
                                <Switch checked={claimReward} onChange={e => handleChangeClaimReward(e.target.value)}/>
                            }
                            label="label"
                        />

                        <TextField id="outlined-basicTextField " value={rankId} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">Rank Id</InputAdornment>,
                                   style: {
                                       marginLeft: 20,
                                   }
                               }}
                               type="number"
                               onChange={e => handleChangeRankId(e.target.value)}
                        />
                    </form>
                </article>    
            </section> 


        </div>
    


    );
}

export default CrowdFunding;
