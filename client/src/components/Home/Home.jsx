import {EthProvider} from "../../contexts/EthContext";
import Intro from "../Intro";
import Setup from "../Setup";
import Demo from "../Demo";
import Footer from "../Footer";

function Home() {

  return (
<div>
  <EthProvider>
    <div id="App" >
      <div className="container">
        <Intro />
        <hr />
        <Setup />
        <hr />
        <Demo />
        <hr />
        <Footer />
      </div>
    </div>
  </EthProvider>
</div>


  );
}

export default Home;
