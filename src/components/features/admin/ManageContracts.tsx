import { Button } from "@/components/ui/button";

const ManageContracts = () => {
    return (
        <div>
            <div className="flex flex-row justify-center m-4">
                {/* TODO: Implementar la lógica de pausa y reanudación del contrato */}
                {true
                    ? <Button variant="destructive">Pausar Contrato</Button>
                    : <Button>Reanudar Contrato</Button>
                }
            </div>
        </div>
    );
};

export default ManageContracts;
