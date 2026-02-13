import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetItem } from '@/components/common/AssetItem';
import { buyAsset } from '@/contracts/functions/Acquisition';
import { type Asset } from '@/contracts/functions/AlchemySDK';
import { useWeb3 } from '@/providers/Web3Provider';
import { checkAllowance } from '@/contracts/functions/DigitalCurrency';
import { toast } from 'sonner';
import { parseUnits, formatEther } from 'ethers';

const ACQUISITION_ADDRESS = import.meta.env.VITE_ACQUISITION_ADDRESS;

const SupplyAssetCard = ({ asset, onUpdate }: { asset: Asset, onUpdate?: () => void }) => {
    const { signer } = useWeb3();

    const [amount, setAmount] = useState<string>("");
    const [isBuying, setIsBuying] = useState(false);
    const decimals = 18;

    const handleBuyAsset = async () => {
        setIsBuying(true);
        try {
            const amountBI = BigInt(amount || '0');
            const totalValue = parseUnits((Number(amount) * Number(asset.value)).toString(), decimals);

            await checkAllowance(ACQUISITION_ADDRESS, totalValue, signer!);
            const result = await buyAsset(asset.tokenId, amountBI, signer!);
            console.log(`${result.buyer} compró ${formatEther(amountBI)} tokens (ID: ${result.id}) por ${result.totalValue} CBCD`);
            toast.success(`${result.buyer} compró ${formatEther(amountBI)} tokens (ID: ${result.id}) por ${result.totalValue} CBCD`);
        } catch (error) {
            console.error("Error al comprar:", error);
            toast.error("Error al comprar");
        } finally {
            setIsBuying(false);
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
                                type="text"
                                placeholder="Precio"
                                value={formatEther(asset.value) + " CBCD"}
                                disabled
                                className="bg-white"
                            />
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
                                disabled={Number(amount) < 1 || Number(amount) > Number(asset.balance) || isBuying}
                                onClick={handleBuyAsset}
                            >
                                {isBuying ? "Procesando..." : Number(amount) > 0 && Number(amount) <= Number(asset.balance) ? "Comprar por " + formatEther(BigInt(Number(amount) * Number(asset.value))) + " CBCD" : "Comprar"}
                            </Button>
                        </div>
                    </div>
                </div>
            </AssetItem>
        </div>
    );
};

export default SupplyAssetCard;
