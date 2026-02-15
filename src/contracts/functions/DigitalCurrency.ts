import tokenAbi from "../abis/DigitalCurrency.json" with { type: "json" };
import { ethers, formatEther, type Signer } from "ethers";
import { decodeError } from "../utils/decodeError";

const TOKEN_ADDRESS = import.meta.env.VITE_CURRENCY_ADDRESS;

const allowance = async (spender: string, signer: Signer) => {
    const CurrencyContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    const tokenDecimals: number = Number(await CurrencyContract.decimals());
    const weiAllowance: bigint = await CurrencyContract.allowance(await signer.getAddress(), spender);
    const allowance: bigint = weiAllowance / BigInt(10 ** tokenDecimals);

    return { weiAllowance, allowance };
}

const approve = async (spender: string, amount: bigint, signer: Signer) => {
    const CurrencyContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    const tx = await CurrencyContract.approve(spender, amount);

    await tx.wait();
    console.log(`Aprobados ${formatEther(amount)} CBCD para ${spender} en la transacción ${tx.hash}`);
    return tx;
}

export const checkAllowance = async (spender: string, amount: bigint, signer: Signer) => {
    const { weiAllowance } = await allowance(spender, signer);

    if (weiAllowance === BigInt(0)) {
        console.log("Sin allowance, espera a que se apruebe");
        await approve(spender, amount, signer);
    } else if (weiAllowance < amount) {
        console.log("Allowance insuficiente, reinicia y aprueba");
        await approve(spender, BigInt(0), signer);
        await approve(spender, amount, signer);
    } else {
        console.log("Allowance suficiente, no es necesario aprobar");
    }
}

export const transferToken = async (to: string, amount: bigint, signer: Signer) => {
    const CurrencyContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    const tx = await CurrencyContract.transfer(to, amount);
    await tx.wait();
    return tx;
}

export const mintToken = async (address: string, amount: bigint, signer: Signer) => {
    const CurrencyContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    try {
        const tx = await CurrencyContract.mint(address, amount);
        const receipt = await tx.wait();

        // Evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = CurrencyContract.interface.parseLog(log);

                if (parsed && parsed.name === 'TokenMinted') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalTo = eventArgs ? eventArgs[0] : address;
        const finalValue = eventArgs ? eventArgs[1] : amount;

        return {
            hash: receipt.hash,
            to: finalTo,
            value: finalValue.toString(),
        };
    } catch (error: any) {
        const decodedError = decodeError(error, CurrencyContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

export const burnToken = async (amount: bigint, signer: Signer) => {
    const CurrencyContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    try {
        const tx = await CurrencyContract.burn(amount);
        const receipt = await tx.wait();

        // Evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = CurrencyContract.interface.parseLog(log);

                if (parsed && parsed.name === 'TokenBurned') {
                    eventArgs = parsed.args;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        // Fallback
        const finalFrom = eventArgs ? eventArgs[0] : await signer.getAddress();
        const finalValue = eventArgs ? eventArgs[1] : amount;

        return {
            hash: receipt.hash,
            from: finalFrom,
            value: finalValue.toString(),
        };
    } catch (error: any) {
        const decodedError = decodeError(error, CurrencyContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

export const getBalance = async (address: string, signer: Signer) => {
    const CurrencyContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    const balance = await CurrencyContract.balanceOf(address);
    return balance;
}

export const pause = async (signer: Signer) => {
    const CurrencyContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    try {
        const tx = await CurrencyContract.pause();
        const receipt = await tx.wait();

        // Evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = CurrencyContract.interface.parseLog(log);

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

        return {
            hash: receipt.hash,
            from: finalFrom,
        };

    } catch (error: any) {
        const decodedError = decodeError(error, CurrencyContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

export const unpause = async (signer: Signer) => {
    const CurrencyContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    try {
        const tx = await CurrencyContract.unpause();
        const receipt = await tx.wait();

        // Evento
        let eventArgs = null;

        for (const log of receipt.logs) {
            try {
                const parsed = CurrencyContract.interface.parseLog(log);

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

        return {
            hash: receipt.hash,
            from: finalFrom,
        };
    } catch (error: any) {
        const decodedError = decodeError(error, CurrencyContract);
        console.log(decodedError);
        throw new Error(decodedError?.name);
    }
}

export const isPaused = async (signer: Signer) => {
    const CurrencyContract = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
    const paused = await CurrencyContract.paused();
    return paused;
}

