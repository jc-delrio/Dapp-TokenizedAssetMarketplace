import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle, ItemActions } from "@/components/ui/item"
import { type Asset } from "@/contracts/functions/AlchemySDK";

interface Attribute {
    trait_type: string;
    value: string | number;
}

interface AssetItemProps {
    asset: Asset;
    amount: string;
    children?: ReactNode;
}

export const AssetItem = ({ asset, amount, children }: AssetItemProps) => {

    const imageUrl = asset.image.cachedUrl || asset.image.originalUrl || 'https://gateway.pinata.cloud/ipfs/bafkreihzwwaawy57igvrve3cnlhsv2tdneqvi5vc5p2udbrqsykaz4grbq';
    const title = '#' + asset.tokenId + ' ' + asset.name || `Token Sin Nombre #${asset.tokenId}`;
    const rawMetadata = asset.raw.metadata as any;
    const attributes: Attribute[] = Array.isArray(rawMetadata?.attributes)
        ? rawMetadata.attributes
        : [];

    return (
        <div className="flex w-full bg-blue-100 border-2 border-blue-300 rounded-lg m-2 p-1">
            <Item variant="outline" className="flex-row w-full border-none shadow-none bg-transparent">

                <ItemMedia>
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                        <Avatar className="h-16 w-16 rounded-lg border border-gray-200">
                            <AvatarImage src={imageUrl} alt="TOKEN" />
                            <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                    </div>
                </ItemMedia>

                <ItemContent className="flex-1 min-w-80 pr-4">
                    <ItemTitle className='flex flex-col'>
                        {title} - Cantidad: {amount}
                    </ItemTitle>
                    <ItemDescription className='flex flex-col'>
                        {asset.description}
                    </ItemDescription>

                    {attributes.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {attributes.map((attr, i) => (
                                <div key={i} className="bg-white/80 p-2 rounded border border-blue-100 flex flex-col">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">
                                        {attr.trait_type}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-700 truncate" title={String(attr.value)}>
                                        {attr.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </ItemContent>

                {children && (
                    <ItemActions className="flex flex-col gap-2 justify-center min-w-[140px] ml-auto border-l border-blue-200 pl-4 my-auto">
                        {children}
                    </ItemActions>
                )}

            </Item>
        </div>
    );
};