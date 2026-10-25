import { http } from './axiosClient';
import type { ApiResponse } from '@/types/api';
import type { SaveSearchHistoryRequest, SearchHistoryResponse } from '@/types/searchHistory';

const searchHistoryPath = '/api/users/me/search-history';

// http tự gắn JWT. Không gửi userId từ FE để chọn lịch sử của người khác.
export async function getSearchHistory(signal?: AbortSignal): Promise<SearchHistoryResponse[]> {
    const response = await http.get<ApiResponse<SearchHistoryResponse[]>>(searchHistoryPath, {
        signal,
    });
    return response.data.data;
}

export async function saveSearchHistory(
    keyword: string,
    signal?: AbortSignal,
): Promise<SearchHistoryResponse[]> {
    const request: SaveSearchHistoryRequest = { keyword };
    const response = await http.post<ApiResponse<SearchHistoryResponse[]>>(
        searchHistoryPath,
        request,
        {
            signal,
            // Lịch sử là chức năng phụ; không bắt người dùng chờ lâu khi mạng lỗi.
            timeout: 3000,
        },
    );
    return response.data.data;
}
