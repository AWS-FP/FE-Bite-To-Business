import type { ReactNode } from 'react';
import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
export function LogisticsPageHeader({ number, label, title, description, children }: { number: string; label: string; title: string; description?: string; children?: ReactNode }) {
    return <header className="flex items-start justify-between gap-6 text-black">
        <div>
            <div className="flex items-center gap-2.5 font-body text-[11px] font-semibold uppercase tracking-[1.2px]">
                <span className="grid size-[25px] place-items-center rounded-[3px] border border-black bg-store-cream tracking-normal">{number}</span>
                <span>{label}</span>
            </div>
            <h1 className="pt-2 font-heading text-[34px] leading-[44px] tracking-[-1px]">{title}</h1>
            {description && <p className="pt-2 text-[13px] leading-[21px] text-store-muted">{description}</p>}
        </div>
        {children}
    </header>;
}

export default function LogisticsPageShell({ number, label, title, description, children }: { number: string; label: string; title: string; description: string; children: ReactNode }) {
    return <div className="mx-auto max-w-[1200px] space-y-6 text-black"><LogisticsPageHeader number={number} label={label} title={title} description={description} />{children}</div>;
}
export function ListStatus({ loading, error, empty }: { loading: boolean; error: string; empty: boolean }) {
    const { tr } = useLogisticsText();
    if (loading) return <p role="status">{tr('Đang tải dữ liệu...')}</p>;
    if (error) return <p role="alert" className="text-red-700">{error}</p>;
    if (empty) return <p className="text-store-muted">{tr('Chưa có dữ liệu.')}</p>;
    return null;
}
