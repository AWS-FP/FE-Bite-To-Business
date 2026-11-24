import { useState, type FormEvent } from 'react';
import { subscribeNewsletter } from '@/services/customer/newsletterService';

/** Form đăng ký nhận tin: chỉ gửi khi đã đồng ý và có email. */
export function useNewsletterSignup() {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<'success' | 'error' | null>(null);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!consent || submitting || !email.trim()) return;
        setSubmitting(true);
        setResult(null);
        try {
            await subscribeNewsletter(email.trim());
            setResult('success');
            setEmail('');
            setConsent(false);
        } catch {
            setResult('error');
        } finally {
            setSubmitting(false);
        }
    }

    return { email, setEmail, consent, setConsent, submitting, result, setResult, submit };
}
