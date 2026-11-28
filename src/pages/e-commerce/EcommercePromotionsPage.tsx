import ExecutiveTranslatedField from '@/components/e-commerce/ExecutiveTranslatedField';
import { useExecutiveConfirmation } from '@/hooks/e-commerce/useExecutiveConfirmation';
import { ExecutiveCampaignSkeleton } from '@/components/e-commerce/ExecutiveSkeletons';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    CalendarDays,
    Image as ImageIcon,
    Megaphone,
    Plus,
    Save,
    Search,
    Trash2,
    UploadCloud,
    PackageCheck,
} from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import {
    ExecutiveBadge,
    ExecutiveFeedback,
    ExecutivePagination,
    ExecutiveSelect,
} from '@/components/e-commerce/ExecutiveControls';
import {
    ExecutiveEmpty,
    ExecutiveError,
    ExecutiveHeading,
    ExecutivePanel,
} from '@/components/e-commerce/ExecutiveUI';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';
import type { Promotion, PromotionWrite } from '@/types/e-commerce/executiveAdmin';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';
import PromotionProductManager from '@/components/e-commerce/PromotionProductManager';
import { promotionDisplayStatus } from '@/utils/e-commerce/promotionLifecycle';
import { PROMOTION_BANNER_ASPECT, PROMOTION_BANNER_SIZE } from '@/constants/customer/promotionBanner';
import PromotionImageCropper from '@/components/e-commerce/PromotionImageCropper';

function localValue(iso: string) {
    const d = new Date(iso);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Same formats as Promotion images; convert AVIF before cropping/uploading. */
async function preparePromotionImage(file: File): Promise<File> {
    if (file.type !== 'image/avif') return file;
    const bitmap = await createImageBitmap(file);
    try {
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Image conversion failed');
        ctx.drawImage(bitmap, 0, 0);
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/jpeg', 0.86),
        );
        if (!blob || blob.size > MAX_IMAGE_BYTES) throw new Error('Image conversion failed');
        return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
            type: 'image/jpeg',
        });
    } finally {
        bitmap.close();
    }
}

export default function EcommercePromotionsPage() {
    const confirm = useExecutiveConfirmation();
    const [translationSession, setTranslationSession] = useState(0);
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const [status, setStatus] = useState(''),
        [search, setSearch] = useState(''),
        [debouncedSearch, setDebouncedSearch] = useState(''),
        [page, setPage] = useState(0),
        [draftOpen, setDraftOpen] = useState(false),
        [editId, setEditId] = useState<string | null>(null),
        [vi, setVi] = useState(''),
        [en, setEn] = useState(''),
        [contentVi, setContentVi] = useState(''),
        [contentEn, setContentEn] = useState(''),
        [start, setStart] = useState(''),
        [end, setEnd] = useState(''),
        [imageUrl, setImageUrl] = useState(''),
        [promotionType, setPromotionType] = useState<'STANDARD' | 'FLASH_SALE'>('STANDARD'),
        [managing, setManaging] = useState<Promotion | null>(null),
        [message, setMessage] = useState(''),
        [failed, setFailed] = useState(false),
        [cropUrl, setCropUrl] = useState(''),
        [cropFilename, setCropFilename] = useState('');
    const pageRef = useRef<HTMLDivElement>(null);
    const imageInput = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
        return () => window.clearTimeout(timeout);
    }, [search]);
    useEffect(() => {
        if (!cropUrl) return;
        return () => URL.revokeObjectURL(cropUrl);
    }, [cropUrl]);
    const list = useQuery({
        queryKey: ['ecom', 'promotions', status, page, debouncedSearch],
        queryFn: async ({ signal }) => {
            const result = await executiveApi.promotions(status || undefined, page, 20, debouncedSearch, signal);
            if (status && result.items.some((item) => promotionDisplayStatus(item) !== status)) {
                throw new Error('STATUS_FILTER_MISMATCH');
            }
            return result;
        },
        refetchInterval: 60_000,
    });
    function reset() {
        setDraftOpen(false);
        setEditId(null);
        setVi('');
        setEn('');
        setContentVi('');
        setContentEn('');
        setStart('');
        setEnd('');
        setImageUrl('');
        setPromotionType('STANDARD');
    }
    function edit(p: Promotion) {
        setTranslationSession(value => value + 1);
        setEditId(p.id);
        setVi(p.nameVi);
        setEn(p.nameEn);
        setContentVi(p.contentVi ?? '');
        setContentEn(p.contentEn ?? '');
        setStart(localValue(p.startsAt));
        setEnd(localValue(p.endsAt));
        setImageUrl(p.imageUrl ?? '');
        setPromotionType(p.promotionType ?? 'STANDARD');
        setDraftOpen(true);
        pageRef.current?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'instant'
                : 'smooth',
            block: 'start',
        });
    }
    const uploadImage = useMutation({
        mutationFn: (file: File) => executiveApi.uploadPromotionImage(file),
        onSuccess: (result) => {
            // Only fill the local form; creating/updating the campaign still requires Save.
            setImageUrl(result.imageUrl);
            setCropUrl('');
            setFailed(false);
            setMessage(
                tr(
                    'Ảnh đã tải lên. Thông tin chiến dịch vẫn được giữ; hãy bấm Lưu chiến dịch khi hoàn tất.',
                    'Image uploaded. Your form is intact; click Save campaign when ready.',
                ),
            );
        },
        onError: (error) => {
            setFailed(true);
            setMessage(
                executiveErrorMessage(
                    error,
                    tr(
                        'Tải ảnh thất bại. Nội dung đã nhập vẫn được giữ nguyên.',
                        'Image upload failed. Your form details have been preserved.',
                    ),
                ),
            );
        },
    });
    async function selectImage(file: File | undefined) {
        if (!file) return;
        if (
            !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) ||
            file.size > MAX_IMAGE_BYTES
        ) {
            setFailed(true);
            setMessage(
                tr(
                    'Chỉ hỗ trợ JPG, PNG, WebP, AVIF tối đa 5 MB.',
                    'JPG, PNG, WebP or AVIF, maximum 5 MB.',
                ),
            );
            return;
        }
        try {
            const prepared = await preparePromotionImage(file);
            setCropFilename(file.name);
            setCropUrl(URL.createObjectURL(prepared));
            setFailed(false);
            setMessage('');
        } catch {
            setFailed(true);
            setMessage(
                tr(
                    'Không đọc được ảnh. Hãy chọn file khác.',
                    'Cannot read this image. Choose another file.',
                ),
            );
        }
    }
    const removeCampaign = useMutation({
        mutationFn: (id: string) => executiveApi.deletePromotion(id),
        onSuccess: (_result, id) => {
            if (editId === id) reset();
            if (managing?.id === id) setManaging(null);
            setFailed(false);
            setMessage(
                tr(
                    'Đã xóa vĩnh viễn chiến dịch chưa xuất bản.',
                    'Unpublished campaign permanently deleted.',
                ),
            );
            if (list.data?.items.length === 1 && page > 0) setPage(page - 1);
            void qc.invalidateQueries({ queryKey: ['ecom', 'promotions'] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'images-promotions'] });
        },
        onError: (error) => {
            setFailed(true);
            setMessage(
                executiveErrorMessage(
                    error,
                    tr(
                        'Không thể xóa chiến dịch. Chiến dịch đã xuất bản chỉ có thể lưu trữ.',
                        'Could not delete campaign. Previously published campaigns can only be archived.',
                    ),
                ),
            );
        },
    });
    const save = useMutation({
        mutationFn: (payload: PromotionWrite) =>
            editId
                ? executiveApi.updatePromotion(editId, payload)
                : executiveApi.createPromotion(payload),
        onSuccess: (saved) => {
            setFailed(false);
            setMessage(
                tr(
                    'Chiến dịch đã lưu. Chọn sản phẩm áp dụng rồi xuất bản.',
                    'Campaign saved. Assign products, then publish.',
                ),
            );
            if (!editId) setManaging(saved);
            reset();
            void qc.invalidateQueries({ queryKey: ['ecom', 'promotions'] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'images-promotions'] });
        },
        onError: (error) => {
            setFailed(true);
            setMessage(
                executiveErrorMessage(
                    error,
                    tr('Không thể lưu chương trình.', 'Could not save campaign.'),
                ),
            );
        },
    });
    const action = useMutation({
        mutationFn: ({
            id,
            type,
        }: {
            id: string;
            type: 'publish' | 'disable' | 'archive' | 'restore';
        }) => executiveApi.promotionAction(id, type),
        onSuccess: () => {
            setFailed(false);
            setMessage(tr('Đã cập nhật chiến dịch.', 'Campaign updated.'));
            void qc.invalidateQueries({ queryKey: ['ecom', 'promotions'] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'images-promotions'] });
        },
        onError: (error) => {
            setFailed(true);
            setMessage(
                executiveErrorMessage(
                    error,
                    tr('Không thể chuyển trạng thái.', 'Unable to change status.'),
                ),
            );
        },
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!vi.trim() || !en.trim() || !start || !end || new Date(end) <= new Date(start)) {
            setFailed(true);
            setMessage(
                tr(
                    'Nhập đủ tiêu đề song ngữ và thời gian hợp lệ.',
                    'Provide bilingual titles and valid dates.',
                ),
            );
            return;
        }
        if (
            promotionType === 'FLASH_SALE' &&
            new Date(end).getTime() - new Date(start).getTime() > 72 * 60 * 60 * 1000
        ) {
            setFailed(true);
            setMessage(
                tr(
                    'Flash Sale không được dài hơn 72 giờ.',
                    'Flash Sale cannot last more than 72 hours.',
                ),
            );
            return;
        }
        save.mutate({
            promotionType,
            nameVi: vi.trim(),
            nameEn: en.trim(),
            contentVi: contentVi.trim() || null,
            contentEn: contentEn.trim() || null,
            startsAt: new Date(start).toISOString(),
            endsAt: new Date(end).toISOString(),
            imageUrl: imageUrl.trim() || null,
        });
    }
    return (
        <div ref={pageRef} className="space-y-6 scroll-mt-6">
            <ExecutiveHeading
                number="05"
                eyebrow="MARKETING / CAMPAIGNS"
                title={tr('Chương trình khuyến mãi', 'Promotion campaigns')}
                description={tr(
                    'Tạo chiến dịch, quản lý ảnh banner và lịch công bố.',
                    'Manage campaigns, promotional imagery and publication dates.',
                )}
                action={
                    <button
                        type="button"
                        className={executiveUi.button}
                        onClick={() => {
                            reset();
                            setDraftOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        {tr('Tạo chiến dịch', 'New campaign')}
                    </button>
                }
            />
            <ExecutiveFeedback message={message} error={failed} />
            {draftOpen && (
                <ExecutivePanel
                    title={
                        editId
                            ? tr('Sửa chiến dịch', 'Edit campaign')
                            : tr('Tạo chiến dịch', 'New campaign')
                    }
                    caption={tr(
                        'Sau khi chỉnh sửa, hãy xuất bản lại để khách hàng thấy thay đổi.',
                        'Publish your changes when they are ready for customers.',
                    )}
                >
                    <form onSubmit={submit} className="grid gap-4 p-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <ExecutiveSelect
                                label={tr('Loại chiến dịch', 'Campaign type')}
                                value={promotionType}
                                onValueChange={(value) =>
                                    setPromotionType(value as 'STANDARD' | 'FLASH_SALE')
                                }
                            >
                                <option value="STANDARD">
                                    {tr(
                                        'Khuyến mãi thông thường (dài hạn)',
                                        'Standard promotion (long-term)',
                                    )}
                                </option>
                                <option value="FLASH_SALE">
                                    {tr(
                                        'Chợ sớm giá sốc (tối đa 72 giờ)',
                                        'Flash Sale (max 72 hours)',
                                    )}
                                </option>
                            </ExecutiveSelect>
                            <span className="mt-2 block text-[11px] font-normal text-[#6b7972]">
                                {promotionType === 'FLASH_SALE'
                                    ? tr(
                                          'Chỉ tối đa 8 sản phẩm có giá sale và tồn kho đủ MOQ. Thời gian sale lấy theo ngày bắt đầu/kết thúc của chiến dịch.',
                                          'Maximum 8 products with valid sale prices and enough stock for MOQ. Sale dates come from this campaign.',
                                      )
                                    : tr(
                                          'Chương trình dài hạn không xuất hiện trong Chợ sớm giá sốc.',
                                          'Long-term promotions do not appear in Flash Sale.',
                                      )}
                            </span>
                        </div>
                        <ExecutiveTranslatedField label={tr('Tên tiếng Việt', 'Vietnamese title')} value={vi} source={en} sourceLanguage="en" field="NAME" limit={200} session={`${editId ?? 'new'}:${translationSession}`} onChange={setVi} disabled={save.isPending} required />
                        <ExecutiveTranslatedField label={tr('Tên tiếng Anh', 'English title')} value={en} source={vi} sourceLanguage="vi" field="NAME" limit={200} session={`${editId ?? 'new'}:${translationSession}`} onChange={setEn} disabled={save.isPending} required />
                        <ExecutiveTranslatedField label={tr('Nội dung tiếng Việt', 'Vietnamese description')} value={contentVi} source={contentEn} sourceLanguage="en" field="DESCRIPTION" limit={2000} session={`${editId ?? 'new'}:${translationSession}`} onChange={setContentVi} disabled={save.isPending} multiline />
                        <ExecutiveTranslatedField label={tr('Nội dung tiếng Anh', 'English description')} value={contentEn} source={contentVi} sourceLanguage="vi" field="DESCRIPTION" limit={2000} session={`${editId ?? 'new'}:${translationSession}`} onChange={setContentEn} disabled={save.isPending} multiline />
                        <label className="text-xs font-bold">
                            {tr('Bắt đầu', 'Starts')}
                            <input
                                required
                                type="datetime-local"
                                className={`${executiveUi.input} mt-2`}
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                            />
                        </label>
                        <label className="text-xs font-bold">
                            {tr('Kết thúc', 'Ends')}
                            <input
                                required
                                type="datetime-local"
                                min={start}
                                className={`${executiveUi.input} mt-2`}
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                            />
                        </label>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold">
                                {tr(
                                    'Đường dẫn ảnh quảng cáo (HTTPS)',
                                    'Promotion image URL (HTTPS)',
                                )}
                                <input
                                    type="url"
                                    className={`${executiveUi.input} mt-2`}
                                    placeholder="https://..."
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </label>
                            <p className="mb-0 mt-2 text-xs text-store-muted">
                                {tr('Kích thước banner trang chủ khuyến nghị', 'Recommended homepage banner size')}: {PROMOTION_BANNER_SIZE} (16:9).
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <input
                                    ref={imageInput}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/avif"
                                    className="hidden"
                                    aria-label={tr('Chọn ảnh chiến dịch', 'Choose campaign image')}
                                    onChange={(event) => {
                                        void selectImage(event.currentTarget.files?.[0]);
                                        event.currentTarget.value = '';
                                    }}
                                />
                                <button
                                    type="button"
                                    disabled={uploadImage.isPending || save.isPending}
                                    className={executiveUi.secondary}
                                    onClick={() => imageInput.current?.click()}
                                >
                                    <UploadCloud size={15} />
                                    {uploadImage.isPending
                                        ? tr('Đang tải ảnh...', 'Uploading image...')
                                        : tr(
                                              'Chọn, cắt và tải ảnh ngay tại đây',
                                              'Choose, crop and upload here',
                                          )}
                                </button>
                            </div>
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={tr('Xem trước ảnh chiến dịch', 'Campaign image preview')}
                                    className="mt-3 max-h-44 w-auto max-w-full rounded-lg border border-[#dbe8db] object-contain"
                                />
                            )}
                        </div>
                        <div className="flex gap-3 md:col-span-2">
                            <button
                                disabled={save.isPending || uploadImage.isPending}
                                className={executiveUi.button}
                            >
                                <Save size={16} />
                                {tr('Lưu chiến dịch', 'Save campaign')}
                            </button>
                            <button type="button" className={executiveUi.secondary} onClick={reset}>
                                {tr('Hủy', 'Cancel')}
                            </button>
                        </div>
                    </form>
                </ExecutivePanel>
            )}
            <ExecutivePanel
                title={tr('Danh sách chiến dịch', 'Campaign management')}
                caption={list.data ? `${list.data.total} ${tr('chiến dịch', 'campaigns')}` : ''}
            >
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
                    <div className="relative min-w-0 flex-1">
                        <Search
                            size={17}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5c7467]"
                        />
                        <input
                            type="search"
                            value={search}
                            maxLength={100}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(0);
                            }}
                            placeholder={tr(
                                'Tìm theo tên chiến dịch (VI/EN)...',
                                'Search campaigns by name (VI/EN)...',
                            )}
                            aria-label={tr('Tìm kiếm chiến dịch', 'Search campaigns')}
                            className={`${executiveUi.input} pl-10`}
                        />
                    </div>
                    <div className="w-full sm:w-[240px] sm:shrink-0">
                        <ExecutiveSelect
                            ariaLabel={tr('Trạng thái', 'Status')}
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value);
                                setPage(0);
                            }}
                        >
                            <option value="">{tr('Tất cả', 'All statuses')}</option>
                            <option value="DRAFT">{tr('Bản nháp', 'DRAFT')}</option>
                            <option value="PUBLISHED">{tr('Đã đăng', 'PUBLISHED')}</option>
                            <option value="EXPIRED">{tr('Hết hạn', 'EXPIRED')}</option>
                            <option value="ARCHIVED">{tr('Lưu trữ', 'ARCHIVED')}</option>
                        </ExecutiveSelect>
                    </div>
                </div>
                {list.isLoading ? (
                    <ExecutiveCampaignSkeleton />
                ) : list.isError ? (
                    <div className="p-5">
                        <ExecutiveError
                            message={list.error instanceof Error && list.error.message === 'STATUS_FILTER_MISMATCH'
                                ? tr('Máy chủ trả dữ liệu không đúng bộ lọc. Kiểm tra phiên bản Backend rồi thử lại.', 'The server returned data outside the selected filter. Check the backend version and retry.')
                                : tr('Không lấy được chiến dịch.', 'Could not load campaigns.')}
                            retry={() => void list.refetch()}
                        />
                    </div>
                ) : !list.data?.items.length ? (
                    <ExecutiveEmpty
                        icon={<Megaphone />}
                        title={
                            search.trim()
                                ? tr('Không tìm thấy chiến dịch', 'No matching campaigns')
                                : tr('Chưa có chiến dịch', 'No campaigns')
                        }
                        description={tr(
                            'Tạo chương trình mới để bắt đầu.',
                            'Create a campaign to get started.',
                        )}
                    />
                ) : (
                    <div className="grid gap-4 p-5 lg:grid-cols-2">
                        {list.data.items.map((p) => (
                            <article
                                key={p.id}
                                className="overflow-hidden rounded-2xl border border-[#dbe8db] bg-white"
                            >
                                <div className="flex min-h-[155px] items-center justify-center bg-[#edf4e9]">
                                    {p.imageUrl ? (
                                        <img
                                            alt=""
                                            src={p.imageUrl}
                                            loading="lazy"
                                            className="w-full bg-store-dark object-contain"
                                            style={{ aspectRatio: PROMOTION_BANNER_ASPECT }}
                                        />
                                    ) : (
                                        <ImageIcon size={35} className="text-[#8ea896]" />
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <ExecutiveBadge status={promotionDisplayStatus(p)} />
                                            <span className="rounded-full bg-[#e7f1e9] px-2 py-1 text-[10px] font-bold text-[#165b3d]">
                                                {p.promotionType === 'FLASH_SALE'
                                                    ? 'FLASH SALE'
                                                    : 'STANDARD'}
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-[11px] text-[#688373]">
                                            <CalendarDays size={13} />
                                            {new Date(p.startsAt).toLocaleDateString(
                                                'vi-VN',
                                            )} — {new Date(p.endsAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <h3 className="mt-3 text-lg font-bold">
                                        {tr(p.nameVi, p.nameEn)}
                                    </h3>
                                    <p className="mt-2 line-clamp-2 min-h-10 text-sm text-[#6d8372]">
                                        {tr(p.contentVi ?? '', p.contentEn ?? '') || '—'}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {p.status === 'ARCHIVED' ? (
                                            <button
                                                className={executiveUi.secondary}
                                                disabled={action.isPending}
                                                onClick={() =>
                                                    action.mutate({ id: p.id, type: 'restore' })
                                                }
                                            >
                                                {tr('Khôi phục về bản nháp', 'Restore to draft')}
                                            </button>
                                        ) : (
                                            <button
                                                className={executiveUi.secondary}
                                                type="button"
                                                onClick={() => edit(p)}
                                            >
                                                {tr('Sửa', 'Edit')}
                                            </button>
                                        )}
                                        {p.status !== 'ARCHIVED' && (
                                            <button
                                                type="button"
                                                className={executiveUi.secondary}
                                                onClick={() => setManaging(p)}
                                            >
                                                <PackageCheck size={15} />
                                                {tr('Sản phẩm áp dụng', 'Assign products')}
                                            </button>
                                        )}
                                        {p.status !== 'ARCHIVED' && (
                                            <button
                                                className={executiveUi.secondary}
                                                disabled={action.isPending}
                                                onClick={() => {
                                                    if (
                                                        p.status !== 'PUBLISHED' &&
                                                        (!p.contentVi ||
                                                            !p.contentEn ||
                                                            !p.imageUrl ||
                                                            Date.parse(p.endsAt) <= Date.now())
                                                    ) {
                                                        setFailed(true);
                                                        setMessage(
                                                            tr(
                                                                'Để xuất bản, hãy thêm ảnh, nhập nội dung tiếng Việt và tiếng Anh, rồi kiểm tra ngày kết thúc còn hiệu lực.',
                                                                'To publish, add an image, enter Vietnamese and English content, and check that the end date is in the future.',
                                                            ),
                                                        );
                                                        return;
                                                    }
                                                    const type =
                                                        p.status === 'PUBLISHED'
                                                            ? 'disable'
                                                            : 'publish';
                                                    void confirm(tr(
                                                                'Xác nhận thay đổi trạng thái chiến dịch?',
                                                                'Change campaign status?',
                                                            ), () => action.mutateAsync({ id: p.id, type }));
                                                }}
                                            >
                                                {p.status === 'PUBLISHED'
                                                    ? tr('Tắt', 'Disable')
                                                    : tr('Xuất bản', 'Publish')}
                                            </button>
                                        )}
                                        {p.status !== 'ARCHIVED' && (
                                            <button
                                                className={executiveUi.secondary}
                                                disabled={action.isPending}
                                                onClick={() => {
                                                    void confirm(tr(
                                                                'Lưu trữ chiến dịch này?',
                                                                'Archive this campaign?',
                                                            ), () => action.mutateAsync({
                                                            id: p.id,
                                                            type: 'archive',
                                                        }), { danger: true });
                                                }}
                                            >
                                                {tr('Lưu trữ', 'Archive')}
                                            </button>
                                        )}
                                        {!p.publishedAt &&
                                            ['DRAFT', 'ARCHIVED'].includes(p.status) && (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        removeCampaign.isPending || action.isPending
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                                                    onClick={() => {
                                                        void confirm(tr(
                                                                    `Bạn có chắc muốn xóa chiến dịch "${p.nameVi}"? Hành động này không thể hoàn tác. Liên kết sản phẩm sẽ được gỡ, giá sale không đổi.`,
                                                                    `Are you sure you want to delete "${p.nameEn}"? This cannot be undone. Product links will be removed; sale prices stay unchanged.`,
                                                                ), () => removeCampaign.mutateAsync(p.id), { danger: true });
                                                    }}
                                                >
                                                    <Trash2 size={15} />
                                                    {tr('Xóa', 'Delete')}
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                {list.data && (
                    <ExecutivePagination
                        page={page}
                        totalPages={list.data.totalPages}
                        onChange={setPage}
                        tr={tr}
                    />
                )}
            </ExecutivePanel>
            {cropUrl && (
                <PromotionImageCropper
                    src={cropUrl}
                    originalName={cropFilename}
                    onCancel={() => setCropUrl('')}
                    onApply={(file) => {
                        setCropUrl('');
                        uploadImage.mutate(file);
                    }}
                />
            )}
            {managing && (
                <PromotionProductManager
                    key={managing.id}
                    campaign={managing}
                    onClose={() => setManaging(null)}
                    onSaved={() => {
                        setFailed(false);
                        setMessage(
                            tr(
                                'Đã lưu sản phẩm áp dụng. Hãy xuất bản lại chiến dịch để kích hoạt.',
                                'Assigned products saved. Publish the campaign again to activate the changes.',
                            ),
                        );
                    }}
                />
            )}
        </div>
    );
}
