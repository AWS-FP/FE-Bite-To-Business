import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { BankPayment } from '@/types/customer/payment';
export async function createBankPayment(orderId: string) {
    const { data } = await http.post<ApiResponse<BankPayment>>(`/api/customer/orders/${encodeURIComponent(orderId)}/bank-payment`);
    return data.data;
}
export async function getBankPayment(paymentId: string) {
    const { data } = await http.get<ApiResponse<BankPayment>>(`/api/customer/bank-payments/${encodeURIComponent(paymentId)}`);
    return data.data;
}
