export interface FavoriteProduct {
    productId: string;
    sku: string;
    nameVi: string;
    nameEn: string;
    imageUrl: string | null;
    listPrice: number | null;
    favoritedAt: string;
}

export interface FavoriteStatus { productId: string; favorite: boolean }

export interface FavoritePage {
    content: FavoriteProduct[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
