import React from "react";
import WalletTile from "./WalletTile";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        // Initial State
        this.state = {
            hasBeenClicked: false,
            wallets: []
        }

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
                        <h2>My Wallets</h2>
                        <div>
                            {
                                // For each wallet
                                this.state.wallets.map((wallet, index) => {
                                    <WalletTile wallet={wallet}/>
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