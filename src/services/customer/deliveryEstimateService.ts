import { publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

// Shared delivery estimate endpoints are implemented under BE features/customer/controller.
// Keep output types generic until matching a real response from Vietmap provider.
export async function searchDeliveryAddresses(q: string, city = 'hcm') {
    const { data } = await publicHttp.get<ApiResponse<unknown[]>>('/api/delivery-estimate/addresses', { params: { q, city } });
    return data.data;
}
export async function estimateDelivery(refId: string, city = 'hcm') {
    const { data } = await publicHttp.get<ApiResponse<unknown>>('/api/delivery-estimate', { params: { refId, city } });
    return data.data;
}
export async function geocodeDeliveryAddress(address: string, city = 'hcm') {
    const { data } = await publicHttp.get<ApiResponse<unknown>>('/api/delivery-estimate/geocode', { params: { address, city } });
    return data.data;
}
export async function reverseDeliveryGeocode(lat: number, lng: number) {
    const { data } = await publicHttp.get<ApiResponse<unknown>>('/api/delivery-estimate/reverse', { params: { lat, lng } });
    return data.data;
}
export async function estimateDeliveryCoordinates(lat: number, lng: number, city = 'hcm') {
    const { data } = await publicHttp.get<ApiResponse<unknown>>('/api/delivery-estimate/coordinates', { params: { lat, lng, city } });
    return data.data;
}
