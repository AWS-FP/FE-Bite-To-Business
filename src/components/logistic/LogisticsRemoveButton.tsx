import { Trash2 } from 'lucide-react';

export default function LogisticsRemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button type="button" title={label} aria-label={label} onClick={onClick}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md !border !border-red-200 !bg-white !p-0 text-red-700 hover:!bg-red-50 hover:!border-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            <Trash2 size={17} aria-hidden="true" />
        </button>
    );
}
