import { useEffect, type ReactNode } from 'react';

export const ui = {
    panel: 'rounded-[3px] border-2 border-black bg-white shadow-[4px_4px_0_#14132b]',
    primary: 'inline-flex min-h-10 items-center justify-center gap-2 rounded-[2px] border-2 border-black bg-store-yellow px-4 py-2 text-[12px] font-extrabold text-store-ink shadow-[3px_3px_0_#14132b] hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50',
    secondary: 'inline-flex min-h-10 items-center justify-center gap-2 rounded-[2px] border border-black bg-white px-4 py-2 text-[12px] font-bold hover:bg-surface-yellow disabled:cursor-not-allowed disabled:opacity-50',
    input: 'w-full min-h-10 rounded-[2px] border border-store-line-strong bg-white px-3 py-2 text-[13px] text-store-ink placeholder:text-store-muted focus:border-store-green',
    select: 'w-full min-h-10 rounded-[2px] border border-store-line-strong bg-white px-3 py-2 text-[13px] text-store-ink',
    label: 'mb-1.5 block text-[12px] font-bold text-store-ink',
    tableHead: 'border-b-2 border-store-ink bg-store-cream text-left text-[11px] font-extrabold uppercase tracking-[0.08em] text-store-ink',
    tableCell: 'border-b border-store-line px-4 py-3 align-middle text-[12px]',
};

export function PageTitle({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
    return <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
            <p className="mb-2 font-label text-[11px] font-bold tracking-[0.18em] text-store-coral">{eyebrow}</p>
            <h1 className="font-display text-[clamp(26px,3vw,40px)] font-extrabold leading-tight tracking-[-1px] text-store-ink">{title}</h1>
            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-store-muted">{description}</p>
        </div>
        {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>;
}

export function DemoNotice() {
    return <div className="mb-6 flex gap-3 border border-amber-400 bg-amber-50 px-4 py-3 text-[12px] leading-5 text-amber-900">
        <img src="/images/ui/e-commerce/info.svg" alt="" width="17" height="17" className="mt-0.5 shrink-0" />
        <p><strong>Chế độ giao diện demo.</strong> Dữ liệu và mọi thay đổi được lưu trên trình duyệt của tài khoản đang đăng nhập, chưa gửi tới API hay ảnh hưởng sản phẩm, giá và ưu đãi thật.</p>
    </div>;
}

export function Metric({ label, value, note, icon, tint = 'bg-store-cream' }: { label: string; value: string | number; note: string; icon: string; tint?: string }) {
    return <div className={`${ui.panel} flex min-w-0 items-start justify-between gap-3 p-4`}>
        <div className="min-w-0">
            <p className="text-[11px] font-bold text-store-muted">{label}</p>
            <p className="mt-2 font-display text-[28px] font-extrabold leading-none text-store-ink">{value}</p>
            <p className="mt-2 text-[10px] leading-4 text-store-muted">{note}</p>
        </div>
        <span className={`${tint} grid size-11 shrink-0 place-items-center rounded-[3px] border border-black`}>
            <img src={`/images/ui/e-commerce/${icon}.svg`} alt="" width="21" height="21" />
        </span>
    </div>;
}

export function StatusPill({ status }: { status: string }) {
    const colors: Record<string, string> = {
        active: 'bg-green-100 text-green-800',
        scheduled: 'bg-blue-100 text-blue-800',
        draft: 'bg-slate-100 text-slate-600',
        hidden: 'bg-orange-100 text-orange-800',
        paused: 'bg-amber-100 text-amber-800',
        ended: 'bg-gray-100 text-gray-600',
        exhausted: 'bg-rose-100 text-rose-800',
        'out-of-stock': 'bg-rose-100 text-rose-800',
    };
    const labels: Record<string, string> = {
        active: 'Đang hoạt động', scheduled: 'Sắp diễn ra', draft: 'Bản nháp',
        hidden: 'Đã ẩn', paused: 'Tạm dừng', ended: 'Đã kết thúc',
        exhausted: 'Hết lượt', 'out-of-stock': 'Hết hàng',
    };
    return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold whitespace-nowrap ${colors[status] ?? 'bg-slate-100 text-slate-600'}`}>
        <span className="size-1.5 rounded-full bg-current" />{labels[status] ?? status}
    </span>;
}

export function Dialog({ title, description, onClose, children, wide = false }: { title: string; description?: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
    useEffect(() => {
        function keydown(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
        const old = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', keydown);
        return () => { document.body.style.overflow = old; document.removeEventListener('keydown', keydown); };
    }, [onClose]);
    return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-store-ink/60 p-3 sm:p-6" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className={`my-auto max-h-[92vh] w-full overflow-y-auto border-2 border-black bg-store-cream p-5 shadow-[6px_6px_0_#14132b] sm:p-7 ${wide ? 'max-w-[760px]' : 'max-w-[560px]'}`} role="dialog" aria-modal="true" aria-label={title}>
            <div className="mb-5 flex items-start justify-between gap-3 border-b-2 border-black pb-4">
                <div><h2 className="font-display text-[24px] font-extrabold text-store-ink">{title}</h2>{description && <p className="mt-1 text-[12px] leading-5 text-store-muted">{description}</p>}</div>
                <button type="button" onClick={onClose} aria-label="Đóng" className="grid size-9 shrink-0 place-items-center border border-black bg-white hover:bg-surface-pink"><img src="/images/ui/e-commerce/x.svg" width="16" height="16" alt="" /></button>
            </div>
            {children}
        </div>
    </div>;
}

export function Empty({ text }: { text: string }) {
    return <div className="p-10 text-center text-[13px] text-store-muted">{text}</div>;
}
