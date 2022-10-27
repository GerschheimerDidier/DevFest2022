import {EthProvider} from "../../contexts/EthContext";
import Intro from "../Intro";
import Setup from "../Setup";
import Demo from "../Demo";

function Home() {

  return (
<div>
  <EthProvider>
    <div id="App" >
      <div className="container">
        <h2>Voila</h2>
        <Intro />
        <hr />
        <Setup />
        <hr />
        <Demo />
        <hr />
      </div>
    </div>
  </EthProvider>
</div>


  );
}

export default Home;
