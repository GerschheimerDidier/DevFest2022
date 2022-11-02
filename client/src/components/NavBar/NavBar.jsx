import {Link} from "react-router-dom";
import "./navbar.css"
import {useEth} from "../../contexts/EthContext";
import {useEffect, useState} from "react";

function NavBar() {
    const { account } = useEth();

    return (
        <div className={"navbar"}>
            <ul>
                <li>
                    <Link to="/" text="home">Home</Link>
                </li>
                <li>
                    <Link to="/sharedWallet" text="shared wallet">Shared wallet</Link>
                </li>
                <li>
                    <Link to="/crowdFunding" text="crowd funding">Crowd funding</Link>
                </li>
            </ul >
            <div className={"my-account"}>
                Welcome { account }
            </div>
        </div>

    );
}

export default NavBar;