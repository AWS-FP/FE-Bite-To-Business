// Khớp PageResponse<T> của BE; dùng bên trong ApiResponse<PageResponse<T>>.
export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
