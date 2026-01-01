
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'Frango' | 'Acompanhamento' | 'Bebida';
    imageUrl: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export type OrderStatusType = 'Recebido' | 'Em Preparo' | 'Pronto para Retirada' | 'Saiu para Entrega' | 'Entregue' | 'Concluído';

export interface Order {
    id: string;
    date: number;
    customerName: string;
    phone: string;
    orderType: 'Retirada' | 'Entrega';
    address?: string;
    notes?: string;
    items: CartItem[];
    total: number;
    status: OrderStatusType;
}

export type View = 'menu' | 'cart' | 'checkout' | 'status' | 'admin' | 'delivery' | 'history';

export interface ComboItem {
    productId: string;
    quantity: number;
}

export interface Combo {
    id: string;
    name: string;
    description: string;
    price: number;
    items: ComboItem[];
    imageUrl: string;
}

export interface BusinessInfo {
    name: string;
    address: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    openingHours: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
}