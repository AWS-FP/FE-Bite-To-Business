import { useEffect, useRef, useState, type FormEvent } from 'react';
import PromotionImageCropper from '@/components/e-commerce/PromotionImageCropper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Boxes, ImagePlus, Plus, Save, Languages } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import {
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
import ComboIngredientPicker, {
    type SelectedIngredient,
} from '@/components/e-commerce/ComboIngredientPicker';
import { executiveComboApi } from '@/services/e-commerce/executiveComboService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';
import type { ComboStatus, ComboWrite, ExecutiveCombo } from '@/types/e-commerce/executiveCombo';
import Skeleton from '@/components/common/Skeleton';
import { formatCurrencyVnd } from '@/constants/customer/homeData';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import type { TranslationField } from '@/types/logistic/translation';
import { suggestTranslation } from '@/services/logistic/translationService';
import { invalidatePublicCatalog } from '@/hooks/customer/useCatalogQuery';

const emptyForm = {
    nameVi: '',
    nameEn: '',
    descriptionVi: '',
    descriptionEn: '',
    categoryId: '',
    servingCount: '',
    listPrice: '',
    vatRate: '',
    imageUrl: '',
    cloudinaryPublicId: '',
    netWeightKg: '',
    tareWeightKg: '',
    volumeM3: '',
    lengthCm: '',
    widthCm: '',
    heightCm: '',
    technicalContentVi: '',
    technicalContentEn: '',
    kitchenStorageContentVi: '',
    kitchenStorageContentEn: '',
    originContentVi: '',
    originContentEn: '',
};
function ComboTranslation({
    source,
    field,
    disabled,
    onAccept,
}: {
    source: string;
    field: TranslationField;
    disabled: boolean;
    onAccept: (text: string) => void;
}) {
    const tr = useExecutiveText();
    const text = source.trim();
    const limit = field === 'NAME' ? 200 : 2000;
    const translation = useMutation({
        mutationFn: (value: string) => suggestTranslation(value, 'vi', field, undefined, 55_000),
    });
    const failure = axios.isAxiosError(translation.error) ? translation.error : null;
    const errorStatus = failure?.response?.status;
    const errorText = failure?.code === 'ECONNABORTED' || failure?.code === 'ETIMEDOUT'
        ? tr('Dịch thuật quá thời gian chờ. Vui lòng thử lại.', 'Translation timed out. Please retry.')
        : errorStatus === 401 || errorStatus === 403
          ? tr('Phiên đăng nhập hoặc quyền dịch thuật không hợp lệ.', 'Translation session or permissions are invalid.')
          : errorStatus === 429
            ? tr('Đã vượt giới hạn yêu cầu dịch. Vui lòng thử lại sau.', 'Translation request limit reached. Retry later.')
            : errorStatus === 503
              ? tr('Dịch vụ dịch thuật tạm thời không khả dụng.', 'Translation service is temporarily unavailable.')
              : tr('Chưa lấy được gợi ý dịch. Vui lòng thử lại hoặc nhập thủ công.', 'Unable to get a translation. Retry or enter it manually.');
    const current = translation.variables === text;
    const suggestion = current ? translation.data?.trim() : undefined;
    return (
        <div className="mt-2 space-y-2">
            <button
                type="button"
                className={executiveUi.secondary}
                disabled={disabled || translation.isPending || !text || text.length > 2000}
                onClick={() => translation.mutate(text)}
            >
                <Languages size={15} aria-hidden="true" />
                {translation.isPending
                    ? tr('Đang dịch…', 'Translating…')
                    : tr('Gợi ý dịch sang Anh', 'Suggest English translation')}
            </button>
            {text.length > 2000 && (
                <p className="m-0 text-xs text-store-muted">
                    {tr(
                        'Dịch tự động hỗ trợ tối đa 2.000 ký tự. Có thể nhập bản dịch thủ công.',
                        'Translation supports up to 2,000 characters. You can enter the translation manually.',
                    )}
                </p>
            )}
            {current && translation.isError && (
                <p role="alert" className="m-0 text-xs text-red-700">
                    {errorText}
                </p>
            )}
            {suggestion && (
                <div className="space-y-2 rounded-xl border border-store-green/20 bg-[#f0f5f1] p-3 text-sm">
                    <p className="m-0 whitespace-pre-wrap break-words font-normal">{suggestion}</p>
                    {suggestion.length > limit ? (
                        <p className="m-0 text-xs text-red-700">
                            {tr(
                                'Bản dịch quá dài, vui lòng rút gọn thủ công.',
                                'Translation is too long. Please shorten it manually.',
                            )}
                        </p>
                    ) : (
                        <button
                            type="button"
                            disabled={disabled}
                            className={executiveUi.secondary}
                            onClick={() => {
                                onAccept(suggestion);
                                translation.reset();
                            }}
                        >
                            {tr('Dùng gợi ý', 'Use suggestion')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function EcommerceCombosPage() {
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [items, setItems] = useState<SelectedIngredient[]>([]);
    const [feedback, setFeedback] = useState({ message: '', error: false });
    const editor = useRef<HTMLDivElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const [cropSource, setCropSource] = useState<{ url: string; name: string } | null>(null);
    const cropUrl = cropSource?.url;
    useEffect(() => {
        if (!cropUrl) return;
        return () => URL.revokeObjectURL(cropUrl);
    }, [cropUrl]);
    const list = useQuery({
        queryKey: ['ecom', 'combos', page],
        queryFn: ({ signal }) => executiveComboApi.list(page, signal),
    });
    const categories = useQuery({
        queryKey: ['ecom', 'combo-categories'],
        queryFn: ({ signal }) => executiveComboApi.categories(signal),
        enabled: open,
    });
    const update = (key: keyof typeof emptyForm, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));
    function message(text: string, error = false) {
        setFeedback({ message: text, error });
    }
    function showEditor() {
        setOpen(true);
        window.requestAnimationFrame(() =>
            editor.current?.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                block: 'start',
            }),
        );
    }
    function reset() {
        setEditId(null);
        setForm({ ...emptyForm });
        setItems([]);
        message('');
    }
    function refresh() {
        void qc.invalidateQueries({ queryKey: ['ecom', 'combos'] });
        void qc.invalidateQueries({ queryKey: ['ecom', 'products'] });
        void invalidatePublicCatalog();
    }
    const details = useMutation({
        mutationFn: executiveComboApi.detail,
        onSuccess: (combo) => {
            if (combo.status !== 'DRAFT') {
                message(
                    tr(
                        'Hãy chuyển combo về bản nháp trước khi sửa.',
                        'Move the combo to draft before editing.',
                    ),
                    true,
                );
                return;
            }
            setEditId(combo.id);
            setForm({
                nameVi: combo.nameVi,
                nameEn: combo.nameEn,
                descriptionVi: combo.descriptionVi ?? '',
                descriptionEn: combo.descriptionEn ?? '',
                categoryId: combo.categoryId,
                servingCount: combo.servingCount == null ? '' : String(combo.servingCount),
                listPrice: combo.listPrice == null ? '' : String(combo.listPrice),
                vatRate: combo.vatRate == null ? '' : String(combo.vatRate),
                imageUrl: combo.imageUrl ?? '',
                cloudinaryPublicId: combo.cloudinaryPublicId ?? '',
                netWeightKg: combo.details?.netWeightKg == null ? '' : String(combo.details.netWeightKg),
                tareWeightKg: combo.details?.tareWeightKg == null ? '' : String(combo.details.tareWeightKg),
                volumeM3: combo.details?.volumeM3 == null ? '' : String(combo.details.volumeM3),
                lengthCm: combo.details?.lengthCm == null ? '' : String(combo.details.lengthCm),
                widthCm: combo.details?.widthCm == null ? '' : String(combo.details.widthCm),
                heightCm: combo.details?.heightCm == null ? '' : String(combo.details.heightCm),
                technicalContentVi: combo.details?.technicalContentVi == null ? '' : String(combo.details.technicalContentVi),
                technicalContentEn: combo.details?.technicalContentEn == null ? '' : String(combo.details.technicalContentEn),
                kitchenStorageContentVi: combo.details?.kitchenStorageContentVi == null ? '' : String(combo.details.kitchenStorageContentVi),
                kitchenStorageContentEn: combo.details?.kitchenStorageContentEn == null ? '' : String(combo.details.kitchenStorageContentEn),
                originContentVi: combo.details?.originContentVi == null ? '' : String(combo.details.originContentVi),
                originContentEn: combo.details?.originContentEn == null ? '' : String(combo.details.originContentEn),
            });
            setItems(
                (combo.items ?? []).map((item) => ({
                    ...item,
                    id: item.productId,
                    quantity: String(item.quantity),
                })),
            );
            message('');
            showEditor();
        },
        onError: (error) =>
            message(
                executiveErrorMessage(error, tr('Không tải được combo.', 'Unable to load combo.')),
                true,
            ),
    });
    const upload = useMutation({
        mutationFn: executiveComboApi.upload,
        onSuccess: (result) => {
            setForm((prev) => ({
                ...prev,
                imageUrl: result.imageUrl,
                cloudinaryPublicId: result.publicId,
            }));
            message(
                tr(
                    'Đã tải ảnh. Lưu combo để áp dụng.',
                    'Image uploaded. Save the combo to apply it.',
                ),
            );
        },
        onError: (error) =>
            message(
                executiveErrorMessage(error, tr('Không tải được ảnh.', 'Unable to upload image.')),
                true,
            ),
    });
    const save = useMutation({
        mutationFn: (payload: ComboWrite) => executiveComboApi.save(editId, payload),
        onSuccess: () => {
            setOpen(false);
            reset();
            message(tr('Đã lưu bản nháp combo.', 'Combo draft saved.'));
            setPage(0);
            refresh();
        },
        onError: (error) =>
            message(
                executiveErrorMessage(
                    error,
                    tr(
                        'Không lưu được combo. Kiểm tra danh mục, giá, VAT và số lượng.',
                        'Unable to save. Check category, price, VAT and quantities.',
                    ),
                ),
                true,
            ),
    });
    const status = useMutation({
        mutationFn: ({ id, status }: { id: string; status: ComboStatus }) =>
            executiveComboApi.status(id, status),
        onSuccess: () => {
            setOpen(false);
            reset();
            message(tr('Đã cập nhật trạng thái combo.', 'Combo status updated.'));
            refresh();
        },
        onError: (error) =>
            message(
                executiveErrorMessage(
                    error,
                    tr(
                        'Không đổi được trạng thái. Kiểm tra ảnh, giá, VAT và thành phần còn đăng bán.',
                        'Unable to change status. Check image, price, VAT and published ingredients.',
                    ),
                ),
                true,
            ),
    });
    const separatePrice =
        items.length > 0 &&
        items.every(
            (item) =>
                item.listPrice != null &&
                Number.isFinite(item.listPrice) &&
                item.quantity.trim() &&
                Number.isFinite(Number(item.quantity)) &&
                Number(item.quantity) > 0,
        )
            ? items.reduce(
                  (total, item) => total + (item.listPrice ?? 0) * Number(item.quantity),
                  0,
              )
            : null;
    const enteredPrice =
        form.listPrice.trim() &&
        Number.isFinite(Number(form.listPrice)) &&
        Number(form.listPrice) > 0
            ? Number(form.listPrice)
            : null;
    const savings =
        separatePrice != null && enteredPrice != null ? separatePrice - enteredPrice : null;
    const busy = upload.isPending || save.isPending || status.isPending || details.isPending;
    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (busy) return;
        const valid =
            items.length > 0 &&
            items.every((item) => {
                const q = Number(item.quantity);
                return (
                    item.status === 'PUBLISHED' &&
                    Number.isFinite(q) &&
                    q > 0 &&
                    q <= 999999999 &&
                    item.quantityStep > 0 &&
                    Math.abs(q / item.quantityStep - Math.round(q / item.quantityStep)) < 1e-7
                );
            });
        if (
            !valid ||
            !form.categoryId ||
            !form.vatRate.trim() ||
            !form.listPrice.trim() ||
            !form.nameVi.trim() ||
            !form.nameEn.trim()
        ) {
            message(
                tr(
                    'Kiểm tra thông tin và số lượng thành phần.',
                    'Check combo details and ingredient quantities.',
                ),
                true,
            );
            return;
        }
        save.mutate({
            nameVi: form.nameVi.trim(),
            nameEn: form.nameEn.trim(),
            descriptionVi: form.descriptionVi,
            descriptionEn: form.descriptionEn,
            categoryId: form.categoryId,
            servingCount: form.servingCount ? Number(form.servingCount) : null,
            listPrice: Number(form.listPrice),
            vatRate: Number(form.vatRate),
            imageUrl: form.imageUrl || null,
            cloudinaryPublicId: form.cloudinaryPublicId || null,
            details: {
                netWeightKg: form.netWeightKg.trim() === '' ? null : Number(form.netWeightKg),
                tareWeightKg: form.tareWeightKg.trim() === '' ? null : Number(form.tareWeightKg),
                volumeM3: form.volumeM3.trim() === '' ? null : Number(form.volumeM3),
                lengthCm: form.lengthCm.trim() === '' ? null : Number(form.lengthCm),
                widthCm: form.widthCm.trim() === '' ? null : Number(form.widthCm),
                heightCm: form.heightCm.trim() === '' ? null : Number(form.heightCm),
                technicalContentVi: form.technicalContentVi.trim() || null,
                technicalContentEn: form.technicalContentEn.trim() || null,
                kitchenStorageContentVi: form.kitchenStorageContentVi.trim() || null,
                kitchenStorageContentEn: form.kitchenStorageContentEn.trim() || null,
                originContentVi: form.originContentVi.trim() || null,
                originContentEn: form.originContentEn.trim() || null,
            },
            items: items.map((item) => ({ productId: item.id, quantity: Number(item.quantity) })),
        });
    }
    function chooseImage(file?: File) {
        if (!file) return;
        if (
            !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
            file.size > 5 * 1024 * 1024
        ) {
            message(
                tr(
                    'Chọn ảnh JPG, PNG hoặc WebP tối đa 5 MB.',
                    'Choose JPG, PNG or WebP up to 5 MB.',
                ),
                true,
            );
            return;
        }
        setCropSource({ url: URL.createObjectURL(file), name: file.name });
    }
    function changeStatus(combo: ExecutiveCombo, next: ComboStatus) {
        if (open) return;
        if (
            window.confirm(
                next === 'PUBLISHED'
                    ? tr(
                          'Hiển thị combo trên catalog và trang chủ?',
                          'Publish this combo to catalog and homepage?',
                      )
                    : tr('Xác nhận thay đổi trạng thái?', 'Confirm status change?'),
            )
        )
            status.mutate({ id: combo.id, status: next });
    }
    const statusLabel = (value: ComboStatus) =>
        value === 'PUBLISHED'
            ? tr('Đang hiển thị', 'Published')
            : value === 'ARCHIVED'
              ? tr('Lưu trữ', 'Archived')
              : tr('Bản nháp', 'Draft');
    return (
        <div className="min-w-0 space-y-6">
            {cropSource && (
                <PromotionImageCropper key={cropSource.url} kind="combo" src={cropSource.url} originalName={cropSource.name}
                    onCancel={() => setCropSource(null)} onApply={(file) => { setCropSource(null); upload.mutate(file); }} />
            )}
            <ExecutiveHeading
                number="09"
                eyebrow="CATALOG / COMBOS"
                title={tr('Combo sản phẩm', 'Product combos')}
                description={tr(
                    'Tạo bộ nguyên liệu, chọn thành phần và quản lý hiển thị trên trang chủ.',
                    'Build ingredient bundles, select components and manage homepage visibility.',
                )}
                action={
                    <button
                        type="button"
                        disabled={busy || open}
                        className={executiveUi.button}
                        onClick={() => {
                            reset();
                            showEditor();
                        }}
                    >
                        <Plus size={16} />
                        {tr('Tạo combo', 'New combo')}
                    </button>
                }
            />
            {!open && <ExecutiveFeedback message={feedback.message} error={feedback.error} />}
            {open && (
                <div ref={editor} className="scroll-mt-6">
                    <ExecutivePanel
                        title={
                            editId
                                ? tr('Sửa combo', 'Edit combo')
                                : tr('Tạo combo mới', 'Create combo')
                        }
                        caption={tr(
                            'Lưu bản nháp, sau đó xuất bản khi đã kiểm tra đầy đủ.',
                            'Save a draft, then publish after reviewing its details.',
                        )}
                    >
                        <form onSubmit={submit} className="space-y-5 p-5">
                            <fieldset disabled={busy} className="min-w-0 space-y-5 border-0 p-0">
                                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                                    {(['nameVi', 'nameEn'] as const).map((key) => (
                                        <div key={key} className="min-w-0">
                                            <label className="block text-xs font-bold">
                                                {key === 'nameVi'
                                                    ? tr('Tên tiếng Việt', 'Vietnamese name')
                                                    : tr('Tên tiếng Anh', 'English name')}
                                                <input
                                                    required
                                                    maxLength={200}
                                                    value={form[key]}
                                                    onChange={(e) => update(key, e.target.value)}
                                                    className={`${executiveUi.input} mt-2`}
                                                />
                                            </label>
                                            {key === 'nameEn' && (
                                                <ComboTranslation
                                                    source={form.nameVi}
                                                    field="NAME"
                                                    disabled={busy}
                                                    onAccept={(text) => update('nameEn', text)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <ExecutiveSelect
                                        label={tr('Danh mục', 'Category')}
                                        value={form.categoryId}
                                        onValueChange={(value) => update('categoryId', value)}
                                        disabled={
                                            busy || categories.isPending || categories.isError
                                        }
                                        searchable
                                        searchPlaceholder={tr('Tìm danh mục', 'Search categories')}
                                        emptyMessage={tr('Không có danh mục', 'No categories')}
                                    >
                                        <option value="">
                                            {tr('Chọn danh mục', 'Choose category')}
                                        </option>
                                        {categories.data?.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {tr(c.nameVi, c.nameEn)}
                                            </option>
                                        ))}
                                    </ExecutiveSelect>
                                    {categories.isError && (
                                        <ExecutiveError
                                            message={tr(
                                                'Không tải được danh mục.',
                                                'Unable to load categories.',
                                            )}
                                            retry={() => void categories.refetch()}
                                        />
                                    )}
                                    <label className="text-xs font-bold">
                                        {tr('Giá combo (VND)', 'Combo price (VND)')}
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            max={99999999999999}
                                            step={1}
                                            value={form.listPrice}
                                            onChange={(e) => update('listPrice', e.target.value)}
                                            className={`${executiveUi.input} mt-2`}
                                        />
                                    </label>
                                    <label className="text-xs font-bold">
                                        VAT (%)
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            max={100}
                                            step={0.01}
                                            value={form.vatRate}
                                            onChange={(e) => update('vatRate', e.target.value)}
                                            className={`${executiveUi.input} mt-2`}
                                        />
                                    </label>
                                    <label className="text-xs font-bold">
                                        {tr('Số suất (không bắt buộc)', 'Servings (optional)')}
                                        <input
                                            type="number"
                                            min={1}
                                            max={2147483647}
                                            step={1}
                                            value={form.servingCount}
                                            onChange={(e) => update('servingCount', e.target.value)}
                                            className={`${executiveUi.input} mt-2`}
                                        />
                                    </label>
                                    <div className="text-xs text-store-muted md:col-span-2">
                                        {tr(
                                            'Đơn vị: COMBO · MOQ: 1 · Bước: 1',
                                            'Unit: COMBO · MOQ: 1 · Step: 1',
                                        )}
                                    </div>
                                    {(['descriptionVi', 'descriptionEn'] as const).map((key) => (
                                        <div key={key} className="min-w-0">
                                            <label className="block text-xs font-bold">
                                                {key === 'descriptionVi'
                                                    ? tr(
                                                          'Mô tả tiếng Việt',
                                                          'Vietnamese description',
                                                      )
                                                    : tr('Mô tả tiếng Anh', 'English description')}
                                                <textarea
                                                    maxLength={5000}
                                                    rows={3}
                                                    value={form[key]}
                                                    onChange={(e) => update(key, e.target.value)}
                                                    className={`${executiveUi.input} mt-2 !h-auto py-3`}
                                                />
                                            </label>
                                            {key === 'descriptionEn' && (
                                                <ComboTranslation
                                                    source={form.descriptionVi}
                                                    field="DESCRIPTION"
                                                    disabled={busy}
                                                    onAccept={(text) =>
                                                        update('descriptionEn', text)
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <section className="space-y-4 rounded-xl border border-store-green/20 p-4">
                                    <h3 className="font-bold text-store-dark">{tr('Thông tin kỹ thuật và nguồn gốc', 'Technical and sourcing details')}</h3>
                                    <p className="text-xs text-store-muted">{tr('Chỉ nhập thông tin đã xác nhận; để trống nếu chưa biết.', 'Enter verified information only; leave unknown values blank.')}</p>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {([
                                            ['netWeightKg', 'Khối lượng tịnh (kg)', 'Net weight (kg)', '0.001', '0.001', '999999999.999'],
                                            ['tareWeightKg', 'Khối lượng bao bì (kg)', 'Packaging weight (kg)', '0', '0.001', '999999999.999'],
                                            ['lengthCm', 'Chiều dài (cm)', 'Length (cm)', '0.01', '0.01', '99999999.99'],
                                            ['widthCm', 'Chiều rộng (cm)', 'Width (cm)', '0.01', '0.01', '99999999.99'],
                                            ['heightCm', 'Chiều cao (cm)', 'Height (cm)', '0.01', '0.01', '99999999.99'],
                                            ['volumeM3', 'Thể tích (m³)', 'Volume (m³)', '0.000001', '0.000001', '999999.999999'],
                                        ] as const).map(([key, vi, en, min, step, max]) => (
                                            <label key={key} className="text-xs font-bold">
                                                {tr(vi, en)}
                                                <input type="number" min={min} max={max} step={step} value={form[key]}
                                                    onChange={(e) => update(key, e.target.value)} className={`${executiveUi.input} mt-2`} />
                                            </label>
                                        ))}
                                    </div>
                                    <div className="grid items-start gap-4 md:grid-cols-2">
                                        {([
                                            ['technicalContentVi', 'technicalContentEn', 'Thông tin kỹ thuật', 'Technical information', 'TECHNICAL'],
                                            ['kitchenStorageContentVi', 'kitchenStorageContentEn', 'Bảo quản và sử dụng', 'Storage and preparation', 'STORAGE'],
                                            ['originContentVi', 'originContentEn', 'Xuất xứ thành phần', 'Ingredient origins', 'ORIGIN_DETAIL'],
                                        ] as const).map(([viKey, enKey, vi, en, field]) => (
                                            <div key={viKey} className="grid min-w-0 items-start gap-4 md:col-span-2 md:grid-cols-2">
                                                <label className="text-xs font-bold">
                                                    {tr(vi, en)} (VI)
                                                    <textarea rows={3} maxLength={2000} value={form[viKey]} onChange={(e) => update(viKey, e.target.value)} className={`${executiveUi.input} mt-2 !h-auto py-3`} />
                                                </label>
                                                <div className="min-w-0">
                                                    <label className="block text-xs font-bold">
                                                        {tr(vi, en)} (EN)
                                                        <textarea rows={3} maxLength={2000} value={form[enKey]} onChange={(e) => update(enKey, e.target.value)} className={`${executiveUi.input} mt-2 !h-auto py-3`} />
                                                    </label>
                                                    <ComboTranslation source={form[viKey]} field={field} disabled={busy} onAccept={(text) => update(enKey, text)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <div className="grid items-start gap-4 rounded-xl border border-[#d9e5dc] p-4 sm:grid-cols-[240px_minmax(0,1fr)]">
                                    <div className="grid aspect-video w-full place-items-center overflow-hidden rounded-xl bg-store-cream">
                                        {form.imageUrl ? (
                                            <img
                                                src={form.imageUrl}
                                                alt=""
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <ImagePlus size={30} className="text-store-sage" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold">
                                            {tr('Ảnh combo', 'Combo image')}
                                        </h3>
                                        <p className="text-xs text-store-muted">
                                            {tr(
                                                'Khuyến nghị 1600 × 900 px (16:9), JPG/PNG/WebP, tối đa 5 MB.',
                                                'Recommended 1600 × 900 px (16:9), JPG/PNG/WebP, max 5 MB.',
                                            )}
                                        </p>
                                        <input
                                            ref={fileInput}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={(e) => {
                                                chooseImage(e.target.files?.[0]);
                                                e.target.value = '';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className={executiveUi.secondary}
                                            disabled={busy}
                                            onClick={() => fileInput.current?.click()}
                                        >
                                            <ImagePlus size={16} />
                                            {tr('Chọn ảnh', 'Choose image')}
                                        </button>
                                        {form.imageUrl && (
                                            <button
                                                type="button"
                                                className={`${executiveUi.secondary} ml-2`}
                                                onClick={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        imageUrl: '',
                                                        cloudinaryPublicId: '',
                                                    }))
                                                }
                                            >
                                                {tr('Bỏ ảnh', 'Remove image')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <ComboIngredientPicker
                                    items={items}
                                    onChange={setItems}
                                    disabled={busy}
                                />
                                <section className="rounded-xl border border-store-green/20 bg-[#f0f5f1] p-4">
                                    <h3 className="m-0 text-sm font-bold text-store-dark">
                                        {tr('So sánh giá', 'Price comparison')}
                                    </h3>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                        <div>
                                            <p className="m-0 text-xs text-store-muted">
                                                {tr(
                                                    'Mua riêng (tham chiếu)',
                                                    'Separate list price',
                                                )}
                                            </p>
                                            <p className="m-0 font-bold tabular-nums">
                                                {separatePrice == null
                                                    ? '—'
                                                    : formatCurrencyVnd(separatePrice)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="m-0 text-xs text-store-muted">
                                                {tr('Giá combo', 'Combo price')}
                                            </p>
                                            <p className="m-0 font-bold tabular-nums">
                                                {enteredPrice == null
                                                    ? '—'
                                                    : formatCurrencyVnd(enteredPrice)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="m-0 text-xs text-store-muted">
                                                {savings != null && savings < 0
                                                    ? tr('Cao hơn', 'Higher by')
                                                    : tr('Tiết kiệm', 'Savings')}
                                            </p>
                                            <p
                                                className={`m-0 font-bold tabular-nums ${savings != null && savings < 0 ? 'text-amber-800' : 'text-store-green'}`}
                                            >
                                                {savings == null
                                                    ? '—'
                                                    : formatCurrencyVnd(Math.abs(savings))}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mb-0 mt-3 text-xs text-store-muted">
                                        {tr(
                                            'Tham chiếu theo tổng giá niêm yết thành phần, chưa gồm VAT, giao hàng, ưu đãi và MOQ mua riêng. Không tự thay đổi giá combo.',
                                            'Reference uses component list prices before VAT, shipping, promotions and standalone MOQ. The combo price is not changed automatically.',
                                        )}
                                    </p>
                                    {savings != null && savings < 0 && (
                                        <p className="mb-0 mt-2 text-xs font-semibold text-amber-800">
                                            {tr(
                                                'Giá combo cao hơn giá tham chiếu mua riêng.',
                                                'Combo price exceeds the separate list price reference.',
                                            )}
                                        </p>
                                    )}
                                    {separatePrice == null && (
                                        <p className="mb-0 mt-2 text-xs text-store-muted">
                                            {tr(
                                                'Chọn thành phần có giá và số lượng hợp lệ để so sánh.',
                                                'Select priced ingredients with valid quantities to compare.',
                                            )}
                                        </p>
                                    )}
                                </section>
                                <div className="rounded-xl bg-[#f2f6f2] p-3 text-xs text-store-muted">
                                    {tr(
                                        'Combo đã xuất bản chỉ hiển thị thông tin. Chưa nhận đơn mua combo.',
                                        'Published combos are available for browsing only; combo ordering is not enabled.',
                                    )}
                                </div>
                                {feedback.message && (
                                    <ExecutiveFeedback
                                        message={feedback.message}
                                        error={feedback.error}
                                    />
                                )}
                                <div className="flex flex-wrap justify-end gap-2">
                                    <button
                                        type="button"
                                        className={executiveUi.secondary}
                                        onClick={() => {
                                            setOpen(false);
                                            reset();
                                        }}
                                    >
                                        {tr('Hủy', 'Cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!items.length || busy}
                                        className={executiveUi.button}
                                    >
                                        <Save size={16} />
                                        {tr('Lưu bản nháp', 'Save draft')}
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </ExecutivePanel>
                </div>
            )}
            <ExecutivePanel title={tr('Danh sách combo', 'Combo list')}>
                {list.isPending ? (
                    <div aria-busy="true" className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 12 }, (_, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-xl border border-[#d9e5dc] bg-white"
                            >
                                <Skeleton className="aspect-video w-full rounded-none" />
                                <div className="space-y-2 p-4">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <div className="h-12 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-6 w-1/3" />
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-10 w-20" />
                                        <Skeleton className="h-10 w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : list.isError ? (
                    <ExecutiveError
                        message={tr('Không tải được danh sách.', 'Unable to load combos.')}
                        retry={() => void list.refetch()}
                    />
                ) : !list.data?.items.length ? (
                    <ExecutiveEmpty
                        title={tr('Chưa có combo', 'No combos')}
                        description={tr('Tạo combo mới để bắt đầu.', 'Create your first combo.')}
                        icon={<Boxes size={26} />}
                    />
                ) : (
                    <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                        {list.data.items.map((combo) => (
                            <article
                                key={combo.id}
                                className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#d9e5dc] bg-white"
                            >
                                <div className="grid aspect-video place-items-center overflow-hidden bg-store-cream">
                                    {combo.imageUrl ? (
                                        <img
                                            src={combo.imageUrl}
                                            alt=""
                                            className="h-full w-full object-contain"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <Boxes size={30} />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col gap-2 p-4">
                                    <span className="self-start rounded-full bg-[#e9f2e9] px-2 py-1 text-xs font-bold text-store-dark">
                                        {statusLabel(combo.status)}
                                    </span>
                                    <h3
                                        className="line-clamp-2 min-h-12 break-words font-bold text-store-dark"
                                        title={tr(combo.nameVi, combo.nameEn)}
                                    >
                                        {tr(combo.nameVi, combo.nameEn)}
                                    </h3>
                                    <p className="break-all text-xs text-store-muted">
                                        {combo.sku} · {combo.itemCount}{' '}
                                        {tr('thành phần', 'ingredients')}
                                    </p>
                                    <strong className="text-store-dark">
                                        {combo.listPrice == null
                                            ? '—'
                                            : formatCurrencyVnd(combo.listPrice)}
                                    </strong>
                                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                                        <Link to={`${ROUTES.ECOMMERCE_PRODUCTS}?q=${encodeURIComponent(combo.sku)}`} className={executiveUi.secondary}>
                                            {tr('Giá sale & giá sỉ', 'Sale price & wholesale tiers')}
                                        </Link>
                                        {combo.status === 'DRAFT' && (
                                            <>
                                                <button
                                                    type="button"
                                                    disabled={busy || open}
                                                    className={executiveUi.secondary}
                                                    onClick={() => details.mutate(combo.id)}
                                                >
                                                    {tr('Sửa', 'Edit')}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={busy || open}
                                                    className={executiveUi.button}
                                                    onClick={() => changeStatus(combo, 'PUBLISHED')}
                                                >
                                                    {tr('Xuất bản', 'Publish')}
                                                </button>
                                            </>
                                        )}
                                        {combo.status !== 'DRAFT' && (
                                            <button
                                                type="button"
                                                disabled={busy || open}
                                                className={executiveUi.secondary}
                                                onClick={() => changeStatus(combo, 'DRAFT')}
                                            >
                                                {tr('Về bản nháp', 'Move to draft')}
                                            </button>
                                        )}
                                        {combo.status !== 'ARCHIVED' && (
                                            <button
                                                type="button"
                                                disabled={busy || open}
                                                className={executiveUi.secondary}
                                                onClick={() => changeStatus(combo, 'ARCHIVED')}
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
        </div>
    );
}
