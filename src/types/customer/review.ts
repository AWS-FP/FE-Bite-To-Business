export interface CustomerReview {
    id: string;
    productId: string;
    customerId: string;
    reviewerName: string;
    rating: number;
    content: string | null;
    createdAt: string;
    updatedAt: string;
    images: { id: string; imageUrl: string; sortOrder: number }[];
}

export interface CustomerReviewsPage {
    content: CustomerReview[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ProductReviewsPage extends CustomerReviewsPage {
    averageRating: number | null;
}

export interface ReviewInput { rating: number; content?: string }

export interface ReviewSummary {
    productId: string;
    reviewCount: number;
    averageRating: number | null;
}
