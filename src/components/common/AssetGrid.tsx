import { type ReactNode } from "react";

interface AssetGridProps<T> {
    items: T[];
    isLoading: boolean;
    emptyMessage?: string;
    renderItem: (item: T) => ReactNode;
    title?: string;
}

export function AssetGrid<T>({
    items,
    isLoading,
    emptyMessage = "No hay elementos disponibles.",
    renderItem,
    title
}: AssetGridProps<T>) {

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse">Cargando activos...</div>;
    }

    if (items.length === 0) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 mb-8">
            {title && <h3 className="text-2xl font-bold">{title}</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => renderItem(item))}
            </div>
        </div>
    );
}