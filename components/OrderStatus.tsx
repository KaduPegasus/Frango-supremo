
import React from 'react';
import { Order, OrderStatusType } from '../types';
import { CheckCircleIcon } from './IconComponents';

interface OrderStatusProps {
    order: Order;
    onNewOrder: () => void;
}

const getStatusForOrderType = (orderType: 'Retirada' | 'Entrega'): OrderStatusType[] => {
    if (orderType === 'Retirada') {
        return ['Recebido', 'Em Preparo', 'Pronto para Retirada', 'Concluído'];
    }
    return ['Recebido', 'Em Preparo', 'Saiu para Entrega', 'Entregue', 'Concluído'];
};

const OrderStatus: React.FC<OrderStatusProps> = ({ order, onNewOrder }) => {
    const applicableStatuses = getStatusForOrderType(order.orderType);
    const currentStatusIndex = applicableStatuses.indexOf(order.status);
    const progressPercentage = applicableStatuses.length > 1 
        ? (currentStatusIndex / (applicableStatuses.length - 1)) * 100 
        : (currentStatusIndex > 0 ? 100 : 0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="bg-white rounded-xl shadow-xl p-8 text-center">
                <h2 className="text-3xl font-extrabold text-green-600 mb-2 flex items-center justify-center gap-3">
                    <CheckCircleIcon className="w-9 h-9" />
                    Pedido Confirmado!
                </h2>
                <p className="text-stone-600 mb-8">Obrigado, {order.customerName}! Seu pedido <span className="font-bold">#{order.id.slice(-5)}</span> está sendo preparado.</p>

                <div className="my-10">
                    <div className="relative w-full">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -translate-y-1/2"></div>
                        <div 
                            className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                        <div className="relative flex justify-between">
                            {applicableStatuses.map((status, index) => (
                                <div key={status} className="flex flex-col items-center z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${index <= currentStatusIndex ? 'bg-red-600' : 'bg-stone-300'}`}>
                                        {index <= currentStatusIndex && (
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                        )}
                                    </div>
                                    <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors duration-500 ${index <= currentStatusIndex ? 'text-red-600' : 'text-stone-500'}`}>{status}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-left bg-stone-50 rounded-lg p-6 mt-12">
                    <h3 className="font-bold text-lg mb-4 text-stone-800">Resumo do Pedido</h3>
                    <div className="space-y-2 text-stone-700">
                        {order.items.map(item => (
                             <div key={item.product.id} className="flex justify-between">
                                <span>{item.quantity}x {item.product.name}</span>
                                <span className="font-medium">R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t my-4"></div>
                     <div className="flex justify-between font-bold text-lg text-stone-900">
                        <span>Total</span>
                        <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <button
                    onClick={onNewOrder}
                    className="mt-10 bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                >
                    Fazer Novo Pedido
                </button>
            </div>
        </div>
    );
};

export default OrderStatus;