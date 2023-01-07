import { ethers } from "ethers";
import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { CreateDefaultState, loadContract, Web3State } from "./utils";

const Web3Context = createContext<Web3State>(CreateDefaultState());

const Web3Provider: FunctionComponent<any> = ({ children }) => {
  const [Web3Api, setWeb3Api] = useState<Web3State>(CreateDefaultState());

  useEffect(() => {
    const initWeb3 = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const contract = await loadContract("NFTMarket", provider);
      setWeb3Api({
        ethereum: window.ethereum,
        provider: provider,
        contract: contract,
        isLoading: false,
      });
    };

    initWeb3();
  }, []);
  return (
    <Web3Context.Provider value={Web3Api}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  return useContext(Web3Context);
};

export default Web3Provider;
