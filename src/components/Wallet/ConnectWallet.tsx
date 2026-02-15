import { useWallet } from "../../hooks/useWallet";
import { useChain } from "../../hooks/useChain";
import { useOwner } from "../../hooks/useOwner";
import { useWeb3 } from "../../providers/Web3Provider";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import chainIDs from "../../lib/chainIDs";

import { useState } from "react";

const ConnectWallet = () => {
    const { wallet, connect, disconnect } = useWallet();
    const { chains, setChain } = useChain();
    const { isOwner } = useOwner();
    const { account, chainId } = useWeb3();

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

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(account!);
        toast.success("Direccion copiada");
    }

    const handleInfoWallet = () => {
        setShowInfoWallet(!showInfoWallet);
        setTimeout(() => setShowInfoWallet(false), 5000);
    }

    return (
        <div className="top-5 right-5 absolute">

            {wallet ? (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleDisconnectWallet}>Desconectar Wallet</Button>
                        <Button variant="default" onClick={() => handleInfoWallet()}> {isOwner ? 'Admin' : 'User'}</Button>
                    </div>

                    {showInfoWallet && (
                        <div className="absolute z-50 top-10 right-0 bg-yellow-50 p-2 rounded-md flex flex-col gap-2">
                            <h2 className="font-bold">Wallet
                                <CopyIcon className="inline-block m-2 hover:cursor-pointer" onClick={() => handleCopyAddress()} />
                            </h2>
                            <p className="walletAddress">{account}</p>
                            <h2 className="font-bold">Chain</h2>
                            <p className="chainId">{chainId ? chainIDs[parseInt(chainId)] : 'Chain desconocida'}</p>
                        </div>
                    )}
                </div>
            ) : (
                <Button variant="default" onClick={handleConnectWallet}>Conectar Wallet</Button>
            )}
        </div>
    );

}

export default ConnectWallet;