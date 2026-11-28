import { Search, X } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';

export default function ExecutiveListSearch({ value, onChange, label, placeholder }: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder: string;
}) {
    const tr = useExecutiveText();
    return (
        <div className={`${executiveUi.selectSearch} h-11 min-w-0 flex-1`}>
            <Search size={18} className="shrink-0 text-store-sage" aria-hidden="true" />
            <input type="search" value={value} maxLength={100}
                onChange={(event) => onChange(event.target.value)}
                aria-label={label} placeholder={placeholder}
                className={`${executiveUi.selectSearchInput} store-search-input`} />
            {value && <button type="button" onClick={() => onChange('')}
                aria-label={tr('Xóa tìm kiếm', 'Clear search')}
                className="grid size-7 shrink-0 place-items-center rounded-md !border-0 bg-transparent text-store-muted hover:bg-surface-green focus-visible:bg-surface-green"><X size={15} /></button>}
        </div>
    );
}
