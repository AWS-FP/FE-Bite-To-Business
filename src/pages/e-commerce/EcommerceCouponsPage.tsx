import { ExecutiveTableSkeleton } from '@/components/e-commerce/ExecutiveSkeletons';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Save, TicketPercent } from 'lucide-react';
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
import type { CouponWrite } from '@/types/e-commerce/executiveAdmin';
import { formatVnd } from '@/services/e-commerce/executiveReadService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';
import CouponProductPicker from '@/components/e-commerce/CouponProductPicker';

function localInput(iso: string) {
    const d = new Date(iso);
    const z = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
}
export default function EcommerceCouponsPage() {
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const [page, setPage] = useState(0),
        [open, setOpen] = useState(false),
        [editId, setEditId] = useState<string | null>(null),
        [code, setCode] = useState(''),
        [nameVi, setNameVi] = useState(''),
        [nameEn, setNameEn] = useState(''),
        [discountType, setDiscountType] = useState('PERCENTAGE'),
        [discountValue, setDiscountValue] = useState(''),
        [minimum, setMinimum] = useState('0'),
        [maximum, setMaximum] = useState(''),
        [startsAt, setStartsAt] = useState(''),
        [endsAt, setEndsAt] = useState(''),
        [usageLimit, setUsageLimit] = useState(''),
        [perUser, setPerUser] = useState(''),
        [appliesTo, setAppliesTo] = useState('PRODUCT'),
        [scope, setScope] = useState('ALL'),
        [selectedProductIds, setSelectedProductIds] = useState<string[]>([]),
        [active, setActive] = useState(false),
        [feedback, setFeedback] = useState(''),
        [failed, setFailed] = useState(false);
    const list = useQuery({
        queryKey: ['ecom', 'coupons', page],
        queryFn: () => executiveApi.coupons(page, 20),
    });
    function reset() {
        setOpen(false);
        setEditId(null);
        setCode('');
        setNameVi('');
        setNameEn('');
        setDiscountType('PERCENTAGE');
        setDiscountValue('');
        setMinimum('0');
        setMaximum('');
        setStartsAt('');
        setEndsAt('');
        setUsageLimit('');
        setPerUser('');
        setAppliesTo('PRODUCT');
        setScope('ALL');
        setSelectedProductIds([]);
        setActive(false);
    }
    const save = useMutation({
        mutationFn: (payload: CouponWrite) =>
            editId
                ? executiveApi.updateCoupon(editId, payload)
                : executiveApi.createCoupon(payload),
        onSuccess: () => {
            setFeedback(tr('Đã lưu coupon thành công.', 'Coupon saved successfully.'));
            setFailed(false);
            reset();
            void qc.invalidateQueries({ queryKey: ['ecom', 'coupons'] });
        },
        onError: (error) => {
            setFailed(true);
            setFeedback(
                executiveErrorMessage(
                    error,
                    tr('Không lưu được coupon.', 'Could not save coupon.'),
                ),
            );
        },
    });
    const toggle = useMutation({
        mutationFn: ({ id, active }: { id: string; active: boolean }) =>
            executiveApi.setCouponActive(id, active),
        onSuccess: () => void qc.invalidateQueries({ queryKey: ['ecom', 'coupons'] }),
        onError: (error) => {
            setFailed(true);
            setFeedback(
                executiveErrorMessage(
                    error,
                    tr('Không thể đổi trạng thái coupon.', 'Could not change coupon status.'),
                ),
            );
        },
    });
    function startEdit(id: string) {
        void executiveApi
            .coupon(id)
            .then((c) => {
                setEditId(c.id);
                setCode(c.code);
                setNameVi(c.nameVi ?? '');
                setNameEn(c.nameEn ?? '');
                setDiscountType(c.discountType);
                setDiscountValue(String(c.discountValue));
                setMinimum(String(c.minOrderAmount));
                setMaximum(c.maxDiscountAmount == null ? '' : String(c.maxDiscountAmount));
                setStartsAt(localInput(c.startsAt));
                setEndsAt(localInput(c.endsAt));
                setUsageLimit(c.usageLimit == null ? '' : String(c.usageLimit));
                setPerUser(c.usageLimitPerUser == null ? '' : String(c.usageLimitPerUser));
                setAppliesTo(c.appliesTo);
                setScope(c.productScope);
                setSelectedProductIds(c.productIds ?? []);
                setActive(c.isActive);
                setOpen(true);
            })
            .catch(() => {
                setFailed(true);
                setFeedback(tr('Không tải được coupon để sửa.', 'Could not load coupon details.'));
            });
    }
    function submit(event: React.FormEvent) {
        event.preventDefault();
        if (
            !/^[A-Z0-9]{8}$/.test(code) ||
            !startsAt ||
            !endsAt ||
            !Number.isFinite(Date.parse(startsAt)) ||
            !Number.isFinite(Date.parse(endsAt)) ||
            Date.parse(startsAt) >= Date.parse(endsAt)
        ) {
            setFailed(true);
            setFeedback(
                tr(
                    'Mã phải gồm 8 ký tự và thời gian kết thúc sau bắt đầu.',
                    'Use an eight-character code and a valid date range.',
                ),
            );
            return;
        }
        const amount = Number(discountValue);
        if (
            !Number.isFinite(amount) ||
            amount <= 0 ||
            (discountType === 'PERCENTAGE' && amount > 100) ||
            !Number.isFinite(Number(minimum)) ||
            Number(minimum) < 0 ||
            (maximum !== '' && !(Number(maximum) > 0)) ||
            (usageLimit !== '' &&
                (!Number.isInteger(Number(usageLimit)) || Number(usageLimit) <= 0)) ||
            (perUser !== '' && (!Number.isInteger(Number(perUser)) || Number(perUser) <= 0))
        ) {
            setFailed(true);
            setFeedback(
                tr(
                    'Kiểm tra mức giảm, đơn hàng tối thiểu và giới hạn sử dụng.',
                    'Check discount value, minimum order amount and usage limits.',
                ),
            );
            return;
        }
        const productIds =
            appliesTo === 'PRODUCT' && scope === 'SELECTED' ? selectedProductIds : [];
        if (appliesTo === 'PRODUCT' && scope === 'SELECTED' && !productIds.length) {
            setFailed(true);
            setFeedback(
                tr(
                    'Chọn ít nhất một sản phẩm trong bảng.',
                    'Select at least one product from the table.',
                ),
            );
            return;
        }
        const payload: CouponWrite = {
            nameVi: nameVi.trim(),
            nameEn: nameEn.trim(),
            code,
            discountType,
            discountValue: Number(discountValue),
            minOrderAmount: Number(minimum),
            maxDiscountAmount:
                discountType === 'PERCENTAGE' && maximum !== '' ? Number(maximum) : null,
            startsAt: new Date(startsAt).toISOString(),
            endsAt: new Date(endsAt).toISOString(),
            usageLimit: usageLimit === '' ? null : Number(usageLimit),
            usageLimitPerUser: perUser === '' ? null : Number(perUser),
            isActive: active,
            appliesTo,
            productScope: appliesTo === 'SHIPPING' ? 'ALL' : scope,
            productIds: appliesTo === 'SHIPPING' ? [] : productIds,
        };
        save.mutate(payload);
    }
    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="04"
                eyebrow="MARKETING / COUPONS"
                title={tr('Quản lý mã giảm giá', 'Coupon management')}
                description={tr(
                    'Tạo, theo dõi và bật/tắt coupon theo điều kiện thực tế.',
                    'Create and maintain real discount codes and eligibility rules.',
                )}
                action={
                    <button
                        type="button"
                        className={executiveUi.button}
                        onClick={() => {
                            reset();
                            setOpen(true);
                        }}
                    >
                        <Plus size={17} />
                        {tr('Tạo coupon', 'New coupon')}
                    </button>
                }
            />
            <ExecutiveFeedback message={feedback} error={failed} />
            {open && (
                <ExecutivePanel
                    title={
                        editId
                            ? tr('Chỉnh sửa coupon', 'Edit coupon')
                            : tr('Coupon mới', 'Create coupon')
                    }
                >
                    <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
                        <label className="text-xs font-bold">{tr('Tên coupon tiếng Việt', 'Vietnamese coupon name')}
                            <input className={executiveUi.input} value={nameVi} maxLength={160} onChange={e => setNameVi(e.target.value)} />
                        </label>
                        <label className="text-xs font-bold">{tr('Tên coupon tiếng Anh', 'English coupon name')}
                            <input className={executiveUi.input} value={nameEn} maxLength={160} onChange={e => setNameEn(e.target.value)} />
                        </label>
                        <label className="text-xs font-bold">
                            {tr('Mã coupon (8 ký tự)', 'Coupon code (8 characters)')}
                            <input
                                className={`${executiveUi.input} mt-2 font-mono uppercase`}
                                value={code}
                                maxLength={8}
                                required
                                pattern="[A-Z0-9]{8}"
                                onChange={(e) =>
                                    setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))
                                }
                                placeholder="BTBSALE1"
                            />
                        </label>
                        <div className="rounded-2xl border border-[#dbe7d8] bg-[#f6faf5] p-4 sm:col-span-2">
                            <h3 className="mb-3 text-sm font-extrabold text-[#173e2e]">
                                {tr('Thiết lập mức giảm', 'Discount configuration')}
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <ExecutiveSelect
                                    label={tr('Hình thức giảm', 'Discount type')}
                                    value={discountType}
                                    onValueChange={(value) => {
                                        setDiscountType(value);
                                        if (value === 'FIXED_AMOUNT') setMaximum('');
                                    }}
                                >
                                    <option value="PERCENTAGE">
                                        {tr('Phần trăm (%)', 'Percentage (%)')}
                                    </option>
                                    <option value="FIXED_AMOUNT">
                                        {tr('Số tiền cố định (VND)', 'Fixed amount (VND)')}
                                    </option>
                                </ExecutiveSelect>
                                <label className="text-xs font-bold">
                                    {discountType === 'PERCENTAGE'
                                        ? tr('Mức giảm (%)', 'Discount (%)')
                                        : tr('Số tiền giảm (VND)', 'Discount amount (VND)')}
                                    <div className="relative mt-2">
                                        <input
                                            className={`${executiveUi.input} !pr-12`}
                                            required
                                            type="number"
                                            min="0.01"
                                            max={discountType === 'PERCENTAGE' ? 100 : undefined}
                                            step={discountType === 'PERCENTAGE' ? 'any' : '1'}
                                            value={discountValue}
                                            onChange={(e) => setDiscountValue(e.target.value)}
                                        />
                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-extrabold text-[#397052]">
                                            {discountType === 'PERCENTAGE' ? '%' : 'đ'}
                                        </span>
                                    </div>
                                </label>
                            </div>
                            {discountType === 'PERCENTAGE' && (
                                <div className="mt-4 max-w-[420px]">
                                    <label
                                        className="text-xs font-bold"
                                        htmlFor="coupon-max-discount"
                                    >
                                        {tr(
                                            'Trần giảm tối đa (VND, không bắt buộc)',
                                            'Maximum discount cap (VND, optional)',
                                        )}
                                    </label>
                                    <input
                                        id="coupon-max-discount"
                                        className={`${executiveUi.input} mt-2`}
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder={tr('Ví dụ 50000', 'e.g. 50000')}
                                        value={maximum}
                                        onChange={(e) => setMaximum(e.target.value)}
                                    />
                                    <p className="mt-2 text-xs leading-5 text-[#617a68]">
                                        {tr(
                                            'Ví dụ: giảm 10%, trần 50.000đ — đơn 1.000.000đ chỉ giảm tối đa 50.000đ. Để trống nếu không đặt trần.',
                                            'Example: 10% off capped at 50,000 VND gives at most 50,000 VND off a 1,000,000 VND order. Leave blank for no cap.',
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                        <label className="text-xs font-bold">
                            {tr('Đơn hàng tối thiểu', 'Minimum order')}
                            <input
                                className={`${executiveUi.input} mt-2`}
                                type="number"
                                min="0"
                                value={minimum}
                                onChange={(e) => setMinimum(e.target.value)}
                            />
                        </label>
                        <ExecutiveSelect
                            label={tr('Áp dụng cho', 'Applies to')}
                            value={appliesTo}
                            onValueChange={setAppliesTo}
                        >
                            <option value="PRODUCT">{tr('Sản phẩm', 'Products')}</option>
                            <option value="SHIPPING">{tr('Phí vận chuyển', 'Shipping')}</option>
                        </ExecutiveSelect>
                        {appliesTo === 'PRODUCT' && (
                            <ExecutiveSelect
                                label={tr('Phạm vi sản phẩm', 'Product scope')}
                                value={scope}
                                onValueChange={setScope}
                            >
                                <option value="ALL">
                                    {tr('Tất cả sản phẩm', 'All published products')}
                                </option>
                                <option value="SELECTED">
                                    {tr('Sản phẩm chỉ định', 'Selected products')}
                                </option>
                            </ExecutiveSelect>
                        )}
                        {appliesTo === 'PRODUCT' && scope === 'SELECTED' && (
                            <CouponProductPicker
                                selectedIds={selectedProductIds}
                                onChange={setSelectedProductIds}
                                disabled={save.isPending}
                            />
                        )}
                        <label className="text-xs font-bold">
                            {tr('Bắt đầu', 'Start date')}
                            <input
                                className={`${executiveUi.input} mt-2`}
                                type="datetime-local"
                                required
                                value={startsAt}
                                onChange={(e) => setStartsAt(e.target.value)}
                            />
                        </label>
                        <label className="text-xs font-bold">
                            {tr('Kết thúc', 'End date')}
                            <input
                                className={`${executiveUi.input} mt-2`}
                                type="datetime-local"
                                required
                                min={startsAt}
                                value={endsAt}
                                onChange={(e) => setEndsAt(e.target.value)}
                            />
                        </label>
                        <label className="text-xs font-bold">
                            {tr('Giới hạn sử dụng', 'Total usage limit')}
                            <input
                                className={`${executiveUi.input} mt-2`}
                                type="number"
                                min="1"
                                value={usageLimit}
                                onChange={(e) => setUsageLimit(e.target.value)}
                            />
                        </label>
                        <label className="text-xs font-bold">
                            {tr('Mỗi khách sử dụng tối đa', 'Per-user limit')}
                            <input
                                className={`${executiveUi.input} mt-2`}
                                type="number"
                                min="1"
                                value={perUser}
                                onChange={(e) => setPerUser(e.target.value)}
                            />
                        </label>
                        <div className="flex flex-wrap items-center gap-3 pt-3 sm:col-span-2">
                            <button
                                type="submit"
                                disabled={save.isPending}
                                className={executiveUi.button}
                            >
                                <Save size={16} />
                                {tr('Lưu coupon', 'Save coupon')}
                            </button>
                            <button type="button" className={executiveUi.secondary} onClick={reset}>
                                {tr('Hủy', 'Cancel')}
                            </button>
                            <span className="text-xs text-[#6b8172]">
                                {tr(
                                    'Coupon mới được lưu ở trạng thái tắt để kiểm tra trước khi phát hành.',
                                    'New coupons are saved inactive until reviewed.',
                                )}
                            </span>
                        </div>
                    </form>
                </ExecutivePanel>
            )}
            <ExecutivePanel
                title={tr('Danh sách coupon', 'Coupon inventory')}
                caption={list.data ? `${list.data.total} coupon` : ''}
            >
                {list.isLoading ? (
                    <ExecutiveTableSkeleton cells={["text", "text", "text", "double", "text", "badge", "actions"]} count={5} tableClass="w-full min-w-[940px] text-left text-sm" cellClass={executiveUi.td} />
                ) : list.isError ? (
                    <div className="p-5">
                        <ExecutiveError
                            message={tr('Không tải được coupon.', 'Could not load coupons.')}
                            retry={() => void list.refetch()}
                        />
                    </div>
                ) : !list.data?.items.length ? (
                    <ExecutiveEmpty
                        icon={<TicketPercent />}
                        title={tr('Chưa có coupon', 'No coupons yet')}
                        description={tr('Tạo coupon mới để bắt đầu.', 'Create your first coupon.')}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[940px] text-left text-sm">
                            <thead>
                                <tr>
                                    {[
                                        tr('Mã', 'Code'),
                                        tr('Giảm giá', 'Discount'),
                                        tr('Phạm vi', 'Applies to'),
                                        tr('Thời gian', 'Validity'),
                                        tr('Đã dùng', 'Used'),
                                        tr('Trạng thái', 'Status'),
                                        '',
                                    ].map((h) => (
                                        <th key={h} className={executiveUi.th}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {list.data.items.map((c) => (
                                    <tr key={c.id}>
                                        <td className={`${executiveUi.td} font-mono font-bold`}>
                                            {c.code}
                                        </td>
                                        <td className={executiveUi.td}>
                                            {c.discountType === 'PERCENTAGE'
                                                ? `${c.discountValue}%`
                                                : formatVnd(c.discountValue)}
                                        </td>
                                        <td className={executiveUi.td}>{c.appliesTo}</td>
                                        <td className={executiveUi.td}>
                                            <span className="block text-xs">
                                                {new Date(c.startsAt).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span className="block text-xs text-[#788b7d]">
                                                → {new Date(c.endsAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </td>
                                        <td className={executiveUi.td}>
                                            {c.usedCount ?? 0}
                                            {c.usageLimit != null ? `/${c.usageLimit}` : ''}
                                        </td>
                                        <td className={executiveUi.td}>
                                            <ExecutiveBadge
                                                status={c.isActive ? 'PUBLISHED' : 'DRAFT'}
                                            />
                                        </td>
                                        <td className={executiveUi.td}>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className={executiveUi.secondary}
                                                    onClick={() => startEdit(c.id)}
                                                >
                                                    {tr('Sửa', 'Edit')}
                                                </button>
                                                <button
                                                    type="button"
                                                    className={executiveUi.secondary}
                                                    disabled={toggle.isPending}
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                tr(
                                                                    'Thay đổi trạng thái coupon?',
                                                                    'Change coupon active status?',
                                                                ),
                                                            )
                                                        )
                                                            toggle.mutate({
                                                                id: c.id,
                                                                active: !c.isActive,
                                                            });
                                                    }}
                                                >
                                                    {c.isActive
                                                        ? tr('Tắt', 'Disable')
                                                        : tr('Bật', 'Enable')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
        </div>
    );
}
