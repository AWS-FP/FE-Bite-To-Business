export interface BackendHealth {
    status: 'UP';
    service: string;
    roundTripMs: number;
    checkedAt: string;
}
