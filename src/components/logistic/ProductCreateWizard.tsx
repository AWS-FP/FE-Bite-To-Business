import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, ImagePlus, Loader2, PackagePlus, Sparkles } from 'lucide-react';
import {
    suggestTranslation,
    translationErrorKey,
    type TranslationField,
    type TranslationLanguage,
} from '@/services/logistic/translationService';
import { getHomeCategories, type HomeCategory } from '@/services/customer/homeService';
import { getCatalogBrands, type CatalogBrand } from '@/services/customer/catalogReadService';
import type { ProductRequest } from '@/hooks/logistic/useLogisticsData';
import { http } from '@/services/axiosClient';
import axios from 'axios';
import PageNav from '@/components/common/PageNav';
import BilingualNutritionEditor, { type NutritionRow } from './BilingualNutritionEditor';
import {
    getCountries,
    getDistributors,
    type CountryOption,
    type DistributorOption,
} from '@/services/logistic/productSourceService';

const inputClass =
    'mt-2 w-full rounded border border-black/40 bg-white px-3 py-3 text-sm font-normal text-black outline-none focus:border-black focus:ring-0';

// Các cặp ô song ngữ: AI gợi ý bản dịch từ ô đã nhập sang ô còn lại.
const BILINGUAL_FIELDS: [string, TranslationField][] = [
    ['name', 'NAME'],
    ['description', 'DESCRIPTION'],
    ['spec', 'SPEC'],
    ['storage', 'STORAGE'],
];
const bilingual: Record<string, { counterpart: string; lang: TranslationLanguage; field: TranslationField }> =
    Object.fromEntries(
        BILINGUAL_FIELDS.flatMap(([base, field]) => [
            [`${base}Vi`, { counterpart: `${base}En`, lang: 'vi', field }],
            [`${base}En`, { counterpart: `${base}Vi`, lang: 'en', field }],
        ]),
    );

type Suggestion = { status: 'loading' | 'ready' | 'error'; sourceText: string; text?: string; error?: string };

type Lang = TranslationLanguage;

// Nhãn "Quy cách bán" trong chuỗi technical_content; trang sản phẩm tách chuỗi này thành một dòng của bảng.
const SELLING_SPEC_LABEL: Record<Lang, string> = { vi: 'Quy cách bán', en: 'Selling spec' };

// Ô văn bản tự do tối đa 150 chữ (đếm theo khoảng trắng) để đoạn hiển thị không phá bố cục.
const MAX_TEXT_WORDS = 150;
const FREE_TEXT_FIELDS: Record<number, string[]> = { 0: ['descriptionVi', 'descriptionEn', 'note'], 1: ['storageVi', 'storageEn'] };
function countWords(text: string | undefined): number {
    return text?.trim() ? text.trim().split(/\s+/).length : 0;
}

// Tô đỏ dấu * của ô bắt buộc, kể cả khi nhãn đã được dịch.
function requiredLabel(text: string): ReactNode {
    const parts = text.split(' *');
    return parts.flatMap((part, i) =>
        i < parts.length - 1
            ? [part, <span key={i} className="text-red-600"> *</span>]
            : [part],
    );
}

type Props = {
    request?: ProductRequest;
    onClose: () => void;
    onCreated?: (product: { id: string; sku: string }) => void;
};

export default function ProductCreateWizard({ request, onClose, onCreated }: Props) {
    const { tr, english } = useLogisticsText();
    const staffLang: Lang = english ? 'en' : 'vi';
    const steps = [tr("Thông tin cơ bản"), tr("Chi tiết sản phẩm"), tr("Giá & bán hàng"), tr("Xem lại")];
    const [step, setStep] = useState(0);
    const [values, setValues] = useState<Record<string, string>>({
        nameVi: request?.productName.replace(/^Yêu cầu quy cách mới:\s*/i, '').trim() || '',
    });
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [brands, setBrands] = useState<CatalogBrand[]>([]);
    const [distributors, setDistributors] = useState<DistributorOption[]>([]);
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [countriesError, setCountriesError] = useState(false);
    const [catalogError, setCatalogError] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [tiers, setTiers] = useState<{ min: string; max: string; price: string }[]>([]);
    // Bảng dinh dưỡng (bắt buộc): lượng tham chiếu + các dòng VI/EN đồng bộ.
    const [nutrition, setNutrition] = useState<{ basis: string; rows: NutritionRow[] }>({
        basis: '100g',
        rows: [{ vi: '', en: '', amount: '' }],
    });
    // Dịch tên thành phần dinh dưỡng sang ngôn ngữ còn lại bằng AI.
    const [nutritionTranslation, setNutritionTranslation] = useState<{
        target: Lang;
        status: 'loading' | 'error';
        error?: string;
    } | null>(null);
    const nutritionTranslationRequest = useRef<AbortController | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [created, setCreated] = useState<{ id: string; sku: string } | null>(null);
    const [suggestions, setSuggestions] = useState<Record<string, Suggestion>>({});
    const suggestionRequests = useRef<Record<string, AbortController>>({});

    useEffect(() => {
        const pending = suggestionRequests.current;
        const nutritionRequest = nutritionTranslationRequest;
        return () => {
            Object.values(pending).forEach((controller) => controller.abort());
            nutritionRequest.current?.abort();
        };
    }, []);

    const translationError = (err: unknown): string => tr(translationErrorKey(err));

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
            const message = translationError(err);
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

    // Dịch tên các thành phần dinh dưỡng từ bảng kia sang `target` (một lần gọi cho cả bảng).
    async function translateNutrition(target: Lang) {
        const source: Lang = target === 'en' ? 'vi' : 'en';
        const names = nutrition.rows.map((row) => row[source].trim());
        if (!names.some(Boolean)) return;
        nutritionTranslationRequest.current?.abort();
        const controller = new AbortController();
        nutritionTranslationRequest.current = controller;
        setNutritionTranslation({ target, status: 'loading' });
        try {
            const text = await suggestTranslation(names.join(' | '), source, 'TECHNICAL', controller.signal);
            if (controller.signal.aborted) return;
            const translated = text.split('|').map((name) => name.trim());
            if (translated.length !== names.length) {
                setNutritionTranslation({ target, status: 'error', error: tr(translationErrorKey(null)) });
                return;
            }
            setNutrition((current) => ({
                ...current,
                rows: current.rows.map((row, i) => (names[i] ? { ...row, [target]: translated[i] } : row)),
            }));
            setNutritionTranslation(null);
        } catch (err) {
            if (controller.signal.aborted || axios.isCancel(err)) return;
            setNutritionTranslation({ target, status: 'error', error: translationError(err) });
        } finally {
            if (nutritionTranslationRequest.current === controller) nutritionTranslationRequest.current = null;
        }
    }

    // "Quy cách bán" nhập một lần theo ngôn ngữ của staff; khi tạo sản phẩm, AI dịch sang ngôn ngữ còn lại.
    async function sellingSpecTexts(): Promise<Record<Lang, string>> {
        const value = values.sellingSpec.trim();
        const other: Lang = staffLang === 'vi' ? 'en' : 'vi';
        let translated = value;
        try {
            translated = (await suggestTranslation(value, staffLang, 'TECHNICAL')).trim() || value;
        } catch {
            // Không dịch được thì dùng nguyên văn để không chặn việc tạo sản phẩm.
        }
        const texts = { [staffLang]: value, [other]: translated } as Record<Lang, string>;
        return {
            vi: `${SELLING_SPEC_LABEL.vi}: ${texts.vi.replace(/\|/g, '/')}`,
            en: `${SELLING_SPEC_LABEL.en}: ${texts.en.replace(/\|/g, '/')}`,
        };
    }

    function acceptSuggestion(targetKey: string) {
        const text = suggestions[targetKey]?.text;
        if (!text) return;
        setValues((current) => ({ ...current, [targetKey]: text }));
        dropSuggestion(targetKey);
    }

    function validate(index: number): string {
        if ((FREE_TEXT_FIELDS[index] ?? []).some((key) => countWords(values[key]) > MAX_TEXT_WORDS))
            return tr("Mỗi ô mô tả, ghi chú hoặc bảo quản tối đa 150 chữ.");
        if (index === 0) {
            if (
                !values.nameVi?.trim() ||
                !values.nameEn?.trim() ||
                !values.sku?.trim() ||
                !values.category ||
                !values.origin ||
                !values.distributor ||
                !values.brand ||
                !values.descriptionVi?.trim() ||
                !values.descriptionEn?.trim()
            )
                return tr("Vui lòng nhập tên, SKU, danh mục, thương hiệu, xuất xứ, nhà phân phối và mô tả (tiếng Việt và tiếng Anh).");
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
            // Bước "Chi tiết sản phẩm": mọi thông tin đều bắt buộc.
            const required = [
                'specVi', 'specEn', 'unit', 'minOrder', 'sellingSpec', 'netWeight', 'tareWeight',
                'length', 'width', 'height', 'volume', 'storageVi', 'storageEn', 'vat',
            ];
            if (required.some((key) => !values[key]?.trim()))
                return tr("Vui lòng nhập đủ mọi thông tin ở bước Chi tiết sản phẩm.");
            for (const key of ['netWeight', 'volume', 'length', 'width', 'height', 'minOrder']) {
                if (!Number.isFinite(Number(values[key])) || Number(values[key]) <= 0)
                    return tr("Khối lượng, kích thước, thể tích và số lượng tối thiểu phải lớn hơn 0.");
            }
            if (!Number.isFinite(Number(values.tareWeight)) || Number(values.tareWeight) < 0)
                return tr("Khối lượng bao bì không được âm.");
            if (!Number.isFinite(Number(values.vat)) || Number(values.vat) < 0 || Number(values.vat) > 100)
                return tr("Thuế suất VAT phải từ 0 đến 100%.");
            if (!nutrition.basis.trim())
                return tr("Vui lòng nhập lượng tham chiếu cho bảng dinh dưỡng, ví dụ 100g.");
            if (nutrition.rows.length === 0)
                return tr("Bảng dinh dưỡng cần ít nhất một thành phần.");
            if (nutrition.rows.some((row) => !row.vi.trim() || !row.en.trim() || !row.amount.trim()))
                return tr("Mỗi dòng dinh dưỡng cần đủ tên tiếng Việt, tên tiếng Anh và hàm lượng.");
            for (const lang of ['vi', 'en'] as const) {
                const names = nutrition.rows.map((row) => row[lang].trim().toLowerCase());
                if (new Set(names).size !== names.length)
                    return tr("Mỗi thành phần dinh dưỡng chỉ được nhập một lần.");
            }
        }
        if (index === 2) {
            if (!values.price?.trim() || !values.quantityStep?.trim())
                return tr("Vui lòng nhập giá và số lượng tăng thêm mỗi lần đặt.");
            const price = Number(values.price),
                min = Number(values.minOrder),
                stepSize = Number(values.quantityStep);
            if (
                ![price, min, stepSize].every(Number.isFinite) ||
                price < 0 ||
                !Number.isInteger(price) ||
                min <= 0 ||
                stepSize <= 0 ||
                Math.abs(min / stepSize - Math.round(min / stepSize)) > 1e-8
            )
                return tr("Giá phải là số nguyên không âm và số lượng tối thiểu phải chia hết cho số lượng tăng thêm mỗi lần đặt.");
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
        const nutritionFacts = nutrition.rows.map((row) => ({
            nutrient: row.vi.trim(),
            nutrientEn: row.en.trim(),
            amount: row.amount.trim(),
        }));
        setBusy(true);
        setError('');
        const sellingSpec = await sellingSpecTexts();
        const payload = {
            nameVi: values.nameVi.trim(),
            nameEn: values.nameEn.trim(),
            sku: values.sku.trim(),
            categoryId: values.category,
            brandId: values.brand,
            distributorId: values.distributor,
            origin: values.origin,
            descriptionVi: values.descriptionVi.trim(),
            descriptionEn: values.descriptionEn.trim(),
            note: values.note || null,
            specVi: values.specVi || null,
            specEn: values.specEn || null,
            netWeight: optionalNumber('netWeight'),
            tareWeight: optionalNumber('tareWeight'),
            volume: optionalNumber('volume'),
            length: optionalNumber('length'),
            width: optionalNumber('width'),
            height: optionalNumber('height'),
            technicalVi: sellingSpec.vi,
            technicalEn: sellingSpec.en,
            storageVi: values.storageVi || null,
            storageEn: values.storageEn || null,
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
            nutritionBasis: nutrition.basis.trim(),
            nutritionFacts,
        };
        const body = new FormData();
        body.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        if (image) body.append('image', image);
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
        Promise.all([
            getHomeCategories(controller.signal),
            getCatalogBrands(controller.signal),
            getDistributors(controller.signal),
        ])
            .then(([categoryData, brandData, distributorData]) => {
                setCategories(categoryData);
                setBrands(brandData);
                setDistributors(distributorData);
            })
            .catch(() => {
                if (!controller.signal.aborted) setCatalogError(true);
            });
        return () => controller.abort();
    }, []);
    // Danh sách quốc gia cho ô Xuất xứ (API bên ngoài, tải riêng để lỗi không chặn phần còn lại).
    useEffect(() => {
        const controller = new AbortController();
        getCountries(controller.signal)
            .then(setCountries)
            .catch(() => {
                if (!controller.signal.aborted) setCountriesError(true);
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
                    <label htmlFor={key}>{requiredLabel(label)}</label>
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
                    <>
                        <textarea {...props} className={`${inputClass} resize-none`} rows={3} />
                        <span
                            className={`mt-1 block text-right text-xs font-normal ${countWords(values[key]) > MAX_TEXT_WORDS ? 'text-red-600' : 'text-store-muted'}`}
                        >
                            {countWords(values[key])}/{MAX_TEXT_WORDS} {tr("chữ")}
                        </span>
                    </>
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
    const cellInputClass =
        'w-full rounded border border-black/40 bg-white px-3 py-2 text-sm font-normal text-black outline-none focus:border-black focus:ring-0';
    const numberCell = (key: string, label: string, placeholder?: string) => (
        <input
            type="number"
            min="0"
            aria-label={label}
            placeholder={placeholder}
            value={values[key] || ''}
            onChange={(e) => setValues((current) => ({ ...current, [key]: e.target.value }))}
            className={cellInputClass}
        />
    );
    // 7 thông số kỹ thuật cố định; nhãn theo ngôn ngữ staff đang chọn ở language switcher.
    const specRows: { label: string; input: ReactNode }[] = [
        {
            label: tr("Đơn vị bán"),
            input: (
                <select
                    aria-label={tr("Đơn vị bán")}
                    value={values.unit || ''}
                    onChange={(e) => setValues((current) => ({ ...current, unit: e.target.value }))}
                    className={cellInputClass}
                >
                    <option value="">{tr("Chọn đơn vị")}</option>
                    {Object.entries(unitNames).map(([code, label]) => (
                        <option key={code} value={code}>
                            {label}
                        </option>
                    ))}
                </select>
            ),
        },
        { label: tr("Số lượng đặt tối thiểu"), input: numberCell('minOrder', tr("Số lượng đặt tối thiểu")) },
        {
            label: tr("Quy cách bán"),
            input: (
                <input
                    aria-label={tr("Quy cách bán")}
                    maxLength={200}
                    placeholder={tr("Ví dụ: Thùng 24 lon")}
                    value={values.sellingSpec || ''}
                    onChange={(e) => setValues((current) => ({ ...current, sellingSpec: e.target.value }))}
                    className={cellInputClass}
                />
            ),
        },
        { label: tr("Khối lượng tịnh (kg)"), input: numberCell('netWeight', tr("Khối lượng tịnh (kg)")) },
        { label: tr("Khối lượng bao bì (kg)"), input: numberCell('tareWeight', tr("Khối lượng bao bì (kg)")) },
        {
            label: tr("Kích thước D × R × C (cm)"),
            input: (
                <div className="grid grid-cols-3 gap-2">
                    {numberCell('length', tr("Chiều dài (cm)"), tr("Dài"))}
                    {numberCell('width', tr("Chiều rộng (cm)"), tr("Rộng"))}
                    {numberCell('height', tr("Chiều cao (cm)"), tr("Cao"))}
                </div>
            ),
        },
        { label: tr("Thể tích (m³)"), input: numberCell('volume', tr("Thể tích (m³)")) },
    ];

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
                        <h2 className="font-subheading text-2xl font-bold">{steps[step]}</h2>
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
                                        {requiredLabel(tr("Danh mục con *"))}{' '}<select
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
                                        {requiredLabel(tr("Thương hiệu *"))}{' '}<select
                                            value={values.brand || ''}
                                            onChange={(e) =>
                                                setValues({ ...values, brand: e.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">{tr("Chọn thương hiệu")}</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block text-sm font-semibold">
                                        {requiredLabel(tr("Xuất xứ *"))}{' '}<select
                                            value={values.origin || ''}
                                            onChange={(e) =>
                                                setValues({ ...values, origin: e.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">
                                                {countries.length || countriesError
                                                    ? tr("Chọn quốc gia")
                                                    : tr("Đang tải danh sách quốc gia…")}
                                            </option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.value}>
                                                    {english ? country.nameEn : country.nameVi}
                                                </option>
                                            ))}
                                        </select>
                                        {countriesError && (
                                            <span role="alert" className="mt-1 block text-xs font-normal text-red-700">
                                                {tr("Không tải được danh sách quốc gia. Vui lòng tải lại trang.")}
                                            </span>
                                        )}
                                    </label>
                                    <label className="block text-sm font-semibold">
                                        {requiredLabel(tr("Nhà phân phối *"))}{' '}<select
                                            value={values.distributor || ''}
                                            onChange={(e) =>
                                                setValues({ ...values, distributor: e.target.value })
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">{tr("Chọn nhà phân phối")}</option>
                                            {distributors.map((distributor) => (
                                                <option key={distributor.id} value={distributor.id}>
                                                    {distributor.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
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
                                    {field('descriptionVi', tr("Mô tả · Tiếng Việt *"), { area: true })}
                                    {field('descriptionEn', tr("Mô tả · Tiếng Anh *"), { area: true })}
                                </div>
                                {field('note', tr("Ghi chú"), { area: true })}
                            </div>
                        )}
                        {step === 1 && (
                            <div className="mt-5 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {field('specVi', tr("Quy cách đóng gói · Tiếng Việt *"), {
                                        placeholder: tr("Ví dụ: Bao 10kg"),
                                    })}
                                    {field('specEn', tr("Quy cách đóng gói · Tiếng Anh *"), {
                                        placeholder: tr("Ví dụ: 10kg bag"),
                                    })}
                                </div>
                                <div className="space-y-3 border-t border-store-line pt-5">
                                    <h3 className="font-semibold">{requiredLabel(tr("Thông số kỹ thuật *"))}</h3>
                                    {/* Bảng cố định 7 dòng: cột thông số theo ngôn ngữ đang chọn, staff chỉ nhập cột giá trị. */}
                                    <div className="overflow-hidden rounded border border-black/40">
                                        <table className="w-full table-fixed border-collapse text-sm">
                                            <thead className="bg-store-cream">
                                                <tr>
                                                    <th scope="col" className="w-[38%] px-3 py-2 text-left font-semibold">
                                                        {tr("Thông số")}
                                                    </th>
                                                    <th scope="col" className="px-3 py-2 text-left font-semibold">
                                                        {tr("Giá trị")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {specRows.map((row) => (
                                                    <tr key={row.label} className="border-t border-black/10">
                                                        <th scope="row" className="px-3 py-2 text-left align-middle font-medium">
                                                            {row.label}
                                                        </th>
                                                        <td className="px-2 py-2">{row.input}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="space-y-5 border-t border-store-line pt-5">
                                    {[
                                        ['storage', tr("Bảo quản và sơ chế")],
                                    ].map(([key, label]) => (
                                        <div key={key} className="grid grid-cols-2 gap-4">
                                            {field(`${key}Vi`, `${label} · ${tr('Tiếng Việt')} *`, {
                                                area: true,
                                            })}
                                            {field(`${key}En`, `${label} · ${tr('Tiếng Anh')} *`, {
                                                area: true,
                                            })}
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 border-t border-store-line pt-5">
                                    <h3 className="font-semibold">{tr("An toàn thực phẩm và VAT")}</h3>
                                    <div className="max-w-xs">
                                        {field('vat', tr("Thuế suất VAT (%) *"), { type: 'number', placeholder: '8' })}
                                    </div>
                                    <p className="m-0 text-sm text-store-muted">
                                        {tr("Trang sản phẩm hiển thị đoạn an toàn thực phẩm và VAT theo mẫu chuẩn, chỉ thay số % này.")}
                                    </p>
                                </div>
                                <div className="space-y-4 border-t border-store-line pt-5">
                                    <div>
                                        <h3 className="font-semibold">{requiredLabel(tr("Thông tin dinh dưỡng *"))}</h3>
                                        <p className="mt-1 text-sm text-store-muted">
                                            {tr("Hai bảng tiếng Việt và tiếng Anh luôn cùng số dòng; hàm lượng dùng chung cho cả hai.")}
                                        </p>
                                    </div>
                                    <label className="block text-sm font-semibold">
                                        {tr("Giá trị ước tính trên")}
                                        <input
                                            value={nutrition.basis}
                                            onChange={(e) => setNutrition({ ...nutrition, basis: e.target.value })}
                                            maxLength={100}
                                            placeholder="100g"
                                            className={inputClass}
                                        />
                                    </label>
                                    <BilingualNutritionEditor
                                        rows={nutrition.rows}
                                        onChange={(rows) => setNutrition({ ...nutrition, rows })}
                                        labels={{
                                            heading: { vi: tr('Tiếng Việt'), en: tr('Tiếng Anh') },
                                            nutrient: { vi: 'Thành phần dinh dưỡng', en: 'Nutrient' },
                                            amount: { vi: 'Hàm lượng', en: 'Amount' },
                                            addRow: tr("+ Thêm thành phần"),
                                            remove: tr("Xóa"),
                                            nutrientPlaceholder: { vi: 'Ví dụ: Chất đạm', en: 'e.g. Protein' },
                                            amountPlaceholder: '20g',
                                        }}
                                        headerExtra={(lang) => {
                                            const source = lang === 'en' ? 'vi' : 'en';
                                            const translation =
                                                nutritionTranslation?.target === lang ? nutritionTranslation : null;
                                            if (translation?.status === 'loading')
                                                return (
                                                    <span className="inline-flex items-center gap-1 text-xs font-normal text-store-muted">
                                                        <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                                                        {tr("AI đang gợi ý bản dịch…")}
                                                    </span>
                                                );
                                            return (
                                                <span className="flex flex-col items-end gap-1">
                                                    {nutrition.rows.some((row) => row[source].trim()) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => void translateNutrition(lang)}
                                                            className="inline-flex shrink-0 items-center gap-1 border-0 bg-transparent p-0 text-xs font-semibold text-store-green underline underline-offset-2"
                                                        >
                                                            <Sparkles size={13} aria-hidden="true" />
                                                            {lang === 'en' ? tr("Dịch từ tiếng Việt") : tr("Dịch từ tiếng Anh")}
                                                        </button>
                                                    )}
                                                    {translation?.status === 'error' && (
                                                        <span role="alert" className="text-xs font-normal text-red-700">
                                                            {translation.error}
                                                        </span>
                                                    )}
                                                </span>
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="mt-5 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    {field('price', tr("Giá niêm yết (đ) *"), { type: 'number' })}
                                    <div>
                                        {field('quantityStep', tr("Số lượng tăng thêm mỗi lần đặt *"), {
                                            type: 'number',
                                        })}
                                        <p className="mt-1 text-xs text-store-muted">
                                            {tr("Ví dụ: tối thiểu 5, tăng thêm 5 thì khách đặt được 5, 10, 15…")}
                                        </p>
                                    </div>
                                </div>
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
                                        {tr("Quy cách bán:") + ' '}{values.sellingSpec || tr("Chưa nhập")} {tr("· Nhà phân phối:")}{' '}
                                        {distributors.find((item) => item.id === values.distributor)?.name || tr("Chưa chọn")}
                                    </p>
                                    <p className="mt-1 text-store-muted">
                                        {tr("Thông tin dinh dưỡng:") + ' '}
                                        {`${nutrition.rows.length} ${tr("thành phần")} · ${nutrition.basis}`}
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
