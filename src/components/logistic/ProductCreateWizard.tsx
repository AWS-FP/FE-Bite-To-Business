import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, ImagePlus, Loader2, PackagePlus, Sparkles } from 'lucide-react';
import {
    suggestTranslation,
    type TranslationField,
    type TranslationLanguage,
} from '@/services/logistic/translationService';
import { getHomeCategories, type HomeCategory } from '@/services/customer/homeService';
import { getCatalogBrands, type CatalogBrand } from '@/services/customer/catalogReadService';
import type { ProductRequest } from '@/hooks/logistic/useLogisticsData';
import { http } from '@/services/axiosClient';
import axios from 'axios';
import PageNav from '@/components/common/PageNav';
import KeyValueTableEditor, { type KeyValueRow } from './KeyValueTableEditor';

const inputClass =
    'mt-2 w-full rounded border border-black/40 bg-white px-3 py-3 text-sm font-normal text-black outline-none focus:border-black focus:ring-0';

// Các cặp ô song ngữ: AI gợi ý bản dịch từ ô đã nhập sang ô còn lại.
const BILINGUAL_FIELDS: [string, TranslationField][] = [
    ['name', 'NAME'],
    ['description', 'DESCRIPTION'],
    ['spec', 'SPEC'],
    ['storage', 'STORAGE'],
    ['compliance', 'COMPLIANCE'],
    ['originDetail', 'ORIGIN_DETAIL'],
];
const bilingual: Record<string, { counterpart: string; lang: TranslationLanguage; field: TranslationField }> =
    Object.fromEntries(
        BILINGUAL_FIELDS.flatMap(([base, field]) => [
            [`${base}Vi`, { counterpart: `${base}En`, lang: 'vi', field }],
            [`${base}En`, { counterpart: `${base}Vi`, lang: 'en', field }],
        ]),
    );

type Suggestion = { status: 'loading' | 'ready' | 'error'; sourceText: string; text?: string; error?: string };

// Trang sản phẩm đọc chuỗi "Thông số: giá trị | ..." và hiển thị lại thành từng dòng của bảng.
function technicalText(rows: KeyValueRow[] | undefined): string | null {
    return (
        (rows ?? [])
            .filter((row) => row.key.trim() && row.value.trim())
            .map((row) => `${row.key.trim()}: ${row.value.trim()}`)
            .join(' | ') || null
    );
}

// Đọc lại chuỗi "Thông số: giá trị | ..." (ví dụ bản dịch AI) thành các dòng của bảng.
function technicalRows(text: string): KeyValueRow[] {
    return text
        .split('|')
        .map((part) => part.trim().match(/^([^:：]+)[:：]\s*(.+)$/u))
        .filter((match): match is RegExpMatchArray => match != null)
        .map((match) => ({ key: match[1].trim(), value: match[2].trim() }));
}

type Props = {
    request?: ProductRequest;
    onClose: () => void;
    onCreated?: (product: { id: string; sku: string }) => void;
};

export default function ProductCreateWizard({ request, onClose, onCreated }: Props) {
    const { tr, english } = useLogisticsText();
    const steps = [tr("Thông tin cơ bản"), tr("Chi tiết sản phẩm"), tr("Giá & bán hàng"), tr("Xem lại")];
    const [step, setStep] = useState(0);
    const [values, setValues] = useState<Record<string, string>>({
        nameVi: request?.productName.replace(/^Yêu cầu quy cách mới:\s*/i, '').trim() || '',
    });
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [brands, setBrands] = useState<CatalogBrand[]>([]);
    const [catalogError, setCatalogError] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [tiers, setTiers] = useState<{ min: string; max: string; price: string }[]>([]);
    // Bảng thông số kỹ thuật (tùy chọn, mỗi thông số một dòng): null = chưa tạo bảng.
    const [technical, setTechnical] = useState<{ vi: KeyValueRow[]; en: KeyValueRow[] } | null>(null);
    // Dịch cả bảng thông số sang ngôn ngữ còn lại bằng AI.
    const [technicalTranslation, setTechnicalTranslation] = useState<{
        target: TranslationLanguage;
        status: 'loading' | 'error';
        error?: string;
    } | null>(null);
    const technicalTranslationRequest = useRef<AbortController | null>(null);
    // Bảng thông tin dinh dưỡng (tùy chọn): null = chưa tạo bảng.
    const [nutrition, setNutrition] = useState<{ basis: string; rows: KeyValueRow[] } | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [created, setCreated] = useState<{ id: string; sku: string } | null>(null);
    const [suggestions, setSuggestions] = useState<Record<string, Suggestion>>({});
    const suggestionRequests = useRef<Record<string, AbortController>>({});

    useEffect(() => {
        const pending = suggestionRequests.current;
        const technicalRequest = technicalTranslationRequest;
        return () => {
            Object.values(pending).forEach((controller) => controller.abort());
            technicalRequest.current?.abort();
        };
    }, []);

    function dropSuggestion(targetKey: string) {
        suggestionRequests.current[targetKey]?.abort();
        delete suggestionRequests.current[targetKey];
        setSuggestions((current) => {
            const next = { ...current };
            delete next[targetKey];
            return next;
        });
    }

    async function requestSuggestion(targetKey: string) {
        const info = bilingual[targetKey];
        const sourceText = values[info.counterpart]?.trim();
        if (!sourceText) return;
        suggestionRequests.current[targetKey]?.abort();
        const controller = new AbortController();
        suggestionRequests.current[targetKey] = controller;
        setSuggestions((current) => ({ ...current, [targetKey]: { status: 'loading', sourceText } }));
        try {
            const text = await suggestTranslation(
                sourceText,
                bilingual[info.counterpart].lang,
                info.field,
                controller.signal,
            );
            if (controller.signal.aborted) return;
            setSuggestions((current) => ({ ...current, [targetKey]: { status: 'ready', sourceText, text } }));
        } catch (err) {
            if (controller.signal.aborted || axios.isCancel(err)) return;
            const status = axios.isAxiosError(err) ? err.response?.status : undefined;
            const message =
                status === 429
                    ? tr("Bạn đã dùng hết lượt gợi ý dịch trong giờ này. Vui lòng thử lại sau.")
                    : status === 403
                      ? tr("Tài khoản không có quyền dùng gợi ý dịch.")
                      : tr("Chưa lấy được gợi ý dịch. Bạn có thể tự nhập hoặc thử lại.");
            setSuggestions((current) => ({ ...current, [targetKey]: { status: 'error', sourceText, error: message } }));
        } finally {
            if (suggestionRequests.current[targetKey] === controller) delete suggestionRequests.current[targetKey];
        }
    }

    // Rời ô nguồn: tự gợi ý khi ô bên kia còn trống và chưa gợi ý cho đúng nội dung này.
    function suggestAfterBlur(key: string) {
        const info = bilingual[key];
        if (!info) return;
        const text = values[key]?.trim();
        const target = info.counterpart;
        if (!text || values[target]?.trim()) return;
        const existing = suggestions[target];
        if (existing && existing.sourceText === text && existing.status !== 'error') return;
        void requestSuggestion(target);
    }

    // Dịch bảng thông số của ngôn ngữ kia sang `target`, rồi thay các dòng của bảng `target`.
    async function translateTechnical(target: TranslationLanguage) {
        if (!technical) return;
        const source: TranslationLanguage = target === 'en' ? 'vi' : 'en';
        const text = technicalText(technical[source]);
        if (!text) return;
        technicalTranslationRequest.current?.abort();
        const controller = new AbortController();
        technicalTranslationRequest.current = controller;
        setTechnicalTranslation({ target, status: 'loading' });
        try {
            const translated = technicalRows(await suggestTranslation(text, source, 'TECHNICAL', controller.signal));
            if (controller.signal.aborted) return;
            if (translated.length === 0) {
                setTechnicalTranslation({
                    target,
                    status: 'error',
                    error: tr("Chưa lấy được gợi ý dịch. Bạn có thể tự nhập hoặc thử lại."),
                });
                return;
            }
            setTechnical((current) => (current ? { ...current, [target]: translated } : current));
            setTechnicalTranslation(null);
        } catch (err) {
            if (controller.signal.aborted || axios.isCancel(err)) return;
            const status = axios.isAxiosError(err) ? err.response?.status : undefined;
            setTechnicalTranslation({
                target,
                status: 'error',
                error:
                    status === 429
                        ? tr("Bạn đã dùng hết lượt gợi ý dịch trong giờ này. Vui lòng thử lại sau.")
                        : status === 403
                          ? tr("Tài khoản không có quyền dùng gợi ý dịch.")
                          : tr("Chưa lấy được gợi ý dịch. Bạn có thể tự nhập hoặc thử lại."),
            });
        } finally {
            if (technicalTranslationRequest.current === controller) technicalTranslationRequest.current = null;
        }
    }

    function acceptSuggestion(targetKey: string) {
        const text = suggestions[targetKey]?.text;
        if (!text) return;
        setValues((current) => ({ ...current, [targetKey]: text }));
        dropSuggestion(targetKey);
    }

    function validate(index: number): string {
        if (index === 0) {
            if (
                !values.nameVi?.trim() ||
                !values.nameEn?.trim() ||
                !values.sku?.trim() ||
                !values.category
            )
                return tr("Vui lòng nhập tên tiếng Việt, tên tiếng Anh, SKU và danh mục.");
            if (
                values.nameVi.trim().length > 200 ||
                values.nameEn.trim().length > 200 ||
                values.sku.trim().length > 60
            )
                return tr("Tên sản phẩm tối đa 200 ký tự và SKU tối đa 60 ký tự.");
            if (
                image &&
                (image.size > 5 * 1024 * 1024 ||
                    !['image/jpeg', 'image/png', 'image/webp'].includes(image.type))
            )
                return tr("Ảnh phải là JPG, PNG hoặc WebP và không vượt quá 5 MB.");
        }
        if (index === 1) {
            for (const key of ['netWeight', 'volume', 'length', 'width', 'height']) {
                if (
                    values[key] &&
                    (!Number.isFinite(Number(values[key])) || Number(values[key]) <= 0)
                )
                    return tr("Khối lượng, kích thước và thể tích phải lớn hơn 0.");
            }
            if (
                values.tareWeight &&
                (!Number.isFinite(Number(values.tareWeight)) || Number(values.tareWeight) < 0)
            )
                return tr("Khối lượng bao bì không được âm.");
            if (technical) {
                for (const rows of [technical.vi, technical.en]) {
                    const filled = rows.filter((row) => row.key.trim() || row.value.trim());
                    if (filled.some((row) => !row.key.trim() || !row.value.trim()))
                        return tr("Mỗi dòng thông số cần đủ tên thông số và giá trị.");
                    // Bảng được lưu dạng "Thông số: giá trị | ..." nên tên không chứa ":" và không dòng nào chứa "|".
                    if (filled.some((row) => /[:：|]/.test(row.key) || row.value.includes('|')))
                        return tr("Tên thông số không được chứa dấu hai chấm hoặc dấu |; giá trị không được chứa dấu |.");
                }
            }
            if (nutrition) {
                const rows = nutrition.rows.filter((row) => row.key.trim() || row.value.trim());
                if (rows.some((row) => !row.key.trim() || !row.value.trim()))
                    return tr("Mỗi dòng dinh dưỡng cần đủ thành phần và hàm lượng.");
                if (rows.length > 0 && !nutrition.basis.trim())
                    return tr("Vui lòng nhập lượng tham chiếu cho bảng dinh dưỡng, ví dụ 100g.");
                const names = rows.map((row) => row.key.trim().toLowerCase());
                if (new Set(names).size !== names.length)
                    return tr("Mỗi thành phần dinh dưỡng chỉ được nhập một lần.");
                if (rows.length > 40)
                    return tr("Bảng dinh dưỡng tối đa 40 dòng.");
            }
        }
        if (index === 2) {
            if (
                !values.unit ||
                !values.price?.trim() ||
                !values.vat?.trim() ||
                !values.minOrder?.trim() ||
                !values.quantityStep?.trim()
            )
                return tr("Vui lòng nhập đơn vị, giá, VAT, số lượng tối thiểu và bước số lượng.");
            const price = Number(values.price),
                vat = Number(values.vat),
                min = Number(values.minOrder),
                stepSize = Number(values.quantityStep);
            if (
                ![price, vat, min, stepSize].every(Number.isFinite) ||
                price < 0 ||
                !Number.isInteger(price) ||
                vat < 0 ||
                vat > 100 ||
                min <= 0 ||
                stepSize <= 0 ||
                Math.abs(min / stepSize - Math.round(min / stepSize)) > 1e-8
            )
                return tr("Giá phải là số nguyên không âm, VAT từ 0 đến 100 và số lượng tối thiểu phải chia hết cho bước số lượng.");
            const sorted = [...tiers].sort((a, b) => Number(a.min) - Number(b.min));
            for (let i = 0; i < sorted.length; i++) {
                const tier = sorted[i],
                    low = Number(tier.min),
                    high = tier.max.trim() ? Number(tier.max) : null,
                    tierPrice = Number(tier.price);
                if (
                    !tier.min.trim() ||
                    !tier.price.trim() ||
                    !Number.isFinite(low) ||
                    low <= 0 ||
                    !Number.isFinite(tierPrice) ||
                    !Number.isInteger(tierPrice) ||
                    tierPrice < 0 ||
                    tierPrice > price ||
                    (high != null && (!Number.isFinite(high) || high < low)) ||
                    (i > 0 && (!sorted[i - 1].max.trim() || Number(sorted[i - 1].max) >= low))
                )
                    return tr("Kiểm tra bậc giá: số lượng phải hợp lệ, không chồng lấn và đơn giá không vượt giá niêm yết.");
            }
        }
        return '';
    }

    function go(next: number) {
        if (busy) return;
        for (let i = 0; i < Math.min(next, 3); i++) {
            const problem = validate(i);
            if (problem) {
                setError(problem);
                setStep(i);
                return;
            }
        }
        setError('');
        setStep(next);
    }

    async function createProduct() {
        if (busy || created) return;
        for (let i = 0; i < 3; i++) {
            const problem = validate(i);
            if (problem) {
                setError(problem);
                setStep(i);
                return;
            }
        }
        const optionalNumber = (key: string) => (values[key]?.trim() ? Number(values[key]) : null);
        const nutritionFacts = (nutrition?.rows ?? [])
            .map((row) => ({ nutrient: row.key.trim(), amount: row.value.trim() }))
            .filter((row) => row.nutrient && row.amount);
        const payload = {
            nameVi: values.nameVi.trim(),
            nameEn: values.nameEn.trim(),
            sku: values.sku.trim(),
            categoryId: values.category,
            brandId: values.brand || null,
            origin: values.origin || null,
            descriptionVi: values.descriptionVi || null,
            descriptionEn: values.descriptionEn || null,
            note: values.note || null,
            specVi: values.specVi || null,
            specEn: values.specEn || null,
            netWeight: optionalNumber('netWeight'),
            tareWeight: optionalNumber('tareWeight'),
            volume: optionalNumber('volume'),
            length: optionalNumber('length'),
            width: optionalNumber('width'),
            height: optionalNumber('height'),
            technicalVi: technicalText(technical?.vi),
            technicalEn: technicalText(technical?.en),
            storageVi: values.storageVi || null,
            storageEn: values.storageEn || null,
            complianceVi: values.complianceVi || null,
            complianceEn: values.complianceEn || null,
            originDetailVi: values.originDetailVi || null,
            originDetailEn: values.originDetailEn || null,
            unit: values.unit,
            price: Number(values.price),
            vat: Number(values.vat),
            minOrder: Number(values.minOrder),
            quantityStep: Number(values.quantityStep),
            tiers: tiers.map((tier) => ({
                min: Number(tier.min),
                max: tier.max.trim() ? Number(tier.max) : null,
                price: Number(tier.price),
            })),
            nutritionBasis: nutritionFacts.length ? nutrition?.basis.trim() || null : null,
            nutritionFacts,
        };
        const body = new FormData();
        body.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        if (image) body.append('image', image);
        setBusy(true);
        setError('');
        try {
            const result = await http.post<{ data: { id: string; sku: string } }>(
                '/api/logistics/products',
                body,
            );
            setCreated(result.data.data);
        } catch (err) {
            setError(
                axios.isAxiosError(err) && err.response?.status === 409
                    ? tr("SKU đã tồn tại hoặc dữ liệu bị trùng. Vui lòng kiểm tra lại.")
                    : tr("Không thể tạo sản phẩm. Kiểm tra thông tin và thử lại."),
            );
        } finally {
            setBusy(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([getHomeCategories(controller.signal), getCatalogBrands(controller.signal)])
            .then(([categoryData, brandData]) => {
                setCategories(categoryData);
                setBrands(brandData);
            })
            .catch(() => {
                if (!controller.signal.aborted) setCatalogError(true);
            });
        return () => controller.abort();
    }, []);
    useEffect(
        () => () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        },
        [imagePreview],
    );

    function field(
        key: string,
        label: string,
        options?: { type?: string; placeholder?: string; area?: boolean },
    ) {
        const pair = bilingual[key];
        const props = {
            id: key,
            value: values[key] || '',
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = event.target.value;
                setValues((current) => ({ ...current, [key]: value }));
                // Nội dung nguồn đổi thì gợi ý cũ ở ô bên kia không còn đúng.
                const stale = pair && suggestions[pair.counterpart];
                if (stale && stale.sourceText !== value.trim()) dropSuggestion(pair.counterpart);
            },
            onBlur: pair ? () => suggestAfterBlur(key) : undefined,
            className: inputClass,
            placeholder: options?.placeholder,
        };
        const suggestion = pair ? suggestions[key] : undefined;
        const canSuggest = pair && !!values[pair.counterpart]?.trim();
        return (
            <div className="block text-sm font-semibold">
                <div className="flex items-center justify-between gap-3">
                    <label htmlFor={key}>{label}</label>
                    {canSuggest && suggestion?.status !== 'loading' && (
                        <button
                            type="button"
                            onClick={() => void requestSuggestion(key)}
                            className="inline-flex shrink-0 items-center gap-1 border-0 bg-transparent p-0 text-xs font-semibold text-store-green underline underline-offset-2"
                        >
                            <Sparkles size={13} aria-hidden="true" />
                            {pair.lang === 'en' ? tr("Dịch từ tiếng Việt") : tr("Dịch từ tiếng Anh")}
                        </button>
                    )}
                </div>
                {options?.area ? (
                    <textarea {...props} className={`${inputClass} resize-none`} rows={3} />
                ) : (
                    <input
                        {...props}
                        type={options?.type || 'text'}
                        min={options?.type === 'number' ? '0' : undefined}
                    />
                )}
                {suggestion && (
                    <div
                        className="mt-2 rounded border border-store-line bg-store-cream px-3 py-2 font-normal"
                        role="status"
                        aria-live="polite"
                    >
                        {suggestion.status === 'loading' && (
                            <span className="inline-flex items-center gap-2 text-store-muted">
                                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                                {tr("AI đang gợi ý bản dịch…")}
                            </span>
                        )}
                        {suggestion.status === 'error' && (
                            <span className="flex items-center justify-between gap-3 text-red-700">
                                {suggestion.error}
                                <button
                                    type="button"
                                    onClick={() => dropSuggestion(key)}
                                    className="shrink-0 border-0 bg-transparent p-0 text-xs font-semibold text-black underline"
                                >
                                    {tr("Đóng")}
                                </button>
                            </span>
                        )}
                        {suggestion.status === 'ready' && (
                            <>
                                <p className="flex items-center gap-1 text-xs font-semibold text-store-green">
                                    <Sparkles size={12} aria-hidden="true" /> {tr("Gợi ý từ AI")}
                                </p>
                                <p className="mt-1 whitespace-pre-line text-sm text-black">{suggestion.text}</p>
                                <div className="mt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => acceptSuggestion(key)}
                                        className="rounded bg-store-green px-3 py-1 text-xs font-bold text-white"
                                    >
                                        {values[key]?.trim() ? tr("Thay bằng gợi ý") : tr("Dùng gợi ý")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => dropSuggestion(key)}
                                        className="border-0 bg-transparent p-0 text-xs font-semibold underline"
                                    >
                                        {tr("Bỏ qua")}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }
    function categoryOptions(items: HomeCategory[], depth = 0): ReactNode[] {
        return items.flatMap((category) => [
            <option key={category.id} value={category.id} disabled={depth === 0}>
                {'— '.repeat(depth)}
                {english ? category.nameEn || category.nameVi : category.nameVi}
            </option>,
            ...categoryOptions(category.children || [], depth + 1),
        ]);
    }
    const categoryName = (items: HomeCategory[]): string => {
        for (const category of items) {
            if (category.id === values.category) return english ? category.nameEn || category.nameVi : category.nameVi;
            const child = categoryName(category.children || []);
            if (child) return child;
        }
        return '';
    };
    const unitNames: Record<string, string> = {
        KG: 'kg',
        BOTTLE: 'chai',
        PIECE: tr("cái"),
        PACK: tr("gói"),
        TRAY: 'khay',
        BOX: tr("hộp"),
        BAG: tr("túi"),
        CAN: 'lon',
        TIN: tr("hộp thiếc"),
        TUB: tr("hộp nhựa"),
        CASE: tr("thùng"),
    };

    return (
        <div className="mx-auto max-w-[1200px] space-y-6 text-black">
            <PageNav
                back={{
                    label: request ? tr("Quay lại yêu cầu") : tr("Quay lại nhập hàng"),
                    onClick: onClose,
                    disabled: busy,
                }}
            />
            <div className="flex items-start justify-between gap-6">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-store-green">
                        {request
                            ? tr("Yêu cầu khách hàng / Tạo sản phẩm")
                            : tr("Quản lý kho / Tạo sản phẩm")}
                    </p>
                    <h1 className="mt-2 font-heading text-[34px]">{tr("Tạo sản phẩm mới")}</h1>
                    <p className="mt-2 text-sm text-store-muted">
                        {tr("Điền thông tin sản phẩm theo từng bước.") + ' '}</p>
                </div>
            </div>
            {created ? (
                <div className="rounded-xl border border-green-300 bg-green-50 p-6" role="status">
                    <p className="font-bold text-green-800">{tr("Đã tạo sản phẩm nháp") + ' '}{created.sku}.</p>
                    <p className="mt-2 text-sm text-green-800">
                        {tr("Sản phẩm chưa được đăng bán. Bạn có thể nhập tồn kho cho sản phẩm này.") + ' '}</p>
                    <button
                        type="button"
                        onClick={() => (onCreated ? onCreated(created) : onClose())}
                        className="mt-4 rounded bg-store-green px-4 py-2 font-bold text-white"
                    >
                        {onCreated ? tr("Tiếp tục nhập hàng") : tr("Quay lại yêu cầu")}
                    </button>
                </div>
            ) : (
                <>
                    <div className="rounded-xl border-2 border-black bg-white p-5">
                        <div className="grid grid-cols-4 gap-3">
                            {steps.map((label, index) => (
                                <button
                                    type="button"
                                    key={label}
                                    disabled={busy}
                                    onClick={() => go(index)}
                                    aria-current={step === index ? 'step' : undefined}
                                    className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left ${step === index ? 'border-black bg-store-yellow' : 'border-store-line bg-white'}`}
                                >
                                    <span
                                        className={`grid size-8 shrink-0 place-items-center rounded-full border border-black text-xs font-bold ${index < step ? 'bg-store-green text-white' : 'bg-white'}`}
                                    >
                                        {index < step ? <Check size={16} /> : `0${index + 1}`}
                                    </span>
                                    <span className="text-xs font-semibold">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    {request && (
                        <div className="rounded-lg border border-store-line bg-store-cream px-5 py-4 text-sm">
                            <span className="font-bold">{tr("Yêu cầu đang xử lý:")}</span>{' '}
                            {request.productName}
                            {request.customerNote && (
                                <span className="ml-2 text-store-muted">
                                    · {request.customerNote}
                                </span>
                            )}
                        </div>
                    )}
                    <section className="rounded-xl border-2 border-black bg-white p-7">
                        <p className="text-xs font-bold uppercase tracking-widest text-store-green">
                            {tr("Bước") + ' '}{step + 1} / 4
                        </p>
                        <h2 className="mt-2 font-subheading text-2xl font-bold">{steps[step]}</h2>
                        <p className="mt-1 border-b border-store-line pb-5 text-sm text-store-muted">
                            {
                                [
                                    tr("Nhập những thông tin nhận diện sản phẩm."),
                                    tr("Bổ sung quy cách, bảo quản và nguồn gốc."),
                                    tr("Thiết lập giá bán và số lượng đặt hàng."),
                                    tr("Kiểm tra lại thông tin trước khi hoàn tất."),
                                ][step]
                            }
                        </p>
                        {step === 0 && (
                            <div className="mt-5 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    {field('nameVi', tr("Tên sản phẩm · Tiếng Việt *"))}
                                    {field('nameEn', tr("Tên sản phẩm · Tiếng Anh *"))}
                                    {field('sku', tr("Mã SKU *"))}
                                    <label className="block text-sm font-semibold">
                                        {tr("Danh mục con *") + ' '}<select
                                            value={values.category || ''}
                                            onChange={(e) =>
                                                setValues({ ...values, category: e.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">{tr("Chọn danh mục con")}</option>
                                            {categoryOptions(categories)}
                                        </select>
                                    </label>
                                    <label className="block text-sm font-semibold">
                                        {tr("Thương hiệu") + ' '}<select
                                            value={values.brand || ''}
                                            onChange={(e) =>
                                                setValues({ ...values, brand: e.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">{tr("Không chọn")}</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    {field('origin', tr("Xuất xứ"))}
                                </div>
                                {catalogError && (
                                    <p role="alert" className="text-sm text-red-700">
                                        {tr("Không tải được danh mục hoặc thương hiệu. Vui lòng kiểm tra kết nối.") + ' '}</p>
                                )}
                                <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-black/50 bg-store-cream p-4">
                                    <span className="grid size-12 place-items-center overflow-hidden rounded bg-white">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt={tr("Ảnh sản phẩm đã chọn")}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <ImagePlus size={22} />
                                        )}
                                    </span>
                                    <span className="text-sm">
                                        <strong className="block">{tr("Ảnh sản phẩm")}</strong>
                                        <span className="text-store-muted">
                                            {image
                                                ? image.name
                                                : tr("Chọn ảnh JPG, PNG hoặc WebP (tối đa 5 MB)")}
                                        </span>
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="sr-only"
                                        onChange={(e) => {
                                            const selected = e.target.files?.[0] || null;
                                            setImage(selected);
                                            setImagePreview(
                                                selected ? URL.createObjectURL(selected) : '',
                                            );
                                        }}
                                    />
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {field('descriptionVi', tr("Mô tả · Tiếng Việt"), { area: true })}
                                    {field('descriptionEn', tr("Mô tả · Tiếng Anh"), { area: true })}
                                </div>
                                {field('note', tr("Ghi chú"), { area: true })}
                            </div>
                        )}
                        {step === 1 && (
                            <div className="mt-5 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {field('specVi', tr("Quy cách đóng gói · Tiếng Việt"), {
                                        placeholder: tr("Ví dụ: Bao 10kg"),
                                    })}
                                    {field('specEn', tr("Quy cách đóng gói · Tiếng Anh"), {
                                        placeholder: tr("Ví dụ: 10kg bag"),
                                    })}
                                    {field('netWeight', tr("Khối lượng tịnh (kg)"), { type: 'number' })}
                                    {field('tareWeight', tr("Khối lượng bao bì (kg)"), {
                                        type: 'number',
                                    })}
                                    {field('volume', tr("Thể tích (m³)"), { type: 'number' })}
                                    {field('length', tr("Chiều dài (cm)"), { type: 'number' })}
                                    {field('width', tr("Chiều rộng (cm)"), { type: 'number' })}
                                    {field('height', tr("Chiều cao (cm)"), { type: 'number' })}
                                </div>
                                <div className="space-y-4 border-t border-store-line pt-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold">{tr("Thông số kỹ thuật")}</h3>
                                            <p className="mt-1 text-sm text-store-muted">
                                                {tr("Tùy chọn. Mỗi thông số là một dòng; không nhập lại đơn vị bán, số lượng tối thiểu, khối lượng, kích thước vì đã có ô riêng.")}
                                            </p>
                                        </div>
                                        {technical ? (
                                            <button
                                                type="button"
                                                onClick={() => setTechnical(null)}
                                                className="shrink-0 px-2 py-2 text-sm text-red-700"
                                            >
                                                {tr("Xóa bảng")}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setTechnical({
                                                        vi: [{ key: '', value: '' }],
                                                        en: [{ key: '', value: '' }],
                                                    })
                                                }
                                                className="shrink-0 rounded border border-black px-3 py-2 text-sm font-semibold"
                                            >
                                                {tr("+ Tạo bảng thông số")}
                                            </button>
                                        )}
                                    </div>
                                    {technical && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {(['vi', 'en'] as const).map((lang) => {
                                                const source = lang === 'en' ? 'vi' : 'en';
                                                const canTranslate = !!technicalText(technical[source]);
                                                const translation =
                                                    technicalTranslation?.target === lang ? technicalTranslation : null;
                                                return (
                                                    <div key={lang} className="space-y-2">
                                                        <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                                                            <span>{lang === 'vi' ? tr('Tiếng Việt') : tr('Tiếng Anh')}</span>
                                                            {translation?.status === 'loading' ? (
                                                                <span className="inline-flex items-center gap-1 text-xs font-normal text-store-muted">
                                                                    <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                                                                    {tr("AI đang gợi ý bản dịch…")}
                                                                </span>
                                                            ) : (
                                                                canTranslate && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => void translateTechnical(lang)}
                                                                        className="inline-flex shrink-0 items-center gap-1 border-0 bg-transparent p-0 text-xs font-semibold text-store-green underline underline-offset-2"
                                                                    >
                                                                        <Sparkles size={13} aria-hidden="true" />
                                                                        {lang === 'en' ? tr("Dịch từ tiếng Việt") : tr("Dịch từ tiếng Anh")}
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                        {translation?.status === 'error' && (
                                                            <p role="alert" className="m-0 text-xs text-red-700">
                                                                {translation.error}
                                                            </p>
                                                        )}
                                                        <KeyValueTableEditor
                                                            rows={technical[lang]}
                                                            onChange={(rows) => setTechnical({ ...technical, [lang]: rows })}
                                                            columns={[tr("Thông số"), tr("Giá trị")]}
                                                            maxLengths={[85, 300]}
                                                            addLabel={tr("+ Thêm dòng")}
                                                            removeLabel={tr("Xóa")}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-5 border-t border-store-line pt-5">
                                    {[
                                        ['storage', tr("Bảo quản và sơ chế")],
                                        ['compliance', tr("An toàn thực phẩm và hóa đơn")],
                                        ['originDetail', tr("Thông tin nguồn gốc")],
                                    ].map(([key, label]) => (
                                        <div key={key} className="grid grid-cols-2 gap-4">
                                            {field(`${key}Vi`, `${label} · ${tr('Tiếng Việt')}`, {
                                                area: true,
                                            })}
                                            {field(`${key}En`, `${label} · ${tr('Tiếng Anh')}`, {
                                                area: true,
                                            })}
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4 border-t border-store-line pt-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold">{tr("Thông tin dinh dưỡng")}</h3>
                                            <p className="mt-1 text-sm text-store-muted">
                                                {tr("Tùy chọn. Bảng gồm 2 cột: thành phần dinh dưỡng và hàm lượng.")}
                                            </p>
                                        </div>
                                        {nutrition ? (
                                            <button
                                                type="button"
                                                onClick={() => setNutrition(null)}
                                                className="shrink-0 px-2 py-2 text-sm text-red-700"
                                            >
                                                {tr("Xóa bảng")}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setNutrition({
                                                        basis: '100g',
                                                        rows: [{ key: '', value: '' }],
                                                    })
                                                }
                                                className="shrink-0 rounded border border-black px-3 py-2 text-sm font-semibold"
                                            >
                                                {tr("+ Tạo bảng dinh dưỡng")}
                                            </button>
                                        )}
                                    </div>
                                    {nutrition && (
                                        <>
                                            <label className="block text-sm font-semibold">
                                                {tr("Giá trị ước tính trên")}
                                                <input
                                                    value={nutrition.basis}
                                                    onChange={(e) =>
                                                        setNutrition({ ...nutrition, basis: e.target.value })
                                                    }
                                                    maxLength={100}
                                                    placeholder="100g"
                                                    className={inputClass}
                                                />
                                            </label>
                                            <KeyValueTableEditor
                                                rows={nutrition.rows}
                                                onChange={(rows) => setNutrition({ ...nutrition, rows })}
                                                columns={[tr("Thành phần dinh dưỡng"), tr("Hàm lượng")]}
                                                placeholders={[tr("Ví dụ: Protein"), tr("Ví dụ: 20g")]}
                                                maxLengths={[100, 50]}
                                                addLabel={tr("+ Thêm thành phần")}
                                                removeLabel={tr("Xóa")}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="mt-5 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="block text-sm font-semibold">
                                        {tr("Đơn vị bán *") + ' '}<select
                                            value={values.unit || ''}
                                            onChange={(e) =>
                                                setValues({ ...values, unit: e.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">{tr("Chọn đơn vị")}</option>
                                            {Object.entries(unitNames).map(([code, label]) => (
                                                <option key={code} value={code}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    {field('price', tr("Giá niêm yết (đ) *"), { type: 'number' })}
                                    {field('vat', tr("Thuế suất VAT (%) *"), { type: 'number' })}
                                    {field('minOrder', tr("Số lượng đặt tối thiểu *"), {
                                        type: 'number',
                                    })}
                                    {field('quantityStep', tr("Bước số lượng đặt *"), {
                                        type: 'number',
                                    })}
                                </div>
                                <div className="rounded-lg bg-store-cream p-4 text-sm text-store-muted">
                                    {tr("Giá niêm yết chưa bao gồm VAT. Giá sỉ được áp dụng theo số lượng đủ điều kiện.") + ' '}</div>
                                <div className="flex items-center justify-between border-t border-store-line pt-5">
                                    <h3 className="font-semibold">{tr("Bậc giá sỉ")}</h3>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setTiers([...tiers, { min: '', max: '', price: '' }])
                                        }
                                        className="rounded border border-black px-3 py-2 text-sm font-semibold"
                                    >
                                        {tr("+ Thêm bậc giá") + ' '}</button>
                                </div>
                                {tiers.map((tier, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3"
                                    >
                                        {(['min', 'max', 'price'] as const).map((key, column) => (
                                            <label key={key} className="text-xs font-semibold">
                                                {
                                                    [tr("Từ số lượng"), tr("Đến số lượng"), tr("Đơn giá (đ)")][
                                                        column
                                                    ]
                                                }
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={tier[key]}
                                                    onChange={(e) =>
                                                        setTiers(
                                                            tiers.map((item, i) =>
                                                                i === index
                                                                    ? {
                                                                          ...item,
                                                                          [key]: e.target.value,
                                                                      }
                                                                    : item,
                                                            ),
                                                        )
                                                    }
                                                    className={inputClass}
                                                />
                                            </label>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setTiers(tiers.filter((_, i) => i !== index))
                                            }
                                            className="mb-1 px-2 py-2 text-sm text-red-700"
                                        >
                                            {tr("Xóa") + ' '}</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {step === 3 && (
                            <div className="mt-5 space-y-4 text-sm">
                                <div className="rounded-lg bg-store-cream p-4">
                                    <p className="font-semibold">{tr("Thông tin cơ bản")}</p>
                                    <p className="mt-2">
                                        {values.nameVi || tr("Chưa nhập tên")} ·{' '}
                                        {values.sku || tr("Chưa nhập SKU")}
                                    </p>
                                    <p className="mt-1 text-store-muted">
                                        {tr("Danh mục:") + ' '}{categoryName(categories) || tr("Chưa chọn")} {tr("· Thương hiệu:")}{' '}
                                        {brands.find((brand) => brand.id === values.brand)?.name ||
                                            tr("Chưa chọn")}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-store-cream p-4">
                                    <p className="font-semibold">{tr("Chi tiết sản phẩm")}</p>
                                    <p className="mt-2">
                                        {tr("Quy cách đóng gói:") + ' '}{values.specVi || tr("Chưa nhập")} {tr("· Xuất xứ:")}{' '}
                                        {values.origin || tr("Chưa nhập")}
                                    </p>
                                    <p className="mt-1 text-store-muted">
                                        {tr("Bảo quản:") + ' '}{values.storageVi || tr("Chưa nhập")}
                                    </p>
                                    <p className="mt-1 text-store-muted">
                                        {tr("Thông số kỹ thuật:") + ' '}
                                        {technical?.vi.some((row) => row.key.trim() && row.value.trim())
                                            ? `${technical.vi.filter((row) => row.key.trim() && row.value.trim()).length} ${tr("dòng")}`
                                            : tr("Chưa nhập")}
                                    </p>
                                    <p className="mt-1 text-store-muted">
                                        {tr("Thông tin dinh dưỡng:") + ' '}
                                        {nutrition?.rows.some((row) => row.key.trim() && row.value.trim())
                                            ? `${nutrition.rows.filter((row) => row.key.trim() && row.value.trim()).length} ${tr("thành phần")} · ${nutrition.basis}`
                                            : tr("Chưa nhập")}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-store-cream p-4">
                                    <p className="font-semibold">{tr("Giá & bán hàng")}</p>
                                    <p className="mt-2">
                                        {tr("Giá:")}{' '}
                                        {values.price
                                            ? `${Number(values.price).toLocaleString('vi-VN')} đ`
                                            : tr("Chưa nhập")}{' '}
                                        · VAT: {values.vat ? `${values.vat}%` : tr("Chưa nhập")} {tr("· Đơn vị:") + ' '}{unitNames[values.unit] || tr("Chưa chọn")}
                                    </p>
                                    <p className="mt-1 text-store-muted">
                                        {tiers.length} {tr("bậc giá sỉ") + ' '}</p>
                                </div>
                                <p className="rounded-lg border border-store-line p-4 text-store-muted">
                                    {tr("Sản phẩm sẽ được tạo ở trạng thái nháp và chưa đăng bán.") + ' '}</p>
                            </div>
                        )}
                        {error && (
                            <p
                                role="alert"
                                className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}
                        <div className="mt-7 flex items-center justify-between border-t border-store-line pt-5">
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => (step ? go(step - 1) : onClose())}
                                className="inline-flex items-center gap-2 rounded border border-black px-4 py-3 text-sm font-semibold"
                            >
                                <ArrowLeft size={16} /> {step ? tr("Quay lại") : tr("Đóng")}
                            </button>
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={() => go(step + 1)}
                                    className="inline-flex items-center gap-2 rounded border border-black bg-store-yellow px-5 py-3 text-sm font-bold"
                                >
                                    {tr("Tiếp tục") + ' '}<ArrowRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => void createProduct()}
                                    className="inline-flex items-center gap-2 rounded border border-black bg-store-yellow px-5 py-3 text-sm font-bold disabled:opacity-50"
                                >
                                    <PackagePlus size={16} />{' '}
                                    {busy ? tr("Đang tạo...") : tr("Tạo sản phẩm nháp")}
                                </button>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
