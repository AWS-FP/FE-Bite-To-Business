import type { ReactNode } from 'react';
export default function LogisticsPageShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return <div className="mx-auto max-w-[1200px] space-y-6 text-store-ink"><header><h1 className="font-heading text-3xl font-bold">{title}</h1><p className="mt-2 text-store-muted">{description}</p></header>{children}</div>;
}
export function Pagination({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (page: number) => void }) {
    if (totalPages <= 1) return null;
    return <div className="flex items-center gap-3 py-4"><button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded border px-3 py-2 disabled:opacity-40">Trước</button><span>Trang {page + 1} / {totalPages}</span><button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-2 disabled:opacity-40">Sau</button></div>;
}
export function ListStatus({ loading, error, empty }: { loading: boolean; error: string; empty: boolean }) {
    if (loading) return <p role="status">Đang tải dữ liệu...</p>;
    if (error) return <p role="alert" className="text-red-700">{error}</p>;
    if (empty) return <p className="text-store-muted">Chưa có dữ liệu.</p>;
    return null;
}
