import { publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { HomeBanner, HomeCategory, HomeResponse } from '@/types/customer/home';

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
