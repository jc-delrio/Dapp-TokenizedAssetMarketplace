import { useConnectWallet } from "@web3-onboard/react";
import { useWeb3 } from "../providers/Web3Provider";

// Hook para control de wallets
export const useWallet = () => {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const { signer, isWeb3Loading } = useWeb3();
    return { wallet, connecting, connect, disconnect, signer, isWeb3Loading };
};