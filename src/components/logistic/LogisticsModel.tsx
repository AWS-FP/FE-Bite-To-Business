import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEMO_INVENTORY, DEMO_MOVEMENTS, DEMO_ORDERS, DEMO_REQUESTS } from '../../constants/logistic/demoData';
import type { DeliveryOrder, InventoryItem, ProductRequest, ReceiveInput, StockMovement } from '../../types/logistic/logistics.ts';

type Language = 'vi' | 'en';
interface LogisticsContextValue {
    inventory: InventoryItem[];
    movements: StockMovement[];
    orders: DeliveryOrder[];
    requests: ProductRequest[];
    language: Language;
    setLanguage: (language: Language) => void;
    receiveOpen: boolean;
    setReceiveOpen: (open: boolean) => void;
    receiveSku: string;
    openReceive: (sku?: string) => void;
    dispatchId: string | null;
    setDispatchId: (id: string | null) => void;
    replyId: string | null;
    setReplyId: (id: string | null) => void;
    receiveStock: (input: ReceiveInput) => void;
    assignDispatch: (orderId: string, assignedTo: string, notes: string) => void;
    sendReply: (requestId: string, reply: string) => void;
    resetDemo: () => void;
}
const LogisticsContext = createContext<LogisticsContextValue | null>(null);
const timestamp = () => new Date().toLocaleString('vi-VN', { hour12: false });

export function LogisticsProvider({ children }: { children: ReactNode }) {
    const [inventory, setInventory] = useState<InventoryItem[]>(() => DEMO_INVENTORY.map(x => ({ ...x })));
    const [movements, setMovements] = useState<StockMovement[]>(() => DEMO_MOVEMENTS.map(x => ({ ...x })));
    const [orders, setOrders] = useState<DeliveryOrder[]>(() => DEMO_ORDERS.map(x => ({ ...x })));
    const [requests, setRequests] = useState<ProductRequest[]>(() => DEMO_REQUESTS.map(x => ({ ...x })));
    const [language, setLanguage] = useState<Language>('vi');
    const [receiveOpen, setReceiveOpen] = useState(false);
    const [receiveSku, setReceiveSku] = useState(DEMO_INVENTORY[0].sku);
    const [dispatchId, setDispatchId] = useState<string | null>(null);
    const [replyId, setReplyId] = useState<string | null>(null);

    function openReceive(sku = '') {
        setReceiveSku(sku || DEMO_INVENTORY[0].sku);
        setReceiveOpen(true);
    }
    function receiveStock({ sku, quantity, note }: ReceiveInput) {
        if (!Number.isSafeInteger(quantity) || quantity <= 0) return;
        const selected = inventory.find(item => item.sku === sku);
        if (!selected) return;
        setInventory(current => current.map(item => item.sku === sku ? { ...item, onHand: item.onHand + quantity } : item));
        setMovements(current => [{ id: `MOV-DEMO-${Date.now()}`, kind: 'RECEIVE', sku, name: selected.name, quantity, actor: 'Trần Đức Minh (NV-002)', time: timestamp(), note: note || 'Nhập kho trực tiếp (demo)' }, ...current]);
        setReceiveOpen(false);
    }
    function assignDispatch(orderId: string, assignedTo: string, notes: string) {
        setOrders(current => current.map(order => order.id === orderId ? { ...order, assignedTo, status: 'IN_DELIVERY', note: notes || order.note } : order));
        setDispatchId(null);
    }
    function sendReply(requestId: string, reply: string) {
        setRequests(current => current.map(request => request.id === requestId ? { ...request, reply, status: 'SENT' } : request));
        setReplyId(null);
    }
    function resetDemo() {
        setInventory(DEMO_INVENTORY.map(x => ({ ...x })));
        setMovements(DEMO_MOVEMENTS.map(x => ({ ...x })));
        setOrders(DEMO_ORDERS.map(x => ({ ...x })));
        setRequests(DEMO_REQUESTS.map(x => ({ ...x })));
    }
    const value = useMemo(() => ({ inventory, movements, orders, requests, language, setLanguage, receiveOpen, setReceiveOpen, receiveSku, openReceive, dispatchId, setDispatchId, replyId, setReplyId, receiveStock, assignDispatch, sendReply, resetDemo }), [inventory, movements, orders, requests, language, receiveOpen, receiveSku, dispatchId, replyId]);
    return <LogisticsContext.Provider value={value}>{children}</LogisticsContext.Provider>;
}
export function useLogistics() {
    const value = useContext(LogisticsContext);
    if (!value) throw new Error('useLogistics must be used inside LogisticsProvider');
    return value;
}
