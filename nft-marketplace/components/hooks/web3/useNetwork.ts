import useSWR from "swr";
import { CryptoHookFactory } from "types/hooks";

const NETWORKS: {[k: string]: string } = {
    1: "Ethereum Main Network",
    5: "Goerli Test Network",
    11155111: "Sepolia Test Network",
    1337: "Ganache Test Network"
}

const TARGET_ID = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[TARGET_ID];
type useNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  targetNetwork: string
};
type NetworkHookFactory = CryptoHookFactory<string, useNetworkResponse>;

export type UseNetworkHook = ReturnType<NetworkHookFactory>;

//dependencies -> provider, ethereum, contract
export const hookFactory: NetworkHookFactory =
  ({ provider, isLoading }) =>
  () => {
    const { data, isValidating, ...swr } = useSWR(
      provider ? "web3/useNetwork" : null,
      async () => {
        const chain_id = (await provider!.getNetwork()).chainId;
        if (!chain_id) {
            throw "Cannot retrieve Network "
        }
        return NETWORKS[chain_id];
      },
      {
        revalidateOnFocus: false,
      }
    );

    return {
      ...swr,
      data,
      isValidating,
      targetNetwork,
      isSupported: data === targetNetwork,
      isLoading: isLoading || isValidating,
    };
  };
