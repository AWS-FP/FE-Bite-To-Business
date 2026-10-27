export function fullDeliveryAddress(
    address: string | null | undefined,
    ward: string | null | undefined,
    district: string | null | undefined,
    province: string | null | undefined,
) {
    return [address, ward, district, province]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(', ');
}
