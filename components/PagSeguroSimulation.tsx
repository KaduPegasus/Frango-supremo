
import React, { useState, useEffect } from 'react';
import { Order, BusinessInfo } from '../types';
import { PagSeguroIcon, XIcon } from './IconComponents';
import CardPaymentForm, { CardDetailsState } from './CardPaymentForm';
import { processPayment } from '../services/paymentService';

interface PagSeguroSimulationProps {
    isOpen: boolean;
    order: Omit<Order, 'id' | 'date' | 'status'>;
    businessInfo: BusinessInfo;
    onClose: () => void;
    onPaymentSuccess: (transactionId?: string) => void;
}

const PagSeguroSimulation: React.FC<PagSeguroSimulationProps> = ({ isOpen, order, businessInfo, onClose, onPaymentSuccess }) => {
    const [cardDetails, setCardDetails] = useState<CardDetailsState>({ cardholderName: '', cardNumber: '', expiryDate: '', cvc: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    // Reset state when modal is opened for a new order
    useEffect(() => {
        if (isOpen) {
            setIsProcessing(false);
            setPaymentError(null);
            setCardDetails({ cardholderName: '', cardNumber: '', expiryDate: '', cvc: '' });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCardPayment = async () => {
        setIsProcessing(true);
        setPaymentError(null);
        const response = await processPayment(cardDetails, order.total);
        setIsProcessing(false);
        if (response.success) {
            onPaymentSuccess(response.transactionId);
        } else {
            setPaymentError(response.error || 'Ocorreu um erro desconhecido.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true">
            <div className="bg-stone-100 rounded-lg shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-fade-in-up">
                <header className="bg-white p-4 flex justify-between items-center border-b">
                    <div className="flex items-center gap-3">
                        <PagSeguroIcon className="h-8 w-8 text-yellow-500" />
                        <h2 className="text-lg font-bold text-slate-800">Pagamento com Cartão</h2>
                    </div>
                    <button onClick={onClose} disabled={isProcessing} className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-50" aria-label="Fechar">
                        <XIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>

                <div className="p-6 bg-white border-b">
                    <div className="flex justify-between items-center text-sm text-slate-600">
                        <span>{order.customerName}</span>
                        <span className="font-bold text-lg text-slate-800">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <div className="p-6 min-h-[300px]">
                    <fieldset disabled={isProcessing}>
                        <CardPaymentForm cardDetails={cardDetails} onCardDetailsChange={setCardDetails} />
                    </fieldset>
                    {paymentError && <p className="text-sm text-center font-semibold text-red-600 bg-red-50 p-3 rounded-md mt-4">{paymentError}</p>}
                </div>
                
                <footer className="p-6 border-t bg-stone-50">
                    <button onClick={handleCardPayment} disabled={isProcessing} className="w-full bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed flex justify-center items-center">
                        {isProcessing ? 'Processando...' : `Pagar R$ ${order.total.toFixed(2).replace('.', ',')}`}
                    </button>
                </footer>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PagSeguroSimulation;
