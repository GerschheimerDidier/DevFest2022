import { useEth } from "../../contexts/EthContext";
import web3 from "web3";
import React, { useState, useEffect } from "react";
import './CrowdFunding.css';
import { InputAdornment, TextField, TextareaAutosize } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import RankTile from "../../components/RankTile";
import Button from "@mui/material/Button";

function CrowdFunding() {

    const navigate = useNavigate();

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { account, contract } = useEth();

    const location = useLocation();

    const [crdfundingAddr, setCrdfundingAddr] = useState(0);

    const [description, refreshDescription] = useState(null);

    const [address, refreshAddress] = useState("");

    const [fundsReceived, refreshFundsReceived] = useState(null);

    const [crowdFundingBalance, refreshCrowdFundingBalance] = useState(0);

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

            const balance = await contract.methods.getGoal().call({from: account[0]});
            refreshGoal(Number(web3.utils.fromWei(balance)));

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

    function back() {
        navigate(`/`);
    }

    return (
        <main>
            <div className={"back-button"}>
                <Button variant={"contained"} onClick={back}>Retour</Button>
            </div>

            <div >

                <h1 className={"crowdfunding-title"}>CrowdFunding</h1>
                <label className={"crowdfunding-title"}> Adresse de votre financement participatif : {address}</label>
                <label className={"crowdfunding-title"}> {description}</label>

                <section className={"crowdfunding-introduction"}>
                    <div className={"item-card"}>
                        <label> Objectif :  </label>
                        <label> {goal} ETH </label>
                    </div>
                    <div className={"item-card"}>
                        <label> Date de fin :  </label>
                        <label> {endDate} </label>
                    </div>
                    <div className={"item-card"}>
                        <label> Propriétaire :  </label>
                        <label> {owner} </label>
                    </div>
                    <div className={"item-card"}>
                        <label> Total des contributions :  </label>
                        <label> {fundsReceived} ETH </label>
                    </div>
                    <div className={"item-card"}>
                        <label> Crowdfunding balance :   </label>
                        <label> {crowdFundingBalance} ETH </label>
                    </div>
                    <div className={"item-card"}>
                        <label>My participation : </label>
                        <label>{myParticipation} ETH</label>
                    </div>
                </section>

                <section className={"crowdfunding-participation"}>
                    <div className={"item-card"}>
                        <label>Liste des rétributions:</label>
                        <button onClick={ _getAllActiveRanks } type={"button"}>Refresh</button>
                    </div>
                    <div>
                        {
                            // For each wallet
                            allActiveRanks.map((rank) => (
                                <RankTile key={rank.id} rankInfo={rank} address={address} />
                            ))
                        }
                    </div>
                </section>

                <section className={"crowdfunding-owner"}>
                        <div>
                            {/* todo passer le deposit de wei a ether */}
                            <Button variant="contained" type="submit" value="">Donner</Button>
                            <TextField value={deposit} variant="standard"
                                       InputProps={{
                                           startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
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
                        </div>

                </section>

                <section className={"rank-handle"}>
                    <div className={"spacer"}>
                        <form>

                            <Button variant="contained" onClick={ _createRank } type={"button"}>Create Rank</Button>


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
                    </div>

                    <div className={"spacer"}>
                        <form>
                            <Button variant="contained" onClick={ _editRank } type={"button"}>Edit Rank</Button>

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
                    </div>

                    <div className={"spacer"}>
                        <form>

                            <Button variant="contained" onClick={ _deactivateRank } type={"button"}>Deactivate Rank</Button>


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
                    </div>

                    <div className={"spacer"}>
                        <form>
                            <Button variant="contained" onClick={ _activateRank } type={"button"}>Activate Rank</Button>
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
                    </div>

                    <div className={"spacer"}>
                        <form>
                            <div className={"height-control"}>
                                <Button variant="contained" onClick={ _setDescription } type={"button"}>Set new description</Button>
                            </div>
                            <TextareaAutosize
                                aria-label="New Description"
                                minRows={3}
                                placeholder="new description"
                                style={{ width: 1200, height: 150 }}
                                onChange={e => setNewDescription(e.target.value)}
                                />
                        </form>
                    </div>
                </section>

                    <div className={"refresh"}>
                        <span className={"spacer"}>
                            <Button variant="contained" onClick={ _getMyParticipation } type={"button"} >Actualiser ma participation</Button>
                        </span>
                        <span className={"spacer"}>
                            <Button variant="contained" onClick={ _retrieveFunding } type={"button"}>Récupérer mes fonds</Button>
                        </span>
                        <span className={"spacer"}>
                            <Button variant="contained" onClick={ _requestRefundGoalNotCompleted } type={"button"}>Demander un remboursement</Button>
                        </span>
                        <span className={"spacer"}>
                            <Button variant="contained" onClick={ _giveUpBenefitsAndParticipation } type={"button"}>Abandonner le projet et ces bénéfices</Button>
                        </span>


                    </div>

            </div>
        </main>


    );
}

export default CrowdFunding;
