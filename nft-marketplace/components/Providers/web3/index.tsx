
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";
import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { CreateDefaultState, CreateWeb3State, loadContract, Web3State } from "./utils";

const Web3Context = createContext<Web3State>(CreateDefaultState());

const Web3Provider: FunctionComponent<any> = ({ children }) => {
  const [Web3Api, setWeb3Api] = useState<Web3State>(CreateDefaultState());

  useEffect(() => {
    const initWeb3 = async() => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const contract = await loadContract("NFTMarket", provider);
        setGlobalListeners(window.ethereum);
      setWeb3Api(CreateWeb3State({
        ethereum: window.ethereum,
        provider,
        contract,
        isLoading: false
      }));
      } catch (error : any) {
        console.error("Please install Web3 Wallet.");
        setWeb3Api((api) => CreateWeb3State({
          ...api as any,
          isLoading: false
        }))
      }

    };

    initWeb3();
    return () => removeGlobalListeners(window.ethereum);
  }, []);

  const pageReload = () => {
    window.location.reload();
  }
  const handleAccount = (ethereum: MetaMaskInpageProvider) => async () =>{
  
    const isLocked = !(await ethereum._metamask.isUnlocked());
    debugger;
    if (isLocked) {
      pageReload();
    }
  }
  const setGlobalListeners = (ethereum : MetaMaskInpageProvider) => {
    ethereum.on("chainChanged", pageReload);
    ethereum.on("accountsChanged", handleAccount(ethereum));
  }
  const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
    ethereum.removeListener("chainChanged", pageReload);
    ethereum.removeListener("accountsChanged", handleAccount);
  }
  return (
    <Web3Context.Provider value={Web3Api}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  return useContext(Web3Context);
};

export const useHooks = () => {
  const {hooks} = useWeb3();
  return hooks;
}

export default Web3Provider;
