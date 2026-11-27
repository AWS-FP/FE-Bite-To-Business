import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';

function ReviewPhoto({ src, alt, large = false }: { src: string; alt: string; large?: boolean }) {
    const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
    return <span className={`relative block overflow-hidden rounded-lg bg-[#e3e9e3] ${large ? 'h-[min(64vh,650px)] w-full' : 'size-20'}`}>
        {state === 'loading' && <Skeleton className="absolute inset-0 size-full" />}
        {state === 'error' ? <span role="img" aria-label={alt} className="absolute inset-0 grid place-items-center text-[#63796a]"><ImageOff aria-hidden="true" size={24}/></span> : <img src={src} alt={alt} loading={large ? 'eager' : 'lazy'} className={`size-full ${large ? 'object-contain' : 'object-cover'} ${state === 'loading' ? 'opacity-0' : ''}`} onLoad={() => setState('loaded')} onError={() => setState('error')} />}
    </span>;
}

export default function ExecutiveReviewImages({ urls }: { urls: string[] }) {
    const tr = useExecutiveText();
    const [index, setIndex] = useState<number | null>(null);
    const dialog = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLButtonElement | null>(null);
    const open = index !== null;
    useEffect(() => {
        const element = dialog.current;
        if (!open || !element) return;
        element.showModal();
        return () => { if (element.open) element.close(); trigger.current?.focus(); };
    }, [open]);
    if (!urls.length) return null;
    const move = (delta: number) => setIndex(current => current === null ? null : (current + delta + urls.length) % urls.length);
    const imageLabel = (i: number) => tr(`Ảnh đánh giá ${i + 1}/${urls.length}`, `Review photo ${i + 1}/${urls.length}`);
    return <div className="mt-3">
        <div className="flex flex-wrap gap-2">
            {urls.map((url, i) => <button key={`${url}-${i}`} type="button" className="rounded-lg ring-1 ring-[#dce9dc] hover:ring-[#1e5e42] focus-visible:outline-2 focus-visible:outline-offset-2" aria-label={imageLabel(i)} onClick={e => { trigger.current = e.currentTarget; setIndex(i); }}><ReviewPhoto src={url} alt={imageLabel(i)} /></button>)}
        </div>
        {open && index < urls.length && <dialog ref={dialog} aria-label={tr('Ảnh đánh giá khách hàng', 'Customer review photos')} className="fixed inset-0 m-auto w-[min(94vw,900px)] max-w-none rounded-xl bg-[#fffaf0] p-4 text-[#173e2e] shadow-xl backdrop:bg-black/70" onCancel={e => { e.preventDefault(); setIndex(null); }} onClick={e => { if (e.target === e.currentTarget) setIndex(null); }} onKeyDown={e => { if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } }}>
            <div className="mb-3 flex items-center justify-between"><p aria-live="polite" className="font-semibold">{imageLabel(index)}</p><button type="button" autoFocus className="rounded-lg p-2 hover:bg-[#e5f0e4]" aria-label={tr('Đóng', 'Close')} onClick={() => setIndex(null)}><X size={22}/></button></div>
            <ReviewPhoto key={urls[index]} src={urls[index]} alt={imageLabel(index)} large />
            {urls.length > 1 && <div className="mt-3 flex justify-between"><button type="button" className="rounded-lg p-2 hover:bg-[#e5f0e4]" aria-label={tr('Ảnh trước', 'Previous image')} onClick={() => move(-1)}><ChevronLeft /></button><button type="button" className="rounded-lg p-2 hover:bg-[#e5f0e4]" aria-label={tr('Ảnh tiếp theo', 'Next image')} onClick={() => move(1)}><ChevronRight /></button></div>}
        </dialog>}
    </div>;
}
