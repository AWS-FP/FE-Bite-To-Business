import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, Move, RotateCcw, X, ZoomIn } from 'lucide-react';
import { PROMOTION_BANNER_ASPECT, PROMOTION_BANNER_HEIGHT, PROMOTION_BANNER_SIZE, PROMOTION_BANNER_WIDTH } from '@/constants/customer/promotionBanner';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';

type Dimension = { width: number; height: number };
type Point = { x: number; y: number };
const STAGE_HEIGHT = 370;
const MAX_BYTES = 5 * 1024 * 1024;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Crops the actual file in the browser: what the user selects is exactly what is uploaded. */
export default function PromotionImageCropper({
    src,
    originalName,
    onApply,
    onCancel,
}: {
    src: string;
    originalName: string;
    onApply: (result: File) => void;
    onCancel: () => void;
}) {
    const tr = useExecutiveText();
    const stageRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const dragRef = useRef<{ pointerId: number; start: Point; offset: Point } | null>(null);
    const [stageWidth, setStageWidth] = useState(720);
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
        const observer = new ResizeObserver(() => setStageWidth(element.clientWidth));
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

    const aspect = PROMOTION_BANNER_ASPECT;
    const cropWidth = Math.max(80, Math.min(stageWidth - 32, (STAGE_HEIGHT - 48) * aspect));
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
            const outputWidth = PROMOTION_BANNER_WIDTH;
            const outputHeight = PROMOTION_BANNER_HEIGHT;
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
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#061f16]/80 px-3 py-4 backdrop-blur-sm sm:px-6" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
            <section role="dialog" aria-modal="true" aria-label={tr('Cắt ảnh khuyến mãi', 'Crop promotion image')} className="flex max-h-[94vh] w-full max-w-[850px] flex-col overflow-y-auto rounded-2xl bg-[#fffaf0] shadow-2xl">
                <div className="flex items-start justify-between border-b border-[#dbe6d9] px-5 py-4 sm:px-7">
                    <div>
                        <h2 className="text-xl font-bold text-[#14392b]">{tr('Chỉnh sửa vùng ảnh', 'Edit image crop')}</h2>
                        <p className="mt-1 text-sm text-[#607465]">{tr('Kéo và phóng to ảnh trong khung cố định trước khi tải lên.', 'Drag and zoom within the fixed frame before uploading.')}</p>
                    </div>
                    <button type="button" onClick={onCancel} disabled={busy} aria-label={tr('Đóng', 'Close')} className="rounded-lg p-2 text-[#14392b] hover:bg-[#e8efe6]"><X size={20} /></button>
                </div>
                <div className="px-4 pt-4 sm:px-7">
                    <div className="mb-3 rounded-xl border border-[#dbe6d9] bg-white px-4 py-3 text-sm text-[#24593d]">
                        <p className="m-0 font-bold">{tr('Kích thước thiết kế banner', 'Banner design size')}: {PROMOTION_BANNER_SIZE} (16:9)</p>
                        <p className="mb-0 mt-1 text-xs text-[#607465]">{tr('Khung này khớp với banner trang chủ. Chừa khoảng trống phía dưới cho tiêu đề chiến dịch.', 'This frame matches the homepage banner. Leave room at the bottom for the campaign title.')}</p>
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
                        style={{ height: STAGE_HEIGHT, touchAction: 'none' }}
                        className={`relative w-full select-none overflow-hidden rounded-xl bg-[#12261f] outline-none focus-visible:ring-4 focus-visible:ring-[#a0d8a9] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
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
                        {!natural && <div className="absolute inset-0 flex items-center justify-center text-sm text-white">{tr('Đang tải ảnh...', 'Loading image...')}</div>}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[#315f42]">
                        <Move size={17} />
                        <span className="text-xs">{tr('Kéo hoặc dùng phím mũi tên để di chuyển', 'Drag or use arrow keys to move')}</span>
                        <div className="flex flex-1 items-center gap-2 sm:ml-auto sm:max-w-[300px]">
                            <ZoomIn size={17} />
                            <input type="range" min="1" max="4" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))}
                                aria-label={tr('Phóng to', 'Zoom')} className="w-full accent-[#24593d]" />
                            <span className="min-w-[40px] text-xs font-bold">{Math.round(zoom * 100)}%</span>
                        </div>
                        <button type="button" onClick={() => { setOffset({ x: 0, y: 0 }); setZoom(1); }} className="flex items-center gap-1 rounded-lg border border-[#d1dfd1] bg-white px-3 py-2 text-xs font-semibold"><RotateCcw size={14} />{tr('Đặt lại', 'Reset')}</button>
                    </div>
                    {error && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{error}</p>}
                </div>
                <div className="mt-4 flex flex-col-reverse gap-3 border-t border-[#dbe6d9] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                    <button type="button" disabled={busy} onClick={onCancel} className="rounded-xl border border-[#bed0bd] bg-white px-6 py-3 text-sm font-semibold text-[#315f42]">{tr('Hủy', 'Cancel')}</button>
                    <button type="button" disabled={!natural || busy || Boolean(error)} onClick={() => void apply()} className="flex items-center justify-center gap-2 rounded-xl bg-[#174732] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"><Check size={17} />{busy ? tr('Đang xử lý...', 'Processing...') : tr('Áp dụng vùng cắt', 'Apply crop')}</button>
                </div>
            </section>
        </div>, document.body,
    );
}
