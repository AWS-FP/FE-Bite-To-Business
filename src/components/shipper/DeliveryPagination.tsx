interface DeliveryPaginationProps {
    page: number;
    totalPages: number;
    loading: boolean;
    onChange: (page: number) => void;
}

export default function DeliveryPagination({
    page,
    totalPages,
    loading,
    onChange,
}: DeliveryPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="mt-4 flex items-center gap-3 text-sm">
            <button
                type="button"
                className="dl-btn"
                disabled={page === 0 || loading}
                onClick={() => onChange(page - 1)}
            >
                Trước
            </button>
            <span>
                {page + 1} / {totalPages}
            </span>
            <button
                type="button"
                className="dl-btn"
                disabled={page + 1 >= totalPages || loading}
                onClick={() => onChange(page + 1)}
            >
                Sau
            </button>
        </div>
    );
}
