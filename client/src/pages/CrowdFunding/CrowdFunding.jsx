import { useEth } from "../../contexts/EthContext";
import web3 from "web3";
import { useState, useEffect } from "react";
import './CrowdFunding.css';
import Button from '@mui/material/Button';
import {InputAdornment, TextField, TextareaAutosize, Select, MenuItem} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useLocation } from "react-router-dom";
import RankTile from "../../components/RankTile";



function CrowdFunding() {
    //*********** USE STATE ***********//
    // const [contract , setContract] = useState(null);

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { account, contract, state } = useEth();

    const location = useLocation();

    // const instance = require("../../contracts/CrdFunding.json");

    const [crdfundingAddr, setCrdfundingAddr] = useState(0);


    const [description, refreshDescription] = useState(null);

    const [address, refreshAddress] = useState("");

    const [fundsReceived, refreshFundsReceived] = useState(null);

    const [crowdFundingBalance, refreshCrowdFundingBalance] = useState(null);

    const [goal, refreshGoal] = useState(null);

    const [endDate, refreshEndDate] = useState(null);

    const [myParticipation, refreshMyParticipation] = useState(null);

    const [allActiveRanks, refreshAllActiveRanks] = useState([]);

    const [deposit, setDeposit] = useState(0);

    const [claimReward, setClaimReward] = useState(false);

    const [rankId, setRankId] = useState(0);

    const [isOwner, setIsOwner] = useState(false);

    const [owner, setOwner] = useState(null);

    const [retrievingResult, setRetrievingResult] = useState("");

    const [giveUpResult, setGiveUpResult] = useState("");

    const [requestRefundResult, setRequestRefundResult] = useState("");

    const [newDescription, setNewDescription] = useState("");

    const [rankToCreateName, setRankToCreateName] = useState("");

    const [rankToCreateMinimumPart, setRankToCreateMinimumPart] = useState(0);

    const [rankToCreateDescription, setRankToCreateDescription] = useState("");

    const [rankToCreateUses, setRankToCreateUses] = useState(-1);

    const [rankToEditId, setrankToEditId] = useState(0);

    const [rankToEditMinimumPart, setrankToEditMinimumPart] = useState(0);

    const [rankToEditDescription, setrankToEditDescription] = useState("");

    const [rankToEditUses, setrankToEditUses] = useState(-1);

    const [rankToDeactivateId, setrankToDeactivateId] = useState(0);

    const [rankToActivateId, setrankToActivateId] = useState(0);

    useEffect(() => {
        if (!contract || !account){return}
        refreshAddress(location.pathname.split("/").pop());
        console.log("ADDRESS 00 : ", address);
        //setContract(new web3.eth.Contract(instance.abi, address));  // set here address of contract deployed from factory
        _getDescription();
        _getOwner();
        _getTotal();
        _getContractBalance();
        _getGoal();
        _getEndDate();
        _getAllActiveRanks();
        _getMyParticipation();
    }, [contract, account])

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
            refreshMyParticipation(await contract.methods.getMyParticipation().call({from : account[0]}));
            console.log("MY PARTICIPATION : ", myParticipation);
        }
        catch (err) {
            console.log(err);
        }
    }
    async function _getRankInfo(id) {
        try {

          
            return await contract.methods.getRankInfo(id).call({from : account[0]});

            
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
            setOwner(
                    await contract.methods.owner().call({from : account[0]})
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function _isOwner() {
        try {
            setCrdfundingAddr(
                    await contract.methods.isOwner().call({from: account[0]})
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

    async function _createRank() {
        try {
           
            await contract.methods.createRank(rankToCreateName, rankToCreateMinimumPart, rankToCreateDescription, rankToCreateUses).send({from : account[0]})

            _getAllActiveRanks();
          
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _editRank() {
        try {
            
            await contract.methods.editRank(
                rankToEditId,
                rankToEditMinimumPart,
                rankToEditDescription,
                rankToEditUses
            );
            _getAllActiveRanks();
           
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _deactivateRank() {
        try {
            
                    await contract.methods.deactivateRank(
                        rankToDeactivateId
                    ).send({from : account[0]});
            
            _getAllActiveRanks();
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _activateRank() {
        try {
            
                    await contract.methods.activateRank(
                        rankToActivateId
                    ).send({from : account[0]});
            
            _getAllActiveRanks();
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _setDescription() {
        try {
            console.log("SEND 1")
            setCrdfundingAddr(
                    await contract.methods.setDescription(
                        newDescription
                    ).send({from : account[0]})
            );
            //_getDescription();
        }
        catch (err) {
            console.log(err);
        }
    }

    async function _sendDonation() {
        try {
            console.log("SEND 2")
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
            console.log("SEND 3")
                const result = await contract.methods.retrieveFunding().send({from : account[0]})
                console.log("RETRIEVE : ", result);
                setRetrievingResult(result);

        }
        catch (err) {
            console.log(err);
        }
    }

    async function _requestRefundGoalNotCompleted() {
        try {
            console.log("SEND 3")
                const result = await contract.methods.requestRefundGoalNotCompleted().send({from : account[0]})
                console.log("REFUND : ", result);
                setRequestRefundResult(result);

        }
        catch (err) {
            console.log(err);
        }
    }

    async function _giveUpBenefitsAndParticipation() {
        try {
            console.log("SEND 3")
                const result = await contract.methods.giveUpBenefitsAndParticipation().send({from : account[0]})
                console.log("GIVEUP : ", result);
                setGiveUpResult(result);

        }
        catch (err) {
            console.log(err);
        }
    }


    function handleChangeClaimReward(e){

        setClaimReward(e);

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

    function handleChangeNewDescription(e){
        
        console.log("NEW DESCC : ", e)
        setNewDescription(e);

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
                <br/>
                <h4> Owner : {owner} </h4>
            </section>

            <section className="section-your-allowance">
                <h4>Total funds Received : {fundsReceived}</h4>
            </section>  

            <section className="section-your-allowance">
                <h4>Crowdfunding balance : {crowdFundingBalance}</h4>
            </section>     

            <section className="section-your-allowance">
                <button onClick={ _getMyParticipation } type={"button"}>Refresh</button>
                <h4>My participation : {myParticipation}</h4>
            </section>   

            <section className="section-your-allowance">
                <button onClick={ _getAllActiveRanks } type={"button"}>Refresh</button>
                <h4>All active donation ranks : {allActiveRanks}</h4>
            </section> 

            <section>
                <div>
                {
                            // For each wallet
                            allActiveRanks.map((rank) => (
                                <RankTile key={rank.id} rankInfo={rank} address={address} />
                            ))
                        }
                </div>
            </section> 

            <section className="section-your-allowance">
                <article>
                    <form>
                        
                        <button onClick={ _sendDonation } type={"button"}>Send Donnation</button>

            

                        <TextField value={deposit} variant="standard"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Wei</InputAdornment>,
                                    style: {
                                        marginLeft: 20
                                    }
                                }}
                                type="number"
                                onChange={e => handleChangeDeposit(e.target.value)}
                        />


                        <TextField value={rankId} variant="standard"
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

            <section className="section-your-allowance">
                <h4>_createRank :</h4>

                <article>
                    <form>
                        
                        <button onClick={ _createRank } type={"button"}>Create Rank</button>


                        <TextField value={rankToCreateName} variant="standard"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Name</InputAdornment>,
                                    style: {
                                        marginLeft: 20
                                    }
                                }}
                                type="text"
                                onChange={e => setRankToCreateName(e.target.value)}
                        />

                        <TextField value={rankToCreateMinimumPart} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">Minimum doonnation</InputAdornment>,
                                   style: {
                                       marginLeft: 20,
                                   }
                               }}
                               type="number"
                               onChange={e => setRankToCreateMinimumPart(e.target.value)}
                        />
                        
                        <TextField value={rankToCreateDescription} variant="standard"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Description</InputAdornment>,
                                    style: {
                                        marginLeft: 20
                                    }
                                }}
                                type="text"
                                onChange={e => setRankToCreateDescription(e.target.value)}
                        />

                        <TextField value={rankToCreateUses} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">uses (-1 for no limit)</InputAdornment>,
                                   style: {
                                       marginLeft: 20,
                                   }
                               }}
                               type="number"
                               onChange={e => setRankToCreateUses(e.target.value)}
                        />
                    </form>
                </article>   
            </section> 

            <section className="section-your-allowance">
                <h4>_editRank : </h4>

                <article>
                    <form>
                        
                        <button onClick={ _editRank } type={"button"}>Edit Rank</button>


                        <TextField value={rankToEditId} variant="standard"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Id</InputAdornment>,
                                    style: {
                                        marginLeft: 20
                                    }
                                }}
                                type="number"
                                onChange={e => setrankToEditId(e.target.value)}
                        />

                        <TextField value={rankToEditMinimumPart} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">Minimum doonnation</InputAdornment>,
                                   style: {
                                       marginLeft: 20,
                                   }
                               }}
                               type="number"
                               onChange={e => setrankToEditMinimumPart(e.target.value)}
                        />
                        
                        <TextField value={rankToEditDescription} variant="standard"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Description</InputAdornment>,
                                    style: {
                                        marginLeft: 20
                                    }
                                }}
                                type="text"
                                onChange={e => setrankToEditDescription(e.target.value)}
                        />

                        <TextField value={rankToEditUses} variant="standard"
                               InputProps={{
                                   startAdornment: <InputAdornment position="start">uses (-1 for no limit)</InputAdornment>,
                                   style: {
                                       marginLeft: 20,
                                   }
                               }}
                               type="number"
                               onChange={e => setrankToEditUses(e.target.value)}
                        />
                    </form>
                </article>   

            </section> 

            <section className="section-your-allowance">
                <h4>_deactivateRank : </h4>

                <article>
                    <form>
                        
                        <button onClick={ _deactivateRank } type={"button"}>Deactivate Rank</button>


                        <TextField value={rankToDeactivateId} variant="standard"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Id</InputAdornment>,
                                    style: {
                                        marginLeft: 20
                                    }
                                }}
                                type="number"
                                onChange={e => setrankToDeactivateId(e.target.value)}
                        />
                    </form>
                </article>   
            </section> 

            <section className="section-your-allowance">
                <h4>_activateRank : </h4>

                <article>
                    <form>
                        
                        <button onClick={ _activateRank } type={"button"}>Activate Rank</button>


                        <TextField value={rankToActivateId} variant="standard"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Id</InputAdornment>,
                                    style: {
                                        marginLeft: 20
                                    }
                                }}
                                type="number"
                                onChange={e => setrankToActivateId(e.target.value)}
                        />
                    </form>
                </article>   
            </section> 

            <section className="section-your-allowance">
                <form>

                    <button onClick={ _setDescription } type={"button"}>Set new description</button>
                    
                    <TextareaAutosize
                        aria-label="New Description"
                        minRows={3}
                        placeholder="new description"
                        style={{ width: 200 }}
                        onChange={e => setNewDescription(e.target.value)}
                        />
                    



                </form>
                            </section> 

            <section className="section-your-allowance">
                <button onClick={ _retrieveFunding } type={"button"}>Retrieve Funding</button>
                <h4>Result : {retrievingResult}</h4>
            </section> 

            <section className="section-your-allowance">
                <button onClick={ _requestRefundGoalNotCompleted } type={"button"}>Request Refund</button>
                <h4>_requestRefundGoalNotCompleted : {requestRefundResult}</h4>
            </section> 

            <section className="section-your-allowance">
                <button onClick={ _giveUpBenefitsAndParticipation } type={"button"}>Give Up Following and Benefices</button>
                <h4>_giveUpBenefitsAndParticipation : {giveUpResult}</h4>
            </section> 


        </div>
    


    );
}

export default CrowdFunding;
