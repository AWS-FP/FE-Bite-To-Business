export type FinanceFilters = { from: string; to: string; group: string; customerId?: string };
export type FinancePeriod = {
    date: string;
    collected: number;
    refunded: number;
    netCollected: number;
    completedAmount: number;
    completedOrders: number;
};
export type FinanceReport = FinanceFilters & {
    currency: string;
    timezone: string;
    summary: {
        orders: number;
        completedOrders: number;
        cancelledOrders: number;
        completedAmount: number;
        paymentCount: number;
        collected: number;
        refundCount: number;
        refunded: number;
        netCollected: number;
        openReviewCount: number;
        openReviewAmount: number;
    };
    periods: FinancePeriod[];
};
export type FinanceTransaction = {
    id: string;
    kind: string;
    time: string;
    orderId: string | null;
    orderNumber: string | null;
    customerId: string | null;
    status: string;
    amount: number | null;
    currency: string;
    reference: string | null;
};
export type FinanceCustomer = {
    customerId: string;
    name: string;
    orders: number;
    completedOrders: number;
    collected: number;
    refunded: number;
    netCollected: number;
};
export type FinancePage<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};
