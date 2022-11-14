import {Link} from "react-router-dom";
import "./navbar.css"
import {useEth} from "../../contexts/EthContext";

function NavBar() {
    const { account } = useEth();

    return (
        <div className={"navbar"}>
            <ul>
                <li>
                    <Link to="/" text="home">Home</Link>
                </li>

                <li>
                    <Link to="/about" text="about">About</Link>
                </li>
                {/*<li>*/}
                {/*    <Link to="/sharedWallet/0x0c910b88b6e0fb0f64C46183dcE0C8b2C0533Ea8" text="shared wallet">Shared wallet</Link>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <Link to="/crowdFunding/0xDEf1848B4Fa4Fc457C546d5f9a76da56018ABCA1" text="crowd funding">Crowd funding</Link>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <Link to="/commonPot/0xDF13eAf15d74A9146468030C31cAFB48Ad3294cA" text="common pot">Common pot</Link>*/}
                {/*</li>*/}
            </ul >
            <div className={"my-account"}>
                Welcome { account }
            </div>
        </div>

    );
}

export default NavBar;
