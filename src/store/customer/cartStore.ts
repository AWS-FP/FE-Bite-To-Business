import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

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

export const useCartStore = create<CartStoreState>()(persist((set) => ({
    items: [],
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
}), {
    name: 'bitetobusiness.guest-cart',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ items: state.items }),
}))
