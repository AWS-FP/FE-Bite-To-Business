export interface BankPayment {
    id: string;
    orderId: string;
    paymentCode: string;
    amount: number;
    currency: string;
    status: string;
    bank: string;
    virtualAccount: string;
    qrUrl: string | null;
}
