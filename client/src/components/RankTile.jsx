import React, {useEffect, useState} from "react";
import { useEth } from "../contexts/EthContext";
import './RankTile.css';
import web3 from "web3";
//import {BigNumber} from "@ethersproject/bignumber";

const RankTile = ({ rankInfo, address }) => {

    const { account, contract } = useEth();

    const [rankDetail, setRankDetail] = useState([]);

    useEffect(() => {

        _getRankInfo();

    }, [account, contract])



    async function _getRankInfo(){
        // console.log("INFOOOOO", rankInfo.id, typeof(rankInfo.id))
        const _id = Number(rankInfo.id);
        setRankDetail(await contract.methods.getRankInfo(_id).call({from : account[0]}));

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
                <label>Donation minimale: {rankDetail[2]} ETH</label>
            </div>

            <div className={"item-card-retribution"}>
                <label>Rétributions restantes: {rankDetail[3] == -1? "pas de limite" : rankDetail[3] }</label>
            </div>

            <div className={"item-card-retribution"}>
                <label>Description: {rankDetail[1]}</label>
            </div>
        </div>
    )
}
export default RankTile;
