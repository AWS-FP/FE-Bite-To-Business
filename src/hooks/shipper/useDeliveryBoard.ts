import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
    claimPackage,
    completePackage,
    getMyPackages,
    getReadyOrders,
} from '@/services/shipper/deliveryService';
import type { ClaimedPackage, Page, ReadyOrder } from '@/types/shipper/delivery';

// Package đang chờ xác nhận đã giao.
export type PackageAction = { parcel: ClaimedPackage };

export function deliveryErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) return 'Gói này không còn sẵn sàng. Danh sách sẽ được cập nhật lại.';
        const code = error.response?.data?.code || error.code;
        return `Không tải được dữ liệu. Vui lòng thử lại.${code ? ` Mã lỗi: ${code}` : ''}`;
    }
    return 'Không tải được dữ liệu. Vui lòng thử lại.';
}

/** Gom package của tôi theo đơn để hiển thị cùng một khối. */
export function groupPackages(packages: ClaimedPackage[]) {
    const groups: Record<string, ClaimedPackage[]> = {};
    for (const parcel of packages) {
        if (!groups[parcel.orderId]) groups[parcel.orderId] = [];
        groups[parcel.orderId].push(parcel);
    }
    return Object.values(groups);
}

/**
 * Bảng giao nhận của Delivery Staff: đơn sẵn sàng giao, package của tôi,
 * nhận package và xác nhận đã giao (có bước xác nhận).
 */
export function useDeliveryBoard() {
    const [ready, setReady] = useState<Page<ReadyOrder> | null>(null);
    const [mine, setMine] = useState<Page<ClaimedPackage> | null>(null);
    const [readyPage, setReadyPage] = useState(0);
    const [minePage, setMinePage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<PackageAction | null>(null);
    const [acting, setActing] = useState(false);
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
                if (!signal?.aborted) setError(deliveryErrorMessage(err));
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

    function refresh() {
        setLoading(true);
        setError('');
        void load();
    }

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
            const message = deliveryErrorMessage(err);
            setLoading(true);
            await load();
            setError(message);
        } finally {
            setClaiming(null);
        }
    }

    // Thực hiện hành động đã được xác nhận trong hộp thoại.
    async function confirmAction() {
        if (!pendingAction || acting) return;
        const { parcel } = pendingAction;
        setActing(true);
        setError('');
        setNotice('');
        try {
            await completePackage(parcel.packageId);
            setNotice(`Đã xác nhận giao "${parcel.packageName}".`);
            setPendingAction(null);
            setLoading(true);
            await load();
        } catch (err) {
            setPendingAction(null);
            setError(deliveryErrorMessage(err));
        } finally {
            setActing(false);
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

    return {
        ready, mine, readyPage, minePage, loading, claiming, error, notice,
        pendingAction, setPendingAction, acting, confirmAction,
        refresh, receive, changeReadyPage, changeMinePage,
    };
}
