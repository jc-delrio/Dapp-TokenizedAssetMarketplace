import { useMemo } from "react";
import { useAssets } from "@/hooks/useAssets";
import { useOwner } from "@/hooks/useOwner";
import { AssetGrid } from "@/components/common/AssetGrid";
import SupplyAssetCard from "./assets/SupplyAssetCard";

const ManageOffer = () => {
    const { owner } = useOwner();
    const { assets, isLoading, refreshAssets } = useAssets(owner);

    const listedAssets = useMemo(() =>
        assets.filter(a => a.available > 0),
        [assets]
    );

    return (
        <div className="flex flex-col gap-6 m-4 ">
            <AssetGrid
                title="Activos Ofertados"
                isLoading={isLoading}
                items={listedAssets}
                emptyMessage="No hay ofertas."
                renderItem={(asset) => (
                    <SupplyAssetCard
                        key={`${asset.contract.address}-${asset.tokenId}`}
                        asset={asset}
                        onUpdate={() => refreshAssets()}
                    />
                )}
            />
        </div>
    );

};

export default ManageOffer;