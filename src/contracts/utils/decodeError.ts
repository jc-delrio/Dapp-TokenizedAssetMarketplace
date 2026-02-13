import { Contract, Interface } from "ethers";

export const decodeError = (error: any, contractOrInterface: Contract | Interface) => {
    // 1. Obtener la interfaz (si pasaste un contrato, sacamos su interfaz)
    const iface = contractOrInterface instanceof Contract ? contractOrInterface.interface : contractOrInterface;

    // 2. Buscar la data hexadecimal del error (puede estar en varios lugares según la versión de ethers/wallet)
    let errorData = error.data || error.info?.error?.data || error.info?.data;

    // A veces el error viene como string directo en 'message' o dentro de un objeto 'receipt'
    if (!errorData && error.receipt?.data) {
        errorData = error.receipt.data;
    }

    // 3. Si no encontramos data, no es un error de contrato decodificable
    if (!errorData) return null;

    try {
        // 4. Intentamos decodificar usando el ABI
        const decoded = iface.parseError(errorData);
        return decoded; // Devuelve { name: "ErrorInsufficientAssets", args: [...] }
    } catch (e) {
        console.warn("No se pudo decodificar el error con el ABI actual");
        return null;
    }
};