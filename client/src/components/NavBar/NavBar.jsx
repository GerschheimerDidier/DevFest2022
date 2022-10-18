import {Link} from "react-router-dom";
import "./navbar.css"


function NavBar() {
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
        </div>

    );
}

export default NavBar;
