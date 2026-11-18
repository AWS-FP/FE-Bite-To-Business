import { useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, ImagePlus, PackagePlus } from 'lucide-react';
import { getHomeCategories, type HomeCategory } from '@/services/customer/homeService';
import { getCatalogBrands, type CatalogBrand } from '@/services/customer/catalogReadService';
import type { ProductRequest } from '@/hooks/logistic/useLogisticsData';

const steps = ['Thông tin cơ bản', 'Chi tiết sản phẩm', 'Giá & bán hàng', 'Xem lại'];
const inputClass = 'mt-2 w-full rounded border border-black/40 bg-white px-3 py-3 text-sm font-normal text-black outline-none focus:border-black focus:ring-0';

type Props = { request: ProductRequest; onClose: () => void };

export default function ProductCreateWizard({ request, onClose }: Props) {
    const [step, setStep] = useState(0);
    const [values, setValues] = useState<Record<string, string>>({ nameVi: request.productName });
    const [categories, setCategories] = useState<HomeCategory[]>([]);
    const [brands, setBrands] = useState<CatalogBrand[]>([]);
    const [catalogError, setCatalogError] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [tiers, setTiers] = useState<{ min: string; max: string; price: string }[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([getHomeCategories(controller.signal), getCatalogBrands(controller.signal)])
            .then(([categoryData, brandData]) => { setCategories(categoryData); setBrands(brandData); })
            .catch(() => { if (!controller.signal.aborted) setCatalogError(true); });
        return () => controller.abort();
    }, []);
    useEffect(() => {
        if (!image) { setImagePreview(''); return; }
        const url = URL.createObjectURL(image);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    function field(key: string, label: string, options?: { type?: string; placeholder?: string; area?: boolean }) {
        const props = { id: key, value: values[key] || '', onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues({ ...values, [key]: event.target.value }), className: inputClass, placeholder: options?.placeholder };
        return <label htmlFor={key} className="block text-sm font-semibold">{label}{options?.area ? <textarea {...props} rows={3} /> : <input {...props} type={options?.type || 'text'} min={options?.type === 'number' ? '0' : undefined} />}</label>;
    }
    function categoryOptions(items: HomeCategory[], depth = 0): ReactNode[] {
        return items.flatMap((category) => [<option key={category.id} value={category.id}>{'— '.repeat(depth)}{category.nameVi}</option>, ...categoryOptions(category.children || [], depth + 1)]);
    }
    const categoryName = (items: HomeCategory[]): string => {
        for (const category of items) {
            if (category.id === values.category) return category.nameVi;
            const child = categoryName(category.children || []);
            if (child) return child;
        }
        return '';
    };
    const unitNames: Record<string, string> = { KG: 'kg', BOTTLE: 'chai', PIECE: 'cái', PACK: 'gói', TRAY: 'khay', BOX: 'hộp', BAG: 'túi', CAN: 'lon', TIN: 'hộp thiếc', TUB: 'hộp nhựa', CASE: 'thùng' };

    return <div className="mx-auto max-w-[1200px] space-y-6 text-black">
        <button type="button" onClick={onClose} className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"><ArrowLeft size={17} /> Quay lại yêu cầu</button>
        <div className="flex items-start justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-widest text-store-green">Yêu cầu khách hàng / Tạo sản phẩm</p><h1 className="mt-2 font-heading text-[34px]">Tạo sản phẩm mới</h1><p className="mt-2 text-sm text-store-muted">Điền thông tin sản phẩm theo từng bước.</p></div><span className="rounded border border-black bg-store-yellow px-3 py-2 text-xs font-semibold">Xem trước giao diện</span></div>
        <div className="rounded-xl border-2 border-black bg-white p-5"><div className="grid grid-cols-4 gap-3">{steps.map((label, index) => <button type="button" key={label} onClick={() => setStep(index)} aria-current={step === index ? 'step' : undefined} className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left ${step === index ? 'border-black bg-store-yellow' : 'border-store-line bg-white'}`}><span className={`grid size-8 shrink-0 place-items-center rounded-full border border-black text-xs font-bold ${index < step ? 'bg-store-green text-white' : 'bg-white'}`}>{index < step ? <Check size={16} /> : `0${index + 1}`}</span><span className="text-xs font-semibold">{label}</span></button>)}</div></div>
        <div className="rounded-lg border border-store-line bg-store-cream px-5 py-4 text-sm"><span className="font-bold">Yêu cầu đang xử lý:</span> {request.productName}{request.customerNote && <span className="ml-2 text-store-muted">· {request.customerNote}</span>}</div>
        <div className="grid grid-cols-[minmax(0,1fr)_260px] items-start gap-6"><section className="rounded-xl border-2 border-black bg-white p-7"><p className="text-xs font-bold uppercase tracking-widest text-store-green">Bước {step + 1} / 4</p><h2 className="mt-2 font-subheading text-2xl font-bold">{steps[step]}</h2><p className="mt-1 border-b border-store-line pb-5 text-sm text-store-muted">{['Nhập những thông tin nhận diện sản phẩm.', 'Bổ sung quy cách, bảo quản và nguồn gốc.', 'Thiết lập giá bán và số lượng đặt hàng.', 'Kiểm tra lại thông tin trước khi hoàn tất.'][step]}</p>
        {step === 0 && <div className="mt-5 space-y-5"><div className="grid grid-cols-2 gap-4">{field('nameVi', 'Tên sản phẩm · Tiếng Việt *')}{field('nameEn', 'Tên sản phẩm · Tiếng Anh *')}{field('sku', 'Mã SKU *')}
            <label className="block text-sm font-semibold">Danh mục *<select value={values.category || ''} onChange={e => setValues({ ...values, category: e.target.value })} className={inputClass}><option value="">Chọn danh mục</option>{categoryOptions(categories)}</select></label>
            <label className="block text-sm font-semibold">Thương hiệu<select value={values.brand || ''} onChange={e => setValues({ ...values, brand: e.target.value })} className={inputClass}><option value="">Không chọn</option>{brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>{field('origin', 'Xuất xứ')}</div>
            {catalogError && <p role="alert" className="text-sm text-red-700">Không tải được danh mục hoặc thương hiệu. Vui lòng kiểm tra kết nối.</p>}
            <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-black/50 bg-store-cream p-4"><span className="grid size-12 place-items-center overflow-hidden rounded bg-white">{imagePreview ? <img src={imagePreview} alt="Ảnh sản phẩm đã chọn" className="size-full object-cover" /> : <ImagePlus size={22} />}</span><span className="text-sm"><strong className="block">Ảnh sản phẩm</strong><span className="text-store-muted">{image ? image.name : 'Chọn ảnh từ máy tính'}</span></span><input type="file" accept="image/*" className="sr-only" onChange={e => setImage(e.target.files?.[0] || null)} /></label>
            <div className="grid grid-cols-2 gap-4">{field('descriptionVi', 'Mô tả · Tiếng Việt', { area: true })}{field('descriptionEn', 'Mô tả · Tiếng Anh', { area: true })}</div>{field('note', 'Ghi chú', { area: true })}</div>}
        {step === 1 && <div className="mt-5 space-y-6"><div className="grid grid-cols-2 gap-4">{field('specVi', 'Quy cách · Tiếng Việt')}{field('specEn', 'Quy cách · Tiếng Anh')}{field('netWeight', 'Khối lượng tịnh (kg)', { type: 'number' })}{field('tareWeight', 'Khối lượng bao bì (kg)', { type: 'number' })}{field('volume', 'Thể tích (m³)', { type: 'number' })}{field('length', 'Chiều dài (cm)', { type: 'number' })}{field('width', 'Chiều rộng (cm)', { type: 'number' })}{field('height', 'Chiều cao (cm)', { type: 'number' })}</div><div className="space-y-5 border-t border-store-line pt-5">{[['technical', 'Thông số kỹ thuật'], ['storage', 'Bảo quản và sơ chế'], ['compliance', 'An toàn thực phẩm và hóa đơn'], ['originDetail', 'Thông tin nguồn gốc']].map(([key, label]) => <div key={key} className="grid grid-cols-2 gap-4">{field(`${key}Vi`, `${label} · Tiếng Việt`, { area: true })}{field(`${key}En`, `${label} · Tiếng Anh`, { area: true })}</div>)}</div></div>}
        {step === 2 && <div className="mt-5 space-y-5"><div className="grid grid-cols-2 gap-4"><label className="block text-sm font-semibold">Đơn vị bán *<select value={values.unit || ''} onChange={e => setValues({ ...values, unit: e.target.value })} className={inputClass}><option value="">Chọn đơn vị</option>{Object.entries(unitNames).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>{field('price', 'Giá niêm yết (đ) *', { type: 'number' })}{field('vat', 'Thuế suất VAT (%) *', { type: 'number' })}{field('minOrder', 'Số lượng đặt tối thiểu *', { type: 'number' })}{field('quantityStep', 'Bước số lượng đặt *', { type: 'number' })}</div><div className="rounded-lg bg-store-cream p-4 text-sm text-store-muted">Giá niêm yết chưa bao gồm VAT. Giá sỉ được áp dụng theo số lượng đủ điều kiện.</div><div className="flex items-center justify-between border-t border-store-line pt-5"><h3 className="font-semibold">Bậc giá sỉ</h3><button type="button" onClick={() => setTiers([...tiers, { min: '', max: '', price: '' }])} className="rounded border border-black px-3 py-2 text-sm font-semibold">+ Thêm bậc giá</button></div>{tiers.map((tier, index) => <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3">{(['min', 'max', 'price'] as const).map((key, column) => <label key={key} className="text-xs font-semibold">{['Từ số lượng', 'Đến số lượng', 'Đơn giá (đ)'][column]}<input type="number" min="0" value={tier[key]} onChange={e => setTiers(tiers.map((item, i) => i === index ? { ...item, [key]: e.target.value } : item))} className={inputClass} /></label>)}<button type="button" onClick={() => setTiers(tiers.filter((_, i) => i !== index))} className="mb-1 px-2 py-2 text-sm text-red-700">Xóa</button></div>)}</div>}
        {step === 3 && <div className="mt-5 space-y-4 text-sm"><div className="rounded-lg bg-store-cream p-4"><p className="font-semibold">Thông tin cơ bản</p><p className="mt-2">{values.nameVi || 'Chưa nhập tên'} · {values.sku || 'Chưa nhập SKU'}</p><p className="mt-1 text-store-muted">Danh mục: {categoryName(categories) || 'Chưa chọn'} · Thương hiệu: {brands.find(brand => brand.id === values.brand)?.name || 'Chưa chọn'}</p></div><div className="rounded-lg bg-store-cream p-4"><p className="font-semibold">Chi tiết sản phẩm</p><p className="mt-2">Quy cách: {values.specVi || 'Chưa nhập'} · Xuất xứ: {values.origin || 'Chưa nhập'}</p><p className="mt-1 text-store-muted">Bảo quản: {values.storageVi || 'Chưa nhập'}</p></div><div className="rounded-lg bg-store-cream p-4"><p className="font-semibold">Giá & bán hàng</p><p className="mt-2">Giá: {values.price ? `${Number(values.price).toLocaleString('vi-VN')} đ` : 'Chưa nhập'} · VAT: {values.vat ? `${values.vat}%` : 'Chưa nhập'} · Đơn vị: {unitNames[values.unit] || 'Chưa chọn'}</p><p className="mt-1 text-store-muted">{tiers.length} bậc giá sỉ</p></div><p role="status" className="rounded-lg border border-store-line p-4 text-store-muted">Giao diện xem trước: dữ liệu chưa được lưu và sản phẩm chưa được tạo.</p></div>}
        <div className="mt-7 flex items-center justify-between border-t border-store-line pt-5"><button type="button" onClick={() => step ? setStep(step - 1) : onClose()} className="inline-flex items-center gap-2 rounded border border-black px-4 py-3 text-sm font-semibold"><ArrowLeft size={16} /> {step ? 'Quay lại' : 'Đóng'}</button>{step < 3 ? <button type="button" onClick={() => setStep(step + 1)} className="inline-flex items-center gap-2 rounded border border-black bg-store-yellow px-5 py-3 text-sm font-bold">Tiếp tục <ArrowRight size={16} /></button> : <button type="button" disabled className="inline-flex items-center gap-2 rounded border border-black bg-store-yellow px-5 py-3 text-sm font-bold opacity-50"><PackagePlus size={16} /> Tạo sản phẩm</button>}</div></section>
        <aside className="rounded-xl border border-store-line bg-store-cream p-5"><p className="text-xs font-bold uppercase tracking-widest text-store-green">Thông tin cần chuẩn bị</p><p className="mt-4 text-sm leading-6">Tên, mã SKU, danh mục, quy cách, giá và thuế suất giúp sản phẩm sẵn sàng để bán.</p><div className="mt-5 border-t border-black/15 pt-4 text-xs leading-5 text-store-muted">Có thể xem lại từng bước bằng cách chọn mục phía trên.</div></aside></div>
    </div>;
}
