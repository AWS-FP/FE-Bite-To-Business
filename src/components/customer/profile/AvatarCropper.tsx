
import {
    Check,
    Grip,
    Minus,
    Plus,
    RotateCcw,
    ZoomIn,
} from 'lucide-react'

import {
    useEffect,
    useId,
    useRef,
    useState,
} from 'react'

import type { PointerEvent } from 'react'

type Size = {
    width: number
    height: number
}

type Offset = {
    x: number
    y: number
}

type AvatarCropperProps = {
    src: string
    onApply: (dataUrl: string) => void
    onBack: () => void
}

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const STAGE_HEIGHT = 332
const OUTPUT_SIZE = 320

const clamp = (
    value: number,
    min: number,
    max: number
) => Math.min(max, Math.max(min, value))

export default function AvatarCropper({
                                          src,
                                          onApply,
                                          onBack,
                                      }: AvatarCropperProps) {
    const maskId = useId().replace(/:/g, '')

    const stageRef = useRef<HTMLDivElement>(null)

    const originalImageRef =
        useRef<HTMLImageElement | null>(null)

    const dragRef = useRef<{
        pointerId: number
        startX: number
        startY: number
        offset: Offset
    } | null>(null)

    const [stage, setStage] = useState<Size>({
        width: 440,
        height: STAGE_HEIGHT,
    })

    const [natural, setNatural] =
        useState<Size | null>(null)

    const [zoom, setZoom] = useState(MIN_ZOOM)

    const [offset, setOffset] = useState<Offset>({
        x: 0,
        y: 0,
    })

    const [dragging, setDragging] = useState(false)

    const [loadError, setLoadError] = useState(false)

    // ==========================================
    // IMAGE DIMENSIONS
    // ==========================================

    // Giữ tỷ lệ ảnh gốc.
    // Ảnh chỉ cần đủ lớn để phủ vòng crop.
    // Không sử dụng ảnh làm background.

    const circleSize = Math.max(
        80,
        Math.min(
            220,
            stage.width - 36,
            stage.height - 40
        )
    )

    const baseScale = natural
        ? Math.max(
            circleSize / natural.width,
            circleSize / natural.height
        )
        : 1

    const photoWidth = natural
        ? natural.width * baseScale * zoom
        : circleSize

    const photoHeight = natural
        ? natural.height * baseScale * zoom
        : circleSize

    const maxX = Math.max(
        0,
        (photoWidth - circleSize) / 2
    )

    const maxY = Math.max(
        0,
        (photoHeight - circleSize) / 2
    )

    // ==========================================
    // RESPONSIVE STAGE
    // ==========================================

    useEffect(() => {
        const element = stageRef.current

        if (!element) return

        const measure = () => {
            setStage({
                width: element.clientWidth,
                height: element.clientHeight,
            })
        }

        measure()

        const observer = new ResizeObserver(measure)

        observer.observe(element)

        return () => observer.disconnect()
    }, [])

    // ==========================================
    // LOAD ORIGINAL IMAGE
    // ==========================================

    useEffect(() => {
        let cancelled = false

        const image = new Image()

        originalImageRef.current = null

        setNatural(null)
        setLoadError(false)
        setZoom(MIN_ZOOM)
        setOffset({ x: 0, y: 0 })

        image.onload = () => {
            if (cancelled) return

            originalImageRef.current = image

            setNatural({
                width: image.naturalWidth,
                height: image.naturalHeight,
            })
        }

        image.onerror = () => {
            if (!cancelled) {
                setLoadError(true)
            }
        }

        image.src = src

        return () => {
            cancelled = true
        }
    }, [src])

    // ==========================================
    // KEEP PHOTO WITHIN CROP CIRCLE
    // ==========================================

    useEffect(() => {
        setOffset((previous) => ({
            x: clamp(previous.x, -maxX, maxX),
            y: clamp(previous.y, -maxY, maxY),
        }))
    }, [maxX, maxY])

    // ==========================================
    // MOUSE WHEEL ZOOM
    // ==========================================

    useEffect(() => {
        const element = stageRef.current

        if (!element || !natural) return

        const onWheel = (event: WheelEvent) => {
            event.preventDefault()

            setZoom((value) =>
                clamp(
                    Math.round(
                        (
                            value +
                            (event.deltaY < 0 ? 0.1 : -0.1)
                        ) * 100
                    ) / 100,
                    MIN_ZOOM,
                    MAX_ZOOM
                )
            )
        }

        element.addEventListener('wheel', onWheel, {
            passive: false,
        })

        return () => {
            element.removeEventListener(
                'wheel',
                onWheel
            )
        }
    }, [natural])

    // ==========================================
    // DRAG UPLOADED PHOTO
    // ==========================================

    function beginDrag(
        event: PointerEvent<HTMLDivElement>
    ) {
        if (
            !natural ||
            (
                event.pointerType === 'mouse' &&
                event.button !== 0
            )
        ) {
            return
        }

        event.currentTarget.setPointerCapture(
            event.pointerId
        )

        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            offset: { ...offset },
        }

        setDragging(true)
    }

    function moveDrag(
        event: PointerEvent<HTMLDivElement>
    ) {
        const drag = dragRef.current

        if (
            !drag ||
            drag.pointerId !== event.pointerId
        ) {
            return
        }

        setOffset({
            x: clamp(
                drag.offset.x +
                event.clientX -
                drag.startX,
                -maxX,
                maxX
            ),

            y: clamp(
                drag.offset.y +
                event.clientY -
                drag.startY,
                -maxY,
                maxY
            ),
        })
    }

    function endDrag(
        event: PointerEvent<HTMLDivElement>
    ) {
        if (
            dragRef.current?.pointerId !==
            event.pointerId
        ) {
            return
        }

        dragRef.current = null
        setDragging(false)

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId
            )
        }
    }

    // ==========================================
    // ZOOM & RESET
    // ==========================================

    function changeZoom(value: number) {
        setZoom(
            clamp(
                Math.round(value * 100) / 100,
                MIN_ZOOM,
                MAX_ZOOM
            )
        )
    }

    function reset() {
        setZoom(MIN_ZOOM)

        setOffset({
            x: 0,
            y: 0,
        })
    }

    // ==========================================
    // EXPORT SELECTED CIRCLE
    // ==========================================

    function apply() {
        const image = originalImageRef.current

        if (!image || !natural) return

        const canvas = document.createElement('canvas')

        canvas.width = OUTPUT_SIZE
        canvas.height = OUTPUT_SIZE

        const context = canvas.getContext('2d')

        if (!context) return

        // Xuất đúng vùng được chọn trong vòng tròn.
        const scale = OUTPUT_SIZE / circleSize

        context.drawImage(
            image,
            (OUTPUT_SIZE - photoWidth * scale) / 2 +
            offset.x * scale,

            (OUTPUT_SIZE - photoHeight * scale) / 2 +
            offset.y * scale,

            photoWidth * scale,
            photoHeight * scale
        )

        onApply(
            canvas.toDataURL('image/jpeg', 0.87)
        )
    }

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="text-white">
            {/* CROP STAGE - NỀN XANH TRỐNG */}
            <div
                ref={stageRef}
                role="img"
                aria-label="Drag the uploaded photo to choose the area inside the circle"
                tabIndex={0}
                onPointerDown={beginDrag}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={(event) => {
                    const directions: Record<string, Offset> = {
                        ArrowLeft: { x: -8, y: 0 },
                        ArrowRight: { x: 8, y: 0 },
                        ArrowUp: { x: 0, y: -8 },
                        ArrowDown: { x: 0, y: 8 },
                    }

                    const delta = directions[event.key]

                    if (!delta) return

                    event.preventDefault()

                    setOffset((previous) => ({
                        x: clamp(
                            previous.x + delta.x,
                            -maxX,
                            maxX
                        ),

                        y: clamp(
                            previous.y + delta.y,
                            -maxY,
                            maxY
                        ),
                    }))
                }}
                style={{
                    height: STAGE_HEIGHT,
                    touchAction: 'none',
                }}
                className={`relative w-full select-none overflow-hidden rounded-2xl border border-[#F3DF9B]/60 bg-[#092A1F] outline-none focus-visible:ring-2 focus-visible:ring-[#FFE14D] ${
                    dragging
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                }`}
            >
                {natural ? (
                    <>
                        {/* ẢNH UPLOAD DUY NHẤT */}
                        <img
                            src={src}
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                            className="pointer-events-none absolute max-w-none select-none"
                            style={{
                                width: photoWidth,
                                height: photoHeight,

                                left:
                                    (stage.width - photoWidth) / 2 +
                                    offset.x,

                                top:
                                    (stage.height - photoHeight) / 2 +
                                    offset.y,
                            }}
                        />

                        {/* VÒNG TRÒN CHỌN AVATAR */}
                        <svg
                            className="pointer-events-none absolute inset-0 h-full w-full"
                            viewBox={`0 0 ${stage.width} ${stage.height}`}
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <defs>
                                <mask id={maskId}>
                                    <rect
                                        width={stage.width}
                                        height={stage.height}
                                        fill="white"
                                    />

                                    <circle
                                        cx={stage.width / 2}
                                        cy={stage.height / 2}
                                        r={circleSize / 2}
                                        fill="black"
                                    />
                                </mask>
                            </defs>

                            {/* TỐI VÙNG NGOÀI VÒNG TRÒN */}
                            <rect
                                width={stage.width}
                                height={stage.height}
                                fill="rgba(3, 25, 17, 0.50)"
                                mask={`url(#${maskId})`}
                            />

                            {/* VIỀN VÒNG TRÒN */}
                            <circle
                                cx={stage.width / 2}
                                cy={stage.height / 2}
                                r={circleSize / 2}
                                fill="none"
                                stroke="#FFF2BE"
                                strokeWidth="3"
                            />
                        </svg>
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-white/75">
                        {loadError
                            ? 'Cannot load this image'
                            : 'Loading image…'}
                    </div>
                )}

                <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#071D16]/80 px-3 py-1.5 text-[11px] text-[#F9ECC1]">
                    <Grip size={13} />
                    Drag photo to reposition
                </div>
            </div>

            {/* ZOOM CONTROLS */}
            <div className="mt-5 rounded-2xl bg-white/5 px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFF4CA]">
                        <ZoomIn size={17} />
                        Zoom
                    </span>

                    <span className="text-xs font-bold tabular-nums text-[#FFE14D]">
                        {Math.round(zoom * 100)}%
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Zoom out"
                        disabled={zoom <= MIN_ZOOM}
                        onClick={() =>
                            changeZoom(zoom - 0.1)
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white disabled:opacity-35"
                    >
                        <Minus size={16} />
                    </button>

                    <input
                        type="range"
                        min={MIN_ZOOM}
                        max={MAX_ZOOM}
                        step={0.05}
                        value={zoom}
                        onChange={(event) =>
                            changeZoom(
                                Number(event.target.value)
                            )
                        }
                        aria-label="Avatar zoom"
                        className="min-w-0 flex-1 cursor-pointer accent-[#FFE14D]"
                    />

                    <button
                        type="button"
                        aria-label="Zoom in"
                        disabled={zoom >= MAX_ZOOM}
                        onClick={() =>
                            changeZoom(zoom + 0.1)
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white disabled:opacity-35"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <p className="mb-0 mt-3 text-center text-[11px] text-white/55">
                    Drag the photo or scroll to zoom.
                    Use arrow keys to move it.
                </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 border-0 bg-transparent text-sm font-semibold text-white/75 hover:text-white"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-xl border border-[#FFE14D]/60 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#FFF3CB] hover:bg-white/10"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={apply}
                        disabled={!natural}
                        className="inline-flex items-center gap-2 rounded-xl border-0 bg-[#FFE14D] px-5 py-2.5 text-sm font-black text-[#143827] hover:bg-[#FFE981] disabled:opacity-40"
                    >
                        <Check size={17} />
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}
