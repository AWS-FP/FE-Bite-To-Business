import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reorderCustomerOrder } from '@/services/customer/orderService';
import { ROUTES } from '@/router/routes';

export function useReorderOrder() {
    const navigate = useNavigate();
    const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function reorder(orderId: string) {
        if (pendingOrderId) return;
        setError(null);
        setPendingOrderId(orderId);
        try {
            const quote = await reorderCustomerOrder(orderId);
            navigate(`${ROUTES.QUOTES}?reorderQuote=${encodeURIComponent(quote.id)}`);
        } catch {
            setError('Không thể đặt lại đơn này: sản phẩm, tồn kho, địa chỉ hoặc giá có thể đã thay đổi. Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.');
        } finally {
            setPendingOrderId(null);
        }
    }
    return { pendingOrderId, error, reorder };
}
