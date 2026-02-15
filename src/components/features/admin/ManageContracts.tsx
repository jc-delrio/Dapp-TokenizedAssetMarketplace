import { Button } from "@/components/ui/button";
import { isPaused as isPausedCurrency, pause as pauseCurrency, unpause as unpauseCurrency } from "@/contracts/functions/DigitalCurrency";
import { isPaused as isPausedAssets, pause as pauseAssets, unpause as unpauseAssets } from "@/contracts/functions/DigitalAssets";
import { isPaused as isPausedAcquisition, pause as pauseAcquisition, unpause as unpauseAcquisition } from "@/contracts/functions/Acquisition";
import { useWeb3 } from "@/providers/Web3Provider";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ManageContracts = () => {
    const { signer } = useWeb3();
    const [pausedCurrency, setPausedCurrency] = useState<boolean>(false);
    const [pausedAssets, setPausedAssets] = useState<boolean>(false);
    const [pausedAcquisition, setPausedAcquisition] = useState<boolean>(false);

    useEffect(() => {
        const checkPaused = async () => {
            const pausedCurrency = await isPausedCurrency(signer!);
            const pausedAssets = await isPausedAssets(signer!);
            const pausedAcquisition = await isPausedAcquisition(signer!);
            setPausedCurrency(pausedCurrency);
            setPausedAssets(pausedAssets);
            setPausedAcquisition(pausedAcquisition);
        }
        checkPaused();
    }, [signer]);

    const handlePauseCurrency = async () => {
        await pauseCurrency(signer!);
        toast.success("Contrato DigitalCurrency pausado");
        setPausedCurrency(true);
    }

    const handleUnpauseCurrency = async () => {
        await unpauseCurrency(signer!);
        toast.success("Contrato DigitalCurrency reanudado");
        setPausedCurrency(false);
    }

    const handlePauseAssets = async () => {
        await pauseAssets(signer!);
        toast.success("Contrato DigitalAssets pausado");
        setPausedAssets(true);
    }

    const handleUnpauseAssets = async () => {
        await unpauseAssets(signer!);
        toast.success("Contrato DigitalAssets reanudado");
        setPausedAssets(false);
    }

    const handlePauseAcquisition = async () => {
        await pauseAcquisition(signer!);
        toast.success("Contrato Acquisition pausado");
        setPausedAcquisition(true);
    }

    const handleUnpauseAcquisition = async () => {
        await unpauseAcquisition(signer!);
        toast.success("Contrato Acquisition reanudado");
        setPausedAcquisition(false);
    }

    return (
        <div className="m-10">
            <div className="flex flex-col justify-center m-1 gap-8">

                {/* CONTRATO DIGITAL CURRENCY */}
                <div className='flex flex-row justify-center'>
                    <h3 className="text-lg font-semibold">Contrato DigitalCurrency ------ </h3>
                    {pausedCurrency
                        ? <Button onClick={handleUnpauseCurrency}>Reanudar Contrato</Button>
                        : <Button variant="destructive" onClick={handlePauseCurrency}>Pausar Contrato</Button>
                    }
                </div>

                {/* CONTRATO DIGITALASSETS */}
                <div className='flex flex-row justify-center'>
                    <h3 className="flex flex-row justify-between text-lg font-semibold">Contrato DigitalAssets ------ </h3>
                    {pausedAssets
                        ? <Button onClick={handleUnpauseAssets}>Reanudar Contrato</Button>
                        : <Button variant="destructive" onClick={handlePauseAssets}>Pausar Contrato</Button>
                    }

                    {/* CONTRATO DE ACQUISITION */}
                </div>
                <div className='flex flex-row justify-center'>
                    <h3 className="flex flex-row justify-between text-lg font-semibold">Contrato Acquisition ------ </h3>
                    {pausedAcquisition
                        ? <Button onClick={handleUnpauseAcquisition}>Reanudar Contrato</Button>
                        : <Button variant="destructive" onClick={handlePauseAcquisition}>Pausar Contrato</Button>
                    }

                </div>
            </div>
        </div>
    );
};

export default ManageContracts;
