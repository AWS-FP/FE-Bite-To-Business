import Skeleton from "@/components/common/Skeleton";

export default function BrandTileSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#dce7df] bg-white p-3.5 shadow-[0_5px_14px_rgba(9,51,36,0.05)]"
        >
            <Skeleton className="size-[76px] shrink-0 rounded-xl sm:size-[84px]" />
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <div className="min-h-[33px] space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </div>
            <Skeleton className="size-[17px] shrink-0 self-start" />
        </div>
    );
}
