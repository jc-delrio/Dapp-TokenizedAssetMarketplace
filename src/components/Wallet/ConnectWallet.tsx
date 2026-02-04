import { useWallet } from "../../hooks/useWallet";
import { useChain } from "../../hooks/useChain";
import { Button } from "@heroui/react";
import { useState } from "react";
import './connectWallet.css';

const ConnectWallet = () => {
    const { wallet, connect, disconnect } = useWallet();
    const { chains, setChain } = useChain();
    const [showInfoWallet, setShowInfoWallet] = useState(false);

    const handleConnectWallet = async () => {
        await connect();
        if (wallet && chains.length > 0) {
            await setChain({ chainId: chains[0].id });
        }
    }

    const handleDisconnectWallet = async () => {
        if (wallet) await disconnect(wallet);
    }

    return (
        <div className="containerWallet">
            {wallet ? (
                <>
                    <Button color="danger" variant="flat" onPress={handleDisconnectWallet}>Desconectar Wallet</Button>
                    <Button color="primary" variant="flat" onPress={() => setShowInfoWallet(!showInfoWallet)}> {wallet.accounts[0].address === import.meta.env.VITE_CONTRACT_OWNER.toLowerCase() ? 'Admin' : 'User'}</Button>

                    {showInfoWallet && (
                        <div className="containerInfoWallet">
                            <h4>Wallet</h4>
                            <p className="walletAddress">{wallet ? wallet.accounts[0]?.address : 'Direccion desconocida'}</p>
                            <h4>Chain</h4>
                            <p className="chainId">{chains.length > 0 ? parseInt(chains[0].id) : 'Chain desconocida'}</p>
                        </div>
                    )}
                </>
            ) : (
                <Button color="primary" variant="flat" onPress={handleConnectWallet}>Conectar Wallet</Button>
            )}
        </div>
    );

}

export default ConnectWallet;