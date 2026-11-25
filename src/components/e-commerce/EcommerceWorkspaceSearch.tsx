import { Search, X } from 'lucide-react';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import { useEcommerceWorkspaceSearch } from '@/hooks/e-commerce/useEcommerceWorkspaceSearch';

/** Presentation-only workspace search; navigation and draft state belong in the hook. */
export default function EcommerceWorkspaceSearch() {
    const tr = useExecutiveText();
    const { keyword, setKeyword, submit } = useEcommerceWorkspaceSearch();

    return (
        <form
            role="search"
            onSubmit={submit}
            className="group hidden h-12 w-64 shrink-0 items-center overflow-hidden rounded-full border-2 border-solid border-[#204b37] bg-white shadow-[0_3px_0_rgba(17,56,39,0.18)] transition-colors focus-within:border-[#157344] focus-within:ring-[3px] focus-within:ring-[#a6d6b6]/50 xl:flex 2xl:w-[360px]"
        >
            <Search size={18} className="ml-4 shrink-0 text-[#305c47]" aria-hidden="true" />
            <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                maxLength={100}
                autoComplete="off"
                aria-label={tr('Tìm nhanh theo tên hoặc SKU', 'Search products by name or SKU')}
                placeholder={tr('Tên sản phẩm', 'Product name')}
                className="min-w-0 flex-1 appearance-none !border-0 bg-transparent px-3 text-[13px] font-medium text-[#173d2d] !outline-none !shadow-none focus:!border-0 focus:!outline-none focus:!shadow-none placeholder:font-normal placeholder:text-[#789084] [&::-webkit-search-cancel-button]:hidden"
            />
            {keyword.length > 0 && (
                <button
                    type="button"
                    onClick={() => setKeyword('')}
                    aria-label={tr('Xóa từ khóa tìm kiếm', 'Clear search')}
                    className="mr-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#607d6e] hover:bg-[#e8f1e8] hover:text-[#173d2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#157344]"
                >
                    <X size={15} aria-hidden="true" />
                </button>
            )}
            <button
                type="submit"
                className="flex h-full shrink-0 cursor-pointer items-center justify-center gap-1.5 border-0 border-l-2 border-solid border-[#204b37] bg-store-yellow px-4 text-[13px] font-bold text-[#102b21] transition-colors hover:bg-[#ffe982] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#153e2d]"
            >
                <Search size={15} aria-hidden="true" />
                <span>{tr('Tìm', 'Search')}</span>
            </button>
        </form>
    );
}
