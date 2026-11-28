import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { AdminPage } from '@/types/e-commerce/executiveAdmin';
import type {
    ComboCategory,
    ComboIngredient,
    ComboStatus,
    ComboWrite,
    ExecutiveCombo,
} from '@/types/e-commerce/executiveCombo';

const api = '/api/ecommerce/combos';
export const executiveComboApi = {
    list: async (page: number, signal?: AbortSignal, q?: string) =>
        (
            await http.get<ApiResponse<AdminPage<ExecutiveCombo>>>(api, {
                params: { page, size: 12, q },
                signal,
            })
        ).data.data,
    categories: async (signal?: AbortSignal) =>
        (await http.get<ApiResponse<ComboCategory[]>>(`${api}/categories`, { signal })).data.data,
    ingredients: async (q: string, page: number, signal?: AbortSignal) =>
        (
            await http.get<ApiResponse<AdminPage<ComboIngredient>>>(`${api}/ingredients`, {
                params: { q, page, size: 12 },
                signal,
            })
        ).data.data,
    detail: async (id: string) =>
        (await http.get<ApiResponse<ExecutiveCombo>>(`${api}/${id}`)).data.data,
    save: async (id: string | null, payload: ComboWrite) =>
        (id
            ? await http.put<ApiResponse<ExecutiveCombo>>(`${api}/${id}`, payload)
            : await http.post<ApiResponse<ExecutiveCombo>>(api, payload)
        ).data.data,
    status: async (id: string, status: ComboStatus) =>
        (
            await http.patch<ApiResponse<ExecutiveCombo>>(`${api}/${id}/status`, null, {
                params: { status },
            })
        ).data.data,
    upload: async (file: File) => {
        const form = new FormData();
        form.append('file', file);
        return (
            await http.post<ApiResponse<{ imageUrl: string; publicId: string }>>(
                `${api}/images`,
                form,
            )
        ).data.data;
    },
};
