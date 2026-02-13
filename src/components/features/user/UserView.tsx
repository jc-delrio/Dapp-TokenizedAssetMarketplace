import { DashboardTabs } from "@/components/common/DashboardTabs";
import ManageCurrency from "./ManageHome";
import ManageOffer from "./ManageOffer";
import ManageDemand from "./ManageDemand";

const UserView = () => {
    const adminTabs = [
        { value: "Home", label: "Mis Activos", content: <ManageCurrency /> },
        { value: "Offer", label: "Oferta", content: <ManageOffer /> },
        { value: "Demand", label: "Demanda", content: <ManageDemand /> },
    ];

    return (
        <DashboardTabs
            title="Marketplace"
            defaultTab="Home"
            tabs={adminTabs}
        />
    );
};

export default UserView;
