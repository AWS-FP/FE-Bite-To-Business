import Skeleton from "@/components/common/Skeleton";

const rows = (count: number) =>
    Array.from({ length: count }, (_, index) => index);

type Cell = "text" | "double" | "product" | "badge" | "action" | "actions";

function CellShape({ kind }: { kind: Cell }) {
    if (kind === "product")
        return (
            <div className="flex min-w-[200px] items-center gap-3">
                <Skeleton className="size-12 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-36 max-w-full" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
        );
    if (kind === "double")
        return (
            <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
            </div>
        );
    if (kind === "badge") return <Skeleton className="h-6 w-20 rounded-[5px]" />;
    if (kind === "action" || kind === "actions")
        return (
            <div className="flex gap-2">
                <Skeleton className="h-10 w-16" />
                {kind === "actions" && <Skeleton className="h-10 w-16" />}
            </div>
        );
    return <Skeleton className="h-4 w-20" />;
}

export function ExecutiveTableSkeleton({
    cells,
    count = 5,
    tableClass,
    cellClass,
}: {
    cells: Cell[];
    count?: number;
    tableClass: string;
    cellClass: string;
}) {
    return (
        <div aria-busy="true" className="overflow-x-auto">
            <table className={tableClass} aria-hidden="true">
                <thead>
                    <tr>
                        {cells.map((_, i) => (
                            <th
                                key={i}
                                className="border-b border-[#e3e7df] bg-[#f7f9f3] px-5 py-3"
                            >
                                <Skeleton className="h-3 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows(count).map((i) => (
                        <tr key={i}>
                            {cells.map((kind, j) => (
                                <td key={j} className={cellClass}>
                                    <CellShape kind={kind} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function ExecutiveCampaignSkeleton() {
    return (
        <div aria-busy="true" className="grid gap-4 p-5 lg:grid-cols-2">
            {rows(4).map((i) => (
                <article
                    key={i}
                    className="overflow-hidden rounded-2xl border border-[#dbe8db] bg-white"
                >
                    <Skeleton className="aspect-video min-h-[155px] w-full rounded-none" />
                    <div className="space-y-3 p-5">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-20 rounded-[5px]" />
                                <Skeleton className="h-5 w-20 rounded-[5px]" />
                            </div>
                            <Skeleton className="h-3 w-28" />
                        </div>
                        <Skeleton className="h-5 w-3/4" />
                        <div className="min-h-12 space-y-2">
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-10 w-16" />
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-20" />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export function ExecutiveArticleSkeleton({
    kind,
}: {
    kind: "reviews" | "refunds";
}) {
    const refund = kind === "refunds";
    return (
        <div aria-busy="true" className="divide-y divide-[#edf1eb]">
            {rows(5).map((i) => (
                <article
                    key={i}
                    className={`grid gap-4 p-5 ${refund ? "lg:grid-cols-[1fr_200px]" : "lg:grid-cols-[1fr_170px]"}`}
                >
                    <div className={refund ? "space-y-1" : "space-y-3"}>
                        <div className="flex flex-wrap items-center gap-3">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-6 w-20 rounded-[5px]" />
                        </div>
                        <Skeleton className="h-3 w-56 max-w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-2/3" />
                        {refund && (
                            <>
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </>
                        )}
                    </div>
                    <div
                        className={
                            refund
                                ? "flex flex-col items-stretch gap-2"
                                : "flex flex-wrap items-start justify-end gap-2"
                        }
                    >
                        <Skeleton
                            className={`h-10 ${refund ? "w-full" : "w-32"}`}
                        />
                        <Skeleton
                            className={`h-10 ${refund ? "w-full" : "w-32"}`}
                        />
                    </div>
                </article>
            ))}
        </div>
    );
}

export function ExecutiveQuoteSummarySkeleton() {
    return (
        <div aria-busy="true" className="divide-y divide-[#edf1e9]">
            {rows(5).map((i) => (
                <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-5 py-4"
                >
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-5 w-24" />
                </div>
            ))}
        </div>
    );
}

export function ExecutivePricingSkeleton({ vat = false }: { vat?: boolean }) {
    if (vat)
        return (
            <div aria-busy="true" className="flex flex-wrap items-end gap-3">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>
        );
    return (
        <div aria-busy="true">
            <div className="grid gap-3 sm:grid-cols-2">
                {rows(2).map((i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-36" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                ))}
            </div>
            <Skeleton className="mt-3 h-3 w-4/5" />
            <div className="mt-5 space-y-2">
                {rows(3).map((i) => (
                    <div key={i} className="grid grid-cols-3 gap-3">
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ExecutiveQuoteDetailSkeleton() {
    return (
        <div aria-busy="true" className="space-y-4">
            <div className="rounded-2xl border bg-white p-5">
                <div className="flex justify-between gap-2">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-6 w-24 rounded-[5px]" />
                </div>
                <Skeleton className="mt-2 h-5 w-2/3" />
                <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2">
                    {rows(4).map((i) => (
                        <Skeleton key={i} className="h-5 w-4/5" />
                    ))}
                </div>
            </div>
            <div className="rounded-2xl border bg-white p-5">
                <Skeleton className="mb-4 h-5 w-36" />
                {rows(4).map((i) => (
                    <div
                        key={i}
                        className="flex justify-between gap-3 border-b py-3"
                    >
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ExecutiveComboSkeleton() {
    return (
        <div
            aria-busy="true"
            className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3"
        >
            {Array.from({ length: 12 }, (_, i) => (
                <div
                    key={i}
                    className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#d9e5dc] bg-white"
                >
                    <Skeleton className="aspect-video w-full rounded-none" />
                    <div className="flex flex-1 flex-col gap-2 p-4">
                        <Skeleton className="h-6 w-20 rounded-[5px]" />
                        <div className="h-12 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-6 w-1/3" />
                        <div className="mt-auto flex flex-wrap gap-2 pt-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
