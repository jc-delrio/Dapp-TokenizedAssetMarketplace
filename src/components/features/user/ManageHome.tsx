import { useState, useEffect, useMemo } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAssets } from "@/hooks/useAssets";
import { formatUnits } from "ethers";
import { getBalance } from "@/contracts/functions/DigitalCurrency";
import TransferCurrencyCard from "./currency/TransferCurrencyCard";
import { AssetGrid } from "@/components/common/AssetGrid";
import OwnedAssetsCard from "./assets/OwnedAssetsCard";

const ManageHome = () => {
    const [balance, setBalance] = useState<string>("");
    const { wallet, signer, isWeb3Loading } = useWallet();
    const { assets, refreshAssets } = useAssets();
    const decimals = 18;

    const ownedAssets = useMemo(() =>
        assets,
        [assets]
    );

    useEffect(() => {
        if (isWeb3Loading || !wallet || !signer) return;
        handleGetBalance(wallet.accounts[0].address);
    }, [wallet]);

    const handleGetBalance = async (address: string) => {
        const balance = await getBalance(address, signer!);
        console.log("Balance: " + formatUnits(balance, decimals));
        setBalance(formatUnits(balance, decimals));
    }

    return (
        <div className="flex flex-col gap-6 m-4 ">
            <div className="flex flex-col text-center font-bold">
                <p>Balance: {balance} CBCD</p>
            </div>

            <TransferCurrencyCard
                onUpdate={() => handleGetBalance(wallet!.accounts[0].address)}
            />

            <AssetGrid
                title="Activos"
                isLoading={isWeb3Loading}
                items={ownedAssets}
                emptyMessage="No hay activos."
                renderItem={(asset) => (
                    <OwnedAssetsCard
                        key={`${asset.contract.address}-${asset.tokenId}`}
                        asset={asset}
                        onUpdate={() => refreshAssets()}
                    />
                )}
            />
        </div>
    );
};

export default ManageHome;