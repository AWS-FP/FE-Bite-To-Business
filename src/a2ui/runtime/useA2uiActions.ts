import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/router/routes';
import { useCartStore } from '@/store/customer/cartStore';
import { getCatalogSearchPath, getCategoryPagePath } from '@/constants/catalogNavigation';
import { setA2uiActionHandler } from './a2uiRuntime';
import { useAssistantStore } from './assistantStore';

const PAGES: Record<string, string> = {
    catalog: ROUTES.CATALOG,
    cart: ROUTES.QUOTES,
    orders: ROUTES.ORDERS,
    favorites: ROUTES.FAVORITES,
    profile: ROUTES.PROFILE,
    brands: ROUTES.BRANDS,
};

export const aiPagePath = (prompt: string) => `/ai?q=${encodeURIComponent(prompt.trim())}`;

/**
 * Nối action A2UI (đã qua allowlist) vào luồng thật của web: router, giỏ hàng, trợ lý.
 * Surface trang (page-*) nhận yêu cầu mới bằng cách dựng lại trang; surface chat gửi tiếp vào khung chat.
 */
export function useA2uiActions() {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'vi';

    useEffect(() => {
        setA2uiActionHandler((action, product) => {
            const context = action.context ?? {};
            const onPage = action.surfaceId.startsWith('page-');
            const prompt = (text: string) =>
                onPage
                    ? navigate(aiPagePath(text))
                    : void useAssistantStore.getState().send(text, locale);
            switch (action.name) {
                case 'view_product':
                    if (typeof context.productId === 'string')
                        navigate(`/products/${context.productId}`);
                    break;
                case 'add_to_cart': {
                    // Giá/tồn lấy từ data model BE vừa gửi; giỏ hàng kiểm tra lại khi tạo báo giá.
                    const note = (text: string) =>
                        onPage ? window.alert(text) : useAssistantStore.getState().note(text);
                    if (!product || product.listPrice == null) {
                        note('Chưa thêm được: sản phẩm chưa có giá.');
                        break;
                    }
                    const price =
                        product.saleActive && product.salePrice != null
                            ? product.salePrice
                            : product.listPrice;
                    useCartStore.getState().addItem(
                        {
                            id: product.productId,
                            name: product.name,
                            spec: product.spec ?? product.unitCode,
                            unitPrice: price,
                            imageUrl: product.imageUrl ?? undefined,
                            minOrderQuantity: product.minOrderQuantity,
                            quantityStep: product.quantityStep,
                            maxQuantity: product.availableQuantity ?? null,
                        },
                        Number(context.quantity) || product.minOrderQuantity,
                    );
                    if (!onPage)
                        note(`Đã thêm ${product.name} vào giỏ. Bạn chỉnh số lượng trong giỏ hàng.`);
                    break;
                }
                case 'refine_search':
                    if (typeof context.q === 'string') prompt(context.q);
                    else if (onPage) navigate(getCatalogSearchPath(''));
                    break;
                case 'send_prompt':
                    if (typeof context.text === 'string') prompt(context.text);
                    break;
                case 'open_page':
                    if (typeof context.page === 'string' && PAGES[context.page])
                        navigate(PAGES[context.page]);
                    break;
                case 'open_category':
                    if (typeof context.code === 'string' && context.code)
                        navigate(getCategoryPagePath(context.code));
                    break;
            }
        });
        return () => setA2uiActionHandler(null);
    }, [navigate, locale]);
}
