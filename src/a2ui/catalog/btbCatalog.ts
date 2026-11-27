/**
 * Thư viện widget (registry) mà AI được phép ghép: 6 component cơ bản lấy từ SDK A2UI v0.9 + widget nghiệp vụ
 * (sản phẩm, trang, cá nhân). MessageProcessor từ chối mọi component không có ở đây.
 * Danh sách phải khớp catalog JSON Schema ở BE (a2ui/catalog/bite-to-business.catalog.json).
 */
import { Catalog } from '@a2ui/web_core/v0_9';
import { Button, Card, Column, Divider, Row, Text } from '@a2ui/react/v0_9';
import {
    ClarifyQuestion,
    InventoryBadge,
    Notice,
    PriceTiers,
    ProductCard,
    ProductGrid,
    ProductTable,
    SuggestedPrompts,
} from './btbComponents';
import {
    BannerCarousel,
    CategoryGrid,
    ComboList,
    PageHeader,
    ProductCarousel,
    PromotionList,
    Section,
} from './pageComponents';
import { CartSummary, ReorderList } from './personalComponents';
import { ProductFacts } from './factsComponents';
import { NutritionTable } from './nutritionComponents';
import { LayoutGrid, ProductList, ProductSpotlight } from './compositionComponents';

/** Phải trùng catalogId trong Generate-UI-BE/src/main/resources/ai/catalog.json. */
export const BTB_CATALOG_ID = 'https://bite2business.cloud/a2ui/catalogs/bite-to-business/v1.json';

/** Component AI được phép dùng; message có component khác bị SDK từ chối. */
export const btbCatalog = new Catalog(BTB_CATALOG_ID, 'v0.9', [
    Text,
    Row,
    Column,
    Card,
    Divider,
    Button,
    ProductGrid,
    ProductTable,
    ProductCard,
    PriceTiers,
    InventoryBadge,
    Notice,
    ClarifyQuestion,
    SuggestedPrompts,
    PageHeader,
    Section,
    ProductCarousel,
    BannerCarousel,
    CategoryGrid,
    ComboList,
    PromotionList,
    ReorderList,
    CartSummary,
    ProductFacts,
    NutritionTable,
    LayoutGrid,
    ProductList,
    ProductSpotlight,
]);

/** Action phía client; phải khớp $defs.BtbAction của catalog BE. */
export const ALLOWED_ACTIONS = new Set([
    'view_product',
    'add_to_cart',
    'refine_search',
    'send_prompt',
    'open_page',
    'open_category',
]);
