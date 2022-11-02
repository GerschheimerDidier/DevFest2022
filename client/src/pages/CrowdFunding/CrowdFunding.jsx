
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
            console.log(err)
        }
    }

    async function getAllActiveRanks() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getAllActiveRanks()
            );
        }
        catch (err) {
            console.log(err)
        }
    }
    async function getDescription() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getDescription()
            );
        }
        catch (err) {
            console.log(err)
        }
    }
    async function getEndDate() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getEndDate()
            );
        }
        catch (err) {
            console.log(err)
        }
    }
    async function getMyParticipation() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getMyParticipation()
            );
        }
        catch (err) {
            console.log(err)
        }
    }
    async function getRankInfo() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getRankInfo(id)
            );
        }
        catch (err) {
            console.log(err)
        }
    }
    async function getTotal() {
        try {
            setCrdfundingAddr(
                    await contract.methods.getTotal()
            );
        }
        catch (err) {
            console.log(err)
        }
    }
    async function getOwner() {
        try {
            setCrdfundingAddr(
                    await contract.methods.owner()
            );
        }
        catch (err) {
            console.log(err)
        }
    }
    async function isOwner() {
        try {
            setCrdfundingAddr(
                    await contract.methods.isOwner()
            );
        }
        catch (err) {
            console.log(err)
        }
    }



    return (
        <div className={"shared-wallet"}>

            <section className={"header-wallet"}>
                <h2>Your Shared wallet</h2>
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
