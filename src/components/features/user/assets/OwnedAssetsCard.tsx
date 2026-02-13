import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetItem } from '@/components/common/AssetItem';
import { sellAsset } from '@/contracts/functions/Acquisition';
import { type Asset } from '@/contracts/functions/AlchemySDK';
import { useWeb3 } from '@/providers/Web3Provider';
import { checkApprovalForAll } from '@/contracts/functions/DigitalAssets';

const ACQUISITION_ADDRESS = import.meta.env.VITE_ACQUISITION_ADDRESS;

const OwnedAssetsCard = ({ asset, onUpdate }: { asset: Asset, onUpdate?: () => void }) => {
    const { account, signer } = useWeb3();

    const [amount, setAmount] = useState<string>("");
    const [isSelling, setIsSelling] = useState(false);

    const handleSellAsset = async () => {
        setIsSelling(true);
        try {
            const amountBI = BigInt(amount || "0");

            await checkApprovalForAll(account!, ACQUISITION_ADDRESS, signer!);
            const newToken = await sellAsset(asset.tokenId, amountBI, signer!);
            console.log(`${newToken.amount} tokens (ID: ${newToken.id}) vendidos al fondo`);
        } catch (error) {
            console.error("Error al vender:", error);
        } finally {
            setIsSelling(false);
            onUpdate?.();
        }
    };

    return (
        <div className="flex flex-row w-full">
            <AssetItem asset={asset} amount={asset.available.toString()}>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                type="number"
                                placeholder="Cantidad"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                        <div className="flex-1">
                            <Button
                                className="w-full bg-yellow-500"
                                disabled={amount < "1" || amount > asset.balance || isSelling}
                                onClick={handleSellAsset}
                            >
                                {isSelling ? "Procesando..." : "Vender"}
                            </Button>

                        </div>
                    </div>
                    <div className="flex flex-col gap-2">

                    </div>
                </div>
            </AssetItem>
        </div>
    );
};

export default OwnedAssetsCard;
