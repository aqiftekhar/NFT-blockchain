import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, ethers, providers } from "ethers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
export type Web3Params = {
  ethereum: MetaMaskInpageProvider | null;
  provider: providers.Web3Provider | null;
  contract: Contract | null;
};

export type Web3State = {
  isLoading: boolean;
} & Web3Params;

export const CreateDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
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
