
import React, { useEffect, useRef, useState } from 'react';
import { Order, OrderStatusType } from '../types';
import { MotorcycleIcon, MapPinIcon, ReceiptIcon } from './IconComponents';
import MapViewModal from './MapViewModal';

const NOTIFICATION_SOUND_BASE64 = 'data:audio/mpeg;base64,SUQzBAAAAAABEVTEuAAAAAANIAAAAAAExhdmY1Ni40MC4xMDGkAAAAAAAAAAAAAAD/+2DEAAEAAAAAFLAAAAoAAAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

interface DeliveryViewProps {
    activeOrders: Order[];
    onUpdateStatus: (orderId: string, newStatus: OrderStatusType) => void;
    onBack: () => void;
}

const DeliveryView: React.FC<DeliveryViewProps> = ({ activeOrders, onUpdateStatus, onBack }) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
    const prevOrdersCount = useRef(activeOrders.length);
    const [isMapVisible, setIsMapVisible] = useState(false);
    
    useEffect(() => {
        notificationSoundRef.current = new Audio(NOTIFICATION_SOUND_BASE64);
    }, []);

    useEffect(() => {
        if (activeOrders.length > prevOrdersCount.current) {
            notificationSoundRef.current?.play().catch(e => console.warn("Audio play failed:", e));
        }
        prevOrdersCount.current = activeOrders.length;
    }, [activeOrders.length]);

    // Auto-select the first order if none is selected
    useEffect(() => {
        if (!selectedOrder && activeOrders.length > 0) {
            setSelectedOrder(activeOrders[0]);
        }
        // If selected order is no longer in the active list, clear it
        if (selectedOrder && !activeOrders.find(o => o.id === selectedOrder.id)) {
            setSelectedOrder(activeOrders[0] || null);
        }
    }, [activeOrders, selectedOrder]);


    const handleUpdateAndSelectNext = (orderId: string, status: OrderStatusType) => {
        onUpdateStatus(orderId, status);
        const currentIndex = activeOrders.findIndex(o => o.id === orderId);
        // After updating, the order will be removed from activeOrders list,
        // so we select the one that was next to it.
        const nextOrder = activeOrders[currentIndex + 1] || activeOrders[0] || null;
        setSelectedOrder(nextOrder);
    };

    const renderActionButtons = (order: Order) => {
        switch (order.status) {
            case 'Recebido':
            case 'Em Preparo':
                return (
                    <button 
                        onClick={() => handleUpdateAndSelectNext(order.id, 'Saiu para Entrega')}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <MotorcycleIcon className="w-5 h-5" />
                        Iniciar Entrega
                    </button>
                );
            case 'Saiu para Entrega':
                 return (
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => handleUpdateAndSelectNext(order.id, 'Entregue')}
                            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors"
                        >
                            Confirmar Entrega
                        </button>
                        <button
                            onClick={() => setIsMapVisible(true)}
                            className="w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <MapPinIcon className="w-5 h-5" />
                            Rastrear Pedido
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const OrderDetails: React.FC<{ order: Order }> = ({ order }) => (
        <div className="bg-white rounded-lg shadow-xl p-6 space-y-4">
            <div>
                <h3 className="text-xl font-bold text-red-600">Pedido #{order.id.slice(-5)}</h3>
                <p className="text-lg font-semibold text-slate-800">{order.customerName}</p>
            </div>
            <div className="border-t pt-4">
                <h4 className="font-bold text-slate-700">Endereço de Entrega:</h4>
                <p className="text-slate-600">{order.address}</p>
                 <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address || '')}`} 
                    target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold text-sm"
                >
                    Abrir no Google Maps
                </a>
            </div>
            <div className="border-t pt-4">
                <h4 className="font-bold text-slate-700">Telefone do Cliente:</h4>
                <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline font-semibold">{order.phone}</a>
            </div>
            <div className="border-t pt-4">
                <h4 className="font-bold text-slate-700">Status Atual:</h4>
                <p className="font-bold text-lg text-red-700">{order.status}</p>
            </div>
            <div className="border-t pt-4">
                {renderActionButtons(order)}
            </div>
        </div>
    );
    
    return (
        <>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                 <h2 className="text-3xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                    <MotorcycleIcon className="w-8 h-8"/>
                    Portal do Entregador
                </h2>
                {activeOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                        <h3 className="text-xl font-bold text-slate-800">Nenhum pedido para entrega no momento.</h3>
                        <p className="text-slate-600 mt-2">Aguardando novos pedidos...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 bg-white rounded-lg shadow-xl p-4 h-fit">
                            <h3 className="text-lg font-bold mb-3">Pedidos Pendentes ({activeOrders.length})</h3>
                            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                                {activeOrders.map(order => (
                                    <li key={order.id}>
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className={`w-full text-left p-3 rounded-md transition-colors ${selectedOrder?.id === order.id ? 'bg-red-100 ring-2 ring-red-500' : 'hover:bg-slate-100'}`}
                                        >
                                            <p className="font-bold text-slate-800">Pedido #{order.id.slice(-5)}</p>
                                            <p className="text-sm text-slate-600">{order.customerName}</p>
                                            <p className="text-sm font-semibold text-red-600">{order.status}</p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:col-span-2">
                            {selectedOrder ? (
                                <OrderDetails order={selectedOrder} />
                            ) : (
                                 <div className="bg-white rounded-lg shadow-xl p-8 text-center h-full flex flex-col justify-center items-center">
                                    <ReceiptIcon className="w-16 h-16 text-slate-300 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-800">Selecione um pedido</h3>
                                    <p className="text-slate-600 mt-2">Clique em um pedido na lista para ver os detalhes.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                 <button onClick={onBack} className="btn-secondary w-full sm:w-auto mt-8">
                    Voltar
                </button>
            </div>
            <MapViewModal
                isOpen={isMapVisible}
                onClose={() => setIsMapVisible(false)}
                location={null} // Simplified for this version, pass real location data if available
            />
            <style>{`.btn-secondary { background-color: transparent; border: 2px solid #e7e5e4; color: #44403c; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 0.5rem; transition: background-color 0.2s; } .btn-secondary:hover { background-color: #f5f5f4; }`}</style>
        </>
    );
};

export default DeliveryView;