import tokenAbi from "../abis/DigitalAssets.json" with { type: "json" };
import { ethers, type Signer } from "ethers";
import { decodeError } from "../utils/decodeError";

const ASSETS_ADDRESS = import.meta.env.VITE_ASSETS_ADDRESS;

const isApprovedForAll = async (owner: string, operator: string, signer: Signer) => {
    const AssetsContract = new ethers.Contract(ASSETS_ADDRESS, tokenAbi, signer);
    try {
        const approved = await AssetsContract.isApprovedForAll(owner, operator);
        return approved;
    } catch (error) {
        console.error("Error comporbando permisos:", error);
        return false;
    }
}

const setApprovalForAll = async (operator: string, signer: Signer) => {
    const AssetsContract = new ethers.Contract(ASSETS_ADDRESS, tokenAbi, signer);
    try {
        const tx = await AssetsContract.setApprovalForAll(operator, true);
        console.log("Assets: Transacción enviada:", tx.hash);

        // Esperar a que se mine la transacción
        const receipt = await tx.wait();
        return receipt.status === 1; // 1 = Éxito, 0 = Fallo
    } catch (error: any) {
        // Manejar rechazo del usuario específicamente
        if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
            console.log("Assets: Permiso rechazado por el usuario.");
        } else {
            console.error("Assets: Transacción fallida:", error);
        }
        throw error; // Re-lanzar para que la función padre se entere
    }
}

export const checkApprovalForAll = async (owner: string, operator: string, signer: Signer) => {
    console.log("Assets: Comprobando permisos...");

    const isAlreadyApproved = await isApprovedForAll(owner, operator, signer);

    if (isAlreadyApproved) {
        console.log("Assets: Permiso concedido para el operador: ", operator);
        return true;
    }

    console.log("Assets: Permiso no concedido. Solicitando firma...");
    try {
        const success = await setApprovalForAll(operator, signer);
        if (success) {
            console.log("Assets: Permiso concedido");
            return true;
        }
    } catch (error) {
        // Aquí capturamos si el usuario rechazó o falló la tx
        console.log("Assets: Permiso no concedido");
        return false;
    }

    return false;
}

// Función para mintear un activo
export const mintAsset = async (id: string, amount: bigint, signer: Signer) => {
    const AssetsContract = new ethers.Contract(ASSETS_ADDRESS, tokenAbi, signer);
    try {
        const tx = await AssetsContract.mint(await signer.getAddress(), id, amount, "0x");
        const receipt = await tx.wait();

        // Lectura de evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = AssetsContract.interface.parseLog(log);

                if (parsed && parsed.name === 'AssetMinted') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalTo = eventArgs ? eventArgs[0] : await signer.getAddress();
        const finalId = eventArgs ? eventArgs[1] : id;
        const finalValue = eventArgs ? eventArgs[2] : amount;

        return {
            hash: receipt.hash,
            to: finalTo,
            id: finalId,
            value: finalValue.toString(),
        };
    } catch (error: any) {
        const decodedError = decodeError(error, AssetsContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

export const burnAsset = async (id: string, amount: bigint, signer: Signer) => {
    const AssetsContract = new ethers.Contract(ASSETS_ADDRESS, tokenAbi, signer);
    try {
        const tx = await AssetsContract.burn(id, amount);
        const receipt = await tx.wait();

        // Lectura de evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = AssetsContract.interface.parseLog(log);

                if (parsed && parsed.name === 'AssetBurned') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalFrom = eventArgs ? eventArgs[0] : await signer.getAddress();
        const finalId = eventArgs ? eventArgs[1] : id;
        const finalValue = eventArgs ? eventArgs[2] : amount;
        console.log(finalFrom, finalId, finalValue);

        return {
            hash: receipt.hash,
            from: finalFrom,
            id: finalId,
            value: finalValue.toString(),
        };
    } catch (error: any) {
        const decodedError = decodeError(error, AssetsContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

// Función para obtener el maxSupply de un token
export const getMaxSupply = async (id: string, signer: Signer) => {
    const AssetsContract = new ethers.Contract(ASSETS_ADDRESS, tokenAbi, signer);
    const maxSupply = await AssetsContract.maxSupply(id);
    return maxSupply;
};

export const pause = async (signer: Signer) => {
    const AssetsContract = new ethers.Contract(ASSETS_ADDRESS, tokenAbi, signer);

    try {
        const tx = await AssetsContract.pause();
        const receipt = await tx.wait();

        // Evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = AssetsContract.interface.parseLog(log);

                if (parsed && parsed.name === 'ContractPaused') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalFrom = eventArgs ? eventArgs[0] : await signer.getAddress();
        console.log(finalFrom);

        return {
            hash: receipt.hash,
            from: finalFrom,
        };
    } catch (error: any) {
        const decodedError = decodeError(error, AssetsContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
};

export const unpause = async (signer: Signer) => {
    const AssetsContract = new ethers.Contract(ASSETS_ADDRESS, tokenAbi, signer);

    try {
        const tx = await AssetsContract.unpause();
        const receipt = await tx.wait();

        // Evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = AssetsContract.interface.parseLog(log);

                if (parsed && parsed.name === 'ContractUnpaused') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalFrom = eventArgs ? eventArgs[0] : await signer.getAddress();
        console.log(finalFrom);

        return {
            hash: receipt.hash,
            from: finalFrom,
        };
    } catch (error: any) {
        const decodedError = decodeError(error, AssetsContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
};

export const isPaused = async (signer: Signer) => {
    const AssetsContract = new ethers.Contract(ASSETS_ADDRESS, tokenAbi, signer);
    const paused = await AssetsContract.paused();
    return paused;
};

