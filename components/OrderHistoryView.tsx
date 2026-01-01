
import React, { useState } from 'react';
import { Order } from '../types';
import { ReceiptIcon } from './IconComponents';

interface OrderHistoryViewProps {
    orderHistory: Order[];
    onReorder: (order: Order) => void;
    onBack: () => void;
}

const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orderHistory, onReorder, onBack }) => {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };
    
    if (orderHistory.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center max-w-2xl">
                 <div className="bg-white rounded-lg shadow-xl p-8">
                    <ReceiptIcon className="w-16 h-16 mx-auto text-slate-400 mb-4"/>
                    <h2 className="text-3xl font-bold mb-4 text-slate-800">Seu histórico está vazio</h2>
                    <p className="text-slate-600 mb-6">Parece que você ainda não fez nenhum pedido conosco. Que tal começar agora?</p>
                    <button onClick={onBack} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-colors">
                        Ver Cardápio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Meus Pedidos</h2>
            <div className="space-y-4">
                {orderHistory.map(order => (
                    <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <button 
                            onClick={() => toggleOrderDetails(order.id)}
                            className="w-full text-left p-4 flex justify-between items-center hover:bg-amber-50 transition-colors"
                        >
                            <div>
                                <p className="font-bold text-red-600">Pedido #{order.id.slice(-5)}</p>
                                <p className="text-sm text-slate-600">{new Date(order.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-slate-800">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                                <p className={`text-sm font-semibold ${order.status === 'Entregue' ? 'text-green-600' : 'text-slate-500'}`}>{order.status}</p>
                            </div>
                        </button>

                        {expandedOrderId === order.id && (
                            <div className="p-4 border-t border-slate-200 bg-slate-50">
                                <h4 className="font-bold mb-2">Detalhes do Pedido:</h4>
                                <ul className="list-disc list-inside text-slate-700 space-y-1 mb-4">
                                    {order.items.map(item => (
                                        <li key={item.product.id}>{item.quantity}x {item.product.name}</li>
                                    ))}
                                </ul>
                                <div className="text-sm text-slate-600">
                                    <p><strong>Cliente:</strong> {order.customerName}</p>
                                    <p><strong>Tipo:</strong> {order.orderType}</p>
                                    {order.orderType === 'Entrega' && <p><strong>Endereço:</strong> {order.address}</p>}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => onReorder(order)}
                                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                                    >
                                        Pedir Novamente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistoryView;
