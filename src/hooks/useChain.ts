import { useSetChain } from "@web3-onboard/react";

// Hook para control de red blockchain
export const useChain = () => {
    const [
        {
            chains,
            connectedChain,
            settingChain
        },
        setChain
    ] = useSetChain();

    return { chains, connectedChain, settingChain, setChain };
}
