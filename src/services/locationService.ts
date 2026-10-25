import axios from 'axios';
import type { DeliveryCity } from '@/types/location';
const addressApiUrl = 'https://provinces.open-api.vn/api/v2';

export async function getDeliveryCities(signal: AbortSignal): Promise<DeliveryCity[]> {
    const [hanoi, hoChiMinh] = await Promise.all([
        axios.get<DeliveryCity>(`${addressApiUrl}/p/1/?depth=2`, { signal, timeout: 10000 }),
        axios.get<DeliveryCity>(`${addressApiUrl}/p/79/?depth=2`, { signal, timeout: 10000 }),
    ]);
    if (
        hanoi.data.code !== 1 ||
        hoChiMinh.data.code !== 79 ||
        !Array.isArray(hanoi.data.wards) ||
        !Array.isArray(hoChiMinh.data.wards)
    ) {
        throw new Error('The address API returned an invalid city directory.');
    }
    return [hanoi.data, hoChiMinh.data];
}
