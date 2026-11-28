import type { WarehouseProductDetail } from '@/types/logistic/warehouseProduct';

const stringValue = (value: string | number | null | undefined) => value == null ? '' : String(value);
const sellingSpecPattern = /^(quy cách bán|selling spec|sales spec)\s*[:：]\s*/iu;

export function readSellingSpec(content: string | null) {
    return content?.split(/\s*\|\s*/).find(part => sellingSpecPattern.test(part))
        ?.replace(sellingSpecPattern, '') ?? '';
}

export function writeSellingSpec(content: string | null | undefined, label: string, value: string) {
    const parts = content?.split(/\s*\|\s*/).filter(Boolean) ?? [];
    const entry = `${label}: ${value.replace(/\|/g, '/')}`;
    const index = parts.findIndex(part => sellingSpecPattern.test(part));
    if (index < 0) parts.push(entry);
    else parts[index] = entry;
    return parts.join(' | ');
}

export function warehouseProductValues(product: WarehouseProductDetail): Record<string, string> {
    const values = Object.fromEntries([
        'nameVi', 'nameEn', 'sku', 'origin', 'descriptionVi', 'descriptionEn', 'note',
        'specVi', 'specEn', 'unit', 'minOrder', 'vat', 'price', 'netWeight', 'tareWeight',
        'length', 'width', 'height', 'storageVi', 'storageEn',
    ].map(key => [key, stringValue(product[key as keyof WarehouseProductDetail] as string | number | null)]));
    return {
        ...values,
        category: stringValue(product.categoryId), brand: stringValue(product.brandId),
        distributor: stringValue(product.distributorId),
        sellingSpecVi: readSellingSpec(product.technicalVi), sellingSpecEn: readSellingSpec(product.technicalEn),
        // V67 stores volume in cm³; hydrate the wizard without unit conversion.
        volume: stringValue(product.volume),
    };
}
