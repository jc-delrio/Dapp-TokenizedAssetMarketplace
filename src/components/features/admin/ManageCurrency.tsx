import { useState, useEffect } from "react";
import { useWallet } from '@/hooks/useWallet';
import { getBalance } from "@/contracts/functions/DigitalCurrency";
import { formatUnits } from "ethers";
import CurrencyCard from "./currency/CurrencyCard";

const ManageCurrency = () => {
    const [balance, setBalance] = useState<string>("");
    const decimals = 18;

    const { wallet, signer, isWeb3Loading } = useWallet();

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

            <CurrencyCard onUpdate={() => handleGetBalance(wallet!.accounts[0].address)} />

        </div>
    )
}

export default ManageCurrency