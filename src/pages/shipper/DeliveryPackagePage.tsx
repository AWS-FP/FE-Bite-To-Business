import { useParams } from 'react-router-dom';
import DeliveryMap from '@/components/shipper/DeliveryMap';
import ConfirmModal from '@/components/common/ConfirmModal';
import PageNav from '@/components/common/PageNav';
import { useDeliveryPackage } from '@/hooks/shipper/useDeliveryPackage';
import { ROUTES } from '@/router/routes';
import { isDeliveryOverdue } from '@/utils/shipper/deliveryDeadline';

export default function DeliveryPackagePage() {
    const { tripId } = useParams();
    const { parcel, error, confirming, setConfirming, acting, confirmAction } = useDeliveryPackage(tripId);
    const delivered = !!parcel?.deliveredAt;

    return (
        <div className="space-y-6 text-store-ink">
            <PageNav back={{ label: 'Quay lại', to: ROUTES.DELIVERY_TRIPS }} />
            <h1 className="font-subheading text-3xl font-bold">Chi tiết package</h1>
            {error && <p role="alert">{error}</p>}
            {!parcel && !error && <p>Đang tải thông tin...</p>}
            {parcel && <div className="grid grid-cols-[minmax(260px,1fr)_2fr] gap-6">
                <section className="space-y-5 rounded-2xl border border-store-ink/15 bg-white p-6">
                    <div><strong>Package</strong><p>{parcel.packageName}</p></div>
                    {isDeliveryOverdue(parcel) && (
                        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
                            Đã trễ hạn giao hơn 24 giờ so với thời gian giao của package.
                        </p>
                    )}
                    <div><strong>Người nhận</strong><p>{parcel.recipientName || 'Chưa có thông tin'}<br />{parcel.recipientPhone || 'Chưa có số điện thoại'}</p></div>
                    <div><strong>Địa chỉ giao hàng</strong><p>{parcel.address}</p></div>
                    <div><strong>Ngày giao</strong><p>{parcel.deliveryDate}</p></div>
                    <div><strong>Ghi chú giao hàng</strong><p>{parcel.note || 'Không có ghi chú'}</p></div>
                    {delivered ? (
                        <p className="rounded-lg bg-surface-green p-3 text-sm font-semibold text-store-green">Đã giao xong package này.</p>
                    ) : (
                        <button type="button" className="dl-btn dl-btn--primary" disabled={acting} onClick={() => setConfirming(true)}>
                            Xác nhận đã giao
                        </button>
                    )}
                </section>
                <DeliveryMap latitude={parcel.latitude} longitude={parcel.longitude} city={parcel.city} packageId={parcel.packageId} />
            </div>}
            <ConfirmModal
                open={confirming}
                title="Xác nhận đã giao?"
                message={`Xác nhận "${parcel?.packageName ?? ''}" đã được giao cho khách. Giao xong mọi package thì đơn hàng hoàn thành.`}
                confirmLabel={acting ? 'Đang xử lý...' : 'Đã giao'}
                cancelLabel="Quay lại"
                busy={acting}
                onConfirm={() => void confirmAction()}
                onCancel={() => !acting && setConfirming(false)}
            />
        </div>
    );
}
