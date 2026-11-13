import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Package, RefreshCw, Truck } from 'lucide-react';
import DeliveryPagination from '@/components/shipper/DeliveryPagination';
import { claimPackage, getMyPackages, getReadyOrders } from '@/services/shipper/deliveryService';
import type { ClaimedPackage, Page, ReadyOrder } from '@/services/shipper/deliveryService';

function errorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 409)
            return 'Gói này không còn sẵn sàng. Danh sách sẽ được cập nhật lại.';
        const code = error.response?.data?.code || error.code;
        return `Không tải được dữ liệu. Vui lòng thử lại.${code ? ` Mã lỗi: ${code}` : ''}`;
    }
    return 'Không tải được dữ liệu. Vui lòng thử lại.';
}

function groupPackages(packages: ClaimedPackage[]) {
    const groups: Record<string, ClaimedPackage[]> = {};
    for (const parcel of packages) {
        if (!groups[parcel.orderId]) groups[parcel.orderId] = [];
        groups[parcel.orderId].push(parcel);
    }
    return Object.values(groups);
}

export default function CurrentTripPage() {
    const [ready, setReady] = useState<Page<ReadyOrder> | null>(null);
    const [mine, setMine] = useState<Page<ClaimedPackage> | null>(null);
    const [readyPage, setReadyPage] = useState(0);
    const [minePage, setMinePage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const load = useCallback(
        async (signal?: AbortSignal) => {
            try {
                const [readyData, myData] = await Promise.all([
                    getReadyOrders(readyPage, signal),
                    getMyPackages(minePage, signal),
                ]);
                if (signal?.aborted) return;
                if (readyPage > 0 && readyPage >= readyData.totalPages) {
                    setReadyPage(Math.max(0, readyData.totalPages - 1));
                }
                if (minePage > 0 && minePage >= myData.totalPages) {
                    setMinePage(Math.max(0, myData.totalPages - 1));
                }
                setReady(readyData);
                setMine(myData);
            } catch (err) {
                if (!signal?.aborted) setError(errorMessage(err));
            } finally {
                if (!signal?.aborted) setLoading(false);
            }
        },
        [readyPage, minePage],
    );

    useEffect(() => {
        const controller = new AbortController();
        void Promise.resolve().then(() => {
            if (!controller.signal.aborted) return load(controller.signal);
        });
        return () => controller.abort();
    }, [load]);

    async function receive(packageId: string) {
        if (claiming) return;
        setClaiming(packageId);
        setError('');
        setNotice('');
        try {
            await claimPackage(packageId);
            setNotice('Đã nhận package. Thông tin giao hàng nằm trong mục “Package của tôi”.');
            setLoading(true);
            await load();
        } catch (err) {
            const message = errorMessage(err);
            setLoading(true);
            await load();
            setError(message);
        } finally {
            setClaiming(null);
        }
    }

    function changeReadyPage(page: number) {
        setLoading(true);
        setError('');
        setReadyPage(page);
    }

    function changeMinePage(page: number) {
        setLoading(true);
        setError('');
        setMinePage(page);
    }

    return (
        <div className="space-y-6 text-store-ink">
            <div className="flex items-end justify-between gap-5">
                <div>
                    <h1 className="mb-2 mt-2 font-display text-4xl font-bold">
                        Đơn hàng giao nhận
                    </h1>
                    <p className="m-0 text-sm text-store-muted">
                        Chọn từng package trong các đơn hàng đã thanh toán.
                    </p>
                </div>
                <button
                    type="button"
                    className="dl-btn"
                    disabled={loading || !!claiming}
                    onClick={() => {
                        setLoading(true);
                        setError('');
                        void load();
                    }}
                >
                    <RefreshCw size={15} /> Làm mới
                </button>
            </div>
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
            {loading && (
                <p role="status" className="text-sm text-store-muted">
                    Đang tải đơn hàng...
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
                {!loading && mine?.content.length === 0 && (
                    <p className="mb-0 text-sm text-store-muted">Bạn chưa nhận package nào.</p>
                )}
                <div className="space-y-4">
                    {groupPackages(mine?.content || []).map((group) => (
                        <article
                            key={group[0].orderId}
                            className="overflow-hidden rounded-xl border border-store-ink/15"
                        >
                            <div className="bg-store-cream px-4 py-3 text-sm font-bold">
                                {group[0].orderNumber}
                            </div>
                            <div className="divide-y divide-store-ink/10">
                                {group.map((parcel) => (
                                    <div
                                        key={parcel.packageId}
                                        className="flex items-start justify-between gap-3 p-4"
                                    >
                                        <div>
                                            <h3 className="mb-1 mt-0 text-base font-bold">
                                                {parcel.packageName}
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
                                                {parcel.deliveryTimeSlot
                                                    ? ` · ${parcel.deliveryTimeSlot}`
                                                    : ''}
                                            </p>
                                            {parcel.note && (
                                                <p className="mb-0 mt-1 text-sm text-store-muted">
                                                    Ghi chú: {parcel.note}
                                                </p>
                                            )}
                                        </div>
                                        <span className="rounded-lg bg-store-cream px-3 py-1 text-xs font-bold">
                                            {parcel.cancelled ? 'Đã hủy' : 'Đã nhận'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
                {mine && (
                    <DeliveryPagination
                        page={minePage}
                        totalPages={mine.totalPages}
                        loading={loading}
                        onChange={changeMinePage}
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
                                    <p className="mb-0 mt-1 text-xs text-store-muted">
                                        {order.orderNumber}
                                    </p>
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
                    <DeliveryPagination
                        page={readyPage}
                        totalPages={ready.totalPages}
                        loading={loading}
                        onChange={changeReadyPage}
                    />
                )}
            </section>
        </div>
    );
}
