import axios from 'axios';
import type { DeliveryCity } from '@/types/location';
const addressApiUrl = 'https://provinces.open-api.vn/api/v2';

/** Bite to Business chỉ giao hàng tại TP. Hồ Chí Minh (mã tỉnh 79). */
export async function getDeliveryCities(signal: AbortSignal): Promise<DeliveryCity[]> {
    const hoChiMinh = await axios.get<DeliveryCity>(`${addressApiUrl}/p/79/?depth=2`, { signal, timeout: 10000 });
    if (hoChiMinh.data.code !== 79 || !Array.isArray(hoChiMinh.data.wards)) {
        throw new Error('The address API returned an invalid city directory.');
    }
    return [hoChiMinh.data];
}
