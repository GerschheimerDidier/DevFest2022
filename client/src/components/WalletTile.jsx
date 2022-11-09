import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const WalletTile = ({ walletInfo }) => {

    const navigate = useNavigate();
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


    function RoutingWallet() {
        navigate("/sharedWallet", { state: { address: walletInfo[0], type: walletInfo[1] } })
    }

    return (
        <button className="btn-subscription" onClick={RoutingWallet}>
            <span>Wallet @ {walletInfo[0]}</span><br/>
            <span>Type of contracts : {walletType}</span> <br/>
            <span>Date : {walletInfo[2]}</span>
        </button>
    )
}
export default WalletTile;
