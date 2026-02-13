import { Network, Alchemy, NftFilters, type OwnedNft } from 'alchemy-sdk';
import { getMaxSupply } from "./DigitalAssets";
import { type Signer } from "ethers";

// Configuración Alchemy
const settings = {
    apiKey: import.meta.env.VITE_RPC_API_KEY,
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

// Exportamos el tipo Asset para usarlo externamente 
export interface Asset extends OwnedNft {
    maxSupply: string;
    price: string;
    listed: bigint;
    available: bigint;
    marketable: boolean;
}

// Función para obtener los tokens de una direccion (Alchemy SDK)
export const getTokensForOwner = async (ownerAddress: string, signer: Signer) => {
    const tokens = await alchemy.nft.getNftsForOwner(ownerAddress, {
        excludeFilters: [NftFilters.SPAM],
        pageSize: 100
    });

    const data = await Promise.all(tokens.ownedNfts.map(async (token) => {
        const maxSupply = await getMaxSupply(token.tokenId, signer!);
        return {
            ...token,
            maxSupply: maxSupply.toString(),
            price: "0",
            listed: 0n,
            available: 0n,
            marketable: false,
        } as Asset;
    }));

    return data;
};