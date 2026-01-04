
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

// FIX: Added 'Cartão (Online)' to support online credit card payments. This resolves the type error in other components.
export type PaymentMethod = 'Cartão (Entrega)' | 'Pix' | 'Dinheiro' | 'Cartão (Online)';

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
    paymentMethod: PaymentMethod;
    changeFor?: number;
    transactionId?: string; // Adicionado para armazenar o ID da transação
}

export type View = 'menu' | 'cart' | 'checkout' | 'status' | 'admin' | 'delivery' | 'history' | 'search';

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
    pixKey?: string;
}