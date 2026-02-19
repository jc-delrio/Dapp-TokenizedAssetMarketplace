import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAssets } from "@/hooks/useAssets";
import { formatUnits } from "ethers";
import { getBalance } from "@/contracts/functions/DigitalCurrency";
import TransferCurrencyCard from "./currency/TransferCurrencyCard";
import { AssetGrid } from "@/components/common/AssetGrid";
import OwnedAssetsCard from "./assets/OwnedAssetsCard";

const ManageHome = () => {
    const [balance, setBalance] = useState<string>("--");
    const { wallet, signer, isWeb3Loading } = useWallet();
    const { assets, refreshAssets } = useAssets();
    const decimals = 18;

    // 1. REF: Guardamos la última dirección cargada
    const lastFetchedAddress = useRef<string | null>(null);
    // 2. NUEVO REF: Semáforo para saber si hay una petición "en vuelo"
    const isFetchingRef = useRef(false);

    const ownedAssets = useMemo(() => assets, [assets]);

    const handleGetBalance = useCallback(async (force = false) => {
        if (!wallet?.accounts[0]?.address || isWeb3Loading || !signer) return;

        const currentAddress = wallet.accounts[0].address;

        // 3. BLOQUEO DE CONCURRENCIA:
        // Si ya hay una petición ocurriendo ahora mismo, cancelamos esta nueva.
        if (isFetchingRef.current) return;

        // 4. BLOQUEO DE CACHÉ:
        // Si no forzamos y ya tenemos esta dirección cargada, salimos.
        if (!force && lastFetchedAddress.current === currentAddress) {
            return;
        }

        try {
            // 5. ACTIVAR SEMÁFORO (Inmediatamente antes del await)
            isFetchingRef.current = true;

            console.log("Fetching Balance (RPC Call)...");
            const balanceResult = await getBalance(currentAddress, signer);

            const formatted = formatUnits(balanceResult, decimals);
            console.log("Balance:", formatted);
            setBalance(formatted);

            // Actualizamos la caché de dirección
            lastFetchedAddress.current = currentAddress;

        } catch (error) {
            console.error("Error obteniendo balance:", error);
        } finally {
            // 6. LIBERAR SEMÁFORO
            isFetchingRef.current = false;
        }
    }, [wallet, signer, isWeb3Loading]);

    useEffect(() => {
        // Solo intentamos cargar si tenemos todo lo necesario
        if (!isWeb3Loading && wallet && signer) {
            handleGetBalance(false);
        }
    }, [isWeb3Loading, wallet, signer, handleGetBalance]);

    return (
        <div className="flex flex-col gap-6 m-4 ">
            <div className="flex flex-col text-center font-bold">
                <p>Balance: {balance} CBCD</p>
            </div>

            <TransferCurrencyCard
                onUpdate={() => handleGetBalance(true)} // true = forzar recarga
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
                        onUpdate={() => { refreshAssets(); handleGetBalance(true); }}
                    />
                )}
            />
        </div>
    );
};

export default ManageHome;