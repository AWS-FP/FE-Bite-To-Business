/**
 * Turns many "one id at a time" calls made in the same tick into ONE batch request, with a short
 * cache. Used where every card on a page used to ask the server separately (N+1 requests).
 *
 *   const load = createBatchLoader({ fetchMany: ids => api(ids), fetchOne: id => api1(id) });
 *   await load.get(id);
 */
interface BatchLoaderOptions<T> {
    /** One request for many ids; returns a value per id that exists. */
    fetchMany: (ids: string[]) => Promise<Map<string, T>>;
    /** Fallback when the batch endpoint fails (e.g. an older server): one request per id. */
    fetchOne?: (id: string) => Promise<T>;
    /** Value for ids the batch answered without (e.g. "not favorited"). */
    missing?: () => T;
    cacheMs?: number;
    maxBatch?: number;
}

export interface BatchLoader<T> {
    get: (id: string) => Promise<T>;
    /** Cached value if still fresh. */
    peek: (id: string) => T | undefined;
    /** Overwrite the cached value (e.g. after the user toggles a favorite). */
    set: (id: string, value: T) => void;
    clear: () => void;
}

export function createBatchLoader<T>({
    fetchMany,
    fetchOne,
    missing,
    cacheMs = 60_000,
    maxBatch = 100,
}: BatchLoaderOptions<T>): BatchLoader<T> {
    const cache = new Map<string, { at: number; value: T }>();
    const inFlight = new Map<string, Promise<T>>();
    let queue = new Map<string, { resolve: (value: T) => void; reject: (error: unknown) => void }>();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const peek = (id: string) => {
        const entry = cache.get(id);
        return entry && Date.now() - entry.at < cacheMs ? entry.value : undefined;
    };

    async function flush() {
        const batch = queue;
        queue = new Map();
        timer = null;
        const ids = [...batch.keys()];
        for (let start = 0; start < ids.length; start += maxBatch) {
            const chunk = ids.slice(start, start + maxBatch);
            try {
                const result = await fetchMany(chunk);
                for (const id of chunk) {
                    const waiter = batch.get(id)!;
                    if (result.has(id)) waiter.resolve(result.get(id) as T);
                    else if (missing) waiter.resolve(missing());
                    else if (fetchOne) fetchOne(id).then(waiter.resolve, waiter.reject);
                    else waiter.reject(new Error(`No value for ${id}`));
                }
            } catch (error) {
                for (const id of chunk) {
                    const waiter = batch.get(id)!;
                    if (fetchOne) fetchOne(id).then(waiter.resolve, waiter.reject);
                    else waiter.reject(error);
                }
            }
        }
    }

    function get(id: string) {
        const cached = peek(id);
        if (cached !== undefined) return Promise.resolve(cached);
        const pending = inFlight.get(id);
        if (pending) return pending;
        const request = new Promise<T>((resolve, reject) => {
            queue.set(id, { resolve, reject });
            timer ??= setTimeout(() => void flush(), 0);
        }).then(
            (value) => {
                cache.set(id, { at: Date.now(), value });
                inFlight.delete(id);
                return value;
            },
            (error: unknown) => {
                inFlight.delete(id);
                throw error;
            },
        );
        inFlight.set(id, request);
        return request;
    }

    return {
        get,
        peek,
        set: (id, value) => cache.set(id, { at: Date.now(), value }),
        clear: () => cache.clear(),
    };
}
