import React, {useReducer, useCallback, useEffect, useState} from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {reducer, actions, initialState} from "./state";

function EthProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const addressFactory = "0xA604FC369F51f9f2475B523242e4b0709a89B327";

    const init = useCallback(
        async (artifact, addressWallet) => {
            if (artifact) {
                const web3 = (new Web3(Web3.givenProvider || "ws://localhost:8545"));
                const account = await web3.eth.requestAccounts();
                setAccount(account);
                const networkID = await web3.eth.net.getId();
                const {abi} = artifact;
                let address
                try {
                    address = await artifact.networks[networkID].address;
                    setContract(await new web3.eth.Contract(abi, addressWallet));  // set here address of contract deployed from factory
                } catch (err) {
                    console.error(err);
                }
                dispatch({
                    type: actions.init,
                    data: {artifact, web3, account, networkID, address}
                });
            }
            console.log("LOAD ETH Provider")
        }, []);

    useEffect(() => {
        const tryInit = async () => {
            // TODO Faire un switch a la place de ce truc dégueulasse
            if (location.pathname.includes("sharedWallet")) {
                try {
                    const artifact = require("../../contracts/Wallet.json");
                    init(artifact, location.state.address);
                } catch (err) {
                    console.error(err);
                }
            } else if (location.pathname.includes("crowdFunding")) {
                try {
                    const artifact = require("../../contracts/CrdFunding.json");
                    init(artifact, location.state.address);
                } catch (err) {
                    console.error(err);
                }
            } else if (location.pathname.includes("commonPot")) {
                try {
                    const artifact = require("../../contracts/CommonPot.json");
                    init(artifact, location.state.address);
                } catch (err) {
                    console.error(err);
                }
            } else {
                try {
                    const artifact = require("../../contracts/WalletFactory.json");
                    init(artifact, addressFactory);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        tryInit();
    }, [init, navigate]);

    // ***** Event with MetMask => Account changed + chain changed
    useEffect(() => {
        const events = ["chainChanged", "accountsChanged"];
        const handleChange = () => {
            init(state.artifact);
        };

        events.forEach(e => window.ethereum.on(e, handleChange));

        return () => {
            events.forEach(e => window.ethereum.removeListener(e, handleChange));
        };
    }, [init, state.artifact]);


    return (
        <EthContext.Provider value={{
            state,
            dispatch,
            contract,
            account,
        }}>
            {children}
        </EthContext.Provider>
    );
}

export default EthProvider;
