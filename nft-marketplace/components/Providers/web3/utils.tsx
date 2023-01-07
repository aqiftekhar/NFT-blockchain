import { setupHooks, Web3Hook } from "@hooks/web3/setupHooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, ethers, providers } from "ethers";
import { type } from "os";
import { Web3Dependencies } from "types/hooks";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> ={
  [P in keyof T]: T[P] | null
}
export type Web3State = {
  isLoading: boolean;
  hooks: Web3Hook
} & Nullable<Web3Dependencies>;

export const CreateDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks({} as any)
  };
};

export const CreateWeb3State = ({ethereum, provider, contract, isLoading}: Web3Dependencies & {isLoading : boolean}) => {
  return {
    ethereum,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ethereum, provider, contract})
  };
};

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract> => {

    if (!NETWORK_ID) {
       return  Promise.reject('network id is not defined');
    }
    const response = await fetch(`/contracts/${name}.json`);
    const artifact = await response.json();

    if (artifact.networks[NETWORK_ID].address) {
     const contract =    new ethers.Contract(
        artifact.networks[NETWORK_ID].address,
        artifact.abi,
        provider
     )
     return contract;
    } else {
        return Promise.reject(`Contract [${name}] cannot be loaded`);
    }
};
