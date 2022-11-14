import "./WalletTile.css"
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {useEth} from "../contexts/EthContext";

const WalletTile = ({ walletInfo }) => {

    const navigate = useNavigate();
    const [walletType, setWalletType] = useState(-1);

    const { setAddressWallet } = useEth();

    useEffect(() => {
        // Get wallet type
        switch (Number(walletInfo.type)) {
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
        switch (Number(walletInfo.type)) {
            case 0:
                navigate(`/sharedWallet/` + walletInfo.addr, { state: { address: walletInfo.addr, type: walletInfo.type } })
                break;
            case 1:
                navigate(`/crowdFunding/` + walletInfo.addr, { state: { address: walletInfo.addr, type: walletInfo.type } })
                break;
            case 2:
                navigate(`/commonPot/` + walletInfo.addr, { state: { address: walletInfo.addr, type: walletInfo.type } })
                break;
            default:
                setWalletType( "Unknown")
                break;
        }
        
    }

    return (
        <div className="walletTile" onClick={RoutingWallet}>
            <div className="walletTileImage">
                <img src={walletType + ".png"} alt="" width="50px" />
            </div>
            <div className="walletData">
                <p className="walletType">{walletType}</p>
                <p className="walletAddress">{walletInfo.addr.substring(0, 10)}</p>
            </div>
        </div>
    )
}
export default WalletTile;
