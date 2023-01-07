import { useEffect } from "react";
import useSWR from "swr";
import { CryptoHookFactory } from "types/hooks";

type useAccountResponse = {
    connect: () => void;
    isLoading : boolean;
    isInstalled : boolean;
}
type AccountHookFactory = CryptoHookFactory<string, useAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>

//dependencies -> provider, ethereum, contract
export const hookFactory : AccountHookFactory = ({ethereum, provider, isLoading}) => ()=> {
const {data, mutate,isValidating, ...swr} = useSWR(
    provider?  "web3/useAccount": null, 
    async()=> {
    const accounts = await provider!.listAccounts();
    const account = accounts[0];

    if (!account) {
        throw "Cannot retrive account. Please connect to Web3 Wallet";
    }
    return account;
},{
    revalidateOnFocus: false,
    shouldRetryOnError: false
})

useEffect(()=>{
    ethereum?.on('accountsChanged', handleAccountsChanged);
    return () =>{
        ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    }
})

const handleAccountsChanged = (...args: unknown[]) => {
    const accounts = args[0] as string[];
    if (accounts.length === 0) {
        console.log('Please connect to Metamask!');
    } else if (accounts[0] != data) {
        mutate(accounts[0]);
    }
}
const connect = async() => {
    try {
        ethereum?.request({method: "eth_requestAccounts"})
    } catch (error) {
        console.error(error);
    }
}
return {
    ...swr, 
    data, 
    isValidating,
    isLoading : isLoading as boolean,
    isInstalled : ethereum?.isMetaMask || false,
    mutate, 
    connect};
}
