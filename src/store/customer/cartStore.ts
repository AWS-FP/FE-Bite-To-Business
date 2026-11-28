import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    spec: string
    nameVi?: string
    nameEn?: string
    specVi?: string | null
    specEn?: string | null
    unitPrice: number
    quantity: number
    selected?: boolean
    imageUrl?: string
    /** MOQ: the smallest quantity that can be ordered. */
    minOrderQuantity?: number
    /** Quantities go MOQ, MOQ + step, MOQ + 2·step, ... */
    quantityStep?: number
    /** Stock available to sell when last checked; quantities never go above it. */
    maxQuantity?: number | null
}

interface CartStoreState {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => StockLimit | null
    /**
     * Moves the quantity by `steps` order steps (+1 / -1 from the cart buttons).
     * Going below the MOQ removes the item; going above available stock is ignored.
     */
    updateQuantity: (id: string, steps: number) => void
    /** Sets an exact quantity, snapped onto the MOQ/step grid and capped by stock; 0 or less removes the item. */
    setQuantity: (id: string, quantity: number) => void
    /** Refreshes MOQ/step/stock for a line (from the product pricing API). */
    setItemRules: (
        id: string,
        minOrderQuantity: number,
        quantityStep: number,
        maxQuantity?: number | null,
    ) => void
    clear: () => void
    setSelected: (id: string, selected: boolean) => void
    selectAll: (selected: boolean) => void
    removePurchased: (ids: string[]) => void
}

const guestKey = 'bitetobusiness.guest-cart'
const round = (value: number) => Number(value.toFixed(3))

export interface StockLimit { stock: number; inCart: number }

/** Validate the whole addition, including units of this SKU already in the cart. */
export function checkCartStock(item: Pick<CartItem, 'id' | 'minOrderQuantity' | 'quantityStep' | 'maxQuantity'>, quantity: number): StockLimit | null {
    const existing = useCartStore.getState().items.find(line => line.id === item.id)
    const rules = cartRules({ ...existing, ...item, maxQuantity: item.maxQuantity ?? existing?.maxQuantity })
    const inCart = existing?.quantity ?? 0
    if (rules.cap !== null && rules.max !== null && round(inCart + quantity) > rules.cap) {
        return { stock: rules.max, inCart }
    }
    return null
}

export function cartRules(item: Pick<CartItem, 'minOrderQuantity' | 'quantityStep' | 'maxQuantity'>) {
    const min = Math.max(0.001, Number(item.minOrderQuantity) || 1)
    const step = Math.max(0.001, Number(item.quantityStep) || 1)
    const max = item.maxQuantity == null ? null : Math.max(0, Number(item.maxQuantity))
    /** Largest allowed quantity within stock; null when stock is unknown, below MOQ when it cannot be ordered. */
    const cap = max == null ? null : max < min ? 0 : round(min + Math.floor(round((max - min) / step)) * step)
    return { min, step, max, cap }
}

/** Nearest allowed quantity at or above `quantity` (MOQ, MOQ + step, ...), capped by stock. */
function snap(quantity: number, rules: ReturnType<typeof cartRules>) {
    const { min, step, cap } = rules
    const up = quantity <= min ? min : round(min + Math.ceil(round((quantity - min) / step)) * step)
    // Not enough stock even for the MOQ: keep the MOQ so the cart can warn instead of hiding the line.
    if (cap == null || cap < min) return up
    return Math.min(up, cap)
}

/** Allowed quantity one step away in `direction`; below MOQ returns 0, above stock stays put. */
function stepFrom(quantity: number, rules: ReturnType<typeof cartRules>, direction: number) {
    const { min, step, cap } = rules
    const position = (quantity - min) / step
    const index = direction > 0 ? Math.floor(round(position)) + 1 : Math.ceil(round(position)) - 1
    if (index < 0) return 0
    const next = round(min + index * step)
    if (direction > 0 && cap != null && next > cap) return quantity
    return next
}

export const useCartStore = create<CartStoreState>()(persist((set) => ({
    items: [],
    addItem: (newItem, quantity) => {
        const limit = checkCartStock(newItem, quantity)
        if (limit) return limit
        set((state) => {
            const existing = state.items.find((i) => i.id === newItem.id)
            const item = { ...existing, ...newItem, maxQuantity: newItem.maxQuantity ?? existing?.maxQuantity }
            const rules = cartRules(item)
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.id === newItem.id
                            ? { ...item, quantity: snap(i.quantity + quantity, rules) }
                            : i
                    ),
                }
            }
            return {
                items: [{ ...newItem, quantity: snap(quantity, rules) }, ...state.items],
            }
        })
        return null
    },
    updateQuantity: (id, steps) =>
        set((state) => ({
            items: state.items
                .map((item) => {
                    if (item.id !== id || steps === 0) return item
                    const rules = cartRules(item)
                    let quantity = item.quantity
                    for (let i = 0; i < Math.abs(steps) && quantity > 0; i++) {
                        quantity = stepFrom(quantity, rules, Math.sign(steps))
                    }
                    return { ...item, quantity }
                })
                .filter((item) => item.quantity > 0),
        })),
    setQuantity: (id, quantity) =>
        set((state) => ({
            items: state.items
                .map((item) => {
                    if (item.id !== id) return item
                    if (quantity <= 0) return { ...item, quantity: 0 }
                    return { ...item, quantity: snap(quantity, cartRules(item)) }
                })
                .filter((item) => item.quantity > 0),
        })),
    setItemRules: (id, minOrderQuantity, quantityStep, maxQuantity) =>
        set((state) => ({
            items: state.items.map((item) => {
                if (item.id !== id) return item
                const next = {
                    ...item,
                    minOrderQuantity,
                    quantityStep,
                    maxQuantity: maxQuantity === undefined ? item.maxQuantity : maxQuantity,
                }
                return { ...next, quantity: snap(item.quantity, cartRules(next)) }
            }),
        })),
    clear: () => set({ items: [] }),
    setSelected: (id, selected) => set((state) => ({ items: state.items.map((item) => item.id === id ? { ...item, selected } : item) })),
    selectAll: (selected) => set((state) => ({ items: state.items.map((item) => ({ ...item, selected })) })),
    removePurchased: (ids) => set((state) => ({ items: state.items.filter((item) => !ids.includes(item.id)) })),
}), {
    name: guestKey,
    storage: createJSONStorage(() => {
        try {
            return localStorage
        } catch {
            const carts = new Map<string, string>()
            return {
                getItem: (key: string) => carts.get(key) ?? null,
                setItem: (key: string, value: string) => { carts.set(key, value) },
                removeItem: (key: string) => { carts.delete(key) },
            }
        }
    }),
    partialize: (state) => ({ items: state.items }),
    // Re-apply MOQ/step/stock to a saved cart, e.g. a line saved at 100 when only 65 can be sold.
    merge: (persisted, current) => {
        const items = ((persisted as Partial<CartStoreState> | undefined)?.items ?? []).map((item) => ({
            ...item,
            quantity: snap(item.quantity, cartRules(item)),
        }))
        return { ...current, items }
    },
}))

/** Each account has its own browser cart. An overlapping guest line carries its exact quantity. */
export function switchCartOwner(userId: string | null, mergeGuest = false) {
    const key = userId ? `bitetobusiness.cart.${userId}` : guestKey
    const previous = useCartStore.persist.getOptions().name
    if (previous === key) return
    // Another tab may already have consumed the persisted guest cart.
    if (previous === guestKey && mergeGuest) void useCartStore.persist.rehydrate()
    const guest = previous === guestKey && mergeGuest ? useCartStore.getState().items : []
    useCartStore.persist.setOptions({ name: key })
    // createJSONStorage uses synchronous localStorage here.
    void useCartStore.persist.rehydrate()
    if (guest.length) {
        const merged = new Map(useCartStore.getState().items.map(item => [item.id, item]))
        for (const item of guest) merged.set(item.id, item)
        useCartStore.setState({ items: [...merged.values()] })
        useCartStore.persist.getOptions().storage?.removeItem(guestKey)
    }
}
