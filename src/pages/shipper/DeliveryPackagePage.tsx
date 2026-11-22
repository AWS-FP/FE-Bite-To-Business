import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DeliveryMap from '@/components/shipper/DeliveryMap';
import { getPackageDetail } from '@/services/shipper/deliveryService';
import type { ClaimedPackage } from '@/services/shipper/deliveryService';
import { ROUTES } from '@/router/routes';
import PageNav from '@/components/common/PageNav';

export default function DeliveryPackagePage() {
    const { tripId } = useParams();
    const [parcel, setParcel] = useState<ClaimedPackage | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        if (tripId) {
            getPackageDetail(tripId).then(data => {
                if (active) setParcel(data);
            }).catch(() => {
                if (active) setError('Không tải được thông tin package. Vui lòng thử lại.');
            });
        }
        return () => { active = false; };
    }, [tripId]);

    return (
        <div className="space-y-6 text-store-ink">
            <PageNav back={{ label: 'Quay lại', to: ROUTES.DELIVERY_TRIPS }} />
            <h1 className="font-subheading text-3xl font-bold">Chi tiết package</h1>
            {error && <p role="alert">{error}</p>}
            {!parcel && !error && <p>Đang tải thông tin...</p>}
            {parcel && <div className="grid grid-cols-[minmax(260px,1fr)_2fr] gap-6">
                <section className="space-y-5 rounded-2xl border border-store-ink/15 bg-white p-6">
                    <div><strong>Package</strong><p>{parcel.packageName} · {parcel.packageNumber}</p></div>
                    <div><strong>Đơn hàng</strong><p>{parcel.orderNumber}</p></div>
                    <div><strong>Người nhận</strong><p>{parcel.recipientName || 'Chưa có thông tin'}<br />{parcel.recipientPhone || 'Chưa có số điện thoại'}</p></div>
                    <div><strong>Địa chỉ giao hàng</strong><p>{parcel.address}</p></div>
                    <div><strong>Thời gian giao</strong><p>{parcel.deliveryDate} {parcel.deliveryTimeSlot || ''}</p></div>
                    <div><strong>Ghi chú giao hàng</strong><p>{parcel.note || 'Không có ghi chú'}</p></div>
                </section>
                <DeliveryMap latitude={parcel.latitude} longitude={parcel.longitude} city={parcel.city} />
            </div>}
        </div>
    );
}
