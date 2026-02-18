import { useState, useCallback, useEffect, useRef } from 'react';
import { useWeb3 } from '@/providers/Web3Provider';
import { getAssetList } from '@/contracts/functions/Acquisition';
import { getTokensForOwner, type Asset } from '@/contracts/functions/AlchemySDK';

export const useAssets = (external_account?: string) => {
    const { account, signer, isWeb3Loading } = useWeb3();

    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Caché persistente
    const cache = useRef<Record<string, Asset[]>>({});

    // 2. Control para evitar llamadas duplicadas en vuelo
    const isFetchingRef = useRef<string | null>(null);

    const fetchData = useCallback(async (targetAccount: string, force: boolean) => {
        // Si ya estamos buscando datos para la misma cuenta
        if (isFetchingRef.current === targetAccount && !force) return;

        // Si hay caché
        if (!force && cache.current[targetAccount]) {
            console.log(`[Cache] Recuperando datos para ${targetAccount}`);
            setAssets(cache.current[targetAccount]);
            return;
        }

        isFetchingRef.current = targetAccount;
        setIsLoading(true);
        setError(null);

        try {
            console.log(`[API Call] Iniciando petición Alchemy para ${targetAccount}...`);

            const ownedTokens = await getTokensForOwner(targetAccount, signer!);

            const assetInfoPromises = ownedTokens.map(async (token) => {
                try {
                    const marketData = await getAssetList(token.tokenId, signer!);
                    return {
                        ...token,
                        price: marketData.value,
                        listed: marketData.listed,
                        available: marketData.available,
                        marketable: marketData.marketable,
                    } as Asset;
                } catch (e) { return null; }
            });

            const results = await Promise.all(assetInfoPromises);
            const validAssets = results.filter((a): a is Asset => a !== null);

            // Guardar en caché y estado
            cache.current[targetAccount] = validAssets;

            // Solo actualizamos si el componente sigue montado y la cuenta no cambió drásticamente
            setAssets(validAssets);

        } catch (err) {
            console.error(err);
            setError("Error cargando activos");
        } finally {
            setIsLoading(false);
            isFetchingRef.current = null; // Liberamos el lock
        }
    }, [signer]); // Dependencias mínimas para la función interna

    useEffect(() => {
        if (isWeb3Loading || !signer || !account) return;

        const targetAccount = external_account || account;

        // 3. DEBOUNCE: Esperar antes de llamar
        // Esto elimina el "doble render" de React StrictMode y el parpadeo del Signer
        const timer = setTimeout(() => {
            fetchData(targetAccount, false);
        }, 200);

        // Cleanup: Si account o signer cambian antes de 500ms, cancelamos el timer anterior
        return () => clearTimeout(timer);

    }, [account, external_account, signer, isWeb3Loading, fetchData]);

    // Función manual para el botón de "Recargar"
    const refreshAssets = () => {
        const target = external_account || account;
        if (target && signer) fetchData(target, true);
    };

    return { assets, isLoading, error, refreshAssets };
};