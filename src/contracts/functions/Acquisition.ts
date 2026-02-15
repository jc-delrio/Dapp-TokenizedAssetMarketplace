import tokenAbi from "../abis/Acquisition.json" with { type: "json" };
import { ethers, type Signer } from "ethers";
import { decodeError } from "../utils/decodeError";

const ACQUISITION_ADDRESS = import.meta.env.VITE_ACQUISITION_ADDRESS;

export const listNewAsset = async (id: string, supply: bigint, value: bigint, marketable: boolean, signer: Signer) => {
    const AcquisitionContract = new ethers.Contract(ACQUISITION_ADDRESS, tokenAbi, signer);
    try {
        const tx = await AcquisitionContract.listNewAsset(id, supply, value, marketable);
        const receipt = await tx.wait();

        // Lectura de evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = AcquisitionContract.interface.parseLog(log);

                if (parsed && parsed.name === 'AssetListed') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                console.error("Error al leer evento:", e);
                continue;
            }
        }

        // Fallback
        const finalId = eventArgs ? eventArgs[0] : id;
        const finalSupply = eventArgs ? eventArgs[1] : supply;
        const finalValue = eventArgs ? eventArgs[2] : value;

        return {
            hash: receipt.hash,
            id: finalId,
            supply: finalSupply.toString(),
            value: finalValue.toString()
        };
    } catch (error: any) {
        const decodedError = decodeError(error, AcquisitionContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
};

// Función para desabastecer activos
export const delistAsset = async (id: string, desupply: bigint, signer: Signer) => {
    const AcquisitionContract = new ethers.Contract(ACQUISITION_ADDRESS, tokenAbi, signer);
    try {
        const tx = await AcquisitionContract.delistAsset(id, desupply);
        const receipt = await tx.wait();

        // Lectura de evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = AcquisitionContract.interface.parseLog(log);

                if (parsed && parsed.name === 'AssetDelisted') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalId = eventArgs ? eventArgs[0] : id;
        const finalDesupply = eventArgs ? eventArgs[1] : desupply;

        return {
            hash: receipt.hash,
            id: finalId,
            desupply: finalDesupply.toString()
        };
    } catch (error: any) {
        const decodedError = decodeError(error, AcquisitionContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

// Función para actualizar los datos de un activo suministrado
export const updateAsset = async (id: string, value: bigint, marketable: boolean, signer: Signer) => {
    const AcquisitionContract = new ethers.Contract(ACQUISITION_ADDRESS, tokenAbi, signer);
    try {
        const tx = await AcquisitionContract.updateAsset(id, value, marketable);
        const receipt = await tx.wait();

        // Lectura de evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = AcquisitionContract.interface.parseLog(log);

                if (parsed && parsed.name === 'AssetUpdated') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalId = eventArgs ? eventArgs[0] : id;
        const finalValue = eventArgs ? eventArgs[1] : value;
        const finalMarketable = eventArgs ? eventArgs[2] : marketable;

        return {
            hash: receipt.hash,
            id: finalId,
            value: finalValue.toString(),
            marketable: finalMarketable
        };
    } catch (error: any) {
        const decodedError = decodeError(error, AcquisitionContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

export const buyAsset = async (id: string, amount: bigint, signer: Signer) => {
    const AcquisitionContract = new ethers.Contract(ACQUISITION_ADDRESS, tokenAbi, signer);
    try {
        const tx = await AcquisitionContract.buyAsset(id, amount);
        const receipt = await tx.wait();

        // Lectura de evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = AcquisitionContract.interface.parseLog(log);

                if (parsed && parsed.name === 'AssetBought') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalBuyer = eventArgs ? eventArgs[0] : await signer.getAddress();
        const finalId = eventArgs ? eventArgs[1] : id;
        const finalAmount = eventArgs ? eventArgs[2] : amount;
        const finalValue = eventArgs ? eventArgs[3] : 0n;

        return {
            hash: receipt.hash,
            buyer: finalBuyer,
            id: finalId,
            amount: finalAmount.toString(),
            totalValue: finalValue.toString()
        };
    } catch (error: any) {
        const decodedError = decodeError(error, AcquisitionContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

export const sellAsset = async (id: string, amount: bigint, signer: Signer) => {
    const AcquisitionContract = new ethers.Contract(ACQUISITION_ADDRESS, tokenAbi, signer);
    try {
        const tx = await AcquisitionContract.sellAsset(id, amount);
        const receipt = await tx.wait();

        // Lectura de evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = AcquisitionContract.interface.parseLog(log);

                if (parsed && parsed.name === 'AssetSold') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalSeller = eventArgs ? eventArgs[0] : await signer.getAddress();
        const finalId = eventArgs ? eventArgs[1] : id;
        const finalAmount = eventArgs ? eventArgs[2] : amount;
        const finalValue = eventArgs ? eventArgs[3] : 0n;

        return {
            hash: receipt.hash,
            seller: finalSeller,
            id: finalId,
            amount: finalAmount.toString(),
            totalValue: finalValue.toString()
        };
    } catch (error: any) {
        const decodedError = decodeError(error, AcquisitionContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

// Función para obtener los activos suministrados y sus datos
export const getAssetList = async (id: string, signer: Signer) => {
    const AcquisitionContract = new ethers.Contract(ACQUISITION_ADDRESS, tokenAbi, signer);
    const assetList = await AcquisitionContract.assetList(id);
    return assetList;
};

export const pause = async (signer: Signer) => {
    const AcquisitionContract = new ethers.Contract(ACQUISITION_ADDRESS, tokenAbi, signer);
    const tx = await AcquisitionContract.pause();
    const receipt = await tx.wait();
    return receipt.status === 1;
};

export const unpause = async (signer: Signer) => {
    const AcquisitionContract = new ethers.Contract(ACQUISITION_ADDRESS, tokenAbi, signer);
    const tx = await AcquisitionContract.unpause();
    const receipt = await tx.wait();
    return receipt.status === 1;
};

export const isPaused = async (signer: Signer) => {
    const AcquisitionContract = new ethers.Contract(ACQUISITION_ADDRESS, tokenAbi, signer);
    const paused = await AcquisitionContract.paused();
    return paused;
};
