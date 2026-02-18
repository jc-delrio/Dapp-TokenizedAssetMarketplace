import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWeb3 } from '@/providers/Web3Provider';
import { formatEther, parseUnits } from "ethers";
import { transferToken, burnToken } from '@/contracts/functions/DigitalCurrency';
import { toast } from 'sonner';

const TransferCurrencyCard = ({ onUpdate }: { onUpdate: () => void }) => {
    const { signer } = useWeb3();
    const [amount, setAmount] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [isTransferring, setIsTransferring] = useState(false);
    const [isBurning, setIsBurning] = useState(false);
    const decimals = 18;

    const handleTransferCurrency = async () => {
        setIsTransferring(true);
        try {
            const amountBI = parseUnits(amount, decimals);

            await transferToken(address, amountBI, signer!);
            console.log(`${amount} tokens transferidos a ${address}`);
            toast.success(`${amount} tokens transferidos a ${address}`);
        } catch (error) {
            console.error("Error al transferir:", error);
            toast.error("Error al transferir");
        } finally {
            setIsTransferring(false);
            onUpdate?.();
        }
    };

    const handleBurnCurrency = async () => {
        setIsBurning(true);
        try {
            const amountBI = parseUnits(amount, decimals);

            const result = await burnToken(amountBI, signer!);
            console.log(`${formatEther(result.value)} tokens quemados`);
            toast.success(`${formatEther(result.value)} tokens quemados`);
        } catch (error) {
            console.error("Error al quemar:", error);
            toast.error("Error al quemar");
        } finally {
            setIsBurning(false);
            onUpdate?.();
        }
    };

    return (
        <div className="flex flex-col gap-6 m-4">
            <div className="flex flex-row items-center justify-center">
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
                        <Input className="bg-gray-100 w-90 mr-2" id="input-address" type="text" placeholder="Address (Para transferir)" onChange={(e) => { setAddress(e.target.value) }} />
                        <Input className="bg-gray-100 w-24 mr-2" id="input-mint" type="number" placeholder="Cantidad" min={1} onChange={(e) => { if (Number(e.target.value) > 0) setAmount(e.target.value); else setAmount("") }} />

                        {isTransferring
                            ? <Button size="sm" variant="outline" className="bg-blue-500 m-2" disabled>Procesando...</Button>
                            : <Button size="sm" variant="outline" className="bg-green-300 m-2" disabled={Number(amount) <= 0 || address === ""} onClick={() => handleTransferCurrency()}>Transferir</Button>
                        }

                        {isBurning
                            ? <Button size="sm" variant="outline" className="bg-blue-500 m-2" disabled>Procesando...</Button>
                            : <Button size="sm" variant="outline" className="bg-red-300 m-2" disabled={Number(amount) <= 0} onClick={() => handleBurnCurrency()}>Quemar</Button>
                        }
                    </ItemActions>
                </Item>
            </div>


        </div>
    );
};

export default TransferCurrencyCard;
