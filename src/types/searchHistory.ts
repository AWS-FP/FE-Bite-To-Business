// UUID và Instant từ backend được nhận dưới dạng string trong JSON.
export interface SearchHistoryResponse {
    id: string;
    keyword: string;
    searchedAt: string;
}

export interface SaveSearchHistoryRequest {
    keyword: string;
}
