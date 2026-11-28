import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { useCartFeedback } from '@/hooks/customer/useCartFeedback';

export default function CartPurchaseFeedback({ feedback, unit }: {
    feedback: ReturnType<typeof useCartFeedback>['feedback'];
    unit: string;
}) {
    const { t } = useTranslation('storefront');
    return (
        <div role="status" aria-live="polite" aria-atomic="true">
            {feedback && (feedback.limit ? (
                <p className="m-0 mt-1 text-xs font-semibold text-danger-strong">
                    {t('productDetail.stockLimit', { ...feedback.limit, unit })}
                </p>
            ) : (
                <p key={feedback.sequence} className="m-0 mt-1 flex items-center gap-2 text-xs font-bold text-success motion-safe:animate-cart-added">
                    <CheckCircle2 size={15} aria-hidden="true" /> {t('productDetail.added')}
                </p>
            ))}
        </div>
    );
}
