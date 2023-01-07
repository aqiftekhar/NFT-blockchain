import useSWR from "swr";
import { CryptoHookFactory } from "types/hooks";

type AccountHookFactory = CryptoHookFactory<string, string>;

export type UseAccountHook = ReturnType<AccountHookFactory>

//dependencies -> provider, ethereum, contract
export const hookFactory : AccountHookFactory = (dependencies) => ()=> {
const response = useSWR(
    dependencies.provider?  "web3/useAccount": null, 
    async()=> {
    const accounts = await dependencies.provider!.listAccounts();
    const account = accounts[0];

    if (!account) {
        throw "Cannot retrive account. Please connect to Web3 Wallet";
    }
    return account;
},{
    revalidateOnFocus: false
})
return response;
}
