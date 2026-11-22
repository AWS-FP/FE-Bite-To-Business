import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    CalendarDays,
    Image as ImageIcon,
    Megaphone,
    Plus,
    Save,
    PackageCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import { executiveUi, useExecutiveText } from '@/components/e-commerce/executiveTokens';
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
    LoadingRows,
} from '@/components/e-commerce/ExecutiveUI';
import {
    executiveApi,
    type Promotion,
    type PromotionWrite,
} from '@/services/e-commerce/executiveAdminService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';
import PromotionProductManager from '@/components/e-commerce/PromotionProductManager';

function localValue(iso: string) {
    const d = new Date(iso);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
export default function EcommercePromotionsPage() {
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const [status, setStatus] = useState(''),
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
        [failed, setFailed] = useState(false);
    const list = useQuery({
        queryKey: ['ecom', 'promotions', status, page],
        queryFn: () => executiveApi.promotions(status || undefined, page, 20),
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
    }
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
        <div className="space-y-6">
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
                        <label className="text-xs font-bold md:col-span-2">
                            {tr('Loại chiến dịch', 'Campaign type')}
                            <select
                                className={`${executiveUi.input} mt-2`}
                                value={promotionType}
                                onChange={(e) =>
                                    setPromotionType(e.target.value as 'STANDARD' | 'FLASH_SALE')
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
                            </select>
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
                        </label>
                        <label className="text-xs font-bold">
                            {tr('Tên tiếng Việt', 'Vietnamese title')}
                            <input
                                className={`${executiveUi.input} mt-2`}
                                maxLength={200}
                                required
                                value={vi}
                                onChange={(e) => setVi(e.target.value)}
                            />
                        </label>
                        <label className="text-xs font-bold">
                            {tr('Tên tiếng Anh', 'English title')}
                            <input
                                className={`${executiveUi.input} mt-2`}
                                maxLength={200}
                                required
                                value={en}
                                onChange={(e) => setEn(e.target.value)}
                            />
                        </label>
                        <label className="text-xs font-bold">
                            {tr('Nội dung tiếng Việt', 'Vietnamese description')}
                            <textarea
                                rows={3}
                                className={`${executiveUi.input} mt-2 !h-auto py-3`}
                                value={contentVi}
                                onChange={(e) => setContentVi(e.target.value)}
                            />
                        </label>
                        <label className="text-xs font-bold">
                            {tr('Nội dung tiếng Anh', 'English description')}
                            <textarea
                                rows={3}
                                className={`${executiveUi.input} mt-2 !h-auto py-3`}
                                value={contentEn}
                                onChange={(e) => setContentEn(e.target.value)}
                            />
                        </label>
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
                            <Link
                                to={ROUTES.ECOMMERCE_POSTER}
                                className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[#24734c]"
                            >
                                <ImageIcon size={15} />
                                {tr(
                                    'Tải ảnh tại mục Ảnh khuyến mãi',
                                    'Upload images in Promotion images',
                                )}
                            </Link>
                        </div>
                        <div className="flex gap-3 md:col-span-2">
                            <button disabled={save.isPending} className={executiveUi.button}>
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
                <div className="max-w-[240px] p-5">
                    <ExecutiveSelect
                        ariaLabel={tr('Trạng thái', 'Status')}
                        value={status}
                        onValueChange={(value) => {
                            setStatus(value);
                            setPage(0);
                        }}
                    >
                        <option value="">{tr('Tất cả', 'All statuses')}</option>
                        {['DRAFT', 'PUBLISHED', 'DISABLED', 'ARCHIVED'].map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </ExecutiveSelect>
                </div>
                {list.isLoading ? (
                    <LoadingRows />
                ) : list.isError ? (
                    <div className="p-5">
                        <ExecutiveError
                            message={tr('Không lấy được chiến dịch.', 'Could not load campaigns.')}
                            retry={() => void list.refetch()}
                        />
                    </div>
                ) : !list.data?.items.length ? (
                    <ExecutiveEmpty
                        icon={<Megaphone />}
                        title={tr('Chưa có chiến dịch', 'No campaigns')}
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
                                            className="h-44 w-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon size={35} className="text-[#8ea896]" />
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <ExecutiveBadge status={p.status} />
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
                                                    if (
                                                        window.confirm(
                                                            tr(
                                                                'Xác nhận thay đổi trạng thái chiến dịch?',
                                                                'Change campaign status?',
                                                            ),
                                                        )
                                                    )
                                                        action.mutate({ id: p.id, type });
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
                                                    if (
                                                        window.confirm(
                                                            tr(
                                                                'Lưu trữ chiến dịch này?',
                                                                'Archive this campaign?',
                                                            ),
                                                        )
                                                    )
                                                        action.mutate({
                                                            id: p.id,
                                                            type: 'archive',
                                                        });
                                                }}
                                            >
                                                {tr('Lưu trữ', 'Archive')}
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
