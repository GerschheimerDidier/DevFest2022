import {Link} from "react-router-dom";
import "./navbar.css"
import {useEth} from "../../contexts/EthContext";
import {useEffect, useState} from "react";


function NavBar() {
    const { account } = useEth();

    // const [accounts, setAccount] = useState(null);
    // useEffect(() => {
    //     const { accounts } = useEth();
    //     setAccount(accounts);
    // }, []);

    return (
        <div>
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
            <p>Welcome { account }</p>
        </div>

    );
}

export default NavBar;
