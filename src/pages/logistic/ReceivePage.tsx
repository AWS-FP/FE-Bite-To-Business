import Skeleton from '@/components/common/Skeleton';
import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ImageOff, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LogisticsPageShell, { ListStatus } from '@/components/logistic/LogisticsPageShell';
import Pagination from '@/components/common/Pagination';
import ProductCreateWizard from '@/components/logistic/ProductCreateWizard';
import {
    useLogisticsActions,
    useLogisticsList,
    type Stock,
} from '@/hooks/logistic/useLogisticsData';
export default function ReceivePage() {
    const { tr } = useLogisticsText();
    const { i18n } = useTranslation();
    const [search, setSearch] = useState('');
    const [keyword, setKeyword] = useState('');
    const data = useLogisticsList<Stock>('/api/logistics/inventory', keyword);
    const action = useLogisticsActions(data.refresh);
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [success, setSuccess] = useState(false);
    const [creatingProduct, setCreatingProduct] = useState(false);
    const [createdSku, setCreatedSku] = useState('');
    const product = data.items.find((item) => item.productId === productId);
    const unitNames: Record<string, string> =
        i18n.resolvedLanguage === 'en'
            ? {
                  KG: 'kg',
                  G: 'g',
                  BOX: 'box',
                  TRAY: 'tray',
                  PACK: 'pack',
                  BAG: 'bag',
                  CASE: 'case',
                  CAN: 'can',
              }
            : {
                  KG: 'kg',
                  G: 'g',
                  BOX: tr("hộp"),
                  TRAY: 'khay',
                  PACK: tr("gói"),
                  BAG: tr("túi"),
                  CASE: tr("thùng"),
                  CAN: 'lon',
              };
    const unit = product ? unitNames[product.unit] || product.unit : '';
    const movementId = useRef<string | null>(null);
    useEffect(() => {
        const timer = window.setTimeout(() => setKeyword(search.trim()), 350);
        return () => window.clearTimeout(timer);
    }, [search]);
    async function save(event: FormEvent) {
        event.preventDefault();
        if (!product || data.loading || search.trim() !== keyword || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) return;
        movementId.current ??= crypto.randomUUID();
        const saved = await action.submit(`/api/logistics/inventory/${productId}/receipts`, {
            movementId: movementId.current,
            quantity: Number(quantity),
            reason: reason.trim() || null,
        });
        if (saved) {
            setQuantity('');
            setReason('');
            movementId.current = null;
            setSuccess(true);
        }
    }
    function changed() {
        movementId.current = null;
        setSuccess(false);
    }
    if (creatingProduct)
        return (
            <ProductCreateWizard
                onClose={() => setCreatingProduct(false)}
                onCreated={(created) => {
                    setCreatingProduct(false);
                    setSearch(created.sku);
                    data.setPage(0);
                    setKeyword(created.sku);
                    setProductId(created.id);
                    setCreatedSku(created.sku);
                    changed();
                    if (keyword === created.sku) void data.refresh();
                }}
            />
        );
    return (
        <LogisticsPageShell
            number="02"
            label={tr("Quản lý kho")}
            title={tr("Nhập hàng")}
            description={tr("Ghi nhận số lượng sản phẩm nhận vào kho.")}
        >
            <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(300px,1fr)] items-start gap-6">
                <div>
                <form
                    onSubmit={save}
                    className="space-y-4 rounded-xl border-2 border-black bg-white p-6"
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="m-0 text-sm text-store-muted">
                            {tr("Chọn sản phẩm có sẵn hoặc thêm sản phẩm mới.") + ' '}</p>
                        <button
                            type="button"
                            onClick={() => setCreatingProduct(true)}
                            className="rounded border border-black bg-store-yellow px-4 py-2 text-sm font-bold hover:opacity-90"
                        >
                            {tr("+ Thêm sản phẩm mới") + ' '}</button>
                    </div>
                    {createdSku && (
                        <p role="status" className="rounded bg-green-50 p-3 text-sm text-green-800">
                            {tr("Đã tạo sản phẩm nháp") + ' '}{createdSku}{tr(". Nhập số lượng và chọn “Nhập hàng” để ghi nhận tồn kho.") + ' '}</p>
                    )}
                    <label className="block font-bold">
                        {tr("Tìm sản phẩm") + ' '}<input
                            value={search}
                            maxLength={200}
                            onChange={(e) => {
                                data.setPage(0);
                                setSearch(e.target.value);
                                setProductId('');
                                setCreatedSku('');
                                changed();
                            }}
                            placeholder={tr("Nhập tên sản phẩm hoặc mã SKU")}
                            className="mt-2 w-full rounded border p-3 font-normal"
                        />
                    </label>
                    <ListStatus
                        loading={false}
                        error={data.loading ? '' : data.error}
                        empty={!data.loading && data.items.length === 0}
                    />
                    <label className="block font-bold">
                        {tr("Sản phẩm") + ' '}{data.loading ? <Skeleton className="mt-2 h-[50px] w-full" /> : <select
                            required
                            disabled={data.loading || search.trim() !== keyword}
                            value={productId}
                            onChange={(e) => {
                                setProductId(e.target.value);
                                changed();
                            }}
                            className="mt-2 w-full rounded border p-3 font-normal"
                        >
                            <option value="">{tr("Chọn sản phẩm")}</option>
                            {data.items.map((item) => (
                                <option key={item.productId} value={item.productId}>
                                    {item.name} · {item.sku}
                                </option>
                            ))}
                        </select>}
                    </label>
                    <label className="block font-bold">
                        {tr("Số lượng") + ' '}{unit && (
                            <span className="ml-2 text-sm font-normal text-store-muted">
                                ({unit})
                            </span>
                        )}
                        <input
                            required
                            type="number"
                            min="1"
                            step="1"
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(e.target.value);
                                changed();
                            }}
                            placeholder={
                                unit ? `${tr('Nhập số lượng')} (${unit})` : tr("Chọn sản phẩm để xem đơn vị")
                            }
                            className="mt-2 w-full rounded border p-3 font-normal"
                        />
                    </label>
                    <label className="block font-bold">
                        {tr("Ghi chú") + ' '}<input
                            maxLength={1000}
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                changed();
                            }}
                            className="mt-2 w-full rounded border p-3 font-normal"
                        />
                    </label>
                    {action.error && (
                        <p role="alert" className="text-red-700">
                            {action.error}
                        </p>
                    )}
                    {success && (
                        <p role="status" className="text-green-700">
                            {tr("Đã ghi nhận nhập hàng.") + ' '}</p>
                    )}
                    <button
                        disabled={action.busy}
                        className="rounded bg-store-green px-5 py-3 font-bold text-white transition-colors hover:bg-store-dark disabled:opacity-50"
                    >
                        {action.busy ? tr("Đang lưu...") : tr("Nhập hàng")}
                    </button>
                </form>
                <Pagination page={data.page} totalPages={data.totalPages} loading={data.loading}
                    onPageChange={page => { setProductId(''); changed(); data.setPage(page); }} />
                </div>
                <section className="flex flex-col gap-5 rounded-xl border-2 border-black bg-white p-6">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-lg bg-store-cream text-store-green">
                            <Package size={20} aria-hidden="true" />
                        </span>
                        <h2 className="font-subheading text-lg font-bold">{tr("Thông tin sản phẩm")}</h2>
                    </div>
                    {product ? (
                        <div className="space-y-4">
                            <div className="flex h-52 items-center justify-center overflow-hidden rounded-lg bg-store-cream">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-store-muted">
                                        <ImageOff size={32} aria-hidden="true" />
                                        <span className="text-sm">{tr("Chưa có ảnh sản phẩm")}</span>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-subheading text-lg font-bold">{product.name}</h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4 border-b border-store-line pb-3">
                                    <dt className="text-store-muted">{tr("Mã SKU")}</dt>
                                    <dd className="text-right font-semibold">{product.sku}</dd>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-store-line pb-3">
                                    <dt className="text-store-muted">{tr("Đơn vị nhập")}</dt>
                                    <dd className="font-semibold">{unit}</dd>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-store-line pb-3">
                                    <dt className="text-store-muted">{tr('Trong kho')}</dt>
                                    <dd className="font-semibold">
                                        {product.onHand.toLocaleString('vi-VN')} {unit}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4 border-b border-store-line pb-3">
                                    <dt className="text-store-muted">{tr("Đã giữ")}</dt>
                                    <dd className="font-semibold">
                                        {product.reserved.toLocaleString('vi-VN')} {unit}
                                    </dd>
                                </div>
                                {/* Same rule as the DB's available_quantity: on hand minus reserved. */}
                                <div className="flex justify-between gap-4">
                                    <dt className="text-store-muted">{tr("Có thể bán")}</dt>
                                    <dd className="font-bold text-store-green">
                                        {Math.max(
                                            0,
                                            Math.round((product.onHand - product.reserved) * 1000) / 1000,
                                        ).toLocaleString('vi-VN')}{' '}
                                        {unit}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    ) : (
                        <p className="rounded-lg bg-store-cream p-6 text-sm text-store-muted">
                            {tr("Chọn sản phẩm để xem hình ảnh và thông tin.") + ' '}</p>
                    )}
                </section>
            </div>
        </LogisticsPageShell>
    );
}
