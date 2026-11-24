import { isAxiosError } from 'axios';
import { useState } from 'react';
import { requestPackageReturn } from '@/services/customer/refundService';

const EMPTY_FORM = { reason: '', bank: '', accountNumber: '', accountName: '' };

/** Form trả hàng cho một package đã giao; gửi xong thì gọi onDone để tải lại đơn. */
export function usePackageReturn(orderId: string | undefined, onDone: () => void) {
    const [packageId, setPackageId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const accountValid = /^[0-9]{1,34}$/.test(form.accountNumber.trim());
    const formValid = !!form.reason.trim() && !!form.bank.trim() && accountValid && !!form.accountName.trim();

    function open(id: string) {
        setPackageId(id);
        setForm(EMPTY_FORM);
        setError('');
        setNotice('');
    }

    function updateField(field: keyof typeof EMPTY_FORM, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function submit() {
        if (!orderId || !packageId || !formValid || submitting) return;
        setSubmitting(true);
        setError('');
        try {
            await requestPackageReturn(orderId, packageId, {
                reason: form.reason.trim(),
                bank: form.bank.trim(),
                accountNumber: form.accountNumber.trim(),
                accountName: form.accountName.trim(),
            });
            setPackageId(null);
            setNotice('Đã gửi yêu cầu trả hàng. Admin sẽ xem xét và gửi kết quả qua email.');
            onDone();
        } catch (err) {
            const status = isAxiosError(err) ? err.response?.status : undefined;
            setError(
                status === 409
                    ? 'Kiện này không còn trả được (đã quá 24 giờ sau khi giao hoặc đã có yêu cầu trả hàng).'
                    : 'Không gửi được yêu cầu trả hàng. Vui lòng kiểm tra thông tin và thử lại.',
            );
        } finally {
            setSubmitting(false);
        }
    }

    return { packageId, open, close: () => setPackageId(null), form, updateField, accountValid, formValid, submitting, error, notice, submit };
}
