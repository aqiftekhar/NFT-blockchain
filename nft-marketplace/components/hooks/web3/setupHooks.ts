import { Web3Dependencies } from "types/hooks";
import { hookFactory as createAccountHook,UseAccountHook } from "./useAccount"

export type Web3Hook = {
    useAccount: UseAccountHook;
}

export type SetupHooks = {
(d: Web3Dependencies): Web3Hook
}

export const setupHooks : SetupHooks = (dependencies) => {
return {
    useAccount : createAccountHook(dependencies)
}
}