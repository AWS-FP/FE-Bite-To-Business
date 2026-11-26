import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

import type {
    FinanceFilters,
    FinanceReport,
    FinanceTransaction,
    FinanceCustomer,
    FinancePage,
} from '@/types/admin/finance';

export async function getFinanceReport(filters: FinanceFilters, signal?: AbortSignal) {
    const response = await http.get<ApiResponse<FinanceReport>>('/api/admin/finance/report', {
        params: filters,
        signal,
    });
    return response.data.data;
}
export async function getFinanceTransactions(
    filters: FinanceFilters,
    page: number,
    kind: string,
    status: string,
    signal?: AbortSignal,
) {
    const response = await http.get<ApiResponse<FinancePage<FinanceTransaction>>>(
        '/api/admin/finance/transactions',
        {
            params: { ...filters, page, size: 20, kind, status },
            signal,
        },
    );
    return response.data.data;
}
export async function getFinanceCustomers(
    filters: FinanceFilters,
    page: number,
    signal?: AbortSignal,
) {
    const response = await http.get<ApiResponse<FinancePage<FinanceCustomer>>>(
        '/api/admin/finance/customers',
        {
            params: { ...filters, page, size: 20 },
            signal,
        },
    );
    return response.data.data;
}
