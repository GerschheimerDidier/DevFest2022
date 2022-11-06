import React from "react";
import WalletTile from "./WalletTile";

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
    retrieveWallets() {

        // TODO implement

        // Mock
        setTimeout(() => {
            this.onReceiveWallets([
                { address: "0x00", type: 0 },
                { address: "0x01", type: 2 },
                { address: "0x02", type: 1 },
            ]);
        }, 2500);
    }

    // Called when we receive subscriptions from contract
    onReceiveWallets(wallets) {
        this.setState({ wallets: wallets });
    }

    // Handles click on a wallet tile
    handleClick = (address, type) => {
        // Update your state
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
                                // this.state.wallets.map((wallet, index) => {
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