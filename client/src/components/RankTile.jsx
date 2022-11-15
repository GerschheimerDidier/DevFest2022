import React, {useEffect, useState} from "react";
import { useEth } from "../contexts/EthContext";
import './RankTile.css';


const RankTile = ({ rankInfo, address }) => {

    console.log("TILE", rankInfo);
    console.log("TILE ADDRESS", address);
    //const [contract , setContract] = useState(null);

    const { account, contract, state } = useEth();

    const [rankDetail, setRankDetail] = useState([]);

    const instance = require("../contracts/CrdFunding.json");

    useEffect(() => {
        
        console.log("ADDRESS 00 : ", address);
        //setContract(new web3.eth.Contract(instance.abi, address));  // set here address of contract deployed from factory
        console.log("TILE CONTRACT : ",  contract);

        _getRankInfo();
        console.log("DETAIL : ", rankDetail);

    }, [useEth()])



    async function _getRankInfo(){
        setRankDetail(await contract.methods.getRankInfo(Number(rankInfo.id)).call({from : account[0]}));
    }
    return (
        <div className={"card"}>
            <div className={"item-card-retribution"}>
                <label>Numéro: {rankInfo.id}</label>
            </div>
            <div className={"item-card-retribution"}>
                <label>Intitulé: {rankDetail[0]}</label>
            </div>

            <div className={"item-card-retribution"}>
                <label>Donation minimal: {rankDetail[2]}</label>
            </div>

            <div className={"item-card-retribution"}>
                <label>Rétributions restantes: {rankDetail[3]}</label>
            </div>

            <div className={"item-card-retribution"}>
                <label>Description: {rankDetail[1]}</label>
            </div>
        </div>
    )
}
export default RankTile;
