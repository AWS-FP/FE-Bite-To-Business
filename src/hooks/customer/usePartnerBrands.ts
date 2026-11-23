import { useEffect, useState } from 'react';
import { getCatalogBrands } from '@/services/customer/catalogReadService';
import type { CatalogBrand } from '@/types/customer/catalog';

/** Thương hiệu có logo để hiển thị ở dải đối tác. */
export function usePartnerBrands() {
    const [brands, setBrands] = useState<CatalogBrand[]>([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        getCatalogBrands(controller.signal)
            .then((items) => {
                if (!controller.signal.aborted) setBrands(items.filter((item) => Boolean(item.logoUrl?.trim())));
            })
            .catch(() => {
                if (!controller.signal.aborted) setError(true);
            });
        return () => controller.abort();
    }, []);

    return { brands, error };
}
