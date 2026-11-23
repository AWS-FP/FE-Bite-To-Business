import { publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { CustomerProductDetail, CustomerProductPricing } from '@/types/customer/productDetail';

export async function getCustomerProductDetail(id: string, signal?: AbortSignal) {
    const response = await publicHttp.get<ApiResponse<CustomerProductDetail>>(
        `/api/catalog/products/${encodeURIComponent(id)}`, { signal },
    );
    return response.data.data;
}

export async function getCustomerProductPricing(id: string, signal?: AbortSignal) {
    const response = await publicHttp.get<ApiResponse<CustomerProductPricing>>(
        `/api/catalog/products/${encodeURIComponent(id)}/pricing`, { signal },
    );
    return response.data.data;
}

export async function getCustomerProductPricingBatch(ids: string[]) {
    const response = await publicHttp.get<ApiResponse<CustomerProductPricing[]>>(
        '/api/catalog/products/pricing',
        { params: { ids: ids.join(',') } },
    );
    return response.data.data;
}

// Catalog cards ask for pricing one product at a time. Requests made in the same tick are
// merged into one batch call, and a short in-memory cache lets a category the shopper
// already opened render price and stock state immediately.
const PRICING_CACHE_MS = 60_000;
const PRICING_BATCH_MAX = 100;
let batchQueue = new Map<
    string,
    { resolve: (value: CustomerProductPricing) => void; reject: (error: unknown) => void }
>();
let batchTimer: ReturnType<typeof setTimeout> | null = null;

async function flushPricingBatch() {
    const queue = batchQueue;
    batchQueue = new Map();
    batchTimer = null;
    const ids = [...queue.keys()];
    for (let start = 0; start < ids.length; start += PRICING_BATCH_MAX) {
        const chunk = ids.slice(start, start + PRICING_BATCH_MAX);
        try {
            const results = await getCustomerProductPricingBatch(chunk);
            const byId = new Map(results.map((item) => [item.productId, item]));
            for (const id of chunk) {
                const waiter = queue.get(id)!;
                const value = byId.get(id);
                // Missing means not published; let the single endpoint report the real error.
                if (value) waiter.resolve(value);
                else getCustomerProductPricing(id).then(waiter.resolve, waiter.reject);
            }
        } catch {
            // Older BE without the batch endpoint: fall back to one call per product.
            for (const id of chunk) {
                const waiter = queue.get(id)!;
                getCustomerProductPricing(id).then(waiter.resolve, waiter.reject);
            }
        }
    }
}

function requestPricing(id: string) {
    return new Promise<CustomerProductPricing>((resolve, reject) => {
        batchQueue.set(id, { resolve, reject });
        batchTimer ??= setTimeout(() => void flushPricingBatch(), 0);
    });
}
const pricingCache = new Map<
    string,
    { at: number; value?: CustomerProductPricing; pending?: Promise<CustomerProductPricing> }
>();

export function getCachedProductPricing(id: string) {
    const entry = pricingCache.get(id);
    return entry?.value && Date.now() - entry.at < PRICING_CACHE_MS ? entry.value : undefined;
}

export function loadProductPricing(id: string) {
    const cached = getCachedProductPricing(id);
    if (cached) return Promise.resolve(cached);
    const pending = pricingCache.get(id)?.pending;
    if (pending) return pending;
    // Not abortable: several cards and revisits may share the same request.
    const request = requestPricing(id).then(
        (value) => {
            pricingCache.set(id, { at: Date.now(), value });
            return value;
        },
        (error: unknown) => {
            pricingCache.delete(id);
            throw error;
        },
    );
    pricingCache.set(id, { at: Date.now(), pending: request });
    return request;
}
