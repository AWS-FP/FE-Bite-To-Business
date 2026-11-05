
export type DistributionCityId = 'hcm' | 'hanoi';

export interface DistributionCity {
    id: DistributionCityId;
    name: string;
    shortName: string;
    subtitle: string;
    areaLabel: string;
    index: string;
}

export const DISTRIBUTION_CITIES: readonly DistributionCity[] = [
    {
        id: 'hcm',
        name: 'TP. Hồ Chí Minh',
        shortName: 'TP.HCM',
        subtitle: 'Khu vực phía Nam',
        areaLabel: 'Miền Nam',
        index: '01',
    },
    {
        id: 'hanoi',
        name: 'Hà Nội',
        shortName: 'Hà Nội',
        subtitle: 'Khu vực phía Bắc',
        areaLabel: 'Miền Bắc',
        index: '02',
    },
] as const;

export function getDistributionCity(
    id: string | null
): DistributionCity {
    return (
        DISTRIBUTION_CITIES.find((city) => city.id === id) ??
        DISTRIBUTION_CITIES[0]
    );
}
