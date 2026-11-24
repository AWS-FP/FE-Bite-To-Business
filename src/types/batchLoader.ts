export interface BatchLoader<T> {
    get: (id: string) => Promise<T>;
    /** Cached value if still fresh. */
    peek: (id: string) => T | undefined;
    /** Overwrite the cached value (e.g. after the user toggles a favorite). */
    set: (id: string, value: T) => void;
    clear: () => void;
}
