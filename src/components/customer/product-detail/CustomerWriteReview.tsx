import { useRef, useState, type FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { Camera, CheckCircle2, MessageSquarePlus, Send, Star, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/admin/authStore';
import { createReview } from '@/services/customer/reviewService';
import { ROUTES } from '@/router/routes';

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CustomerWriteReview({
    productId,
    onCreated,
}: {
    productId: string;
    onCreated: () => void;
}) {
    const { t, i18n } = useTranslation('storefront');
    const tr = (key: string) => t(`productDetail.${key}`);
    const navigate = useNavigate();
    const isCustomer = useAuthStore((state) => state.session?.user.role === 'CUSTOMER');
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const reducedMotion = useReducedMotion();
    const visibleRating = hoverRating ?? rating;
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);

    const chooseImages = (incoming: FileList | null) => {
        if (!incoming) return;
        const files = [...images, ...Array.from(incoming)];
        if (
            files.length > MAX_PHOTOS ||
            files.some(
                (file) => !SUPPORTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_PHOTO_BYTES,
            )
        ) {
            setFeedback({ success: false, message: tr('reviewInvalidPhotos') });
            if (fileInput.current) fileInput.current.value = '';
            return;
        }
        setImages(files);
        setFeedback(null);
        if (fileInput.current) fileInput.current.value = '';
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isCustomer) {
            navigate(ROUTES.LOGIN);
            return;
        }
        if (submitting) return;
        setSubmitting(true);
        setFeedback(null);
        try {
            await createReview(productId, { rating, content: content.trim() }, images);
            setFeedback({ success: true, message: tr('reviewCreated') });
            setOpen(false);
            setContent('');
            setImages([]);
            setRating(5);
            setHoverRating(null);
            onCreated();
        } catch (error) {
            const duplicate = isAxiosError(error) && error.response?.status === 409;
            setFeedback({
                success: false,
                message: duplicate ? tr('reviewAlreadyExists') : tr('reviewSubmitFailed'),
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-4 border-t border-white/15 px-5 py-5 sm:px-6">
            <button
                type="button"
                onClick={() => {
                    if (!isCustomer) navigate(ROUTES.LOGIN);
                    else {
                        setOpen((previous) => !previous);
                        setFeedback(null);
                    }
                }}
                aria-expanded={isCustomer ? open : undefined}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#f5da83] bg-[#ffdf6c] px-4 py-2 text-sm font-bold text-[#183b2c] transition-colors hover:bg-[#ffe894] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <MessageSquarePlus size={17} />
                {isCustomer ? tr('writeReview') : tr('loginToReview')}
            </button>

            {feedback && (
                <p
                    role={feedback.success ? 'status' : 'alert'}
                    className={`mt-3 flex items-start gap-2 text-xs leading-5 ${feedback.success ? 'text-[#def2c6]' : 'text-[#ffcfbe]'}`}
                >
                    {feedback.success && <CheckCircle2 size={16} className="shrink-0" />}
                    {feedback.message}
                </p>
            )}

            {isCustomer && open && (
                <form
                    onSubmit={submit}
                    className="mt-4 space-y-4 rounded-xl border border-white/20 bg-white/10 p-4"
                >
                    <div>
                        <p
                            id="customer-review-rating-label"
                            className="mb-2 text-xs font-semibold text-[#f8f6e9]"
                        >
                            {tr('reviewRating')}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <div
                                role="group"
                                aria-labelledby="customer-review-rating-label"
                                className="flex items-center gap-1"
                                onPointerLeave={() => setHoverRating(null)}
                            >
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const filled = visibleRating >= star;
                                    const half = !filled && visibleRating >= star - 0.5;
                                    const selected = rating > star - 1 && rating <= star;
                                    const getHalfStep = (
                                        clientX: number,
                                        left: number,
                                        width: number,
                                    ) => star - (clientX - left < width / 2 ? 0.5 : 0);

                                    return (
                                        <motion.button
                                            key={star}
                                            type="button"
                                            aria-label={`${star} ${tr('reviewRatingUnit')}`}
                                            aria-pressed={selected}
                                            title={`${star - 0.5} – ${star} ${tr('reviewRatingUnit')}`}
                                            onPointerMove={(event) => {
                                                if (event.pointerType === 'touch') return;
                                                const bounds =
                                                    event.currentTarget.getBoundingClientRect();
                                                const next = getHalfStep(
                                                    event.clientX,
                                                    bounds.left,
                                                    bounds.width,
                                                );
                                                setHoverRating((current) =>
                                                    current === next ? current : next,
                                                );
                                            }}
                                            onClick={(event) => {
                                                const bounds =
                                                    event.currentTarget.getBoundingClientRect();
                                                // Keyboard activation chooses the whole star; pointer can choose half.
                                                const next =
                                                    event.detail === 0
                                                        ? star
                                                        : getHalfStep(
                                                              event.clientX,
                                                              bounds.left,
                                                              bounds.width,
                                                          );
                                                setRating(next);
                                                setHoverRating(null);
                                            }}
                                            onKeyDown={(event) => {
                                                if (
                                                    [
                                                        'ArrowLeft',
                                                        'ArrowDown',
                                                        'ArrowRight',
                                                        'ArrowUp',
                                                    ].includes(event.key)
                                                ) {
                                                    event.preventDefault();
                                                    const direction =
                                                        event.key === 'ArrowLeft' ||
                                                        event.key === 'ArrowDown'
                                                            ? -0.5
                                                            : 0.5;
                                                    setRating((current) =>
                                                        Math.min(
                                                            5,
                                                            Math.max(0.5, current + direction),
                                                        ),
                                                    );
                                                    setHoverRating(null);
                                                }
                                            }}
                                            whileHover={
                                                reducedMotion ? undefined : { scale: 1.15, y: -3 }
                                            }
                                            whileTap={reducedMotion ? undefined : { scale: 0.82 }}
                                            animate={
                                                reducedMotion
                                                    ? undefined
                                                    : { rotate: selected ? [0, -9, 7, 0] : 0 }
                                            }
                                            transition={{
                                                type: 'spring',
                                                stiffness: 380,
                                                damping: 16,
                                            }}
                                            className="relative grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-lg !border-0 !bg-transparent !p-0 !shadow-none focus:!border-0 focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-[#ffe38d]"
                                        >
                                            <Star
                                                aria-hidden="true"
                                                size={34}
                                                strokeWidth={1.7}
                                                className="absolute text-white/50"
                                            />
                                            {(filled || half) && (
                                                <Star
                                                    aria-hidden="true"
                                                    size={34}
                                                    strokeWidth={1.7}
                                                    fill="currentColor"
                                                    className="absolute text-[#ffdc56] drop-shadow-[0_2px_6px_rgba(255,218,80,0.35)]"
                                                    style={
                                                        half
                                                            ? { clipPath: 'inset(0 50% 0 0)' }
                                                            : undefined
                                                    }
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <motion.span
                                key={visibleRating}
                                initial={
                                    reducedMotion ? false : { opacity: 0.5, y: 5, scale: 0.92 }
                                }
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.18 }}
                                className="min-w-16 rounded-full bg-[#ffdf6c] px-3 py-1.5 text-center text-sm font-extrabold tabular-nums text-[#173b2c]"
                                aria-live="polite"
                            >
                                {visibleRating.toLocaleString(i18n.language)}/5
                            </motion.span>
                        </div>
                        <p className="mt-2 text-[11px] leading-5 text-[#d4e6d2]">
                            {tr('reviewRatingHint')}
                        </p>
                    </div>
                    <div>
                        <label
                            htmlFor="customer-review-text"
                            className="mb-2 block text-xs font-semibold text-[#f8f6e9]"
                        >
                            {tr('reviewContent')}
                        </label>
                        <textarea
                            id="customer-review-text"
                            rows={3}
                            maxLength={2000}
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            placeholder={tr('reviewPlaceholder')}
                            className="w-full resize-y rounded-lg border border-[#d3e4d5] bg-[#fffdf5] p-3 text-sm leading-6 text-[#173b2c] focus-visible:outline-2 focus-visible:outline-[#f5d16c]"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="customer-review-images"
                            className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#f8f6e9]"
                        >
                            <Camera size={16} /> {tr('reviewPhotos')}
                        </label>
                        <input
                            ref={fileInput}
                            id="customer-review-images"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={(event) => chooseImages(event.target.files)}
                            className="block w-full text-xs text-[#e4eee0] file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#fff4be] file:px-3 file:py-2 file:font-semibold file:text-[#193c2d]"
                        />
                        <p className="mt-2 text-[11px] leading-5 text-[#c6d9c8]">
                            {tr('reviewPhotoHint')}
                        </p>
                        {images.length > 0 && (
                            <ul className="mt-2 space-y-1.5 p-0 text-xs">
                                {images.map((file, index) => (
                                    <li
                                        key={`${file.name}-${index}`}
                                        className="flex items-center justify-between gap-2 rounded-md bg-white/10 px-2 py-1.5"
                                    >
                                        <span className="min-w-0 truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setImages((current) =>
                                                    current.filter((_, i) => i !== index),
                                                )
                                            }
                                            aria-label={`${tr('removeReviewPhoto')}: ${file.name}`}
                                            className="grid h-6 w-6 shrink-0 place-items-center rounded text-white hover:bg-white/15"
                                        >
                                            <X size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-lg border-0 bg-[#ffdf6c] px-4 py-2.5 text-sm font-bold text-[#173b2c] transition-colors hover:bg-[#ffe994] disabled:opacity-60"
                    >
                        <Send size={16} />{' '}
                        {submitting ? tr('submittingReview') : tr('submitReview')}
                    </button>
                </form>
            )}
        </div>
    );
}
