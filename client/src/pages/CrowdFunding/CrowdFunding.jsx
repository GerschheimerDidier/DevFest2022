import { useEth } from "../../contexts/EthContext";
import web3 from "web3"
import { useState } from "react";
import './CrowdFunding.css';



function CrowdFunding() {
    //*********** USE STATE ***********//


    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { contract, account } = useEth();

    const [crdfundingAddr, setCrdfundingAddr] = useState(0);


    const [description, refreshDescription] = useState(getDescription);

    console.log(contract)

    async function getGoal() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getGoal()
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function getAllActiveRanks() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getAllActiveRanks()
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function getDescription() {
        try {
                let value = await contract.methods.getDescription();
                console.log("Value : ", value) 
                return value;
        }
        catch (err) {
            console.log(err);
        }
    }
    async function getEndDate() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getEndDate()
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function getMyParticipation() {
        try {
            setCrdfundingAddr(
                    await contract.getMyParticipation.call()
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function getRankInfo(id) {
        try {
            setCrdfundingAddr(
                    await contract.methods.getRankInfo()
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function getTotal() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getTotal()
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function getOwner() {
        try {
            setCrdfundingAddr(
                    await contract.methods.owner()
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function isOwner() {
        try {
            setCrdfundingAddr(
                    await contract.methods.isOwner()
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function getContractBalance() {
        try {
            await web3.eth.getBalance(contract.address);
        }
        catch (err) {
            console.log(err);
        }
    }

    async function createRank(_name, minInvestement, _description, usageNumber) {
        try {
            setCrdfundingAddr(
                    await contract.methods.createRank(_name, minInvestement, _description, usageNumber)
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function editRank(_id, _minimumInvestment, _description, _uses) {
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

    async function deactivateRank(_id) {
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

    async function activateRank(_id) {
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

    async function setDescription(_description) {
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

    async function sendDonation() {
        try {
            await contract.methods.sendDonation(0, true, { value : 0});
        }
        catch (err) {
            console.log(err);
        }
    }

    async function retrieveFunding() {
        try {
            setCrdfundingAddr(
                    await contract.methods.retrieveFunding()
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function requestRefundGoalNotCompleted() {
        try {
            setCrdfundingAddr(
                    await contract.methods.requestRefundGoalNotCompleted()
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async function giveUpBenefitsAndParticipation() {
        try {
            setCrdfundingAddr(
                    await contract.methods.giveUpBenefitsAndParticipation()
            );
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        
        <div className={"shared-wallet"}>


            <section className={"header-wallet"}>
                <h2>Your CrowdFunding :</h2>
                <p>  </p>
                <h4> Contract address : addressss </h4>
                <h4>Description : </h4>
                <p>  {description} </p>
            </section>

            <section className="section-your-allowance">
                <h4>Balance : </h4>
            </section>    
        </div>
    


    );
}

export default CrowdFunding;
