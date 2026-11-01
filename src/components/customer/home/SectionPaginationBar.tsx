import { useTranslation } from 'react-i18next';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

type PageItem = number | 'ellipsis';

// Keep page navigation short even if there are hundreds of pages.
function getPageItems(current: number, total: number): PageItem[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    const visible = new Set<number>([1, total]);

    for (let value = current - 1; value <= current + 1; value += 1) {
        if (value >= 1 && value <= total) visible.add(value);
    }

    if (current <= 3) {
        [2, 3, 4].forEach((value) => visible.add(value));
    }
    if (current >= total - 2) {
        [total - 3, total - 2, total - 1].forEach((value) => visible.add(value));
    }

    const sorted = Array.from(visible).sort((a, b) => a - b);
    const result: PageItem[] = [];

    sorted.forEach((value, index) => {
        if (index > 0) {
            const previous = sorted[index - 1];
            if (value - previous === 2) result.push(previous + 1);
            else if (value - previous > 2) result.push('ellipsis');
        }
        result.push(value);
    });

    return result;
}

export default function SectionPaginationBar({
                                                 currentPage,
                                                 totalPages,
                                                 totalItems,
                                                 pageSize,
                                                 onPageChange,
                                             }: PaginationBarProps) {
    const { t } = useTranslation('storefront');
    const hasItems = totalItems > 0 && totalPages > 0;
    const lastPage = Math.max(1, Math.trunc(totalPages));
    const page = Math.min(lastPage, Math.max(1, Math.trunc(currentPage)));
    const firstItem = hasItems ? (page - 1) * pageSize + 1 : 0;
    const lastItem = hasItems ? Math.min(page * pageSize, totalItems) : 0;
    const pages = hasItems ? getPageItems(page, lastPage) : [];

    const goTo = (nextPage: number) => {
        if (!hasItems) return;
        const target = Math.min(lastPage, Math.max(1, Math.trunc(nextPage)));
        if (target !== page) onPageChange(target);
    };

    const buttonBase =
        'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-solid border-[#14132b] px-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#123B2E] disabled:cursor-not-allowed disabled:opacity-40';

    return (
        <nav
            aria-label={t('homePage.paginationLabel')}
            className="mt-8 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-0 border-t border-solid border-[#14132b]/15 pt-4 text-xs text-[#14132b]"
        >
            <p className="m-0 font-medium text-[#4B5563]">
                {t('homePage.paginationShowing', { first: firstItem, last: lastItem, total: totalItems })}
            </p>

            <div className="flex flex-wrap items-center gap-1.5" aria-label={t('homePage.choosePage')}>
                <button
                    type="button"
                    aria-label={t('homePage.firstPage')}
                    title={t('homePage.firstPage')}
                    disabled={!hasItems || page === 1}
                    onClick={() => goTo(1)}
                    className={`${buttonBase} bg-white hover:bg-[#FFF5C0]`}
                >
                    <ChevronFirst size={16} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    aria-label={t('homePage.previousPage')}
                    title={t('homePage.previousPage')}
                    disabled={!hasItems || page === 1}
                    onClick={() => goTo(page - 1)}
                    className={`${buttonBase} bg-white hover:bg-[#FFF5C0]`}
                >
                    <ChevronLeft size={16} aria-hidden="true" />
                </button>

                {pages.map((item, index) =>
                    item === 'ellipsis' ? (
                        <span
                            key={`ellipsis-${index}`}
                            aria-hidden="true"
                            className="inline-flex h-9 w-6 items-center justify-center text-[#6B7280]"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            aria-label={t('homePage.pageNumber', { page: item })}
                            aria-current={item === page ? 'page' : undefined}
                            onClick={() => goTo(item)}
                            className={`${buttonBase} tabular-nums ${
                                item === page
                                    ? 'bg-[#FFE14D] text-[#14132b]'
                                    : 'bg-white hover:bg-[#FFF5C0]'
                            }`}
                        >
                            {item}
                        </button>
                    ),
                )}

                <button
                    type="button"
                    aria-label={t('homePage.nextPage')}
                    title={t('homePage.nextPage')}
                    disabled={!hasItems || page === lastPage}
                    onClick={() => goTo(page + 1)}
                    className={`${buttonBase} bg-white hover:bg-[#FFF5C0]`}
                >
                    <ChevronRight size={16} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    aria-label={t('homePage.lastPage')}
                    title={t('homePage.lastPage')}
                    disabled={!hasItems || page === lastPage}
                    onClick={() => goTo(lastPage)}
                    className={`${buttonBase} bg-white hover:bg-[#FFF5C0]`}
                >
                    <ChevronLast size={16} aria-hidden="true" />
                </button>
            </div>
        </nav>
    );
}
