import { publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { HomeBanner, HomeCategory, HomeResponse, HomeCombo, HomePromotionProductsPage } from '@/types/customer/home';

/** These routes are implemented inside BE features/customer/home, not ecommerce. */
export async function getHomeProducts(signal?: AbortSignal): Promise<HomeResponse> {
    const { data } = await publicHttp.get<ApiResponse<HomeResponse>>('/api/homepage', { signal });
    return data.data;
}

export async function getHomeCategories(signal?: AbortSignal): Promise<HomeCategory[]> {
    const { data } = await publicHttp.get<ApiResponse<HomeCategory[]>>('/api/homepage/categories', {
        signal,
    });
    return data.data;
}

export async function getHomeBanners(signal?: AbortSignal): Promise<HomeBanner[]> {
    const { data } = await publicHttp.get<ApiResponse<HomeBanner[]>>('/api/homepage/banners', {
        signal,
    });
    return data.data;
}

export async function getHomeComboPage(page: number, size: number, signal?: AbortSignal) {
    const { data } = await publicHttp.get<
        ApiResponse<{ items: HomeCombo[]; page: number; size: number; hasNext: boolean }>
    >('/api/homepage/combos', { params: { page, size }, signal });
    return data.data;
}

export async function getHomeCombo(id: string, signal?: AbortSignal): Promise<HomeCombo> {
    const { data } = await publicHttp.get<ApiResponse<HomeCombo>>(
        `/api/homepage/combos/${encodeURIComponent(id)}`,
        { signal },
    );
    return data.data;
}

export async function getHomePromotionProducts(id: string, page: number, size: number, signal?: AbortSignal) {
    const { data } = await publicHttp.get<ApiResponse<HomePromotionProductsPage>>(
        `/api/homepage/promotions/${encodeURIComponent(id)}/products`,
        { params: { page, size }, signal },
    );
    return data.data;
}
