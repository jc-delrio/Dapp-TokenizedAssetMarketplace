import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { AssetItem } from '@/components/common/AssetItem';
import { delistAsset, updateAsset } from '@/contracts/functions/Acquisition';
import { type Asset } from '@/contracts/functions/AlchemySDK';
import { useWeb3 } from '@/providers/Web3Provider';
import { formatEther, parseUnits } from 'ethers';

const ListedAssetCard = ({ asset, onUpdate }: { asset: Asset, onUpdate?: () => void }) => {
    const { signer } = useWeb3();

    const [amount, setAmount] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [marketable, setMarketable] = useState(false);
    const [isDelisting, setIsDelisting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const decimals = 18;

    useEffect(() => {
        setMarketable(asset.marketable);
        setPrice(formatEther(asset.value));
    }, [asset.marketable, asset.value]);

    const handleDelistAsset = async () => {
        setIsDelisting(true);
        try {
            const amountBI = BigInt(amount || "0");

            const tx = await delistAsset(asset.tokenId, amountBI, signer!);
            console.log(`${tx.desupply} tokens (ID: ${tx.id}) desabastecidos`);
            toast.success("Exito", { description: `${tx.desupply} tokens (ID: ${tx.id}) desabastecidos` });
        } catch (error) {
            console.error("Error al desabastecer:", error);
            toast.error("Error", { description: "Error al desabastecer" });
        } finally {
            setIsDelisting(false);
            onUpdate?.();
        }
    };

    const handleUpdateAsset = async () => {
        setIsUpdating(true);
        try {
            const priceWei = parseUnits(price || "0", decimals);

            const tx = await updateAsset(asset.tokenId, priceWei, marketable, signer!);
            console.log(`Activo (ID: ${tx.id}) actualizado a "${marketable ? "venta permitida" : "venta no permitida"}" con valor de ${formatEther(tx.value)}`);
        } catch (error) {
            console.error("Error al actualizar:", error);
        } finally {
            setIsUpdating(false);
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
                                disabled={Number(amount) < 1 || isDelisting}
                                onClick={handleDelistAsset}
                            >
                                {isDelisting ? "Procesando..." : "Desabastecer"}
                            </Button>

                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            placeholder="Precio"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="bg-white"
                        />

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


                        <Button
                            disabled={Number(price) < 1 || isUpdating}
                            onClick={handleUpdateAsset}
                        >
                            {isUpdating ? "Procesando..." : "Actualizar"}
                        </Button>

                    </div>

                    <div className="flex flex-col gap-2">



                    </div>
                </div>
            </AssetItem>
        </div>
    );
};

export default ListedAssetCard;
