import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/** Full-screen viewer for review photos; keeps the shopper on the page instead of opening the CDN URL. */
export default function ReviewImageLightbox({
    images,
    index,
    onIndexChange,
    onClose,
}: {
    images: string[];
    index: number;
    onIndexChange: (next: number) => void;
    onClose: () => void;
}) {
    const { t } = useTranslation('storefront');
    const tr = (key: string, options?: Record<string, unknown>) =>
        t(`productDetail.${key}`, options);
    const closeRef = useRef<HTMLButtonElement>(null);
    const count = images.length;
    const multiple = count > 1;

    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus?.();
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
            else if (multiple && event.key === 'ArrowLeft')
                onIndexChange((index - 1 + count) % count);
            else if (multiple && event.key === 'ArrowRight') onIndexChange((index + 1) % count);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [count, index, multiple, onClose, onIndexChange]);

    if (count === 0) return null;

    const navButton =
        'absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdf6c]';

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={tr('reviewImageViewer')}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4 sm:p-10"
            onClick={onClose}
        >
            <img
                src={images[index]}
                alt={tr('reviewImageCounter', { current: index + 1, total: count })}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            />
            <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={tr('closeImageViewer')}
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/50 text-white transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdf6c]"
            >
                <X size={22} />
            </button>
            {multiple && (
                <>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onIndexChange((index - 1 + count) % count);
                        }}
                        aria-label={tr('previousImage')}
                        className={`${navButton} left-3 sm:left-6`}
                    >
                        <ChevronLeft size={26} />
                    </button>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onIndexChange((index + 1) % count);
                        }}
                        aria-label={tr('nextImage')}
                        className={`${navButton} right-3 sm:right-6`}
                    >
                        <ChevronRight size={26} />
                    </button>
                    <p
                        aria-live="polite"
                        className="absolute bottom-4 left-1/2 m-0 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold tabular-nums text-white"
                    >
                        {index + 1} / {count}
                    </p>
                </>
            )}
        </div>,
        document.body,
    );
}
