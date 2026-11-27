import ListSkeleton from '@/components/common/ListSkeleton';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '@/components/common/Pagination';
import { SectionHeading, StatusBadge } from '@/components/shipper/DeliveryUI';
import { useDelivery } from '@/components/shipper/DeliveryModel';
import { useDeliveryHistory } from '@/hooks/shipper/useDeliveryHistory';
import { routePaths } from '@/router/routes';

function formatDeliveredAt(value: string | null, language: 'vi' | 'en') {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date);
}

export default function DeliveryHistoryPage() {
    const { language } = useDelivery();
    const vi = language === 'vi';
    const { data, page, loading, error, changePage, refresh } = useDeliveryHistory();
    const parcels = data?.content ?? [];

    return (
        <div className="space-y-6 text-store-ink">
            <SectionHeading
                number="02"
                eyebrow={vi ? 'NHẬT KÝ HOÀN TẤT THỰC TẾ' : 'DELIVERY COMPLETION LOG'}
                title={vi ? 'Lịch sử chuyến giao' : 'Delivery history'}
                description={vi ? 'Các package bạn đã giao xong, mới nhất ở trên cùng.' : 'Packages you have delivered, newest first.'}
                action={
                    <button type="button" className="dl-btn" disabled={loading} onClick={refresh}>
                        <RefreshCw size={15} /> {vi ? 'Làm mới' : 'Refresh'}
                    </button>
                }
            />
            {error && (
                <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </p>
            )}
            <section className="rounded-2xl border border-store-ink/15 bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-store-cream text-store-green">
                        <CheckCircle2 size={21} />
                    </span>
                    <div>
                        <h2 className="m-0 font-subheading text-xl font-bold">{vi ? 'Package đã giao' : 'Delivered packages'}</h2>
                        {data && (
                            <p className="mb-0 mt-1 text-sm text-store-muted">
                                {vi ? `Tổng cộng ${data.totalElements} package` : `${data.totalElements} packages in total`}
                            </p>
                        )}
                    </div>
                </div>
                {loading && !data && (
                    <ListSkeleton lines={5} rowClassName="flex items-start justify-between gap-3 rounded-xl border border-store-ink/15 p-4" className="space-y-4" />
                )}
                {!loading && !error && parcels.length === 0 && (
                    <p className="mb-0 text-sm text-store-muted">{vi ? 'Bạn chưa giao xong package nào.' : 'You have not delivered any package yet.'}</p>
                )}
                <div className="divide-y divide-store-ink/10 overflow-hidden rounded-xl border border-store-ink/15">
                    {parcels.map((parcel) => (
                        <div key={parcel.packageId} className="flex items-start justify-between gap-3 p-4">
                            <div>
                                <h3 className="mb-1 mt-0 flex flex-wrap items-center gap-2 text-base font-bold">
                                    {parcel.packageName}
                                    {parcel.cancelled ? (
                                        <StatusBadge tone="warning">{vi ? 'Đã hủy' : 'Cancelled'}</StatusBadge>
                                    ) : (
                                        <StatusBadge>{vi ? 'Đã giao' : 'Delivered'}</StatusBadge>
                                    )}
                                </h3>
                                <p className="my-1 text-sm text-store-muted">
                                    {vi ? 'Đơn' : 'Order'} {parcel.orderNumber} · {parcel.packageNumber}
                                </p>
                                <p className="my-1 text-sm text-store-muted">{parcel.address}</p>
                                <p className="my-1 text-sm">
                                    {parcel.recipientName || (vi ? 'Chưa có tên' : 'No name')}
                                    {parcel.recipientPhone ? ` · ${parcel.recipientPhone}` : ''}
                                </p>
                                <p className="mb-0 mt-1 text-sm font-semibold text-store-green">
                                    {vi ? 'Giao lúc' : 'Delivered at'} {formatDeliveredAt(parcel.deliveredAt, language)}
                                </p>
                            </div>
                            <Link className="dl-btn shrink-0" to={routePaths.deliveryTripDetail(parcel.packageId)}>
                                {vi ? 'Xem chi tiết' : 'View details'}
                            </Link>
                        </div>
                    ))}
                </div>
                {data && (
                    <Pagination page={page} totalPages={data.totalPages} loading={loading} onPageChange={changePage} />
                )}
            </section>
        </div>
    );
}
