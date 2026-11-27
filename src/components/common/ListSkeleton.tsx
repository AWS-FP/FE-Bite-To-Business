import Skeleton from "./Skeleton";

/** Placeholder for a list whose real rows have a primary block and trailing action. */
export default function ListSkeleton({
    count = 4,
    image = false,
    lines = 2,
    className = "",
    rowClassName = "flex items-start justify-between gap-3 border-b border-store-line py-4",
    action = true,
}: {
    count?: number;
    image?: boolean;
    lines?: number;
    className?: string;
    rowClassName?: string;
    action?: boolean;
}) {
    return (
        <div aria-busy="true" className={className}>
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={rowClassName}>
                    {image && (
                        <Skeleton className="size-12 shrink-0 rounded-lg" />
                    )}
                    <div className="min-w-0 flex-1 space-y-2">
                        {Array.from({ length: lines }, (_, j) => (
                            <Skeleton
                                key={j}
                                className={j === 0 ? "h-5 w-2/3" : "h-3 w-1/2"}
                            />
                        ))}
                    </div>
                    {action && <Skeleton className="h-9 w-24 shrink-0" />}
                </div>
            ))}
        </div>
    );
}
