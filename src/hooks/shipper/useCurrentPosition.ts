import { useEffect, useState } from 'react';

export type CurrentPosition = { latitude: number; longitude: number };

/** Theo dõi vị trí hiện tại của thiết bị (cần người dùng cho phép truy cập vị trí). */
export function useCurrentPosition(enabled: boolean) {
    const [position, setPosition] = useState<CurrentPosition | null>(null);
    const [denied, setDenied] = useState(false);

    useEffect(() => {
        if (!enabled || typeof navigator === 'undefined' || !navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (result) => setPosition({ latitude: result.coords.latitude, longitude: result.coords.longitude }),
            (failure) => {
                if (failure.code === failure.PERMISSION_DENIED) setDenied(true);
            },
            { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 },
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [enabled]);

    return { position, denied };
}
