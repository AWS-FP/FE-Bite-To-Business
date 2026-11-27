export type StablePage = { layout: unknown; lists: Record<string, string[]>; locale: 'vi' | 'en' };

/** Store only structural selections. The server reloads public product data and validates the layout. */
export function createStablePage(messages: unknown[], locale: 'vi' | 'en'): StablePage | undefined {
    let model: Record<string, unknown> | undefined;
    let layout: Record<string, unknown> | undefined;
    for (const value of messages) {
        if (!value || typeof value !== 'object') continue;
        const message = value as Record<string, unknown>;
        if (message.updateDataModel && typeof message.updateDataModel === 'object')
            model = (message.updateDataModel as { value?: Record<string, unknown> }).value;
        if (message.updateComponents) layout = message;
    }
    if (!model || !layout) return;
    const paths = new Set<string>();
    function visit(value: unknown) {
        if (Array.isArray(value)) value.forEach(visit);
        else if (value && typeof value === 'object') {
            const object = value as Record<string, unknown>;
            if (typeof object.path === 'string') {
                const path = object.path.replace(/\/\d+$/, '');
                if (
                    /^\/(products|favorites|recentlyViewed|forYou|reorder|categories|home\/(featured|bestSelling|deepDiscount|topRated|flashSale|combos|banners|promotions))$/.test(
                        path,
                    )
                )
                    paths.add(path);
            }
            Object.values(object).forEach(visit);
        }
    }
    visit(layout);
    const lists: Record<string, string[]> = {};
    for (const path of paths) {
        let value: unknown = model;
        for (const key of path.slice(1).split('/'))
            value = (value as Record<string, unknown> | undefined)?.[key];
        if (!Array.isArray(value)) continue;
        lists[path] = value
            .map((row: Record<string, unknown>) => String(row.productId ?? row.id ?? row.code))
            .slice(0, 20);
    }
    return Object.keys(lists).length ? { layout, lists, locale } : undefined;
}
