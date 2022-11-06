import './Home.css';
import Dashboard from '../../components/Dashboard';

const Home = () => {

    const factoryAddress = 0xb47E5DF39A05f9885c3F5CD295448e66612c1a35;    

    return (
        <div className={"home-container"}>
            <button>Create a Wallet</button>
            <Dashboard/>
        </div>

    );
}

export default Home;
