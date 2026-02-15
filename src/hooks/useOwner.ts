import { useState, useEffect } from 'react';
import { useWeb3 } from '@/providers/Web3Provider';
import { Contract } from 'ethers';
import ACQUISITION_ABI from '@/contracts/abis/Acquisition.json';

const ACQUISITION_ADDRESS = import.meta.env.VITE_ACQUISITION_ADDRESS;

export const useOwner = () => {
    const { provider, account } = useWeb3();

    const [owner, setOwner] = useState<string>('');
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkOwner = async () => {
            if (!provider) return;

            try {
                const contract = new Contract(ACQUISITION_ADDRESS, ACQUISITION_ABI, provider);

                const _owner = await contract.owner();
                setOwner(_owner);

                if (account && _owner.toLowerCase() === account.toLowerCase()) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
            } catch (error) {
                console.error("Error obteniendo el owner:", error);
            } finally {
                setLoading(false);
            }
        };

        checkOwner();
    }, [provider, account]);

    return { owner, isOwner, loading };
};