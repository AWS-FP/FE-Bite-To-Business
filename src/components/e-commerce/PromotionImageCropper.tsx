import Skeleton from '@/components/common/Skeleton';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, Move, RotateCcw, X, ZoomIn } from 'lucide-react';
import ImageZoomSlider from '@/components/common/ImageZoomSlider';
import { PROMOTION_BANNER_ASPECT, PROMOTION_BANNER_HEIGHT, PROMOTION_BANNER_SIZE, PROMOTION_BANNER_WIDTH } from '@/constants/customer/promotionBanner';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';

type Dimension = { width: number; height: number };
type Point = { x: number; y: number };
const INITIAL_STAGE: Dimension = { width: 720, height: 300 };
const MAX_BYTES = 5 * 1024 * 1024;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Crops the actual file in the browser: what the user selects is exactly what is uploaded. */
export default function PromotionImageCropper({
    src,
    originalName,
    onApply,
    onCancel,
    kind = 'promotion',
}: {
    src: string;
    originalName: string;
    onApply: (result: File) => void;
    onCancel: () => void;
    kind?: 'promotion' | 'combo' | 'product';
}) {
    const tr = useExecutiveText();
    const stageRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const dragRef = useRef<{ pointerId: number; start: Point; offset: Point } | null>(null);
    const [stageSize, setStageSize] = useState<Dimension>(INITIAL_STAGE);
    const [natural, setNatural] = useState<Dimension | null>(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const imageLoadError = tr('Không đọc được ảnh. Hãy chọn ảnh khác.', 'Cannot read this image. Select another image.');

    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previous; };
    }, []);

    useEffect(() => {
        const element = stageRef.current;
        if (!element) return;
        const observer = new ResizeObserver(() => {
            const width = element.clientWidth;
            const height = element.clientHeight;
            if (width > 0 && height > 0) setStageSize({ width, height });
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let active = true;
        const image = new Image();
        image.onload = () => {
            if (!active) return;
            imageRef.current = image;
            setNatural({ width: image.naturalWidth, height: image.naturalHeight });
        };
        image.onerror = () => {
            if (active) setError(imageLoadError);
        };
        image.src = src;
        return () => { active = false; imageRef.current = null; };
    }, [src, imageLoadError]);

    const aspect = kind === 'product' ? 1 : PROMOTION_BANNER_ASPECT;
    const cropWidth = Math.max(1, Math.min(stageSize.width - 24, (stageSize.height - 24) * aspect));
    const cropHeight = cropWidth / aspect;
    const baseScale = natural ? Math.max(cropWidth / natural.width, cropHeight / natural.height) : 1;
    const scale = baseScale * zoom;
    const photoWidth = natural ? natural.width * scale : 0;
    const photoHeight = natural ? natural.height * scale : 0;
    const maxX = Math.max(0, (photoWidth - cropWidth) / 2);
    const maxY = Math.max(0, (photoHeight - cropHeight) / 2);
    const currentOffset = { x: clamp(offset.x, -maxX, maxX), y: clamp(offset.y, -maxY, maxY) };

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const wheel = (event: WheelEvent) => {
            event.preventDefault();
            setZoom((previous) => clamp(Math.round((previous + (event.deltaY < 0 ? 0.1 : -0.1)) * 100) / 100, 1, 4));
        };
        stage.addEventListener('wheel', wheel, { passive: false });
        return () => stage.removeEventListener('wheel', wheel);
    }, []);

    function beginDrag(event: PointerEvent<HTMLDivElement>) {
        if (!natural || (event.pointerType === 'mouse' && event.button !== 0)) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
            pointerId: event.pointerId,
            start: { x: event.clientX, y: event.clientY },
            offset: currentOffset,
        };
        setDragging(true);
    }

    function moveDrag(event: PointerEvent<HTMLDivElement>) {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        setOffset({
            x: clamp(drag.offset.x + event.clientX - drag.start.x, -maxX, maxX),
            y: clamp(drag.offset.y + event.clientY - drag.start.y, -maxY, maxY),
        });
    }

    function endDrag(event: PointerEvent<HTMLDivElement>) {
        if (dragRef.current?.pointerId !== event.pointerId) return;
        dragRef.current = null;
        setDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    async function apply() {
        const image = imageRef.current;
        if (!natural || !image || busy) return;
        setBusy(true);
        setError('');
        try {
            const outputWidth = kind === 'product' ? 800 : PROMOTION_BANNER_WIDTH;
            const outputHeight = kind === 'product' ? 800 : PROMOTION_BANNER_HEIGHT;
            const canvas = document.createElement('canvas');
            canvas.width = outputWidth;
            canvas.height = outputHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas unavailable');
            // Source bounds are exactly the white crop rectangle shown on screen.
            const sourceWidth = cropWidth / scale;
            const sourceHeight = cropHeight / scale;
            const sourceX = (natural.width - sourceWidth) / 2 - currentOffset.x / scale;
            const sourceY = (natural.height - sourceHeight) / 2 - currentOffset.y / scale;
            ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);
            let blob: Blob | null = null;
            for (const quality of [0.9, 0.8, 0.7, 0.6]) {
                blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
                if (blob && blob.size <= MAX_BYTES) break;
            }
            if (!blob || blob.size > MAX_BYTES) throw new Error('Image too large');
            onApply(new File([blob], originalName.replace(/\.[^.]+$/, '') + '-cropped.jpg', { type: 'image/jpeg' }));
        } catch {
            setError(tr('Không thể cắt ảnh. Vui lòng chọn ảnh khác hoặc thử lại.', 'Could not crop this image. Choose another image or retry.'));
        } finally {
            setBusy(false);
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#061f16]/80 px-2 py-2 backdrop-blur-sm sm:px-4" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
            <section role="dialog" aria-modal="true" aria-label={kind === 'product' ? tr('Cắt ảnh sản phẩm', 'Crop product image') : kind === 'combo' ? tr('Cắt ảnh combo', 'Crop combo image') : tr('Cắt ảnh khuyến mãi', 'Crop promotion image')} className="flex max-h-[calc(100dvh-1rem)] w-full max-w-[850px] flex-col overflow-hidden rounded-2xl bg-[#fffaf0] shadow-2xl">
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#dbe6d9] px-4 py-2 sm:px-5">
                    <div>
                        <h2 className="m-0 text-base font-bold text-[#14392b] sm:text-lg">{tr('Chỉnh sửa vùng ảnh', 'Edit image crop')}</h2>
                        <p className="m-0 text-xs text-[#607465]">{tr('Kéo và phóng to ảnh trong khung cố định trước khi tải lên.', 'Drag and zoom within the fixed frame before uploading.')}</p>
                    </div>
                    <button type="button" onClick={onCancel} disabled={busy} aria-label={tr('Đóng', 'Close')} className="shrink-0 rounded-lg !border-0 !bg-transparent p-2 text-[#14392b] hover:!bg-[#e8efe6]"><X size={20} /></button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2 sm:px-5">
                    <div className="mb-2 rounded-lg border border-[#dbe6d9] bg-white px-3 py-1.5 text-xs text-[#24593d]">
                        <p className="m-0 font-bold">{kind === 'product' ? tr('Kích thước ảnh sản phẩm', 'Product image size') : kind === 'combo' ? tr('Kích thước thiết kế ảnh combo', 'Combo image size') : tr('Kích thước thiết kế banner', 'Banner design size')}: {kind === 'product' ? '800 × 800 (1:1)' : `${PROMOTION_BANNER_SIZE} (16:9)`}</p>
                        <p className="m-0 text-xs text-[#607465]">{kind === 'product' ? tr('Giữ sản phẩm bên trong khung vuông.', 'Keep the product inside the square frame.') : kind === 'combo' ? tr('Khung 16:9 khớp với thẻ combo trang chủ. Giữ các sản phẩm chính bên trong vùng cắt.', 'This 16:9 frame matches homepage combo cards. Keep the main products inside the crop area.') : tr('Khung này khớp với banner trang chủ. Chừa khoảng trống phía dưới cho tiêu đề chiến dịch.', 'This frame matches the homepage banner. Leave room at the bottom for the campaign title.')}</p>
                    </div>
                    <div ref={stageRef} role="img" aria-label={tr('Kéo ảnh trong khung sáng để chọn vùng cắt', 'Drag photo inside the crop guide to choose the area')} tabIndex={0}
                        onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}
                        onKeyDown={(event) => {
                            const delta: Record<string, Point> = {
                                ArrowLeft: { x: -8, y: 0 }, ArrowRight: { x: 8, y: 0 },
                                ArrowUp: { x: 0, y: -8 }, ArrowDown: { x: 0, y: 8 },
                            };
                            if (!delta[event.key]) return;
                            event.preventDefault();
                            setOffset((previous) => ({ x: clamp(previous.x + delta[event.key].x, -maxX, maxX), y: clamp(previous.y + delta[event.key].y, -maxY, maxY) }));
                        }}
                        style={{ touchAction: 'none' }}
                        className={`relative h-[clamp(120px,39dvh,320px)] w-full select-none overflow-hidden rounded-xl bg-[#12261f] outline-none focus-visible:ring-4 focus-visible:ring-[#a0d8a9] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                        {natural && (
                            <img src={src} alt="" draggable={false} className="pointer-events-none absolute max-w-none select-none"
                                style={{ width: photoWidth, height: photoHeight, left: `calc(50% + ${currentOffset.x}px)`, top: `calc(50% + ${currentOffset.y}px)`, transform: 'translate(-50%, -50%)' }} />
                        )}
                        <div className="pointer-events-none absolute left-1/2 top-1/2 border-2 border-white/95 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
                            style={{ width: cropWidth, height: cropHeight, transform: 'translate(-50%, -50%)' }}>
                            <div className="absolute inset-0 border border-white/25" />
                            <div className="absolute left-1/3 top-0 h-full border-l border-dashed border-white/45" />
                            <div className="absolute left-2/3 top-0 h-full border-l border-dashed border-white/45" />
                            <div className="absolute top-1/3 left-0 w-full border-t border-dashed border-white/45" />
                            <div className="absolute top-2/3 left-0 w-full border-t border-dashed border-white/45" />
                        </div>
                        {!natural && <Skeleton className="absolute! inset-0 h-full w-full" />}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[#315f42]">
                        <Move size={17} />
                        <span className="text-xs">{tr('Kéo hoặc dùng phím mũi tên để di chuyển', 'Drag or use arrow keys to move')}</span>
                        <div className="flex min-w-0 basis-full items-center gap-2 rounded-lg bg-white p-1.5 sm:ml-auto sm:max-w-[345px] sm:flex-1 sm:basis-auto">
                            <ZoomIn size={17} className="shrink-0" />
                            <ImageZoomSlider value={zoom} min={1} max={4} onChange={setZoom}
                                label={tr('Thu phóng', 'Zoom')} decreaseLabel={tr('Thu nhỏ', 'Zoom out')} increaseLabel={tr('Phóng to', 'Zoom in')} />
                            <span className="min-w-[44px] text-right text-xs font-bold tabular-nums">{Math.round(zoom * 100)}%</span>
                        </div>
                        <button type="button" onClick={() => { setOffset({ x: 0, y: 0 }); setZoom(1); }} className="flex items-center gap-1 rounded-lg border border-[#d1dfd1] bg-white px-3 py-2 text-xs font-semibold"><RotateCcw size={14} />{tr('Đặt lại', 'Reset')}</button>
                    </div>
                    {error && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{error}</p>}
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-[#dbe6d9] bg-[#fffaf0] px-3 py-2 sm:px-5">
                    <button type="button" disabled={busy} onClick={onCancel} className="rounded-xl border border-[#bed0bd] bg-white px-4 py-2 text-sm font-semibold text-[#315f42]">{tr('Hủy', 'Cancel')}</button>
                    <button type="button" disabled={!natural || busy || Boolean(error)} onClick={() => void apply()} className="flex items-center justify-center gap-2 rounded-xl bg-[#174732] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><Check size={17} />{busy ? tr('Đang xử lý...', 'Processing...') : tr('Áp dụng vùng cắt', 'Apply crop')}</button>
                </div>
            </section>
        </div>, document.body,
    );
}
