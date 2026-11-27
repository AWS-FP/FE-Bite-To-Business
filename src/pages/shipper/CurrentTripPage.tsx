import ListSkeleton from '@/components/common/ListSkeleton';
import { Package, RefreshCw, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { routePaths } from '@/router/routes';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { SectionHeading } from '@/components/shipper/DeliveryUI';
import { useDelivery } from '@/components/shipper/DeliveryModel';
import { groupPackages, useDeliveryBoard } from '@/hooks/shipper/useDeliveryBoard';
import { isDeliveryOverdue } from '@/utils/shipper/deliveryDeadline';

export default function CurrentTripPage() {
    const { language } = useDelivery();
    const {
        ready, mine, readyPage, minePage, loading, claiming, error, notice,
        pendingAction, setPendingAction, acting, confirmAction,
        refresh, receive, changeReadyPage, changeMinePage,
    } = useDeliveryBoard();

    return (
        <div className="space-y-6 text-store-ink">
            <SectionHeading
                number="01"
                eyebrow={language === 'vi' ? 'QUẢN LÝ GIAO NHẬN' : 'DELIVERY MANAGEMENT'}
                title={language === 'vi' ? 'Đơn hàng giao nhận' : 'Delivery orders'}
                description={language === 'vi' ? 'Chọn từng package trong các đơn hàng đã thanh toán.' : 'Choose packages from paid orders.'}
                action={
                <button
                    type="button"
                    className="dl-btn"
                    disabled={loading || !!claiming}
                    onClick={refresh}
                >
                    <RefreshCw size={15} /> {language === 'vi' ? 'Làm mới' : 'Refresh'}
                </button>
                }
            />
            {error && (
                <p
                    role="alert"
                    className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
                >
                    {error}
                </p>
            )}
            {notice && (
                <p
                    role="status"
                    className="rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-store-green"
                >
                    {notice}
                </p>
            )}

            <section className="rounded-2xl border border-store-ink/15 bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-store-cream text-store-green">
                        <Truck size={21} />
                    </span>
                    <div>
                        <h2 className="m-0 font-subheading text-xl font-bold">Package của tôi</h2>
                        <p className="mb-0 mt-1 text-sm text-store-muted">
                            Các package bạn đã nhận giao.
                        </p>
                    </div>
                </div>
                {loading && !mine && <ListSkeleton lines={4} className="space-y-4" rowClassName="flex items-start justify-between gap-3 rounded-xl border border-store-ink/15 p-4" />}
                {!loading && mine?.content.length === 0 && (
                    <p className="mb-0 text-sm text-store-muted">Bạn chưa nhận package nào.</p>
                )}
                <div className="space-y-4">
                    {groupPackages(mine?.content || []).map((group) => (
                        <article
                            key={group[0].orderId}
                            className="overflow-hidden rounded-xl border border-store-ink/15"
                        >
                            <div className="divide-y divide-store-ink/10">
                                {group.map((parcel) => (
                                    <div
                                        key={parcel.packageId}
                                        className="flex items-start justify-between gap-3 p-4"
                                    >
                                        <div>
                                            <h3 className="mb-1 mt-0 flex flex-wrap items-center gap-2 text-base font-bold">
                                                {parcel.packageName}
                                                {isDeliveryOverdue(parcel) && (
                                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                                                        Trễ hạn hơn 24 giờ
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="my-1 text-sm text-store-muted">
                                                {parcel.address}
                                            </p>
                                            <p className="my-1 text-sm">
                                                {parcel.recipientName || 'Chưa có tên'} ·{' '}
                                                {parcel.recipientPhone || 'Chưa có số điện thoại'}
                                            </p>
                                            <p className="mb-0 mt-1 text-sm text-store-muted">
                                                {parcel.deliveryDate}

                                            </p>
                                            {parcel.note && (
                                                <p className="mb-0 mt-1 text-sm text-store-muted">
                                                    Ghi chú: {parcel.note}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 flex-col items-stretch gap-2">
                                            <Link className="dl-btn" to={routePaths.deliveryTripDetail(parcel.packageId)}>Xem chi tiết</Link>
                                            <button
                                                type="button"
                                                className="dl-btn dl-btn--primary"
                                                disabled={acting || loading}
                                                onClick={() => setPendingAction({ parcel })}
                                            >
                                                Đã giao
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
                {mine && (
                    <Pagination
                        page={minePage}
                        totalPages={mine.totalPages}
                        loading={loading}
                        onPageChange={changeMinePage}
                    />
                )}
            </section>
            <section className="rounded-2xl border border-store-ink/15 bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-store-cream text-store-green">
                        <Package size={21} />
                    </span>
                    <div>
                        <h2 className="m-0 font-subheading text-xl font-bold">Đơn sẵn sàng giao</h2>
                        <p className="mb-0 mt-1 text-sm text-store-muted">
                            Các package được nhóm theo đơn hàng.
                        </p>
                    </div>
                </div>
                {loading && !ready && <ListSkeleton lines={4} className="space-y-4" rowClassName="flex items-start justify-between gap-3 rounded-xl border border-store-ink/15 p-4" />}
                {!loading && ready?.content.length === 0 && (
                    <p className="mb-0 text-sm text-store-muted">
                        Hiện chưa có package sẵn sàng giao.
                    </p>
                )}
                <div className="space-y-4">
                    {ready?.content.map((order) => (
                        <article
                            key={order.orderId}
                            className="overflow-hidden rounded-xl border border-store-ink/15"
                        >
                            <div className="flex items-center justify-between bg-store-cream px-4 py-3">
                                <div>
                                    <strong>Đơn của {order.customerName}</strong>
                                </div>
                                <span className="text-xs font-bold">
                                    {order.packages.length} package
                                </span>
                            </div>
                            <div className="divide-y divide-store-ink/10">
                                {order.packages.map((parcel) => (
                                    <div
                                        key={parcel.id}
                                        className="flex items-center justify-between gap-4 p-4"
                                    >
                                        <div>
                                            <h3 className="m-0 font-bold">{parcel.name}</h3>
                                            <p className="mb-0 mt-1 text-sm text-store-muted">
                                                {parcel.address} · {parcel.deliveryDate}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="dl-btn dl-btn--primary"
                                            disabled={!!claiming || loading}
                                            onClick={() => void receive(parcel.id)}
                                        >
                                            {claiming === parcel.id
                                                ? 'Đang nhận...'
                                                : 'Nhận package'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
                {ready && (
                    <Pagination
                        page={readyPage}
                        totalPages={ready.totalPages}
                        loading={loading}
                        onPageChange={changeReadyPage}
                    />
                )}
            </section>
            <ConfirmModal
                open={pendingAction !== null}
                title="Xác nhận đã giao?"
                message={`Xác nhận "${pendingAction?.parcel.packageName ?? ''}" đã được giao cho khách. Giao xong mọi package thì đơn hàng hoàn thành.`}
                confirmLabel={acting ? 'Đang xử lý...' : 'Đã giao'}
                cancelLabel="Quay lại"
                busy={acting}
                onConfirm={() => void confirmAction()}
                onCancel={() => !acting && setPendingAction(null)}
            />
        </div>
    );
}
