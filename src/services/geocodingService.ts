import { publicHttp } from './axiosClient';
import type { AddressSuggestion, MapLocation } from '@/types/geocoding';

export async function searchDeliveryAddresses(
    address: string,
    city: 'hcm',
    signal: AbortSignal,
) {
    const response = await publicHttp.get<{ data: AddressSuggestion[] }>(
        '/api/delivery-estimate/addresses',
        {
            params: { q: address, city },
            signal,
        },
    );
    return response.data.data;
}

export async function placeToCoordinates(refId: string) {
    const response = await publicHttp.get<{ data: MapLocation }>('/api/delivery-estimate/place', {
        params: { refId },
        timeout: 20_000,
    });
    return response.data.data;
}

export async function addressToCoordinates(address: string, city: 'hcm') {
    const response = await publicHttp.get<{ data: MapLocation }>('/api/delivery-estimate/geocode', {
        params: { address, city },
        timeout: 35_000,
    });
    return response.data.data;
}

export async function coordinatesToAddress(lat: number, lng: number) {
    const response = await publicHttp.get<{ data: MapLocation }>('/api/delivery-estimate/reverse', {
        params: { lat, lng },
    });
    return response.data.data;
}
