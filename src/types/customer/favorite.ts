import type { HomeProduct } from '@/types/customer/home';

export interface FavoriteProduct extends HomeProduct {
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
