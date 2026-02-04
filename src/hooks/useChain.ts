import { useSetChain } from "@web3-onboard/react";

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
