import Skeleton from '@/components/common/Skeleton';

export default function ProductCardSkeleton({ combo = false }: { combo?: boolean }) {
    return (
        <div
            aria-hidden="true"
            className="flex h-full min-w-0 flex-col overflow-hidden border border-store-line/90 bg-white"
        >
            <div className="relative flex h-[150px] items-center justify-center border-b border-store-line/60 bg-[#fbfaf5] p-3 sm:h-[158px]">
                <Skeleton className="h-full w-full" />
                <Skeleton className="absolute right-2.5 top-2.5 size-9 rounded-full" />
            </div>
            <div className="flex flex-1 flex-col px-3.5 pb-3 pt-3">
                <div className="flex h-[15px] items-center justify-between gap-2">
                    <Skeleton className="h-2.5 w-1/3" />
                    <Skeleton className="h-2.5 w-1/3" />
                </div>
                <div className="mt-1.5 flex min-h-[40px] flex-col justify-center gap-2">
                    <Skeleton className="h-3 w-11/12" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
                <div className="mt-1.5 flex h-5 items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-2.5 w-12" />
                </div>
                {combo && <div className="mt-2 flex h-10 flex-col gap-2 py-1"><Skeleton className="h-3 w-4/5" /><Skeleton className="h-3 w-2/3" /></div>}
                <div className="mt-auto pt-2.5">
                    <div className="h-4" />
                    <Skeleton className="h-6 w-28" />
                </div>
                <div className="mt-2.5 border-t border-store-line/70 pt-2.5">
                    <div className="flex h-[16px] items-center justify-between">
                        <Skeleton className="h-2.5 w-1/3" />
                        <Skeleton className="h-2.5 w-1/3" />
                    </div>
                    <div className="mt-2 flex gap-2">
                        <Skeleton className="h-9 w-[81px] rounded-lg" />
                        <Skeleton className="h-9 flex-1 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
