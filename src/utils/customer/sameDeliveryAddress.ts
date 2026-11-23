import type { QuotePackage } from '@/types/customer/quote';

function normalizeAddress(address: string) {
    return address
        .toLowerCase()
        .replace(/đ/g, 'd')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9/]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\bduong so (?=\d)/g, 'duong ')
        .replace(
            /(?:^| )(?:thanh pho ho chi minh|tp ho chi minh|tp hcm|ho chi minh|hcm|thanh pho ha noi|tp ha noi|ha noi)$/,
            '',
        )
        .trim();
}

export function sameDeliveryAddress(city: string, address: string, existing: QuotePackage) {
    const normalized = normalizeAddress(address);
    return (
        city === existing.city && !!normalized && normalized === normalizeAddress(existing.address)
    );
}
