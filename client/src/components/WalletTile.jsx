import React, {useEffect, useState} from "react";

const WalletTile = ({ walletInfo }) => {

    const [walletType, setWalletType] = useState(-1);

    useEffect(() => {
        // Get wallet type
        switch (Number(walletInfo[1])) {
            case 0:
                setWalletType("Shared Wallet")
                break;
            case 1:
                setWalletType("Crowdfunding")
                break;
            case 2:
                setWalletType( "Common Pot")
                break;
            default:
                setWalletType( "Unknown")
                break;
        }
    })

    return (

        <button className="btn-subscription">
            <span>Wallet @ {walletInfo[0]}</span><br/>
            <span>Type of contracts : {walletType}</span> <br/>
            <span>Date : {walletInfo[2]}</span>
        </button>
    )
}
export default WalletTile;
