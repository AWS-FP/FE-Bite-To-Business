import { publicHttp } from './axiosClient';

export type MapLocation = { address: string; lat: number; lng: number };

export async function addressToCoordinates(address: string, city: 'hcm' | 'hanoi') {
    const response = await publicHttp.get<{ data: MapLocation }>('/api/delivery-estimate/geocode', {
        params: { address, city },
    });
    return response.data.data;
}

export async function coordinatesToAddress(lat: number, lng: number) {
    const response = await publicHttp.get<{ data: MapLocation }>('/api/delivery-estimate/reverse', {
        params: { lat, lng },
    });
    return response.data.data;
}
