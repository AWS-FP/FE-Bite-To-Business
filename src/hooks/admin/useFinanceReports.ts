import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/admin/authStore';
import {
    getFinanceReport,
    getFinanceTransactions,
    getFinanceCustomers,
} from '@/services/admin/financeService';
import type { FinanceFilters } from '@/types/admin/finance';

export function useFinanceReports(
    filters: FinanceFilters,
    page: number,
    customerPage: number,
    kind: string,
    status: string,
) {
    const owner = useAuthStore((state) => state.session?.user.id);
    const role = useAuthStore((state) => state.session?.user.role);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);
    const key = ['admin', owner, sessionVersion, 'finance', filters];
    const report = useQuery({
        queryKey: [...key, 'report'],
        queryFn: ({ signal }) => getFinanceReport(filters, signal),
        enabled: role === 'ADMIN',
        staleTime: 30_000,
        retry: false,
    });
    const transactions = useQuery({
        queryKey: [...key, 'transactions', page, kind, status],
        queryFn: ({ signal }) => getFinanceTransactions(filters, page, kind, status, signal),
        enabled: role === 'ADMIN',
        staleTime: 30_000,
        retry: false,
    });
    const customers = useQuery({
        queryKey: [...key, 'customers', customerPage],
        queryFn: ({ signal }) => getFinanceCustomers(filters, customerPage, signal),
        enabled: role === 'ADMIN',
        staleTime: 30_000,
        retry: false,
    });
    return { report, transactions, customers };
}
