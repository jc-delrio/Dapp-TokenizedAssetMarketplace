import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ethers, type Signer } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useChain } from '../hooks/useChain';

interface Web3ContextType {
    provider: ethers.BrowserProvider | null;
    signer: Signer | null;
    account: string | null;
    chainId: string | null;
    isWeb3Loading: boolean;
}

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
    const { wallet } = useWallet();
    const { connectedChain } = useChain();

    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);

    const [isWeb3Loading, setIsWeb3Loading] = useState(true);

    useEffect(() => {
        const updateWeb3State = async () => {
            setIsWeb3Loading(true);
            try {
                if (wallet) {
                    const ethersProvider = new ethers.BrowserProvider(wallet.provider);
                    setProvider(ethersProvider);

                    const ethersSigner = await ethersProvider.getSigner();
                    setSigner(ethersSigner);
                } else {
                    setProvider(null);
                    setSigner(null);
                }
            } catch (error) {
                console.error("Error inicializando Web3:", error);
                setProvider(null);
                setSigner(null);
            } finally {
                setIsWeb3Loading(false);
            }
        };

        updateWeb3State();
    }, [wallet, connectedChain]);

    return (
        <Web3Context.Provider value={{
            provider,
            signer,
            account: wallet?.accounts[0]?.address || null,
            chainId: connectedChain?.id || null,
            isWeb3Loading
        }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => useContext(Web3Context);