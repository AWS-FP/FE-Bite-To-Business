import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MessageCircle, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    getProductReviews,
    type CustomerReview,
    type ProductReviewsPage,
} from '@/services/customer/reviewService';
import CustomerWriteReview from '@/components/customer/product-detail/CustomerWriteReview';

const PAGE_SIZE = 20;
const REVIEW_INTERVAL_MS = 6500; // UI animation timing, not review data.

function ReviewBubble({
    review,
    english,
    reviewerLabel,
    imageLabel,
}: {
    review: CustomerReview;
    english: boolean;
    reviewerLabel: string;
    imageLabel: string;
}) {
    return (
        <article className="rounded-2xl border border-white/15 bg-[#295340] p-4 text-[#fffdf3] shadow-[0_10px_24px_rgba(0,0,0,0.11)]">
            <div className="flex items-center gap-2.5">
                <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e7efc8] text-sm font-extrabold text-[#1d4533]"
                >
                    {(review.reviewerName || reviewerLabel).trim().charAt(0).toUpperCase()}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <strong className="truncate text-sm">
                        {review.reviewerName || reviewerLabel}
                    </strong>
                    <time dateTime={review.createdAt} className="text-[11px] text-[#c5d5c9]">
                        {new Date(review.createdAt).toLocaleDateString(english ? 'en-US' : 'vi-VN')}
                    </time>
                </div>
                <span
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#ffdf7c]"
                    aria-label={`${review.rating} / 5`}
                >
                    <Star size={15} fill="currentColor" aria-hidden="true" />
                    {review.rating}
                </span>
            </div>
            {review.content && (
                <p className="mb-0 mt-3 whitespace-pre-line text-sm leading-6 text-[#edf1e7]">
                    {review.content}
                </p>
            )}
            {review.images?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {[...review.images]
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((image) => (
                            <a
                                key={image.id}
                                href={image.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={imageLabel}
                            >
                                <img
                                    src={image.imageUrl}
                                    alt={imageLabel}
                                    loading="lazy"
                                    className="h-14 w-14 rounded-lg object-cover"
                                />
                            </a>
                        ))}
                </div>
            )}
        </article>
    );
}

export default function CustomerProductReviews({ productId }: { productId: string }) {
    const { t, i18n } = useTranslation('storefront');
    const tr = (key: string) => t(`productDetail.${key}`);
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const reducedMotion = useReducedMotion();
    const [page, setPage] = useState(0);
    const [revision, setRevision] = useState(0);
    const [reviews, setReviews] = useState<CustomerReview[]>([]);
    const [result, setResult] = useState<ProductReviewsPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [paused, setPaused] = useState(false);
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        let alive = true;
        getProductReviews(productId, page, PAGE_SIZE)
            .then((data) => {
                if (!alive) return;
                setResult(data);
                setReviews((current) =>
                    page === 0
                        ? data.content
                        : [
                              ...current,
                              ...data.content.filter(
                                  (incoming) =>
                                      !current.some((existing) => existing.id === incoming.id),
                              ),
                          ],
                );
                setCycle(0);
                setError(false);
            })
            .catch(() => {
                if (alive) setError(true);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [productId, page, revision]);

    useEffect(() => {
        if (reducedMotion || paused || reviews.length === 0) return;
        const interval = window.setInterval(
            () => setCycle((value) => value + 1),
            REVIEW_INTERVAL_MS,
        );
        return () => window.clearInterval(interval);
    }, [paused, reducedMotion, reviews.length]);

    const activeReview = reviews.length ? reviews[cycle % reviews.length] : null;
    const hasMore = page < (result?.totalPages ?? 1) - 1;

    const refresh = () => {
        setPage(0);
        setLoading(true);
        setCycle(0);
        setRevision((value) => value + 1);
    };

    return (
        <section
            aria-labelledby="product-reviews-heading"
            className="mt-6 overflow-hidden rounded-[24px] border border-white/15 bg-[#183e2f] text-[#fffdf3] shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
        >
            <header className="px-5 pt-6 sm:px-6">
                <p className="mb-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-[#ffdc7a]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffdc7a]" aria-hidden="true" />
                    {tr('streamLabel')}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2
                        id="product-reviews-heading"
                        className="m-0 flex items-center gap-2 text-xl font-bold"
                    >
                        <MessageCircle size={20} /> {tr('reviews')}
                    </h2>
                    {result?.averageRating != null && (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-[#ffdb72]">
                            <Star size={16} fill="currentColor" />
                            {Number(result.averageRating).toFixed(1)}
                            <small className="ml-1 font-normal text-[#c7d6cb]">
                                ({result.totalElements})
                            </small>
                        </span>
                    )}
                </div>
                <p className="mb-0 mt-2 text-xs leading-6 text-[#cad8cb]">{tr('streamHint')}</p>
            </header>

            {loading && reviews.length === 0 && (
                <p role="status" className="p-6 text-sm text-[#cad8cb]">
                    {tr('loadingReviews')}
                </p>
            )}
            {error && (
                <p role="alert" className="px-6 pt-4 text-sm text-[#ffd5bd]">
                    {tr('reviewsUnavailable')}
                </p>
            )}
            {!loading && !error && reviews.length === 0 && (
                <p className="px-6 py-6 text-sm text-[#cad8cb]">{tr('noReviews')}</p>
            )}
            {activeReview && (
                <div
                    className="px-5 pb-3 pt-5 sm:px-6"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocusCapture={() => setPaused(true)}
                    onBlurCapture={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
                    }}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={`${activeReview.id}-${cycle}`}
                            initial={reducedMotion ? false : { opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -48 }}
                            transition={{ duration: reducedMotion ? 0 : 0.75, ease: 'easeInOut' }}
                        >
                            <ReviewBubble
                                review={activeReview}
                                english={english}
                                reviewerLabel={tr('reviewer')}
                                imageLabel={tr('reviewImage')}
                            />
                        </motion.div>
                    </AnimatePresence>
                    <p className="mb-0 mt-3 text-center text-[11px] text-[#bbcebf]" aria-live="off">
                        {reviews.length > 1
                            ? `${(cycle % reviews.length) + 1} / ${reviews.length}`
                            : tr('reviewCount')}
                    </p>
                </div>
            )}
            {hasMore && (
                <div className="px-6 pb-4 text-center">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                            setLoading(true);
                            setPage((current) => current + 1);
                        }}
                        className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20 disabled:opacity-50"
                    >
                        {loading ? tr('loadingReviews') : tr('loadMoreReviews')}
                    </button>
                </div>
            )}
            <CustomerWriteReview productId={productId} onCreated={refresh} />
        </section>
    );
}
