import ListSkeleton from '@/components/common/ListSkeleton';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, ExternalLink, PackageSearch, Search, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import PageNav from '@/components/common/PageNav';
import { ROUTES, routePaths } from '@/router/routes';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import { useMyProductRequests } from '@/hooks/customer/useMyProductRequests';
import type { MyProductRequest, ProductRequestStatus } from '@/types/customer/productRequest';

const STATUS_STYLE: Record<ProductRequestStatus, { vi: string; en: string; className: string; Icon: typeof Clock3 }> = {
    PENDING: { vi: 'Đã gửi', en: 'Sent', className: 'bg-store-cream text-store-ink border-store-ink/30', Icon: Clock3 },
    REVIEWING: { vi: 'Đang tìm nguồn', en: 'Sourcing', className: 'bg-store-yellow text-store-ink border-store-ink', Icon: Search },
    ADDED: { vi: 'Đã có hàng', en: 'Now available', className: 'bg-store-green text-white border-store-green', Icon: CheckCircle2 },
    REJECTED: { vi: 'Chưa thể đáp ứng', en: 'Not available', className: 'bg-red-50 text-red-700 border-red-200', Icon: XCircle },
};

function formatDate(value: string, english: boolean) {
    return new Date(value).toLocaleDateString(english ? 'en-GB' : 'vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function RequestCard({ item, english }: { item: MyProductRequest; english: boolean }) {
    const status = STATUS_STYLE[item.status] ?? STATUS_STYLE.PENDING;
    const text = (vi: string, en: string) => (english ? en : vi);
    return (
        <article className="grid border border-store-line bg-white shadow-[5px_7px_0_rgba(17,58,42,0.18)] md:grid-cols-[1.1fr_1fr]">
            <div className="flex min-w-0 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}>
                        <status.Icon size={14} /> {english ? status.en : status.vi}
                    </span>
                    <span className="text-xs text-store-muted">{text('Gửi ngày', 'Sent on')} {formatDate(item.createdAt, english)}</span>
                </div>
                <h2 className="m-0 break-words font-subheading text-xl font-bold">{item.productName}</h2>
                {item.customerNote && <p className="m-0 whitespace-pre-wrap break-words text-sm text-store-muted">{item.customerNote}</p>}
                {item.referenceUrl && (
                    <a href={item.referenceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-store-green">
                        {text('Link tham khảo', 'Reference link')} <ExternalLink size={14} />
                    </a>
                )}
                <p className="m-0 mt-auto text-xs text-store-muted">
                    {item.notifyByEmail ? text('Phản hồi sẽ được gửi kèm qua email.', 'The reply will also be emailed to you.') : text('Phản hồi hiển thị trong thông báo.', 'Replies appear in your notifications.')}
                </p>
            </div>
            <div className={`flex flex-col gap-3 border-t border-store-line p-5 md:border-l md:border-t-0 ${item.status === 'ADDED' ? 'bg-surface-green' : 'bg-[#f8f8f2]'}`}>
                <p className="m-0 text-xs font-bold uppercase tracking-widest text-store-green">{text('Phản hồi từ Bite to Business', 'Reply from Bite to Business')}</p>
                {item.responseNote ? (
                    <>
                        <p className="m-0 whitespace-pre-wrap break-words text-sm">{item.responseNote}</p>
                        {item.addedProductId && (
                            <Link to={routePaths.productDetail(item.addedProductId)} className="mt-auto flex items-center justify-between gap-3 rounded-lg border-2 border-store-ink bg-white p-3 text-store-ink no-underline transition-transform hover:-translate-y-0.5">
                                <span className="min-w-0">
                                    <strong className="block truncate text-sm">{item.addedProductName}</strong>
                                    {item.sellingPrice != null && (
                                        <span className="text-sm font-extrabold text-store-green">
                                            {formatCurrencyVnd(Number(item.sellingPrice))}{item.unitCode ? ` / ${item.unitCode}` : ''}
                                        </span>
                                    )}
                                </span>
                                <span className="shrink-0 rounded bg-store-yellow px-3 py-2 text-xs font-bold">{text('Xem sản phẩm', 'View product')}</span>
                            </Link>
                        )}
                        {item.respondedAt && <p className="m-0 text-xs text-store-muted">{formatDate(item.respondedAt, english)}</p>}
                    </>
                ) : (
                    <p className="m-0 text-sm text-store-muted">
                        {item.status === 'REVIEWING'
                            ? text('Đội ngũ đang tìm nhà cung cấp phù hợp cho sản phẩm này.', 'Our team is looking for a suitable supplier.')
                            : text('Yêu cầu đã được ghi nhận và đang chờ xử lý.', 'Your request has been received and is waiting to be reviewed.')}
                    </p>
                )}
            </div>
        </article>
    );
}

export default function MyProductRequestsPage() {
    const { i18n } = useTranslation();
    const english = i18n.resolvedLanguage?.startsWith('en') ?? false;
    const text = (vi: string, en: string) => (english ? en : vi);
    const { page, setPage, result, loading, error, retry } = useMyProductRequests();

    return (
        <StorefrontLayout rootClassName="min-h-screen bg-store-cream text-store-ink">
            <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-8 sm:px-6">
                <PageNav back={{ label: text('Về trang chủ', 'Back to home'), to: ROUTES.HOME }} />
                <div className="mt-5 flex items-center gap-4 rounded-xl bg-store-green px-6 py-6 text-white">
                    <PackageSearch size={30} className="shrink-0 text-store-yellow" />
                    <div>
                        <h1 className="m-0 font-subheading text-2xl font-bold sm:text-3xl">{text('Yêu cầu nhập hàng đã gửi', 'My product requests')}</h1>
                        <p className="m-0 mt-1 text-sm text-white/80">
                            {text('Theo dõi các sản phẩm bạn đã đề xuất và phản hồi từ đội ngũ tìm nguồn hàng.', 'Track the products you suggested and replies from our sourcing team.')}
                        </p>
                    </div>
                </div>
                {loading && <ListSkeleton className="mt-7 space-y-5" lines={4} rowClassName="flex justify-between gap-4 rounded-xl border bg-white p-5" />}
                {error && (
                    <div role="alert" className="mt-7 rounded-lg border border-red-200 bg-white p-5 text-red-700">
                        {text('Không tải được danh sách yêu cầu.', 'Requests could not be loaded.')}
                        <button type="button" className="ml-4 font-bold underline" onClick={retry}>{text('Thử lại', 'Retry')}</button>
                    </div>
                )}
                {!loading && !error && result?.content.length === 0 && (
                    <div className="mt-7 flex flex-col items-center gap-3 rounded-xl bg-white p-10 text-center shadow-sm">
                        <PackageSearch size={36} className="text-store-sage" />
                        <p className="m-0 text-store-muted">
                            {text('Bạn chưa gửi yêu cầu nào. Dùng mục "Yêu cầu thêm sản phẩm" trên thanh menu để đề xuất sản phẩm mới.', 'You have not sent any requests yet. Use "Request a product" in the menu bar to suggest one.')}
                        </p>
                        <Link to={ROUTES.CATALOG} className="font-bold text-store-green">{text('Xem danh mục sản phẩm', 'Browse the catalog')}</Link>
                    </div>
                )}
                {!loading && !error && result && result.content.length > 0 && (
                    <>
                        <p className="mb-0 mt-7 text-sm text-store-muted">{result.totalElements} {text('yêu cầu', 'requests')}</p>
                        <div className="mt-3 space-y-5">
                            {result.content.map((item) => <RequestCard key={item.id} item={item} english={english} />)}
                        </div>
                        {result.totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label={text('Trang trước', 'Previous page')} className="grid size-10 place-items-center rounded-full border border-store-ink bg-white disabled:opacity-40"><ChevronLeft size={18} /></button>
                                <span className="text-sm font-semibold">{page + 1} / {result.totalPages}</span>
                                <button type="button" disabled={page + 1 >= result.totalPages} onClick={() => setPage(page + 1)} aria-label={text('Trang sau', 'Next page')} className="grid size-10 place-items-center rounded-full border border-store-ink bg-white disabled:opacity-40"><ChevronRight size={18} /></button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </StorefrontLayout>
    );
}
