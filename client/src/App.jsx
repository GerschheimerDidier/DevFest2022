import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import {EthProvider} from "./contexts/EthContext";
import {Outlet} from "react-router-dom";

function App(props) {
    return (
        <EthProvider>
            <NavBar/>
            <Outlet/>
        </EthProvider>
    );
}

export default App;
