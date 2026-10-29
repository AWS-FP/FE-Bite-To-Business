export type StockCategory = 'seafood' | 'vegetables' | 'dairy' | 'meat';
export type MovementKind = 'RECEIVE' | 'RESERVE' | 'RELEASE' | 'SHIP';
export type OrderStatus = 'PREPARING' | 'IN_DELIVERY' | 'RELEASED' | 'WAITING';
export type RequestStatus = 'PENDING' | 'SENT';

export interface InventoryItem {
    sku: string;
    name: string;
    category: StockCategory;
    unit: string;
    moq: number;
    onHand: number;
    reserved: number;
}
export interface StockMovement {
    id: string;
    kind: MovementKind;
    sku: string;
    name: string;
    quantity: number;
    actor: string;
    time: string;
    note: string;
}
export interface DeliveryOrder {
    id: string;
    customer: string;
    customerId: string;
    packageCount: number;
    destinations: string;
    note: string;
    status: OrderStatus;
    assignedTo?: string;
}
export interface ProductRequest {
    id: string;
    customer: string;
    business: string;
    customerId: string;
    email: string;
    product: string;
    note: string;
    status: RequestStatus;
    reply?: string;
}
export interface ReceiveInput {
    sku: string;
    quantity: number;
    note: string;
}
