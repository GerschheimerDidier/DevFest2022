import React from "react";

class WalletTile extends React.Component {

    constructor({ wallet }) {
        super();

        console.log(wallet);

        this.state = {
            wallet: wallet,
        };
    }

    // Handles click on a wallet tile
    handleClick = (address, type) => {
        // Update your state
    }

    render() {

        // Get wallet type
        let typeName = "Unknown";
        switch (this.state.wallet.type) {
            case 0:
                typeName = "Shared Wallet"
                break;
            case 0:
                typeName = "Crowdfunding"
                break;
            case 0:
                typeName = "Common Pot"
                break;
        
            default:
                break;
        }

        return (
            <button>
                <span>{typeName}</span><br/>
                <span>{this.state.wallet.address}</span>
            </button>
        );
    }
}

export default WalletTile;