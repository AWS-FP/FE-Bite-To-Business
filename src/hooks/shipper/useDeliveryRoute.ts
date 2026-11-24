import { useEffect, useRef, useState } from 'react';
import { getPackageRoute } from '@/services/shipper/deliveryService';
import type { CurrentPosition } from '@/hooks/shipper/useCurrentPosition';
import type { DeliveryRoute } from '@/types/shipper/delivery';

// Chỉ hỏi lại VietMap khi đã đi xa hơn ngưỡng này, tránh gọi API theo từng lần GPS cập nhật.
const REFETCH_DISTANCE_METRES = 50;

function distanceMetres(a: CurrentPosition, b: CurrentPosition) {
    const rad = Math.PI / 180;
    const dLat = (b.latitude - a.latitude) * rad;
    const dLng = (b.longitude - a.longitude) * rad;
    const h = Math.sin(dLat / 2) ** 2
        + Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLng / 2) ** 2;
    return 6371000 * 2 * Math.asin(Math.sqrt(h));
}

/** Đường đi theo đường thật (VietMap) từ vị trí hiện tại tới điểm giao của package. */
export function useDeliveryRoute(packageId: string | undefined, position: CurrentPosition | null) {
    const [route, setRoute] = useState<DeliveryRoute | null>(null);
    const [failed, setFailed] = useState(false);
    const lastOrigin = useRef<CurrentPosition | null>(null);
    const inFlight = useRef(false);
    const controller = useRef<AbortController | null>(null);

    // Hủy request đang chạy khi rời trang.
    useEffect(() => () => controller.current?.abort(), []);

    useEffect(() => {
        if (!packageId || !position || inFlight.current) return;
        if (lastOrigin.current && distanceMetres(lastOrigin.current, position) < REFETCH_DISTANCE_METRES) return;
        lastOrigin.current = position;
        inFlight.current = true;
        const request = new AbortController();
        controller.current = request;
        getPackageRoute(packageId, position.latitude, position.longitude, request.signal)
            .then((data) => {
                if (request.signal.aborted) return;
                setRoute(data);
                setFailed(false);
            })
            .catch(() => {
                if (request.signal.aborted) return;
                // Lần GPS cập nhật sau sẽ thử lại.
                lastOrigin.current = null;
                setFailed(true);
            })
            .finally(() => {
                inFlight.current = false;
            });
    }, [packageId, position]);

    return { route, failed };
}
