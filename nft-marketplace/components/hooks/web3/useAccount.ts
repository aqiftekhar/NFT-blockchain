import useSWR from "swr";
import { CryptoHookFactory } from "types/hooks";

type AccountHookFactory = CryptoHookFactory<string, string>;

export type UseAccountHook = ReturnType<AccountHookFactory>

//dependencies -> provider, ethereum, contract
export const hookFactory : AccountHookFactory = (dependencies) => (params)=> {
const response = useSWR("web3/useAccount", ()=> {
    console.log(dependencies);
    console.log(params);
    return 'hell user '
})
return response;
}

// export const useAccount = hookFactory({ethereum: undefined, provider: undefined, contract: undefined})