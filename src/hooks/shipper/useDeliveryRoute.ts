import { useEffect, useState } from 'react';
import { getPackageRoute } from '@/services/shipper/deliveryService';
import { deliveryMapCities } from '@/utils/deliveryMapCities';
import type { DeliveryRoute } from '@/types/shipper/delivery';

/** Route from the Bitexco branch to the delivery package. */
export function useDeliveryRoute(packageId: string | undefined) {
    const [result, setResult] = useState<{ packageId: string; route: DeliveryRoute | null } | null>(null);

    useEffect(() => {
        if (!packageId) return;
        const controller = new AbortController();
        const [longitude, latitude] = deliveryMapCities.hcm.origin;
        getPackageRoute(packageId, latitude, longitude, controller.signal)
            .then((route) => { if (!controller.signal.aborted) setResult({ packageId, route }); })
            .catch(() => { if (!controller.signal.aborted) setResult({ packageId, route: null }); });
        return () => controller.abort();
    }, [packageId]);

    const current = result?.packageId === packageId ? result : null;
    return { route: current?.route ?? null, failed: !!current && !current.route };
}
