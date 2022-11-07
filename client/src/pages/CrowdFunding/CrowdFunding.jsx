
function CrowdFunding() {
    //*********** USE STATE ***********//
    const [crdfundingAddr, setCrdfundingAddr] = useState(0);

    /*
    * desc => contract is instance of contract. He contains method, abi, ...
    * desc => account is addr of wallet connected with application
     */
    const { contract, account } = useEth();

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
            setCrdfundingAddr(
                    await contract.methods.getDescription()
            );
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
                    await contract.methods.getMyParticipation()
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    async function getRankInfo() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getRankInfo(id)
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

    async function sendDonation( _rankId, _claimReward, _amount) {
        try {
            setCrdfundingAddr(
                    await contract.methods.sendDonation(
                        _rankId, _claimReward, { value : _amount}
                    )
            );
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
                <h2>Crowdfunding </h2>

                <p> { getDescription() } </p>
            </section>

            <section className={"section-your-allowance"}>
                <h4>Your allowance</h4>
                <p> { crdfundingAddr } </p>
                <p>ETH</p>
                {/*TODO Retirer le bouton et le faire a la fin du chargement de la page avec la var account load*/}
                <button onClick={ getMyAllowance }>getAllowanceWithAddr</button>
            </section>

            <button onClick={ addAllowance } type={"button"}>Ajout Allowance</button>
            <button onClick={ sendMoney } type={"button"}>Send Money on contract</button>
            <button onClick={ giveMyMoney } type={"button"}>Withdraw my money</button>
        </div>
    


    );
}

export default CrowdFunding;
