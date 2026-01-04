
import React, { useState } from 'react';
import { Order, OrderStatusType, BusinessInfo } from '../types';
import { CheckCircleIcon, PixIcon, LinkIcon } from './IconComponents';

interface OrderStatusProps {
    order: Order;
    onNewOrder: () => void;
    businessInfo: BusinessInfo;
}

const getStatusForOrderType = (orderType: 'Retirada' | 'Entrega'): OrderStatusType[] => {
    if (orderType === 'Retirada') {
        return ['Recebido', 'Em Preparo', 'Pronto para Retirada', 'Concluído'];
    }
    // For 'Entrega'
    return ['Recebido', 'Em Preparo', 'Saiu para Entrega', 'Entregue'];
};

const PixInstructions: React.FC<{ pixKey: string }> = ({ pixKey }) => {
    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixKey).then(() => {
            setCopySuccess('Chave copiada!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Falha ao copiar.');
        });
    };

    return (
        <div className="bg-sky-50 border-l-4 border-sky-500 p-4 mt-6 text-left">
            <div className="flex items-start gap-3">
                <PixIcon className="w-8 h-8 text-sky-600 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-sky-800">Instruções para Pagamento com Pix</h4>
                    <p className="text-sm text-sky-700 mt-1">
                        Para confirmar seu pedido, realize a transferência para a chave abaixo e, se possível,
                        envie o comprovante para nosso WhatsApp.
                    </p>
                    <div className="mt-3 flex flex-col sm:flex-row gap-2 items-center">
                        <input
                            type="text"
                            value={pixKey}
                            readOnly
                            className="w-full sm:w-auto flex-grow px-3 py-2 bg-white border border-sky-300 rounded-md shadow-sm"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="w-full sm:w-auto bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
                        >
                           <LinkIcon className="w-4 h-4" />
                           {copySuccess || 'Copiar Chave'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const OrderStatus: React.FC<OrderStatusProps> = ({ order, onNewOrder, businessInfo }) => {
    const applicableStatuses = getStatusForOrderType(order.orderType);
    const currentStatusIndex = applicableStatuses.indexOf(order.status);
    const progressPercentage = applicableStatuses.length > 1 
        ? (currentStatusIndex / (applicableStatuses.length - 1)) * 100 
        : (currentStatusIndex > 0 ? 100 : 0);
    
    const isPixPaymentPending = order.paymentMethod === 'Pix' && !order.transactionId;
    const isPixConfigured = businessInfo.pixKey && businessInfo.pixKey.trim() !== '' && businessInfo.pixKey !== 'seu-email-pix-aqui';

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="bg-white rounded-xl shadow-xl p-8 text-center">
                <h2 className="text-3xl font-extrabold text-green-600 mb-2 flex items-center justify-center gap-3">
                    <CheckCircleIcon className="w-9 h-9" />
                    Pedido Confirmado!
                </h2>
                <p className="text-stone-600 mb-8">Obrigado, {order.customerName}! Seu pedido <span className="font-bold">#{order.id.slice(-5)}</span> está sendo preparado.</p>

                {isPixPaymentPending && isPixConfigured && <PixInstructions pixKey={businessInfo.pixKey!} />}

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
                    <div className="space-y-2 text-stone-700">
                        <div className="flex justify-between">
                            <span>Forma de Pagamento:</span>
                            <span className="font-medium">{order.paymentMethod}</span>
                        </div>
                        {order.paymentMethod === 'Dinheiro' && order.changeFor && (
                             <div className="flex justify-between">
                                <span>Troco para:</span>
                                <span className="font-medium">R$ {order.changeFor.toFixed(2).replace('.', ',')}</span>
                            </div>
                        )}
                        {order.transactionId && (
                             <div className="flex justify-between text-sm">
                                <span>ID da Transação:</span>
                                <span className="font-mono text-stone-500">{order.transactionId}</span>
                            </div>
                        )}
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