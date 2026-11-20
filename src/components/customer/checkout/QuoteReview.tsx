import { Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import type { Quote, QuotePackage, QuotePackageAmount } from '@/services/customer/quoteService';

interface QuoteReviewProps {
    quote: Quote;
    packages: QuotePackage[];
    totals: Record<string, QuotePackageAmount>;
}

export default function QuoteReview({ quote, packages, totals }: QuoteReviewProps) {
    const { t } = useTranslation('quote');
    return (
        <section className="rounded-2xl border border-store-ink/20 bg-white p-6">
            <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-store-cream text-store-green">
                    <Truck size={21} />
                </span>
                <div>
                    <h2 className="m-0 font-subheading text-xl font-bold">{t('review.title')}</h2>
                    <p className="mb-0 mt-1 text-sm text-store-muted">
                        {t('review.counts', {
                            packages: packages.length,
                            products: quote.items.length,
                        })}
                    </p>
                </div>
            </div>
            <div className="mt-5 space-y-3">
                {packages.map((item) => (
                    <div key={item.id} className="rounded-xl border border-store-ink/10 p-4">
                        <strong>{item.name}</strong>
                        <p className="mb-0 mt-2 text-sm text-store-muted">
                            {item.recipientName} · {item.address}
                        </p>
                        <p className="mb-0 mt-1 text-sm text-store-muted">
                            {item.deliveryDate} · {item.deliveryTimeSlot}
                        </p>
                        <p className="mb-0 mt-2 text-sm font-bold">
                            {t('review.shipping')} {formatCurrencyVnd(Number(item.shippingFee))}
                        </p>
                        {totals[item.id] && (
                            <p className="mb-0 mt-2 text-sm font-bold text-store-green">
                                {t('packageTotal')}{' '}
                                {formatCurrencyVnd(Number(totals[item.id].total))}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <p className="mb-0 mt-5 rounded-xl bg-store-cream p-4 text-sm leading-relaxed">
                {t('review.note')}
            </p>
        </section>
    );
}
