import Skeleton from "@/components/common/Skeleton";

export default function ProductDetailSkeleton() {
    return (
        <div
            aria-busy="true"
            className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"
        >
            <div className="min-w-0 space-y-5">
                <article className="rounded-[20px] border border-[#dfebdc] bg-[#fffdf7] p-5 sm:p-6">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="mt-4 h-[44px] w-4/5" />
                    <Skeleton className="mt-4 h-4 w-1/2" />
                    <div className="relative mt-5 h-[290px] rounded-[16px] border border-[#e6eadc] bg-white p-5 sm:h-[380px] sm:p-7">
                        <Skeleton className="h-full w-full" />
                        <Skeleton className="absolute right-3 top-3 size-9 rounded-full" />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {Array.from({ length: 2 }, (_, i) => (
                            <div
                                key={i}
                                className="space-y-2 rounded-xl border border-[#dce8dc] bg-[#edf5ed] px-4 py-3"
                            >
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="mt-3 h-4 w-3/4" />
                    <div className="mt-6 space-y-3 border-t pt-5">
                        <Skeleton className="h-6 w-36" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </article>
                <div className="space-y-3">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div
                            key={i}
                            className="rounded-xl border bg-[#fffdf7] px-5 py-4"
                        >
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="mt-4 h-12 w-full" />
                        </div>
                    ))}
                </div>
            </div>
            <aside className="overflow-hidden rounded-xl border bg-[#fffdf7]">
                <div className="bg-[#174b37] p-3">
                    <Skeleton className="h-8 w-2/3" />
                </div>
                <div className="space-y-3 p-4">
                    <Skeleton className="h-9 w-2/3" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </aside>
        </div>
    );
}
