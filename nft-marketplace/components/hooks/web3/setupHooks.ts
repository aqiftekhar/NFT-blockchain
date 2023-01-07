import { Web3Dependencies } from "types/hooks";
import { hookFactory as createAccountHook,UseAccountHook } from "./useAccount"
import { hookFactory as createNetworkHook, UseNetworkHook } from "./useNetwork";

export type Web3Hook = {
    useAccount: UseAccountHook;
    useNetwork: UseNetworkHook;
}

export type SetupHooks = {
(d: Web3Dependencies): Web3Hook
}

export const setupHooks : SetupHooks = (dependencies) => {
return {
    useAccount : createAccountHook(dependencies),
    useNetwork: createNetworkHook(dependencies)
}
}