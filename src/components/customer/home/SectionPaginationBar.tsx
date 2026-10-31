import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export default function SectionPaginationBar({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
}: PaginationBarProps) {
    const startIdx = (currentPage - 1) * pageSize + 1;
    const endIdx = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-0 border-t border-solid border-[#14132b]/10 text-xs">
            <span className="font-semibold text-[#4B5563]">
                Showing <strong>{startIdx}</strong>–<strong>{endIdx}</strong> of{' '}
                <strong>{totalItems}</strong> wholesale products
            </span>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    aria-label="Previous page"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-solid border-[#14132b] bg-white text-[#14132b] shadow-[2px_2px_0_#14132b] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isActive = page === currentPage;
                    return (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            className={`flex h-9 min-w-[36px] cursor-pointer items-center justify-center rounded-lg border-2 border-solid border-[#14132b] px-2.5 text-xs font-extrabold transition-transform ${
                                isActive
                                    ? 'bg-[#FACC15] text-[#14132b] shadow-[2px_2px_0_#14132b] -translate-y-0.5'
                                    : 'bg-white text-[#14132b] hover:bg-[#FFF5C0]'
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    aria-label="Next page"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-solid border-[#14132b] bg-white text-[#14132b] shadow-[2px_2px_0_#14132b] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                >
                    <ChevronRight size={16} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
