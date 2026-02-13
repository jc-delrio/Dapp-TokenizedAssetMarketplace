import { DashboardTabs } from "@/components/common/DashboardTabs";
import ManageCurrency from "./ManageCurrency";
import ManageAssets from "./ManageAssets";
import ManageContracts from "./ManageContracts";

const AdminView = () => {
    const adminTabs = [
        { value: "Currency", label: "Gestión de CBCD", content: <ManageCurrency /> },
        { value: "Assets", label: "Gestión de Activos", content: <ManageAssets /> },
        { value: "Acquisition", label: "Gestión de Contratos", content: <ManageContracts /> },
    ];

    return (
        <DashboardTabs
            title="Permisos Administrador"
            defaultTab="Currency"
            tabs={adminTabs}
        />
    );
};

export default AdminView;
