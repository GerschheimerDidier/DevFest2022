import { useContext } from "react";
import EthContext from "./EthContext";

const useEth = () => {
    const context = useContext(EthContext)
    if (context === undefined) {
        throw new Error("EthContext must be within EthProvider")
    }

    return context
};

export default useEth;
