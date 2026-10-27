export interface DeliveryWard {
    code: number;
    name: string;
}

export interface DeliveryCity {
    code: number;
    name: string;
    wards: DeliveryWard[];
}
