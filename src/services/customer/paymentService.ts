import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';

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
export async function createBankPayment(orderId: string) {
    const { data } = await http.post<ApiResponse<BankPayment>>(`/api/customer/orders/${encodeURIComponent(orderId)}/bank-payment`);
    return data.data;
}
export async function getBankPayment(paymentId: string) {
    const { data } = await http.get<ApiResponse<BankPayment>>(`/api/customer/bank-payments/${encodeURIComponent(paymentId)}`);
    return data.data;
}
