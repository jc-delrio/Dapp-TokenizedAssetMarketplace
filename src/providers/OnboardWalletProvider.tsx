import injectedModule from '@web3-onboard/injected-wallets';
import { init, Web3OnboardProvider } from '@web3-onboard/react';

const OnboardWalletProvider = ({ children }: { children: React.ReactNode }) => {

    const sepolia = {
        id: '11155111',
        token: "ETH",
        label: "Sepolia",
        rpcUrl: import.meta.env.VITE_RPC_URL
    }

    const chains = [sepolia];
    const wallets = [injectedModule()];

    const web3Onboard = init({
        wallets,
        chains,
        appMetadata: {
            name: 'Wallet Roulette',
            icon: '<svg></svg>',
            description: 'Share cripto in circles'
        }
    })

    return (
        <Web3OnboardProvider web3Onboard={web3Onboard}>
            {children}
        </Web3OnboardProvider>
    )
}

export default OnboardWalletProvider;