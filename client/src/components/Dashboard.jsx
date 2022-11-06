import React from "react";
import WalletTile from "./WalletTile";
import Web3 from "web3";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        // Initial State
        this.state = {
            factoryAddress: 0xf15f81fea185d70a7a5e54ca64892eddfbe9079dc53d08085cb2727b572c2ac2,
            hasBeenClicked: false,
            wallets: []
        }
    }

    componentDidMount() {
        // Fetch subscribed wallets from factory
        this.retrieveWallets();
    }

    // Retrieve subscribed wallets from factory
    async retrieveWallets() {

        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const account = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();

        const artifact = require("../contracts/WalletFactory.json");
        const { abi } = artifact;
        let address, contract;
        try {
            address = artifact.networks[networkID].address;
            const factory = new web3.eth.Contract(abi, address);

            console.log('Retreiving subscriptions...');
            factory.methods.getSubscriptions.call(this.onReceiveWallets);

        } catch (err) {
            console.error(err);
        }

        // // Mock
        // setTimeout(() => {
        //     this.onReceiveWallets([
        //         { address: "0x00", type: 0 },
        //         { address: "0x01", type: 2 },
        //         { address: "0x02", type: 1 },
        //     ]);
        // }, 2500);
    }

    // Called when we receive subscriptions from contract
    onReceiveWallets(error, result) {
        console.log('Subscription retrieved');
        console.log(error);
        console.log(result);

        this.setState({ wallets: result });
    }

    render() {
        return (
            <div>
                {
                    // Ensure user has wallets to display
                    this.state.wallets.length > 0 &&

                    <div>
                        <br />
                        <h2>My Wallets ({this.state.wallets.length})</h2>
                        <div>
                            {
                                // For each wallet
                                this.state.wallets.map(wallet => {
                                    return (< WalletTile wallet={wallet} />)
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Dashboard;