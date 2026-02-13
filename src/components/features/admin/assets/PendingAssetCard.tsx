import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { listNewAsset } from '@/contracts/functions/Acquisition';
import { burnAsset } from '@/contracts/functions/DigitalAssets';
import { AssetItem } from '@/components/common/AssetItem';
import { type Asset } from '@/contracts/functions/AlchemySDK';
import { useWeb3 } from '@/providers/Web3Provider';
import { checkApprovalForAll } from '@/contracts/functions/DigitalAssets';
import { formatEther, MaxUint256, parseUnits } from 'ethers';
import { checkAllowance } from '@/contracts/functions/DigitalCurrency';

const ACQUISITION_ADDRESS = import.meta.env.VITE_ACQUISITION_ADDRESS;

const PendingAssetCard = ({ asset, onUpdate }: { asset: Asset, onUpdate: () => void }) => {
    const { account, signer } = useWeb3();
    const [amount, setAmount] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [marketable, setMarketable] = useState(false);
    const [isListing, setIsListing] = useState(false);
    const [isBurning, setIsBurning] = useState(false);

    const handleListNewAsset = async () => {
        setIsListing(true);
        const amountBI = BigInt(amount || "0");
        const priceWei = parseUnits(price || "0", 18);
        try {
            const tx = await listNewAsset(asset.tokenId, amountBI, priceWei, marketable, signer!);

            await checkApprovalForAll(account!, ACQUISITION_ADDRESS, signer!); // Damos permiso al contrato para gestionar los activos liberados al mercado
            await checkAllowance(ACQUISITION_ADDRESS, MaxUint256, signer!); // Damos permiso al contrato para gestionar los CBCD del fondo

            console.log(`${tx!.supply} tokens (ID: ${tx!.id}) "${marketable ? "venta permitida" : "venta no permitida"}" listados por valor de ${formatEther(tx!.value)}`);
            toast.success("Exito", { description: `${tx!.supply} tokens (ID: ${tx!.id}) "${marketable ? "venta permitida" : "venta no permitida"}" listados por valor de ${formatEther(tx!.value)}` });
        } catch (error) {
            toast.error("Error");
        } finally {
            setIsListing(false);
            onUpdate?.();
        }
    };

    const handleBurnAsset = async () => {
        setIsBurning(true);
        try {
            const amountBI = BigInt(amount || "0");

            const tx = await burnAsset(asset.tokenId, amountBI, signer!);
            console.log(`${tx.value} tokens (ID: ${tx.id}) quemados`);
            toast.success("Exito", { description: `${tx.value} tokens (ID: ${tx.id}) quemados` });
        } catch (error) {
            console.error("Error al quemar:", error);
            toast.error("Error", { description: "Error al quemar" });
        } finally {
            setIsBurning(false);
            onUpdate?.();
        }
    };

    return (
        <div className="flex flex-row w-full">
            <AssetItem asset={asset} amount={(Number(asset.balance) - Number(asset.available)).toString()}>
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
                            <Input
                                type="number"
                                placeholder="Precio"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            className='border-blue-500'
                            id={`marketable-${asset.tokenId}`}
                            checked={marketable}
                            onCheckedChange={(checked) => setMarketable(checked as boolean)}
                        />
                        <label
                            htmlFor={`marketable-${asset.tokenId}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Permitir venta
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            className="w-full"
                            disabled={Number(amount) < 1 || Number(amount) > Number(asset.balance) || Number(price) < 1 || isListing}
                            onClick={handleListNewAsset}
                        >
                            {isListing ? "Procesando..." : "Liberar al Mercado"}
                        </Button>
                        <Button
                            className="w-full bg-red-500"
                            disabled={Number(amount) < 1 || Number(amount) > Number(asset.balance) || isBurning}
                            onClick={handleBurnAsset}
                        >
                            {isBurning ? "Procesando..." : "Quemar"}
                        </Button>
                    </div>
                </div>
            </AssetItem>
        </div>
    );
};

export default PendingAssetCard;
