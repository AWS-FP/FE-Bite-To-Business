import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { ACTIVE_REFUND_STATUSES } from '@/constants/customer/refund';
import { getOrderRefundRequests, requestOrderRefund } from '@/services/customer/refundService';
import type { CustomerOrderDetail } from '@/types/customer/order';
import type { RefundRecord } from '@/types/customer/refund';

const EMPTY_FORM = { reason: '', bank: '', accountNumber: '', accountName: '' };

/**
 * Yêu cầu hủy package của đơn đã thanh toán. E-commerce duyệt rồi mới hủy và hoàn tiền,
 * nên ở đây chỉ gửi yêu cầu và hiển thị trạng thái.
 */
export function useOrderCancellation(detail: CustomerOrderDetail | null) {
    const orderId = detail?.order.orderId;
    const paid = detail?.order.paymentStatus === 'SUCCESS';
    const [requests, setRequests] = useState<RefundRecord[]>([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        if (!orderId || !paid) return;
        let active = true;
        getOrderRefundRequests(orderId)
            .then((data) => {
                if (active) setRequests(data);
            })
            .catch(() => undefined);
        return () => {
            active = false;
        };
    }, [orderId, paid]);

    const lockedIds = new Set(
        requests.filter((item) => ACTIVE_REFUND_STATUSES.includes(item.status)).map((item) => item.packageId),
    );
    const cancellable = (detail?.packages ?? []).filter((pack) => !pack.cancelled && !lockedIds.has(pack.packageId));
    const canRequest =
        paid && !!detail && ['CONFIRMED', 'PROCESSING'].includes(detail.order.status) && cancellable.length > 0;
    const accountValid = /^[0-9]{1,34}$/.test(form.accountNumber.trim());
    const formValid =
        selected.length > 0 && !!form.reason.trim() && !!form.bank.trim() && accountValid && !!form.accountName.trim();

    function start() {
        setSelected(cancellable.map((pack) => pack.packageId));
        setForm(EMPTY_FORM);
        setError('');
        setNotice('');
        setOpen(true);
    }

    function togglePackage(packageId: string) {
        setSelected((current) =>
            current.includes(packageId) ? current.filter((id) => id !== packageId) : [...current, packageId],
        );
    }

    function updateField(field: keyof typeof EMPTY_FORM, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function submit() {
        if (!orderId || !formValid || submitting) return;
        setSubmitting(true);
        setError('');
        try {
            const entireOrder = selected.length === cancellable.length && lockedIds.size === 0;
            await requestOrderRefund(orderId, {
                entireOrder,
                packageIds: entireOrder ? [] : selected,
                reason: form.reason.trim(),
                bank: form.bank.trim(),
                accountNumber: form.accountNumber.trim(),
                accountName: form.accountName.trim(),
            });
            setRequests(await getOrderRefundRequests(orderId));
            setOpen(false);
            setNotice('Đã gửi yêu cầu hủy. Bộ phận E-commerce sẽ xem xét và phản hồi qua thông báo.');
        } catch (err) {
            const status = isAxiosError(err) ? err.response?.status : undefined;
            setError(
                status === 409
                    ? 'Không gửi được: có kiện đã được nhân viên nhận giao, đã giao hoặc đang có yêu cầu hủy khác.'
                    : 'Không gửi được yêu cầu hủy. Vui lòng kiểm tra thông tin và thử lại.',
            );
        } finally {
            setSubmitting(false);
        }
    }

    return {
        paid, requests, canRequest, cancellable, open, setOpen, selected, togglePackage,
        form, updateField, accountValid, formValid, submitting, error, notice, start, submit,
    };
}
