import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

export interface FavoriteProduct {
    productId: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    imageUrl: string | null;
    listPrice: number | null;
    favoritedAt: string;
}
export interface FavoriteStatus { productId: string; favorite: boolean }
export interface FavoritePage {
    content: FavoriteProduct[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
export async function getMyFavorites(page = 0, size = 20) {
    const { data } = await http.get<ApiResponse<FavoritePage>>('/api/customer/favorites', { params: { page, size } });
    return data.data;
}
export async function getFavoriteStatus(productId: string) {
    const { data } = await http.get<ApiResponse<FavoriteStatus>>(`/api/customer/favorites/${encodeURIComponent(productId)}/status`);
    return data.data;
}
export async function addFavorite(productId: string) {
    const { data } = await http.post<ApiResponse<FavoriteStatus>>(`/api/customer/favorites/${encodeURIComponent(productId)}`);
    return data.data;
}
export async function removeFavorite(productId: string) {
    const { data } = await http.delete<ApiResponse<FavoriteStatus>>(`/api/customer/favorites/${encodeURIComponent(productId)}`);
    return data.data;
}
