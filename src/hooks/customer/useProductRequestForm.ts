import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { createProductRequest } from '@/services/customer/productRequestService';
import { useAuthStore } from '@/store/admin/authStore';

/** Trạng thái và gửi form "Yêu cầu thêm sản phẩm"; khách chưa đăng nhập được đưa tới trang đăng nhập. */
export function useProductRequestForm(english: boolean, onOpenChange?: (open: boolean) => void) {
    const session = useAuthStore((state) => state.session);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [url, setUrl] = useState('');
    const [note, setNote] = useState('');
    const [notify, setNotify] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    function setDialogOpen(value: boolean) {
        setOpen(value);
        onOpenChange?.(value);
    }

    function start() {
        if (!session) {
            navigate(ROUTES.LOGIN, { state: { from: { pathname: ROUTES.HOME } } });
            return;
        }
        setDialogOpen(true);
        setError('');
        setSent(false);
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!name.trim()) return;
        setBusy(true);
        setError('');
        try {
            const details = [brand.trim() && `Thương hiệu: ${brand.trim()}`, note.trim()].filter(Boolean).join('\n');
            await createProductRequest({
                productName: name.trim(),
                referenceUrl: url.trim() || null,
                note: details || null,
                notifyByEmail: notify,
            });
            setName('');
            setBrand('');
            setUrl('');
            setNote('');
            setSent(true);
        } catch {
            setError(english ? 'Unable to send your request. Please try again.' : 'Không gửi được yêu cầu. Vui lòng thử lại.');
        } finally {
            setBusy(false);
        }
    }

    // Staff không dùng chức năng này.
    const hidden = !!session && session.user.role !== 'CUSTOMER';

    return {
        hidden, open, setDialogOpen, start, submit, busy, error, sent,
        name, setName, brand, setBrand, url, setUrl, note, setNote, notify, setNotify,
    };
}
