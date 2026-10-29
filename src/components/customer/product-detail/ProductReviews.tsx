import { useProductDetailContext } from './ProductDetailModel.tsx';
import { MessageSquareHeart, RefreshCw, Star, ThumbsUp } from 'lucide-react';

export default function ProductReviews() {
    const {
        currentProduct,
        selectedStarFilter,
        isReloadingReviews,
        reviewsTriggered,
        isHoveringChat,
        setIsHoveringChat,
        userHoverStar,
        setUserHoverStar,
        userSelectedStar,
        setUserSelectedStar,
        chatStreamRef,
        filteredReviews,
        handleFilterStarClick,
    } = useProductDetailContext();
    return (
        <div
            onMouseEnter={() => setIsHoveringChat(true)}
            onMouseLeave={() => setIsHoveringChat(false)}
            aria-hidden={!reviewsTriggered}
            className={reviewsTriggered ? 'mt-16 btb-review-reveal' : 'hidden'}
        >
            {/* Floating Glass Header Bar + Star Filter Pills */}
            <div className="rounded-2xl bg-[#FFFFFF0C] px-4 py-3.5 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4ADE80]" />
                        </span>
                        <MessageSquareHeart size={15} className="text-[#FACC15]" />
                        <span className="font-serif text-sm font-bold text-white">
                            Live Kitchen Review Stream
                        </span>
                        <span className="rounded-full bg-[#FACC15] px-2 py-0.5 text-[10px] font-black text-[#14132b]">
                            {currentProduct.rating}/5 ★
                        </span>
                    </div>

                    {/* Interactive Quick Star Rate */}
                    <div className="flex items-center gap-1">
                        <span className="mr-1 text-[10px] text-emerald-200">
                            {userSelectedStar > 0 ? `Rated ${userSelectedStar}★` : 'Rate:'}
                        </span>
                        {[1, 2, 3, 4, 5].map((star) => {
                            const active = star <= (userHoverStar || userSelectedStar);
                            return (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setUserHoverStar(star)}
                                    onMouseLeave={() => setUserHoverStar(0)}
                                    onClick={() => setUserSelectedStar(star)}
                                    className="cursor-pointer border-0 bg-transparent p-0 transition-transform hover:scale-125"
                                >
                                    <Star
                                        size={13}
                                        className={
                                            active
                                                ? 'fill-[#FACC15] text-[#FACC15]'
                                                : 'fill-transparent text-white/40'
                                        }
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Star Filter Pills (Reloads only the chat stream below) */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {(
                        [
                            { value: 'all', label: 'All' },
                            { value: 5, label: '5 ★' },
                            { value: 4, label: '4 ★' },
                            { value: 3, label: '3 ★' },
                            { value: 2, label: '2 ★' },
                            { value: 1, label: '1 ★' },
                        ] as const
                    ).map((btn) => {
                        const isSelected = selectedStarFilter === btn.value;
                        return (
                            <button
                                key={String(btn.value)}
                                type="button"
                                onClick={() => handleFilterStarClick(btn.value)}
                                className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-extrabold transition-all ${
                                    isSelected
                                        ? 'border border-solid border-[#FACC15] bg-[#FACC15] text-[#14132b] shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                                        : 'border border-solid border-white/20 bg-white/10 text-white/85 hover:bg-white/20'
                                }`}
                            >
                                {btn.label}
                            </button>
                        );
                    })}

                    <span className="ml-auto text-[10px] text-emerald-200/80">
                        {isHoveringChat ? '⏸ Paused (Scroll)' : '↑ Live stream'}
                    </span>
                </div>
            </div>

            {/* FLOATING TRANSPARENT CHAT BUBBLES STREAM (No outer box!) */}
            <div
                ref={chatStreamRef}
                className="mt-5 h-[250px] space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin] overscroll-contain"
            >
                {isReloadingReviews ? (
                    <div className="flex h-[180px] flex-col items-center justify-center rounded-2xl border border-solid border-white/15 bg-white/8 p-6 text-center backdrop-blur-md">
                        <RefreshCw size={22} className="animate-spin text-[#FACC15]" />
                        <span className="mt-2 text-xs font-bold text-emerald-100">
                            Reloading{' '}
                            {selectedStarFilter === 'all' ? 'all' : `${selectedStarFilter}-star`}{' '}
                            chat reviews...
                        </span>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="flex h-[160px] flex-col items-center justify-center rounded-2xl border border-solid border-white/15 bg-white/8 p-6 text-center backdrop-blur-md">
                        <span className="text-xs font-semibold text-white/80">
                            No chat reviews with {selectedStarFilter} stars yet.
                        </span>
                        <button
                            type="button"
                            onClick={() => handleFilterStarClick('all')}
                            className="mt-2.5 cursor-pointer rounded-full border-0 bg-[#FACC15] px-3.5 py-1 text-[11px] font-extrabold text-[#14132b]"
                        >
                            Show All Stream
                        </button>
                    </div>
                ) : (
                    Array.from({ length: 5 }).flatMap((_, repeat) =>
                        filteredReviews.map((rev, idx) => (
                            <div
                                key={`${repeat}-${rev.id}-${selectedStarFilter}`}
                                style={{ animationDelay: `${idx * 90}ms` }}
                                className="chat-bubble-item flex items-end gap-2.5"
                            >
                                {/* Chat Avatar */}
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-solid border-white/40 bg-gradient-to-br ${rev.avatarBg} text-[11px] font-black text-[#14132b] shadow-md`}
                                >
                                    {rev.author.slice(0, 2).toUpperCase()}
                                </div>

                                {/* Transparent Glass Chat Bubble */}
                                <div className="flex-1 rounded-2xl rounded-bl-xs border border-solid border-white/20 bg-white/10 p-3.5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-md transition-colors hover:border-[#FACC15]/60 hover:bg-white/15">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <strong className="text-xs font-extrabold text-[#FACC15]">
                                                {rev.author}
                                            </strong>
                                            {rev.roleBadge && (
                                                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold text-emerald-200">
                                                    {rev.roleBadge}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-white/50">
                                                • {rev.date}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    size={11}
                                                    className={
                                                        s <= rev.rating
                                                            ? 'fill-[#FACC15] text-[#FACC15]'
                                                            : 'fill-transparent text-white/25'
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="m-0 mt-1.5 text-xs leading-relaxed text-white/95">
                                        {rev.comment}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between text-[10px]">
                                        <span className="font-medium text-emerald-300">
                                            {rev.cutenessScore}
                                        </span>
                                        <button
                                            type="button"
                                            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-solid border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white hover:border-[#FACC15] hover:text-[#FACC15]"
                                        >
                                            <ThumbsUp size={10} />
                                            <span>{rev.likesLabel}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )),
                    )
                )}
            </div>
        </div>
    );
}
