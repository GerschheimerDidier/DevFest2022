import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import {EthProvider} from "./contexts/EthContext";
import Footer from "./components/Footer";
import {Outlet} from "react-router-dom";

function App(props) {
    return (
        <EthProvider>
            <NavBar/>
            <Outlet/>
            <Footer/>
        </EthProvider>
    );
}

export default App;
