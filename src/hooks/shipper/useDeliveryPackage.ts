import { useEffect, useState } from 'react';
import { completePackage, getPackageDetail } from '@/services/shipper/deliveryService';
import type { ClaimedPackage } from '@/types/shipper/delivery';
import { deliveryErrorMessage } from '@/hooks/shipper/useDeliveryBoard';

/** Chi tiết một package đã nhận, kèm xác nhận đã giao. */
export function useDeliveryPackage(packageId?: string) {
    const [parcel, setParcel] = useState<ClaimedPackage | null>(null);
    const [error, setError] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [acting, setActing] = useState(false);
    const [notice, setNotice] = useState('');

    useEffect(() => {
        let active = true;
        if (packageId) {
            getPackageDetail(packageId)
                .then((data) => {
                    if (active) setParcel(data);
                })
                .catch(() => {
                    if (active) setError('Không tải được thông tin package. Vui lòng thử lại.');
                });
        }
        return () => {
            active = false;
        };
    }, [packageId]);

    async function confirmAction() {
        if (!parcel || !confirming || acting) return;
        setActing(true);
        setError('');
        try {
            setParcel(await completePackage(parcel.packageId));
            setNotice('Đã xác nhận giao package.');
            setConfirming(false);
        } catch (err) {
            setConfirming(false);
            setError(deliveryErrorMessage(err));
        } finally {
            setActing(false);
        }
    }

    return { parcel, error, notice, confirming, setConfirming, acting, confirmAction };
}
