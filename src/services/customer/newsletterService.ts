import { publicHttp } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { NewsletterSubscription } from '@/types/customer/newsletter';

/** Public Customer module API. Requires consent=true; no authentication needed. */
export async function subscribeNewsletter(email: string): Promise<NewsletterSubscription> {
    const { data } = await publicHttp.post<ApiResponse<NewsletterSubscription>>(
        '/api/newsletter/subscriptions',
        { email: email.trim(), consent: true },
    );
    return data.data;
}
