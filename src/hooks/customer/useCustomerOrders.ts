import { useEffect, useState } from 'react';
import { getCustomerOrders } from '@/services/customer/orderService';
import { useAuthStore } from '@/store/admin/authStore';
import type { CustomerOrderGroup, CustomerOrdersPage } from '@/types/customer/order';

/** Đơn hàng của Customer theo nhóm (đang xử lý / đã xong), phân trang 10 đơn. */
export function useCustomerOrders(group: CustomerOrderGroup) {
    const session = useAuthStore((state) => state.session);
    const [page, setPage] = useState(0);
    const [orders, setOrders] = useState<CustomerOrdersPage | null>(null);
    const [error, setError] = useState(false);
    const isCustomer = !!session && session.user.role === 'CUSTOMER';

    useEffect(() => {
        const abort = new AbortController();
        if (!isCustomer) return;
        getCustomerOrders(page, 10, abort.signal, group)
            .then(setOrders)
            .catch(() => {
                if (!abort.signal.aborted) setError(true);
            });
        return () => abort.abort();
    }, [page, isCustomer, group]);

    const loading = isCustomer && orders?.page !== page && !error;
    const visible = orders?.page === page ? orders.content : [];
    // Đổi trang thì xóa lỗi cũ để tải lại.
    function goToPage(next: number) {
        setError(false);
        setPage(next);
    }

    return { page, goToPage, orders, error, loading, visible };
}
