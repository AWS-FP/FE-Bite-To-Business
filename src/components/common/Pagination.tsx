import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
    ariaLabel?: string;
}

export default function Pagination({ page, totalPages, onPageChange, loading = false, ariaLabel }: PaginationProps) {
    const { i18n } = useTranslation();
    const english = i18n.resolvedLanguage?.startsWith('en');
    const inputId = useId();
    const [showPageInput, setShowPageInput] = useState(false);
    const [pageInput, setPageInput] = useState('');
    const [pageError, setPageError] = useState(false);

    if (totalPages <= 1) return null;

    const pages: number[] = [];
    if (totalPages <= 7) {
        for (let number = 0; number < totalPages; number++) pages.push(number);
    } else {
        for (let number = Math.max(0, page - 1); number <= Math.min(totalPages - 1, page + 1); number++) {
            pages.push(number);
        }
    }

    const buttonClass = 'grid size-10 place-items-center rounded-lg border-2 border-black text-sm font-semibold text-black transition-colors disabled:cursor-not-allowed disabled:opacity-40';
    const normalButtonClass = `${buttonClass} bg-white hover:bg-store-cream`;

    function goToPage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const value = pageInput.trim();
        const targetPage = Number(value);
        if (!/^\d+$/.test(value) || !Number.isSafeInteger(targetPage) || targetPage < 1 || targetPage > totalPages) {
            setPageError(true);
            return;
        }
        setShowPageInput(false);
        setPageInput('');
        setPageError(false);
        if (targetPage - 1 !== page) onPageChange(targetPage - 1);
    }

    function togglePageInput() {
        setShowPageInput(!showPageInput);
        setPageError(false);
        setPageInput('');
    }

    return (
        <div className="flex flex-col items-center gap-2 py-5 font-body">
        <nav aria-label={ariaLabel || (english ? 'Pagination' : 'Phân trang')} className="flex items-center justify-center gap-2">
            <button type="button" className={normalButtonClass} onClick={() => onPageChange(0)} disabled={loading || page <= 0} aria-label={english ? 'First page' : 'Trang đầu'}>
                <ChevronsLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className={normalButtonClass} onClick={() => onPageChange(page - 1)} disabled={loading || page <= 0} aria-label={english ? 'Previous page' : 'Trang trước'}>
                <ChevronLeft size={18} aria-hidden="true" />
            </button>
            {pages[0] > 0 && (
                <button type="button" className={normalButtonClass} onClick={togglePageInput} disabled={loading} aria-expanded={showPageInput} aria-controls={inputId} aria-label={english ? 'Go to a page' : 'Đi đến trang'}>…</button>
            )}
            {pages.map((number) => (
                <span key={number} className="flex items-center gap-2">
                    <button
                        type="button"
                        className={number === page ? `${buttonClass} bg-store-yellow font-bold` : normalButtonClass}
                        onClick={() => onPageChange(number)}
                        disabled={loading}
                        aria-label={english ? `Page ${number + 1}` : `Trang ${number + 1}`}
                        aria-current={number === page ? 'page' : undefined}
                    >
                        {number + 1}
                    </button>
                </span>
            ))}
            {pages[pages.length - 1] < totalPages - 1 && (
                <button type="button" className={normalButtonClass} onClick={togglePageInput} disabled={loading} aria-expanded={showPageInput} aria-controls={inputId} aria-label={english ? 'Go to a page' : 'Đi đến trang'}>…</button>
            )}
            <button type="button" className={normalButtonClass} onClick={() => onPageChange(page + 1)} disabled={loading || page + 1 >= totalPages} aria-label={english ? 'Next page' : 'Trang sau'}>
                <ChevronRight size={18} aria-hidden="true" />
            </button>
            <button type="button" className={normalButtonClass} onClick={() => onPageChange(totalPages - 1)} disabled={loading || page + 1 >= totalPages} aria-label={english ? 'Last page' : 'Trang cuối'}>
                <ChevronsRight size={18} aria-hidden="true" />
            </button>
        </nav>
        {showPageInput && (
            <form id={inputId} onSubmit={goToPage} noValidate className="w-64 rounded-xl border border-black/20 bg-white p-4 text-black" onKeyDown={(event) => { if (event.key === 'Escape') setShowPageInput(false); }}>
                <label htmlFor={`${inputId}-page`} className="block font-body text-sm font-semibold">
                    {english ? 'Go to page' : 'Đi đến trang'}
                </label>
                <p className="mt-1 text-xs text-store-muted">{english ? `Enter a number from 1 to ${totalPages}` : `Nhập số từ 1 đến ${totalPages}`}</p>
                <div className="mt-3 flex gap-2">
                    <input id={`${inputId}-page`} type="number" min="1" max={totalPages} step="1" value={pageInput} onChange={(event) => { setPageInput(event.target.value); setPageError(false); }} aria-invalid={pageError} className="min-w-0 flex-1 rounded-lg border border-black px-3 py-2 text-sm" autoFocus />
                    <button type="submit" disabled={loading} className="rounded-lg border border-black bg-store-yellow px-3 py-2 text-sm font-bold text-black disabled:opacity-40">{english ? 'Go' : 'Đến'}</button>
                    <button type="button" onClick={() => setShowPageInput(false)} className="rounded-lg border border-black bg-white px-3 py-2 text-sm text-black">{english ? 'Cancel' : 'Hủy'}</button>
                </div>
                {pageError && <p role="alert" className="mt-2 text-xs text-danger">{english ? `Please enter a page from 1 to ${totalPages}.` : `Vui lòng nhập số trang từ 1 đến ${totalPages}.`}</p>}
            </form>
        )}
        </div>
    );
}
