import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Item, ItemContent, ItemDescription, ItemActions, ItemMedia, ItemTitle } from "@/components/ui/item"
import { mintAsset } from '@/contracts/functions/DigitalAssets';
import { useWeb3 } from '@/providers/Web3Provider';
import { toast } from 'sonner';

const MintAssetCard = ({ onUpdate }: { onUpdate: () => void }) => {
    const { signer } = useWeb3();
    const [amount, setAmount] = useState<string>("");
    const [id, setId] = useState<string>("");
    const [isMinting, setIsMinting] = useState(false);

    const handleMintAsset = async () => {
        setIsMinting(true);
        try {
            const amountBI = BigInt(amount || "0");
            const newToken = await mintAsset(id, amountBI, signer!);
            console.log(`${newToken.value} tokens (ID: ${newToken.id}) minteados a ${newToken.to}`);
            toast.success("Exito", { description: `${newToken.value} tokens (ID: ${newToken.id}) minteados a ${newToken.to}` });
        } catch (error) {
            console.error("Error al mintear:", error);
            toast.error("Error", { description: "Error al mintear" });
        } finally {
            setIsMinting(false);
            onUpdate?.();
        }
    };

    return (
        <div className="flex flex-col gap-6 m-4">

            <div className="flex flex-col text-center">
                <p>Cantidad 1: Token NFT | Cantidad 1+: Token Fungible</p>
                <p>ID 0 - 99999: Inmuebles | ID 100000 - 499999: Vehículos | ID 500000+: Accesorios</p>
            </div>

            <div className="flex flex-row items-center justify-center">
                <Item variant="outline" className="bg-blue-100 border-2 border-blue-300 w-200">
                    <ItemMedia>
                        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                            <Avatar className="hidden sm:flex">
                                <AvatarImage src="" alt="ASSET" />
                                <AvatarFallback>ASSET</AvatarFallback>
                            </Avatar>
                        </div>
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>EMITIR NUEVO ASSET</ItemTitle>
                        <ItemDescription>
                            Activo tokenizado
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
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
                                        placeholder="ID"
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    className="w-full"
                                    disabled={Number(amount) < 1 || id === "" || isMinting}
                                    onClick={handleMintAsset}
                                >
                                    {isMinting ? "Procesando..." : "Mint"}
                                </Button>
                            </div>
                        </div>
                    </ItemActions>
                </Item>
            </div>


        </div>
    );
};

export default MintAssetCard;
