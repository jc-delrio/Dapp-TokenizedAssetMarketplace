import { type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
    value: string;
    label: string;
    content: ReactNode;
}

interface DashboardTabsProps {
    title: string;
    defaultTab: string;
    tabs: TabItem[];
}

export const DashboardTabs = ({ title, defaultTab, tabs }: DashboardTabsProps) => {
    return (
        <div className="w-full">
            <h3 className="m-4 font-bold text-center">{title}</h3>
            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 border-blue-300 rounded-lg border-1">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="data-[state=active]:bg-blue-500"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value}>
                        {tab.content}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};