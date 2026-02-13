import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { parseUnits, formatEther } from "ethers";
import { mintToken, burnToken } from "@/contracts/functions/DigitalCurrency";

const MintCurrencyCard = ({ onUpdate }: { onUpdate: () => void }) => {
    const [isMinting, setIsMinting] = useState<boolean>(false);
    const [isBurning, setIsBurning] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const decimals = 18;

    const { signer } = useWallet();

    const handleMint = async () => {
        setIsMinting(true);

        try {
            const amountBI = parseUnits(amount, decimals);
            const result = await mintToken(address, amountBI, signer!);
            console.log(formatEther(result.value) + " CBCD emitidos a " + result.to);
            toast.success("Exito", {
                description: `${formatEther(result.value)} CBCD emitidos a ${result.to}`,
            });
        } catch (error) {
            console.log("Error al emitir CBCD", error);
            toast.error("Error", {
                description: `Error al emitir CBCD: ${error}`,
            });
        }
        setIsMinting(false);
        onUpdate?.();
    }

    const handleBurn = async () => {
        setIsBurning(true);

        try {
            const amountBI = parseUnits(amount, decimals);
            const result = await burnToken(amountBI, signer!);
            console.log(formatEther(result.value) + " CBCD quemados");
            toast.success("Exito", {
                description: `${formatEther(result.value)} CBCD quemados`,
            });
        } catch (error) {
            console.log("Error al quemar CBCD", error);
            toast.error("Error", {
                description: `Error al quemar CBCD: ${error}`,
            });
        }
        setIsBurning(false);
        onUpdate?.();
    }

    return (
        <Item variant="outline" className="bg-blue-100 border-2 border-blue-300">
            <ItemMedia>
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                    <Avatar className="hidden sm:flex">
                        <AvatarImage src="https://gateway.pinata.cloud/ipfs/bafkreiatxyjaeiwywmqfwedcgycj6u27j6dnlwghqlhbyy7ehb72rpbggu" alt="CBCD" />
                        <AvatarFallback>CBCD</AvatarFallback>
                    </Avatar>
                </div>
            </ItemMedia>
            <ItemContent>
                <ItemTitle>CBCD</ItemTitle>
                <ItemDescription>
                    Token para usar en el mercado
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Input className="bg-gray-100 w-90 mr-2" id="input-address" type="text" placeholder="Address (Para Mintear)" onChange={(e) => { setAddress(e.target.value) }} />
                <Input className="bg-gray-100 w-24 mr-2" id="input-mint" type="number" placeholder="Cantidad" min={1} onChange={(e) => { if (Number(e.target.value) > 0) setAmount(e.target.value); else setAmount("") }} />
                {isMinting
                    ? <Button size="sm" variant="outline" className="bg-blue-500 m-2" disabled>Procesando...</Button>
                    : <Button size="sm" variant="outline" className="bg-green-300 m-2" disabled={Number(amount) <= 0 || address === ""} onClick={() => handleMint()}>Mint</Button>
                }
                {isBurning
                    ? <Button size="sm" variant="outline" className="bg-blue-500 m-2" disabled>Procesando...</Button>
                    : <Button size="sm" variant="outline" className="bg-red-300 m-2" disabled={Number(amount) <= 0} onClick={() => handleBurn()}>Quemar</Button>
                }
            </ItemActions>
        </Item>
    );
};

export default MintCurrencyCard;
