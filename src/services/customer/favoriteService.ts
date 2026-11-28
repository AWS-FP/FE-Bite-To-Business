import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import { createBatchLoader } from '@/services/batchLoader';
import type { FavoritePage, FavoriteStatus } from '@/types/customer/favorite';
export async function getMyFavorites(page = 0, size = 20, signal?: AbortSignal) {
    const { data } = await http.get<ApiResponse<FavoritePage>>('/api/customer/favorites', { params: { page, size }, signal });
    return data.data;
}
export async function getFavoriteStatus(productId: string) {
    const { data } = await http.get<ApiResponse<FavoriteStatus>>(`/api/customer/favorites/${encodeURIComponent(productId)}/status`);
    return data.data;
}
export async function addFavorite(productId: string) {
    const { data } = await http.post<ApiResponse<FavoriteStatus>>(`/api/customer/favorites/${encodeURIComponent(productId)}`);
    favoriteStatuses.set(productId, true);
    return data.data;
}
export async function removeFavorite(productId: string) {
    const { data } = await http.delete<ApiResponse<FavoriteStatus>>(`/api/customer/favorites/${encodeURIComponent(productId)}`);
    favoriteStatuses.set(productId, false);
    return data.data;
}

/** One request for a whole grid: which of these products the customer liked. */
async function getFavoritedAmong(productIds: string[]) {
    const { data } = await http.get<ApiResponse<string[]>>('/api/customer/favorites/status', {
        params: { ids: productIds.join(',') },
    });
    return data.data;
}

/** Batched + cached favorite status; every card on a page shares one request. */
export const favoriteStatuses = createBatchLoader<boolean>({
    fetchMany: async (ids) => new Map((await getFavoritedAmong(ids)).map((id) => [id, true])),
    missing: () => false,
    fetchOne: async (id) => (await getFavoriteStatus(id)).favorite,
    cacheMs: 30_000,
});
