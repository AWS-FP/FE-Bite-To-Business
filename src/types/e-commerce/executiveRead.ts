export interface ExecutivePriceTier {
    id: string;
    minQuantity: number;
    maxQuantity: number | null;
    unitPrice: number;
}

export interface ExecutivePricing {
    productId: string;
    sku: string;
    unitCode: string;
    currency: string;
    minOrderQuantity: number;
    quantityStep: number;
    priceAvailable: boolean;
    listPrice: number | null;
    salePrice: number | null;
    saleActive: boolean;
    inventoryAvailable: boolean;
    availableQuantity: number | null;
    priceTiers: ExecutivePriceTier[];
}

export interface ExecutiveVat {
    productId: string;
    sku: string;
    vatRate: number | null;
    vatUpdatedAt: string | null;
}
