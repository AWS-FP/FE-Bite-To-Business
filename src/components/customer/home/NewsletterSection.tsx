import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { subscribeNewsletter } from '@/services/customer/newsletterService';

export default function NewsletterSection() {
    const { t } = useTranslation('storefront');
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

    return (
        <section
            className="mx-auto max-w-[1320px] px-4 pb-16 pt-8 sm:px-6"
            aria-labelledby="newsletter-heading"
        >
            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#0b261d] via-[#124332] to-[#226849] p-6 text-white shadow-[0_20px_54px_rgba(0,0,0,.19)] sm:p-10 lg:p-12">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[44px] border-white/5"
                />
                <div className="relative z-10 grid items-center gap-9 lg:grid-cols-[.9fr_1fr]">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-store-yellow">
                            <Sparkles size={15} />
                            {t('customerUI.newsletterEyebrow')}
                        </div>
                        <h2
                            id="newsletter-heading"
                            className="m-0 mt-5 max-w-[500px] font-subheading text-3xl font-extrabold leading-tight sm:text-4xl"
                        >
                            {t('customerUI.newsletterHeadline')}
                        </h2>
                        <p className="mt-4 max-w-[500px] text-sm leading-7 text-white/80">
                            {t('customerUI.newsletterBody')}
                        </p>
                        <p className="mt-5 flex items-center gap-2 text-xs text-store-yellow">
                            <LockKeyhole size={15} />
                            {t('customerUI.newsletterPrivacy')}
                        </p>
                    </div>
                    <form
                        onSubmit={submit}
                        className="rounded-[24px] bg-white p-5 text-store-ink shadow-xl sm:p-7"
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-green text-store-green">
                                <Mail size={24} />
                            </span>
                            <div>
                                <h3 className="m-0 font-subheading text-lg font-bold">
                                    {t('customerUI.newsletterFormTitle')}
                                </h3>
                                <p className="m-0 mt-1 text-xs text-store-muted">
                                    {t('customerUI.newsletterFormSubtitle')}
                                </p>
                            </div>
                        </div>
                        <label
                            htmlFor="homepage-newsletter-email"
                            className="mb-2 block font-body text-xs font-bold"
                        >
                            {t('customerUI.emailAddress')}
                        </label>
                        <input
                            id="homepage-newsletter-email"
                            type="email"
                            required
                            maxLength={254}
                            autoComplete="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setResult(null);
                            }}
                            placeholder={t('customerUI.newsletterPlaceholder')}
                            className="h-12 w-full rounded-xl border border-store-line bg-surface-soft px-4 text-sm text-store-ink outline-none focus:border-store-green"
                        />
                        <div className="mt-4 flex items-start gap-3">
                            <input
                                id="homepage-newsletter-consent"
                                type="checkbox"
                                required
                                checked={consent}
                                onChange={(event) => setConsent(event.target.checked)}
                                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-store-green focus:!border-0 focus:!outline-none focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-store-green"
                            />
                            <label
                                htmlFor="homepage-newsletter-consent"
                                className="cursor-pointer font-body text-xs leading-5 text-store-muted"
                            >
                                {t('customerUI.newsletterConsent')}
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={!consent || submitting || !email.trim()}
                            className="mt-5 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-store-yellow px-5 text-sm font-extrabold text-store-ink transition hover:bg-[#f6cd25] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? t('customerUI.newsletterSubmitting')
                                : t('customerUI.newsletterSubmit')}
                            {!submitting && <ArrowRight size={18} />}
                        </button>
                        {result === 'success' && (
                            <p
                                role="status"
                                className="mt-4 flex items-center gap-2 text-xs font-semibold text-success"
                            >
                                <CheckCircle2 size={17} />
                                {t('customerUI.newsletterSuccess')}
                            </p>
                        )}
                        {result === 'error' && (
                            <p role="alert" className="mt-4 text-xs font-semibold text-danger">
                                {t('customerUI.newsletterError')}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
