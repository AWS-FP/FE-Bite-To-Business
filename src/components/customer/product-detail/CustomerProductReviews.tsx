import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MessageCircle, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    getProductReviews,
    type CustomerReview,
    type ProductReviewsPage,
} from '@/services/customer/reviewService';
import CustomerWriteReview from '@/components/customer/product-detail/CustomerWriteReview';

const PAGE_SIZE = 20;
const SCROLL_SPEED_PX_PER_SECOND = 16;

function ReviewBubble({
    review,
    english,
    reviewerLabel,
    imageLabel,
    expanded,
    onExpand,
    duplicate = false,
    expandLabel,
    collapseLabel,
}: {
    review: CustomerReview;
    english: boolean;
    reviewerLabel: string;
    imageLabel: string;
    expanded: boolean;
    onExpand: () => void;
    duplicate?: boolean;
    expandLabel: string;
    collapseLabel: string;
}) {
    const hasMoreText = (review.content?.length ?? 0) > 160;

    return (
        <article className="min-h-[142px] rounded-2xl border border-white/15 bg-[#28523f] p-4 text-[#fffdf3] shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
                <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e7efc8] text-sm font-extrabold text-[#1d4533]"
                >
                    {(review.reviewerName || reviewerLabel).trim().charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm">
                        {review.reviewerName || reviewerLabel}
                    </strong>
                    <time
                        className="mt-1 block text-[11px] text-[#c9d9cc]"
                        dateTime={review.createdAt}
                    >
                        {new Date(review.createdAt).toLocaleDateString(english ? 'en-US' : 'vi-VN')}
                    </time>
                </div>
                <span
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#ffdf7c]"
                    aria-label={`${review.rating} / 5`}
                >
                    <Star size={16} fill="currentColor" aria-hidden="true" />
                    {review.rating}
                </span>
            </div>
            {review.content && (
                <p
                    className={`mb-0 mt-3 whitespace-pre-line break-words text-sm leading-6 text-[#edf1e7] ${expanded ? '' : 'line-clamp-3'}`}
                >
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
                                tabIndex={duplicate ? -1 : undefined}
                                className="inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdf7c]"
                            >
                                <img
                                    src={image.imageUrl}
                                    alt={imageLabel}
                                    loading="lazy"
                                    className="h-16 w-16 rounded-md object-cover transition-transform hover:scale-105"
                                />
                            </a>
                        ))}
                </div>
            )}
            {hasMoreText && (
                <button
                    type="button"
                    tabIndex={duplicate ? -1 : undefined}
                    onClick={(event) => {
                        event.stopPropagation();
                        onExpand();
                    }}
                    className="mt-2 rounded border-0 bg-transparent p-0 text-xs font-bold text-[#ffe17c] underline underline-offset-4 hover:text-white"
                >
                    {expanded ? collapseLabel : expandLabel}
                </button>
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
    const [hovered, setHovered] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const firstListRef = useRef<HTMLDivElement>(null);

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
                if (page === 0 && scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
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

    // Real scroll position (not a slide swap): the user can wheel back to previous reviews.
    // A second, visually identical list makes the upward movement seamless.
    useEffect(() => {
        const viewport = scrollAreaRef.current;
        const firstList = firstListRef.current;
        if (
            !viewport ||
            !firstList ||
            reviews.length < 2 ||
            reducedMotion ||
            hovered ||
            expandedId !== null
        )
            return;

        let frame = 0;
        let previousTime: number | null = null;
        const animate = (time: number) => {
            if (previousTime !== null) {
                const elapsedSeconds = Math.min((time - previousTime) / 1000, 0.05);
                const firstHeight = firstList.offsetHeight;
                if (firstHeight > 0) {
                    viewport.scrollTop += SCROLL_SPEED_PX_PER_SECOND * elapsedSeconds;
                    if (viewport.scrollTop >= firstHeight) viewport.scrollTop -= firstHeight;
                }
            }
            previousTime = time;
            frame = window.requestAnimationFrame(animate);
        };
        frame = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(frame);
    }, [reviews, reducedMotion, hovered, expandedId]);

    const hasMore = page < (result?.totalPages ?? 1) - 1;
    const isRunning = !reducedMotion && !hovered && expandedId === null;
    const toggleReview = (id: string) => setExpandedId((current) => (current === id ? null : id));

    const refresh = () => {
        setPage(0);
        setLoading(true);
        setExpandedId(null);
        setRevision((value) => value + 1);
    };

    const renderReview = (review: CustomerReview, duplicate = false) => (
        <ReviewBubble
            key={`${duplicate ? 'copy-' : ''}${review.id}`}
            review={review}
            english={english}
            reviewerLabel={tr('reviewer')}
            imageLabel={tr('reviewImage')}
            expanded={expandedId === review.id}
            onExpand={() => toggleReview(review.id)}
            duplicate={duplicate}
            expandLabel={tr('reviewExpand')}
            collapseLabel={tr('reviewCollapse')}
        />
    );

    return (
        <section
            aria-labelledby="product-reviews-heading"
            className="overflow-hidden rounded-[22px] border border-white/15 bg-[#183e2f] text-[#fffdf3] shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
        >
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6">
                <h2
                    id="product-reviews-heading"
                    className="m-0 flex items-center gap-2 text-xl font-extrabold"
                >
                    <MessageCircle size={20} aria-hidden="true" /> {tr('reviews')}
                </h2>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-[#ffdb72]">
                        <Star size={16} fill="currentColor" aria-hidden="true" />
                        {result?.averageRating == null
                            ? '—'
                            : Number(result.averageRating).toFixed(1)}
                        <small className="ml-1 font-normal text-[#c7d6cb]">
                            ({result?.totalElements ?? 0})
                        </small>
                    </span>
                </div>
            </div>

            {loading && reviews.length === 0 && (
                <p role="status" className="px-6 py-6 text-sm text-[#cad8cb]">
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
            {reviews.length === 1 && (
                <div
                    className="px-5 py-5 sm:px-6"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <motion.div
                        animate={
                            reducedMotion || hovered
                                ? { y: 0, opacity: 1 }
                                : { y: [18, -18], opacity: [0.75, 1, 1, 0.75] }
                        }
                        transition={
                            reducedMotion
                                ? { duration: 0 }
                                : { duration: 14, ease: 'linear', repeat: Infinity }
                        }
                    >
                        {renderReview(reviews[0])}
                    </motion.div>
                </div>
            )}
            {reviews.length > 1 && (
                <div className="px-5 pb-3 pt-4 sm:px-6">
                    <div
                        ref={scrollAreaRef}
                        tabIndex={0}
                        aria-label={tr('reviewsScrollArea')}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        onFocusCapture={() => setHovered(true)}
                        onBlurCapture={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget))
                                setHovered(false);
                        }}
                        onTouchStart={() => setHovered(true)}
                        onTouchEnd={() => setHovered(false)}
                        className="h-[260px] overflow-y-auto overscroll-contain rounded-xl outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:ring-2 focus-visible:ring-[#ffe17c]"
                        style={{ scrollBehavior: isRunning ? 'auto' : 'smooth' }}
                    >
                        <div ref={firstListRef} className="space-y-3 pb-3">
                            {reviews.map((review) => renderReview(review))}
                        </div>
                        <div aria-hidden="true" className="space-y-3 pb-3">
                            {reviews.map((review) => renderReview(review, true))}
                        </div>
                    </div>
                </div>
            )}
            {hasMore && (
                <div className="px-6 pb-3 text-center">
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
