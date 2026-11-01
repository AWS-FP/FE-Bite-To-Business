import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COVERFLOW_SLIDES } from '../../constants/customer/homeData'

export default function CoverflowSlider() {
    const navigate = useNavigate()
    const [activeIndex, setActiveIndex] = useState(1)
    const [isPaused, setIsPaused] = useState(false)
    const total = COVERFLOW_SLIDES.length

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % total)
    }, [total])

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + total) % total)
    }, [total])

    useEffect(() => {
        if (isPaused) return
        const timer = setInterval(handleNext, 5000)
        return () => clearInterval(timer)
    }, [isPaused, handleNext])

    const getRelativeOffset = (index: number) => {
        let diff = index - activeIndex
        if (diff > total / 2) diff -= total
        if (diff < -total / 2) diff += total
        return diff
    }

    return (
        <section
            className="relative overflow-hidden bg-[#133425] pt-8 pb-11 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Promotional Coverflow Slider"
        >
            <div className="mx-auto max-w-[1360px] px-4 sm:px-8">
                <div
                    className="relative mx-auto flex h-[380px] sm:h-[430px] items-center justify-center"
                    style={{ perspective: '1400px' }}
                >
                    {COVERFLOW_SLIDES.map((slide, index) => {
                        const offset = getRelativeOffset(index)
                        const isCenter = offset === 0
                        const isLeft = offset === -1
                        const isRight = offset === 1
                        const isVisible = Math.abs(offset) <= 1

                        let transformStyle = 'translate3d(0px, 0px, -400px) scale(0.7)'
                        let zIndex = 5
                        let opacity = 0

                        if (isCenter) {
                            transformStyle =
                                'translate3d(0px, 0px, 0px) rotateY(0deg) scale(1)'
                            zIndex = 30
                            opacity = 1
                        } else if (isLeft) {
                            transformStyle =
                                'translate3d(-92%, 12px, -140px) rotateY(28deg) scale(0.88)'
                            zIndex = 20
                            opacity = 0.92
                        } else if (isRight) {
                            transformStyle =
                                'translate3d(92%, 12px, -140px) rotateY(-28deg) scale(0.88)'
                            zIndex = 20
                            opacity = 0.92
                        }

                        return (
                            <div
                                key={slide.id}
                                onClick={() => {
                                    if (!isCenter && isVisible) {
                                        setActiveIndex(index)
                                    } else if (isCenter) {
                                        navigate(slide.targetLink)
                                    }
                                }}
                                style={{
                                    transform: transformStyle,
                                    zIndex,
                                    opacity,
                                    transition:
                                        'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease',
                                    transformStyle: 'preserve-3d',
                                    pointerEvents: isVisible ? 'auto' : 'none',
                                }}
                                className="absolute h-[360px] w-[320px] sm:h-[415px] sm:w-[405px] cursor-pointer overflow-hidden rounded-[24px] border-2 border-solid border-[#0D261A] bg-[#183F2D] shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
                            >
                                {slide.imageUrl ? (
                                    <img
                                        src={slide.imageUrl}
                                        alt={slide.alt}
                                        className="block h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1B4632] to-[#0F291D] p-6 text-center text-white">
                                        <ImageIcon size={40} className="mb-3 text-[#FACC15]" />
                                        <span className="text-sm font-extrabold uppercase tracking-wider text-[#FACC15]">
                      [ Full Poster Image #{index + 1} ]
                    </span>
                                        <span className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-white/70">
                      Put your designed poster image path in{' '}
                                            <code className="text-[#A7F3D0]">
                        COVERFLOW_SLIDES[{index}].imageUrl
                      </code>{' '}
                                            inside <code className="text-[#A7F3D0]">homeData.ts</code>
                    </span>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous slide"
                        className="absolute left-0 sm:left-2 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-solid border-white/25 bg-[#0B1F16]/85 text-white shadow-lg transition-all hover:scale-105 hover:border-[#FACC15] hover:text-[#FACC15]"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next slide"
                        className="absolute right-0 sm:right-2 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-solid border-white/25 bg-[#0B1F16]/85 text-white shadow-lg transition-all hover:scale-105 hover:border-[#FACC15] hover:text-[#FACC15]"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2.5">
                    {COVERFLOW_SLIDES.map((slide, idx) => {
                        const isActive = idx === activeIndex
                        return (
                            <button
                                key={slide.id}
                                type="button"
                                onClick={() => setActiveIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-4 cursor-pointer rounded-full border-0 transition-all duration-300 ${
                                    isActive
                                        ? 'w-5 scale-110 bg-[#FACC15]'
                                        : 'w-4 bg-[#A3B8AE]/60 hover:bg-[#A3B8AE]'
                                }`}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
