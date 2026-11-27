import Skeleton from "./Skeleton";

export default function TableSkeleton({
    columns,
    count = 5,
    tableClass,
    headerClass = "px-4 py-3",
    cellClass = "px-4 py-4",
    rowClass = "border-b border-store-line",
    className = "overflow-x-auto",
    image = false,
}: {
    columns: number;
    count?: number;
    tableClass: string;
    headerClass?: string;
    cellClass?: string;
    rowClass?: string;
    className?: string;
    image?: boolean;
}) {
    return (
        <div aria-busy="true" className={className}>
            <table aria-hidden="true" className={tableClass}>
                <thead>
                    <tr>
                        {Array.from({ length: columns }, (_, i) => (
                            <th key={i} className={headerClass}>
                                <Skeleton className="h-3 w-16" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: count }, (_, i) => (
                        <tr key={i} className={rowClass}>
                            {Array.from({ length: columns }, (_, j) => (
                                <td key={j} className={cellClass}>
                                    {image && j === 0 ? (
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="size-10 shrink-0 rounded-full" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-28" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                    ) : (
                                        <Skeleton className="h-4 w-20" />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
