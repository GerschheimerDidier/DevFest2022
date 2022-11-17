import React, {useEffect, useState} from "react";
import { useEth } from "../contexts/EthContext";
import './RankTile.css';
import web3 from "web3";
import {BigNumber} from "@ethersproject/bignumber";


const RankTile = ({ rankInfo, address }) => {

    console.log("TILE", rankInfo);
    console.log("TILE ADDRESS", address);
    //const [contract , setContract] = useState(null);

    const { account, contract, state } = useEth();

    const [rankDetail, setRankDetail] = useState({name : "name",
        description : "description",
        minimumInvestment : 0,
        usesLeft: -1});

    const [rankMinDonation, setRankMinDonation] = useState(0)

    const instance = require("../contracts/CrdFunding.json");

    useEffect(() => {
        
        console.log("ADDRESS 00 : ", address);
        //setContract(new web3.eth.Contract(instance.abi, address));  // set here address of contract deployed from factory
        console.log("TILE CONTRACT : ",  contract);

        _getRankInfo();
        console.log("DETAILTTT : ", rankDetail);
        _getMinDonation();

    }, [useEth()])



    async function _getRankInfo(){
        setRankDetail(await contract.methods.getRankInfo(Number(rankInfo.id)).call({from : account[0]}));
        
    }


    async function _getMinDonation(){
        console.log("DDDDD", rankDetail[2])
        setRankMinDonation(rankDetail.minimumInvestment);
        
    }
    return (
        <div className={"card"}>
            <div className={"item-card-retribution"}>
                <label>Numéro: {rankInfo.id}</label>
            </div>
            <div className={"item-card-retribution"}>
                <label>Intitulé: {rankDetail.name}</label>
            </div>

            <div className={"item-card-retribution"}>
                <label>Donation minimal: {web3.utils.fromWei(String(rankDetail.minimumInvestment))} ETH</label>
            </div>

            <div className={"item-card-retribution"}>
                <label>Rétributions restantes: {rankDetail.usesLeft == -1? "pas de limite" : rankDetail.usesLeft }</label>
            </div>

            <div className={"item-card-retribution"}>
                <label>Description: {rankDetail.description}</label>
            </div>
        </div>
    )
}
export default RankTile;
