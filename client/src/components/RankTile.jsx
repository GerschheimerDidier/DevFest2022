import React, {useEffect, useState} from "react";
import { useEth } from "../contexts/EthContext";

const RankTile = ({ rankInfo, address }) => {

    console.log("TILE", rankInfo);
    console.log("TILE ADDRESS", address);
    const [contract , setContract] = useState(null);

    const { web3, account } = useEth();

    const [rankDetail, setRankDetail] = useState([]);

    const instance = require("../contracts/CrdFunding.json");

    useEffect(() => {
        
        console.log("ADDRESS 00 : ", address);
        setContract(new web3.eth.Contract(instance.abi, address));  // set here address of contract deployed from factory
        console.log("TILE CONTRACT : ",  contract);

        _getRankInfo();
        console.log("DETAIL : ", rankDetail);

    }, [useEth()])



    async function _getRankInfo(){
        setRankDetail(await contract.methods.getRankInfo(Number(rankInfo.id)).call({from : account[0]}));
    }
    return (
        <div>
            <span>Name {rankDetail[0]}</span><br/>
            <span>Description {rankDetail[1]}</span><br/>
            <span>Minimum Donation {rankDetail[2]}</span><br/>
            <span>Uses Left {rankDetail[3]}</span><br/>

        </div>
    )
}
export default RankTile;