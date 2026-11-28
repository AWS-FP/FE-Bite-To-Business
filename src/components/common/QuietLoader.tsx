import Skeleton from './Skeleton';

/** Neutral page shell while authentication restores; no visible loading text. */
export default function QuietLoader() {
    return (
        <div aria-busy="true" className="mx-auto min-h-[60vh] w-full max-w-[1320px] space-y-5 p-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-1/3" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );
}
