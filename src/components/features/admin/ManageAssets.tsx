import { useMemo } from 'react';
import { useAssets } from '@/hooks/useAssets';
import { AssetGrid } from '@/components/common/AssetGrid';
import PendingAssetCard from './assets/PendingAssetCard';
import ListedAssetCard from './assets/ListedAssetCard';
import MintAssetCard from './assets/MintAssetCard';

const ManageAssets = () => {
    const { assets, isLoading, refreshAssets } = useAssets();

    // Lista de activos minteados y en espera de ser liberados al mercado
    const pendingAssets = useMemo(() =>
        assets.filter(a => Number(a.balance) - Number(a.available) > 0),
        [assets]
    );

    // Lista de activos ya liberados al mercado
    const listedAssets = useMemo(() =>
        assets.filter(a => a.available > 0),
        [assets]
    );

    return (
        <div className="p-2 space-y-8">

            {/* Mint */}
            <MintAssetCard
                onUpdate={refreshAssets}
            />

            {/* Pendientes */}
            <AssetGrid
                title="Activos pendientes de liberar"
                isLoading={isLoading}
                items={pendingAssets}
                emptyMessage="No hay activos pendientes de liberar."
                renderItem={(asset) => (
                    <PendingAssetCard
                        key={`${asset.contract.address}-${asset.tokenId}`}
                        asset={asset}
                        onUpdate={refreshAssets}
                    />
                )}
            />

            <div className="border-t border-gray-200" />

            {/* Liberados */}
            <AssetGrid
                title="Activos liberados al mercado"
                isLoading={isLoading}
                items={listedAssets}
                emptyMessage="No hay activos liberados al mercado."
                renderItem={(asset) => (
                    <ListedAssetCard
                        key={`${asset.contract.address}-${asset.tokenId}`}
                        asset={asset}
                        onUpdate={refreshAssets}
                    />
                )}
            />
        </div>
    );
};

export default ManageAssets;