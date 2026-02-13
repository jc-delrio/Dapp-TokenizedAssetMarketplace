import { useState, useCallback, useEffect } from 'react';
import { useWeb3 } from '@/providers/Web3Provider';
import { getAssetList } from '@/contracts/functions/Acquisition';
import { getTokensForOwner, type Asset } from '@/contracts/functions/AlchemySDK';

// Hook para control de activos
export const useAssets = (external_account?: string) => {
    const { account, signer } = useWeb3();

    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshAssets = useCallback(async () => {
        let used_account = account;
        if (external_account) {
            used_account = external_account;
        } else {
            used_account = account;
        }
        if (!used_account) {
            setAssets([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const ownedTokens = await getTokensForOwner(used_account, signer!);

            const assetInfoPromises = ownedTokens.map(async (token) => {
                try {
                    const marketData = await getAssetList(token.tokenId, signer!);

                    // Se extiende con la información obtenida del mapping assetList del contrato Acquisition
                    return {
                        ...token,
                        value: marketData.value,
                        listed: marketData.listed,
                        available: marketData.available,
                        marketable: marketData.marketable,
                    } as Asset;
                } catch (innerError) {
                    console.error(`Error cargando detalles del activo ${token.tokenId}`, innerError);
                    return null;
                }
            });

            const results = await Promise.all(assetInfoPromises);

            const validAssets = results.filter((a): a is Asset => a !== null);

            setAssets(validAssets);

        } catch (err) {
            console.error("Error general buscando activos:", err);
            setError("No se pudieron cargar los activos.");
        } finally {
            setIsLoading(false);
        }
    }, [account]);

    useEffect(() => {
        refreshAssets();
    }, [refreshAssets]);

    return {
        assets,
        isLoading,
        error,
        refreshAssets
    };
};