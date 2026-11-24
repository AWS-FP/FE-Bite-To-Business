import type { ClaimedPackage } from '@/types/shipper/delivery';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Hạn giao = ngày giao + giờ kết thúc của khung giờ (vd "08:00 - 22:00"), mặc định cuối ngày.
 * Package chưa giao mà đã quá hạn này hơn 24 giờ thì coi là trễ hạn.
 */
export function deliveryDeadline(parcel: Pick<ClaimedPackage, 'deliveryDate' | 'deliveryTimeSlot'>): Date | null {
    const [year, month, day] = parcel.deliveryDate.split('-').map(Number);
    if (!year || !month || !day) return null;
    const end = parcel.deliveryTimeSlot?.match(/(\d{1,2}):(\d{2})\s*$/);
    const hours = end ? Number(end[1]) : 23;
    const minutes = end ? Number(end[2]) : 59;
    return new Date(year, month - 1, day, hours, minutes);
}

export function isDeliveryOverdue(
    parcel: Pick<ClaimedPackage, 'deliveryDate' | 'deliveryTimeSlot' | 'deliveredAt'>,
    now: Date = new Date(),
): boolean {
    if (parcel.deliveredAt) return false;
    const deadline = deliveryDeadline(parcel);
    return deadline != null && now.getTime() > deadline.getTime() + DAY_MS;
}
