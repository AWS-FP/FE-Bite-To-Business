import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
import { useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, ImagePlus, PackagePlus } from 'lucide-react';
import { getHomeCategories, type HomeCategory } from '@/services/customer/homeService';
import { getCatalogBrands, type CatalogBrand } from '@/services/customer/catalogReadService';
import type { ProductRequest } from '@/hooks/logistic/useLogisticsData';
import { http } from '@/services/axiosClient';
import axios from 'axios';

const inputClass =
    'mt-2 w-full rounded border border-black/40 bg-white px-3 py-3 text-sm font-normal text-black outline-none focus:border-black focus:ring-0';

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
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [created, setCreated] = useState<{ id: string; sku: string } | null>(null);

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
            technicalVi: values.technicalVi || null,
            technicalEn: values.technicalEn || null,
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
        const props = {
            id: key,
            value: values[key] || '',
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setValues({ ...values, [key]: event.target.value }),
            className: inputClass,
            placeholder: options?.placeholder,
        };
        return (
            <label htmlFor={key} className="block text-sm font-semibold">
                {label}
                {options?.area ? (
                    <textarea {...props} className={`${inputClass} resize-none`} rows={3} />
                ) : (
                    <input
                        {...props}
                        type={options?.type || 'text'}
                        min={options?.type === 'number' ? '0' : undefined}
                    />
                )}
            </label>
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
            <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="inline-flex items-center gap-2 border-0 bg-transparent p-0 text-[17px] font-bold underline underline-offset-4 disabled:opacity-50"
            >
                <ArrowLeft size={17} /> {request ? tr("Quay lại yêu cầu") : tr("Quay lại nhập hàng")}
            </button>
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
                                    {field('specVi', tr("Quy cách · Tiếng Việt"))}
                                    {field('specEn', tr("Quy cách · Tiếng Anh"))}
                                    {field('netWeight', tr("Khối lượng tịnh (kg)"), { type: 'number' })}
                                    {field('tareWeight', tr("Khối lượng bao bì (kg)"), {
                                        type: 'number',
                                    })}
                                    {field('volume', tr("Thể tích (m³)"), { type: 'number' })}
                                    {field('length', tr("Chiều dài (cm)"), { type: 'number' })}
                                    {field('width', tr("Chiều rộng (cm)"), { type: 'number' })}
                                    {field('height', tr("Chiều cao (cm)"), { type: 'number' })}
                                </div>
                                <div className="space-y-5 border-t border-store-line pt-5">
                                    {[
                                        ['technical', tr("Thông số kỹ thuật")],
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
                                        {tr("Quy cách:") + ' '}{values.specVi || tr("Chưa nhập")} {tr("· Xuất xứ:")}{' '}
                                        {values.origin || tr("Chưa nhập")}
                                    </p>
                                    <p className="mt-1 text-store-muted">
                                        {tr("Bảo quản:") + ' '}{values.storageVi || tr("Chưa nhập")}
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
