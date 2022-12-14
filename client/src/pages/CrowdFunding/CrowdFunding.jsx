import { useEth } from "../../contexts/EthContext";
import web3 from "web3";
import React, { useState, useEffect } from "react";
import './CrowdFunding.css';
import { InputAdornment, TextField, TextareaAutosize } from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import RankTile from "../../components/RankTile";
import Button from "@mui/material/Button";
import {BigNumber} from "@ethersproject/bignumber";


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



    const [goal, refreshGoal] = useState(null);

    const [endDate, refreshEndDate] = useState(null);

    const [myParticipation, refreshMyParticipation] = useState({donations: [], totalClaimable : "0"});

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
        _getGoal();
        _getEndDate();
        _getAllActiveRanks();
        _getMyParticipation();
        _isOwner();
    }, [contract, account])

    console.log("CONTRACT : ", contract)

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
            var date = new Date(epoch * 1);
            var iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
    
            refreshEndDate(iso[1]);
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
            
                refreshFundsReceived(Number(web3.utils.fromWei(await contract.methods.getTotal().call({from : account[0]}))));
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
            setIsOwner(
                    await contract.methods.isOwner().call({from: account[0]})
            );
        }
        catch (err) {
            console.log(err);
        }
    }


    async function _createRank() {
        try {
           
            await contract.methods.createRank(rankToCreateName, BigNumber.from(web3.utils.toWei(rankToCreateMinimumPart, "ether")), rankToCreateDescription, rankToCreateUses).send({from : account[0]})

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
                BigNumber.from(web3.utils.toWei(rankToEditMinimumPart, "ether")),
                rankToEditDescription,
                rankToEditUses
            ).send({from : account[0]});
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
            await contract.methods.sendDonation(rankId, claimReward).send({ from : account[0], value : web3.utils.toWei(deposit, "ether")});
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


    function resetInputPreview(){

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


    function back() {
        navigate(`/`);
    }

    return (
        <main>
            <div className={"back-button"}>
                <Button variant={"contained"} onClick={back}>Retour</Button>
            </div>

            <div >
                <div className={"shadow-wrap"}>
                    <h1 className={"crowdfunding-title"}>CrowdFunding</h1>
                    <h3 className={"crowdfunding-title"}> Adresse de votre financement participatif : {address}</h3>
                    <label className={"crowdfunding-title"}> {description}</label>

                </div>

                <div className={"shadow-wrap"}>

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
                            <label> Propri??taire :  </label>
                            <label> {owner} </label>
                        </div>
                        <div className={"item-card"}>
                            <label> Total des contributions :  </label>
                            <label> {fundsReceived} ETH </label>
                        </div>
                        <div className={"item-card"}>
                            <label>Ma participation : </label>
                            <label>{(web3.utils.fromWei(myParticipation[Object.keys(myParticipation)[Object.keys(myParticipation).length - 1]]))} ETH</label>
                        </div>
                </section>

                <section className={"crowdfunding-participation"}>
                    <div className={"item-card"}>
                        <label className={"marge-bott"} >Liste des r??tributions:</label> 
                        
                        <Button variant="contained" onClick={ _getAllActiveRanks } type={"button"}>Refresh</Button>
                    </div>
                    <div className="item-elem">
                        {
                            // For each wallet
                            allActiveRanks.map((rank) => (
                                <RankTile key={rank.id} rankInfo={rank} address={address} />
                            ))
                        }
                    </div>
                </section>

                </div>

                <div className={"shadow-wrap"}>
                    <section className={"crowdfunding-owner"}>
                            <div>
                                <Button variant="contained" onClick={ _sendDonation } type={"button"}>Donner</Button>
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
                                            startAdornment: <InputAdornment position="start">Num??ro de rang</InputAdornment>,
                                            style: {
                                                marginLeft: 20,
                                            }
                                        }}
                                        type="number"
                                        onChange={e => handleChangeRankId(e.target.value)}
                                />
                            </div>

                    </section>

                    <section className={"crowdfunding-owner"}>
                        <h4>Liste de mes dons</h4>
                            <div className={"item-elem"}>
                                {
                                    myParticipation.donations.map((don, index) => <div className={"card-donation"}>Don {index + 1} <br/>Valeur : {Number(web3.utils.fromWei(don.amount))} ETH<br/>R??tribution associ??e : {don.rankName}<br/></div>)
                                }
                            </div>

                    </section>
                </div>

                <div className={"shadow-wrap"}>
                    {isOwner &&
                    <section className={"rank-handle"}>
                        <div className={"spacer"}>
                            <form>

                                <Button variant="contained" onClick={ _createRank } type={"button"}>Cr??er un rang</Button>


                                <TextField value={rankToCreateName} variant="standard"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">Nom:</InputAdornment>,
                                            style: {
                                                marginLeft: 20
                                            }
                                        }}
                                        type="text"
                                        onChange={e => setRankToCreateName(e.target.value)}
                                />

                                <TextField value={rankToCreateMinimumPart} variant="standard"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Donation minimum</InputAdornment>,
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
                                        startAdornment: <InputAdornment position="start">Nombre de place (-1 pour illimit??)</InputAdornment>,
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
                                <Button variant="contained" onClick={ _editRank } type={"button"}>Editer un rang</Button>

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
                                        startAdornment: <InputAdornment position="start">Donation minimum</InputAdornment>,
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
                                        startAdornment: <InputAdornment position="start">Nombre de place (-1 pour illimit??)</InputAdornment>,
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

                                <Button variant="contained" onClick={ _deactivateRank } type={"button"}>D??sactiver un rang</Button>


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
                                <Button variant="contained" onClick={ _activateRank } type={"button"}>Activer un rang</Button>
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
                                    <Button variant="contained" onClick={ _setDescription } type={"button"}>Modifier la description</Button>
                                </div>
                                <TextareaAutosize
                                    aria-label="New Description"
                                    minRows={3}
                                    placeholder="new description"
                                    style={{ width: 900, height: 150 }}
                                    onChange={e => setNewDescription(e.target.value)}
                                    />
                            </form>
                        </div>
                    </section>
                    }
                </div>

                    <div className={"refresh"}>
                        <span className={"spacer"}>
                            <Button variant="contained" onClick={ _getMyParticipation } type={"button"} >Actualiser ma participation</Button>
                        </span>
                        { isOwner &&
                        <span className={"spacer"}>
                            <Button variant="contained" onClick={ _retrieveFunding } type={"button"}>R??cup??rer les fonds</Button>
                        </span>}
                        <span className={"spacer"}>
                            <Button variant="contained" onClick={ _requestRefundGoalNotCompleted } type={"button"}>Demander un remboursement (Objectif non atteint)</Button>
                        </span>
                        <span className={"spacer"}>
                            <Button variant="contained" onClick={ _giveUpBenefitsAndParticipation } type={"button"}>Abandonner le projet et ces b??n??fices</Button>
                        </span>


                    </div>

            </div>
        </main>


    );
}

export default CrowdFunding;
