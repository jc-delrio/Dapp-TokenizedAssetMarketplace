import { useConnectWallet } from "@web3-onboard/react";

export const useWallet = () => {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    return { wallet, connecting, connect, disconnect };
};