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
]);

/** Action phía client; phải khớp $defs.BtbAction của catalog BE. */
export const ALLOWED_ACTIONS = new Set([
    'view_product',
    'add_to_cart',
    'refine_search',
    'send_prompt',
    'open_page',
]);
