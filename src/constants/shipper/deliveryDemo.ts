import type { DeliveryHistoryItem, DeliveryTrip } from '../../types/shipper/delivery';

// Mock data for the Delivery Staff UI only. Never treat these as backend results.
export const DEMO_DRIVER = { name: 'Lê Hoàng Long', employeeCode: 'NV-003', initials: 'LL' } as const;

export const DEMO_TRIP: DeliveryTrip = {
    id: 'trip-512',
    orderCode: 'ORD-2026-512',
    customer: 'Công ty TNHH An Nhiên',
    packageCount: 2,
    stopCount: 2,
    distanceKm: 10.6,
    etaMinutes: 21,
    warehouse: 'Landmark 81 Hub',
    status: 'IN_DELIVERY',
    packages: [
        {
            id: 'PKG-512-A', stopNumber: 1, destinationName: 'Chi nhánh Quận 1', distanceKm: 4.2,
            recipient: 'Chị Lan (Barista Trưởng)', phone: '0912345678',
            address: '88 Đồng Khởi, Phường Bến Nghé, Quận 1, TP.HCM',
            products: '02 Thùng Sữa Tươi Barista Milk 1L + 05 kg Cam Vàng Úc',
            note: 'Giao cổng phụ đường Mạc Thị Bưởi, gọi trước 5 phút.',
        },
        {
            id: 'PKG-512-B', stopNumber: 2, destinationName: 'Bếp Trung Tâm Quận 3', distanceKm: 6.4,
            recipient: 'Bếp Trưởng Minh', phone: '0908688688',
            address: '142 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP.HCM',
            products: '10 kg Phi Lê Cá Hồi Na Uy Trim C + 06 Vỉ Trứng Gà Omega-3',
            note: 'Cá hồi giữ nguyên đá gel trong thùng xốp, bàn giao khu sơ chế lạnh.',
        },
    ],
};

export const DEMO_HISTORY: DeliveryHistoryItem[] = [
    {
        id: 'history-504', orderCode: 'ORD-2026-504', customer: 'Công ty TNHH Green Table',
        packageCount: 2, stopCount: 2, eta: '22/10/2026 06:00',
        completedAt: '22/10/2026 05:54', differenceMinutes: -6, status: 'COMPLETED',
    },
    {
        id: 'history-498', orderCode: 'ORD-2026-498', customer: 'Công ty TNHH An Nhiên',
        packageCount: 1, stopCount: 1, eta: '21/10/2026 08:30',
        completedAt: '21/10/2026 08:38', differenceMinutes: 8, status: 'COMPLETED',
    },
];
