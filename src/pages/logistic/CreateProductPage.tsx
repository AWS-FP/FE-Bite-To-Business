import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductCreateWizard from '@/components/logistic/ProductCreateWizard';
import WarehouseProductPicker from '@/components/logistic/WarehouseProductPicker';
import ListSkeleton from '@/components/common/ListSkeleton';
import { useLogisticsText } from '@/hooks/logistic/useLogisticsText';
import { getEditableProduct } from '@/services/logistic/warehouseProductService';
import { ROUTES } from '@/router/routes';

export default function CreateProductPage() {
    const navigate = useNavigate();
    const { tr } = useLogisticsText();
    const [pickerOpen, setPickerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectionVersion, setSelectionVersion] = useState(0);
    const detail = useQuery({
        queryKey: ['logistics', 'editable-product', selectedId, selectionVersion],
        queryFn: ({ signal }) => getEditableProduct(selectedId!, signal),
        enabled: selectedId !== null,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });
    const createMode = () => setSelectedId(null);
    return <>
        {selectedId && !detail.data ? (
            <div className="mx-auto max-w-[1200px] space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="font-heading text-3xl">{tr('Chỉnh sửa sản phẩm')}</h1>
                    <button type="button" onClick={() => setPickerOpen(true)} className="rounded border border-black bg-white px-4 py-2">{tr('Chọn sản phẩm cần chỉnh sửa')}</button>
                </div>
                {detail.isError ? <p role="alert" className="text-red-700">{tr('Không tải được dữ liệu. Vui lòng thử lại.')}</p> : <ListSkeleton count={6} lines={2} />}
                <button type="button" onClick={createMode} className="rounded border border-black px-4 py-2">{tr('Tạo sản phẩm mới')}</button>
            </div>
        ) : (
            <ProductCreateWizard key={selectedId ? `${selectedId}:${selectionVersion}` : 'create'} product={selectedId ? detail.data : undefined}
                onEdit={() => setPickerOpen(true)} onCreateMode={selectedId ? createMode : undefined}
                onClose={selectedId ? createMode : () => navigate(ROUTES.LOGISTICS_INVENTORY)} />
        )}
        {pickerOpen && <WarehouseProductPicker onClose={() => setPickerOpen(false)} onSelect={id => {
            setSelectedId(id); setSelectionVersion(version => version + 1); setPickerOpen(false);
        }} />}
    </>;
}
