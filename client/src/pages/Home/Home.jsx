import './Home.css';
import Dashboard from '../../components/Dashboard';

const Home = () => {

    const factoryAddress = 0x36b03F26aDB736e9829F6D9133FEbF6C49279A92;

    return (
        <div className={"home-container"}>
            {/* <button>Create a Wallet</button> */}
            <Dashboard/>
        </div>

    );
}

export default Home;
