import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import ConfirmModal from '@/components/common/ConfirmModal';
import { ExecutiveConfirmationContext, type ConfirmationOptions, type ConfirmationRequest } from '@/hooks/e-commerce/useExecutiveConfirmation';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';

type Pending = { message: string; action: Parameters<ConfirmationRequest>[1]; options: ConfirmationOptions; resolve: (accepted: boolean) => void };

export default function ExecutiveConfirmationProvider({ children }: { children: ReactNode }) {
    const tr = useExecutiveText();
    const [pending, setPending] = useState<Pending | null>(null);
    const [busy, setBusy] = useState(false);
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const active = useRef<Pending | null>(null);
    const running = useRef(false);
    const confirm = useCallback<ConfirmationRequest>((message, action, options = {}) => {
        if (active.current) return Promise.resolve(false);
        return new Promise(resolve => {
            const request = { message, action, options, resolve };
            active.current = request;
            setReason('');
            setError('');
            setPending(request);
        });
    }, []);
    useEffect(() => () => { active.current?.resolve(false); active.current = null; }, []);
    function close(accepted: boolean) {
        active.current?.resolve(accepted);
        active.current = null;
        setPending(null);
    }
    async function execute() {
        const request = active.current;
        if (!request || running.current || (request.options.reasonLabel && !reason.trim())) return;
        running.current = true;
        setBusy(true);
        setError('');
        try {
            await request.action(reason.trim());
            if (active.current === request) close(true);
        } catch (cause) {
            if (active.current === request) setError(executiveErrorMessage(cause, tr('Không thể thực hiện thao tác.', 'Unable to complete the action.')));
        } finally {
            running.current = false;
            setBusy(false);
        }
    }
    return (
        <ExecutiveConfirmationContext.Provider value={confirm}>
            {children}
            <ConfirmModal open={!!pending} workspace danger={pending?.options.danger} busy={busy} error={error}
                title={pending?.options.title ?? (pending?.options.danger ? tr('Xác nhận thao tác nguy hiểm', 'Confirm destructive action') : tr('Xác nhận thao tác', 'Confirm action'))}
                message={<><p>{pending?.message}</p>{pending?.options.reasonLabel && <label className="mt-3 block font-semibold">{pending.options.reasonLabel}<textarea className="mt-2 block w-full rounded-lg border border-[#a8bbae] bg-white p-2" rows={3} maxLength={2000} value={reason} onChange={e => setReason(e.target.value)} disabled={busy} /></label>}</>}
                confirmDisabled={!!pending?.options.reasonLabel && !reason.trim()}
                confirmLabel={tr('Xác nhận', 'Confirm')} cancelLabel={tr('Hủy', 'Cancel')}
                onCancel={() => { if (!running.current) close(false); }} onConfirm={() => void execute()} />
        </ExecutiveConfirmationContext.Provider>
    );
}
