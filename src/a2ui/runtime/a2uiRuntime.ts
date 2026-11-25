import { MessageProcessor, type ActionPayload } from '@a2ui/web_core/v0_9';
import type { ReactComponentImplementation } from '@a2ui/react/v0_9';
import { ALLOWED_ACTIONS, btbCatalog, BTB_CATALOG_ID } from '../catalog/btbCatalog';
import type { A2uiProduct } from '../catalog/productTypes';
import { trackEvent } from '../telemetry/interactionTracker';

/**
 * Runtime A2UI dùng chung cho khung chat và trang do AI dựng:
 * một MessageProcessor, kiểm tra catalog, lưu data model hợp lệ gần nhất của từng surface,
 * và chuyển action (đã qua allowlist) tới handler của ứng dụng.
 */
export type ActionHandler = (action: ActionPayload, product: A2uiProduct | null) => void;

let actionHandler: ActionHandler | null = null;
let processor: MessageProcessor<ReactComponentImplementation> | null = null;
/** Data model gốc của từng surface, để action tìm lại sản phẩm thật (giá/MOQ/tồn) mà không tin context. */
const surfaceData = new Map<string, unknown>();
/** Message updateComponents gần nhất của từng surface, dùng cho cây widget. */
const surfaceTrees = new Map<string, unknown>();

export function setA2uiActionHandler(handler: ActionHandler | null) {
    actionHandler = handler;
}

export function getProcessor() {
    if (!processor) {
        processor = new MessageProcessor<ReactComponentImplementation>([btbCatalog], (action) => {
            if (!ALLOWED_ACTIONS.has(action.name)) return;
            const product = findProduct(action.surfaceId, action.context?.productId);
            trackEvent('a2ui_action', {
                surfaceId: action.surfaceId,
                component: action.sourceComponentId,
                target:
                    typeof action.context?.productId === 'string'
                        ? action.context.productId
                        : undefined,
                // componentType để BE tính tỷ lệ bấm/hiển thị của từng loại widget (hồ sơ thói quen).
                value: {
                    name: action.name,
                    componentType: componentType(action.surfaceId, action.sourceComponentId),
                },
            });
            actionHandler?.(action, product);
        });
    }
    return processor;
}

/** Đưa message A2UI vào processor; message sai catalog/schema bị bỏ để không làm vỡ giao diện. */
export function applyA2ui(messages: unknown[]): string | undefined {
    let surfaceId: string | undefined;
    for (const message of messages) {
        try {
            const create = (message as { createSurface?: { surfaceId: string; catalogId: string } })
                .createSurface;
            if (create && create.catalogId !== BTB_CATALOG_ID) continue;
            if (create && getProcessor().model.surfacesMap.has(create.surfaceId)) {
                surfaceId = create.surfaceId;
                continue;
            }
            getProcessor().processMessages(message as never);
            surfaceId = create?.surfaceId ?? surfaceId;
            const data = (
                message as {
                    updateDataModel?: { surfaceId: string; path?: string; value?: unknown };
                }
            ).updateDataModel;
            if (data && (!data.path || data.path === '/'))
                surfaceData.set(data.surfaceId, data.value);
            const tree = (message as { updateComponents?: { surfaceId: string } }).updateComponents;
            if (tree) surfaceTrees.set(tree.surfaceId, message);
        } catch (error) {
            console.warn('A2UI message rejected', error);
            trackEvent('a2ui_rejected', { value: { reason: String(error).slice(0, 200) } });
        }
    }
    return surfaceId;
}

export function getSurface(surfaceId: string | undefined) {
    return surfaceId ? getProcessor().model.surfacesMap.get(surfaceId) : undefined;
}

export function getSurfaceTree(surfaceId: string | undefined) {
    return surfaceId ? surfaceTrees.get(surfaceId) : undefined;
}

/** Loại widget (ProductGrid, ProductTable…) của component vừa phát action, tra từ cây updateComponents. */
function componentType(surfaceId: string, componentId: string): string | undefined {
    const tree = surfaceTrees.get(surfaceId) as
        { updateComponents?: { components?: { id: string; component: string }[] } } | undefined;
    return tree?.updateComponents?.components?.find((node) => node.id === componentId)?.component;
}

function findProduct(surfaceId: string, productId: unknown): A2uiProduct | null {
    if (typeof productId !== 'string') return null;
    const stack: unknown[] = [surfaceData.get(surfaceId)];
    while (stack.length) {
        const value = stack.pop();
        if (Array.isArray(value)) stack.push(...value);
        else if (value && typeof value === 'object') {
            if (
                (value as { productId?: unknown }).productId === productId &&
                'minOrderQuantity' in value
            ) {
                return value as A2uiProduct;
            }
            stack.push(...Object.values(value));
        }
    }
    return null;
}
