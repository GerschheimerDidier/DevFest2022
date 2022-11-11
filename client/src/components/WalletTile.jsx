import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {useEth} from "../contexts/EthContext";

const WalletTile = ({ walletInfo }) => {

    const navigate = useNavigate();
    const [walletType, setWalletType] = useState(-1);

    const { setAddressWallet } = useEth();

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
        switch (Number(walletInfo[1])) {
            case 0:
                navigate(`/sharedWallet/` + walletInfo[0], { state: { address: walletInfo[0], type: walletInfo[1] } })
                break;
            case 1:
                navigate(`/crowdFunding/` + walletInfo[0], { state: { address: walletInfo[0], type: walletInfo[1] } })
                break;
            case 2:
                navigate(`/commonPot/` + walletInfo[0], { state: { address: walletInfo[0], type: walletInfo[1] } })
                break;
            default:
                setWalletType( "Unknown")
                break;
        }
        
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
