import type { ClaimedPackage } from '@/types/shipper/delivery';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Hạn giao = cuối ngày giao của package (giao hàng chỉ theo ngày, không có khung giờ). */
export function deliveryDeadline(parcel: Pick<ClaimedPackage, 'deliveryDate'>): Date | null {
    const [year, month, day] = parcel.deliveryDate.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day, 23, 59);
}

/** Package chưa giao mà đã quá cuối ngày giao hơn 24 giờ thì coi là trễ hạn. */
export function isDeliveryOverdue(
    parcel: Pick<ClaimedPackage, 'deliveryDate' | 'deliveredAt'>,
    now: Date = new Date(),
): boolean {
    if (parcel.deliveredAt) return false;
    const deadline = deliveryDeadline(parcel);
    return deadline != null && now.getTime() > deadline.getTime() + DAY_MS;
}
