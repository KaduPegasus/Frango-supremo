
import React, { useState, useEffect } from 'react';
import { Order, PaymentMethod, BusinessInfo } from '../types';
import { PagSeguroIcon, CreditCardIcon, PixIcon, XIcon, LinkIcon, CheckCircleIcon } from './IconComponents';
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
    const [activeTab, setActiveTab] = useState<'card' | 'pix'>(
        order.paymentMethod === 'Cartão (Online)' ? 'card' : 'pix'
    );
    const [cardDetails, setCardDetails] = useState<CardDetailsState>({ cardholderName: '', cardNumber: '', expiryDate: '', cvc: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [isConfirmingPix, setIsConfirmingPix] = useState(false);

    // Reset state when modal is opened for a new order
    useEffect(() => {
        if (isOpen) {
            setIsProcessing(false);
            setPaymentError(null);
            setIsConfirmingPix(false);
            setCardDetails({ cardholderName: '', cardNumber: '', expiryDate: '', cvc: '' });
            setActiveTab(order.paymentMethod === 'Cartão (Online)' ? 'card' : 'pix');
        }
    }, [isOpen, order.paymentMethod]);

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

    const handlePixPayment = () => {
        setIsProcessing(true);
        setIsConfirmingPix(true);
        // Simulate waiting for a webhook confirmation from the bank
        setTimeout(() => {
            onPaymentSuccess(`pix_${Date.now()}`);
            setIsProcessing(false);
            setIsConfirmingPix(false);
        }, 3000); // 3-second delay for realism
    };

    const pixKey = businessInfo.pixKey || "Chave Pix não configurada";
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`pix-key:${pixKey},amount:${order.total.toFixed(2)}`)}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixKey).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" aria-modal="true">
            <div className="bg-stone-100 rounded-lg shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-fade-in-up">
                <header className="bg-white p-4 flex justify-between items-center border-b">
                    <div className="flex items-center gap-3">
                        <PagSeguroIcon className="h-8 w-8 text-yellow-500" />
                        <h2 className="text-lg font-bold text-slate-800">Pagamento Seguro</h2>
                    </div>
                    <button onClick={onClose} disabled={isProcessing} className="p-2 rounded-full hover:bg-slate-200 disabled:opacity-50" aria-label="Fechar">
                        <XIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>

                <div className="p-6 bg-white">
                    <div className="flex justify-between items-center text-sm text-slate-600">
                        <span>{order.customerName}</span>
                        <span className="font-bold text-lg text-slate-800">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>

                <div className="flex border-b">
                    <button onClick={() => setActiveTab('card')} className={`flex-1 p-3 text-center font-semibold flex items-center justify-center gap-2 ${activeTab === 'card' ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <CreditCardIcon className="w-5 h-5" /> Cartão
                    </button>
                    <button onClick={() => setActiveTab('pix')} className={`flex-1 p-3 text-center font-semibold flex items-center justify-center gap-2 ${activeTab === 'pix' ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                        <PixIcon className="w-5 h-5" /> Pix
                    </button>
                </div>

                <div className="p-6 min-h-[300px]">
                    {activeTab === 'card' ? (
                        <fieldset disabled={isProcessing}>
                            <CardPaymentForm cardDetails={cardDetails} onCardDetailsChange={setCardDetails} />
                        </fieldset>
                    ) : (
                        isConfirmingPix ? (
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <svg className="animate-spin h-10 w-10 text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <h3 className="font-bold text-slate-800">Aguardando confirmação...</h3>
                                <p className="text-sm text-slate-600 mt-1">Estamos aguardando a confirmação do pagamento pelo seu banco. Isso pode levar alguns segundos.</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h3 className="font-bold text-slate-800">Pague com Pix</h3>
                                <p className="text-sm text-slate-600 mt-1">Aponte a câmera do seu celular para o QR Code ou use o "Copia e Cola".</p>
                                <img src={qrCodeUrl} alt="QR Code para pagamento Pix" className="mx-auto my-4 rounded-lg shadow-md" width="200" height="200" />
                                <div className="relative">
                                    <input type="text" value={pixKey} readOnly className="w-full pl-3 pr-24 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-mono" />
                                    <button onClick={copyToClipboard} className="absolute right-1 top-1/2 -translate-y-1/2 bg-slate-200 text-slate-700 font-semibold py-1.5 px-3 rounded-md hover:bg-slate-300 text-sm flex items-center gap-1">
                                        <LinkIcon className="w-4 h-4" />
                                        {copySuccess || 'Copiar'}
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                     {paymentError && <p className="text-sm text-center font-semibold text-red-600 bg-red-50 p-3 rounded-md mt-4">{paymentError}</p>}
                </div>
                
                <footer className="p-6 border-t bg-stone-50">
                    {activeTab === 'card' ? (
                        <button onClick={handleCardPayment} disabled={isProcessing} className="w-full bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed flex justify-center items-center">
                            {isProcessing ? 'Processando...' : `Pagar R$ ${order.total.toFixed(2).replace('.', ',')}`}
                        </button>
                    ) : (
                         <button onClick={handlePixPayment} disabled={isProcessing || isConfirmingPix} className="w-full bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed">
                           {isConfirmingPix ? 'Aguardando...' : 'Já fiz o pagamento'}
                        </button>
                    )}
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