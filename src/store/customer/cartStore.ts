import { create } from 'zustand'

export interface CartItem {
    id: string
    name: string
    spec: string
    unitPrice: number
    quantity: number
    imageUrl?: string
}

interface CartStoreState {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
    updateQuantity: (id: string, delta: number) => void
}

const DEFAULT_CART_ITEMS: CartItem[] = [
    {
        id: 'cart-salmon-1',
        name: 'Fresh Norwegian Salmon Fillet (Sashimi Cut)',
        spec: 'Whole fish 5-6kg',
        unitPrice: 485000,
        quantity: 1,
        imageUrl: '', // <-- Có thể nhét hình thumbnail giỏ hàng vào đây
    },
    {
        id: 'cart-salmon-2',
        name: 'Fresh Norwegian Salmon Fillet (Sashimi Cut)',
        spec: 'Whole fish 5-6kg',
        unitPrice: 485000,
        quantity: 1,
        imageUrl: '',
    },
    {
        id: 'cart-salmon-3',
        name: 'Fresh Norwegian Salmon Fillet (Sashimi Cut)',
        spec: 'Whole fish 5-6kg',
        unitPrice: 515000,
        quantity: 1,
        imageUrl: '',
    },
]

export const useCartStore = create<CartStoreState>((set) => ({
    items: DEFAULT_CART_ITEMS,
    addItem: (newItem, quantity) =>
        set((state) => {
            const existing = state.items.find((i) => i.id === newItem.id)
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.id === newItem.id ? { ...i, quantity: i.quantity + quantity } : i
                    ),
                }
            }
            return {
                items: [{ ...newItem, quantity }, ...state.items],
            }
        }),
    updateQuantity: (id, delta) =>
        set((state) => ({
            items: state.items
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0),
        })),
}))
