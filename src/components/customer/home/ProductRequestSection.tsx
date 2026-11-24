import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProductRequestForm } from '@/hooks/customer/useProductRequestForm';

export default function ProductRequestSection({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
    const { i18n } = useTranslation();
    const english = i18n.resolvedLanguage === 'en';
    const {
        hidden, open, setDialogOpen, start, submit, busy, error, sent,
        name, setName, brand, setBrand, url, setUrl, note, setNote, notify, setNotify,
    } = useProductRequestForm(english, onOpenChange);
    if (hidden) return null;
    return <>
        <button type="button" onClick={start} aria-expanded={open} className={`shrink-0 rounded-lg border-0 px-2.5 py-1.5 font-bold transition-colors ${open ? 'bg-store-yellow text-store-ink' : 'bg-transparent text-store-cream hover:bg-white/10 hover:text-store-yellow'}`}>{english ? 'Request a product' : 'Yêu cầu thêm sản phẩm'}</button>
        {open && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6" onClick={() => !busy && setDialogOpen(false)}>
                <div role="dialog" aria-modal="true" aria-labelledby="product-request-title" onClick={e => e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto whitespace-normal rounded-xl border-2 border-black bg-white p-6 text-left text-black">
                    <div className="flex items-start justify-between gap-4">
                        <div><p className="text-xs font-bold uppercase tracking-widest text-store-green">Bite to Business</p><h2 id="product-request-title" className="mt-2 font-subheading text-2xl font-bold">{english ? 'Request a product' : 'Yêu cầu thêm sản phẩm'}</h2></div>
                        <button type="button" disabled={busy} onClick={() => setDialogOpen(false)} aria-label={english ? 'Close' : 'Đóng'} className="rounded border border-black p-2"><X size={18} /></button>
                    </div>
                    {sent ? <div className="mt-6 space-y-4"><p role="status" className="rounded bg-surface-green p-4 text-sm">{english ? 'Your request has been sent.' : 'Đã gửi yêu cầu của bạn.'}</p><button type="button" onClick={() => setDialogOpen(false)} className="rounded border border-black bg-store-yellow px-4 py-2 font-semibold">{english ? 'Done' : 'Đóng'}</button></div> :
                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <label className="flex flex-col gap-2 font-body text-sm font-semibold">{english ? 'Product name *' : 'Tên sản phẩm *'}<input required maxLength={200} value={name} onChange={e => setName(e.target.value)} className="box-border block w-full min-w-0 rounded border border-black/50 px-3 py-3 font-body font-normal" /></label>
                            <label className="flex flex-col gap-2 font-body text-sm font-semibold">{english ? 'Brand (optional)' : 'Thương hiệu (không bắt buộc)'}<input maxLength={150} value={brand} onChange={e => setBrand(e.target.value)} className="box-border block w-full min-w-0 rounded border border-black/50 px-3 py-3 font-body font-normal" /></label>
                            <label className="flex flex-col gap-2 font-body text-sm font-semibold">{english ? 'Reference link (optional)' : 'Link tham khảo (không bắt buộc)'}<input type="url" maxLength={2000} value={url} onChange={e => setUrl(e.target.value)} className="box-border block w-full min-w-0 rounded border border-black/50 px-3 py-3 font-body font-normal" /></label>
                            <label className="flex flex-col gap-2 font-body text-sm font-semibold">{english ? 'Details (optional)' : 'Thông tin thêm (không bắt buộc)'}<textarea rows={3} maxLength={1800} value={note} onChange={e => setNote(e.target.value)} placeholder={english ? 'Size or other requirements' : 'Quy cách hoặc yêu cầu khác'} className="box-border block w-full min-w-0 rounded border border-black/50 px-3 py-3 font-body font-normal" /></label>
                            <label className="flex items-center gap-2 font-body text-sm"><input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />{english ? 'Notify me by email' : 'Nhận phản hồi qua email'}</label>
                            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                            <button type="submit" disabled={busy} className="rounded border border-black bg-store-yellow px-5 py-3 text-sm font-bold disabled:opacity-50">{busy ? (english ? 'Sending...' : 'Đang gửi...') : (english ? 'Send request' : 'Gửi yêu cầu')}</button>
                        </form>}
                </div>
            </div>, document.body
        )}
    </>;
}
